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
exports.OrdreMissionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let OrdreMissionService = class OrdreMissionService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    toResponseDto(ordreMission) {
        return {
            id: ordreMission.id,
            number: ordreMission.number,
            destination: ordreMission.destination,
            itinéraire: ordreMission.itinéraire,
            dateOrdre: ordreMission.dateOrdre,
            depositaireId: ordreMission.depositaireId,
            maisonTransitId: ordreMission.maisonTransitId,
            createdById: ordreMission.createdById,
            statut: ordreMission.statut,
            statutApurement: ordreMission.statutApurement,
            agentEscorteurId: ordreMission.agentEscorteurId,
            bureauSortieId: ordreMission.bureauSortieId,
            observations: ordreMission.observations,
            createdAt: ordreMission.createdAt,
            updatedAt: ordreMission.updatedAt,
        };
    }
    async create(createOrdreMissionDto) {
        const existingOrdre = await this.prisma.ordreMission.findFirst({
            where: {
                number: createOrdreMissionDto.number,
                deletedAt: null,
            },
        });
        if (existingOrdre) {
            throw new common_1.ConflictException(`Un ordre de mission avec le numéro ${createOrdreMissionDto.number} existe déjà`);
        }
        const ordreMission = await this.prisma.$transaction(async (tx) => {
            const ordre = await tx.ordreMission.create({
                data: {
                    number: createOrdreMissionDto.number,
                    destination: createOrdreMissionDto.destination,
                    itinéraire: createOrdreMissionDto.itinéraire,
                    dateOrdre: createOrdreMissionDto.dateOrdre
                        ? new Date(createOrdreMissionDto.dateOrdre)
                        : null,
                    depositaireId: createOrdreMissionDto.depositaireId,
                    maisonTransitId: createOrdreMissionDto.maisonTransitId,
                    statut: createOrdreMissionDto.statut,
                    statutApurement: createOrdreMissionDto.statutApurement,
                    agentEscorteurId: createOrdreMissionDto.agentEscorteurId,
                    bureauSortieId: createOrdreMissionDto.bureauSortieId,
                    observations: createOrdreMissionDto.observations,
                },
            });
            if (createOrdreMissionDto.declarations?.length) {
                await tx.declaration.createMany({
                    data: createOrdreMissionDto.declarations.map((decl) => ({
                        numeroDeclaration: decl.numeroDeclaration,
                        dateDeclaration: new Date(decl.dateDeclaration),
                        ordreMissionId: ordre.id,
                        depositaireId: decl.depositaireId,
                        maisonTransitId: decl.maisonTransitId,
                        bureauSortieId: decl.bureauSortieId,
                    })),
                });
            }
            if (createOrdreMissionDto.colis?.length) {
                await tx.colis.createMany({
                    data: createOrdreMissionDto.colis.map((coli) => ({
                        ordreMissionId: ordre.id,
                        natureMarchandise: coli.natureMarchandise,
                        positionTarifaire: coli.positionTarifaire,
                        poids: coli.poids,
                        valeurDeclaree: coli.valeurDeclaree,
                    })),
                });
            }
            if (createOrdreMissionDto.conteneurs?.length) {
                await tx.conteneur.createMany({
                    data: createOrdreMissionDto.conteneurs.map((cont) => ({
                        ordreMissionId: ordre.id,
                        numConteneur: cont.numConteneur,
                        driverName: cont.driverName,
                        driverNationality: cont.driverNationality,
                        phone: cont.phone,
                    })),
                });
            }
            if (createOrdreMissionDto.camions?.length) {
                await tx.camion.createMany({
                    data: createOrdreMissionDto.camions.map((cam) => ({
                        ordreMissionId: ordre.id,
                        immatriculation: cam.immatriculation,
                        driverName: cam.driverName,
                        driverNationality: cam.driverNationality,
                        phone: cam.phone,
                    })),
                });
            }
            if (createOrdreMissionDto.voitures?.length) {
                await tx.voiture.createMany({
                    data: createOrdreMissionDto.voitures.map((voit) => ({
                        ordreMissionId: ordre.id,
                        chassis: voit.chassis,
                        driverName: voit.driverName,
                        driverNationality: voit.driverNationality,
                        phone: voit.phone,
                    })),
                });
            }
            return ordre;
        });
        return this.toResponseDto(ordreMission);
    }
    async findAll(paginationQuery) {
        const { page = 1, limit = 10, search, statut, agentId, escouadeId, dateDebutMin, dateDebutMax, sortBy = 'createdAt', sortOrder = 'desc', } = paginationQuery;
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
        if (statut)
            where.statut = statut;
        if (agentId)
            where.agentEscorteurId = agentId;
        if (dateDebutMin || dateDebutMax) {
            where.dateOrdre = {};
            if (dateDebutMin)
                where.dateOrdre.gte = new Date(dateDebutMin);
            if (dateDebutMax)
                where.dateOrdre.lte = new Date(dateDebutMax);
        }
        if (search) {
            where.OR = [
                { destination: { contains: search } },
                { itinéraire: { contains: search } },
                { observations: { contains: search } },
            ];
        }
        const [ordres, total] = await Promise.all([
            this.prisma.ordreMission.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
            }),
            this.prisma.ordreMission.count({ where }),
        ]);
        return {
            data: ordres.map((o) => this.toResponseDto(o)),
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrevious: page > 1,
            },
        };
    }
    async findOne(id, includeRelations = false) {
        const ordreMission = await this.prisma.ordreMission.findFirst({
            where: { id, deletedAt: null },
            include: {
                depositaire: true,
                maisonTransit: true,
                createdBy: true,
                agentEscorteur: true,
                bureauSortie: true,
                declarations: { where: { deletedAt: null } },
                colis: { where: { deletedAt: null } },
                conteneurs: { where: { deletedAt: null } },
                camions: { where: { deletedAt: null } },
                voitures: { where: { deletedAt: null } },
            }
        });
        if (!ordreMission) {
            throw new common_1.NotFoundException(`Ordre de mission avec l'ID ${id} non trouvé`);
        }
        return {
            ...this.toResponseDto(ordreMission),
            depositaire: ordreMission.depositaire,
            maisonTransit: ordreMission.maisonTransit,
            createdBy: ordreMission.createdBy,
            agentEscorteur: ordreMission.agentEscorteur,
            bureauSortie: ordreMission.bureauSortie,
            declarations: ordreMission.declarations.map(d => ({
                id: d.id,
                numeroDeclaration: d.numeroDeclaration,
                dateDeclaration: d.dateDeclaration,
                statutApurement: d.statutApurement,
            })),
            colis: ordreMission.colis.map(c => ({
                id: c.id,
                natureMarchandise: c.natureMarchandise,
                poids: c.poids ? c.poids.toNumber() : null,
                valeurDeclaree: c.valeurDeclaree ? c.valeurDeclaree.toNumber() : null,
            })),
            conteneurs: ordreMission.conteneurs.map(c => ({
                id: c.id,
                numConteneur: c.numConteneur,
                driverName: c.driverName,
            })),
            camions: ordreMission.camions.map(c => ({
                id: c.id,
                immatriculation: c.immatriculation,
                driverName: c.driverName,
            })),
            voitures: ordreMission.voitures.map(v => ({
                id: v.id,
                chassis: v.chassis,
                driverName: v.driverName,
            })),
        };
    }
    async update(id, updateOrdreMissionDto) {
        await this.findOne(id);
        if (updateOrdreMissionDto.number) {
            const existing = await this.prisma.ordreMission.findFirst({
                where: {
                    number: updateOrdreMissionDto.number,
                    id: { not: id },
                    deletedAt: null,
                },
            });
            if (existing) {
                throw new common_1.ConflictException(`Un ordre avec le numéro ${updateOrdreMissionDto.number} existe déjà`);
            }
        }
        const ordreMission = await this.prisma.ordreMission.update({
            where: { id },
            data: {
                number: updateOrdreMissionDto.number,
                destination: updateOrdreMissionDto.destination,
                itinéraire: updateOrdreMissionDto.itinéraire,
                dateOrdre: updateOrdreMissionDto.dateOrdre
                    ? new Date(updateOrdreMissionDto.dateOrdre)
                    : undefined,
                depositaireId: updateOrdreMissionDto.depositaireId,
                maisonTransitId: updateOrdreMissionDto.maisonTransitId,
                statut: updateOrdreMissionDto.statut,
                statutApurement: updateOrdreMissionDto.statutApurement,
                agentEscorteurId: updateOrdreMissionDto.agentEscorteurId,
                bureauSortieId: updateOrdreMissionDto.bureauSortieId,
                observations: updateOrdreMissionDto.observations,
            },
        });
        return this.toResponseDto(ordreMission);
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.ordreMission.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async getStatistics(id) {
        await this.findOne(id);
        const stats = await this.prisma.ordreMission.findUnique({
            where: { id },
            select: {
                _count: {
                    select: {
                        declarations: true,
                        colis: true,
                        conteneurs: true,
                        camions: true,
                        voitures: true,
                    },
                },
            },
        });
        return {
            ordreMissionId: id,
            totalDeclarations: stats?._count.declarations || 0,
            totalColis: stats?._count.colis || 0,
            totalConteneurs: stats?._count.conteneurs || 0,
            totalCamions: stats?._count.camions || 0,
            totalVoitures: stats?._count.voitures || 0,
        };
    }
};
exports.OrdreMissionService = OrdreMissionService;
exports.OrdreMissionService = OrdreMissionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdreMissionService);
//# sourceMappingURL=ordre.service.js.map