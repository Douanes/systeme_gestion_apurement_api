import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsArray,
    ValidateNested,
    IsEnum,
    IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocumentType } from './enums';

export class DocumentUploadDto {
    @ApiProperty({
        description: 'Type de document uploadé',
        enum: DocumentType,
        example: DocumentType.REGISTRE_COMMERCE,
    })
    @IsEnum(DocumentType, { message: 'Type de document invalide' })
    @IsNotEmpty({ message: 'Le type de document est requis' })
    type: DocumentType;

    @ApiProperty({
        description: 'Nom du fichier uploadé',
        example: 'registre_commerce.pdf',
    })
    @IsString({ message: 'Le nom du fichier doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'Le nom du fichier est requis' })
    fileName: string;

    @ApiProperty({
        description: 'URL Cloudinary du fichier uploadé',
        example: 'https://res.cloudinary.com/cloud-name/image/upload/v1234567890/document.pdf',
    })
    @IsUrl({}, { message: 'L\'URL du fichier est invalide' })
    @IsNotEmpty({ message: 'L\'URL du fichier est requise' })
    fileUrl: string;

    @ApiPropertyOptional({
        description: 'ID Cloudinary du fichier (public_id)',
        example: 'maison-transit-docs/REGISTRE_COMMERCE_document_1703001234567',
    })
    @IsOptional()
    @IsString()
    cloudinaryId?: string;

    @ApiPropertyOptional({
        description: 'Taille du fichier en octets',
        example: 1024000,
    })
    @IsOptional()
    fileSize?: number;

    @ApiPropertyOptional({
        description: 'Type MIME du fichier',
        example: 'application/pdf',
    })
    @IsOptional()
    @IsString()
    mimeType?: string;
}

export class SubmitMaisonTransitRequestDto {
    @ApiProperty({
        description: 'Token d\'invitation reçu par email',
        example: 'abc123def456ghi789',
    })
    @IsString({ message: 'Le token d\'invitation doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'Le token d\'invitation est requis' })
    invitationToken: string;

    @ApiProperty({
        description: 'Email du transitaire (doit correspondre à l\'invitation)',
        example: 'transitaire@example.com',
    })
    @IsEmail({}, { message: 'Email invalide' })
    @IsNotEmpty({ message: 'L\'email est requis' })
    email: string;

    @ApiProperty({
        description: 'Nom de l\'entreprise (maison de transit)',
        example: 'TRANSIT PLUS SARL',
    })
    @IsString({ message: 'Le nom de l\'entreprise doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'Le nom de l\'entreprise est requis' })
    companyName: string;

    @ApiPropertyOptional({
        description: 'Numéro de téléphone de l\'entreprise',
        example: '+221 77 123 45 67',
    })
    @IsOptional()
    @IsString({ message: 'Le téléphone doit être une chaîne de caractères' })
    phone?: string;

    @ApiPropertyOptional({
        description: 'Adresse de l\'entreprise',
        example: '123 Avenue Pompidou, Dakar',
    })
    @IsOptional()
    @IsString({ message: 'L\'adresse doit être une chaîne de caractères' })
    address?: string;

    @ApiProperty({
        description: 'Numéro d\'identification national de l\'entreprise (NINEA)',
        example: '12345678901',
    })
    @IsString({ message: 'Le numéro NINEA doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'Le numéro NINEA est requis' })
    ninea: string;

    @ApiProperty({
        description: 'Numéro de registre de commerce',
        example: 'SN-DKR-2024-B-12345',
    })
    @IsString({ message: 'Le registre de commerce doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'Le registre de commerce est requis' })
    registreCommerce: string;

    @ApiProperty({
        description: 'Liste des documents uploadés (REGISTRE_COMMERCE, NINEA, CARTE_PROFESSIONNELLE obligatoires)',
        type: [DocumentUploadDto],
        example: [
            {
                type: 'REGISTRE_COMMERCE',
                fileName: 'registre_commerce.pdf',
                fileUrl: 'https://res.cloudinary.com/cloud-name/image/upload/v1234567890/document.pdf',
                fileSize: 1024000,
                mimeType: 'application/pdf',
            },
        ],
    })
    @IsArray({ message: 'Les documents doivent être un tableau' })
    @ValidateNested({ each: true })
    @Type(() => DocumentUploadDto)
    documents: DocumentUploadDto[];
}
