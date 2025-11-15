import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, Max, IsEnum, IsBoolean } from 'class-validator';

export enum MaisonTransitSortField {
    ID = 'id',
    CODE = 'code',
    NAME = 'name',
    ADDRESS = 'address',
    PHONE = 'phone',
    EMAIL = 'email',
    IS_ACTIVE = 'isActive',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
}

export class MaisonTransitPaginationQueryDto {
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
        description: 'Terme de recherche (recherche dans le code, nom, adresse, téléphone et email)',
        example: 'Dakar',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        description: 'Filtrer par statut actif',
        example: true,
    })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({
        description: 'Champ de tri',
        example: MaisonTransitSortField.CREATED_AT,
        enum: MaisonTransitSortField,
        default: MaisonTransitSortField.CREATED_AT,
    })
    @IsOptional()
    @IsEnum(MaisonTransitSortField)
    sortBy?: MaisonTransitSortField = MaisonTransitSortField.CREATED_AT;

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