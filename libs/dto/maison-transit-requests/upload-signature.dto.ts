import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DocumentType } from './enums';

export class GenerateUploadSignatureDto {
    @ApiProperty({
        description: 'Type de document à uploader',
        enum: DocumentType,
        example: DocumentType.REGISTRE_COMMERCE,
    })
    @IsEnum(DocumentType, { message: 'Type de document invalide' })
    @IsNotEmpty({ message: 'Le type de document est requis' })
    documentType: DocumentType;

    @ApiProperty({
        description: 'Nom du fichier à uploader',
        example: 'registre_commerce.pdf',
    })
    @IsString({ message: 'Le nom du fichier doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'Le nom du fichier est requis' })
    fileName: string;
}

export class UploadSignatureResponseDto {
    @ApiProperty({
        description: 'URL pour uploader le fichier vers Cloudinary',
        example: 'https://api.cloudinary.com/v1_1/your-cloud/auto/upload',
    })
    upload_url: string;

    @ApiProperty({
        description: 'Signature générée pour l\'upload sécurisé',
        example: 'a1b2c3d4e5f6...',
    })
    signature: string;

    @ApiProperty({
        description: 'Timestamp de la signature',
        example: 1703001234567,
    })
    timestamp: number;

    @ApiProperty({
        description: 'Clé API Cloudinary',
        example: '123456789012345',
    })
    api_key: string;

    @ApiProperty({
        description: 'Nom du cloud Cloudinary',
        example: 'your-cloud-name',
    })
    cloud_name: string;

    @ApiProperty({
        description: 'Public ID du fichier dans Cloudinary (inclut le chemin complet avec le dossier)',
        example: 'maison-transit-documents/REGISTRE_COMMERCE_document_1703001234567',
    })
    public_id: string;
}
