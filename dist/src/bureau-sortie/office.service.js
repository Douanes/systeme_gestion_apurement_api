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
exports.BureauSortieService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let BureauSortieService = class BureauSortieService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    toResponseDto(bureauSortie) {
        return {
            id: bureauSortie.id,
            code: bureauSortie.code,
            name: bureauSortie.name,
            localisation: bureauSortie.localisation,
            paysFrontiere: bureauSortie.paysFrontiere,
            isActive: bureauSortie.isActive,
            createdAt: bureauSortie.createdAt,
            updatedAt: bureauSortie.updatedAt,
        };
    }
    async create(createBureauSortieDto) {
        const existingBureau = await this.prisma.bureauSortie.findFirst({
            where: {
                code: createBureauSortieDto.code,
                deletedAt: null,
            },
        });
        if (existingBureau) {
            throw new common_1.ConflictException(`Un bureau de sortie avec le code "${createBureauSortieDto.code}" existe déjà`);
        }
        const bureauSortie = await this.prisma.bureauSortie.create({
            data: {
                code: createBureauSortieDto.code,
                name: createBureauSortieDto.name,
                localisation: createBureauSortieDto.localisation,
                paysFrontiere: createBureauSortieDto.paysFrontiere,
                isActive: createBureauSortieDto.isActive ?? true,
            },
        });
        return this.toResponseDto(bureauSortie);
    }
    async findAll(paginationQuery) {
        const { page = 1, limit = 10, search, isActive, paysFrontiere, sortBy = 'createdAt', sortOrder = 'desc', } = paginationQuery;
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
        };
        if (isActive !== undefined) {
            where.isActive = isActive;
        }
        if (paysFrontiere) {
            where.paysFrontiere = {
                contains: paysFrontiere,
            };
        }
        if (search) {
            where.OR = [
                { code: { contains: search } },
                { name: { contains: search } },
                { localisation: { contains: search } },
                { paysFrontiere: { contains: search } },
            ];
        }
        const [bureaux, total] = await Promise.all([
            this.prisma.bureauSortie.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [sortBy]: sortOrder,
                },
            }),
            this.prisma.bureauSortie.count({ where }),
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            data: bureaux.map((bureau) => this.toResponseDto(bureau)),
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
        const bureauSortie = await this.prisma.bureauSortie.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                declarations: true,
                agents: true,
                ordreMissions: true,
            },
        });
        if (!bureauSortie) {
            throw new common_1.NotFoundException(`Bureau de sortie avec l'ID ${id} non trouvé`);
        }
        return {
            ...this.toResponseDto(bureauSortie),
            declarations: bureauSortie.declarations,
            agents: bureauSortie.agents,
            ordreMissions: bureauSortie.ordreMissions,
        };
    }
    async update(id, updateBureauSortieDto) {
        await this.findOne(id);
        if (updateBureauSortieDto.code) {
            const existingBureau = await this.prisma.bureauSortie.findFirst({
                where: {
                    code: updateBureauSortieDto.code,
                    id: { not: id },
                    deletedAt: null,
                },
            });
            if (existingBureau) {
                throw new common_1.ConflictException(`Un bureau de sortie avec le code "${updateBureauSortieDto.code}" existe déjà`);
            }
        }
        const bureauSortie = await this.prisma.bureauSortie.update({
            where: { id },
            data: {
                code: updateBureauSortieDto.code,
                name: updateBureauSortieDto.name,
                localisation: updateBureauSortieDto.localisation,
                paysFrontiere: updateBureauSortieDto.paysFrontiere,
                isActive: updateBureauSortieDto.isActive,
                updatedAt: new Date(),
            },
        });
        return this.toResponseDto(bureauSortie);
    }
    async remove(id) {
        await this.findOne(id);
        const relationsCount = await this.prisma.bureauSortie.findUnique({
            where: { id },
            select: {
                _count: {
                    select: {
                        declarations: true,
                        agents: true,
                        ordreMissions: true,
                    },
                },
            },
        });
        if (relationsCount) {
            const totalRelations = relationsCount._count.declarations +
                relationsCount._count.agents +
                relationsCount._count.ordreMissions;
            if (totalRelations > 0) {
                throw new common_1.ConflictException(`Impossible de supprimer ce bureau de sortie car il est associé à ${totalRelations} enregistrement(s) ` +
                    `(${relationsCount._count.declarations} déclaration(s), ` +
                    `${relationsCount._count.agents} agent(s), ` +
                    `${relationsCount._count.ordreMissions} ordre(s) de mission)`);
            }
        }
        await this.prisma.bureauSortie.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
    async findAllActive() {
        const bureaux = await this.prisma.bureauSortie.findMany({
            where: {
                deletedAt: null,
                isActive: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
        return bureaux.map((bureau) => this.toResponseDto(bureau));
    }
    async activate(id) {
        await this.findOne(id);
        const bureauSortie = await this.prisma.bureauSortie.update({
            where: { id },
            data: {
                isActive: true,
                updatedAt: new Date(),
            },
        });
        return this.toResponseDto(bureauSortie);
    }
    async deactivate(id) {
        await this.findOne(id);
        const bureauSortie = await this.prisma.bureauSortie.update({
            where: { id },
            data: {
                isActive: false,
                updatedAt: new Date(),
            },
        });
        return this.toResponseDto(bureauSortie);
    }
    async getStatistics(id) {
        await this.findOne(id);
        const stats = await this.prisma.bureauSortie.findUnique({
            where: { id },
            select: {
                _count: {
                    select: {
                        declarations: true,
                        agents: true,
                        ordreMissions: true,
                    },
                },
            },
        });
        return {
            bureauId: id,
            totalDeclarations: stats?._count.declarations || 0,
            totalAgents: stats?._count.agents || 0,
            totalOrdreMissions: stats?._count.ordreMissions || 0,
        };
    }
};
exports.BureauSortieService = BureauSortieService;
exports.BureauSortieService = BureauSortieService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BureauSortieService);
//# sourceMappingURL=office.service.js.map