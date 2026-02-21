import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, Max, IsEnum } from 'class-validator';
import { ModificationRequestStatus } from './mission.dto';

export class ModificationRequestQueryDto {
    @ApiPropertyOptional({
        description: 'Filtrer par statut',
        enum: ModificationRequestStatus,
        example: ModificationRequestStatus.APPROVED,
    })
    @IsOptional()
    @IsEnum(ModificationRequestStatus)
    status?: ModificationRequestStatus;

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
        description: 'Terme de recherche (recherche dans le numéro de l\'ordre)',
        example: 'MTD-2025',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        description: 'ID de la maison de transit (Filtré pour les admins)',
        example: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    maisonTransitId?: number;
}
