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
exports.MaisonTransitService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let MaisonTransitService = class MaisonTransitService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    toResponseDto(maisonTransit) {
        return {
            id: maisonTransit.id,
            code: maisonTransit.code,
            name: maisonTransit.name,
            address: maisonTransit.address,
            phone: maisonTransit.phone,
            email: maisonTransit.email,
            responsableId: maisonTransit.responsableId,
            isActive: maisonTransit.isActive,
            createdAt: maisonTransit.createdAt,
            updatedAt: maisonTransit.updatedAt,
        };
    }
    async create(createMaisonTransitDto) {
        const existingMaison = await this.prisma.maisonTransit.findFirst({
            where: {
                code: createMaisonTransitDto.code,
                deletedAt: null,
            },
        });
        if (existingMaison) {
            throw new common_1.ConflictException(`Une maison de transit avec le code "${createMaisonTransitDto.code}" existe déjà`);
        }
        const maisonTransit = await this.prisma.maisonTransit.create({
            data: {
                code: createMaisonTransitDto.code,
                name: createMaisonTransitDto.name,
                address: createMaisonTransitDto.address,
                phone: createMaisonTransitDto.phone,
                email: createMaisonTransitDto.email,
                responsableId: createMaisonTransitDto.responsableId,
                isActive: createMaisonTransitDto.isActive ?? true,
            },
        });
        return this.toResponseDto(maisonTransit);
    }
    async findAll(paginationQuery) {
        const { page = 1, limit = 10, search, isActive, sortBy = 'createdAt', sortOrder = 'desc', } = paginationQuery;
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
        };
        if (isActive !== undefined) {
            where.isActive = isActive;
        }
        if (search) {
            where.OR = [
                { code: { contains: search } },
                { name: { contains: search } },
                { address: { contains: search } },
                { phone: { contains: search } },
                { email: { contains: search } },
            ];
        }
        const [maisons, total] = await Promise.all([
            this.prisma.maisonTransit.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [sortBy]: sortOrder,
                },
            }),
            this.prisma.maisonTransit.count({ where }),
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            data: maisons.map((maison) => this.toResponseDto(maison)),
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
        const maisonTransit = await this.prisma.maisonTransit.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                responsable: true,
                depositaires: {
                    where: { deletedAt: null },
                    orderBy: { name: 'asc' },
                },
                declarations: {
                    where: { deletedAt: null },
                    orderBy: { createdAt: 'desc' },
                },
            }
        });
        if (!maisonTransit) {
            throw new common_1.NotFoundException(`Maison de transit avec l'ID ${id} non trouvée`);
        }
        return {
            ...this.toResponseDto(maisonTransit),
            responsable: maisonTransit.responsable,
            depositaires: maisonTransit.depositaires,
            declarations: maisonTransit.declarations,
        };
    }
    async update(id, updateMaisonTransitDto) {
        await this.findOne(id);
        if (updateMaisonTransitDto.code) {
            const existingMaison = await this.prisma.maisonTransit.findFirst({
                where: {
                    code: updateMaisonTransitDto.code,
                    id: { not: id },
                    deletedAt: null,
                },
            });
            if (existingMaison) {
                throw new common_1.ConflictException(`Une maison de transit avec le code "${updateMaisonTransitDto.code}" existe déjà`);
            }
        }
        const maisonTransit = await this.prisma.maisonTransit.update({
            where: { id },
            data: {
                code: updateMaisonTransitDto.code,
                name: updateMaisonTransitDto.name,
                address: updateMaisonTransitDto.address,
                phone: updateMaisonTransitDto.phone,
                email: updateMaisonTransitDto.email,
                responsableId: updateMaisonTransitDto.responsableId,
                isActive: updateMaisonTransitDto.isActive,
                updatedAt: new Date(),
            },
        });
        return this.toResponseDto(maisonTransit);
    }
    async remove(id) {
        await this.findOne(id);
        const relationsCount = await this.prisma.maisonTransit.findUnique({
            where: { id },
            select: {
                _count: {
                    select: {
                        depositaires: true,
                        declarations: true,
                    },
                },
            },
        });
        if (relationsCount) {
            const totalRelations = relationsCount._count.depositaires +
                relationsCount._count.declarations;
            if (totalRelations > 0) {
                throw new common_1.ConflictException(`Impossible de supprimer cette maison de transit car elle est associée à ${totalRelations} enregistrement(s) ` +
                    `(${relationsCount._count.depositaires} dépositaire(s), ` +
                    `${relationsCount._count.declarations} déclaration(s))`);
            }
        }
        await this.prisma.maisonTransit.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
    async activate(id) {
        await this.findOne(id);
        const maisonTransit = await this.prisma.maisonTransit.update({
            where: { id },
            data: {
                isActive: true,
                updatedAt: new Date(),
            },
        });
        return this.toResponseDto(maisonTransit);
    }
    async deactivate(id) {
        await this.findOne(id);
        const maisonTransit = await this.prisma.maisonTransit.update({
            where: { id },
            data: {
                isActive: false,
                updatedAt: new Date(),
            },
        });
        return this.toResponseDto(maisonTransit);
    }
    async getStatistics(id) {
        await this.findOne(id);
        const stats = await this.prisma.maisonTransit.findUnique({
            where: { id },
            select: {
                _count: {
                    select: {
                        depositaires: true,
                        declarations: true,
                    },
                },
            },
        });
        return {
            maisonTransitId: id,
            totalDepositaires: stats?._count.depositaires || 0,
            totalDeclarations: stats?._count.declarations || 0,
        };
    }
};
exports.MaisonTransitService = MaisonTransitService;
exports.MaisonTransitService = MaisonTransitService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MaisonTransitService);
//# sourceMappingURL=transit.service.js.map