import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrdreMission, StatutOrdreMission as PrismaStatutOrdreMission, StatutApurement as PrismaStatutApurement } from '@prisma/client';
import {
    CreateOrdreMissionDto,
    UpdateOrdreMissionDto,
    OrdreMissionResponseDto,
    OrdreMissionWithRelationsDto,
    StatutOrdreMission,
    StatutApurement,
} from 'libs/dto/ordre-mission/mission.dto';
import { OrdreMissionPaginationQueryDto } from 'libs/dto/ordre-mission/pagination.dto';
import { PaginatedResponseDto } from 'libs/dto/global/response.dto';

@Injectable()
export class OrdreMissionService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Transform Prisma OrdreMission to OrdreMissionResponseDto
     */
    private toResponseDto(ordreMission: OrdreMission): OrdreMissionResponseDto {
        return {
            id: ordreMission.id,
            number: ordreMission.number,
            destination: ordreMission.destination,
            itineraire: ordreMission.itineraire,
            dateOrdre: ordreMission.dateOrdre,
            depositaireId: ordreMission.depositaireId,
            maisonTransitId: ordreMission.maisonTransitId,
            createdById: ordreMission.createdById,
            statut: ordreMission.statut as any as StatutOrdreMission,
            statutApurement: ordreMission.statutApurement as any as StatutApurement,
            agentEscorteurId: ordreMission.agentEscorteurId,
            bureauSortieId: ordreMission.bureauSortieId,
            observations: ordreMission.observations,
            createdAt: ordreMission.createdAt,
            updatedAt: ordreMission.updatedAt,
        };
    }

    /**
     * Créer un ordre de mission avec toutes ses relations dans une transaction
     */
    async create(
        createOrdreMissionDto: CreateOrdreMissionDto,
    ): Promise<OrdreMissionResponseDto> {
        // Vérifier l'unicité du numéro
        const existingOrdre = await this.prisma.ordreMission.findFirst({
            where: {
                number: createOrdreMissionDto.number,
                deletedAt: null,
            },
        });

        if (existingOrdre) {
            throw new ConflictException(
                `Un ordre de mission avec le numéro ${createOrdreMissionDto.number} existe déjà`,
            );
        }

        // Utiliser une transaction pour créer tout atomiquement
        const ordreMission = await this.prisma.$transaction(async (tx) => {
            // 1. Créer l'ordre de mission
            const ordre = await tx.ordreMission.create({
                data: {
                    number: createOrdreMissionDto.number,
                    destination: createOrdreMissionDto.destination,
                    itineraire: createOrdreMissionDto.itineraire,
                    dateOrdre: createOrdreMissionDto.dateOrdre
                        ? new Date(createOrdreMissionDto.dateOrdre)
                        : null,
                    depositaireId: createOrdreMissionDto.depositaireId,
                    maisonTransitId: createOrdreMissionDto.maisonTransitId,
                    statut: createOrdreMissionDto.statut as any as PrismaStatutOrdreMission,
                    statutApurement: createOrdreMissionDto.statutApurement as any as PrismaStatutApurement,
                    agentEscorteurId: createOrdreMissionDto.agentEscorteurId,
                    bureauSortieId: createOrdreMissionDto.bureauSortieId,
                    observations: createOrdreMissionDto.observations,
                },
            });

            // 2. Créer les déclarations
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

            // 3. Créer les colis
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

            // 4. Créer les conteneurs
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

            // 5. Créer les camions
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

            // 6. Créer les voitures
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

    /**
     * Récupérer tous les ordres avec filtres
     */
    async findAll(
        paginationQuery: OrdreMissionPaginationQueryDto,
    ): Promise<PaginatedResponseDto<OrdreMissionResponseDto>> {
        const {
            page = 1,
            limit = 10,
            search,
            statut,
            agentId,
            escouadeId,
            dateDebutMin,
            dateDebutMax,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = paginationQuery;

        const skip = (page - 1) * limit;
        const where: any = { deletedAt: null };

        if (statut) where.statut = statut;
        if (agentId) where.agentEscorteurId = agentId;

        if (dateDebutMin || dateDebutMax) {
            where.dateOrdre = {};
            if (dateDebutMin) where.dateOrdre.gte = new Date(dateDebutMin);
            if (dateDebutMax) where.dateOrdre.lte = new Date(dateDebutMax);
        }

        if (search) {
            where.OR = [
                { destination: { contains: search } },
                { itineraire: { contains: search } },
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

    /**
     * Récupérer un ordre par ID
     */
    async findOne(
        id: number,
        includeRelations = false,
    ): Promise<OrdreMissionResponseDto | OrdreMissionWithRelationsDto> {
        const ordreMission = await this.prisma.ordreMission.findFirst({
            where: { id, deletedAt: null },
            include:
            {
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
            throw new NotFoundException(
                `Ordre de mission avec l'ID ${id} non trouvé`,
            );
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

    /**
     * Mettre à jour un ordre
     */
    async update(
        id: number,
        updateOrdreMissionDto: UpdateOrdreMissionDto,
    ): Promise<OrdreMissionResponseDto> {
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
                throw new ConflictException(
                    `Un ordre avec le numéro ${updateOrdreMissionDto.number} existe déjà`,
                );
            }
        }

        const ordreMission = await this.prisma.ordreMission.update({
            where: { id },
            data: {
                number: updateOrdreMissionDto.number,
                destination: updateOrdreMissionDto.destination,
                itineraire: updateOrdreMissionDto.itineraire,
                dateOrdre: updateOrdreMissionDto.dateOrdre
                    ? new Date(updateOrdreMissionDto.dateOrdre)
                    : undefined,
                depositaireId: updateOrdreMissionDto.depositaireId,
                maisonTransitId: updateOrdreMissionDto.maisonTransitId,
                statut: updateOrdreMissionDto.statut as any as PrismaStatutOrdreMission,
                statutApurement: updateOrdreMissionDto.statutApurement as any as PrismaStatutApurement,
                agentEscorteurId: updateOrdreMissionDto.agentEscorteurId,
                bureauSortieId: updateOrdreMissionDto.bureauSortieId,
                observations: updateOrdreMissionDto.observations,
            },
        });

        return this.toResponseDto(ordreMission);
    }

    /**
     * Supprimer un ordre (soft delete)
     */
    async remove(id: number): Promise<void> {
        await this.findOne(id);
        await this.prisma.ordreMission.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    /**
     * Statistiques
     */
    async getStatistics(id: number) {
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
}