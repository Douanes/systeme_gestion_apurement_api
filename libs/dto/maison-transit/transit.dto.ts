import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsBoolean,
    IsEmail,
    IsInt,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateMaisonTransitDto {
    @ApiProperty({
        description: 'Code unique de la maison de transit',
        example: 'MT-001',
        minLength: 2,
        maxLength: 50,
    })
    @IsString()
    @IsNotEmpty({ message: 'Le code de la maison de transit est requis' })
    @MinLength(2, { message: 'Le code doit contenir au moins 2 caractères' })
    @MaxLength(50, { message: 'Le code ne peut pas dépasser 50 caractères' })
    code: string;

    @ApiProperty({
        description: 'Nom de la maison de transit',
        example: 'Maison de Transit Dakar',
        minLength: 2,
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty({ message: 'Le nom de la maison de transit est requis' })
    @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
    @MaxLength(255, { message: 'Le nom ne peut pas dépasser 255 caractères' })
    name: string;

    @ApiPropertyOptional({
        description: 'Adresse complète de la maison de transit',
        example: 'Avenue Malick Sy, Dakar, Sénégal',
    })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional({
        description: 'Numéro de téléphone',
        example: '+221771234567',
        maxLength: 20,
    })
    @IsOptional()
    @IsString()
    @MaxLength(20, { message: 'Le téléphone ne peut pas dépasser 20 caractères' })
    phone?: string;

    @ApiPropertyOptional({
        description: 'Adresse email',
        example: 'contact@maisontransit.sn',
        maxLength: 255,
    })
    @IsOptional()
    @IsEmail({}, { message: 'Email invalide' })
    @MaxLength(255, { message: 'L\'email ne peut pas dépasser 255 caractères' })
    email?: string;

    @ApiPropertyOptional({
        description: 'ID du responsable de la maison de transit',
        example: 1,
    })
    @IsOptional()
    @IsInt()
    responsableId?: number;

    @ApiPropertyOptional({
        description: 'Statut actif de la maison de transit',
        example: true,
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateMaisonTransitDto extends PartialType(CreateMaisonTransitDto) { }

export class MaisonTransitResponseDto {
    @ApiProperty({
        description: 'ID unique de la maison de transit',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'Code unique',
        example: 'MT-001',
    })
    code: string;

    @ApiProperty({
        description: 'Nom de la maison de transit',
        example: 'Maison de Transit Dakar',
    })
    name: string;

    @ApiPropertyOptional({
        description: 'Adresse',
        example: 'Avenue Malick Sy, Dakar, Sénégal',
        nullable: true,
    })
    address?: string | null;

    @ApiPropertyOptional({
        description: 'Numéro de téléphone',
        example: '+221771234567',
        nullable: true,
    })
    phone?: string | null;

    @ApiPropertyOptional({
        description: 'Adresse email',
        example: 'contact@maisontransit.sn',
        nullable: true,
    })
    email?: string | null;

    @ApiPropertyOptional({
        description: 'ID du responsable',
        example: 1,
        nullable: true,
    })
    responsableId?: number | null;

    @ApiProperty({
        description: 'Statut actif',
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

export class MaisonTransitWithRelationsDto extends MaisonTransitResponseDto {
    @ApiPropertyOptional({
        description: 'Responsable de la maison de transit',
    })
    responsable?: any;

    @ApiPropertyOptional({
        description: 'Liste des dépositaires',
        type: 'array',
        isArray: true,
    })
    depositaires?: any[];

    @ApiPropertyOptional({
        description: 'Liste des déclarations',
        type: 'array',
        isArray: true,
    })
    declarations?: any[];
}