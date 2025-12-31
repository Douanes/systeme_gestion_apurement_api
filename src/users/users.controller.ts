import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    HttpCode,
    HttpStatus,
    ParseIntPipe,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import {
    CreateSystemUserDto,
    CreateTransitStaffDto,
    UpdateUserDto,
    UserFilterDto,
    UserResponseDto,
    PaginatedUsersResponseDto,
} from 'libs/dto/users';
import { InviteStaffDto } from 'libs/dto/auth';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, CurrentUser } from '../auth/decorators';
import { UserRole } from 'libs/dto/auth';
import { ErrorResponseDto } from 'libs/dto/global/response.dto';

@ApiTags('Utilisateurs')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('system')
    @HttpCode(HttpStatus.CREATED)
    @Roles(UserRole.ADMIN)
    @ApiOperation({
        summary: 'Créer un utilisateur système (ADMIN ou SUPERVISEUR)',
        description:
            'Créer un nouvel utilisateur avec le rôle ADMIN ou SUPERVISEUR. ' +
            'Seuls les administrateurs peuvent créer ces types d\'utilisateurs. ' +
            'Le compte est activé et l\'email vérifié automatiquement.',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Utilisateur système créé avec succès',
        type: UserResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Accès refusé - ADMIN requis',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Email ou username déjà utilisé',
        type: ErrorResponseDto,
    })
    async createSystemUser(
        @Body() createSystemUserDto: CreateSystemUserDto,
        @CurrentUser('id') currentUserId: number,
    ): Promise<UserResponseDto> {
        return this.usersService.createSystemUser(createSystemUserDto, currentUserId);
    }

    @Post('maison-transit/:id/invite-staff')
    @HttpCode(HttpStatus.OK)
    @Roles(UserRole.ADMIN, UserRole.TRANSITAIRE)
    @ApiOperation({
        summary: 'Inviter un staff à rejoindre une maison de transit',
        description:
            'Envoyer une invitation par email à un nouvel utilisateur pour rejoindre une maison de transit. ' +
            'Les ADMIN peuvent inviter pour n\'importe quelle MT. ' +
            'Les TRANSITAIRE ne peuvent inviter que pour leur propre MT. ' +
            'Un token d\'invitation (valide 7 jours) est envoyé par email. ' +
            'L\'utilisateur acceptera l\'invitation et créera son propre compte.',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de la maison de transit',
        type: Number,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Invitation envoyée avec succès',
        schema: {
            example: {
                message: 'Invitation envoyée avec succès',
                invitationToken: '1a2b3c4d...',
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Accès refusé ou maison de transit non autorisée',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Maison de transit non trouvée',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Un compte avec cet email existe déjà',
        type: ErrorResponseDto,
    })
    async inviteStaff(
        @Param('id', ParseIntPipe) maisonTransitId: number,
        @Body() inviteStaffDto: InviteStaffDto,
        @CurrentUser('id') currentUserId: number,
    ): Promise<{ message: string; invitationToken: string }> {
        return this.usersService.inviteStaff(
            maisonTransitId,
            inviteStaffDto.email,
            inviteStaffDto.staffRole || 'STAFF',
            currentUserId,
        );
    }

    @Post('transit-staff')
    @HttpCode(HttpStatus.CREATED)
    @Roles(UserRole.ADMIN, UserRole.TRANSITAIRE)
    @ApiOperation({
        summary: 'Créer un staff de maison de transit (DEPRECATED - utiliser invite-staff)',
        description:
            'Ajouter un nouvel utilisateur à une maison de transit. ' +
            'Les ADMIN peuvent ajouter à n\'importe quelle MT. ' +
            'Les TRANSITAIRE ne peuvent ajouter qu\'à leur propre MT. ' +
            'Un email de vérification est envoyé au nouvel utilisateur.',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Staff créé avec succès',
        type: UserResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Accès refusé ou maison de transit non autorisée',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Maison de transit non trouvée',
        type: ErrorResponseDto,
    })
    async createTransitStaff(
        @Body() createTransitStaffDto: CreateTransitStaffDto,
        @CurrentUser('id') currentUserId: number,
    ): Promise<UserResponseDto> {
        return this.usersService.createTransitStaff(createTransitStaffDto, currentUserId);
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.SUPERVISEUR)
    @ApiOperation({
        summary: 'Lister les utilisateurs',
        description:
            'Récupérer la liste des utilisateurs avec filtres et pagination. ' +
            'Seuls les ADMIN et SUPERVISEUR ont accès à cette fonctionnalité.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Liste des utilisateurs',
        type: PaginatedUsersResponseDto,
    })
    async findAll(@Query() filters: UserFilterDto): Promise<PaginatedUsersResponseDto> {
        return this.usersService.findAll(filters);
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.SUPERVISEUR, UserRole.TRANSITAIRE, UserRole.AGENT)
    @ApiOperation({
        summary: 'Récupérer un utilisateur par ID',
        description: 'Obtenir les détails d\'un utilisateur spécifique.',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de l\'utilisateur',
        type: Number,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Détails de l\'utilisateur',
        type: UserResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Utilisateur non trouvé',
        type: ErrorResponseDto,
    })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
        return this.usersService.findOne(id);
    }

    @Put(':id')
    @Roles(UserRole.ADMIN, UserRole.SUPERVISEUR, UserRole.TRANSITAIRE, UserRole.AGENT)
    @ApiOperation({
        summary: 'Mettre à jour un utilisateur',
        description:
            'Modifier les informations d\'un utilisateur. ' +
            'Un utilisateur peut se modifier lui-même. ' +
            'Les ADMIN peuvent modifier n\'importe quel utilisateur.',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de l\'utilisateur',
        type: Number,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Utilisateur mis à jour avec succès',
        type: UserResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Vous n\'avez pas la permission de modifier cet utilisateur',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Utilisateur non trouvé',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Email ou username déjà utilisé',
        type: ErrorResponseDto,
    })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
        @CurrentUser('id') currentUserId: number,
    ): Promise<UserResponseDto> {
        return this.usersService.update(id, updateUserDto, currentUserId);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({
        summary: 'Supprimer un utilisateur',
        description:
            'Supprimer un utilisateur (soft delete). ' +
            'Seuls les ADMIN peuvent supprimer des utilisateurs.',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de l\'utilisateur',
        type: Number,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Utilisateur supprimé avec succès',
        schema: {
            example: {
                message: 'Utilisateur supprimé avec succès',
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Accès refusé - ADMIN requis',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Utilisateur non trouvé',
        type: ErrorResponseDto,
    })
    async remove(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser('id') currentUserId: number,
    ): Promise<{ message: string }> {
        return this.usersService.remove(id, currentUserId);
    }
}
