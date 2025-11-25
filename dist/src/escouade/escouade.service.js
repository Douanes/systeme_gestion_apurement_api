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
exports.EscouadeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let EscouadeService = class EscouadeService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    toResponseDto(escouade) {
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
    async create(createEscouadeDto) {
        const existingEscouade = await this.prisma.escouade.findFirst({
            where: {
                name: createEscouadeDto.name,
                deletedAt: null,
            },
        });
        if (existingEscouade) {
            throw new common_1.ConflictException(`Une escouade avec le nom "${createEscouadeDto.name}" existe déjà`);
        }
        if (createEscouadeDto.chefId &&
            createEscouadeDto.adjointId &&
            createEscouadeDto.chefId === createEscouadeDto.adjointId) {
            throw new common_1.BadRequestException('Le chef et l\'adjoint doivent être des agents différents');
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
    async findAll(paginationQuery) {
        const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc', } = paginationQuery;
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
        };
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } },
            ];
        }
        const [escouades, total] = await Promise.all([
            this.prisma.escouade.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [sortBy]: sortOrder,
                },
            }),
            this.prisma.escouade.count({ where }),
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            data: escouades.map((escouade) => this.toResponseDto(escouade)),
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
            }
        });
        if (!escouade) {
            throw new common_1.NotFoundException(`Escouade avec l'ID ${id} non trouvée`);
        }
        return {
            ...this.toResponseDto(escouade),
            chef: escouade.chef,
            adjoint: escouade.adjoint,
            escouadeAgents: escouade.escouadeAgents,
        };
    }
    async update(id, updateEscouadeDto) {
        await this.findOne(id);
        if (updateEscouadeDto.name) {
            const existingEscouade = await this.prisma.escouade.findFirst({
                where: {
                    name: updateEscouadeDto.name,
                    id: { not: id },
                    deletedAt: null,
                },
            });
            if (existingEscouade) {
                throw new common_1.ConflictException(`Une escouade avec le nom "${updateEscouadeDto.name}" existe déjà`);
            }
        }
        if (updateEscouadeDto.chefId &&
            updateEscouadeDto.adjointId &&
            updateEscouadeDto.chefId === updateEscouadeDto.adjointId) {
            throw new common_1.BadRequestException('Le chef et l\'adjoint doivent être des agents différents');
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
    async remove(id) {
        await this.findOne(id);
        const agentsCount = await this.prisma.escouadeAgents.count({
            where: { escouadeId: id },
        });
        if (agentsCount > 0) {
            throw new common_1.ConflictException(`Impossible de supprimer cette escouade car elle contient ${agentsCount} agent(s). ` +
                `Veuillez d'abord retirer tous les agents.`);
        }
        await this.prisma.escouade.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
    async addAgent(escouadeId, agentId) {
        await this.findOne(escouadeId);
        const agent = await this.prisma.agent.findUnique({
            where: { id: agentId },
        });
        if (!agent) {
            throw new common_1.NotFoundException(`Agent avec l'ID ${agentId} non trouvé`);
        }
        const existingMember = await this.prisma.escouadeAgents.findUnique({
            where: {
                escouadeId_agentId: {
                    escouadeId,
                    agentId,
                },
            },
        });
        if (existingMember) {
            throw new common_1.ConflictException(`L'agent est déjà membre de cette escouade`);
        }
        await this.prisma.escouadeAgents.create({
            data: {
                escouadeId,
                agentId,
            },
        });
    }
    async removeAgent(escouadeId, agentId) {
        await this.findOne(escouadeId);
        const member = await this.prisma.escouadeAgents.findUnique({
            where: {
                escouadeId_agentId: {
                    escouadeId,
                    agentId,
                },
            },
        });
        if (!member) {
            throw new common_1.NotFoundException(`L'agent n'est pas membre de cette escouade`);
        }
        await this.prisma.escouadeAgents.delete({
            where: {
                escouadeId_agentId: {
                    escouadeId,
                    agentId,
                },
            },
        });
    }
    async getStatistics(id) {
        await this.findOne(id);
        const agentsCount = await this.prisma.escouadeAgents.count({
            where: { escouadeId: id },
        });
        return {
            escouadeId: id,
            totalAgents: agentsCount,
        };
    }
    async assignChef(escouadeId, chefId) {
        const escouade = await this.findOne(escouadeId);
        const chef = await this.prisma.agent.findUnique({
            where: { id: chefId },
        });
        if (!chef) {
            throw new common_1.NotFoundException(`Agent avec l'ID ${chefId} non trouvé`);
        }
        if (escouade.adjointId === chefId) {
            throw new common_1.BadRequestException('Le chef ne peut pas être le même que l\'adjoint');
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
    async assignAdjoint(escouadeId, adjointId) {
        const escouade = await this.findOne(escouadeId);
        const adjoint = await this.prisma.agent.findUnique({
            where: { id: adjointId },
        });
        if (!adjoint) {
            throw new common_1.NotFoundException(`Agent non trouvé`);
        }
        if (escouade.chefId === adjointId) {
            throw new common_1.BadRequestException('L\'adjoint ne peut pas être le même que le chef');
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
};
exports.EscouadeService = EscouadeService;
exports.EscouadeService = EscouadeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EscouadeService);
//# sourceMappingURL=escouade.service.js.map