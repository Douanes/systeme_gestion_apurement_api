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
    StatutLivraisonParcelle,
} from 'libs/dto/ordre-mission/mission.dto';
import { OrdreMissionPaginationQueryDto, AuditNonApuresQueryDto } from 'libs/dto/ordre-mission/pagination.dto';
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

        // Trouver le dernier numéro avec ce préfixe (inclure tous les ordres, même supprimés)
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
        let counterStr = counter.toString().padStart(6, '0');
        let orderNumber = `${fullPrefix}${counterStr}`;

        // Vérifier que le numéro n'existe pas déjà (sécurité supplémentaire)
        let existingOrder = await this.prisma.ordreMission.findFirst({
            where: { number: orderNumber },
        });

        // Si le numéro existe déjà, incrémenter jusqu'à trouver un numéro disponible
        while (existingOrder) {
            counter++;
            counterStr = counter.toString().padStart(6, '0');
            orderNumber = `${fullPrefix}${counterStr}`;
            existingOrder = await this.prisma.ordreMission.findFirst({
                where: { number: orderNumber },
            });
        }

        // Retourner le numéro complet (ex: MTD-2025-000001)
        return orderNumber;
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

                        // Utiliser les relations de la déclaration ou hériter de l'ordre de mission
                        declaration = await tx.declaration.create({
                            data: {
                                numeroDeclaration: decl.numeroDeclaration,
                                dateDeclaration: new Date(decl.dateDeclaration),
                                nbreColisTotal: decl.nbreColisTotal || 0,
                                poidsTotal: decl.poidsTotal || 0,
                                nbreColisRestant: nbreColisRestant,
                                poidsRestant: poidsRestant,
                                depositaireId: decl.depositaireId ?? createOrdreMissionDto.depositaireId,
                                maisonTransitId: decl.maisonTransitId ?? createOrdreMissionDto.maisonTransitId,
                                bureauSortieId: decl.bureauSortieId ?? createOrdreMissionDto.bureauSortieId,
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

            // 5. Créer les conteneurs et les liaisons
            if (createOrdreMissionDto.conteneurs?.length) {
                for (const cont of createOrdreMissionDto.conteneurs) {
                    // Créer ou récupérer le conteneur
                    const conteneur = await tx.conteneur.upsert({
                        where: { numConteneur: cont.numConteneur },
                        update: {
                            deletedAt: null,
                            updatedAt: new Date(),
                        },
                        create: {
                            numConteneur: cont.numConteneur,
                        },
                    });

                    // Créer la liaison avec les infos du voyage
                    await tx.ordreMissionConteneur.create({
                        data: {
                            ordreMissionId: ordre.id,
                            conteneurId: conteneur.id,
                            numPlomb: cont.numPlomb,
                            driverName: cont.driverName,
                            driverNationality: cont.driverNationality,
                            phone: cont.phone,
                        },
                    });
                }
            }

            // 6. Créer les camions et les liaisons
            if (createOrdreMissionDto.camions?.length) {
                for (const cam of createOrdreMissionDto.camions) {
                    // Créer ou récupérer le camion
                    const camion = await tx.camion.upsert({
                        where: { immatriculation: cam.immatriculation },
                        update: {
                            deletedAt: null,
                            updatedAt: new Date(),
                        },
                        create: {
                            immatriculation: cam.immatriculation,
                        },
                    });

                    // Créer la liaison avec les infos du voyage
                    await tx.ordreMissionCamion.create({
                        data: {
                            ordreMissionId: ordre.id,
                            camionId: camion.id,
                            driverName: cam.driverName,
                            driverNationality: cam.driverNationality,
                            phone: cam.phone,
                        },
                    });
                }
            }

            // 7. Créer les voitures et les liaisons
            if (createOrdreMissionDto.voitures?.length) {
                for (const voit of createOrdreMissionDto.voitures) {
                    // Créer ou récupérer la voiture
                    const voiture = await tx.voiture.upsert({
                        where: { chassis: voit.chassis },
                        update: {
                            deletedAt: null,
                            updatedAt: new Date(),
                        },
                        create: {
                            chassis: voit.chassis,
                        },
                    });

                    // Créer la liaison avec les infos du voyage
                    await tx.ordreMissionVoiture.create({
                        data: {
                            ordreMissionId: ordre.id,
                            voitureId: voiture.id,
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
                include: {
                    declarations: {
                        where: { deletedAt: null },
                        include: {
                            declaration: true,
                        },
                    },
                },
            }),
            this.prisma.ordreMission.count({ where }),
        ]);

        // Pour chaque ordre, calculer le nombre de parcelles et le statut de livraison
        const ordresWithParcelles = await Promise.all(
            ordres.map(async (ordre) => {
                // Récupérer les IDs des déclarations liées à cet ordre
                const declarationIds = ordre.declarations.map((d) => d.declarationId);

                if (declarationIds.length === 0) {
                    return {
                        ...this.toResponseDto(ordre),
                        declarations: [],
                        nbreParcelles: 0,
                        statutLivraisonParcelle: undefined,
                    };
                }

                // Compter le nombre de parcelles par déclaration et trouver le max
                // Cela permet de savoir quelle parcelle peut être générée (ex: si max = 2, on peut générer Parcelle 3)
                const parcellesCounts = await this.prisma.ordreMissionDeclaration.groupBy({
                    by: ['declarationId'],
                    where: {
                        declarationId: { in: declarationIds },
                        deletedAt: null,
                    },
                    _count: {
                        declarationId: true,
                    },
                });

                // Le nombre max de parcelles parmi toutes les déclarations
                const maxParcelles = parcellesCounts.length > 0
                    ? Math.max(...parcellesCounts.map((p) => p._count.declarationId))
                    : 0;

                // Déterminer le statut de livraison
                // Vérifier si toutes les déclarations sont totalement livrées (nbreColisRestant = 0)
                const declarationsNonLivrees = ordre.declarations.filter(
                    (d) => d.declaration.nbreColisRestant > 0
                );

                let statutLivraisonParcelle: StatutLivraisonParcelle | undefined;

                if (maxParcelles > 0) {
                    if (declarationsNonLivrees.length === 0) {
                        statutLivraisonParcelle = StatutLivraisonParcelle.TOTALEMENT_LIVRE;
                    } else {
                        statutLivraisonParcelle = StatutLivraisonParcelle.PARTIELLEMENT_LIVRE;
                    }
                }

                return {
                    ...this.toResponseDto(ordre),
                    declarations: ordre.declarations.map((d) => ({
                        id: d.declaration.id,
                        numeroDeclaration: d.declaration.numeroDeclaration,
                    })),
                    nbreParcelles: maxParcelles,
                    statutLivraisonParcelle,
                };
            })
        );

        return {
            data: ordresWithParcelles,
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
                                regime: true,
                                maisonTransit: true,
                                depositaire: true,
                                bureauSortie: true,
                            },
                        },
                    },
                },
                conteneurs: {
                    where: { deletedAt: null },
                    include: { conteneur: true },
                },
                camions: {
                    where: { deletedAt: null },
                    include: { camion: true },
                },
                voitures: {
                    where: { deletedAt: null },
                    include: { voiture: true },
                },
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
                // Relations de la déclaration
                regime: omd.declaration.regime
                    ? {
                        id: omd.declaration.regime.id,
                        name: omd.declaration.regime.name,
                        
                    }
                    : null,
                maisonTransit: omd.declaration.maisonTransit
                    ? {
                        id: omd.declaration.maisonTransit.id,
                        name: omd.declaration.maisonTransit.name,
                        code: omd.declaration.maisonTransit.code,
                    }
                    : null,
                depositaire: omd.declaration.depositaire
                    ? {
                        id: omd.declaration.depositaire.id,
                        name: omd.declaration.depositaire.name,
                    }
                    : null,
                bureauSortie: omd.declaration.bureauSortie
                    ? {
                        id: omd.declaration.bureauSortie.id,
                        name: omd.declaration.bureauSortie.name,
                        code: omd.declaration.bureauSortie.code,
                    }
                    : null,
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
                id: c.conteneur.id,
                numConteneur: c.conteneur.numConteneur,
                numPlomb: c.numPlomb,
                driverName: c.driverName,
                driverNationality: c.driverNationality,
                phone: c.phone,
            })),
            camions: ordreMission.camions.map((c) => ({
                id: c.camion.id,
                immatriculation: c.camion.immatriculation,
                driverName: c.driverName,
                driverNationality: c.driverNationality,
                phone: c.phone,
            })),
            voitures: ordreMission.voitures.map((v) => ({
                id: v.voiture.id,
                chassis: v.voiture.chassis,
                driverName: v.driverName,
                driverNationality: v.driverNationality,
                phone: v.phone,
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

                        // Utiliser les relations de la déclaration ou hériter de l'ordre de mission
                        declaration = await tx.declaration.create({
                            data: {
                                numeroDeclaration: decl.numeroDeclaration,
                                dateDeclaration: new Date(decl.dateDeclaration),
                                nbreColisTotal: decl.nbreColisTotal || 0,
                                poidsTotal: decl.poidsTotal || 0,
                                nbreColisRestant: nbreColisRestant,
                                poidsRestant: poidsRestant,
                                depositaireId: decl.depositaireId ?? updateOrdreMissionDto.depositaireId,
                                maisonTransitId: decl.maisonTransitId ?? updateOrdreMissionDto.maisonTransitId,
                                bureauSortieId: decl.bureauSortieId ?? updateOrdreMissionDto.bureauSortieId,
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

            // 4. Si des conteneurs sont fournis, utiliser les tables de liaison
            if (updateOrdreMissionDto.conteneurs !== undefined) {
                // D'abord, soft delete toutes les anciennes liaisons conteneurs
                await tx.ordreMissionConteneur.updateMany({
                    where: {
                        ordreMissionId: id,
                        deletedAt: null,
                    },
                    data: {
                        deletedAt: new Date(),
                    },
                });

                // Ensuite, créer les nouvelles liaisons
                for (const cont of updateOrdreMissionDto.conteneurs) {
                    // Upsert le conteneur (créer s'il n'existe pas)
                    const conteneur = await tx.conteneur.upsert({
                        where: {
                            numConteneur: cont.numConteneur,
                        },
                        update: {
                            deletedAt: null,
                            updatedAt: new Date(),
                        },
                        create: {
                            numConteneur: cont.numConteneur,
                        },
                    });

                    // Créer la liaison avec les infos du conducteur
                    await tx.ordreMissionConteneur.create({
                        data: {
                            ordreMissionId: id,
                            conteneurId: conteneur.id,
                            numPlomb: cont.numPlomb,
                            driverName: cont.driverName,
                            driverNationality: cont.driverNationality,
                            phone: cont.phone,
                        },
                    });
                }
            }

            // 5. Si des camions sont fournis, utiliser les tables de liaison
            if (updateOrdreMissionDto.camions !== undefined) {
                // D'abord, soft delete toutes les anciennes liaisons camions
                await tx.ordreMissionCamion.updateMany({
                    where: {
                        ordreMissionId: id,
                        deletedAt: null,
                    },
                    data: {
                        deletedAt: new Date(),
                    },
                });

                // Ensuite, créer les nouvelles liaisons
                for (const cam of updateOrdreMissionDto.camions) {
                    // Upsert le camion (créer s'il n'existe pas)
                    const camion = await tx.camion.upsert({
                        where: {
                            immatriculation: cam.immatriculation,
                        },
                        update: {
                            deletedAt: null,
                            updatedAt: new Date(),
                        },
                        create: {
                            immatriculation: cam.immatriculation,
                        },
                    });

                    // Créer la liaison avec les infos du conducteur
                    await tx.ordreMissionCamion.create({
                        data: {
                            ordreMissionId: id,
                            camionId: camion.id,
                            driverName: cam.driverName,
                            driverNationality: cam.driverNationality,
                            phone: cam.phone,
                        },
                    });
                }
            }

            // 6. Si des voitures sont fournies, utiliser les tables de liaison
            if (updateOrdreMissionDto.voitures !== undefined) {
                // D'abord, soft delete toutes les anciennes liaisons voitures
                await tx.ordreMissionVoiture.updateMany({
                    where: {
                        ordreMissionId: id,
                        deletedAt: null,
                    },
                    data: {
                        deletedAt: new Date(),
                    },
                });

                // Ensuite, créer les nouvelles liaisons
                for (const voit of updateOrdreMissionDto.voitures) {
                    // Upsert la voiture (créer si elle n'existe pas)
                    const voiture = await tx.voiture.upsert({
                        where: {
                            chassis: voit.chassis,
                        },
                        update: {
                            deletedAt: null,
                            updatedAt: new Date(),
                        },
                        create: {
                            chassis: voit.chassis,
                        },
                    });

                    // Créer la liaison avec les infos du conducteur
                    await tx.ordreMissionVoiture.create({
                        data: {
                            ordreMissionId: id,
                            voitureId: voiture.id,
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

    /**
     * Récupérer les ordres de mission non apurés pour audit
     * Retourne les ordres avec statutApurement = NON_APURE et datant de X jours ou plus
     */
    async findNonApuresForAudit(
        query: AuditNonApuresQueryDto,
    ): Promise<PaginatedResponseDto<OrdreMissionResponseDto & { joursDepuisOrdre: number }>> {
        const {
            page = 1,
            limit = 10,
            minDaysOld = 7,
            search,
            maisonTransitId,
            sortBy = 'dateOrdre',
            sortOrder = 'asc',
        } = query;

        const skip = (page - 1) * limit;

        // Calculer la date limite (il y a X jours)
        const dateLimite = new Date();
        dateLimite.setDate(dateLimite.getDate() - minDaysOld);

        const where: any = {
            deletedAt: null,
            statutApurement: PrismaStatutApurement.NON_APURE,
            dateOrdre: {
                lte: dateLimite,
            },
        };

        if (maisonTransitId) {
            where.maisonTransitId = maisonTransitId;
        }

        if (search) {
            where.OR = [
                { number: { contains: search } },
                { destination: { contains: search } },
                { itineraire: { contains: search } },
            ];
        }

        const [ordres, total] = await Promise.all([
            this.prisma.ordreMission.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    maisonTransit: {
                        select: { id: true, name: true, code: true },
                    },
                    depositaire: {
                        select: { id: true, name: true },
                    },
                },
            }),
            this.prisma.ordreMission.count({ where }),
        ]);

        // Calculer le nombre de jours depuis la date de l'ordre pour chaque ordre
        const now = new Date();
        const ordresWithDays = ordres.map((ordre) => {
            const dateOrdre = ordre.dateOrdre ? new Date(ordre.dateOrdre) : new Date(ordre.createdAt);
            const diffTime = Math.abs(now.getTime() - dateOrdre.getTime());
            const joursDepuisOrdre = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return {
                ...this.toResponseDto(ordre),
                joursDepuisOrdre,
                maisonTransit: ordre.maisonTransit,
                depositaire: ordre.depositaire,
            };
        });

        return {
            data: ordresWithDays,
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
}