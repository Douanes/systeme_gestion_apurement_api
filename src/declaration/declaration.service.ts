import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
    DeclarationPaginationQueryDto,
    DeclarationWithOrdersResponseDto,
    StatutLivraisonFilter,
    DeclarationStatisticsQueryDto,
    DeclarationStatisticsResponseDto,
    StatisticsDataPointDto,
    TimeGranularity,
} from 'libs/dto/declaration/declaration.dto';
import { PaginatedResponseDto } from 'libs/dto/global/response.dto';

@Injectable()
export class DeclarationService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Récupérer toutes les déclarations avec leurs ordres de mission (parcelles)
     */
    async findAll(
        query: DeclarationPaginationQueryDto,
    ): Promise<PaginatedResponseDto<DeclarationWithOrdersResponseDto>> {
        const {
            page = 1,
            limit = 10,
            search,
            statutLivraison,
            maisonTransitId,
            depositaireId,
            bureauSortieId,
            regimeId,
            dateDeclarationMin,
            dateDeclarationMax,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = query;

        const skip = (page - 1) * limit;

        // Construction du filtre de base
        const where: Prisma.DeclarationWhereInput = {
            deletedAt: null,
        };

        // Filtre par recherche
        if (search) {
            where.numeroDeclaration = { contains: search };
        }

        // Filtres par relations
        if (maisonTransitId) {
            where.maisonTransitId = maisonTransitId;
        }

        if (depositaireId) {
            where.depositaireId = depositaireId;
        }

        if (bureauSortieId) {
            where.bureauSortieId = bureauSortieId;
        }

        if (regimeId) {
            where.regimeId = regimeId;
        }

        // Filtre par date de déclaration
        if (dateDeclarationMin || dateDeclarationMax) {
            where.dateDeclaration = {};
            if (dateDeclarationMin) {
                where.dateDeclaration.gte = new Date(dateDeclarationMin);
            }
            if (dateDeclarationMax) {
                where.dateDeclaration.lte = new Date(dateDeclarationMax);
            }
        }

        // Filtre par statut de livraison
        if (statutLivraison) {
            switch (statutLivraison) {
                case StatutLivraisonFilter.TOTALEMENT_LIVRE:
                    // nbreColisRestant = 0 (tout a été livré)
                    where.nbreColisRestant = 0;
                    break;
                case StatutLivraisonFilter.PARTIELLEMENT_LIVRE:
                    // nbreColisRestant > 0 et a au moins une parcelle
                    where.AND = [
                        { nbreColisRestant: { gt: 0 } },
                        {
                            ordreMissions: {
                                some: { deletedAt: null }
                            }
                        }
                    ];
                    break;
                case StatutLivraisonFilter.NON_LIVRE:
                    // Aucune parcelle ou nbreColisRestant = nbreColisTotal
                    where.ordreMissions = {
                        none: { deletedAt: null }
                    };
                    break;
            }
        }

        // Récupération des données avec les relations
        const [declarations, total] = await Promise.all([
            this.prisma.declaration.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    regime: {
                        select: { id: true, name: true }
                    },
                    maisonTransit: {
                        select: { id: true, name: true, code: true }
                    },
                    depositaire: {
                        select: { id: true, name: true }
                    },
                    bureauSortie: {
                        select: { id: true, name: true, code: true }
                    },
                    ordreMissions: {
                        where: { deletedAt: null },
                        include: {
                            ordreMission: {
                                select: {
                                    id: true,
                                    number: true,
                                    destination: true,
                                    itineraire: true,
                                    statut: true,
                                    statutApurement: true,
                                    dateOrdre: true,
                                }
                            }
                        },
                        orderBy: { createdAt: 'desc' }
                    }
                }
            }),
            this.prisma.declaration.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        // Transformer les déclarations en DTOs
        const data = declarations.map(decl => this.toResponseDto(decl));

        return {
            data,
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
     * Récupérer une déclaration par ID avec tous ses ordres de mission
     */
    async findOne(id: number): Promise<DeclarationWithOrdersResponseDto> {
        const declaration = await this.prisma.declaration.findFirst({
            where: { id, deletedAt: null },
            include: {
                regime: {
                    select: { id: true, name: true }
                },
                maisonTransit: {
                    select: { id: true, name: true, code: true }
                },
                depositaire: {
                    select: { id: true, name: true }
                },
                bureauSortie: {
                    select: { id: true, name: true, code: true }
                },
                ordreMissions: {
                    where: { deletedAt: null },
                    include: {
                        ordreMission: {
                            select: {
                                id: true,
                                number: true,
                                destination: true,
                                itineraire: true,
                                statut: true,
                                statutApurement: true,
                                dateOrdre: true,
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!declaration) {
            throw new NotFoundException(`Déclaration avec l'ID ${id} non trouvée`);
        }

        return this.toResponseDto(declaration);
    }

    /**
     * Transformer une déclaration Prisma en DTO de réponse
     */
    private toResponseDto(declaration: any): DeclarationWithOrdersResponseDto {
        const nbreColisTotal = declaration.nbreColisTotal;
        const nbreColisRestant = declaration.nbreColisRestant;
        const nbreColisLivres = nbreColisTotal - nbreColisRestant;

        const poidsTotal = declaration.poidsTotal ? Number(declaration.poidsTotal) : 0;
        const poidsRestant = declaration.poidsRestant ? Number(declaration.poidsRestant) : 0;
        const poidsLivre = poidsTotal - poidsRestant;

        // Calcul du pourcentage de livraison
        const pourcentageLivraison = nbreColisTotal > 0
            ? Math.round((nbreColisLivres / nbreColisTotal) * 100)
            : 0;

        // Détermination du statut de livraison
        let statutLivraison: string;
        if (nbreColisRestant === 0 && nbreColisTotal > 0) {
            statutLivraison = 'TOTALEMENT_LIVRE';
        } else if (declaration.ordreMissions?.length > 0 && nbreColisRestant > 0) {
            statutLivraison = 'PARTIELLEMENT_LIVRE';
        } else {
            statutLivraison = 'NON_LIVRE';
        }

        // Transformation des parcelles
        const parcelles = declaration.ordreMissions?.map((omd: any) => ({
            id: omd.id,
            nbreColisParcelle: omd.nbreColisParcelle,
            poidsParcelle: omd.poidsParcelle ? Number(omd.poidsParcelle) : 0,
            createdAt: omd.createdAt,
            ordreMission: {
                id: omd.ordreMission.id,
                number: omd.ordreMission.number,
                destination: omd.ordreMission.destination,
                itineraire: omd.ordreMission.itineraire,
                statut: omd.ordreMission.statut,
                statutApurement: omd.ordreMission.statutApurement,
                dateOrdre: omd.ordreMission.dateOrdre,
            }
        })) || [];

        return {
            id: declaration.id,
            numeroDeclaration: declaration.numeroDeclaration,
            dateDeclaration: declaration.dateDeclaration,
            nbreColisTotal,
            poidsTotal,
            nbreColisRestant,
            poidsRestant,
            nbreColisLivres,
            poidsLivre,
            pourcentageLivraison,
            statutLivraison,
            statutApurement: declaration.statutApurement,
            dateApurement: declaration.dateApurement,
            regime: declaration.regime
                ? {
                    id: declaration.regime.id,
                    name: declaration.regime.name,
                }
                : null,
            maisonTransit: declaration.maisonTransit
                ? {
                    id: declaration.maisonTransit.id,
                    name: declaration.maisonTransit.name,
                    code: declaration.maisonTransit.code,
                }
                : null,
            depositaire: declaration.depositaire
                ? {
                    id: declaration.depositaire.id,
                    name: declaration.depositaire.name,
                }
                : null,
            bureauSortie: declaration.bureauSortie
                ? {
                    id: declaration.bureauSortie.id,
                    name: declaration.bureauSortie.name,
                    code: declaration.bureauSortie.code,
                }
                : null,
            parcelles,
            totalParcelles: parcelles.length,
            createdAt: declaration.createdAt,
            updatedAt: declaration.updatedAt,
        };
    }

    /**
     * Récupérer les statistiques des déclarations pour graphiques
     * Retourne le nombre de déclarations totales, apurées et non apurées par période
     */
    async getStatistics(
        query: DeclarationStatisticsQueryDto,
    ): Promise<DeclarationStatisticsResponseDto> {
        const {
            granularity = TimeGranularity.MONTH,
            dateDebut,
            dateFin,
            maisonTransitId,
            regimeId,
            periods = 12,
        } = query;

        // Calculer les dates de début et fin si non fournies
        const endDate = dateFin ? new Date(dateFin) : new Date();
        endDate.setHours(23, 59, 59, 999);

        let startDate: Date;
        if (dateDebut) {
            startDate = new Date(dateDebut);
        } else {
            startDate = this.calculateStartDate(endDate, granularity, periods);
        }
        startDate.setHours(0, 0, 0, 0);

        // Générer les périodes
        const periodsData = this.generatePeriods(startDate, endDate, granularity);

        // Construire le filtre de base
        const baseWhere: Prisma.DeclarationWhereInput = {
            deletedAt: null,
            dateDeclaration: {
                gte: startDate,
                lte: endDate,
            },
        };

        if (maisonTransitId) {
            baseWhere.maisonTransitId = maisonTransitId;
        }

        if (regimeId) {
            baseWhere.regimeId = regimeId;
        }

        // Récupérer les statistiques pour chaque période
        const chartData: StatisticsDataPointDto[] = await Promise.all(
            periodsData.map(async (period) => {
                const periodWhere: Prisma.DeclarationWhereInput = {
                    ...baseWhere,
                    dateDeclaration: {
                        gte: period.dateDebut,
                        lte: period.dateFin,
                    },
                };

                const [total, apurees, nonApurees] = await Promise.all([
                    this.prisma.declaration.count({ where: periodWhere }),
                    this.prisma.declaration.count({
                        where: {
                            ...periodWhere,
                            statutApurement: { in: ['APURE_SE'] },
                        },
                    }),
                    this.prisma.declaration.count({
                        where: {
                            ...periodWhere,
                            OR: [
                                { statutApurement: 'NON_APURE' },
                                { statutApurement: null },
                            ],
                        },
                    }),
                ]);

                return {
                    period: period.label,
                    declarations: total,
                    apurees: apurees,
                    nonApurees: nonApurees,
                };
            })
        );

        // Calculer les totaux
        const totals = chartData.reduce(
            (acc, item) => ({
                totalDeclarations: acc.totalDeclarations + item.declarations,
                declarationsApurees: acc.declarationsApurees + item.apurees,
                declarationsNonApurees: acc.declarationsNonApurees + item.nonApurees,
            }),
            { totalDeclarations: 0, declarationsApurees: 0, declarationsNonApurees: 0 }
        );

        const tauxApurement = totals.totalDeclarations > 0
            ? Math.round((totals.declarationsApurees / totals.totalDeclarations) * 10000) / 100
            : 0;

        return {
            granularity,
            dateDebut: startDate,
            dateFin: endDate,
            chartData,
            totals: {
                ...totals,
                tauxApurement,
            },
        };
    }

    /**
     * Calculer la date de début en fonction de la granularité et du nombre de périodes
     */
    private calculateStartDate(endDate: Date, granularity: TimeGranularity, periods: number): Date {
        const startDate = new Date(endDate);

        switch (granularity) {
            case TimeGranularity.DAY:
                startDate.setDate(startDate.getDate() - periods);
                break;
            case TimeGranularity.WEEK:
                startDate.setDate(startDate.getDate() - (periods * 7));
                break;
            case TimeGranularity.MONTH:
                startDate.setMonth(startDate.getMonth() - periods);
                break;
            case TimeGranularity.YEAR:
                startDate.setFullYear(startDate.getFullYear() - periods);
                break;
        }

        return startDate;
    }

    /**
     * Générer les périodes entre deux dates selon la granularité
     */
    private generatePeriods(
        startDate: Date,
        endDate: Date,
        granularity: TimeGranularity,
    ): Array<{ label: string; dateDebut: Date; dateFin: Date }> {
        const periods: Array<{ label: string; dateDebut: Date; dateFin: Date }> = [];
        const current = new Date(startDate);

        while (current <= endDate) {
            const periodStart = new Date(current);
            periodStart.setHours(0, 0, 0, 0);

            let periodEnd: Date;
            let label: string;

            switch (granularity) {
                case TimeGranularity.DAY:
                    periodEnd = new Date(current);
                    periodEnd.setHours(23, 59, 59, 999);
                    label = current.toISOString().split('T')[0]; // YYYY-MM-DD
                    current.setDate(current.getDate() + 1);
                    break;

                case TimeGranularity.WEEK:
                    // Début de la semaine (lundi)
                    const dayOfWeek = current.getDay();
                    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                    periodStart.setDate(current.getDate() + diffToMonday);
                    periodEnd = new Date(periodStart);
                    periodEnd.setDate(periodStart.getDate() + 6);
                    periodEnd.setHours(23, 59, 59, 999);

                    const weekNum = this.getWeekNumber(periodStart);
                    label = `S${weekNum} ${periodStart.getFullYear()}`;
                    current.setDate(current.getDate() + 7);
                    break;

                case TimeGranularity.MONTH:
                    periodStart.setDate(1);
                    periodEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);
                    periodEnd.setHours(23, 59, 59, 999);
                    label = this.getMonthLabel(current.getMonth(), current.getFullYear());
                    current.setMonth(current.getMonth() + 1);
                    break;

                case TimeGranularity.YEAR:
                    periodStart.setMonth(0, 1);
                    periodEnd = new Date(current.getFullYear(), 11, 31);
                    periodEnd.setHours(23, 59, 59, 999);
                    label = String(current.getFullYear());
                    current.setFullYear(current.getFullYear() + 1);
                    break;

                default:
                    periodEnd = new Date(current);
                    periodEnd.setHours(23, 59, 59, 999);
                    label = current.toISOString().split('T')[0];
                    current.setDate(current.getDate() + 1);
            }

            // Ne pas ajouter si la période dépasse la date de fin
            if (periodStart <= endDate) {
                periods.push({
                    label,
                    dateDebut: periodStart,
                    dateFin: periodEnd > endDate ? endDate : periodEnd,
                });
            }
        }

        return periods;
    }

    /**
     * Obtenir le numéro de semaine ISO
     */
    private getWeekNumber(date: Date): number {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    }

    /**
     * Obtenir le label du mois en français
     */
    private getMonthLabel(monthIndex: number, year: number): string {
        const months = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];
        return `${months[monthIndex]} ${year}`;
    }
}
