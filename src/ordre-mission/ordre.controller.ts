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
import { OrdreMissionService } from './ordre.service';
import {
    CreateOrdreMissionDto,
    UpdateOrdreMissionDto,
    OrdreMissionResponseDto,
    OrdreMissionWithRelationsDto,
} from 'libs/dto/ordre-mission/mission.dto';
import { OrdreMissionPaginationQueryDto } from 'libs/dto/ordre-mission/pagination.dto';
import { ErrorResponseDto } from 'libs/dto/global/response.dto';

@ApiTags('Ordres de Mission')
@ApiBearerAuth('JWT-auth')
@Controller('ordres-mission')
export class OrdreMissionController {
    constructor(private readonly ordreMissionService: OrdreMissionService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Créer un nouvel ordre de mission',
        description:
            'Crée un nouvel ordre de mission avec possibilité d\'associer déclarations, colis, conteneurs, camions et voitures',
    })
    @ApiBody({ type: CreateOrdreMissionDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Ordre de mission créé avec succès',
        type: OrdreMissionResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Données invalides',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Un ordre avec ce numéro existe déjà',
        type: ErrorResponseDto,
    })
    async create(
        @Body() createOrdreMissionDto: CreateOrdreMissionDto,
    ): Promise<OrdreMissionResponseDto> {
        return this.ordreMissionService.create(createOrdreMissionDto);
    }

    @Get()
    @ApiOperation({
        summary: 'Récupérer tous les ordres de mission',
        description:
            'Récupère une liste paginée de tous les ordres de mission avec filtres',
    })
    @ApiQuery({ type: OrdreMissionPaginationQueryDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Liste des ordres de mission récupérée avec succès',
        schema: {
            example: {
                data: [
                    {
                        id: 1,
                        number: 2024001,
                        destination: 'Port de Dakar',
                        itineraire: 'Dakar -> Thiès -> Saint-Louis',
                        dateOrdre: '2024-01-15T00:00:00.000Z',
                        depositaireId: 1,
                        maisonTransitId: 1,
                        createdById: 1,
                        statut: 'EN_COURS',
                        statutApurement: 'NON_APURE',
                        escouadeId: 1,
                        agentEscorteurId: 1,
                        bureauSortieId: 1,
                        observations: 'Mission prioritaire',
                        createdAt: '2024-01-15T10:30:00.000Z',
                        updatedAt: '2024-01-15T10:30:00.000Z',
                    },
                    {
                        id: 2,
                        number: 2024002,
                        destination: 'Aéroport Blaise Diagne',
                        itineraire: 'Dakar -> AIBD',
                        dateOrdre: '2024-01-22T00:00:00.000Z',
                        depositaireId: 2,
                        maisonTransitId: null,
                        createdById: 1,
                        statut: 'EN_COURS',
                        statutApurement: 'NON_APURE',
                        escouadeId: null,
                        agentEscorteurId: 2,
                        bureauSortieId: 1,
                        observations: null,
                        createdAt: '2024-01-20T10:30:00.000Z',
                        updatedAt: '2024-01-22T08:15:00.000Z',
                    },
                ],
                meta: {
                    page: 1,
                    limit: 10,
                    total: 50,
                    totalPages: 5,
                    hasNext: true,
                    hasPrevious: false,
                },
            },
        },
    })
    async findAll(@Query() paginationQuery: OrdreMissionPaginationQueryDto) {
        return this.ordreMissionService.findAll(paginationQuery);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Récupérer un ordre de mission par ID',
        description:
            'Récupère les détails d\'un ordre de mission avec toutes ses relations',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de l\'ordre de mission',
        type: Number,
        example: 1,
    })
    @ApiQuery({
        name: 'includeRelations',
        required: false,
        description:
            'Inclure toutes les relations (dépositaire, maison transit, agent escorteur, bureau sortie, déclarations, colis, conteneurs, camions, voitures)',
        type: Boolean,
        example: false,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Ordre de mission récupéré avec succès',
        type: OrdreMissionWithRelationsDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Ordre de mission non trouvé',
        type: ErrorResponseDto,
    })
    async findOne(
        @Param('id', ParseIntPipe) id: number,
        @Query('includeRelations', new ParseBoolPipe({ optional: true }))
        includeRelations?: boolean,
    ): Promise<OrdreMissionResponseDto | OrdreMissionWithRelationsDto> {
        return this.ordreMissionService.findOne(id, includeRelations);
    }

    @Get(':id/statistics')
    @ApiOperation({
        summary: 'Récupérer les statistiques d\'un ordre de mission',
        description:
            'Récupère le nombre de déclarations, colis, conteneurs, camions et voitures associés',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de l\'ordre de mission',
        type: Number,
        example: 1,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Statistiques récupérées avec succès',
        schema: {
            example: {
                ordreMissionId: 1,
                totalDeclarations: 5,
                totalColis: 12,
                totalConteneurs: 3,
                totalCamions: 2,
                totalVoitures: 1,
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Ordre de mission non trouvé',
        type: ErrorResponseDto,
    })
    async getStatistics(@Param('id', ParseIntPipe) id: number) {
        return this.ordreMissionService.getStatistics(id);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Mettre à jour un ordre de mission',
        description: 'Met à jour les informations d\'un ordre de mission',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de l\'ordre de mission',
        type: Number,
        example: 1,
    })
    @ApiBody({ type: UpdateOrdreMissionDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Ordre de mission mis à jour avec succès',
        type: OrdreMissionResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Données invalides',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Ordre de mission non trouvé',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Un ordre avec ce numéro existe déjà',
        type: ErrorResponseDto,
    })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateOrdreMissionDto: UpdateOrdreMissionDto,
    ): Promise<OrdreMissionResponseDto> {
        return this.ordreMissionService.update(id, updateOrdreMissionDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Supprimer un ordre de mission',
        description: 'Supprime un ordre de mission (soft delete)',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de l\'ordre de mission',
        type: Number,
        example: 1,
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Ordre de mission supprimé avec succès',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Ordre de mission non trouvé',
        type: ErrorResponseDto,
    })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.ordreMissionService.remove(id);
    }
}