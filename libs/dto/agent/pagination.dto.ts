import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, Max, IsEnum, IsBoolean } from 'class-validator';

export enum AgentSortField {
    ID = 'id',
    MATRICULE = 'matricule',
    GRADE = 'grade',
    FIRSTNAME = 'firstname',
    LASTNAME = 'lastname',
    EMAIL = 'email',
    PHONE = 'phone',
    AFFECTED_AT = 'affectedAt',
    IS_ACTIVE = 'isActive',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
}

export class AgentPaginationQueryDto {
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
        description: 'Terme de recherche (recherche dans matricule, prénom, nom, email, téléphone)',
        example: 'Dupont',
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
        description: 'Filtrer par bureau d\'affectation',
        example: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    officeId?: number;

    @ApiPropertyOptional({
        description: 'Filtrer par grade',
        example: 'Inspecteur',
    })
    @IsOptional()
    @IsString()
    grade?: string;

    @ApiPropertyOptional({
        description: 'Champ de tri',
        example: AgentSortField.CREATED_AT,
        enum: AgentSortField,
        default: AgentSortField.CREATED_AT,
    })
    @IsOptional()
    @IsEnum(AgentSortField)
    sortBy?: AgentSortField = AgentSortField.CREATED_AT;

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