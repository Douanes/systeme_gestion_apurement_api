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
    ParseBoolPipe,
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MaisonTransitService } from './transit.service';
import {
    CreateMaisonTransitDto,
    UpdateMaisonTransitDto,
    MaisonTransitResponseDto,
    MaisonTransitWithRelationsDto,
} from 'libs/dto/maison-transit/transit.dto';
import { MaisonTransitPaginationQueryDto } from 'libs/dto/maison-transit/pagination.dto';
import {
    PaginatedResponseDto,
    SuccessResponseDto,
    ErrorResponseDto,
} from 'libs/dto/global/response.dto';

@ApiTags('Maisons de Transit')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('maisons-transit')
export class MaisonTransitController {
    constructor(private readonly maisonTransitService: MaisonTransitService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Créer une nouvelle maison de transit',
        description: 'Crée une nouvelle maison de transit dans le système',
    })
    @ApiBody({ type: CreateMaisonTransitDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Maison de transit créée avec succès',
        type: MaisonTransitResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Données invalides',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Une maison de transit avec ce code existe déjà',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    async create(
        @Body() createMaisonTransitDto: CreateMaisonTransitDto,
    ): Promise<MaisonTransitResponseDto> {
        return this.maisonTransitService.create(createMaisonTransitDto);
    }

    @Get()
    @ApiOperation({
        summary: 'Récupérer toutes les maisons de transit',
        description:
            'Récupère une liste paginée de toutes les maisons de transit avec filtres optionnels',
    })
    @ApiQuery({ type: MaisonTransitPaginationQueryDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Liste des maisons de transit récupérée avec succès',
        type: PaginatedResponseDto<MaisonTransitResponseDto>,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    async findAll(
        @Query() paginationQuery: MaisonTransitPaginationQueryDto,
        @Request() req,
    ): Promise<PaginatedResponseDto<MaisonTransitResponseDto>> {
        return this.maisonTransitService.findAll(paginationQuery, req.user);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Récupérer une maison de transit par ID',
        description: 'Récupère les détails d\'une maison de transit spécifique par son ID',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de la maison de transit',
        type: Number,
        example: 1,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Maison de transit récupérée avec succès',
        type: MaisonTransitWithRelationsDto,
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
    async findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<MaisonTransitResponseDto | MaisonTransitWithRelationsDto> {
        return this.maisonTransitService.findOne(id);
    }

    @Get(':id/statistics')
    @ApiOperation({
        summary: 'Récupérer les statistiques d\'une maison de transit',
        description:
            'Récupère les statistiques (nombre de dépositaires, déclarations) d\'une maison de transit',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de la maison de transit',
        type: Number,
        example: 1,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Statistiques récupérées avec succès',
        schema: {
            example: {
                maisonTransitId: 1,
                totalDepositaires: 15,
                totalDeclarations: 120,
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Maison de transit non trouvée',
        type: ErrorResponseDto,
    })
    async getStatistics(@Param('id', ParseIntPipe) id: number) {
        return this.maisonTransitService.getStatistics(id);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Mettre à jour une maison de transit',
        description: 'Met à jour les informations d\'une maison de transit existante',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de la maison de transit à mettre à jour',
        type: Number,
        example: 1,
    })
    @ApiBody({ type: UpdateMaisonTransitDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Maison de transit mise à jour avec succès',
        type: MaisonTransitResponseDto,
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
        status: HttpStatus.CONFLICT,
        description: 'Une maison de transit avec ce code existe déjà',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateMaisonTransitDto: UpdateMaisonTransitDto,
    ): Promise<MaisonTransitResponseDto> {
        return this.maisonTransitService.update(id, updateMaisonTransitDto);
    }

    @Put(':id/activate')
    @ApiOperation({
        summary: 'Activer une maison de transit',
        description: 'Active une maison de transit désactivée',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de la maison de transit',
        type: Number,
        example: 1,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Maison de transit activée avec succès',
        type: SuccessResponseDto<MaisonTransitResponseDto>,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Maison de transit non trouvée',
        type: ErrorResponseDto,
    })
    async activate(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<SuccessResponseDto<MaisonTransitResponseDto>> {
        const maison = await this.maisonTransitService.activate(id);
        return {
            success: true,
            message: 'Maison de transit activée avec succès',
            data: maison,
        };
    }

    @Put(':id/deactivate')
    @ApiOperation({
        summary: 'Désactiver une maison de transit',
        description: 'Désactive une maison de transit active',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de la maison de transit',
        type: Number,
        example: 1,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Maison de transit désactivée avec succès',
        type: SuccessResponseDto<MaisonTransitResponseDto>,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Maison de transit non trouvée',
        type: ErrorResponseDto,
    })
    async deactivate(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<SuccessResponseDto<MaisonTransitResponseDto>> {
        const maison = await this.maisonTransitService.deactivate(id);
        return {
            success: true,
            message: 'Maison de transit désactivée avec succès',
            data: maison,
        };
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Supprimer une maison de transit',
        description: 'Supprime une maison de transit du système (soft delete)',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de la maison de transit à supprimer',
        type: Number,
        example: 1,
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Maison de transit supprimée avec succès',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Maison de transit non trouvée',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description:
            'Impossible de supprimer: maison de transit associée à des dépositaires ou déclarations',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.maisonTransitService.remove(id);
    }
}