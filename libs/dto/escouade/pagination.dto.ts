import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, Max, IsEnum } from 'class-validator';

export enum EscouadeSortField {
    ID = 'id',
    NAME = 'name',
    DESCRIPTION = 'description',
    OPERATIONAL_DATE = 'operationalDate',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
}

export class EscouadePaginationQueryDto {
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
        description: 'Terme de recherche (recherche dans le nom et la description)',
        example: 'Alpha',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        description: 'Champ de tri',
        example: EscouadeSortField.CREATED_AT,
        enum: EscouadeSortField,
        default: EscouadeSortField.CREATED_AT,
    })
    @IsOptional()
    @IsEnum(EscouadeSortField)
    sortBy?: EscouadeSortField = EscouadeSortField.CREATED_AT;

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