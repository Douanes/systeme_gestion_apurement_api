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
     * Générer un numéro d'ordre de mission unique
     * Format: MT-YYYY-NNNNNN (Abréviation Maison Transit - Année - Compteur séquentiel de 6 chiffres)
     * Si pas de maison transit: OM-YYYY-NNNNNN
     */
    private async generateOrderNumber(maisonTransitId?: number): Promise<string> {
        const currentYear = new Date().getFullYear();
        let prefix = 'OM'; // Préfixe par défaut si pas de maison transit

        // Si une maison de transit est fournie, récupérer son code
        if (maisonTransitId) {
            const maisonTransit = await this.prisma.maisonTransit.findUnique({
                where: { id: maisonTransitId },
                select: { code: true },
            });

            if (maisonTransit && maisonTransit.code) {
                prefix = maisonTransit.code;
            }
        }

        // Construire le préfixe complet (ex: MTD-2025-)
        const fullPrefix = `${prefix}-${currentYear}-`;

        // Trouver le dernier numéro avec ce préfixe
        const lastOrder = await this.prisma.ordreMission.findFirst({
            where: {
                number: {
                    startsWith: fullPrefix,
                },
            },
            orderBy: {
                number: 'desc',
            },
            select: {
                number: true,
            },
        });

        let counter = 1;

        // Si un ordre existe déjà avec ce préfixe, extraire le compteur et incrémenter
        if (lastOrder) {
            const parts = lastOrder.number.split('-');
            if (parts.length === 3) {
                const lastCounter = parseInt(parts[2], 10);
                if (!isNaN(lastCounter)) {
                    counter = lastCounter + 1;
                }
            }
        }

        // Formater le compteur sur 6 chiffres (ex: 000001)
        const counterStr = counter.toString().padStart(6, '0');

        // Retourner le numéro complet (ex: MTD-2025-000001)
        return `${fullPrefix}${counterStr}`;
    }

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
            escouadeId: ordreMission.ecouadeId,
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
        // Générer un numéro automatiquement si non fourni
        let orderNumber = createOrdreMissionDto.number;

        if (!orderNumber) {
            orderNumber = await this.generateOrderNumber(createOrdreMissionDto.maisonTransitId);
        } else {
            // Si un numéro est fourni, vérifier qu'il n'existe pas déjà
            const existingOrdre = await this.prisma.ordreMission.findFirst({
                where: {
                    number: orderNumber,
                    deletedAt: null,
                },
            });

            if (existingOrdre) {
                throw new ConflictException(
                    `Un ordre de mission avec le numéro ${orderNumber} existe déjà`,
                );
            }
        }

        // Utiliser une transaction pour créer tout atomiquement
        const ordreMission = await this.prisma.$transaction(async (tx) => {
            // 1. Créer l'ordre de mission
            const ordre = await tx.ordreMission.create({
                data: {
                    number: orderNumber,
                    destination: createOrdreMissionDto.destination,
                    itineraire: createOrdreMissionDto.itineraire,
                    dateOrdre: createOrdreMissionDto.dateOrdre
                        ? new Date(createOrdreMissionDto.dateOrdre)
                        : new Date(), // Date automatique si non fournie
                    depositaireId: createOrdreMissionDto.depositaireId,
                    maisonTransitId: createOrdreMissionDto.maisonTransitId,
                    statut: createOrdreMissionDto.statut as any as PrismaStatutOrdreMission,
                    statutApurement: createOrdreMissionDto.statutApurement as any as PrismaStatutApurement,
                    ecouadeId: createOrdreMissionDto.escouadeId,
                    agentEscorteurId: createOrdreMissionDto.agentEscorteurId,
                    bureauSortieId: createOrdreMissionDto.bureauSortieId,
                    observations: createOrdreMissionDto.observations,
                },
            });

            // 2. Calculer les totaux de parcelle à partir des colis
            const colisParDeclaration: Map<string, { nbreColis: number; poids: number }> = new Map();

            if (createOrdreMissionDto.colis?.length) {
                for (const coli of createOrdreMissionDto.colis) {
                    const current = colisParDeclaration.get(coli.numeroDeclaration) || { nbreColis: 0, poids: 0 };
                    colisParDeclaration.set(coli.numeroDeclaration, {
                        nbreColis: current.nbreColis + (coli.nbreColis || 0),
                        poids: current.poids + (coli.poids || 0),
                    });
                }
            }

            // 3. Créer ou mettre à jour les déclarations
            const declarationsCreees: Map<string, number> = new Map(); // numeroDeclaration -> id

            if (createOrdreMissionDto.declarations?.length) {
                for (const decl of createOrdreMissionDto.declarations) {
                    const totauxParcelle = colisParDeclaration.get(decl.numeroDeclaration) || { nbreColis: 0, poids: 0 };

                    // Chercher une déclaration existante
                    let declaration = await tx.declaration.findFirst({
                        where: { numeroDeclaration: decl.numeroDeclaration },
                    });

                    if (declaration) {
                        // Déclaration existe: mettre à jour les quantités restantes
                        declaration = await tx.declaration.update({
                            where: { id: declaration.id },
                            data: {
                                nbreColisRestant: {
                                    decrement: totauxParcelle.nbreColis,
                                },
                                poidsRestant: {
                                    decrement: totauxParcelle.poids,
                                },
                                updatedAt: new Date(),
                            },
                        });
                    } else {
                        // Nouvelle déclaration: créer avec les totaux fournis
                        // nbreColisRestant = nbreColisTotal - nbreColisParcelle
                        const nbreColisRestant = (decl.nbreColisTotal || 0) - totauxParcelle.nbreColis;
                        const poidsRestant = (decl.poidsTotal || 0) - totauxParcelle.poids;

                        declaration = await tx.declaration.create({
                            data: {
                                numeroDeclaration: decl.numeroDeclaration,
                                dateDeclaration: new Date(decl.dateDeclaration),
                                nbreColisTotal: decl.nbreColisTotal || 0,
                                poidsTotal: decl.poidsTotal || 0,
                                nbreColisRestant: nbreColisRestant,
                                poidsRestant: poidsRestant,
                                depositaireId: decl.depositaireId,
                                maisonTransitId: decl.maisonTransitId,
                                bureauSortieId: decl.bureauSortieId,
                                regimeId: decl.regimeId,
                            },
                        });
                    }

                    declarationsCreees.set(decl.numeroDeclaration, declaration.id);

                    // Créer la parcelle (lien entre ordre et déclaration)
                    await tx.ordreMissionDeclaration.create({
                        data: {
                            ordreMissionId: ordre.id,
                            declarationId: declaration.id,
                            nbreColisParcelle: totauxParcelle.nbreColis,
                            poidsParcelle: totauxParcelle.poids,
                        },
                    });
                }
            }

            // 4. Créer les colis (liés aux déclarations)
            if (createOrdreMissionDto.colis?.length) {
                for (const coli of createOrdreMissionDto.colis) {
                    const declarationId = declarationsCreees.get(coli.numeroDeclaration);

                    if (!declarationId) {
                        throw new NotFoundException(
                            `Déclaration ${coli.numeroDeclaration} non trouvée. Assurez-vous de l'inclure dans la liste des déclarations.`,
                        );
                    }

                    await tx.colis.create({
                        data: {
                            declarationId: declarationId,
                            natureMarchandise: coli.natureMarchandise,
                            positionTarifaire: coli.positionTarifaire,
                            nbreColis: coli.nbreColis,
                            poids: coli.poids,
                            valeurDeclaree: coli.valeurDeclaree,
                        },
                    });
                }
            }

            // 5. Créer les conteneurs
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

            // 6. Créer les camions
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

            // 7. Créer les voitures
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
            include: {
                depositaire: true,
                maisonTransit: true,
                createdBy: true,
                ecouade: true,
                agentEscorteur: true,
                bureauSortie: true,
                declarations: {
                    where: { deletedAt: null },
                    include: {
                        declaration: {
                            include: {
                                colis: { where: { deletedAt: null } },
                            },
                        },
                    },
                },
                conteneurs: { where: { deletedAt: null } },
                camions: { where: { deletedAt: null } },
                voitures: { where: { deletedAt: null } },
            },
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
            escouade: ordreMission.ecouade
                ? {
                    id: ordreMission.ecouade.id,
                    name: ordreMission.ecouade.name,
                }
                : null,
            agentEscorteur: ordreMission.agentEscorteur,
            bureauSortie: ordreMission.bureauSortie,
            declarations: ordreMission.declarations.map((omd) => ({
                id: omd.declaration.id,
                numeroDeclaration: omd.declaration.numeroDeclaration,
                dateDeclaration: omd.declaration.dateDeclaration,
                nbreColisTotal: omd.declaration.nbreColisTotal,
                poidsTotal: omd.declaration.poidsTotal
                    ? omd.declaration.poidsTotal.toNumber()
                    : 0,
                nbreColisRestant: omd.declaration.nbreColisRestant,
                poidsRestant: omd.declaration.poidsRestant
                    ? omd.declaration.poidsRestant.toNumber()
                    : 0,
                statutApurement: omd.declaration.statutApurement,
                // Parcelle pour CET ordre de mission
                parcelle: {
                    nbreColisParcelle: omd.nbreColisParcelle,
                    poidsParcelle: omd.poidsParcelle
                        ? omd.poidsParcelle.toNumber()
                        : 0,
                },
                // Inclure les colis de cette déclaration
                colis: omd.declaration.colis.map((c) => ({
                    id: c.id,
                    natureMarchandise: c.natureMarchandise,
                    nbreColis: c.nbreColis,
                    poids: c.poids ? c.poids.toNumber() : null,
                    valeurDeclaree: c.valeurDeclaree
                        ? c.valeurDeclaree.toNumber()
                        : null,
                })),
            })),
            conteneurs: ordreMission.conteneurs.map((c) => ({
                id: c.id,
                numConteneur: c.numConteneur,
                driverName: c.driverName,
            })),
            camions: ordreMission.camions.map((c) => ({
                id: c.id,
                immatriculation: c.immatriculation,
                driverName: c.driverName,
            })),
            voitures: ordreMission.voitures.map((v) => ({
                id: v.id,
                chassis: v.chassis,
                driverName: v.driverName,
            })),
        };
    }

    /**
     * Mettre à jour un ordre avec ses relations (déclarations, colis, etc.)
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

        // Utiliser une transaction pour mettre à jour tout atomiquement
        const ordreMission = await this.prisma.$transaction(async (tx) => {
            // 1. Mettre à jour l'ordre de mission
            const ordre = await tx.ordreMission.update({
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
                    ecouadeId: updateOrdreMissionDto.escouadeId,
                    agentEscorteurId: updateOrdreMissionDto.agentEscorteurId,
                    bureauSortieId: updateOrdreMissionDto.bureauSortieId,
                    observations: updateOrdreMissionDto.observations,
                    updatedAt: new Date(),
                },
            });

            // 2. Calculer les totaux de parcelle à partir des nouveaux colis
            const colisParDeclaration: Map<string, { nbreColis: number; poids: number }> = new Map();

            if (updateOrdreMissionDto.colis !== undefined && updateOrdreMissionDto.colis.length > 0) {
                for (const coli of updateOrdreMissionDto.colis) {
                    const current = colisParDeclaration.get(coli.numeroDeclaration) || { nbreColis: 0, poids: 0 };
                    colisParDeclaration.set(coli.numeroDeclaration, {
                        nbreColis: current.nbreColis + (coli.nbreColis || 0),
                        poids: current.poids + (coli.poids || 0),
                    });
                }
            }

            // 3. Si des déclarations sont fournies, gérer les parcelles
            if (updateOrdreMissionDto.declarations !== undefined) {
                // Récupérer les anciennes parcelles pour réincrémenter les quantités
                const oldParcelles = await tx.ordreMissionDeclaration.findMany({
                    where: {
                        ordreMissionId: id,
                        deletedAt: null,
                    },
                    include: { declaration: true },
                });

                // Réincrémenter les quantités restantes des anciennes déclarations
                for (const parcelle of oldParcelles) {
                    await tx.declaration.update({
                        where: { id: parcelle.declarationId },
                        data: {
                            nbreColisRestant: {
                                increment: parcelle.nbreColisParcelle,
                            },
                            poidsRestant: {
                                increment: parcelle.poidsParcelle,
                            },
                        },
                    });
                }

                // Soft delete les anciennes parcelles
                await tx.ordreMissionDeclaration.updateMany({
                    where: {
                        ordreMissionId: id,
                        deletedAt: null,
                    },
                    data: {
                        deletedAt: new Date(),
                    },
                });

                // Soft delete tous les anciens colis
                const currentDeclarations = oldParcelles.map((p) => p.declarationId);
                if (currentDeclarations.length > 0) {
                    await tx.colis.updateMany({
                        where: {
                            declarationId: { in: currentDeclarations },
                            deletedAt: null,
                        },
                        data: { deletedAt: new Date() },
                    });
                }

                // Créer les nouvelles parcelles
                const declarationsCreees: Map<string, number> = new Map();

                for (const decl of updateOrdreMissionDto.declarations) {
                    const totauxParcelle = colisParDeclaration.get(decl.numeroDeclaration) || { nbreColis: 0, poids: 0 };

                    // Chercher ou créer la déclaration
                    let declaration = await tx.declaration.findFirst({
                        where: { numeroDeclaration: decl.numeroDeclaration },
                    });

                    if (declaration) {
                        // Mettre à jour les quantités restantes
                        declaration = await tx.declaration.update({
                            where: { id: declaration.id },
                            data: {
                                nbreColisRestant: {
                                    decrement: totauxParcelle.nbreColis,
                                },
                                poidsRestant: {
                                    decrement: totauxParcelle.poids,
                                },
                                updatedAt: new Date(),
                            },
                        });
                    } else {
                        // Créer nouvelle déclaration avec les totaux fournis
                        // nbreColisRestant = nbreColisTotal - nbreColisParcelle
                        const nbreColisRestant = (decl.nbreColisTotal || 0) - totauxParcelle.nbreColis;
                        const poidsRestant = (decl.poidsTotal || 0) - totauxParcelle.poids;

                        declaration = await tx.declaration.create({
                            data: {
                                numeroDeclaration: decl.numeroDeclaration,
                                dateDeclaration: new Date(decl.dateDeclaration),
                                nbreColisTotal: decl.nbreColisTotal || 0,
                                poidsTotal: decl.poidsTotal || 0,
                                nbreColisRestant: nbreColisRestant,
                                poidsRestant: poidsRestant,
                                depositaireId: decl.depositaireId,
                                maisonTransitId: decl.maisonTransitId,
                                bureauSortieId: decl.bureauSortieId,
                                regimeId: decl.regimeId,
                            },
                        });
                    }

                    declarationsCreees.set(decl.numeroDeclaration, declaration.id);

                    // Créer la nouvelle parcelle
                    await tx.ordreMissionDeclaration.create({
                        data: {
                            ordreMissionId: id,
                            declarationId: declaration.id,
                            nbreColisParcelle: totauxParcelle.nbreColis,
                            poidsParcelle: totauxParcelle.poids,
                        },
                    });
                }

                // Créer les nouveaux colis
                if (updateOrdreMissionDto.colis && updateOrdreMissionDto.colis.length > 0) {
                    for (const coli of updateOrdreMissionDto.colis) {
                        const declarationId = declarationsCreees.get(coli.numeroDeclaration);

                        if (!declarationId) {
                            throw new NotFoundException(
                                `Déclaration ${coli.numeroDeclaration} non trouvée. Assurez-vous de l'inclure dans la liste des déclarations.`,
                            );
                        }

                        await tx.colis.create({
                            data: {
                                declarationId: declarationId,
                                natureMarchandise: coli.natureMarchandise,
                                positionTarifaire: coli.positionTarifaire,
                                nbreColis: coli.nbreColis,
                                poids: coli.poids,
                                valeurDeclaree: coli.valeurDeclaree,
                            },
                        });
                    }
                }
            }

            // 4. Si des conteneurs sont fournis, utiliser upsert pour chaque conteneur
            if (updateOrdreMissionDto.conteneurs !== undefined) {
                // D'abord, soft delete tous les anciens conteneurs de cet ordre
                await tx.conteneur.updateMany({
                    where: {
                        ordreMissionId: id,
                        deletedAt: null,
                    },
                    data: {
                        deletedAt: new Date(),
                        ordreMissionId: null, // Détacher de l'ordre
                    },
                });

                // Ensuite, upsert chaque conteneur
                for (const cont of updateOrdreMissionDto.conteneurs) {
                    await tx.conteneur.upsert({
                        where: {
                            numConteneur: cont.numConteneur,
                        },
                        update: {
                            ordreMissionId: id,
                            driverName: cont.driverName,
                            driverNationality: cont.driverNationality,
                            phone: cont.phone,
                            deletedAt: null, // Réactiver si soft deleted
                            updatedAt: new Date(),
                        },
                        create: {
                            ordreMissionId: id,
                            numConteneur: cont.numConteneur,
                            driverName: cont.driverName,
                            driverNationality: cont.driverNationality,
                            phone: cont.phone,
                        },
                    });
                }
            }

            // 5. Si des camions sont fournis, utiliser upsert pour chaque camion
            if (updateOrdreMissionDto.camions !== undefined) {
                // D'abord, soft delete tous les anciens camions de cet ordre
                await tx.camion.updateMany({
                    where: {
                        ordreMissionId: id,
                        deletedAt: null,
                    },
                    data: {
                        deletedAt: new Date(),
                        ordreMissionId: null, // Détacher de l'ordre
                    },
                });

                // Ensuite, upsert chaque camion
                for (const cam of updateOrdreMissionDto.camions) {
                    await tx.camion.upsert({
                        where: {
                            immatriculation: cam.immatriculation,
                        },
                        update: {
                            ordreMissionId: id,
                            driverName: cam.driverName,
                            driverNationality: cam.driverNationality,
                            phone: cam.phone,
                            deletedAt: null, // Réactiver si soft deleted
                            updatedAt: new Date(),
                        },
                        create: {
                            ordreMissionId: id,
                            immatriculation: cam.immatriculation,
                            driverName: cam.driverName,
                            driverNationality: cam.driverNationality,
                            phone: cam.phone,
                        },
                    });
                }
            }

            // 6. Si des voitures sont fournies, utiliser upsert pour chaque voiture
            if (updateOrdreMissionDto.voitures !== undefined) {
                // D'abord, soft delete toutes les anciennes voitures de cet ordre
                await tx.voiture.updateMany({
                    where: {
                        ordreMissionId: id,
                        deletedAt: null,
                    },
                    data: {
                        deletedAt: new Date(),
                        ordreMissionId: null, // Détacher de l'ordre
                    },
                });

                // Ensuite, upsert chaque voiture
                for (const voit of updateOrdreMissionDto.voitures) {
                    await tx.voiture.upsert({
                        where: {
                            chassis: voit.chassis,
                        },
                        update: {
                            ordreMissionId: id,
                            driverName: voit.driverName,
                            driverNationality: voit.driverNationality,
                            phone: voit.phone,
                            deletedAt: null, // Réactiver si soft deleted
                            updatedAt: new Date(),
                        },
                        create: {
                            ordreMissionId: id,
                            chassis: voit.chassis,
                            driverName: voit.driverName,
                            driverNationality: voit.driverNationality,
                            phone: voit.phone,
                        },
                    });
                }
            }

            return ordre;
        });

        return this.toResponseDto(ordreMission);
    }

    /**
     * Supprimer un ordre (soft delete)
     */
    async remove(id: number): Promise<void> {
         const ordreMission = await this.prisma.ordreMission.findUnique({
            where: { id },
        });

        if (!ordreMission) {
            throw new NotFoundException(
                `Ordre de mission avec l'ID ${id} non trouvée`,
            );
        }

        // Vérifier si déjà supprimée
        if (ordreMission.deletedAt !== null) {
            throw new ConflictException(
                `L'ordre de mission avec l'ID ${id} est déjà supprimée`,
            );
        }

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

        // Compter les déclarations via la table de liaison
        const declarationsCount = await this.prisma.ordreMissionDeclaration.count({
            where: {
                ordreMissionId: id,
                deletedAt: null,
            },
        });

        // Récupérer les IDs des déclarations pour compter les colis
        const parcelles = await this.prisma.ordreMissionDeclaration.findMany({
            where: {
                ordreMissionId: id,
                deletedAt: null,
            },
            select: { declarationId: true },
        });

        const declarationIds = parcelles.map((p) => p.declarationId);

        // Compter les colis des déclarations
        const colisCount = await this.prisma.colis.count({
            where: {
                declarationId: { in: declarationIds },
                deletedAt: null,
            },
        });

        // Compter les véhicules directement liés à l'ordre
        const stats = await this.prisma.ordreMission.findUnique({
            where: { id },
            select: {
                _count: {
                    select: {
                        conteneurs: true,
                        camions: true,
                        voitures: true,
                    },
                },
            },
        });

        return {
            ordreMissionId: id,
            totalDeclarations: declarationsCount,
            totalColis: colisCount,
            totalConteneurs: stats?._count.conteneurs || 0,
            totalCamions: stats?._count.camions || 0,
            totalVoitures: stats?._count.voitures || 0,
        };
    }
}