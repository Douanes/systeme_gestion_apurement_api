import {
    Controller,
    Post,
    Get,
    Patch,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBody,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { MaisonTransitRequestsService } from './maison-transit-requests.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permissions.guard';
import { RequirePermissions } from '../permissions/decorators/require-permissions.decorator';
import {
    InviteTransitaireDto,
    SubmitMaisonTransitRequestDto,
    ReviewRequestDto,
    ActivateAccountDto,
    MaisonTransitRequestResponseDto,
    InvitationResponseDto,
    PaginatedRequestsResponseDto,
    RequestFilterDto,
    GenerateUploadSignatureDto,
    UploadSignatureResponseDto,
} from 'libs/dto/maison-transit-requests';

@ApiTags('Maison de Transit - Demandes')
@Controller('maison-transit-requests')
export class MaisonTransitRequestsController {
    constructor(
        private readonly requestsService: MaisonTransitRequestsService,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    /**
     * Inviter un transitaire (Admin/Agent)
     * POST /maison-transit-requests/invite
     */
    @Post('invite')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('maison_transit_requests.invite')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Inviter un transitaire à créer une maison de transit',
        description:
            'Permet aux administrateurs et agents d\'inviter un transitaire par email pour créer sa maison de transit. Un email avec un lien unique est envoyé au transitaire.',
    })
    @ApiBody({
        type: InviteTransitaireDto,
        description: 'Informations du transitaire à inviter',
    })
    @ApiResponse({
        status: 201,
        description: 'Invitation envoyée avec succès',
        type: InvitationResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Données invalides (email invalide ou entreprise manquante)',
    })
    @ApiResponse({
        status: 401,
        description: 'Non authentifié',
    })
    @ApiResponse({
        status: 403,
        description: 'Permission insuffisante',
    })
    @ApiResponse({
        status: 409,
        description: 'Un compte avec cet email existe déjà ou une demande est en cours',
    })
    async inviteTransitaire(
        @Body() dto: InviteTransitaireDto,
        @Request() req,
    ): Promise<InvitationResponseDto> {
        return this.requestsService.inviteTransitaire(dto, req.user.id);
    }

    /**
     * Générer une signature Cloudinary pour upload direct
     * POST /maison-transit-requests/upload-signature
     */
    @Post('upload-signature')
    @ApiOperation({
        summary: 'Générer une signature pour upload de document vers Cloudinary',
        description:
            'Endpoint public permettant d\'obtenir les paramètres nécessaires pour uploader un document directement vers Cloudinary de manière sécurisée.',
    })
    @ApiBody({
        type: GenerateUploadSignatureDto,
        description: 'Type de document et nom de fichier',
    })
    @ApiResponse({
        status: 201,
        description: 'Signature générée avec succès',
        type: UploadSignatureResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Données invalides (type de document ou nom de fichier manquant)',
    })
    async generateUploadSignature(
        @Body() body: GenerateUploadSignatureDto,
    ): Promise<UploadSignatureResponseDto> {
        // Récupérer le dossier depuis la config
        const folder = this.cloudinaryService.getFolder();

        // Générer un public_id unique basé sur timestamp et type de document
        const timestamp = Date.now();
        const sanitizedFileName = body.fileName
            .replace(/\.[^/.]+$/, '') // Enlever l'extension
            .replace(/[^a-zA-Z0-9-_]/g, '_') // Caractères sûrs uniquement
            .substring(0, 50); // Limiter la longueur

        const publicId = `${folder}/${body.documentType}_${sanitizedFileName}_${timestamp}`;

        const signatureData = this.cloudinaryService.generateSignature({
            public_id: publicId,
            upload_preset: 'mt_documents',
        });

        // Retourner l'URL d'upload Cloudinary
        const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloud_name}/auto/upload`;

        return {
            upload_url: uploadUrl,
            ...signatureData,
            public_id: publicId,
            folder,
        };
    }

    /**
     * Soumettre une demande avec documents (Public - pas de guard)
     * POST /maison-transit-requests/submit
     */
    @Post('submit')
    @ApiOperation({
        summary: 'Soumettre une demande de création de maison de transit',
        description:
            'Endpoint public permettant à un transitaire invité de soumettre sa demande avec les documents requis après les avoir uploadés sur Cloudinary.',
    })
    @ApiBody({
        type: SubmitMaisonTransitRequestDto,
        description: 'Informations de la demande avec documents uploadés',
    })
    @ApiResponse({
        status: 201,
        description: 'Demande soumise avec succès, en attente de validation',
        type: MaisonTransitRequestResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Données invalides ou token expiré',
    })
    @ApiResponse({
        status: 404,
        description: 'Invitation non trouvée',
    })
    @ApiResponse({
        status: 409,
        description: 'Demande déjà soumise pour cette invitation',
    })
    async submitRequest(
        @Body() dto: SubmitMaisonTransitRequestDto,
    ): Promise<MaisonTransitRequestResponseDto> {
        return this.requestsService.submitRequest(dto);
    }

    /**
     * Valider ou rejeter une demande (Admin uniquement)
     * PATCH /maison-transit-requests/:id/review
     */
    @Patch(':id/review')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('maison_transit_requests.review')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Valider ou rejeter une demande de création de maison de transit',
        description:
            'Permet aux administrateurs de valider ou rejeter une demande soumise par un transitaire. La validation crée la maison de transit et envoie un email d\'activation au responsable.',
    })
    @ApiBody({
        type: ReviewRequestDto,
        description: 'Décision (APPROVED/REJECTED) et commentaire optionnel',
    })
    @ApiResponse({
        status: 200,
        description: 'Demande validée ou rejetée avec succès',
        type: MaisonTransitRequestResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Données invalides ou demande déjà traitée',
    })
    @ApiResponse({
        status: 401,
        description: 'Non authentifié',
    })
    @ApiResponse({
        status: 403,
        description: 'Permission insuffisante',
    })
    @ApiResponse({
        status: 404,
        description: 'Demande non trouvée',
    })
    async reviewRequest(
        @Param('id') id: string,
        @Body() dto: ReviewRequestDto,
        @Request() req,
    ): Promise<MaisonTransitRequestResponseDto> {
        return this.requestsService.reviewRequest(+id, dto, req.user.id);
    }

    /**
     * Activer le compte après approbation (Public - pas de guard)
     * POST /maison-transit-requests/activate
     */
    @Post('activate')
    @ApiOperation({
        summary: 'Activer le compte du responsable de maison de transit',
        description:
            'Endpoint public permettant au transitaire d\'activer son compte après validation de sa demande. Nécessite le token d\'activation reçu par email.',
    })
    @ApiBody({
        type: ActivateAccountDto,
        description: 'Token d\'activation et mot de passe',
    })
    @ApiResponse({
        status: 201,
        description: 'Compte activé avec succès',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Compte activé avec succès' },
                userId: { type: 'number', example: 42 },
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Token invalide ou expiré',
    })
    @ApiResponse({
        status: 404,
        description: 'Demande non trouvée ou non approuvée',
    })
    async activateAccount(
        @Body() dto: ActivateAccountDto,
    ): Promise<{ message: string; userId: number }> {
        return this.requestsService.activateAccount(dto);
    }

    /**
     * Lister toutes les demandes avec filtres (Admin/Agent)
     * GET /maison-transit-requests
     */
    @Get()
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('maison_transit_requests.read')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Lister toutes les demandes de création de maison de transit',
        description:
            'Permet aux administrateurs et agents de lister toutes les demandes avec filtres par statut, dates, et pagination.',
    })
    @ApiResponse({
        status: 200,
        description: 'Liste des demandes avec pagination',
        type: PaginatedRequestsResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Non authentifié',
    })
    @ApiResponse({
        status: 403,
        description: 'Permission insuffisante',
    })
    async findAll(
        @Query() filters: RequestFilterDto,
    ): Promise<PaginatedRequestsResponseDto> {
        return this.requestsService.findAll(filters);
    }

    /**
     * Récupérer une demande par ID (Admin/Agent)
     * GET /maison-transit-requests/:id
     */
    @Get(':id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('maison_transit_requests.read')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Récupérer une demande par son ID',
        description:
            'Permet aux administrateurs et agents de consulter les détails d\'une demande spécifique.',
    })
    @ApiResponse({
        status: 200,
        description: 'Détails de la demande',
        type: MaisonTransitRequestResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Non authentifié',
    })
    @ApiResponse({
        status: 403,
        description: 'Permission insuffisante',
    })
    @ApiResponse({
        status: 404,
        description: 'Demande non trouvée',
    })
    async findOne(
        @Param('id') id: string,
    ): Promise<MaisonTransitRequestResponseDto> {
        return this.requestsService.findOne(+id);
    }

    /**
     * Récupérer une demande par token (Public - pas de guard)
     * GET /maison-transit-requests/token/:token
     */
    @Get('token/:token')
    @ApiOperation({
        summary: 'Récupérer une demande par son token d\'invitation',
        description:
            'Endpoint public permettant au transitaire invité de consulter les détails de sa demande en cours en utilisant le token reçu par email.',
    })
    @ApiResponse({
        status: 200,
        description: 'Détails de la demande',
        type: MaisonTransitRequestResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Demande non trouvée ou token invalide',
    })
    async findByToken(
        @Param('token') token: string,
    ): Promise<MaisonTransitRequestResponseDto> {
        return this.requestsService.findByToken(token);
    }
}
