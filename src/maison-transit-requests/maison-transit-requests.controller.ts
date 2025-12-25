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
} from 'libs/dto/maison-transit-requests';

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
    async generateUploadSignature(
        @Body()
        body: {
            documentType: 'REGISTRE_COMMERCE' | 'NINEA' | 'CARTE_PROFESSIONNELLE' | 'AUTRE';
            fileName: string;
        },
    ): Promise<{
        upload_url: string;
        signature: string;
        timestamp: number;
        api_key: string;
        cloud_name: string;
        public_id: string;
        folder: string;
    }> {
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
    async findByToken(
        @Param('token') token: string,
    ): Promise<MaisonTransitRequestResponseDto> {
        return this.requestsService.findByToken(token);
    }
}
