import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsBoolean,
    IsEmail,
    IsInt,
    IsDateString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateAgentDto {
    @ApiPropertyOptional({
        description: 'Matricule unique de l\'agent',
        example: 'AG-2024-001',
        maxLength: 50,
    })
    @IsOptional()
    @IsString()
    @MaxLength(50, { message: 'Le matricule ne peut pas dépasser 50 caractères' })
    matricule?: string;

    @ApiPropertyOptional({
        description: 'Grade de l\'agent',
        example: 'Inspecteur Principal',
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100, { message: 'Le grade ne peut pas dépasser 100 caractères' })
    grade?: string;

    @ApiProperty({
        description: 'Prénom de l\'agent',
        example: 'Jean',
        minLength: 2,
        maxLength: 100,
    })
    @IsString()
    @IsNotEmpty({ message: 'Le prénom est requis' })
    @MinLength(2, { message: 'Le prénom doit contenir au moins 2 caractères' })
    @MaxLength(100, { message: 'Le prénom ne peut pas dépasser 100 caractères' })
    firstname: string;

    @ApiProperty({
        description: 'Nom de famille de l\'agent',
        example: 'Dupont',
        minLength: 2,
        maxLength: 100,
    })
    @IsString()
    @IsNotEmpty({ message: 'Le nom de famille est requis' })
    @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
    @MaxLength(100, { message: 'Le nom ne peut pas dépasser 100 caractères' })
    lastname: string;

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
        example: 'jean.dupont@douanes.sn',
        maxLength: 255,
    })
    @IsOptional()
    @IsEmail({}, { message: 'Email invalide' })
    @MaxLength(255, { message: 'L\'email ne peut pas dépasser 255 caractères' })
    email?: string;

    @ApiPropertyOptional({
        description: 'Date d\'affectation',
        example: '2024-01-15',
    })
    @IsOptional()
    @IsDateString()
    affectedAt?: string;

    @ApiPropertyOptional({
        description: 'ID du bureau d\'affectation',
        example: 1,
    })
    @IsOptional()
    @IsInt()
    officeId?: number;

    @ApiPropertyOptional({
        description: 'Statut actif de l\'agent',
        example: true,
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateAgentDto extends PartialType(CreateAgentDto) { }

export class AgentResponseDto {
    @ApiProperty({
        description: 'ID unique de l\'agent',
        example: 1,
    })
    id: number;

    @ApiPropertyOptional({
        description: 'Matricule unique',
        example: 'AG-2024-001',
        nullable: true,
    })
    matricule?: string | null;

    @ApiPropertyOptional({
        description: 'Grade',
        example: 'Inspecteur Principal',
        nullable: true,
    })
    grade?: string | null;

    @ApiProperty({
        description: 'Prénom',
        example: 'Jean',
    })
    firstname: string;

    @ApiProperty({
        description: 'Nom de famille',
        example: 'Dupont',
    })
    lastname: string;

    @ApiPropertyOptional({
        description: 'Numéro de téléphone',
        example: '+221771234567',
        nullable: true,
    })
    phone?: string | null;

    @ApiPropertyOptional({
        description: 'Adresse email',
        example: 'jean.dupont@douanes.sn',
        nullable: true,
    })
    email?: string | null;

    @ApiPropertyOptional({
        description: 'Date d\'affectation',
        example: '2024-01-15T00:00:00.000Z',
        nullable: true,
    })
    affectedAt?: Date | null;

    @ApiPropertyOptional({
        description: 'ID du bureau d\'affectation',
        example: 1,
        nullable: true,
    })
    officeId?: number | null;

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

export class AgentWithRelationsDto extends AgentResponseDto {
    @ApiPropertyOptional({
        description: 'Bureau d\'affectation',
        nullable: true,
        example: {
            id: 1,
            name: 'Bureau des Douanes de Dakar',
            code: 'BDD-001',
            address: 'Avenue Malick Sy, Dakar',
            phone: '+221771111111',
        },
    })
    bureauAffectation?: {
        id: number;
        name: string;
        code: string;
        address?: string;
        phone?: string;
    } | null;

    @ApiPropertyOptional({
        description: 'Déclarations associées',
        type: 'array',
        isArray: true,
        example: [
            {
                id: 1,
                numeroDeclaration: 'DECL-2024-001',
                dateDeclaration: '2024-01-15T00:00:00.000Z',
                typeDeclaration: 'Import',
                statut: 'Validée',
            },
            {
                id: 2,
                numeroDeclaration: 'DECL-2024-002',
                dateDeclaration: '2024-01-16T00:00:00.000Z',
                typeDeclaration: 'Export',
                statut: 'En cours',
            },
        ],
    })
    declarations?: Array<{
        id: number;
        numeroDeclaration: string;
        dateDeclaration: Date;
        typeDeclaration?: string;
        statut?: string;
    }>;

    @ApiPropertyOptional({
        description: 'Escouades dont l\'agent est chef',
        type: 'array',
        isArray: true,
        example: [
            {
                id: 1,
                name: 'Escouade Alpha',
                description: 'Escouade spécialisée dans les contrôles frontaliers',
                operationalDate: '2024-01-15T00:00:00.000Z',
            },
            {
                id: 2,
                name: 'Escouade Beta',
                description: 'Escouade de surveillance portuaire',
                operationalDate: '2024-02-01T00:00:00.000Z',
            },
        ],
    })
    escouadesAsChef?: Array<{
        id: number;
        name: string;
        description?: string;
        operationalDate?: Date;
    }>;

    @ApiPropertyOptional({
        description: 'Escouades dont l\'agent est adjoint',
        type: 'array',
        isArray: true,
        example: [
            {
                id: 3,
                name: 'Escouade Gamma',
                description: 'Escouade de contrôle aérien',
                operationalDate: '2024-01-20T00:00:00.000Z',
            },
        ],
    })
    escouadesAsAdjoint?: Array<{
        id: number;
        name: string;
        description?: string;
        operationalDate?: Date;
    }>;

    @ApiPropertyOptional({
        description: 'Escouades dont l\'agent est membre',
        type: 'array',
        isArray: true,
        example: [
            {
                escouadeId: 4,
                agentId: 1,
                escouade: {
                    id: 4,
                    name: 'Escouade Delta',
                    description: 'Escouade d\'intervention rapide',
                    operationalDate: '2024-03-01T00:00:00.000Z',
                },
            },
            {
                escouadeId: 5,
                agentId: 1,
                escouade: {
                    id: 5,
                    name: 'Escouade Epsilon',
                    description: 'Escouade de patrouille',
                    operationalDate: '2024-03-15T00:00:00.000Z',
                },
            },
        ],
    })
    escouadeAgents?: Array<{
        escouadeId: number;
        agentId: number;
        escouade: {
            id: number;
            name: string;
            description?: string;
            operationalDate?: Date;
        };
    }>;

    @ApiPropertyOptional({
        description: 'Ordres de mission assignés',
        type: 'array',
        isArray: true,
        example: [
            {
                id: 1,
                numeroOrdre: 'OM-2024-001',
                dateDebut: '2024-01-15T00:00:00.000Z',
                dateFin: '2024-01-20T00:00:00.000Z',
                lieu: 'Port de Dakar',
                objectif: 'Contrôle des marchandises',
                statut: 'En cours',
            },
            {
                id: 2,
                numeroOrdre: 'OM-2024-002',
                dateDebut: '2024-01-25T00:00:00.000Z',
                dateFin: '2024-01-30T00:00:00.000Z',
                lieu: 'Aéroport Blaise Diagne',
                objectif: 'Surveillance douanière',
                statut: 'Planifié',
            },
        ],
    })
    ordreMissions?: Array<{
        id: number;
        numeroOrdre: string;
        dateDebut: Date;
        dateFin: Date;
        lieu?: string;
        objectif?: string;
        statut?: string;
    }>;
}