import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, Max, IsEnum, IsBoolean } from 'class-validator';

export enum DepositaireSortField {
    ID = 'id',
    NAME = 'name',
    PHONE1 = 'phone1',
    EMAIL = 'email',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
}

export class DepositairePaginationQueryDto {
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
        description: 'Terme de recherche (recherche dans nom, email, téléphone)',
        example: 'SOGADIS',
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
        description: 'Filtrer par maison de transit',
        example: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    maisonTransitId?: number;

    @ApiPropertyOptional({
        description: 'Champ de tri',
        example: DepositaireSortField.CREATED_AT,
        enum: DepositaireSortField,
        default: DepositaireSortField.CREATED_AT,
    })
    @IsOptional()
    @IsEnum(DepositaireSortField)
    sortBy?: DepositaireSortField = DepositaireSortField.CREATED_AT;

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
