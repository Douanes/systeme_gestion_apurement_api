export declare enum PeriodFilter {
    TODAY = "TODAY",
    THIS_WEEK = "THIS_WEEK",
    THIS_MONTH = "THIS_MONTH",
    THIS_YEAR = "THIS_YEAR",
    LAST_7_DAYS = "LAST_7_DAYS",
    LAST_30_DAYS = "LAST_30_DAYS",
    LAST_90_DAYS = "LAST_90_DAYS",
    CUSTOM = "CUSTOM"
}
export declare class ApurementStatisticsQueryDto {
    bureauSortieId?: number;
    dateDebut?: string;
    dateFin?: string;
    period?: PeriodFilter;
}
export declare class ApurementStatisticsResponseDto {
    totalOrdres: number;
    apures: number;
    nonApures: number;
    rejetes: number;
    tauxApurement: number;
    periode: {
        debut: Date;
        fin: Date;
    };
    bureauSortie?: {
        id: number;
        name: string;
        code: string;
    } | null;
}
export declare class ApurementByBureauResponseDto {
    bureauSortieId: number;
    bureauName: string;
    bureauCode: string;
    totalOrdres: number;
    apures: number;
    nonApures: number;
    rejetes: number;
    tauxApurement: number;
}
export declare class ApurementTrendResponseDto {
    period: string;
    totalOrdres: number;
    apures: number;
    nonApures: number;
    rejetes: number;
    tauxApurement: number;
}
export declare class MarchandiseStatisticsQueryDto {
    bureauSortieId?: number;
    dateDebut?: string;
    dateFin?: string;
    limit?: number;
}
export declare class MarchandiseStatisticsItemDto {
    natureMarchandise: string;
    totalColis: number;
    poidsTotal: number | null;
    valeurTotale: number | null;
    poidsMoyen: number | null;
    valeurMoyenne: number | null;
    nombreOrdres: number;
    pourcentage: number;
}
export declare class MarchandiseStatisticsResponseDto {
    marchandises: MarchandiseStatisticsItemDto[];
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
    bureauSortie?: {
        id: number;
        name: string;
        code: string;
    } | null;
}
export declare class MarchandiseByBureauDto {
    bureauSortieId: number;
    bureauName: string;
    bureauCode: string;
    marchandises: MarchandiseStatisticsItemDto[];
    totalColis: number;
}
export declare class MarchandiseTrendDto {
    period: string;
    natureMarchandise: string;
    nombreColis: number;
    poidsTotal: number | null;
    valeurTotale: number | null;
}
export declare class DestinationStatisticsQueryDto {
    bureauSortieId?: number;
    dateDebut?: string;
    dateFin?: string;
    limit?: number;
}
export declare class DestinationStatisticsItemDto {
    destination: string;
    totalConteneurs: number;
    totalCamions: number;
    totalVoitures: number;
    totalVehicules: number;
    totalTransports: number;
    nombreOrdres: number;
    pourcentage: number;
    moyenneConteneursParOrdre: number;
    moyenneVehiculesParOrdre: number;
}
export declare class DestinationStatisticsResponseDto {
    destinations: DestinationStatisticsItemDto[];
    totaux: {
        totalOrdres: number;
        totalConteneurs: number;
        totalCamions: number;
        totalVoitures: number;
        totalVehicules: number;
        totalTransports: number;
        nombreDestinationsDistinctes: number;
    };
    periode: {
        debut: Date;
        fin: Date;
    };
    bureauSortie?: {
        id: number;
        name: string;
        code: string;
    } | null;
}
export declare class DestinationByBureauDto {
    bureauSortieId: number;
    bureauName: string;
    bureauCode: string;
    destinations: DestinationStatisticsItemDto[];
    totalTransports: number;
}
export declare class DestinationTrendDto {
    period: string;
    destination: string;
    nombreConteneurs: number;
    nombreCamions: number;
    nombreVoitures: number;
    nombreVehicules: number;
    nombreTransports: number;
}
export declare class DestinationRouteDto {
    itineraire: string;
    destination: string;
    nombreOrdres: number;
    totalTransports: number;
    pourcentage: number;
}
