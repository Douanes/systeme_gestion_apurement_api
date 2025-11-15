import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
    ParseIntPipe,
    ParseBoolPipe,
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
import { BureauSortieService } from './office.service';
import {
    CreateBureauSortieDto,
    UpdateBureauSortieDto,
    BureauSortieResponseDto,
    BureauSortieWithRelationsDto,
} from 'libs/dto/bureau-sortie/office.dto';
import { BureauSortiePaginationQueryDto } from 'libs/dto/bureau-sortie/pagination.dto';
import {
    PaginatedResponseDto,
    SuccessResponseDto,
    ErrorResponseDto,
} from 'libs/dto/global/response.dto';

@ApiTags('Bureaux de Sortie')
@ApiBearerAuth('JWT-auth')
@Controller('bureaux-sortie')
export class BureauSortieController {
    constructor(private readonly bureauSortieService: BureauSortieService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Créer un nouveau bureau de sortie',
        description: 'Crée un nouveau bureau de sortie frontalier dans le système',
    })
    @ApiBody({ type: CreateBureauSortieDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Bureau de sortie créé avec succès',
        type: BureauSortieResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Données invalides',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Un bureau avec ce code existe déjà',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    async create(
        @Body() createBureauSortieDto: CreateBureauSortieDto,
    ): Promise<BureauSortieResponseDto> {
        return this.bureauSortieService.create(createBureauSortieDto);
    }

    @Get()
    @ApiOperation({
        summary: 'Récupérer tous les bureaux de sortie',
        description:
            'Récupère une liste paginée de tous les bureaux de sortie avec filtres optionnels',
    })
    @ApiQuery({ type: BureauSortiePaginationQueryDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Liste des bureaux de sortie récupérée avec succès',
        type: PaginatedResponseDto<BureauSortieResponseDto>,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    async findAll(
        @Query() paginationQuery: BureauSortiePaginationQueryDto,
    ): Promise<PaginatedResponseDto<BureauSortieResponseDto>> {
        return this.bureauSortieService.findAll(paginationQuery);
    }

    @Get('active')
    @ApiOperation({
        summary: 'Récupérer tous les bureaux actifs (sans pagination)',
        description:
            'Récupère tous les bureaux de sortie actifs - utile pour les listes déroulantes',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Liste complète des bureaux actifs',
        type: [BureauSortieResponseDto],
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    async findAllActive(): Promise<BureauSortieResponseDto[]> {
        return this.bureauSortieService.findAllActive();
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Récupérer un bureau de sortie par ID',
        description: 'Récupère les détails d\'un bureau de sortie spécifique par son ID',
    })
    @ApiParam({
        name: 'id',
        description: 'ID du bureau de sortie',
        type: Number,
        example: 1,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Bureau de sortie récupéré avec succès',
        type: BureauSortieWithRelationsDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Bureau de sortie non trouvé',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    async findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BureauSortieResponseDto | BureauSortieWithRelationsDto> {
        return this.bureauSortieService.findOne(id);
    }

    @Get(':id/statistics')
    @ApiOperation({
        summary: 'Récupérer les statistiques d\'un bureau',
        description:
            'Récupère les statistiques (nombre de déclarations, agents, ordres de mission) d\'un bureau',
    })
    @ApiParam({
        name: 'id',
        description: 'ID du bureau de sortie',
        type: Number,
        example: 1,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Statistiques récupérées avec succès',
        schema: {
            example: {
                bureauId: 1,
                totalDeclarations: 150,
                totalAgents: 8,
                totalOrdreMissions: 45,
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Bureau non trouvé',
        type: ErrorResponseDto,
    })
    async getStatistics(@Param('id', ParseIntPipe) id: number) {
        return this.bureauSortieService.getStatistics(id);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Mettre à jour un bureau de sortie',
        description: 'Met à jour les informations d\'un bureau de sortie existant',
    })
    @ApiParam({
        name: 'id',
        description: 'ID du bureau de sortie à mettre à jour',
        type: Number,
        example: 1,
    })
    @ApiBody({ type: UpdateBureauSortieDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Bureau de sortie mis à jour avec succès',
        type: BureauSortieResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Données invalides',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Bureau de sortie non trouvé',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Un bureau avec ce code existe déjà',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateBureauSortieDto: UpdateBureauSortieDto,
    ): Promise<BureauSortieResponseDto> {
        return this.bureauSortieService.update(id, updateBureauSortieDto);
    }

    @Put(':id/activate')
    @ApiOperation({
        summary: 'Activer un bureau de sortie',
        description: 'Active un bureau de sortie désactivé',
    })
    @ApiParam({
        name: 'id',
        description: 'ID du bureau de sortie',
        type: Number,
        example: 1,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Bureau activé avec succès',
        type: SuccessResponseDto<BureauSortieResponseDto>,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Bureau non trouvé',
        type: ErrorResponseDto,
    })
    async activate(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<SuccessResponseDto<BureauSortieResponseDto>> {
        const bureau = await this.bureauSortieService.activate(id);
        return {
            success: true,
            message: 'Bureau de sortie activé avec succès',
            data: bureau,
        };
    }

    @Put(':id/deactivate')
    @ApiOperation({
        summary: 'Désactiver un bureau de sortie',
        description: 'Désactive un bureau de sortie actif',
    })
    @ApiParam({
        name: 'id',
        description: 'ID du bureau de sortie',
        type: Number,
        example: 1,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Bureau désactivé avec succès',
        type: SuccessResponseDto<BureauSortieResponseDto>,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Bureau non trouvé',
        type: ErrorResponseDto,
    })
    async deactivate(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<SuccessResponseDto<BureauSortieResponseDto>> {
        const bureau = await this.bureauSortieService.deactivate(id);
        return {
            success: true,
            message: 'Bureau de sortie désactivé avec succès',
            data: bureau,
        };
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Supprimer un bureau de sortie',
        description: 'Supprime un bureau de sortie du système (soft delete)',
    })
    @ApiParam({
        name: 'id',
        description: 'ID du bureau de sortie à supprimer',
        type: Number,
        example: 1,
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Bureau de sortie supprimé avec succès',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Bureau de sortie non trouvé',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description:
            'Impossible de supprimer: bureau associé à des déclarations, agents ou ordres de mission',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.bureauSortieService.remove(id);
    }
}