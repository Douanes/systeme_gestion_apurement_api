import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsOptional,
    IsDateString,
    IsInt,
    IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PeriodFilter {
    TODAY = 'TODAY',
    THIS_WEEK = 'THIS_WEEK',
    THIS_MONTH = 'THIS_MONTH',
    THIS_YEAR = 'THIS_YEAR',
    LAST_7_DAYS = 'LAST_7_DAYS',
    LAST_30_DAYS = 'LAST_30_DAYS',
    LAST_90_DAYS = 'LAST_90_DAYS',
    CUSTOM = 'CUSTOM',
}

export class ApurementStatisticsQueryDto {
    @ApiPropertyOptional({
        description: 'ID du bureau de sortie',
        example: 1,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    bureauSortieId?: number;

    @ApiPropertyOptional({
        description: 'Date de début (format ISO)',
        example: '2024-01-01',
    })
    @IsOptional()
    @IsDateString()
    dateDebut?: string;

    @ApiPropertyOptional({
        description: 'Date de fin (format ISO)',
        example: '2024-12-31',
    })
    @IsOptional()
    @IsDateString()
    dateFin?: string;

    @ApiPropertyOptional({
        description: 'Période prédéfinie',
        enum: PeriodFilter,
        example: PeriodFilter.THIS_MONTH,
    })
    @IsOptional()
    @IsEnum(PeriodFilter)
    period?: PeriodFilter;
}

export class ApurementStatisticsResponseDto {
    @ApiProperty({
        description: 'Total des ordres de mission',
        example: 150,
    })
    totalOrdres: number;

    @ApiProperty({
        description: 'Nombre d\'ordres apurés',
        example: 120,
    })
    apures: number;

    @ApiProperty({
        description: 'Nombre d\'ordres non apurés',
        example: 25,
    })
    nonApures: number;

    @ApiProperty({
        description: 'Nombre d\'ordres rejetés',
        example: 5,
    })
    rejetes: number;

    @ApiProperty({
        description: 'Taux d\'apurement (%)',
        example: 80.0,
    })
    tauxApurement: number;

    @ApiProperty({
        description: 'Période de la statistique',
        example: {
            debut: '2024-01-01T00:00:00.000Z',
            fin: '2024-12-31T23:59:59.999Z',
        },
    })
    periode: {
        debut: Date;
        fin: Date;
    };

    @ApiPropertyOptional({
        description: 'Bureau de sortie filtré (si applicable)',
        example: {
            id: 1,
            name: 'Bureau Dakar',
            code: 'BDS-001',
        },
        nullable: true,
    })
    bureauSortie?: {
        id: number;
        name: string;
        code: string;
    } | null;
}

export class ApurementByBureauResponseDto {
    @ApiProperty({
        description: 'ID du bureau de sortie',
        example: 1,
    })
    bureauSortieId: number;

    @ApiProperty({
        description: 'Nom du bureau',
        example: 'Bureau Dakar',
    })
    bureauName: string;

    @ApiProperty({
        description: 'Code du bureau',
        example: 'BDS-001',
    })
    bureauCode: string;

    @ApiProperty({
        description: 'Total des ordres',
        example: 50,
    })
    totalOrdres: number;

    @ApiProperty({
        description: 'Ordres apurés',
        example: 40,
    })
    apures: number;

    @ApiProperty({
        description: 'Ordres non apurés',
        example: 8,
    })
    nonApures: number;

    @ApiProperty({
        description: 'Ordres rejetés',
        example: 2,
    })
    rejetes: number;

    @ApiProperty({
        description: 'Taux d\'apurement (%)',
        example: 80.0,
    })
    tauxApurement: number;
}

export class ApurementTrendResponseDto {
    @ApiProperty({
        description: 'Date ou période',
        example: '2024-01',
    })
    period: string;

    @ApiProperty({
        description: 'Total des ordres',
        example: 50,
    })
    totalOrdres: number;

    @ApiProperty({
        description: 'Ordres apurés',
        example: 40,
    })
    apures: number;

    @ApiProperty({
        description: 'Ordres non apurés',
        example: 8,
    })
    nonApures: number;

    @ApiProperty({
        description: 'Ordres rejetés',
        example: 2,
    })
    rejetes: number;

    @ApiProperty({
        description: 'Taux d\'apurement (%)',
        example: 80.0,
    })
    tauxApurement: number;
}

export class MarchandiseStatisticsQueryDto {
    @ApiPropertyOptional({
        description: 'ID du bureau de sortie',
        example: 1,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    bureauSortieId?: number;

    @ApiPropertyOptional({
        description: 'Date de début (format ISO)',
        example: '2024-01-01',
    })
    @IsOptional()
    @IsDateString()
    dateDebut?: string;

    @ApiPropertyOptional({
        description: 'Date de fin (format ISO)',
        example: '2024-12-31',
    })
    @IsOptional()
    @IsDateString()
    dateFin?: string;

    @ApiPropertyOptional({
        description: 'Limite du nombre de résultats',
        example: 10,
        default: 20,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    limit?: number;
}

export class MarchandiseStatisticsItemDto {
    @ApiProperty({
        description: 'Nature de la marchandise',
        example: 'Électronique',
    })
    natureMarchandise: string;

    @ApiProperty({
        description: 'Nombre total de colis',
        example: 125,
    })
    totalColis: number;

    @ApiProperty({
        description: 'Poids total (kg)',
        example: 15420.5,
        nullable: true,
    })
    poidsTotal: number | null;

    @ApiProperty({
        description: 'Valeur totale déclarée',
        example: 125000000,
        nullable: true,
    })
    valeurTotale: number | null;

    @ApiProperty({
        description: 'Poids moyen par colis (kg)',
        example: 123.36,
        nullable: true,
    })
    poidsMoyen: number | null;

    @ApiProperty({
        description: 'Valeur moyenne par colis',
        example: 1000000,
        nullable: true,
    })
    valeurMoyenne: number | null;

    @ApiProperty({
        description: 'Nombre d\'ordres de mission distincts',
        example: 45,
    })
    nombreOrdres: number;

    @ApiProperty({
        description: 'Pourcentage du total (%)',
        example: 15.5,
    })
    pourcentage: number;
}

export class MarchandiseStatisticsResponseDto {
    @ApiProperty({
        description: 'Liste des statistiques par nature de marchandise',
        type: [MarchandiseStatisticsItemDto],
    })
    marchandises: MarchandiseStatisticsItemDto[];

    @ApiProperty({
        description: 'Totaux généraux',
        example: {
            totalColis: 805,
            poidsTotal: 98754.32,
            valeurTotale: 985000000,
            nombreMarchandisesDistinctes: 15,
        },
    })
    totaux: {
        totalColis: number;
        poidsTotal: number | null;
        valeurTotale: number | null;
        nombreMarchandisesDistinctes: number;
    };

    @ApiProperty({
        description: 'Période de la statistique',
        example: {
            debut: '2024-01-01T00:00:00.000Z',
            fin: '2024-12-31T23:59:59.999Z',
        },
    })
    periode: {
        debut: Date;
        fin: Date;
    };

    @ApiPropertyOptional({
        description: 'Bureau de sortie filtré (si applicable)',
        example: {
            id: 1,
            name: 'Bureau Dakar',
            code: 'BDS-001',
        },
        nullable: true,
    })
    bureauSortie?: {
        id: number;
        name: string;
        code: string;
    } | null;
}

export class MarchandiseByBureauDto {
    @ApiProperty({
        description: 'ID du bureau de sortie',
        example: 1,
    })
    bureauSortieId: number;

    @ApiProperty({
        description: 'Nom du bureau',
        example: 'Bureau Dakar',
    })
    bureauName: string;

    @ApiProperty({
        description: 'Code du bureau',
        example: 'BDS-001',
    })
    bureauCode: string;

    @ApiProperty({
        description: 'Statistiques des marchandises pour ce bureau',
        type: [MarchandiseStatisticsItemDto],
    })
    marchandises: MarchandiseStatisticsItemDto[];

    @ApiProperty({
        description: 'Total de colis pour ce bureau',
        example: 250,
    })
    totalColis: number;
}

export class MarchandiseTrendDto {
    @ApiProperty({
        description: 'Période (YYYY-MM ou YYYY-MM-DD)',
        example: '2024-01',
    })
    period: string;

    @ApiProperty({
        description: 'Nature de la marchandise',
        example: 'Électronique',
    })
    natureMarchandise: string;

    @ApiProperty({
        description: 'Nombre de colis',
        example: 45,
    })
    nombreColis: number;

    @ApiProperty({
        description: 'Poids total (kg)',
        example: 5420.5,
        nullable: true,
    })
    poidsTotal: number | null;

    @ApiProperty({
        description: 'Valeur totale',
        example: 45000000,
        nullable: true,
    })
    valeurTotale: number | null;
}


export class DestinationStatisticsQueryDto {
    @ApiPropertyOptional({
        description: 'ID du bureau de sortie',
        example: 1,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    bureauSortieId?: number;

    @ApiPropertyOptional({
        description: 'Date de début (format ISO)',
        example: '2024-01-01',
    })
    @IsOptional()
    @IsDateString()
    dateDebut?: string;

    @ApiPropertyOptional({
        description: 'Date de fin (format ISO)',
        example: '2024-12-31',
    })
    @IsOptional()
    @IsDateString()
    dateFin?: string;

    @ApiPropertyOptional({
        description: 'Limite du nombre de résultats',
        example: 10,
        default: 20,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    limit?: number;
}

export class DestinationStatisticsItemDto {
    @ApiProperty({
        description: 'Destination',
        example: 'Port de Dakar',
    })
    destination: string;

    @ApiProperty({
        description: 'Nombre total de conteneurs',
        example: 45,
    })
    totalConteneurs: number;

    @ApiProperty({
        description: 'Nombre total de camions',
        example: 32,
    })
    totalCamions: number;

    @ApiProperty({
        description: 'Nombre total de voitures',
        example: 18,
    })
    totalVoitures: number;

    @ApiProperty({
        description: 'Nombre total de véhicules (camions + voitures)',
        example: 50,
    })
    totalVehicules: number;

    @ApiProperty({
        description: 'Nombre total de transports (conteneurs + véhicules)',
        example: 95,
    })
    totalTransports: number;

    @ApiProperty({
        description: 'Nombre d\'ordres de mission distincts',
        example: 28,
    })
    nombreOrdres: number;

    @ApiProperty({
        description: 'Pourcentage du total (%)',
        example: 18.5,
    })
    pourcentage: number;

    @ApiProperty({
        description: 'Moyenne de conteneurs par ordre',
        example: 1.61,
    })
    moyenneConteneursParOrdre: number;

    @ApiProperty({
        description: 'Moyenne de véhicules par ordre',
        example: 1.79,
    })
    moyenneVehiculesParOrdre: number;
}

export class DestinationStatisticsResponseDto {
    @ApiProperty({
        description: 'Liste des statistiques par destination',
        type: [DestinationStatisticsItemDto],
    })
    destinations: DestinationStatisticsItemDto[];

    @ApiProperty({
        description: 'Totaux généraux',
        example: {
            totalOrdres: 156,
            totalConteneurs: 312,
            totalCamions: 245,
            totalVoitures: 128,
            totalVehicules: 373,
            totalTransports: 685,
            nombreDestinationsDistinctes: 12,
        },
    })
    totaux: {
        totalOrdres: number;
        totalConteneurs: number;
        totalCamions: number;
        totalVoitures: number;
        totalVehicules: number;
        totalTransports: number;
        nombreDestinationsDistinctes: number;
    };

    @ApiProperty({
        description: 'Période de la statistique',
        example: {
            debut: '2024-01-01T00:00:00.000Z',
            fin: '2024-12-31T23:59:59.999Z',
        },
    })
    periode: {
        debut: Date;
        fin: Date;
    };

    @ApiPropertyOptional({
        description: 'Bureau de sortie filtré (si applicable)',
        example: {
            id: 1,
            name: 'Bureau Dakar',
            code: 'BDS-001',
        },
        nullable: true,
    })
    bureauSortie?: {
        id: number;
        name: string;
        code: string;
    } | null;
}

export class DestinationByBureauDto {
    @ApiProperty({
        description: 'ID du bureau de sortie',
        example: 1,
    })
    bureauSortieId: number;

    @ApiProperty({
        description: 'Nom du bureau',
        example: 'Bureau Dakar',
    })
    bureauName: string;

    @ApiProperty({
        description: 'Code du bureau',
        example: 'BDS-001',
    })
    bureauCode: string;

    @ApiProperty({
        description: 'Statistiques des destinations pour ce bureau',
        type: [DestinationStatisticsItemDto],
    })
    destinations: DestinationStatisticsItemDto[];

    @ApiProperty({
        description: 'Total de transports pour ce bureau',
        example: 285,
    })
    totalTransports: number;
}

export class DestinationTrendDto {
    @ApiProperty({
        description: 'Période (YYYY-MM ou YYYY-MM-DD)',
        example: '2024-01',
    })
    period: string;

    @ApiProperty({
        description: 'Destination',
        example: 'Port de Dakar',
    })
    destination: string;

    @ApiProperty({
        description: 'Nombre de conteneurs',
        example: 45,
    })
    nombreConteneurs: number;

    @ApiProperty({
        description: 'Nombre de camions',
        example: 32,
    })
    nombreCamions: number;

    @ApiProperty({
        description: 'Nombre de voitures',
        example: 18,
    })
    nombreVoitures: number;

    @ApiProperty({
        description: 'Nombre total de véhicules',
        example: 50,
    })
    nombreVehicules: number;

    @ApiProperty({
        description: 'Nombre total de transports',
        example: 95,
    })
    nombreTransports: number;
}

export class DestinationRouteDto {
    @ApiProperty({
        description: 'Itinéraire',
        example: 'Dakar -> Thiès -> Saint-Louis',
    })
    itineraire: string;

    @ApiProperty({
        description: 'Destination finale',
        example: 'Saint-Louis',
    })
    destination: string;

    @ApiProperty({
        description: 'Nombre d\'ordres sur cet itinéraire',
        example: 15,
    })
    nombreOrdres: number;

    @ApiProperty({
        description: 'Nombre total de transports',
        example: 45,
    })
    totalTransports: number;

    @ApiProperty({
        description: 'Pourcentage du total',
        example: 8.5,
    })
    pourcentage: number;
}