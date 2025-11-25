import { StatisticsService } from './statistics.service';
import { ApurementStatisticsQueryDto, ApurementStatisticsResponseDto, ApurementByBureauResponseDto, ApurementTrendResponseDto, PeriodFilter } from 'libs/dto/statistics/apurement-statistics.dto';
export declare class StatisticsController {
    private readonly statisticsService;
    constructor(statisticsService: StatisticsService);
    getApurementStatistics(query: ApurementStatisticsQueryDto): Promise<ApurementStatisticsResponseDto>;
    getApurementByBureau(query: ApurementStatisticsQueryDto): Promise<ApurementByBureauResponseDto[]>;
    getApurementTrend(bureauSortieId?: number, dateDebut?: string, dateFin?: string, period?: PeriodFilter, groupBy?: 'day' | 'week' | 'month'): Promise<ApurementTrendResponseDto[]>;
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
    getMarchandiseStatistics(bureauSortieId?: number, dateDebut?: string, dateFin?: string, limit?: number): Promise<{
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
    getMarchandiseByBureau(dateDebut?: string, dateFin?: string, limit?: number): Promise<{
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
    getMarchandiseTrend(bureauSortieId?: number, dateDebut?: string, dateFin?: string, groupBy?: 'day' | 'week' | 'month', topN?: number): Promise<{
        period: any;
        natureMarchandise: any;
        nombreColis: any;
        poidsTotal: number | null;
        valeurTotale: number | null;
    }[]>;
    getTopMarchandises(bureauSortieId?: number, dateDebut?: string, dateFin?: string, limit?: number): Promise<{
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
    getDestinationStatistics(bureauSortieId?: number, dateDebut?: string, dateFin?: string, limit?: number): Promise<{
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
    getDestinationByBureau(dateDebut?: string, dateFin?: string, limit?: number): Promise<{
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
    getDestinationTrend(bureauSortieId?: number, dateDebut?: string, dateFin?: string, groupBy?: 'day' | 'week' | 'month', topN?: number): Promise<{
        period: any;
        destination: any;
        nombreConteneurs: any;
        nombreCamions: any;
        nombreVoitures: any;
        nombreVehicules: any;
        nombreTransports: any;
    }[]>;
    getTopDestinations(bureauSortieId?: number, dateDebut?: string, dateFin?: string, limit?: number): Promise<{
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
    getRouteStatistics(bureauSortieId?: number, dateDebut?: string, dateFin?: string, limit?: number): Promise<{
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
