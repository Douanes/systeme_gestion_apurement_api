import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsInt,
    IsNumber,
    IsDateString,
    IsArray,
    ValidateNested,
    IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

// Enums matching Prisma schema
export enum StatutOrdreMission {
    EN_COURS = 'EN_COURS',
    DEPOSE = 'DEPOSE',
    TRAITE = 'TRAITE',
    COTATION = 'COTATION',
    REJETE = 'REJETE',
    ANNULE = 'ANNULE',
}

export enum StatutApurement {
    APURE_SE = 'APURE_SE',
    APURE = 'APURE',
    NON_APURE = 'NON_APURE',
    REJET = 'REJET',
}

export enum StatutLivraisonParcelle {
    PARTIELLEMENT_LIVRE = 'PARTIELLEMENT_LIVRE',
    TOTALEMENT_LIVRE = 'TOTALEMENT_LIVRE',
}

// Nested DTOs - CREATE new entities
export class CreateNestedDeclarationDto {
    @ApiProperty({
        description: 'Numéro de déclaration (peut être une nouvelle déclaration ou une déclaration existante)',
        example: 'DECL-2024-001',
    })
    @IsString()
    @IsNotEmpty()
    numeroDeclaration: string;

    @ApiProperty({
        description: 'Date de déclaration',
        example: '2024-01-15',
    })
    @IsDateString()
    @IsNotEmpty()
    dateDeclaration: string;

    @ApiProperty({
        description: 'Nombre total de colis déclarés',
        example: 100,
    })
    @IsInt()
    @IsNotEmpty()
    nbreColisTotal: number;

    @ApiProperty({
        description: 'Poids total déclaré (kg)',
        example: 500.50,
    })
    @IsNumber()
    @IsNotEmpty()
    poidsTotal: number;

    @ApiPropertyOptional({
        description: 'ID du dépositaire',
        example: 1,
    })
    @IsOptional()
    @IsInt()
    depositaireId?: number;

    @ApiPropertyOptional({
        description: 'ID de la maison de transit',
        example: 1,
    })
    @IsOptional()
    @IsInt()
    maisonTransitId?: number;

    @ApiPropertyOptional({
        description: 'ID du bureau de sortie',
        example: 1,
    })
    @IsOptional()
    @IsInt()
    bureauSortieId?: number;

    @ApiPropertyOptional({
        description: 'ID du régime douanier',
        example: 1,
    })
    @IsOptional()
    @IsInt()
    regimeId?: number;
}

export class CreateNestedColisDto {
    @ApiProperty({
        description: 'Numéro de la déclaration à laquelle cette ligne de marchandise appartient',
        example: 'DECL-2024-001',
    })
    @IsString()
    @IsNotEmpty()
    numeroDeclaration: string;

    @ApiProperty({
        description: 'Nature de la marchandise',
        example: 'Électronique - Ordinateurs portables',
    })
    @IsString()
    @IsNotEmpty()
    natureMarchandise: string;

    @ApiPropertyOptional({
        description: 'Position tarifaire',
        example: 847130,
    })
    @IsOptional()
    @IsInt()
    positionTarifaire?: number;

    @ApiPropertyOptional({
        description: 'Nombre d\'unités de cette marchandise dans cette parcelle (ex: 20 ordinateurs)',
        example: 20,
    })
    @IsOptional()
    @IsInt()
    nbreColis?: number;

    @ApiPropertyOptional({
        description: 'Poids total de cette ligne en kg (ex: 25kg pour 20 ordinateurs)',
        example: 25.0,
    })
    @IsOptional()
    @Type(() => Number)
    poids?: number;

    @ApiPropertyOptional({
        description: 'Valeur déclarée totale de cette ligne en FCFA',
        example: 2000000,
    })
    @IsOptional()
    @Type(() => Number)
    valeurDeclaree?: number;
}

export class CreateNestedConteneurDto {
    @ApiProperty({
        description: 'Numéro du conteneur',
        example: 'MSCU1234567',
    })
    @IsString()
    @IsNotEmpty()
    numConteneur: string;

    @ApiPropertyOptional({
        description: 'Numéro du plomb',
        example: 'PLB-2024-001',
    })
    @IsOptional()
    @IsString()
    numPlomb?: string;

    @ApiPropertyOptional({
        description: 'Nom du conducteur',
        example: 'Amadou Fall',
    })
    @IsOptional()
    @IsString()
    driverName?: string;

    @ApiPropertyOptional({
        description: 'Nationalité du conducteur',
        example: 'Sénégalaise',
    })
    @IsOptional()
    @IsString()
    driverNationality?: string;

    @ApiPropertyOptional({
        description: 'Téléphone',
        example: '+221771234567',
    })
    @IsOptional()
    @IsString()
    phone?: string;
}

export class CreateNestedCamionDto {
    @ApiProperty({
        description: 'Immatriculation du camion',
        example: 'DK-1234-AB',
    })
    @IsString()
    @IsNotEmpty()
    immatriculation: string;

    @ApiPropertyOptional({
        description: 'Nom du conducteur',
        example: 'Moussa Diop',
    })
    @IsOptional()
    @IsString()
    driverName?: string;

    @ApiPropertyOptional({
        description: 'Nationalité du conducteur',
        example: 'Sénégalaise',
    })
    @IsOptional()
    @IsString()
    driverNationality?: string;

    @ApiPropertyOptional({
        description: 'Téléphone',
        example: '+221772345678',
    })
    @IsOptional()
    @IsString()
    phone?: string;
}

export class CreateNestedVoitureDto {
    @ApiProperty({
        description: 'Numéro de châssis',
        example: 'VF1KZ0G0H12345678',
    })
    @IsString()
    @IsNotEmpty()
    chassis: string;

    @ApiPropertyOptional({
        description: 'Nom du conducteur',
        example: 'Fatou Sow',
    })
    @IsOptional()
    @IsString()
    driverName?: string;

    @ApiPropertyOptional({
        description: 'Nationalité du conducteur',
        example: 'Sénégalaise',
    })
    @IsOptional()
    @IsString()
    driverNationality?: string;

    @ApiPropertyOptional({
        description: 'Téléphone',
        example: '+221773456789',
    })
    @IsOptional()
    @IsString()
    phone?: string;
}

export class CreateOrdreMissionDto {
    @ApiPropertyOptional({
        description: 'Numéro d\'ordre (unique) - Généré automatiquement si non fourni (Format: MT-YYYY-NNNNNN)',
        example: 'MTD-2025-000001',
    })
    @IsOptional()
    @IsString()
    number?: string;

    @ApiPropertyOptional({
        description: 'Destination',
        example: 'Port de Dakar',
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    destination?: string;

    @ApiPropertyOptional({
        description: 'Itinéraire détaillé',
        example: 'Dakar -> Thiès -> Saint-Louis',
    })
    @IsOptional()
    @IsString()
    itineraire?: string;

    @ApiPropertyOptional({
        description: 'Date de l\'ordre',
        example: '2024-01-15',
    })
    @IsOptional()
    @IsDateString()
    dateOrdre?: string;

    @ApiPropertyOptional({
        description: 'ID du dépositaire',
        example: 1,
    })
    @IsOptional()
    @IsInt()
    depositaireId?: number;

    @ApiPropertyOptional({
        description: 'ID de la maison de transit',
        example: 1,
    })
    @IsOptional()
    @IsInt()
    maisonTransitId?: number;

    @ApiPropertyOptional({
        description: 'Statut de l\'ordre de mission',
        example: StatutOrdreMission.EN_COURS,
        enum: StatutOrdreMission,
        default: StatutOrdreMission.EN_COURS,
    })
    @IsOptional()
    @IsEnum(StatutOrdreMission)
    statut?: StatutOrdreMission;

    @ApiPropertyOptional({
        description: 'Statut d\'apurement',
        example: StatutApurement.NON_APURE,
        enum: StatutApurement,
        default: StatutApurement.NON_APURE,
    })
    @IsOptional()
    @IsEnum(StatutApurement)
    statutApurement?: StatutApurement;

    @ApiPropertyOptional({
        description: 'ID de l\'escouade',
        example: 1,
    })
    @IsOptional()
    @IsInt()
    escouadeId?: number;

    @ApiPropertyOptional({
        description: 'ID de l\'agent escorteur',
        example: 1,
    })
    @IsOptional()
    @IsInt()
    agentEscorteurId?: number;

    @ApiPropertyOptional({
        description: 'ID du bureau de sortie',
        example: 1,
    })
    @IsOptional()
    @IsInt()
    bureauSortieId?: number;

    @ApiPropertyOptional({
        description: 'Observations',
        example: 'Mission prioritaire - Contrôle renforcé requis',
    })
    @IsOptional()
    @IsString()
    observations?: string;

    @ApiPropertyOptional({
        description: 'Liste des déclarations (nouvelles ou existantes). Les champs nbreColisTotal et poidsTotal représentent les quantités déclarées initiales.',
        type: [CreateNestedDeclarationDto],
        example: [
            {
                numeroDeclaration: 'DECL-2024-001',
                dateDeclaration: '2024-01-15',
                nbreColisTotal: 50,
                poidsTotal: 30.0,
                depositaireId: 1,
                maisonTransitId: 1,
                bureauSortieId: 1,
            },
            {
                numeroDeclaration: 'DECL-2024-002',
                dateDeclaration: '2024-01-15',
                nbreColisTotal: 100,
                poidsTotal: 150.0,
                depositaireId: 1,
                maisonTransitId: 1,
                bureauSortieId: 1,
            },
        ],
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateNestedDeclarationDto)
    declarations?: CreateNestedDeclarationDto[];

    @ApiPropertyOptional({
        description: 'Liste des lignes de marchandises (colis) pour cette parcelle. Chaque ligne représente un type de marchandise avec sa quantité et son poids total. La somme de toutes les lignes constitue la parcelle de cet ordre de mission.',
        type: [CreateNestedColisDto],
        example: [
            {
                numeroDeclaration: 'DECL-2024-001',
                natureMarchandise: 'Électronique - Ordinateurs portables',
                positionTarifaire: 847130,
                nbreColis: 20,
                poids: 25.0,
                valeurDeclaree: 2000000,
            },
            {
                numeroDeclaration: 'DECL-2024-001',
                natureMarchandise: 'Électronique - Smartphones',
                positionTarifaire: 851712,
                nbreColis: 30,
                poids: 5.0,
                valeurDeclaree: 1500000,
            },
            {
                numeroDeclaration: 'DECL-2024-002',
                natureMarchandise: 'Textile - Vêtements',
                positionTarifaire: 620342,
                nbreColis: 100,
                poids: 150.0,
                valeurDeclaree: 500000,
            },
        ],
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateNestedColisDto)
    colis?: CreateNestedColisDto[];

    @ApiPropertyOptional({
        description: 'Liste des conteneurs à créer',
        type: [CreateNestedConteneurDto],
        example: [
            {
                numConteneur: 'MSCU1234567',
                driverName: 'Amadou Fall',
                driverNationality: 'Sénégalaise',
                phone: '+221771234567',
            },
        ],
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateNestedConteneurDto)
    conteneurs?: CreateNestedConteneurDto[];

    @ApiPropertyOptional({
        description: 'Liste des camions à créer',
        type: [CreateNestedCamionDto],
        example: [
            {
                immatriculation: 'DK-1234-AB',
                driverName: 'Moussa Diop',
                driverNationality: 'Sénégalaise',
                phone: '+221772345678',
            },
        ],
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateNestedCamionDto)
    camions?: CreateNestedCamionDto[];

    @ApiPropertyOptional({
        description: 'Liste des voitures à créer',
        type: [CreateNestedVoitureDto],
        example: [
            {
                chassis: 'VF1KZ0G0H12345678',
                driverName: 'Fatou Sow',
                driverNationality: 'Sénégalaise',
                phone: '+221773456789',
            },
        ],
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateNestedVoitureDto)
    voitures?: CreateNestedVoitureDto[];
}

export class UpdateOrdreMissionDto extends PartialType(CreateOrdreMissionDto) { }

export class AssignAgentEscorteurDto {
    @ApiProperty({
        description: 'ID de l\'agent escorteur à assigner',
        example: 1,
    })
    @IsInt()
    @IsNotEmpty()
    agentId: number;
}

export class UpdateStatutApurementDto {
    @ApiProperty({
        description: 'Nouveau statut d\'apurement de l\'ordre de mission',
        example: StatutApurement.APURE,
        enum: StatutApurement,
    })
    @IsEnum(StatutApurement)
    @IsNotEmpty()
    statutApurement: StatutApurement;
}

export class ChangeStatutOrdreMissionDto {
    @ApiProperty({
        description: 'Nouveau statut de l\'ordre de mission',
        example: StatutOrdreMission.DEPOSE,
        enum: StatutOrdreMission,
    })
    @IsEnum(StatutOrdreMission)
    @IsNotEmpty()
    statut: StatutOrdreMission;
}

export class OrdreMissionResponseDto {
    @ApiProperty({
        description: 'ID unique de l\'ordre de mission',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'Numéro d\'ordre unique',
        example: 'MTD-2025-000001',
    })
    number: string;

    @ApiPropertyOptional({
        description: 'Destination',
        example: 'Port de Dakar',
        nullable: true,
    })
    destination?: string | null;

    @ApiPropertyOptional({
        description: 'Itinéraire',
        example: 'Dakar -> Thiès',
        nullable: true,
    })
    itineraire?: string | null;

    @ApiPropertyOptional({
        description: 'Date de l\'ordre',
        example: '2024-01-15T00:00:00.000Z',
        nullable: true,
    })
    dateOrdre?: Date | null;

    @ApiPropertyOptional({
        description: 'ID du dépositaire',
        example: 1,
        nullable: true,
    })
    depositaireId?: number | null;

    @ApiPropertyOptional({
        description: 'ID de la maison de transit',
        example: 1,
        nullable: true,
    })
    maisonTransitId?: number | null;

    @ApiPropertyOptional({
        description: 'ID de l\'utilisateur créateur',
        example: 1,
        nullable: true,
    })
    createdById?: number | null;

    @ApiProperty({
        description: 'Statut de l\'ordre',
        example: StatutOrdreMission.EN_COURS,
        enum: StatutOrdreMission,
    })
    statut: StatutOrdreMission;

    @ApiProperty({
        description: 'Statut d\'apurement',
        example: StatutApurement.NON_APURE,
        enum: StatutApurement,
    })
    statutApurement: StatutApurement;

    @ApiPropertyOptional({
        description: 'ID de l\'escouade',
        example: 1,
        nullable: true,
    })
    escouadeId?: number | null;

    @ApiPropertyOptional({
        description: 'ID de l\'agent escorteur',
        example: 1,
        nullable: true,
    })
    agentEscorteurId?: number | null;

    @ApiPropertyOptional({
        description: 'ID du bureau de sortie',
        example: 1,
        nullable: true,
    })
    bureauSortieId?: number | null;

    @ApiPropertyOptional({
        description: 'Observations',
        example: 'Mission prioritaire',
        nullable: true,
    })
    observations?: string | null;

    @ApiPropertyOptional({
        description: 'ID du chef de bureau (snapshot au moment de la création)',
        example: 3,
        nullable: true,
    })
    chefBureauId?: number | null;

    @ApiPropertyOptional({
        description: 'ID du chef de section (snapshot au moment de la création)',
        example: 5,
        nullable: true,
    })
    chefSectionId?: number | null;

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

    @ApiPropertyOptional({
        description: 'Liste des déclarations liées à cet ordre de mission',
        type: 'array',
        isArray: true,
        example: [
            { id: 1, numeroDeclaration: 'DECL-2024-001' },
            { id: 2, numeroDeclaration: 'DECL-2024-002' },
        ],
    })
    declarations?: Array<{
        id: number;
        numeroDeclaration: string;
    }>;

    @ApiPropertyOptional({
        description: 'Nombre de parcelles (ordres de mission) créées pour les déclarations de cet ordre',
        example: 2,
    })
    nbreParcelles?: number;

    @ApiPropertyOptional({
        description: 'Statut de livraison des parcelles',
        example: StatutLivraisonParcelle.PARTIELLEMENT_LIVRE,
        enum: StatutLivraisonParcelle,
    })
    statutLivraisonParcelle?: StatutLivraisonParcelle;
}

export class OrdreMissionWithRelationsDto extends OrdreMissionResponseDto {
    @ApiPropertyOptional({
        description: 'Dépositaire',
        nullable: true,
        example: {
            id: 1,
            name: 'Dépositaire Dakar',
            phone1: '+221771111111',
        },
    })
    depositaire?: {
        id: number;
        name: string;
        phone1: string;
    } | null;

    @ApiPropertyOptional({
        description: 'Maison de transit',
        nullable: true,
        example: {
            id: 1,
            name: 'Maison Transit Dakar',
            code: 'MTD-001',
        },
    })
    maisonTransit?: {
        id: number;
        name: string;
        code: string;
    } | null;

    @ApiPropertyOptional({
        description: 'Utilisateur créateur',
        nullable: true,
        example: {
            id: 1,
            username: 'admin',
            email: 'admin@douanes.sn',
        },
    })
    createdBy?: {
        id: number;
        username: string;
        email: string;
    } | null;

    @ApiPropertyOptional({
        description: 'Agent escorteur',
        nullable: true,
        example: {
            id: 1,
            matricule: 'AG-001',
            firstname: 'Jean',
            lastname: 'Dupont',
        },
    })
    agentEscorteur?: {
        id: number;
        matricule?: string | null;  // Changed to allow null
        firstname: string;
        lastname: string;
    } | null;

    @ApiPropertyOptional({
        description: 'Bureau de sortie',
        nullable: true,
        example: {
            id: 1,
            name: 'Bureau Dakar',
            code: 'BDS-001',
        },
    })
    bureauSortie?: {
        id: number;
        name: string;
        code: string;
    } | null;

    @ApiPropertyOptional({
        description: 'Chef de bureau (snapshot au moment de la création)',
        nullable: true,
    })
    chefBureau?: any;

    @ApiPropertyOptional({
        description: 'Chef de section (snapshot au moment de la création)',
        nullable: true,
    })
    chefSection?: any;

    @ApiPropertyOptional({
        description: 'Escouade',
        nullable: true,
        example: {
            id: 1,
            name: 'Escouade Alpha',
        },
    })
    escouade?: {
        id: number;
        name: string;
    } | null;

    @ApiPropertyOptional({
        description: 'Déclarations avec informations sur les parcelles et leurs relations',
        type: 'array',
        isArray: true,
        example: [
            {
                id: 1,
                numeroDeclaration: 'DECL-2024-001',
                dateDeclaration: '2024-01-15',
                statutApurement: 'NON_APURE',
                nbreColisTotal: 500,
                poidsTotal: 500.50,
                nbreColisRestant: 400,
                poidsRestant: 400.50,
                regime: { id: 1, name: 'Transit', code: 'TR' },
                maisonTransit: { id: 1, name: 'Maison Transit Dakar', code: 'MTD' },
                depositaire: { id: 1, name: 'Dépositaire Dakar' },
                bureauSortie: { id: 1, name: 'Bureau Dakar', code: 'BDS' },
                parcelle: {
                    nbreColisParcelle: 100,
                    poidsParcelle: 100.00,
                },
                colis: [
                    {
                        id: 1,
                        natureMarchandise: 'Électronique',
                        nbreColis: 50,
                        poids: 50.25,
                        valeurDeclaree: 2500000,
                    },
                ],
            },
        ],
    })
    declarations?: Array<{
        id: number;
        numeroDeclaration: string;
        dateDeclaration: Date;
        statutApurement?: string | null;
        nbreColisTotal: number;
        poidsTotal: number;
        nbreColisRestant: number;
        poidsRestant: number;
        regime?: {
            id: number;
            name: string;
            code?: string | null;
        } | null;
        maisonTransit?: {
            id: number;
            name: string;
            code?: string | null;
        } | null;
        depositaire?: {
            id: number;
            name: string;
        } | null;
        bureauSortie?: {
            id: number;
            name: string;
            code?: string | null;
        } | null;
        parcelle: {
            nbreColisParcelle: number;
            poidsParcelle: number;
        };
        colis?: Array<{
            id: number;
            natureMarchandise: string;
            nbreColis?: number | null;
            poids?: number | null;
            valeurDeclaree?: number | null;
            positionTarifaire?: number | null;
        }>;
    }>;

    @ApiPropertyOptional({
        description: 'Conteneurs',
        type: 'array',
        isArray: true,
        example: [
            {
                id: 1,
                numConteneur: 'MSCU1234567',
                numPlomb: 'PLB-2024-001',
                driverName: 'Amadou Fall',
                driverNationality: 'Sénégalais',
                phone: '+221 77 123 45 67',
            },
        ],
    })
    conteneurs?: Array<{
        id: number;
        numConteneur: string;
        driverName?: string | null;  // Changed to allow null
    }>;

    @ApiPropertyOptional({
        description: 'Camions',
        type: 'array',
        isArray: true,
        example: [
            {
                id: 1,
                immatriculation: 'DK-1234-AB',
                driverName: 'Moussa Diop',
                driverNationality: 'Sénégalais',
                phone: '+221 77 234 56 78',
            },
        ],
    })
    camions?: Array<{
        id: number;
        immatriculation: string;
        driverName?: string | null;
        driverNationality?: string | null;
        phone?: string | null;
    }>;

    @ApiPropertyOptional({
        description: 'Voitures',
        type: 'array',
        isArray: true,
        example: [
            {
                id: 1,
                chassis: 'VF1KZ0G0H12345678',
                driverName: 'Fatou Sow',
                driverNationality: 'Sénégalaise',
                phone: '+221 77 345 67 89',
            },
        ],
    })
    voitures?: Array<{
        id: number;
        chassis: string;
        driverName?: string | null;
        driverNationality?: string | null;
        phone?: string | null;
    }>;
}

// ===== DTOs pour les documents d'ordre de mission =====

export class GenerateOrdreMissionUploadSignatureDto {
    @ApiProperty({
        description: 'Nom du fichier à uploader',
        example: 'bon_de_livraison.pdf',
    })
    @IsString({ message: 'Le nom du fichier doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'Le nom du fichier est requis' })
    fileName: string;
}

export class OrdreMissionUploadSignatureResponseDto {
    @ApiProperty({ example: 'https://api.cloudinary.com/v1_1/your-cloud/raw/upload' })
    upload_url: string;

    @ApiProperty({ example: 'a1b2c3d4e5f6...' })
    signature: string;

    @ApiProperty({ example: 1703001234567 })
    timestamp: number;

    @ApiProperty({ example: '123456789012345' })
    api_key: string;

    @ApiProperty({ example: 'your-cloud-name' })
    cloud_name: string;

    @ApiProperty({ example: 'ordre-mission-documents/document_1703001234567' })
    public_id: string;

    @ApiProperty({ example: 'raw' })
    resource_type: string;

    @ApiProperty({ example: 'authenticated' })
    type: string;
}

export class CreateOrdreMissionDocumentDto {
    @ApiProperty({ description: 'Nom du fichier', example: 'bon_de_livraison.pdf' })
    @IsString()
    @IsNotEmpty()
    fileName: string;

    @ApiProperty({ description: 'URL du fichier sur Cloudinary', example: 'https://res.cloudinary.com/...' })
    @IsString()
    @IsNotEmpty()
    fileUrl: string;

    @ApiPropertyOptional({ description: 'Taille du fichier en octets', example: 1024000 })
    @IsOptional()
    @IsInt()
    fileSize?: number;

    @ApiPropertyOptional({ description: 'Type MIME du fichier', example: 'application/pdf' })
    @IsOptional()
    @IsString()
    mimeType?: string;

    @ApiPropertyOptional({ description: 'Public ID Cloudinary', example: 'ordre-mission-documents/document_123' })
    @IsOptional()
    @IsString()
    cloudinaryId?: string;
}

export class OrdreMissionDocumentResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1 })
    ordreMissionId: number;

    @ApiProperty({ example: 1, required: false })
    maisonTransitId: number | null;

    @ApiProperty({ example: 'bon_de_livraison.pdf' })
    fileName: string;

    @ApiProperty({ example: 'https://res.cloudinary.com/...' })
    fileUrl: string;

    @ApiPropertyOptional({ example: 1024000 })
    fileSize?: number | null;

    @ApiPropertyOptional({ example: 'application/pdf' })
    mimeType?: string | null;

    @ApiPropertyOptional({ example: 'ordre-mission-documents/document_123' })
    cloudinaryId?: string | null;

    @ApiProperty({ example: 1, required: false })
    uploadedById: number | null;

    @ApiProperty({ example: '2024-12-22T10:30:00.000Z' })
    uploadedAt: Date;

    @ApiPropertyOptional({ description: 'Maison de transit' })
    maisonTransit?: any;

    @ApiPropertyOptional({ description: 'Utilisateur ayant uploadé' })
    uploadedBy?: any;
}

// ===== DTOs pour agent escorteur et statut apurement =====

export class AssignAgentEscorteurDto {
    @ApiProperty({ description: 'ID de l\'agent escorteur', example: 5 })
    @IsInt()
    @IsNotEmpty()
    agentId: number;
}

export class UpdateStatutApurementDto {
    @ApiProperty({
        description: 'Nouveau statut d\'apurement',
        enum: StatutApurement,
        example: StatutApurement.APURE,
    })
    @IsEnum(StatutApurement)
    @IsNotEmpty()
    statutApurement: StatutApurement;
}