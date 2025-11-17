import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, Max, IsEnum, IsDateString } from 'class-validator';

export enum OrdreMissionSortField {
    ID = 'id',
    NUMERO_ORDRE = 'numeroOrdre',
    DATE_DEBUT = 'dateDebut',
    DATE_FIN = 'dateFin',
    LIEU = 'lieu',
    STATUT = 'statut',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
}

export class OrdreMissionPaginationQueryDto {
    @ApiPropertyOptional({
        description: 'Numéro de la page (commence à 1)',
        example: 1,
        minimum: 1,
        default: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        description: 'Nombre d\'éléments par page',
        example: 10,
        minimum: 1,
        maximum: 100,
        default: 10,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @ApiPropertyOptional({
        description: 'Terme de recherche (recherche dans numéro, lieu, objectif)',
        example: 'Port',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        description: 'Filtrer par statut',
        example: 'Planifié',
    })
    @IsOptional()
    @IsString()
    statut?: string;

    @ApiPropertyOptional({
        description: 'Filtrer par agent',
        example: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    agentId?: number;

    @ApiPropertyOptional({
        description: 'Filtrer par escouade',
        example: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    escouadeId?: number;

    @ApiPropertyOptional({
        description: 'Date de début minimum',
        example: '2024-01-01',
    })
    @IsOptional()
    @IsDateString()
    dateDebutMin?: string;

    @ApiPropertyOptional({
        description: 'Date de début maximum',
        example: '2024-12-31',
    })
    @IsOptional()
    @IsDateString()
    dateDebutMax?: string;

    @ApiPropertyOptional({
        description: 'Champ de tri',
        example: OrdreMissionSortField.CREATED_AT,
        enum: OrdreMissionSortField,
        default: OrdreMissionSortField.CREATED_AT,
    })
    @IsOptional()
    @IsEnum(OrdreMissionSortField)
    sortBy?: OrdreMissionSortField = OrdreMissionSortField.CREATED_AT;

    @ApiPropertyOptional({
        description: 'Ordre de tri',
        example: 'desc',
        enum: ['asc', 'desc'],
        default: 'desc',
    })
    @IsOptional()
    @IsEnum(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc' = 'desc';
}