import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
    ForbiddenException,
    Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import {
    InviteTransitaireDto,
    SubmitMaisonTransitRequestDto,
    ReviewRequestDto,
    ActivateAccountDto,
    MaisonTransitRequestResponseDto,
    InvitationResponseDto,
    PaginatedRequestsResponseDto,
    RequestFilterDto,
    RequestStatus,
} from 'libs/dto/maison-transit-requests';
import { UserRole } from 'libs/dto/auth';

@Injectable()
export class MaisonTransitRequestsService {
    private readonly logger = new Logger(MaisonTransitRequestsService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly mailService: MailService,
        private readonly cloudinaryService: CloudinaryService,
        private readonly configService: ConfigService,
    ) {}

    /**
     * Inviter un transitaire (Admin/Agent uniquement)
     */
    async inviteTransitaire(
        dto: InviteTransitaireDto,
        currentUserId: number,
    ): Promise<InvitationResponseDto> {
        // Vérifier les permissions de l'utilisateur
        const currentUser = await this.prisma.user.findUnique({
            where: { id: currentUserId },
        });

        if (!currentUser || (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.AGENT)) {
            throw new ForbiddenException(
                'Seuls les administrateurs et agents peuvent inviter des transitaires',
            );
        }

        // Vérifier que l'email n'existe pas déjà
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new ConflictException(
                'Un utilisateur avec cet email existe déjà',
            );
        }

        // Vérifier s'il y a déjà une demande en attente pour cet email
        const existingRequest = await this.prisma.maisonTransitRequest.findFirst({
            where: {
                email: dto.email,
                status: {
                    in: [RequestStatus.EN_ATTENTE, RequestStatus.EN_REVISION],
                },
                deletedAt: null,
            },
        });

        if (existingRequest) {
            throw new ConflictException(
                'Une demande est déjà en cours pour cet email',
            );
        }

        // Générer le token d'invitation (valide 30 jours)
        const invitationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiresAt = new Date();
        tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 30);

        // Créer la demande
        const request = await this.prisma.maisonTransitRequest.create({
            data: {
                email: dto.email,
                companyName: dto.companyName,
                invitationToken,
                tokenExpiresAt,
                invitedById: currentUserId,
                status: RequestStatus.EN_ATTENTE,
            },
        });

        // Envoyer l'email d'invitation
        try {
            await this.mailService.sendTransitaireInvitationEmail(
                dto.email,
                dto.companyName,
                `${currentUser.firstname} ${currentUser.lastname}`,
                invitationToken,
            );
            this.logger.log(
                `Invitation envoyée à ${dto.email} par ${currentUser.username}`,
            );
        } catch (error) {
            this.logger.error(
                `Erreur lors de l'envoi de l'email d'invitation: ${error.message}`,
            );
        }

        return {
            message: 'Invitation envoyée avec succès',
            invitationToken,
            expiresAt: tokenExpiresAt,
        };
    }

    /**
     * Soumettre une demande avec documents
     */
    async submitRequest(
        dto: SubmitMaisonTransitRequestDto,
    ): Promise<MaisonTransitRequestResponseDto> {
        // Trouver la demande par token
        const request = await this.prisma.maisonTransitRequest.findUnique({
            where: { invitationToken: dto.invitationToken },
        });

        if (!request) {
            throw new NotFoundException('Invitation non trouvée');
        }

        // Vérifier que le token n'a pas expiré
        if (new Date() > request.tokenExpiresAt) {
            await this.prisma.maisonTransitRequest.update({
                where: { id: request.id },
                data: { status: RequestStatus.EXPIRE },
            });
            throw new BadRequestException('L\'invitation a expiré');
        }

        // Vérifier que la demande est en attente
        if (request.status !== RequestStatus.EN_ATTENTE) {
            throw new BadRequestException(
                'Cette demande a déjà été soumise ou traitée',
            );
        }

        // Vérifier que l'email correspond
        if (request.email !== dto.email) {
            throw new BadRequestException(
                'L\'email ne correspond pas à l\'invitation',
            );
        }

        // Mettre à jour la demande et ajouter les documents dans une transaction
        const updatedRequest = await this.prisma.$transaction(async (tx) => {
            // Mettre à jour la demande
            const updated = await tx.maisonTransitRequest.update({
                where: { id: request.id },
                data: {
                    companyName: dto.companyName,
                    phone: dto.phone,
                    address: dto.address,
                    ninea: dto.ninea,
                    registreCommerce: dto.registreCommerce,
                    status: RequestStatus.EN_REVISION,
                },
            });

            // Créer les documents
            for (const doc of dto.documents) {
                await tx.requestDocument.create({
                    data: {
                        requestId: updated.id,
                        type: doc.type,
                        fileName: doc.fileName,
                        fileUrl: doc.fileUrl,
                        fileSize: doc.fileSize,
                        mimeType: doc.mimeType,
                        cloudinaryId: doc.cloudinaryId,
                    },
                });
            }

            return updated;
        });

        // Notifier les admins qu'une nouvelle demande a été soumise
        try {
            const invitedBy = await this.prisma.user.findUnique({
                where: { id: request.invitedById },
            });

            if (invitedBy) {
                await this.mailService.sendRequestSubmittedNotificationEmail(
                    invitedBy.email,
                    dto.companyName,
                );
            }
        } catch (error) {
            this.logger.error(
                `Erreur lors de l'envoi de la notification: ${error.message}`,
            );
        }

        return this.toResponseDto(updatedRequest);
    }

    /**
     * Valider ou rejeter une demande (Admin uniquement)
     */
    async reviewRequest(
        requestId: number,
        dto: ReviewRequestDto,
        currentUserId: number,
    ): Promise<MaisonTransitRequestResponseDto> {
        // Vérifier les permissions
        const currentUser = await this.prisma.user.findUnique({
            where: { id: currentUserId },
        });

        if (!currentUser || currentUser.role !== UserRole.ADMIN) {
            throw new ForbiddenException(
                'Seuls les administrateurs peuvent valider des demandes',
            );
        }

        // Trouver la demande
        const request = await this.prisma.maisonTransitRequest.findUnique({
            where: { id: requestId, deletedAt: null },
            include: { documents: true },
        });

        if (!request) {
            throw new NotFoundException('Demande non trouvée');
        }

        // Vérifier que la demande est en révision
        if (request.status !== RequestStatus.EN_REVISION) {
            throw new BadRequestException(
                'Cette demande ne peut pas être validée dans son état actuel',
            );
        }

        // Mettre à jour la demande
        const updatedRequest = await this.prisma.maisonTransitRequest.update({
            where: { id: requestId },
            data: {
                status: dto.status,
                reviewedById: currentUserId,
                reviewedAt: new Date(),
                rejectionReason: dto.rejectionReason,
            },
            include: { documents: true },
        });

        // Envoyer un email selon le statut
        try {
            if (dto.status === RequestStatus.APPROUVE) {
                await this.mailService.sendRequestApprovedEmail(
                    request.email,
                    request.companyName,
                    request.invitationToken,
                );
            } else if (dto.status === RequestStatus.REJETE) {
                await this.mailService.sendRequestRejectedEmail(
                    request.email,
                    request.companyName,
                    dto.rejectionReason || 'Non spécifié',
                );

                // Supprimer les documents uploadés
                if (request.documents.length > 0) {
                    const cloudinaryIds = request.documents
                        .filter((doc) => doc.cloudinaryId)
                        .map((doc) => doc.cloudinaryId as string);
                    if (cloudinaryIds.length > 0) {
                        await this.cloudinaryService.deleteFiles(cloudinaryIds);
                    }
                }
            }
        } catch (error) {
            this.logger.error(
                `Erreur lors de l'envoi de l'email de notification: ${error.message}`,
            );
        }

        this.logger.log(
            `Demande ${requestId} ${dto.status} par ${currentUser.username}`,
        );

        return this.toResponseDto(updatedRequest);
    }

    /**
     * Activer le compte après approbation
     */
    async activateAccount(
        dto: ActivateAccountDto,
    ): Promise<{ message: string; userId: number }> {
        // Trouver la demande approuvée par token
        const request = await this.prisma.maisonTransitRequest.findUnique({
            where: { invitationToken: dto.activationToken },
        });

        if (!request) {
            throw new NotFoundException('Token d\'activation invalide');
        }

        // Vérifier que la demande est approuvée
        if (request.status !== RequestStatus.APPROUVE) {
            throw new BadRequestException(
                'Cette demande n\'a pas été approuvée',
            );
        }

        // Vérifier que le compte n'a pas déjà été activé
        if (request.activatedAt) {
            throw new BadRequestException('Ce compte a déjà été activé');
        }

        // Vérifier que le username n'existe pas
        const existingUsername = await this.prisma.user.findUnique({
            where: { username: dto.username },
        });

        if (existingUsername) {
            throw new ConflictException('Ce nom d\'utilisateur est déjà pris');
        }

        // Hasher le mot de passe
        const saltRounds = parseInt(
            this.configService.get<string>('BCRYPT_ROUNDS', '10'),
            10,
        );
        const passwordHash = await bcrypt.hash(dto.password, saltRounds);

        // Créer l'utilisateur et la maison de transit dans une transaction
        const result = await this.prisma.$transaction(async (tx) => {
            // Créer l'utilisateur
            const user = await tx.user.create({
                data: {
                    username: dto.username,
                    email: request.email,
                    passwordHash,
                    firstname: dto.firstname,
                    lastname: dto.lastname,
                    phone: dto.phone,
                    role: UserRole.TRANSITAIRE,
                    isActive: true,
                    emailVerified: true,
                    emailVerifiedAt: new Date(),
                },
            });

            // Créer la maison de transit
            const maisonTransit = await tx.maisonTransit.create({
                data: {
                    code: `MT-${request.ninea?.substring(0, 8) || user.id}`,
                    name: request.companyName,
                    address: request.address,
                    phone: request.phone,
                    email: request.email,
                    responsableId: user.id,
                    isActive: true,
                },
            });

            // Associer l'utilisateur à la maison de transit
            await tx.userMaisonTransit.create({
                data: {
                    userId: user.id,
                    maisonTransitId: maisonTransit.id,
                    role: 'RESPONSABLE',
                    assignedBy: request.invitedById,
                },
            });

            // Marquer la demande comme activée
            await tx.maisonTransitRequest.update({
                where: { id: request.id },
                data: { activatedAt: new Date() },
            });

            return { user, maisonTransit };
        });

        this.logger.log(
            `Compte activé pour ${result.user.username}, Maison de transit créée: ${result.maisonTransit.name}`,
        );

        return {
            message: 'Compte activé avec succès',
            userId: result.user.id,
        };
    }

    /**
     * Lister les demandes avec filtres
     */
    async findAll(
        filters: RequestFilterDto,
    ): Promise<PaginatedRequestsResponseDto> {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const skip = (page - 1) * limit;

        const where: any = {
            deletedAt: null,
        };

        if (filters.status) {
            where.status = filters.status;
        }

        if (filters.email) {
            where.email = filters.email;
        }

        if (filters.search) {
            where.OR = [
                { companyName: { contains: filters.search, mode: 'insensitive' } },
                { email: { contains: filters.search, mode: 'insensitive' } },
                { ninea: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        const total = await this.prisma.maisonTransitRequest.count({ where });

        const requests = await this.prisma.maisonTransitRequest.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: { documents: true },
        });

        return {
            data: requests.map((req) => this.toResponseDto(req)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Récupérer une demande par ID
     */
    async findOne(id: number): Promise<MaisonTransitRequestResponseDto> {
        const request = await this.prisma.maisonTransitRequest.findUnique({
            where: { id, deletedAt: null },
            include: { documents: true },
        });

        if (!request) {
            throw new NotFoundException('Demande non trouvée');
        }

        return this.toResponseDto(request);
    }

    /**
     * Récupérer une demande par token
     */
    async findByToken(token: string): Promise<MaisonTransitRequestResponseDto> {
        const request = await this.prisma.maisonTransitRequest.findUnique({
            where: { invitationToken: token },
            include: { documents: true },
        });

        if (!request) {
            throw new NotFoundException('Invitation non trouvée');
        }

        return this.toResponseDto(request);
    }

    /**
     * Convertir en DTO
     */
    private toResponseDto(request: any): MaisonTransitRequestResponseDto {
        return {
            id: request.id,
            email: request.email,
            companyName: request.companyName,
            phone: request.phone,
            address: request.address,
            ninea: request.ninea,
            registreCommerce: request.registreCommerce,
            status: request.status,
            invitationToken: request.invitationToken,
            tokenExpiresAt: request.tokenExpiresAt,
            invitedById: request.invitedById,
            reviewedById: request.reviewedById,
            reviewedAt: request.reviewedAt,
            rejectionReason: request.rejectionReason,
            activatedAt: request.activatedAt,
            createdAt: request.createdAt,
            updatedAt: request.updatedAt,
            documents: request.documents?.map((doc) => ({
                id: doc.id,
                type: doc.type,
                fileName: doc.fileName,
                fileUrl: doc.fileUrl,
                fileSize: doc.fileSize,
                mimeType: doc.mimeType,
                uploadedAt: doc.uploadedAt,
            })),
        };
    }
}
