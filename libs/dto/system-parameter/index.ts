import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, Matches, MaxLength } from 'class-validator';

/**
 * DTO pour la réponse des paramètres système
 */
export class SystemParameterResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: '+221338001234', required: false })
    phone: string | null;

    @ApiProperty({ example: 'bureau@douanes.sn', required: false })
    email: string | null;

    @ApiProperty({ example: 'Rue 10, Dakar, Sénégal', required: false })
    address: string | null;

    @ApiProperty({ example: '2024-12-22T10:30:00.000Z' })
    createdAt: Date;

    @ApiProperty({ example: '2024-12-22T10:30:00.000Z' })
    updatedAt: Date;

    @ApiProperty({
        required: false,
        description: 'Agent chef de bureau',
        example: {
            id: 3,
            matricule: 'AG-003',
            firstname: 'Jean',
            lastname: 'Dupont',
        },
    })
    chefBureau?: {
        id: number;
        matricule?: string | null;
        firstname: string;
        lastname: string;
    } | null;

    @ApiProperty({
        required: false,
        description: 'Agent chef de section',
        example: {
            id: 5,
            matricule: 'AG-005',
            firstname: 'Marie',
            lastname: 'Sarr',
        },
    })
    chefSection?: {
        id: number;
        matricule?: string | null;
        firstname: string;
        lastname: string;
    } | null;
}

/**
 * DTO pour mettre à jour les informations de contact
 */
export class UpdateSystemParameterContactDto {
    @ApiProperty({ example: '+221338001234', required: false })
    @IsOptional()
    @IsString()
    @Matches(/^\+?[1-9]\d{1,14}$/, {
        message: 'Le numéro de téléphone doit être au format international',
    })
    phone?: string;

    @ApiProperty({ example: 'bureau@douanes.sn', required: false })
    @IsOptional()
    @IsEmail({}, { message: 'Email invalide' })
    email?: string;

    @ApiProperty({ example: 'Rue 10, Dakar, Sénégal', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(500, { message: "L'adresse ne peut pas dépasser 500 caractères" })
    address?: string;
}
