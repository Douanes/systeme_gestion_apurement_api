import {
    Controller,
    Get,
    Post,
    Put,
    Patch,
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
import { OrdreMissionService } from './ordre.service';
import {
    CreateOrdreMissionDto,
    UpdateOrdreMissionDto,
    ChangeStatutOrdreMissionDto,
    OrdreMissionResponseDto,
    OrdreMissionWithRelationsDto,
    AssignAgentEscorteurDto,
    UpdateStatutApurementDto,
    GenerateOrdreMissionUploadSignatureDto,
    OrdreMissionUploadSignatureResponseDto,
    CreateOrdreMissionDocumentDto,
    OrdreMissionDocumentResponseDto,
} from 'libs/dto/ordre-mission/mission.dto';
import { OrdreMissionPaginationQueryDto, AuditNonApuresQueryDto } from 'libs/dto/ordre-mission/pagination.dto';
import { ErrorResponseDto, SuccessResponseDto } from 'libs/dto/global/response.dto';

@ApiTags('Ordres de Mission')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('ordres-mission')
export class OrdreMissionController {
    constructor(private readonly ordreMissionService: OrdreMissionService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Créer un nouvel ordre de mission',
        description:
            'Crée un nouvel ordre de mission avec possibilité d\'associer déclarations, colis, conteneurs, camions et voitures. ' +
            'Le numéro d\'ordre est généré automatiquement si non fourni (Format: MT-YYYY-NNNNNN - Code Maison Transit - Année - Compteur séquentiel).',
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
                        number: 'MTD-2025-000001',
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
                        number: 'OM-2025-000001',
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
    async findAll(
        @Query() paginationQuery: OrdreMissionPaginationQueryDto,
        @Request() req,
    ) {
        return this.ordreMissionService.findAll(paginationQuery, req.user);
    }

    @Get('audit/non-apures')
    @ApiOperation({
        summary: 'Récupérer les ordres de mission non apurés pour audit',
        description:
            'Récupère une liste paginée des ordres de mission avec statut NON_APURE datant d\'une semaine ou plus. ' +
            'Utile pour les audits et le suivi des ordres en attente d\'apurement.',
    })
    @ApiQuery({ type: AuditNonApuresQueryDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Liste des ordres de mission non apurés récupérée avec succès',
        schema: {
            example: {
                data: [
                    {
                        id: 1,
                        number: 'MTD-2025-000001',
                        destination: 'Port de Dakar',
                        itineraire: 'Dakar -> Thiès -> Saint-Louis',
                        dateOrdre: '2024-01-15T00:00:00.000Z',
                        depositaireId: 1,
                        maisonTransitId: 1,
                        statut: 'EN_COURS',
                        statutApurement: 'NON_APURE',
                        joursDepuisOrdre: 15,
                        maisonTransit: {
                            id: 1,
                            name: 'Maison Transit Dakar',
                            code: 'MTD',
                        },
                        depositaire: {
                            id: 1,
                            name: 'Dépositaire Dakar',
                        },
                        createdAt: '2024-01-15T10:30:00.000Z',
                        updatedAt: '2024-01-15T10:30:00.000Z',
                    },
                ],
                meta: {
                    page: 1,
                    limit: 10,
                    total: 25,
                    totalPages: 3,
                    hasNext: true,
                    hasPrevious: false,
                },
            },
        },
    })
    async findNonApuresForAudit(
        @Query() query: AuditNonApuresQueryDto,
        @Request() req,
    ) {
        return this.ordreMissionService.findNonApuresForAudit(query, req.user);
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
        @Request() req,
    ): Promise<OrdreMissionResponseDto> {
        return this.ordreMissionService.update(id, updateOrdreMissionDto, req.user);
    }

    @Patch(':id/statut')
    @ApiOperation({
        summary: 'Modifier le statut d\'un ordre de mission',
        description: 'Met à jour uniquement le statut d\'un ordre de mission',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de l\'ordre de mission',
        type: Number,
        example: 1,
    })
    @ApiBody({ type: ChangeStatutOrdreMissionDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Statut mis à jour avec succès',
        type: OrdreMissionResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Ordre de mission non trouvé',
        type: ErrorResponseDto,
    })
    async changeStatut(
        @Param('id', ParseIntPipe) id: number,
        @Body() changeStatutDto: ChangeStatutOrdreMissionDto,
    ): Promise<OrdreMissionResponseDto> {
        return this.ordreMissionService.changeStatut(id, changeStatutDto);
    }

    @Put(':id/agent-escorteur')
    @ApiOperation({
        summary: 'Assigner un agent escorteur à un ordre de mission',
        description:
            'Assigne un agent escorteur. Uniquement possible si le statut est TRAITE. ' +
            'Le statut passe automatiquement à COTATION après l\'assignation.',
    })
    @ApiParam({ name: 'id', description: 'ID de l\'ordre de mission', type: Number })
    @ApiBody({ type: AssignAgentEscorteurDto })
    @ApiResponse({ status: HttpStatus.OK, description: 'Agent escorteur assigné', type: OrdreMissionResponseDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Statut non valide pour l\'assignation', type: ErrorResponseDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Ordre de mission ou agent non trouvé', type: ErrorResponseDto })
    async assignAgentEscorteur(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AssignAgentEscorteurDto,
        @Request() req,
    ): Promise<OrdreMissionResponseDto> {
        return this.ordreMissionService.assignAgentEscorteur(id, dto.agentId, req.user);
    }

    @Delete(':id/agent-escorteur')
    @ApiOperation({
        summary: 'Retirer l\'agent escorteur d\'un ordre de mission',
        description: 'Retire l\'agent escorteur assigné (met agentEscorteurId à null)',
    })
    @ApiParam({ name: 'id', description: 'ID de l\'ordre de mission', type: Number })
    @ApiResponse({ status: HttpStatus.OK, description: 'Agent escorteur retiré', type: OrdreMissionResponseDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Aucun agent escorteur assigné', type: ErrorResponseDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Ordre de mission non trouvé', type: ErrorResponseDto })
    async removeAgentEscorteur(
        @Param('id', ParseIntPipe) id: number,
        @Request() req,
    ): Promise<OrdreMissionResponseDto> {
        return this.ordreMissionService.removeAgentEscorteur(id, req.user);
    }

    @Patch(':id/statut-apurement')
    @ApiOperation({
        summary: 'Mettre à jour le statut d\'apurement d\'un ordre de mission',
        description:
            'Met à jour le statut d\'apurement. Si le statut est APURE, vérifie que toutes les déclarations ' +
            'sont totalement livrées (nbreColisRestant = 0). Les déclarations livrées sont automatiquement marquées comme apurées.',
    })
    @ApiParam({ name: 'id', description: 'ID de l\'ordre de mission', type: Number })
    @ApiBody({ type: UpdateStatutApurementDto })
    @ApiResponse({ status: HttpStatus.OK, description: 'Statut d\'apurement mis à jour', type: OrdreMissionResponseDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Déclarations non totalement livrées', type: ErrorResponseDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Ordre de mission non trouvé', type: ErrorResponseDto })
    async updateStatutApurement(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateStatutApurementDto,
    ): Promise<OrdreMissionResponseDto> {
        return this.ordreMissionService.updateStatutApurement(id, dto.statutApurement);
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

    // ===== Documents =====

    @Post('upload-signature')
    @ApiOperation({
        summary: 'Générer une signature pour upload de document',
        description: 'Génère une signature Cloudinary pour uploader un document directement depuis le client',
    })
    @ApiBody({ type: GenerateOrdreMissionUploadSignatureDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Signature générée avec succès',
        type: OrdreMissionUploadSignatureResponseDto,
    })
    async generateUploadSignature(
        @Body() dto: GenerateOrdreMissionUploadSignatureDto,
    ): Promise<OrdreMissionUploadSignatureResponseDto> {
        return this.ordreMissionService.generateUploadSignature(dto.fileName);
    }

    @Post(':id/documents')
    @ApiOperation({
        summary: 'Enregistrer un document uploadé',
        description: 'Enregistre les métadonnées d\'un document uploadé sur Cloudinary pour un ordre de mission',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de l\'ordre de mission',
        type: Number,
        example: 1,
    })
    @ApiBody({ type: CreateOrdreMissionDocumentDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Document enregistré avec succès',
        type: OrdreMissionDocumentResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Ordre de mission non trouvé',
        type: ErrorResponseDto,
    })
    @HttpCode(HttpStatus.CREATED)
    async createDocument(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: CreateOrdreMissionDocumentDto,
        @Request() req,
    ): Promise<OrdreMissionDocumentResponseDto> {
        return this.ordreMissionService.createDocument(id, dto, req.user);
    }

    @Get(':id/documents')
    @ApiOperation({
        summary: 'Lister les documents d\'un ordre de mission',
        description: 'Récupère tous les documents d\'un ordre. Les TRANSITAIRE/DECLARANT ne voient que ceux de leur maison de transit',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de l\'ordre de mission',
        type: Number,
        example: 1,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Documents récupérés avec succès',
        type: [OrdreMissionDocumentResponseDto],
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Ordre de mission non trouvé',
        type: ErrorResponseDto,
    })
    async findDocuments(
        @Param('id', ParseIntPipe) id: number,
        @Request() req,
    ): Promise<OrdreMissionDocumentResponseDto[]> {
        return this.ordreMissionService.findDocuments(id, req.user);
    }

    @Delete(':id/documents/:documentId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Supprimer un document',
        description: 'Supprime un document d\'un ordre de mission (soft delete + cleanup Cloudinary)',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de l\'ordre de mission',
        type: Number,
        example: 1,
    })
    @ApiParam({
        name: 'documentId',
        description: 'ID du document à supprimer',
        type: Number,
        example: 5,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Document supprimé avec succès',
        type: SuccessResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Document non trouvé',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Accès refusé',
        type: ErrorResponseDto,
    })
    async removeDocument(
        @Param('id', ParseIntPipe) id: number,
        @Param('documentId', ParseIntPipe) documentId: number,
        @Request() req,
    ): Promise<SuccessResponseDto<null>> {
        await this.ordreMissionService.removeDocument(id, documentId, req.user);
        return {
            success: true,
            message: 'Document supprimé avec succès',
        };
    }
}