import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Escouade } from '@prisma/client';
import {
    CreateEscouadeDto,
    UpdateEscouadeDto,
    EscouadeResponseDto,
    EscouadeWithRelationsDto,
} from 'libs/dto/escouade/escouade.dto';
import { EscouadePaginationQueryDto } from 'libs/dto/escouade/pagination.dto';
import { PaginatedResponseDto } from 'libs/dto/global/response.dto';

@Injectable()
export class EscouadeService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Transform Prisma Escouade to EscouadeResponseDto
     */
    private toResponseDto(escouade: Escouade): EscouadeResponseDto {
        return {
            id: escouade.id,
            name: escouade.name,
            description: escouade.description,
            operationalDate: escouade.operationalDate,
            chefId: escouade.chefId,
            adjointId: escouade.adjointId,
            createdAt: escouade.createdAt,
            updatedAt: escouade.updatedAt,
        };
    }

    /**
     * Transform Prisma Escouade with relations to EscouadeWithRelationsDto
     */
    private toResponseDtoWithRelations(escouade: any, includeTotalAgents = false): EscouadeWithRelationsDto {
        const dto: EscouadeWithRelationsDto = {
            ...this.toResponseDto(escouade),
            chef: escouade.chef || null,
            adjoint: escouade.adjoint || null,
            escouadeAgents: escouade.escouadeAgents || undefined,
        };

        // Ajouter le nombre d'agents si demandé (pour findAll)
        if (includeTotalAgents && escouade._count?.escouadeAgents !== undefined) {
            dto.totalAgents = escouade._count.escouadeAgents;
        }

        return dto;
    }

    /**
     * Créer une nouvelle escouade
     */
    async create(createEscouadeDto: CreateEscouadeDto): Promise<EscouadeResponseDto> {
        // Vérifier si une escouade avec le même nom existe déjà
        const existingEscouade = await this.prisma.escouade.findFirst({
            where: {
                name: createEscouadeDto.name,
                deletedAt: null,
            },
        });

        if (existingEscouade) {
            throw new ConflictException(
                `Une escouade avec le nom "${createEscouadeDto.name}" existe déjà`,
            );
        }

        // Vérifier que chef et adjoint sont différents
        if (
            createEscouadeDto.chefId &&
            createEscouadeDto.adjointId &&
            createEscouadeDto.chefId === createEscouadeDto.adjointId
        ) {
            throw new BadRequestException(
                'Le chef et l\'adjoint doivent être des agents différents',
            );
        }

        const escouade = await this.prisma.escouade.create({
            data: {
                name: createEscouadeDto.name,
                description: createEscouadeDto.description,
                operationalDate: createEscouadeDto.operationalDate
                    ? new Date(createEscouadeDto.operationalDate)
                    : null,
                chefId: createEscouadeDto.chefId,
                adjointId: createEscouadeDto.adjointId,
            },
        });

        return this.toResponseDto(escouade);
    }

    /**
     * Récupérer toutes les escouades avec pagination et filtres
     */
    async findAll(
        paginationQuery: EscouadePaginationQueryDto,
    ): Promise<PaginatedResponseDto<EscouadeWithRelationsDto>> {
        const {
            page = 1,
            limit = 10,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = paginationQuery;

        const skip = (page - 1) * limit;

        // Construction du filtre de recherche
        const where: any = {
            deletedAt: null,
        };

        // Recherche textuelle
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } },
            ];
        }

        // Récupération des données
        const [escouades, total] = await Promise.all([
            this.prisma.escouade.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [sortBy]: sortOrder,
                },
                include: {
                    chef: true,
                    adjoint: true,
                    _count: {
                        select: {
                            escouadeAgents: true,
                        },
                    },
                },
            }),
            this.prisma.escouade.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data: escouades.map((escouade) => this.toResponseDtoWithRelations(escouade, true)),
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrevious: page > 1,
            },
        };
    }

    /**
     * Récupérer une escouade par ID
     */
    async findOne(id: number): Promise<EscouadeWithRelationsDto> {
        const escouade = await this.prisma.escouade.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                chef: true,
                adjoint: true,
                escouadeAgents: {
                    include: {
                        agent: true,
                    },
                },
                _count: {
                    select: {
                        escouadeAgents: true,
                    },
                },
            }
        });

        if (!escouade) {
            throw new NotFoundException(`Escouade avec l'ID ${id} non trouvée`);
        }

        return this.toResponseDtoWithRelations(escouade, true);
    }

    /**
     * Mettre à jour une escouade
     */
    async update(
        id: number,
        updateEscouadeDto: UpdateEscouadeDto,
    ): Promise<EscouadeResponseDto> {
        // Vérifier si l'escouade existe
        await this.findOne(id);

        // Si le nom est modifié, vérifier qu'il n'existe pas déjà
        if (updateEscouadeDto.name) {
            const existingEscouade = await this.prisma.escouade.findFirst({
                where: {
                    name: updateEscouadeDto.name,
                    id: { not: id },
                    deletedAt: null,
                },
            });

            if (existingEscouade) {
                throw new ConflictException(
                    `Une escouade avec le nom "${updateEscouadeDto.name}" existe déjà`,
                );
            }
        }

        // Vérifier que chef et adjoint sont différents
        if (
            updateEscouadeDto.chefId &&
            updateEscouadeDto.adjointId &&
            updateEscouadeDto.chefId === updateEscouadeDto.adjointId
        ) {
            throw new BadRequestException(
                'Le chef et l\'adjoint doivent être des agents différents',
            );
        }

        const escouade = await this.prisma.escouade.update({
            where: { id },
            data: {
                name: updateEscouadeDto.name,
                description: updateEscouadeDto.description,
                operationalDate: updateEscouadeDto.operationalDate
                    ? new Date(updateEscouadeDto.operationalDate)
                    : undefined,
                chefId: updateEscouadeDto.chefId,
                adjointId: updateEscouadeDto.adjointId,
                updatedAt: new Date(),
            },
        });

        return this.toResponseDto(escouade);
    }

    /**
     * Supprimer une escouade (soft delete)
     */
    async remove(id: number): Promise<void> {
        // Vérifier si l'escouade existe
        await this.findOne(id);

        // Vérifier s'il y a des agents dans l'escouade
        const agentsCount = await this.prisma.escouadeAgents.count({
            where: { escouadeId: id },
        });

        if (agentsCount > 0) {
            throw new ConflictException(
                `Impossible de supprimer cette escouade car elle contient ${agentsCount} agent(s). ` +
                `Veuillez d'abord retirer tous les agents.`,
            );
        }

        // Soft delete
        await this.prisma.escouade.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    /**
     * Ajouter plusieurs agents à l'escouade (un agent ne peut appartenir qu'à une seule escouade)
     */
    async addAgents(
        escouadeId: number,
        agentIds: number[],
    ): Promise<{
        added: Array<{ agentId: number; firstname: string; lastname: string }>;
        notAdded: Array<{ agentId: number; reason: string }>;
    }> {
        await this.findOne(escouadeId);

        const added: Array<{ agentId: number; firstname: string; lastname: string }> = [];
        const notAdded: Array<{ agentId: number; reason: string }> = [];

        for (const agentId of agentIds) {
            // Vérifier que l'agent existe
            const agent = await this.prisma.agent.findUnique({
                where: { id: agentId },
            });

            if (!agent) {
                notAdded.push({ agentId, reason: 'Agent non trouvé' });
                continue;
            }

            // Vérifier que l'agent n'est pas déjà dans cette escouade
            const existingInThis = await this.prisma.escouadeAgents.findUnique({
                where: {
                    escouadeId_agentId: { escouadeId, agentId },
                },
            });

            if (existingInThis) {
                notAdded.push({
                    agentId,
                    reason: 'Déjà membre de cette escouade',
                });
                continue;
            }

            // Vérifier que l'agent n'appartient pas à une autre escouade
            const existingInOther = await this.prisma.escouadeAgents.findFirst({
                where: { agentId },
                include: {
                    escouade: { select: { name: true } },
                },
            });

            if (existingInOther) {
                notAdded.push({
                    agentId,
                    reason: `Déjà membre de l'escouade "${existingInOther.escouade.name}"`,
                });
                continue;
            }

            // Ajouter l'agent
            await this.prisma.escouadeAgents.create({
                data: { escouadeId, agentId },
            });

            added.push({
                agentId,
                firstname: agent.firstname,
                lastname: agent.lastname,
            });
        }

        return { added, notAdded };
    }

    /**
     * Retirer un agent de l'escouade
     */
    async removeAgent(escouadeId: number, agentId: number): Promise<void> {
        // Vérifier que l'escouade existe
        await this.findOne(escouadeId);

        // Vérifier que l'agent est dans l'escouade
        const member = await this.prisma.escouadeAgents.findUnique({
            where: {
                escouadeId_agentId: {
                    escouadeId,
                    agentId,
                },
            },
        });

        if (!member) {
            throw new NotFoundException(
                `L'agent n'est pas membre de cette escouade`,
            );
        }

        // Retirer l'agent
        await this.prisma.escouadeAgents.delete({
            where: {
                escouadeId_agentId: {
                    escouadeId,
                    agentId,
                },
            },
        });
    }

    /**
     * Récupérer les statistiques d'une escouade
     */
    async getStatistics(id: number) {
        await this.findOne(id);

        const agentsCount = await this.prisma.escouadeAgents.count({
            where: { escouadeId: id },
        });

        return {
            escouadeId: id,
            totalAgents: agentsCount,
        };
    }

    /**
     * Assigner un chef à l'escouade
     */
    async assignChef(escouadeId: number, chefId: number): Promise<EscouadeResponseDto> {
        const escouade = await this.findOne(escouadeId);

        // Vérifier que le chef existe
        const chef = await this.prisma.agent.findUnique({
            where: { id: chefId },
        });

        if (!chef) {
            throw new NotFoundException(`Agent avec l'ID ${chefId} non trouvé`);
        }

        // Vérifier que chef et adjoint sont différents
        if (escouade.adjointId === chefId) {
            throw new BadRequestException(
                'Le chef ne peut pas être le même que l\'adjoint',
            );
        }

        const updatedEscouade = await this.prisma.escouade.update({
            where: { id: escouadeId },
            data: {
                chefId,
                updatedAt: new Date(),
            },
        });

        return this.toResponseDto(updatedEscouade);
    }

    /**
     * Assigner un adjoint à l'escouade
     */
    async assignAdjoint(
        escouadeId: number,
        adjointId: number,
    ): Promise<EscouadeResponseDto> {
        const escouade = await this.findOne(escouadeId);

        // Vérifier que l'adjoint existe
        const adjoint = await this.prisma.agent.findUnique({
            where: { id: adjointId },
        });

        if (!adjoint) {
            throw new NotFoundException(`Agent non trouvé`);
        }

        // Vérifier que chef et adjoint sont différents
        if (escouade.chefId === adjointId) {
            throw new BadRequestException(
                'L\'adjoint ne peut pas être le même que le chef',
            );
        }

        const updatedEscouade = await this.prisma.escouade.update({
            where: { id: escouadeId },
            data: {
                adjointId,
                updatedAt: new Date(),
            },
        });

        return this.toResponseDto(updatedEscouade);
    }

    /**
     * Retirer le chef de l'escouade
     */
    async removeChef(escouadeId: number): Promise<EscouadeResponseDto> {
        const escouade = await this.findOne(escouadeId);

        if (!escouade.chefId) {
            throw new BadRequestException('Cette escouade n\'a pas de chef assigné');
        }

        const updatedEscouade = await this.prisma.escouade.update({
            where: { id: escouadeId },
            data: {
                chefId: null,
                updatedAt: new Date(),
            },
        });

        return this.toResponseDto(updatedEscouade);
    }

    /**
     * Retirer l'adjoint de l'escouade
     */
    async removeAdjoint(escouadeId: number): Promise<EscouadeResponseDto> {
        const escouade = await this.findOne(escouadeId);

        if (!escouade.adjointId) {
            throw new BadRequestException('Cette escouade n\'a pas d\'adjoint assigné');
        }

        const updatedEscouade = await this.prisma.escouade.update({
            where: { id: escouadeId },
            data: {
                adjointId: null,
                updatedAt: new Date(),
            },
        });

        return this.toResponseDto(updatedEscouade);
    }
}