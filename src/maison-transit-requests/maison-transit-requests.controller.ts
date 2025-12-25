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
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
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
        @Body() body: { folder?: string; public_id?: string },
    ): Promise<{
        signature: string;
        timestamp: number;
        api_key: string;
        cloud_name: string;
    }> {
        return this.cloudinaryService.generateSignature({
            folder: body.folder || 'maison-transit-documents',
            public_id: body.public_id,
            upload_preset: 'mt_documents',
        });
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
