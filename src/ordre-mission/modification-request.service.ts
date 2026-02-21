import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import {
    CreateModificationRequestDto,
    ReviewModificationRequestDto,
    ModificationRequestResponseDto,
    ModificationRequestStatus,
} from 'libs/dto/ordre-mission/mission.dto';
import { ModificationRequestQueryDto } from 'libs/dto/ordre-mission/modification-request-query.dto';
import { UserRole } from 'libs/dto/auth';
import { PaginatedResponseDto } from 'libs/dto/global/response.dto';

@Injectable()
export class ModificationRequestService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationService: NotificationService,
    ) {}

    /**
     * Créer une demande de modification (Transitaire uniquement)
     */
    async createRequest(
        ordreMissionId: number,
        dto: CreateModificationRequestDto,
        currentUser: { id: number; role: string },
    ): Promise<ModificationRequestResponseDto> {
        const ordreMission = await this.prisma.ordreMission.findUnique({
            where: { id: ordreMissionId },
        });

        if (!ordreMission || ordreMission.deletedAt) {
            throw new NotFoundException(`Ordre de mission ${ordreMissionId} non trouvé`);
        }

        // Vérifier s'il y a déjà une demande en attente
        const existingRequest = await (this.prisma as any).ordreMissionModificationRequest.findFirst({
            where: {
                ordreMissionId,
                status: ModificationRequestStatus.PENDING,
            },
        });

        if (existingRequest) {
            throw new BadRequestException('Une demande de modification est déjà en attente pour cet ordre de mission');
        }

        const request = await (this.prisma as any).ordreMissionModificationRequest.create({
            data: {
                ordreMissionId,
                requesterId: currentUser.id,
                reason: dto.reason,
                type: dto.type as any,
                status: ModificationRequestStatus.PENDING,
            },
            include: {
                requester: { select: { id: true, firstname: true, lastname: true } },
            },
        });

        // Notifier les agents/admins
        const agents = await this.prisma.user.findMany({
            where: {
                role: { in: [UserRole.AGENT, UserRole.ADMIN] },
                isActive: true,
            },
        });

        for (const agent of agents) {
            await this.notificationService.createNotification({
                userId: agent.id,
                title: 'Nouvelle demande de rectification',
                message: `Une demande de modification a été soumise pour l'ordre #${ordreMission.number} par ${request.requester.firstname} ${request.requester.lastname}`,
                type: 'INFO',
                relatedId: ordreMissionId,
            });
        }

        return this.toResponseDto(request);
    }

    /**
     * Valider ou rejeter une demande (Agent/Admin uniquement)
     */
    async reviewRequest(
        requestId: number,
        dto: ReviewModificationRequestDto,
        currentUser: { id: number; role: string },
    ): Promise<ModificationRequestResponseDto> {
        const request = await (this.prisma as any).ordreMissionModificationRequest.findUnique({
            where: { id: requestId },
            include: {
                ordreMission: true,
                requester: true,
            },
        });

        if (!request) {
            throw new NotFoundException(`Demande ${requestId} non trouvée`);
        }

        if (request.status !== ModificationRequestStatus.PENDING) {
            throw new BadRequestException('Cette demande a déjà été traitée');
        }

        const updatedRequest = await (this.prisma as any).ordreMissionModificationRequest.update({
            where: { id: requestId },
            data: {
                status: dto.status as any,
                reviewerId: currentUser.id,
                rejectionReason: dto.rejectionReason,
                reviewedAt: new Date(),
            },
            include: {
                requester: { select: { id: true, firstname: true, lastname: true } },
                reviewer: { select: { id: true, firstname: true, lastname: true } },
            },
        });

        // Notifier le transitaire
        const statusLabel = dto.status === ModificationRequestStatus.APPROVED ? 'approuvée' : 'rejetée';
        await this.notificationService.createNotification({
            userId: (request as any).requesterId,
            title: `Demande de rectification ${statusLabel}`,
            message: `Votre demande de modification pour l'ordre #${(request as any).ordreMission.number} a été ${statusLabel}.`,
            type: dto.status === ModificationRequestStatus.APPROVED ? 'SUCCESS' : 'ERROR',
            relatedId: (request as any).ordreMissionId,
        });

        return this.toResponseDto(updatedRequest);
    }

    /**
     * Récupérer toutes les demandes de rectification avec filtres
     */
    async findAll(
        query: ModificationRequestQueryDto,
        currentUser: { role: string; maisonTransitIds?: number[] },
    ): Promise<PaginatedResponseDto<ModificationRequestResponseDto>> {
        const { page = 1, limit = 10, search, maisonTransitId, status } = query;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (status) {
            where.status = status;
        }

        // Filtrer par maison de transit si transitaire
        if (currentUser.role === UserRole.TRANSITAIRE || currentUser.role === UserRole.DECLARANT) {
            where.ordreMission = {
                maisonTransitId: { in: currentUser.maisonTransitIds },
            };
        } else if (maisonTransitId) {
            // Un admin ou agent peut filtrer par maison de transit
            where.ordreMission = {
                maisonTransitId,
            };
        }

        if (search) {
            where.ordreMission = {
                ...where.ordreMission,
                number: { contains: search, mode: 'insensitive' },
            };
        }

        const [requests, total] = await Promise.all([
            (this.prisma as any).ordreMissionModificationRequest.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    requester: { select: { id: true, firstname: true, lastname: true } },
                    reviewer: { select: { id: true, firstname: true, lastname: true } },
                    ordreMission: true,
                },
            }),
            (this.prisma as any).ordreMissionModificationRequest.count({ where }),
        ]);

        return {
            data: requests.map((req) => this.toResponseDto(req)),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrevious: page > 1,
            },
        };
    }

    /**
     * Récupérer la dernière demande d'un ordre
     */
    async getLatestRequest(ordreMissionId: number): Promise<ModificationRequestResponseDto | null> {
        const request = await (this.prisma as any).ordreMissionModificationRequest.findFirst({
            where: { ordreMissionId },
            orderBy: { createdAt: 'desc' },
            include: {
                requester: { select: { id: true, firstname: true, lastname: true } },
                reviewer: { select: { id: true, firstname: true, lastname: true } },
            },
        });

        return request ? this.toResponseDto(request) : null;
    }

    private toResponseDto(request: any): ModificationRequestResponseDto {
        return {
            id: request.id,
            ordreMissionId: request.ordreMissionId,
            requesterId: request.requesterId,
            reviewerId: request.reviewerId,
            reason: request.reason,
            rejectionReason: request.rejectionReason,
            status: request.status as ModificationRequestStatus,
            type: request.type as any,
            createdAt: request.createdAt,
            updatedAt: request.updatedAt,
            reviewedAt: request.reviewedAt,
            requester: request.requester,
            reviewer: request.reviewer,
        };
    }
}
