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
exports.RegimeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let RegimeService = class RegimeService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createRegimeDto) {
        const existingRegime = await this.prisma.regime.findFirst({
            where: {
                name: createRegimeDto.name,
                deletedAt: null,
            },
        });
        if (existingRegime) {
            throw new common_1.ConflictException(`Un régime avec le nom "${createRegimeDto.name}" existe déjà`);
        }
        const regime = await this.prisma.regime.create({
            data: {
                name: createRegimeDto.name,
                description: createRegimeDto.description,
            },
        });
        return this.toResponseDto(regime);
    }
    async findAll(paginationQuery) {
        const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = paginationQuery;
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
        const [regimes, total] = await Promise.all([
            this.prisma.regime.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [sortBy]: sortOrder,
                },
            }),
            this.prisma.regime.count({ where }),
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            data: regimes.map(regime => this.toResponseDto(regime)),
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
        const regime = await this.prisma.regime.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });
        if (!regime) {
            throw new common_1.NotFoundException(`Régime avec l'ID ${id} non trouvé`);
        }
        return this.toResponseDto(regime);
    }
    async update(id, updateRegimeDto) {
        await this.findOne(id);
        if (updateRegimeDto.name) {
            const existingRegime = await this.prisma.regime.findFirst({
                where: {
                    name: updateRegimeDto.name,
                    id: { not: id },
                    deletedAt: null,
                },
            });
            if (existingRegime) {
                throw new common_1.ConflictException(`Un régime avec le nom "${updateRegimeDto.name}" existe déjà`);
            }
        }
        const regime = await this.prisma.regime.update({
            where: { id },
            data: {
                name: updateRegimeDto.name,
                description: updateRegimeDto.description,
                updatedAt: new Date(),
            },
        });
        return this.toResponseDto(regime);
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.regime.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
    async findAllSimple() {
        const regimes = await this.prisma.regime.findMany({
            where: {
                deletedAt: null,
            },
            orderBy: {
                name: 'asc',
            },
        });
        return regimes.map(regime => this.toResponseDto(regime));
    }
    toResponseDto(regime) {
        return {
            id: regime.id,
            name: regime.name,
            description: regime.description,
            createdAt: regime.createdAt,
            updatedAt: regime.updatedAt,
        };
    }
};
exports.RegimeService = RegimeService;
exports.RegimeService = RegimeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RegimeService);
//# sourceMappingURL=regime.service.js.map