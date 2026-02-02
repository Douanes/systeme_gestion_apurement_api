import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsInt, IsString, IsDateString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Enum pour la granularité temporelle des statistiques
 */
export enum TimeGranularity {
    DAY = 'day',
    WEEK = 'week',
    MONTH = 'month',
    YEAR = 'year',
}

/**
 * DTO pour les paramètres de statistiques des déclarations
 */
export class DeclarationStatisticsQueryDto {
    @ApiPropertyOptional({
        description: 'Granularité temporelle (jour, semaine, mois, année)',
        enum: TimeGranularity,
        example: TimeGranularity.MONTH,
        default: TimeGranularity.MONTH,
    })
    @IsOptional()
    @IsEnum(TimeGranularity)
    granularity?: TimeGranularity = TimeGranularity.MONTH;

    @ApiPropertyOptional({
        description: 'Date de début de la période (YYYY-MM-DD)',
        example: '2024-01-01',
    })
    @IsOptional()
    @IsDateString()
    dateDebut?: string;

    @ApiPropertyOptional({
        description: 'Date de fin de la période (YYYY-MM-DD)',
        example: '2024-12-31',
    })
    @IsOptional()
    @IsDateString()
    dateFin?: string;

    @ApiPropertyOptional({
        description: 'Filtrer par ID de maison de transit',
        example: 1,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    maisonTransitId?: number;

    @ApiPropertyOptional({
        description: 'Filtrer par ID de régime',
        example: 1,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    regimeId?: number;

    @ApiPropertyOptional({
        description: 'Nombre de périodes à retourner (par défaut 12)',
        example: 12,
        default: 12,
        minimum: 1,
        maximum: 365,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(1)
    @Max(365)
    periods?: number = 12;
}

/**
 * DTO pour un point de données dans les statistiques (format chartData)
 */
export class StatisticsDataPointDto {
    @ApiProperty({
        description: 'Label de la période (ex: "Janvier", "S12 2024", "2024-01", etc.)',
        example: 'Janvier',
    })
    period: string;

    @ApiProperty({
        description: 'Nombre total de déclarations',
        example: 150,
    })
    declarations: number;

    @ApiProperty({
        description: 'Nombre de déclarations apurées',
        example: 100,
    })
    apurees: number;

    @ApiProperty({
        description: 'Nombre de déclarations non apurées',
        example: 50,
    })
    nonApurees: number;
}

/**
 * DTO pour la réponse des statistiques des déclarations
 */
export class DeclarationStatisticsResponseDto {
    @ApiProperty({
        description: 'Granularité utilisée',
        enum: TimeGranularity,
        example: TimeGranularity.MONTH,
    })
    granularity: TimeGranularity;

    @ApiProperty({
        description: 'Date de début de la période analysée',
        example: '2024-01-01T00:00:00.000Z',
    })
    dateDebut: Date;

    @ApiProperty({
        description: 'Date de fin de la période analysée',
        example: '2024-12-31T23:59:59.999Z',
    })
    dateFin: Date;

    @ApiProperty({
        description: 'Données des statistiques par période (format chartData)',
        type: [StatisticsDataPointDto],
        example: [
            { period: 'Janvier', declarations: 150, apurees: 100, nonApurees: 50 },
            { period: 'Février', declarations: 180, apurees: 120, nonApurees: 60 },
            { period: 'Mars', declarations: 200, apurees: 150, nonApurees: 50 },
        ],
    })
    chartData: StatisticsDataPointDto[];

    @ApiProperty({
        description: 'Totaux sur toute la période',
        example: {
            totalDeclarations: 1200,
            declarationsApurees: 800,
            declarationsNonApurees: 400,
            tauxApurement: 66.67,
        },
    })
    totals: {
        totalDeclarations: number;
        declarationsApurees: number;
        declarationsNonApurees: number;
        tauxApurement: number;
    };
}

/**
 * Enum pour le filtre de statut de livraison des parcelles
 */
export enum StatutLivraisonFilter {
    TOTALEMENT_LIVRE = 'TOTALEMENT_LIVRE',   // nbreColisRestant = 0
    PARTIELLEMENT_LIVRE = 'PARTIELLEMENT_LIVRE', // nbreColisRestant > 0 et < nbreColisTotal
    NON_LIVRE = 'NON_LIVRE',                 // nbreColisRestant = nbreColisTotal (aucune parcelle)
}

/**
 * DTO pour les paramètres de pagination et filtrage des déclarations
 */
export class DeclarationPaginationQueryDto {
    @ApiPropertyOptional({
        description: 'Numéro de page',
        example: 1,
        default: 1,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    page?: number = 1;

    @ApiPropertyOptional({
        description: 'Nombre d\'éléments par page',
        example: 10,
        default: 10,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    limit?: number = 10;

    @ApiPropertyOptional({
        description: 'Recherche par numéro de déclaration',
        example: 'DECL-2024',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        description: 'Filtrer par statut de livraison',
        enum: StatutLivraisonFilter,
        example: StatutLivraisonFilter.PARTIELLEMENT_LIVRE,
    })
    @IsOptional()
    @IsEnum(StatutLivraisonFilter)
    statutLivraison?: StatutLivraisonFilter;

    @ApiPropertyOptional({
        description: 'Filtrer par ID de maison de transit',
        example: 1,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    maisonTransitId?: number;

    @ApiPropertyOptional({
        description: 'Filtrer par ID de dépositaire',
        example: 1,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    depositaireId?: number;

    @ApiPropertyOptional({
        description: 'Filtrer par ID de bureau de sortie',
        example: 1,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    bureauSortieId?: number;

    @ApiPropertyOptional({
        description: 'Filtrer par ID de régime',
        example: 1,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    regimeId?: number;

    @ApiPropertyOptional({
        description: 'Date de déclaration minimum',
        example: '2024-01-01',
    })
    @IsOptional()
    @IsDateString()
    dateDeclarationMin?: string;

    @ApiPropertyOptional({
        description: 'Date de déclaration maximum',
        example: '2024-12-31',
    })
    @IsOptional()
    @IsDateString()
    dateDeclarationMax?: string;

    @ApiPropertyOptional({
        description: 'Champ de tri',
        example: 'createdAt',
        default: 'createdAt',
    })
    @IsOptional()
    @IsString()
    sortBy?: string = 'createdAt';

    @ApiPropertyOptional({
        description: 'Ordre de tri',
        example: 'desc',
        default: 'desc',
    })
    @IsOptional()
    @IsString()
    sortOrder?: 'asc' | 'desc' = 'desc';
}

/**
 * DTO pour une parcelle (ordre de mission lié à une déclaration)
 */
export class ParcelleResponseDto {
    @ApiProperty({ description: 'ID de la parcelle', example: 1 })
    id: number;

    @ApiProperty({ description: 'Nombre de colis dans cette parcelle', example: 50 })
    nbreColisParcelle: number;

    @ApiProperty({ description: 'Poids de cette parcelle (kg)', example: 250.5 })
    poidsParcelle: number;

    @ApiProperty({ description: 'Date de création', example: '2024-01-15T10:30:00.000Z' })
    createdAt: Date;

    @ApiProperty({
        description: 'Ordre de mission associé',
        example: {
            id: 1,
            number: 'MTD-2024-000001',
            destination: 'Port de Dakar',
            statut: 'EN_COURS',
            statutApurement: 'NON_APURE',
        }
    })
    ordreMission: {
        id: number;
        number: string;
        destination: string | null;
        itineraire: string | null;
        statut: string;
        statutApurement: string;
        dateOrdre: Date | null;
    };
}

/**
 * DTO pour la réponse d'une déclaration avec ses ordres de mission
 */
export class DeclarationWithOrdersResponseDto {
    @ApiProperty({ description: 'ID de la déclaration', example: 1 })
    id: number;

    @ApiProperty({ description: 'Numéro de déclaration', example: 'DECL-2024-001' })
    numeroDeclaration: string;

    @ApiProperty({ description: 'Date de déclaration', example: '2024-01-15' })
    dateDeclaration: Date;

    @ApiProperty({ description: 'Nombre total de colis déclarés', example: 100 })
    nbreColisTotal: number;

    @ApiProperty({ description: 'Poids total déclaré (kg)', example: 500.5 })
    poidsTotal: number;

    @ApiProperty({ description: 'Nombre de colis restant à livrer', example: 50 })
    nbreColisRestant: number;

    @ApiProperty({ description: 'Poids restant à livrer (kg)', example: 250.25 })
    poidsRestant: number;

    @ApiProperty({ description: 'Nombre de colis livrés (calculé)', example: 50 })
    nbreColisLivres: number;

    @ApiProperty({ description: 'Poids livré (kg) (calculé)', example: 250.25 })
    poidsLivre: number;

    @ApiProperty({ description: 'Pourcentage de livraison', example: 50 })
    pourcentageLivraison: number;

    @ApiProperty({
        description: 'Statut de livraison',
        enum: ['TOTALEMENT_LIVRE', 'PARTIELLEMENT_LIVRE', 'NON_LIVRE'],
        example: 'PARTIELLEMENT_LIVRE'
    })
    statutLivraison: string;

    @ApiPropertyOptional({
        description: 'Statut d\'apurement',
        example: 'NON_APURE',
        nullable: true,
    })
    statutApurement: string | null;

    @ApiPropertyOptional({
        description: 'Date d\'apurement',
        example: '2024-02-01',
        nullable: true,
    })
    dateApurement: Date | null;

    @ApiPropertyOptional({
        description: 'Régime douanier',
        example: { id: 1, name: 'Transit' },
        nullable: true,
    })
    regime: { id: number; name: string } | null;

    @ApiPropertyOptional({
        description: 'Maison de transit',
        example: { id: 1, name: 'Maison Transit Dakar', code: 'MTD' },
        nullable: true,
    })
    maisonTransit: { id: number; name: string; code: string } | null;

    @ApiPropertyOptional({
        description: 'Dépositaire',
        example: { id: 1, name: 'Dépositaire Test' },
        nullable: true,
    })
    depositaire: { id: number; name: string } | null;

    @ApiPropertyOptional({
        description: 'Bureau de sortie',
        example: { id: 1, name: 'Bureau Dakar', code: 'BSD' },
        nullable: true,
    })
    bureauSortie: { id: number; name: string; code: string } | null;

    @ApiProperty({
        description: 'Liste des parcelles (ordres de mission associés)',
        type: [ParcelleResponseDto],
    })
    parcelles: ParcelleResponseDto[];

    @ApiProperty({ description: 'Nombre total de parcelles', example: 2 })
    totalParcelles: number;

    @ApiProperty({ description: 'Date de création', example: '2024-01-15T10:30:00.000Z' })
    createdAt: Date;

    @ApiProperty({ description: 'Date de mise à jour', example: '2024-01-15T10:30:00.000Z' })
    updatedAt: Date;
}
