import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
    ApurementStatisticsQueryDto,
    ApurementStatisticsResponseDto,
    ApurementByBureauResponseDto,
    ApurementTrendResponseDto,
    PeriodFilter,
} from 'libs/dto/statistics/apurement-statistics.dto';

@Injectable()
export class StatisticsService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Calculer les dates basées sur la période
     */
    private calculatePeriodDates(period?: PeriodFilter): {
        debut: Date;
        fin: Date;
    } {
        const now = new Date();
        const debut = new Date();
        const fin = new Date();

        switch (period) {
            case PeriodFilter.TODAY:
                debut.setHours(0, 0, 0, 0);
                fin.setHours(23, 59, 59, 999);
                break;

            case PeriodFilter.THIS_WEEK:
                const dayOfWeek = now.getDay();
                const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                debut.setDate(now.getDate() + diffToMonday);
                debut.setHours(0, 0, 0, 0);
                fin.setHours(23, 59, 59, 999);
                break;

            case PeriodFilter.THIS_MONTH:
                debut.setDate(1);
                debut.setHours(0, 0, 0, 0);
                fin.setMonth(now.getMonth() + 1, 0);
                fin.setHours(23, 59, 59, 999);
                break;

            case PeriodFilter.THIS_YEAR:
                debut.setMonth(0, 1);
                debut.setHours(0, 0, 0, 0);
                fin.setMonth(11, 31);
                fin.setHours(23, 59, 59, 999);
                break;

            case PeriodFilter.LAST_7_DAYS:
                debut.setDate(now.getDate() - 6);
                debut.setHours(0, 0, 0, 0);
                fin.setHours(23, 59, 59, 999);
                break;

            case PeriodFilter.LAST_30_DAYS:
                debut.setDate(now.getDate() - 29);
                debut.setHours(0, 0, 0, 0);
                fin.setHours(23, 59, 59, 999);
                break;

            case PeriodFilter.LAST_90_DAYS:
                debut.setDate(now.getDate() - 89);
                debut.setHours(0, 0, 0, 0);
                fin.setHours(23, 59, 59, 999);
                break;

            default:
                // Default: This month
                debut.setDate(1);
                debut.setHours(0, 0, 0, 0);
                fin.setMonth(now.getMonth() + 1, 0);
                fin.setHours(23, 59, 59, 999);
        }

        return { debut, fin };
    }

    /**
     * Statistiques d'apurement globales
     */
    async getApurementStatistics(
        query: ApurementStatisticsQueryDto,
    ): Promise<ApurementStatisticsResponseDto> {
        let dateDebut: Date;
        let dateFin: Date;

        // Calculer les dates basées sur la période ou utiliser les dates fournies
        if (query.period && query.period !== PeriodFilter.CUSTOM) {
            const periodDates = this.calculatePeriodDates(query.period);
            dateDebut = periodDates.debut;
            dateFin = periodDates.fin;
        } else {
            dateDebut = query.dateDebut
                ? new Date(query.dateDebut)
                : this.calculatePeriodDates(PeriodFilter.THIS_MONTH).debut;
            dateFin = query.dateFin
                ? new Date(query.dateFin)
                : this.calculatePeriodDates(PeriodFilter.THIS_MONTH).fin;
        }

        // Construire le filtre
        const where: any = {
            deletedAt: null,
            dateOrdre: {
                gte: dateDebut,
                lte: dateFin,
            },
        };

        if (query.bureauSortieId) {
            where.bureauSortieId = query.bureauSortieId;
        }

        // Récupérer les statistiques
        const [totalOrdres, apures, nonApures, rejetes, bureauSortie] =
            await Promise.all([
                this.prisma.ordreMission.count({ where }),
                this.prisma.ordreMission.count({
                    where: { ...where, statutApurement: 'APURE_SE' },
                }),
                this.prisma.ordreMission.count({
                    where: { ...where, statutApurement: 'NON_APURE' },
                }),
                this.prisma.ordreMission.count({
                    where: { ...where, statutApurement: 'REJET' },
                }),
                query.bureauSortieId
                    ? this.prisma.bureauSortie.findUnique({
                        where: { id: query.bureauSortieId },
                        select: { id: true, name: true, code: true },
                    })
                    : Promise.resolve(null),
            ]);

        const tauxApurement = totalOrdres > 0 ? (apures / totalOrdres) * 100 : 0;

        return {
            totalOrdres,
            apures,
            nonApures,
            rejetes,
            tauxApurement: parseFloat(tauxApurement.toFixed(2)),
            periode: {
                debut: dateDebut,
                fin: dateFin,
            },
            bureauSortie,
        };
    }

    /**
     * Statistiques d'apurement par bureau de sortie
     */
    async getApurementByBureau(
        query: ApurementStatisticsQueryDto,
    ): Promise<ApurementByBureauResponseDto[]> {
        let dateDebut: Date;
        let dateFin: Date;

        // Calculer les dates
        if (query.period && query.period !== PeriodFilter.CUSTOM) {
            const periodDates = this.calculatePeriodDates(query.period);
            dateDebut = periodDates.debut;
            dateFin = periodDates.fin;
        } else {
            dateDebut = query.dateDebut
                ? new Date(query.dateDebut)
                : this.calculatePeriodDates(PeriodFilter.THIS_MONTH).debut;
            dateFin = query.dateFin
                ? new Date(query.dateFin)
                : this.calculatePeriodDates(PeriodFilter.THIS_MONTH).fin;
        }

        // Récupérer tous les bureaux de sortie
        const bureaux = await this.prisma.bureauSortie.findMany({
            where: { deletedAt: null },
            select: { id: true, name: true, code: true },
        });

        // Calculer les stats pour chaque bureau
        const statistics = await Promise.all(
            bureaux.map(async (bureau) => {
                const where = {
                    deletedAt: null,
                    bureauSortieId: bureau.id,
                    dateOrdre: {
                        gte: dateDebut,
                        lte: dateFin,
                    },
                };

                const [totalOrdres, apures, nonApures, rejetes] = await Promise.all([
                    this.prisma.ordreMission.count({ where }),
                    this.prisma.ordreMission.count({
                        where: { ...where, statutApurement: 'APURE_SE' },
                    }),
                    this.prisma.ordreMission.count({
                        where: { ...where, statutApurement: 'NON_APURE' },
                    }),
                    this.prisma.ordreMission.count({
                        where: { ...where, statutApurement: 'REJET' },
                    }),
                ]);

                const tauxApurement =
                    totalOrdres > 0 ? (apures / totalOrdres) * 100 : 0;

                return {
                    bureauSortieId: bureau.id,
                    bureauName: bureau.name,
                    bureauCode: bureau.code,
                    totalOrdres,
                    apures,
                    nonApures,
                    rejetes,
                    tauxApurement: parseFloat(tauxApurement.toFixed(2)),
                };
            }),
        );

        // Retourner uniquement les bureaux avec des ordres
        return statistics.filter((stat) => stat.totalOrdres > 0);
    }

    /**
     * Tendance d'apurement (par jour, semaine ou mois)
     */
    async getApurementTrend(query: {
        bureauSortieId?: number;
        dateDebut?: string;
        dateFin?: string;
        period?: PeriodFilter;
        groupBy?: 'day' | 'week' | 'month';
    }): Promise<ApurementTrendResponseDto[]> {
        let dateDebut: Date;
        let dateFin: Date;
        const groupBy = query.groupBy || 'month';

        // Calculer les dates
        if (query.period && query.period !== PeriodFilter.CUSTOM) {
            const periodDates = this.calculatePeriodDates(query.period);
            dateDebut = periodDates.debut;
            dateFin = periodDates.fin;
        } else {
            dateDebut = query.dateDebut
                ? new Date(query.dateDebut)
                : this.calculatePeriodDates(PeriodFilter.THIS_YEAR).debut;
            dateFin = query.dateFin
                ? new Date(query.dateFin)
                : this.calculatePeriodDates(PeriodFilter.THIS_YEAR).fin;
        }

        // Construire le filtre de base
        const where: any = {
            deletedAt: null,
            dateOrdre: {
                gte: dateDebut,
                lte: dateFin,
            },
        };

        if (query.bureauSortieId) {
            where.bureauSortieId = query.bureauSortieId;
        }

        // Récupérer tous les ordres dans la période
        const ordres = await this.prisma.ordreMission.findMany({
            where,
            select: {
                dateOrdre: true,
                statutApurement: true,
            },
        });

        // Grouper par période
        const grouped = new Map<string, any>();

        ordres.forEach((ordre) => {
            if (!ordre.dateOrdre) return;

            let periodKey: string;
            const date = new Date(ordre.dateOrdre);

            switch (groupBy) {
                case 'day':
                    periodKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
                    break;
                case 'week':
                    const weekNumber = this.getWeekNumber(date);
                    periodKey = `${date.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
                    break;
                case 'month':
                default:
                    periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            }

            if (!grouped.has(periodKey)) {
                grouped.set(periodKey, {
                    period: periodKey,
                    totalOrdres: 0,
                    apures: 0,
                    nonApures: 0,
                    rejetes: 0,
                });
            }

            const stats = grouped.get(periodKey);
            stats.totalOrdres++;

            if (ordre.statutApurement === 'APURE_SE') stats.apures++;
            else if (ordre.statutApurement === 'NON_APURE') stats.nonApures++;
            else if (ordre.statutApurement === 'REJET') stats.rejetes++;
        });

        // Calculer le taux et retourner
        return Array.from(grouped.values())
            .map((stat) => ({
                ...stat,
                tauxApurement:
                    stat.totalOrdres > 0
                        ? parseFloat(((stat.apures / stat.totalOrdres) * 100).toFixed(2))
                        : 0,
            }))
            .sort((a, b) => a.period.localeCompare(b.period));
    }

    /**
     * Helper: Get ISO week number
     */
    private getWeekNumber(date: Date): number {
        const d = new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
        );
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    }

    /**
     * Statistiques générales (dashboard overview)
     */
    async getDashboardOverview(query: ApurementStatisticsQueryDto) {
        const [currentPeriod, previousPeriod, byBureau] = await Promise.all([
            this.getApurementStatistics(query),
            this.getPreviousPeriodStats(query),
            this.getApurementByBureau(query),
        ]);

        return {
            current: currentPeriod,
            previous: previousPeriod,
            comparison: {
                totalOrdresChange:
                    this.calculatePercentageChange(
                        previousPeriod.totalOrdres,
                        currentPeriod.totalOrdres,
                    ),
                tauxApurementChange:
                    this.calculatePercentageChange(
                        previousPeriod.tauxApurement,
                        currentPeriod.tauxApurement,
                    ),
            },
            topBureaux: byBureau
                .sort((a, b) => b.tauxApurement - a.tauxApurement)
                .slice(0, 5),
            bottomBureaux: byBureau
                .sort((a, b) => a.tauxApurement - b.tauxApurement)
                .slice(0, 5),
        };
    }

    /**
     * Statistiques de la période précédente
     */
    private async getPreviousPeriodStats(
        query: ApurementStatisticsQueryDto,
    ): Promise<ApurementStatisticsResponseDto> {
        let dateDebut: Date;
        let dateFin: Date;

        if (query.period && query.period !== PeriodFilter.CUSTOM) {
            const currentDates = this.calculatePeriodDates(query.period);
            const duration =
                currentDates.fin.getTime() - currentDates.debut.getTime();

            dateFin = new Date(currentDates.debut.getTime() - 1);
            dateDebut = new Date(dateFin.getTime() - duration);
        } else if (query.dateDebut && query.dateFin) {
            const debut = new Date(query.dateDebut);
            const fin = new Date(query.dateFin);
            const duration = fin.getTime() - debut.getTime();

            dateFin = new Date(debut.getTime() - 1);
            dateDebut = new Date(dateFin.getTime() - duration);
        } else {
            return this.getApurementStatistics({
                period: PeriodFilter.THIS_MONTH,
            });
        }

        return this.getApurementStatistics({
            ...query,
            dateDebut: dateDebut.toISOString(),
            dateFin: dateFin.toISOString(),
            period: PeriodFilter.CUSTOM,
        });
    }

    /**
     * Calculer le pourcentage de changement
     */
    private calculatePercentageChange(
        oldValue: number,
        newValue: number,
    ): number {
        if (oldValue === 0) return newValue > 0 ? 100 : 0;
        return parseFloat((((newValue - oldValue) / oldValue) * 100).toFixed(2));
    }

    /**
     * Statistiques par nature de marchandise
     */
    async getMarchandiseStatistics(query: {
        bureauSortieId?: number;
        dateDebut?: string;
        dateFin?: string;
        limit?: number;
    }) {
        let dateDebut: Date;
        let dateFin: Date;

        // Calculer les dates (par défaut: ce mois)
        dateDebut = query.dateDebut
            ? new Date(query.dateDebut)
            : this.calculatePeriodDates(PeriodFilter.THIS_MONTH).debut;
        dateFin = query.dateFin
            ? new Date(query.dateFin)
            : this.calculatePeriodDates(PeriodFilter.THIS_MONTH).fin;

        const limit = query.limit || 20;

        // Construire le filtre pour les colis via declaration -> ordreMissionDeclaration -> ordreMission
        const where: any = {
            deletedAt: null,
            declaration: {
                ordreMissions: {
                    some: {
                        deletedAt: null,
                        ordreMission: {
                            deletedAt: null,
                            dateOrdre: {
                                gte: dateDebut,
                                lte: dateFin,
                            },
                        },
                    },
                },
            },
        };

        if (query.bureauSortieId) {
            where.declaration.ordreMissions.some.ordreMission.bureauSortieId =
                query.bureauSortieId;
        }

        // Récupérer tous les colis dans la période avec leurs ordres de mission
        const colis = await this.prisma.colis.findMany({
            where,
            select: {
                natureMarchandise: true,
                poids: true,
                valeurDeclaree: true,
                nbreColis: true,
                declaration: {
                    select: {
                        ordreMissions: {
                            where: { deletedAt: null },
                            select: {
                                ordreMissionId: true,
                            },
                        },
                    },
                },
            },
        });

        // Grouper par nature de marchandise
        const grouped = new Map<string, any>();
        let totalColisGlobal = 0;
        let poidsGlobal = 0;
        let valeurGlobale = 0;

        colis.forEach((coli) => {
            const nature = coli.natureMarchandise;

            if (!grouped.has(nature)) {
                grouped.set(nature, {
                    natureMarchandise: nature,
                    totalColis: 0,
                    poidsTotal: 0,
                    valeurTotale: 0,
                    ordreIds: new Set(),
                });
            }

            const stats = grouped.get(nature);
            const nbreColis = coli.nbreColis || 1;
            stats.totalColis += nbreColis;

            // Ajouter tous les ordres de mission liés à cette déclaration
            coli.declaration?.ordreMissions?.forEach((om) => {
                stats.ordreIds.add(om.ordreMissionId);
            });

            if (coli.poids) {
                const poids = coli.poids.toNumber();
                stats.poidsTotal += poids;
                poidsGlobal += poids;
            }

            if (coli.valeurDeclaree) {
                const valeur = coli.valeurDeclaree.toNumber();
                stats.valeurTotale += valeur;
                valeurGlobale += valeur;
            }

            totalColisGlobal++;
        });

        // Convertir en array et calculer moyennes
        const marchandises = Array.from(grouped.values())
            .map((stat) => ({
                natureMarchandise: stat.natureMarchandise,
                totalColis: stat.totalColis,
                poidsTotal: stat.poidsTotal > 0 ? parseFloat(stat.poidsTotal.toFixed(2)) : null,
                valeurTotale: stat.valeurTotale > 0 ? parseFloat(stat.valeurTotale.toFixed(2)) : null,
                poidsMoyen:
                    stat.poidsTotal > 0
                        ? parseFloat((stat.poidsTotal / stat.totalColis).toFixed(2))
                        : null,
                valeurMoyenne:
                    stat.valeurTotale > 0
                        ? parseFloat((stat.valeurTotale / stat.totalColis).toFixed(2))
                        : null,
                nombreOrdres: stat.ordreIds.size,
                pourcentage:
                    totalColisGlobal > 0
                        ? parseFloat(((stat.totalColis / totalColisGlobal) * 100).toFixed(2))
                        : 0,
            }))
            .sort((a, b) => b.totalColis - a.totalColis)
            .slice(0, limit);

        // Récupérer info bureau si filtré
        const bureauSortie = query.bureauSortieId
            ? await this.prisma.bureauSortie.findUnique({
                where: { id: query.bureauSortieId },
                select: { id: true, name: true, code: true },
            })
            : null;

        return {
            marchandises,
            totaux: {
                totalColis: totalColisGlobal,
                poidsTotal: poidsGlobal > 0 ? parseFloat(poidsGlobal.toFixed(2)) : null,
                valeurTotale: valeurGlobale > 0 ? parseFloat(valeurGlobale.toFixed(2)) : null,
                nombreMarchandisesDistinctes: grouped.size,
            },
            periode: {
                debut: dateDebut,
                fin: dateFin,
            },
            bureauSortie,
        };
    }

    /**
     * Statistiques des marchandises par bureau
     */
    async getMarchandiseByBureau(query: {
        dateDebut?: string;
        dateFin?: string;
        limit?: number;
    }) {
        let dateDebut: Date;
        let dateFin: Date;

        dateDebut = query.dateDebut
            ? new Date(query.dateDebut)
            : this.calculatePeriodDates(PeriodFilter.THIS_MONTH).debut;
        dateFin = query.dateFin
            ? new Date(query.dateFin)
            : this.calculatePeriodDates(PeriodFilter.THIS_MONTH).fin;

        const limit = query.limit || 20;

        // Récupérer tous les bureaux
        const bureaux = await this.prisma.bureauSortie.findMany({
            where: { deletedAt: null },
            select: { id: true, name: true, code: true },
        });

        // Calculer les stats pour chaque bureau
        const results = await Promise.all(
            bureaux.map(async (bureau) => {
                const stats = await this.getMarchandiseStatistics({
                    bureauSortieId: bureau.id,
                    dateDebut: query.dateDebut,
                    dateFin: query.dateFin,
                    limit,
                });

                return {
                    bureauSortieId: bureau.id,
                    bureauName: bureau.name,
                    bureauCode: bureau.code,
                    marchandises: stats.marchandises,
                    totalColis: stats.totaux.totalColis,
                };
            }),
        );

        // Retourner uniquement les bureaux avec des colis
        return results.filter((r) => r.totalColis > 0);
    }

    /**
     * Tendance des marchandises dans le temps
     */
    async getMarchandiseTrend(query: {
        bureauSortieId?: number;
        dateDebut?: string;
        dateFin?: string;
        groupBy?: 'day' | 'week' | 'month';
        topN?: number;
    }) {
        let dateDebut: Date;
        let dateFin: Date;
        const groupBy = query.groupBy || 'month';
        const topN = query.topN || 5;

        dateDebut = query.dateDebut
            ? new Date(query.dateDebut)
            : this.calculatePeriodDates(PeriodFilter.THIS_YEAR).debut;
        dateFin = query.dateFin
            ? new Date(query.dateFin)
            : this.calculatePeriodDates(PeriodFilter.THIS_YEAR).fin;

        // Construire le filtre via declaration -> ordreMissionDeclaration -> ordreMission
        const where: any = {
            deletedAt: null,
            declaration: {
                ordreMissions: {
                    some: {
                        deletedAt: null,
                        ordreMission: {
                            deletedAt: null,
                            dateOrdre: {
                                gte: dateDebut,
                                lte: dateFin,
                            },
                        },
                    },
                },
            },
        };

        if (query.bureauSortieId) {
            where.declaration.ordreMissions.some.ordreMission.bureauSortieId =
                query.bureauSortieId;
        }

        // Récupérer les colis avec date d'ordre via la déclaration
        const colis = await this.prisma.colis.findMany({
            where,
            select: {
                natureMarchandise: true,
                poids: true,
                valeurDeclaree: true,
                nbreColis: true,
                declaration: {
                    select: {
                        ordreMissions: {
                            where: { deletedAt: null },
                            select: {
                                ordreMission: {
                                    select: {
                                        dateOrdre: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        // Identifier les top N marchandises
        const marchandiseCounts = new Map<string, number>();
        colis.forEach((coli) => {
            const count = marchandiseCounts.get(coli.natureMarchandise) || 0;
            const nbreColis = coli.nbreColis || 1;
            marchandiseCounts.set(coli.natureMarchandise, count + nbreColis);
        });

        const topMarchandises = Array.from(marchandiseCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, topN)
            .map(([name]) => name);

        // Grouper par période et marchandise
        const grouped = new Map<string, any>();

        colis
            .filter((coli) => topMarchandises.includes(coli.natureMarchandise))
            .forEach((coli) => {
                // Utiliser la date du premier ordre de mission lié
                const firstOrder = coli.declaration?.ordreMissions?.[0];
                if (!firstOrder?.ordreMission?.dateOrdre) return;

                let periodKey: string;
                const date = new Date(firstOrder.ordreMission.dateOrdre);

                switch (groupBy) {
                    case 'day':
                        periodKey = date.toISOString().split('T')[0];
                        break;
                    case 'week':
                        const weekNumber = this.getWeekNumber(date);
                        periodKey = `${date.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
                        break;
                    case 'month':
                    default:
                        periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                }

                const key = `${periodKey}|${coli.natureMarchandise}`;

                if (!grouped.has(key)) {
                    grouped.set(key, {
                        period: periodKey,
                        natureMarchandise: coli.natureMarchandise,
                        nombreColis: 0,
                        poidsTotal: 0,
                        valeurTotale: 0,
                    });
                }

                const stats = grouped.get(key);
                stats.nombreColis++;

                if (coli.poids) {
                    stats.poidsTotal += coli.poids.toNumber();
                }

                if (coli.valeurDeclaree) {
                    stats.valeurTotale += coli.valeurDeclaree.toNumber();
                }
            });

        // Convertir et formater
        return Array.from(grouped.values())
            .map((stat) => ({
                period: stat.period,
                natureMarchandise: stat.natureMarchandise,
                nombreColis: stat.nombreColis,
                poidsTotal:
                    stat.poidsTotal > 0
                        ? parseFloat(stat.poidsTotal.toFixed(2))
                        : null,
                valeurTotale:
                    stat.valeurTotale > 0
                        ? parseFloat(stat.valeurTotale.toFixed(2))
                        : null,
            }))
            .sort((a, b) => {
                const periodCompare = a.period.localeCompare(b.period);
                if (periodCompare !== 0) return periodCompare;
                return b.nombreColis - a.nombreColis;
            });
    }

    /**
     * Top marchandises (les plus fréquentes)
     */
    async getTopMarchandises(query: {
        bureauSortieId?: number;
        dateDebut?: string;
        dateFin?: string;
        limit?: number;
    }) {
        const stats = await this.getMarchandiseStatistics(query);

        return {
            topMarchandises: stats.marchandises.slice(0, query.limit || 10),
            periode: stats.periode,
            bureauSortie: stats.bureauSortie,
        };
    }

    /**
     * Statistiques par destination
     */
    async getDestinationStatistics(query: {
        bureauSortieId?: number;
        dateDebut?: string;
        dateFin?: string;
        limit?: number;
    }) {
        let dateDebut: Date;
        let dateFin: Date;

        // Calculer les dates (par défaut: ce mois)
        dateDebut = query.dateDebut
            ? new Date(query.dateDebut)
            : this.calculatePeriodDates(PeriodFilter.THIS_MONTH).debut;
        dateFin = query.dateFin
            ? new Date(query.dateFin)
            : this.calculatePeriodDates(PeriodFilter.THIS_MONTH).fin;

        const limit = query.limit || 20;

        // Construire le filtre
        const where: any = {
            deletedAt: null,
            dateOrdre: {
                gte: dateDebut,
                lte: dateFin,
            },
        };

        if (query.bureauSortieId) {
            where.bureauSortieId = query.bureauSortieId;
        }

        // Récupérer tous les ordres dans la période avec leurs transports
        const ordres = await this.prisma.ordreMission.findMany({
            where,
            select: {
                id: true,
                destination: true,
                conteneurs: {
                    where: { deletedAt: null },
                    select: { id: true },
                },
                camions: {
                    where: { deletedAt: null },
                    select: { id: true },
                },
                voitures: {
                    where: { deletedAt: null },
                    select: { id: true },
                },
            },
        });

        // Grouper par destination
        const grouped = new Map<string, any>();
        let totalTransportsGlobal = 0;
        let totalOrdresGlobal = 0;

        ordres.forEach((ordre) => {
            const destination = ordre.destination || 'Non spécifiée';

            if (!grouped.has(destination)) {
                grouped.set(destination, {
                    destination,
                    totalConteneurs: 0,
                    totalCamions: 0,
                    totalVoitures: 0,
                    ordreIds: new Set(),
                });
            }

            const stats = grouped.get(destination);
            stats.ordreIds.add(ordre.id);
            stats.totalConteneurs += ordre.conteneurs.length;
            stats.totalCamions += ordre.camions.length;
            stats.totalVoitures += ordre.voitures.length;

            totalTransportsGlobal +=
                ordre.conteneurs.length + ordre.camions.length + ordre.voitures.length;
        });

        totalOrdresGlobal = ordres.length;

        // Convertir en array et calculer totaux
        const destinations = Array.from(grouped.values())
            .map((stat) => {
                const totalVehicules = stat.totalCamions + stat.totalVoitures;
                const totalTransports = stat.totalConteneurs + totalVehicules;
                const nombreOrdres = stat.ordreIds.size;

                return {
                    destination: stat.destination,
                    totalConteneurs: stat.totalConteneurs,
                    totalCamions: stat.totalCamions,
                    totalVoitures: stat.totalVoitures,
                    totalVehicules,
                    totalTransports,
                    nombreOrdres,
                    pourcentage:
                        totalTransportsGlobal > 0
                            ? parseFloat(((totalTransports / totalTransportsGlobal) * 100).toFixed(2))
                            : 0,
                    moyenneConteneursParOrdre:
                        nombreOrdres > 0
                            ? parseFloat((stat.totalConteneurs / nombreOrdres).toFixed(2))
                            : 0,
                    moyenneVehiculesParOrdre:
                        nombreOrdres > 0
                            ? parseFloat((totalVehicules / nombreOrdres).toFixed(2))
                            : 0,
                };
            })
            .sort((a, b) => b.totalTransports - a.totalTransports)
            .slice(0, limit);

        // Calculer totaux globaux
        const totaux = Array.from(grouped.values()).reduce(
            (acc, stat) => ({
                totalConteneurs: acc.totalConteneurs + stat.totalConteneurs,
                totalCamions: acc.totalCamions + stat.totalCamions,
                totalVoitures: acc.totalVoitures + stat.totalVoitures,
            }),
            { totalConteneurs: 0, totalCamions: 0, totalVoitures: 0 }
        );

        // Récupérer info bureau si filtré
        const bureauSortie = query.bureauSortieId
            ? await this.prisma.bureauSortie.findUnique({
                where: { id: query.bureauSortieId },
                select: { id: true, name: true, code: true },
            })
            : null;

        return {
            destinations,
            totaux: {
                totalOrdres: totalOrdresGlobal,
                totalConteneurs: totaux.totalConteneurs,
                totalCamions: totaux.totalCamions,
                totalVoitures: totaux.totalVoitures,
                totalVehicules: totaux.totalCamions + totaux.totalVoitures,
                totalTransports: totaux.totalConteneurs + totaux.totalCamions + totaux.totalVoitures,
                nombreDestinationsDistinctes: grouped.size,
            },
            periode: {
                debut: dateDebut,
                fin: dateFin,
            },
            bureauSortie,
        };
    }

    /**
     * Statistiques des destinations par bureau
     */
    async getDestinationByBureau(query: {
        dateDebut?: string;
        dateFin?: string;
        limit?: number;
    }) {
        let dateDebut: Date;
        let dateFin: Date;

        dateDebut = query.dateDebut
            ? new Date(query.dateDebut)
            : this.calculatePeriodDates(PeriodFilter.THIS_MONTH).debut;
        dateFin = query.dateFin
            ? new Date(query.dateFin)
            : this.calculatePeriodDates(PeriodFilter.THIS_MONTH).fin;

        const limit = query.limit || 20;

        // Récupérer tous les bureaux
        const bureaux = await this.prisma.bureauSortie.findMany({
            where: { deletedAt: null },
            select: { id: true, name: true, code: true },
        });

        // Calculer les stats pour chaque bureau
        const results = await Promise.all(
            bureaux.map(async (bureau) => {
                const stats = await this.getDestinationStatistics({
                    bureauSortieId: bureau.id,
                    dateDebut: query.dateDebut,
                    dateFin: query.dateFin,
                    limit,
                });

                return {
                    bureauSortieId: bureau.id,
                    bureauName: bureau.name,
                    bureauCode: bureau.code,
                    destinations: stats.destinations,
                    totalTransports: stats.totaux.totalTransports,
                };
            }),
        );

        // Retourner uniquement les bureaux avec des transports
        return results.filter((r) => r.totalTransports > 0);
    }

    /**
     * Tendance des destinations dans le temps
     */
    async getDestinationTrend(query: {
        bureauSortieId?: number;
        dateDebut?: string;
        dateFin?: string;
        groupBy?: 'day' | 'week' | 'month';
        topN?: number;
    }) {
        let dateDebut: Date;
        let dateFin: Date;
        const groupBy = query.groupBy || 'month';
        const topN = query.topN || 5;

        dateDebut = query.dateDebut
            ? new Date(query.dateDebut)
            : this.calculatePeriodDates(PeriodFilter.THIS_YEAR).debut;
        dateFin = query.dateFin
            ? new Date(query.dateFin)
            : this.calculatePeriodDates(PeriodFilter.THIS_YEAR).fin;

        // Construire le filtre
        const where: any = {
            deletedAt: null,
            dateOrdre: {
                gte: dateDebut,
                lte: dateFin,
            },
        };

        if (query.bureauSortieId) {
            where.bureauSortieId = query.bureauSortieId;
        }

        // Récupérer les ordres avec date
        const ordres = await this.prisma.ordreMission.findMany({
            where,
            select: {
                destination: true,
                dateOrdre: true,
                conteneurs: {
                    where: { deletedAt: null },
                    select: { id: true },
                },
                camions: {
                    where: { deletedAt: null },
                    select: { id: true },
                },
                voitures: {
                    where: { deletedAt: null },
                    select: { id: true },
                },
            },
        });

        // Identifier les top N destinations
        const destinationCounts = new Map<string, number>();
        ordres.forEach((ordre) => {
            const destination = ordre.destination || 'Non spécifiée';
            const totalTransports =
                ordre.conteneurs.length + ordre.camions.length + ordre.voitures.length;
            const count = destinationCounts.get(destination) || 0;
            destinationCounts.set(destination, count + totalTransports);
        });

        const topDestinations = Array.from(destinationCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, topN)
            .map(([name]) => name);

        // Grouper par période et destination
        const grouped = new Map<string, any>();

        ordres
            .filter((ordre) => {
                const destination = ordre.destination || 'Non spécifiée';
                return topDestinations.includes(destination);
            })
            .forEach((ordre) => {
                if (!ordre.dateOrdre) return;

                let periodKey: string;
                const date = new Date(ordre.dateOrdre);

                switch (groupBy) {
                    case 'day':
                        periodKey = date.toISOString().split('T')[0];
                        break;
                    case 'week':
                        const weekNumber = this.getWeekNumber(date);
                        periodKey = `${date.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
                        break;
                    case 'month':
                    default:
                        periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                }

                const destination = ordre.destination || 'Non spécifiée';
                const key = `${periodKey}|${destination}`;

                if (!grouped.has(key)) {
                    grouped.set(key, {
                        period: periodKey,
                        destination,
                        nombreConteneurs: 0,
                        nombreCamions: 0,
                        nombreVoitures: 0,
                    });
                }

                const stats = grouped.get(key);
                stats.nombreConteneurs += ordre.conteneurs.length;
                stats.nombreCamions += ordre.camions.length;
                stats.nombreVoitures += ordre.voitures.length;
            });

        // Convertir et formater
        return Array.from(grouped.values())
            .map((stat) => ({
                period: stat.period,
                destination: stat.destination,
                nombreConteneurs: stat.nombreConteneurs,
                nombreCamions: stat.nombreCamions,
                nombreVoitures: stat.nombreVoitures,
                nombreVehicules: stat.nombreCamions + stat.nombreVoitures,
                nombreTransports:
                    stat.nombreConteneurs + stat.nombreCamions + stat.nombreVoitures,
            }))
            .sort((a, b) => {
                const periodCompare = a.period.localeCompare(b.period);
                if (periodCompare !== 0) return periodCompare;
                return b.nombreTransports - a.nombreTransports;
            });
    }

    /**
     * Top destinations (les plus fréquentes)
     */
    async getTopDestinations(query: {
        bureauSortieId?: number;
        dateDebut?: string;
        dateFin?: string;
        limit?: number;
    }) {
        const stats = await this.getDestinationStatistics(query);

        return {
            topDestinations: stats.destinations.slice(0, query.limit || 10),
            periode: stats.periode,
            bureauSortie: stats.bureauSortie,
        };
    }

    /**
     * Statistiques des itinéraires
     */
    async getRouteStatistics(query: {
        bureauSortieId?: number;
        dateDebut?: string;
        dateFin?: string;
        limit?: number;
    }) {
        let dateDebut: Date;
        let dateFin: Date;

        dateDebut = query.dateDebut
            ? new Date(query.dateDebut)
            : this.calculatePeriodDates(PeriodFilter.THIS_MONTH).debut;
        dateFin = query.dateFin
            ? new Date(query.dateFin)
            : this.calculatePeriodDates(PeriodFilter.THIS_MONTH).fin;

        const limit = query.limit || 20;

        // Construire le filtre
        const where: any = {
            deletedAt: null,
            dateOrdre: {
                gte: dateDebut,
                lte: dateFin,
            },
            itineraire: {
                not: null,
            },
        };

        if (query.bureauSortieId) {
            where.bureauSortieId = query.bureauSortieId;
        }

        // Récupérer tous les ordres avec itinéraires
        const ordres = await this.prisma.ordreMission.findMany({
            where,
            select: {
                id: true,
                itineraire: true,
                destination: true,
                conteneurs: {
                    where: { deletedAt: null },
                    select: { id: true },
                },
                camions: {
                    where: { deletedAt: null },
                    select: { id: true },
                },
                voitures: {
                    where: { deletedAt: null },
                    select: { id: true },
                },
            },
        });

        // Grouper par itinéraire
        const grouped = new Map<string, any>();
        let totalTransportsGlobal = 0;

        ordres.forEach((ordre) => {
            const itineraire = ordre.itineraire || 'Non spécifié';
            const destination = ordre.destination || 'Non spécifiée';

            if (!grouped.has(itineraire)) {
                grouped.set(itineraire, {
                    itineraire,
                    destination,
                    ordreIds: new Set(),
                    totalTransports: 0,
                });
            }

            const stats = grouped.get(itineraire);
            stats.ordreIds.add(ordre.id);

            const transports =
                ordre.conteneurs.length + ordre.camions.length + ordre.voitures.length;
            stats.totalTransports += transports;
            totalTransportsGlobal += transports;
        });

        // Convertir en array
        const routes = Array.from(grouped.values())
            .map((stat) => ({
                itineraire: stat.itineraire,
                destination: stat.destination,
                nombreOrdres: stat.ordreIds.size,
                totalTransports: stat.totalTransports,
                pourcentage:
                    totalTransportsGlobal > 0
                        ? parseFloat(((stat.totalTransports / totalTransportsGlobal) * 100).toFixed(2))
                        : 0,
            }))
            .sort((a, b) => b.totalTransports - a.totalTransports)
            .slice(0, limit);

        // Récupérer info bureau si filtré
        const bureauSortie = query.bureauSortieId
            ? await this.prisma.bureauSortie.findUnique({
                where: { id: query.bureauSortieId },
                select: { id: true, name: true, code: true },
            })
            : null;

        return {
            routes,
            periode: {
                debut: dateDebut,
                fin: dateFin,
            },
            bureauSortie,
        };
    }
}