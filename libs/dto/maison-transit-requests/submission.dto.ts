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
import { DocumentType } from './enums';

export class DocumentUploadDto {
    @IsEnum(DocumentType, { message: 'Type de document invalide' })
    @IsNotEmpty({ message: 'Le type de document est requis' })
    type: DocumentType;

    @IsString({ message: 'Le nom du fichier doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'Le nom du fichier est requis' })
    fileName: string;

    @IsUrl({}, { message: 'L\'URL du fichier est invalide' })
    @IsNotEmpty({ message: 'L\'URL du fichier est requise' })
    fileUrl: string;

    @IsOptional()
    @IsString()
    cloudinaryId?: string;

    @IsOptional()
    fileSize?: number;

    @IsOptional()
    @IsString()
    mimeType?: string;
}

export class SubmitMaisonTransitRequestDto {
    @IsString({ message: 'Le token d\'invitation doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'Le token d\'invitation est requis' })
    invitationToken: string;

    @IsEmail({}, { message: 'Email invalide' })
    @IsNotEmpty({ message: 'L\'email est requis' })
    email: string;

    @IsString({ message: 'Le nom de l\'entreprise doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'Le nom de l\'entreprise est requis' })
    companyName: string;

    @IsOptional()
    @IsString({ message: 'Le téléphone doit être une chaîne de caractères' })
    phone?: string;

    @IsOptional()
    @IsString({ message: 'L\'adresse doit être une chaîne de caractères' })
    address?: string;

    @IsString({ message: 'Le numéro NINEA doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'Le numéro NINEA est requis' })
    ninea: string;

    @IsString({ message: 'Le registre de commerce doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'Le registre de commerce est requis' })
    registreCommerce: string;

    @IsArray({ message: 'Les documents doivent être un tableau' })
    @ValidateNested({ each: true })
    @Type(() => DocumentUploadDto)
    documents: DocumentUploadDto[];
}
