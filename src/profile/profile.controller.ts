import {
    Controller,
    Get,
    Put,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
    Request,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiBody,
} from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import {
    UserProfileDto,
    UpdateProfileDto,
    ChangePasswordDto,
    AdminResetPasswordDto,
    ProfileSuccessDto,
} from 'libs/dto/profile';
import { ErrorResponseDto } from 'libs/dto/global/response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from 'libs/dto/auth';

@ApiTags('Profil Utilisateur')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Get('me')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Récupérer le profil de l\'utilisateur connecté',
        description: 'Retourne les informations du profil de l\'utilisateur actuellement connecté.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Profil de l\'utilisateur récupéré avec succès',
        type: UserProfileDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Utilisateur non trouvé',
        type: ErrorResponseDto,
    })
    async getProfile(@Request() req): Promise<UserProfileDto> {
        return this.profileService.getProfile(req.user.sub);
    }

    @Put('me')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Mettre à jour le profil',
        description: 'Permet à un utilisateur de mettre à jour son prénom, nom et numéro de téléphone.',
    })
    @ApiBody({ type: UpdateProfileDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Profil mis à jour avec succès',
        type: ProfileSuccessDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Données invalides',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Utilisateur non trouvé',
        type: ErrorResponseDto,
    })
    async updateProfile(
        @Request() req,
        @Body() updateProfileDto: UpdateProfileDto,
    ): Promise<ProfileSuccessDto> {
        return this.profileService.updateProfile(req.user.sub, updateProfileDto);
    }

    @Post('change-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Changer le mot de passe',
        description:
            'Permet à un utilisateur de changer son mot de passe. ' +
            'Nécessite le mot de passe actuel pour des raisons de sécurité.',
    })
    @ApiBody({ type: ChangePasswordDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Mot de passe changé avec succès',
        schema: {
            example: {
                message: 'Mot de passe changé avec succès',
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié ou mot de passe actuel incorrect',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Mots de passe invalides ou ne correspondent pas',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Utilisateur non trouvé',
        type: ErrorResponseDto,
    })
    async changePassword(
        @Request() req,
        @Body() changePasswordDto: ChangePasswordDto,
    ): Promise<{ message: string }> {
        return this.profileService.changePassword(req.user.sub, changePasswordDto);
    }

    @Post('admin/reset-password')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Réinitialiser le mot de passe d\'un utilisateur (Admin)',
        description:
            'Permet à un administrateur de réinitialiser le mot de passe d\'un utilisateur. ' +
            'Si aucun mot de passe n\'est fourni, un mot de passe temporaire sera généré automatiquement.',
    })
    @ApiBody({ type: AdminResetPasswordDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Mot de passe réinitialisé avec succès',
        schema: {
            example: {
                message: 'Mot de passe réinitialisé avec succès pour l\'utilisateur johndoe',
                tempPassword: 'Abc123!@#Xyz',
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Accès refusé - Administrateur requis',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Utilisateur cible non trouvé',
        type: ErrorResponseDto,
    })
    async adminResetPassword(
        @Request() req,
        @Body() adminResetPasswordDto: AdminResetPasswordDto,
    ): Promise<{ message: string; tempPassword?: string }> {
        return this.profileService.adminResetPassword(req.user.sub, adminResetPasswordDto);
    }
}
