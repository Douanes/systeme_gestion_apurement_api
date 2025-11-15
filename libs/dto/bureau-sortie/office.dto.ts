import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsBoolean,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateBureauSortieDto {
    @ApiProperty({
        description: 'Code unique du bureau de sortie',
        example: 'BS-001',
        minLength: 2,
        maxLength: 50,
    })
    @IsString()
    @IsNotEmpty({ message: 'Le code du bureau est requis' })
    @MinLength(2, { message: 'Le code doit contenir au moins 2 caractères' })
    @MaxLength(50, { message: 'Le code ne peut pas dépasser 50 caractères' })
    code: string;

    @ApiProperty({
        description: 'Nom du bureau de sortie',
        example: 'Bureau de Rosso',
        minLength: 2,
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty({ message: 'Le nom du bureau est requis' })
    @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
    @MaxLength(255, { message: 'Le nom ne peut pas dépasser 255 caractères' })
    name: string;

    @ApiPropertyOptional({
        description: 'Localisation géographique du bureau',
        example: 'Rosso, Région de Trarza',
        maxLength: 500,
    })
    @IsOptional()
    @IsString()
    @MaxLength(500, { message: 'La localisation ne peut pas dépasser 500 caractères' })
    localisation?: string;

    @ApiPropertyOptional({
        description: 'Pays frontalier',
        example: 'Mauritanie',
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100, { message: 'Le pays frontalier ne peut pas dépasser 100 caractères' })
    paysFrontiere?: string;

    @ApiPropertyOptional({
        description: 'Statut actif du bureau',
        example: true,
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateBureauSortieDto extends PartialType(CreateBureauSortieDto) { }

export class BureauSortieResponseDto {
    @ApiProperty({
        description: 'ID unique du bureau de sortie',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'Code unique du bureau',
        example: 'BS-001',
    })
    code: string;

    @ApiProperty({
        description: 'Nom du bureau de sortie',
        example: 'Bureau de Rosso',
    })
    name: string;

    @ApiPropertyOptional({
        description: 'Localisation géographique',
        example: 'Rosso, Région de Trarza',
        nullable: true,
    })
    localisation?: string | null;

    @ApiPropertyOptional({
        description: 'Pays frontalier',
        example: 'Mauritanie',
        nullable: true,
    })
    paysFrontiere?: string | null;

    @ApiProperty({
        description: 'Statut actif du bureau',
        example: true,
    })
    isActive: boolean;

    @ApiProperty({
        description: 'Date de création',
        example: '2024-01-15T10:30:00.000Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Date de dernière modification',
        example: '2024-01-15T10:30:00.000Z',
    })
    updatedAt: Date;
}

export class BureauSortieWithRelationsDto extends BureauSortieResponseDto {
    @ApiPropertyOptional({
        description: 'Liste des déclarations associées',
        type: 'array',
        isArray: true,
    })
    declarations?: any[];

    @ApiPropertyOptional({
        description: 'Liste des agents affectés',
        type: 'array',
        isArray: true,
    })
    agents?: any[];

    @ApiPropertyOptional({
        description: 'Liste des ordres de mission',
        type: 'array',
        isArray: true,
    })
    ordreMissions?: any[];
}