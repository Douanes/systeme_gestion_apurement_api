"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AgentService = class AgentService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    toResponseDto(agent) {
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
    async create(createAgentDto) {
        if (createAgentDto.matricule) {
            const existingAgent = await this.prisma.agent.findFirst({
                where: {
                    matricule: createAgentDto.matricule,
                },
            });
            if (existingAgent) {
                throw new common_1.ConflictException(`Un agent avec le matricule "${createAgentDto.matricule}" existe déjà`);
            }
        }
        if (createAgentDto.email) {
            const existingEmail = await this.prisma.agent.findFirst({
                where: {
                    email: createAgentDto.email,
                },
            });
            if (existingEmail) {
                throw new common_1.ConflictException(`Un agent avec l'email "${createAgentDto.email}" existe déjà`);
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
    async findAll(paginationQuery) {
        const { page = 1, limit = 10, search, isActive, officeId, grade, sortBy = 'createdAt', sortOrder = 'desc', } = paginationQuery;
        const skip = (page - 1) * limit;
        const where = {};
        if (isActive !== undefined) {
            where.isActive = isActive;
        }
        if (officeId) {
            where.officeId = officeId;
        }
        if (grade) {
            where.grade = {
                contains: grade,
            };
        }
        if (search) {
            where.OR = [
                { matricule: { contains: search } },
                { firstname: { contains: search } },
                { lastname: { contains: search } },
                { email: { contains: search } },
                { phone: { contains: search } },
            ];
        }
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
    async findOne(id) {
        const agent = await this.prisma.agent.findUnique({
            where: { id },
            include: {
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
            throw new common_1.NotFoundException(`Agent non trouvé`);
        }
        return {
            ...this.toResponseDto(agent),
            bureauAffectation: agent.bureauAffectation,
            declarations: agent.declarations,
        };
    }
    async update(id, updateAgentDto) {
        await this.findOne(id);
        if (updateAgentDto.matricule) {
            const existingAgent = await this.prisma.agent.findFirst({
                where: {
                    matricule: updateAgentDto.matricule,
                    id: { not: id },
                },
            });
            if (existingAgent) {
                throw new common_1.ConflictException(`Un agent avec le matricule "${updateAgentDto.matricule}" existe déjà`);
            }
        }
        if (updateAgentDto.email) {
            const existingEmail = await this.prisma.agent.findFirst({
                where: {
                    email: updateAgentDto.email,
                    id: { not: id },
                },
            });
            if (existingEmail) {
                throw new common_1.ConflictException(`Un agent avec l'email "${updateAgentDto.email}" existe déjà`);
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
    async remove(id) {
        await this.findOne(id);
        await this.prisma.agent.update({
            where: { id },
            data: {
                isActive: false,
                updatedAt: new Date(),
            },
        });
    }
    async activate(id) {
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
    async deactivate(id) {
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
    async getStatistics(id) {
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
};
exports.AgentService = AgentService;
exports.AgentService = AgentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AgentService);
//# sourceMappingURL=agent.service.js.map