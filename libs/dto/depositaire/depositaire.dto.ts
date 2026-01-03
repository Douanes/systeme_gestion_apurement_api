import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsEmail,
    IsInt,
    IsBoolean,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateDepositaireDto {
    @ApiProperty({
        description: 'Nom du dépositaire',
        example: 'SOGADIS',
        minLength: 2,
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty({ message: 'Le nom du dépositaire est requis' })
    @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
    @MaxLength(255, { message: 'Le nom ne peut pas dépasser 255 caractères' })
    name: string;

    @ApiProperty({
        description: 'Numéro de téléphone principal',
        example: '+221 77 123 45 67',
        maxLength: 20,
    })
    @IsString()
    @IsNotEmpty({ message: 'Le numéro de téléphone principal est requis' })
    @MaxLength(20, { message: 'Le numéro ne peut pas dépasser 20 caractères' })
    phone1: string;

    @ApiPropertyOptional({
        description: 'Numéro de téléphone secondaire',
        example: '+221 33 123 45 67',
        maxLength: 20,
    })
    @IsOptional()
    @IsString()
    @MaxLength(20, { message: 'Le numéro ne peut pas dépasser 20 caractères' })
    phone2?: string;

    @ApiPropertyOptional({
        description: 'Adresse physique du dépositaire',
        example: 'Rue 10, Quartier des Affaires, Dakar',
    })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional({
        description: 'Adresse email du dépositaire',
        example: 'contact@sogadis.sn',
    })
    @IsOptional()
    @IsEmail({}, { message: 'Adresse email invalide' })
    email?: string;

    @ApiPropertyOptional({
        description: 'Numéro d\'identification (NINEA, Registre de Commerce, etc.)',
        example: '123456789',
    })
    @IsOptional()
    @IsString()
    identificationNumber?: string;

    @ApiPropertyOptional({
        description: 'ID de la maison de transit associée',
        example: 1,
    })
    @IsOptional()
    @IsInt()
    maisonTransitId?: number;
}

export class UpdateDepositaireDto extends PartialType(CreateDepositaireDto) {
    @ApiPropertyOptional({
        description: 'Statut actif du dépositaire',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class DepositaireResponseDto {
    @ApiProperty({
        description: 'ID unique du dépositaire',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'Nom du dépositaire',
        example: 'SOGADIS',
    })
    name: string;

    @ApiProperty({
        description: 'Numéro de téléphone principal',
        example: '+221 77 123 45 67',
    })
    phone1: string;

    @ApiPropertyOptional({
        description: 'Numéro de téléphone secondaire',
        example: '+221 33 123 45 67',
        nullable: true,
    })
    phone2?: string | null;

    @ApiPropertyOptional({
        description: 'Adresse physique',
        example: 'Rue 10, Quartier des Affaires, Dakar',
        nullable: true,
    })
    address?: string | null;

    @ApiPropertyOptional({
        description: 'Adresse email',
        example: 'contact@sogadis.sn',
        nullable: true,
    })
    email?: string | null;

    @ApiPropertyOptional({
        description: 'Numéro d\'identification',
        example: '123456789',
        nullable: true,
    })
    identificationNumber?: string | null;

    @ApiProperty({
        description: 'Statut actif',
        example: true,
    })
    isActive: boolean;

    @ApiPropertyOptional({
        description: 'ID de la maison de transit associée',
        example: 1,
        nullable: true,
    })
    maisonTransitId?: number | null;

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

export class DepositaireWithRelationsDto extends DepositaireResponseDto {
    @ApiPropertyOptional({
        description: 'Maison de transit associée',
    })
    maisonTransit?: any;

    @ApiPropertyOptional({
        description: 'Nombre de déclarations',
        example: 25,
    })
    declarationsCount?: number;

    @ApiPropertyOptional({
        description: 'Nombre d\'ordres de mission',
        example: 10,
    })
    ordreMissionsCount?: number;
}
