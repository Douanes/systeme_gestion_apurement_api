import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsInt,
    IsDateString,
    IsArray,
    ValidateNested,
    IsEnum,
    IsDecimal,
    MaxLength,
    MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

// Enums matching Prisma schema
export enum StatutOrdreMission {
    EN_COURS = 'EN_COURS',
    TERMINE = 'TERMINE',
    ANNULE = 'ANNULE',
}

export enum StatutApurement {
    NON_APURE = 'NON_APURE',
    APURE_SE = 'APURE_SE',
    REJET = 'REJET',
}

// Nested DTOs - CREATE new entities
export class CreateNestedDeclarationDto {
    @ApiProperty({
        description: 'Numéro de déclaration',
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
        description: 'Nombre total de colis dans la déclaration complète',
        example: 500,
    })
    @IsInt()
    @IsNotEmpty()
    nbreColisTotal: number;

    @ApiProperty({
        description: 'Poids total de la déclaration complète en tonnes',
        example: 500.50,
    })
    @IsNotEmpty()
    poidsTotal: number;

    @ApiProperty({
        description: 'Nombre de colis pour cette parcelle (dans cet ordre de mission)',
        example: 100,
    })
    @IsInt()
    @IsNotEmpty()
    nbreColisParcelle: number;

    @ApiProperty({
        description: 'Poids pour cette parcelle (dans cet ordre de mission) en tonnes',
        example: 100.00,
    })
    @IsNotEmpty()
    poidsParcelle: number;

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
}

export class CreateNestedColisDto {
    @ApiProperty({
        description: 'Numéro de la déclaration à laquelle ce colis appartient',
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
        description: 'Nombre de colis',
        example: 10,
    })
    @IsOptional()
    @IsInt()
    nbreColis?: number;

    @ApiPropertyOptional({
        description: 'Poids en kg',
        example: 250.50,
    })
    @IsOptional()
    @Type(() => Number)
    poids?: number;

    @ApiPropertyOptional({
        description: 'Valeur déclarée en FCFA',
        example: 5000000,
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
        description: 'Liste des déclarations à créer',
        type: [CreateNestedDeclarationDto],
        example: [
            {
                numeroDeclaration: 'DECL-2024-001',
                dateDeclaration: '2024-01-15',
                depositaireId: 1,
            },
            {
                numeroDeclaration: 'DECL-2024-002',
                dateDeclaration: '2024-01-15',
                depositaireId: 1,
            },
        ],
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateNestedDeclarationDto)
    declarations?: CreateNestedDeclarationDto[];

    @ApiPropertyOptional({
        description: 'Liste des colis à créer',
        type: [CreateNestedColisDto],
        example: [
            {
                natureMarchandise: 'Électronique - Ordinateurs',
                positionTarifaire: 847130,
                poids: 250.5,
                valeurDeclaree: 5000000,
            },
            {
                natureMarchandise: 'Textile - Vêtements',
                poids: 100.0,
                valeurDeclaree: 1500000,
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
        description: 'Déclarations',
        type: 'array',
        isArray: true,
        example: [
            {
                id: 1,
                numeroDeclaration: 'DECL-2024-001',
                dateDeclaration: '2024-01-15',
                statutApurement: 'NON_APURE',
            },
        ],
    })
    declarations?: Array<{
        id: number;
        numeroDeclaration: string;
        dateDeclaration: Date;
        statutApurement?: string | null;  // Changed to allow null
    }>;

    @ApiPropertyOptional({
        description: 'Colis',
        type: 'array',
        isArray: true,
        example: [
            {
                id: 1,
                natureMarchandise: 'Électronique',
                poids: 250.5,
                valeurDeclaree: 5000000,
            },
        ],
    })
    colis?: Array<{
        id: number;
        natureMarchandise: string;
        poids?: number | null;  // Changed to allow null
        valeurDeclaree?: number | null;  // Changed to allow null
    }>;

    @ApiPropertyOptional({
        description: 'Conteneurs',
        type: 'array',
        isArray: true,
        example: [
            {
                id: 1,
                numConteneur: 'MSCU1234567',
                driverName: 'Amadou Fall',
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
            },
        ],
    })
    camions?: Array<{
        id: number;
        immatriculation: string;
        driverName?: string | null;  // Changed to allow null
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
            },
        ],
    })
    voitures?: Array<{
        id: number;
        chassis: string;
        driverName?: string | null;  // Changed to allow null
    }>;
}