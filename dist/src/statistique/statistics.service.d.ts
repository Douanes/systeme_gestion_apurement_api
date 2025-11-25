import { PrismaService } from 'prisma/prisma.service';
import { ApurementStatisticsQueryDto, ApurementStatisticsResponseDto, ApurementByBureauResponseDto, ApurementTrendResponseDto, PeriodFilter } from 'libs/dto/statistics/apurement-statistics.dto';
export declare class StatisticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private calculatePeriodDates;
    getApurementStatistics(query: ApurementStatisticsQueryDto): Promise<ApurementStatisticsResponseDto>;
    getApurementByBureau(query: ApurementStatisticsQueryDto): Promise<ApurementByBureauResponseDto[]>;
    getApurementTrend(query: {
        bureauSortieId?: number;
        dateDebut?: string;
        dateFin?: string;
        period?: PeriodFilter;
        groupBy?: 'day' | 'week' | 'month';
    }): Promise<ApurementTrendResponseDto[]>;
    private getWeekNumber;
    getDashboardOverview(query: ApurementStatisticsQueryDto): Promise<{
        current: ApurementStatisticsResponseDto;
        previous: ApurementStatisticsResponseDto;
        comparison: {
            totalOrdresChange: number;
            tauxApurementChange: number;
        };
        topBureaux: ApurementByBureauResponseDto[];
        bottomBureaux: ApurementByBureauResponseDto[];
    }>;
    private getPreviousPeriodStats;
    private calculatePercentageChange;
    getMarchandiseStatistics(query: {
        bureauSortieId?: number;
        dateDebut?: string;
        dateFin?: string;
        limit?: number;
    }): Promise<{
        marchandises: {
            natureMarchandise: any;
            totalColis: any;
            poidsTotal: number | null;
            valeurTotale: number | null;
            poidsMoyen: number | null;
            valeurMoyenne: number | null;
            nombreOrdres: any;
            pourcentage: number;
        }[];
        totaux: {
            totalColis: number;
            poidsTotal: number | null;
            valeurTotale: number | null;
            nombreMarchandisesDistinctes: number;
        };
        periode: {
            debut: Date;
            fin: Date;
        };
        bureauSortie: {
            id: number;
            code: string;
            name: string;
        } | null;
    }>;
    getMarchandiseByBureau(query: {
        dateDebut?: string;
        dateFin?: string;
        limit?: number;
    }): Promise<{
        bureauSortieId: number;
        bureauName: string;
        bureauCode: string;
        marchandises: {
            natureMarchandise: any;
            totalColis: any;
            poidsTotal: number | null;
            valeurTotale: number | null;
            poidsMoyen: number | null;
            valeurMoyenne: number | null;
            nombreOrdres: any;
            pourcentage: number;
        }[];
        totalColis: number;
    }[]>;
    getMarchandiseTrend(query: {
        bureauSortieId?: number;
        dateDebut?: string;
        dateFin?: string;
        groupBy?: 'day' | 'week' | 'month';
        topN?: number;
    }): Promise<{
        period: any;
        natureMarchandise: any;
        nombreColis: any;
        poidsTotal: number | null;
        valeurTotale: number | null;
    }[]>;
    getTopMarchandises(query: {
        bureauSortieId?: number;
        dateDebut?: string;
        dateFin?: string;
        limit?: number;
    }): Promise<{
        topMarchandises: {
            natureMarchandise: any;
            totalColis: any;
            poidsTotal: number | null;
            valeurTotale: number | null;
            poidsMoyen: number | null;
            valeurMoyenne: number | null;
            nombreOrdres: any;
            pourcentage: number;
        }[];
        periode: {
            debut: Date;
            fin: Date;
        };
        bureauSortie: {
            id: number;
            code: string;
            name: string;
        } | null;
    }>;
    getDestinationStatistics(query: {
        bureauSortieId?: number;
        dateDebut?: string;
        dateFin?: string;
        limit?: number;
    }): Promise<{
        destinations: {
            destination: any;
            totalConteneurs: any;
            totalCamions: any;
            totalVoitures: any;
            totalVehicules: any;
            totalTransports: any;
            nombreOrdres: any;
            pourcentage: number;
            moyenneConteneursParOrdre: number;
            moyenneVehiculesParOrdre: number;
        }[];
        totaux: {
            totalOrdres: number;
            totalConteneurs: any;
            totalCamions: any;
            totalVoitures: any;
            totalVehicules: any;
            totalTransports: any;
            nombreDestinationsDistinctes: number;
        };
        periode: {
            debut: Date;
            fin: Date;
        };
        bureauSortie: {
            id: number;
            code: string;
            name: string;
        } | null;
    }>;
    getDestinationByBureau(query: {
        dateDebut?: string;
        dateFin?: string;
        limit?: number;
    }): Promise<{
        bureauSortieId: number;
        bureauName: string;
        bureauCode: string;
        destinations: {
            destination: any;
            totalConteneurs: any;
            totalCamions: any;
            totalVoitures: any;
            totalVehicules: any;
            totalTransports: any;
            nombreOrdres: any;
            pourcentage: number;
            moyenneConteneursParOrdre: number;
            moyenneVehiculesParOrdre: number;
        }[];
        totalTransports: any;
    }[]>;
    getDestinationTrend(query: {
        bureauSortieId?: number;
        dateDebut?: string;
        dateFin?: string;
        groupBy?: 'day' | 'week' | 'month';
        topN?: number;
    }): Promise<{
        period: any;
        destination: any;
        nombreConteneurs: any;
        nombreCamions: any;
        nombreVoitures: any;
        nombreVehicules: any;
        nombreTransports: any;
    }[]>;
    getTopDestinations(query: {
        bureauSortieId?: number;
        dateDebut?: string;
        dateFin?: string;
        limit?: number;
    }): Promise<{
        topDestinations: {
            destination: any;
            totalConteneurs: any;
            totalCamions: any;
            totalVoitures: any;
            totalVehicules: any;
            totalTransports: any;
            nombreOrdres: any;
            pourcentage: number;
            moyenneConteneursParOrdre: number;
            moyenneVehiculesParOrdre: number;
        }[];
        periode: {
            debut: Date;
            fin: Date;
        };
        bureauSortie: {
            id: number;
            code: string;
            name: string;
        } | null;
    }>;
    getRouteStatistics(query: {
        bureauSortieId?: number;
        dateDebut?: string;
        dateFin?: string;
        limit?: number;
    }): Promise<{
        routes: {
            itineraire: any;
            destination: any;
            nombreOrdres: any;
            totalTransports: any;
            pourcentage: number;
        }[];
        periode: {
            debut: Date;
            fin: Date;
        };
        bureauSortie: {
            id: number;
            code: string;
            name: string;
        } | null;
    }>;
}
