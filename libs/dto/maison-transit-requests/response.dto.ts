import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RequestStatus, DocumentType } from './enums';
import { IsEnum, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class RequestDocumentDto {
    @ApiProperty({ description: 'ID du document', example: 1 })
    id: number;

    @ApiProperty({
        description: 'Type de document',
        enum: DocumentType,
        example: DocumentType.REGISTRE_COMMERCE,
    })
    type: DocumentType;

    @ApiProperty({
        description: 'Nom du fichier',
        example: 'registre_commerce.pdf',
    })
    fileName: string;

    @ApiProperty({
        description: 'URL Cloudinary du fichier',
        example: 'https://res.cloudinary.com/cloud-name/image/upload/v1234567890/document.pdf',
    })
    fileUrl: string;

    @ApiPropertyOptional({
        description: 'Taille du fichier en octets',
        example: 1024000,
    })
    fileSize?: number;

    @ApiPropertyOptional({
        description: 'Type MIME du fichier',
        example: 'application/pdf',
    })
    mimeType?: string;

    @ApiProperty({
        description: 'Date d\'upload du document',
        example: '2024-01-15T10:30:00Z',
    })
    uploadedAt: Date;
}

export class MaisonTransitRequestResponseDto {
    @ApiProperty({ description: 'ID de la demande', example: 1 })
    id: number;

    @ApiProperty({
        description: 'Email du transitaire',
        example: 'transitaire@example.com',
    })
    email: string;

    @ApiProperty({
        description: 'Nom de l\'entreprise',
        example: 'TRANSIT PLUS SARL',
    })
    companyName: string;

    @ApiPropertyOptional({
        description: 'Numéro de téléphone',
        example: '+221 77 123 45 67',
    })
    phone?: string;

    @ApiPropertyOptional({
        description: 'Adresse de l\'entreprise',
        example: '123 Avenue Pompidou, Dakar',
    })
    address?: string;

    @ApiPropertyOptional({
        description: 'Numéro NINEA',
        example: '12345678901',
    })
    ninea?: string;

    @ApiPropertyOptional({
        description: 'Numéro de registre de commerce',
        example: 'SN-DKR-2024-B-12345',
    })
    registreCommerce?: string;

    @ApiProperty({
        description: 'Statut de la demande',
        enum: RequestStatus,
        example: RequestStatus.EN_ATTENTE,
    })
    status: RequestStatus;

    @ApiPropertyOptional({
        description: 'Token d\'invitation (visible uniquement par admin/inviteur)',
        example: 'abc123def456ghi789',
    })
    invitationToken?: string;

    @ApiProperty({
        description: 'Date d\'expiration du token',
        example: '2024-01-22T10:30:00Z',
    })
    tokenExpiresAt: Date;

    @ApiProperty({
        description: 'ID de l\'utilisateur qui a invité',
        example: 1,
    })
    invitedById: number;

    @ApiPropertyOptional({
        description: 'ID de l\'utilisateur qui a validé/rejeté',
        example: 2,
    })
    reviewedById?: number;

    @ApiPropertyOptional({
        description: 'Date de validation/rejet',
        example: '2024-01-16T14:20:00Z',
    })
    reviewedAt?: Date;

    @ApiPropertyOptional({
        description: 'Raison du rejet (si rejetée)',
        example: 'Documents incomplets',
    })
    rejectionReason?: string;

    @ApiPropertyOptional({
        description: 'Date d\'activation du compte',
        example: '2024-01-17T09:00:00Z',
    })
    activatedAt?: Date;

    @ApiProperty({
        description: 'Date de création de la demande',
        example: '2024-01-15T10:30:00Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Date de dernière mise à jour',
        example: '2024-01-16T14:20:00Z',
    })
    updatedAt: Date;

    @ApiPropertyOptional({
        description: 'Documents soumis',
        type: [RequestDocumentDto],
    })
    documents?: RequestDocumentDto[];
}

export class InvitationResponseDto {
    @ApiProperty({
        description: 'Message de confirmation',
        example: 'Invitation envoyée avec succès',
    })
    message: string;

    @ApiProperty({
        description: 'Token d\'invitation généré',
        example: 'abc123def456ghi789',
    })
    invitationToken: string;

    @ApiProperty({
        description: 'Date d\'expiration du token',
        example: '2024-01-22T10:30:00Z',
    })
    expiresAt: Date;
}

export class PaginatedRequestsResponseDto {
    @ApiProperty({
        description: 'Liste des demandes',
        type: [MaisonTransitRequestResponseDto],
    })
    data: MaisonTransitRequestResponseDto[];

    @ApiProperty({
        description: 'Nombre total de demandes',
        example: 50,
    })
    total: number;

    @ApiProperty({
        description: 'Page actuelle',
        example: 1,
    })
    page: number;

    @ApiProperty({
        description: 'Nombre d\'éléments par page',
        example: 10,
    })
    limit: number;

    @ApiProperty({
        description: 'Nombre total de pages',
        example: 5,
    })
    totalPages: number;
}

export class RequestFilterDto {
    @ApiPropertyOptional({
        description: 'Filtrer par statut',
        enum: RequestStatus,
        example: RequestStatus.EN_ATTENTE,
    })
    @IsOptional()
    @IsEnum(RequestStatus)
    status?: RequestStatus;

    @ApiPropertyOptional({
        description: 'Filtrer par email',
        example: 'transitaire@example.com',
    })
    @IsOptional()
    @IsString()
    email?: string;

    @ApiPropertyOptional({
        description: 'Recherche textuelle (nom d\'entreprise, email)',
        example: 'TRANSIT PLUS',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        description: 'Numéro de page',
        example: 1,
        minimum: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @ApiPropertyOptional({
        description: 'Nombre d\'éléments par page',
        example: 10,
        minimum: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;
}
