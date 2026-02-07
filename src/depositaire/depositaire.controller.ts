import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    Request,
    HttpCode,
    HttpStatus,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiBearerAuth,
    ApiBody,
} from '@nestjs/swagger';
import { DepositaireService } from './depositaire.service';
import {
    CreateDepositaireDto,
    UpdateDepositaireDto,
    DepositaireResponseDto,
    DepositaireWithRelationsDto,
} from 'libs/dto/depositaire';
import { DepositairePaginationQueryDto } from 'libs/dto/depositaire/pagination.dto';
import {
    PaginatedResponseDto,
    ErrorResponseDto,
} from 'libs/dto/global/response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators';
import { UserRole } from 'libs/dto/auth';

@ApiTags('Dépositaires')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('depositaires')
export class DepositaireController {
    constructor(private readonly depositaireService: DepositaireService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles(UserRole.ADMIN, UserRole.SUPERVISEUR, UserRole.TRANSITAIRE)
    @ApiOperation({
        summary: 'Créer un nouveau dépositaire',
        description: 'Crée un nouveau dépositaire dans le système',
    })
    @ApiBody({ type: CreateDepositaireDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Dépositaire créé avec succès',
        type: DepositaireResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Données invalides',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Maison de transit non trouvée',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Accès refusé - Rôle insuffisant',
        type: ErrorResponseDto,
    })
    async create(
        @Body() createDepositaireDto: CreateDepositaireDto,
    ): Promise<DepositaireResponseDto> {
        return this.depositaireService.create(createDepositaireDto);
    }

    @Get()
    @ApiOperation({
        summary: 'Récupérer tous les dépositaires',
        description:
            'Récupère une liste paginée de tous les dépositaires avec filtres optionnels',
    })
    @ApiQuery({ type: DepositairePaginationQueryDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Liste des dépositaires récupérée avec succès',
        type: PaginatedResponseDto<DepositaireWithRelationsDto>,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    async findAll(
        @Query() paginationQuery: DepositairePaginationQueryDto,
        @Request() req,
    ): Promise<PaginatedResponseDto<DepositaireWithRelationsDto>> {
        return this.depositaireService.findAll(paginationQuery, req.user);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Récupérer un dépositaire par ID',
        description: 'Récupère les détails d\'un dépositaire spécifique par son ID',
    })
    @ApiParam({
        name: 'id',
        description: 'ID du dépositaire',
        type: Number,
        example: 1,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Dépositaire récupéré avec succès',
        type: DepositaireWithRelationsDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Dépositaire non trouvé',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    async findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<DepositaireWithRelationsDto> {
        return this.depositaireService.findOne(id);
    }

    @Get(':id/statistics')
    @ApiOperation({
        summary: 'Récupérer les statistiques d\'un dépositaire',
        description:
            'Récupère les statistiques (nombre de déclarations et ordres de mission) d\'un dépositaire',
    })
    @ApiParam({
        name: 'id',
        description: 'ID du dépositaire',
        type: Number,
        example: 1,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Statistiques récupérées avec succès',
        schema: {
            example: {
                depositaireId: 1,
                totalDeclarations: 45,
                totalOrdreMissions: 12,
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Dépositaire non trouvé',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    async getStatistics(@Param('id', ParseIntPipe) id: number) {
        return this.depositaireService.getStatistics(id);
    }

    @Put(':id')
    @Roles(UserRole.ADMIN, UserRole.SUPERVISEUR)
    @ApiOperation({
        summary: 'Mettre à jour un dépositaire',
        description: 'Met à jour les informations d\'un dépositaire existant',
    })
    @ApiParam({
        name: 'id',
        description: 'ID du dépositaire à mettre à jour',
        type: Number,
        example: 1,
    })
    @ApiBody({ type: UpdateDepositaireDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Dépositaire mis à jour avec succès',
        type: DepositaireResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Données invalides',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Dépositaire non trouvé',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Accès refusé - Rôle insuffisant',
        type: ErrorResponseDto,
    })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDepositaireDto: UpdateDepositaireDto,
    ): Promise<DepositaireResponseDto> {
        return this.depositaireService.update(id, updateDepositaireDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Roles(UserRole.ADMIN)
    @ApiOperation({
        summary: 'Supprimer un dépositaire',
        description: 'Supprime un dépositaire du système (soft delete)',
    })
    @ApiParam({
        name: 'id',
        description: 'ID du dépositaire à supprimer',
        type: Number,
        example: 1,
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Dépositaire supprimé avec succès',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Dépositaire non trouvé',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description:
            'Impossible de supprimer: dépositaire lié à des déclarations ou ordres de mission',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Accès refusé - Rôle ADMIN requis',
        type: ErrorResponseDto,
    })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.depositaireService.remove(id);
    }
}
