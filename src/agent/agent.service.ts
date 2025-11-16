import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Agent } from '@prisma/client';
import {
    CreateAgentDto,
    UpdateAgentDto,
    AgentResponseDto,
    AgentWithRelationsDto,
} from 'libs/dto/agent/agent.dto';
import { AgentPaginationQueryDto } from 'libs/dto/agent/pagination.dto';
import { PaginatedResponseDto } from 'libs/dto/global/response.dto';

@Injectable()
export class AgentService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Transform Prisma Agent to AgentResponseDto
     */
    private toResponseDto(agent: Agent): AgentResponseDto {
        return {
            id: agent.id,
            matricule: agent.matricule,
            grade: agent.grade,
            firstname: agent.firstname,
            lastname: agent.lastname,
            phone: agent.phone,
            email: agent.email,
            affectedAt: agent.affectedAt,
            officeId: agent.officeId,
            isActive: agent.isActive,
            createdAt: agent.createdAt,
            updatedAt: agent.updatedAt,
        };
    }

    /**
     * Créer un nouvel agent
     */
    async create(createAgentDto: CreateAgentDto): Promise<AgentResponseDto> {
        // Vérifier si un agent avec le même matricule existe déjà
        if (createAgentDto.matricule) {
            const existingAgent = await this.prisma.agent.findFirst({
                where: {
                    matricule: createAgentDto.matricule,
                },
            });

            if (existingAgent) {
                throw new ConflictException(
                    `Un agent avec le matricule "${createAgentDto.matricule}" existe déjà`,
                );
            }
        }

        // Vérifier si un agent avec le même email existe déjà
        if (createAgentDto.email) {
            const existingEmail = await this.prisma.agent.findFirst({
                where: {
                    email: createAgentDto.email,
                },
            });

            if (existingEmail) {
                throw new ConflictException(
                    `Un agent avec l'email "${createAgentDto.email}" existe déjà`,
                );
            }
        }

        const agent = await this.prisma.agent.create({
            data: {
                matricule: createAgentDto.matricule,
                grade: createAgentDto.grade,
                firstname: createAgentDto.firstname,
                lastname: createAgentDto.lastname,
                phone: createAgentDto.phone,
                email: createAgentDto.email,
                affectedAt: createAgentDto.affectedAt
                    ? new Date(createAgentDto.affectedAt)
                    : null,
                officeId: createAgentDto.officeId,
                isActive: createAgentDto.isActive ?? true,
            },
        });

        return this.toResponseDto(agent);
    }

    /**
     * Récupérer tous les agents avec pagination et filtres
     */
    async findAll(
        paginationQuery: AgentPaginationQueryDto,
    ): Promise<PaginatedResponseDto<AgentResponseDto>> {
        const {
            page = 1,
            limit = 10,
            search,
            isActive,
            officeId,
            grade,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = paginationQuery;

        const skip = (page - 1) * limit;

        // Construction du filtre de recherche
        const where: any = {};

        // Filtre par statut actif
        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        // Filtre par bureau d'affectation
        if (officeId) {
            where.officeId = officeId;
        }

        // Filtre par grade
        if (grade) {
            where.grade = {
                contains: grade,
            };
        }

        // Recherche textuelle
        if (search) {
            where.OR = [
                { matricule: { contains: search } },
                { firstname: { contains: search } },
                { lastname: { contains: search } },
                { email: { contains: search } },
                { phone: { contains: search } },
            ];
        }

        // Récupération des données
        const [agents, total] = await Promise.all([
            this.prisma.agent.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [sortBy]: sortOrder,
                },
            }),
            this.prisma.agent.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data: agents.map((agent) => this.toResponseDto(agent)),
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
     * Récupérer un agent par ID
     */
    async findOne(id: number): Promise<AgentResponseDto | AgentWithRelationsDto> {
        const agent = await this.prisma.agent.findUnique({
            where: { id },
            include:
            {
                bureauAffectation: true,
                declarations: {
                    where: { deletedAt: null },
                    orderBy: { createdAt: 'desc' },
                },
                escouadesAsChef: {
                    where: { deletedAt: null },
                    orderBy: { name: 'asc' },
                },
                escouadesAsAdjoint: {
                    where: { deletedAt: null },
                    orderBy: { name: 'asc' },
                },
                escouadeAgents: {
                    include: {
                        escouade: true,
                    },
                },
                ordreMissions: {
                    where: { deletedAt: null },
                    orderBy: { createdAt: 'desc' },
                },
            }
        });

        if (!agent) {
            console.log(`Agent avec l'id "${id}" non trouvé`);
            throw new NotFoundException(`Agent non trouvé`);
        }

        return {
            ...this.toResponseDto(agent),
            bureauAffectation: agent.bureauAffectation,
            declarations: agent.declarations,
            /* escouadesAsChef: agent.escouadesAsChef,
            escouadesAsAdjoint: agent.escouadesAsAdjoint,
            escouadeAgents: agent.escouadeAgents,
            ordreMissions: agent.ordreMissions, */
        };
    }

    /**
     * Mettre à jour un agent
     */
    async update(
        id: number,
        updateAgentDto: UpdateAgentDto,
    ): Promise<AgentResponseDto> {
        // Vérifier si l'agent existe
        await this.findOne(id);

        // Si le matricule est modifié, vérifier qu'il n'existe pas déjà
        if (updateAgentDto.matricule) {
            const existingAgent = await this.prisma.agent.findFirst({
                where: {
                    matricule: updateAgentDto.matricule,
                    id: { not: id },
                },
            });

            if (existingAgent) {
                throw new ConflictException(
                    `Un agent avec le matricule "${updateAgentDto.matricule}" existe déjà`,
                );
            }
        }

        // Si l'email est modifié, vérifier qu'il n'existe pas déjà
        if (updateAgentDto.email) {
            const existingEmail = await this.prisma.agent.findFirst({
                where: {
                    email: updateAgentDto.email,
                    id: { not: id },
                },
            });

            if (existingEmail) {
                throw new ConflictException(
                    `Un agent avec l'email "${updateAgentDto.email}" existe déjà`,
                );
            }
        }

        const agent = await this.prisma.agent.update({
            where: { id },
            data: {
                matricule: updateAgentDto.matricule,
                grade: updateAgentDto.grade,
                firstname: updateAgentDto.firstname,
                lastname: updateAgentDto.lastname,
                phone: updateAgentDto.phone,
                email: updateAgentDto.email,
                affectedAt: updateAgentDto.affectedAt
                    ? new Date(updateAgentDto.affectedAt)
                    : undefined,
                officeId: updateAgentDto.officeId,
                isActive: updateAgentDto.isActive,
                updatedAt: new Date(),
            },
        });

        return this.toResponseDto(agent);
    }

    /**
     * Supprimer un agent (soft delete via isActive)
     */
    async remove(id: number): Promise<void> {
        // Vérifier si l'agent existe
        await this.findOne(id);

        // Désactiver l'agent au lieu de le supprimer
        await this.prisma.agent.update({
            where: { id },
            data: {
                isActive: false,
                updatedAt: new Date(),
            },
        });
    }

    /**
     * Activer un agent
     */
    async activate(id: number): Promise<AgentResponseDto> {
        await this.findOne(id);

        const agent = await this.prisma.agent.update({
            where: { id },
            data: {
                isActive: true,
                updatedAt: new Date(),
            },
        });

        return this.toResponseDto(agent);
    }

    /**
     * Désactiver un agent
     */
    async deactivate(id: number): Promise<AgentResponseDto> {
        await this.findOne(id);

        const agent = await this.prisma.agent.update({
            where: { id },
            data: {
                isActive: false,
                updatedAt: new Date(),
            },
        });

        return this.toResponseDto(agent);
    }

    /**
     * Récupérer les statistiques d'un agent
     */
    async getStatistics(id: number) {
        await this.findOne(id);

        const stats = await this.prisma.agent.findUnique({
            where: { id },
            select: {
                _count: {
                    select: {
                        declarations: true,
                        escouadesAsChef: true,
                        escouadesAsAdjoint: true,
                        escouadeAgents: true,
                        ordreMissions: true,
                    },
                },
            },
        });

        return {
            agentId: id,
            totalDeclarations: stats?._count.declarations || 0,
            totalEscouadesAsChef: stats?._count.escouadesAsChef || 0,
            totalEscouadesAsAdjoint: stats?._count.escouadesAsAdjoint || 0,
            totalEscouadesMember: stats?._count.escouadeAgents || 0,
            totalOrdreMissions: stats?._count.ordreMissions || 0,
        };
    }
}