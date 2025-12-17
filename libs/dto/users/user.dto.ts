import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEmail,
    IsString,
    MinLength,
    MaxLength,
    IsEnum,
    IsOptional,
    Matches,
    IsBoolean,
    IsInt,
    IsArray,
} from 'class-validator';
import { UserRole } from '../auth/auth.dto';

/**
 * DTO pour créer un utilisateur système (ADMIN ou SUPERVISEUR)
 */
export class CreateSystemUserDto {
    @ApiProperty({
        description: 'Nom d\'utilisateur unique',
        example: 'admin_john',
        minLength: 3,
        maxLength: 100,
    })
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    username: string;

    @ApiProperty({
        description: 'Adresse email unique',
        example: 'admin@apurement.sn',
    })
    @IsEmail({}, { message: 'Format d\'email invalide' })
    email: string;

    @ApiProperty({
        description: 'Mot de passe (minimum 8 caractères, majuscule, minuscule, chiffre, caractère spécial)',
        example: 'AdminPass123!',
        minLength: 8,
    })
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
    })
    password: string;

    @ApiProperty({
        description: 'Prénom',
        example: 'John',
    })
    @IsString()
    @MinLength(2)
    firstname: string;

    @ApiProperty({
        description: 'Nom de famille',
        example: 'Doe',
    })
    @IsString()
    @MinLength(2)
    lastname: string;

    @ApiPropertyOptional({
        description: 'Numéro de téléphone',
        example: '+221773456789',
    })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({
        description: 'Rôle de l\'utilisateur',
        enum: UserRole,
        example: UserRole.ADMIN,
    })
    @IsEnum(UserRole)
    role: UserRole.ADMIN | UserRole.SUPERVISEUR;
}

/**
 * DTO pour créer un staff de maison de transit
 */
export class CreateTransitStaffDto {
    @ApiProperty({
        description: 'Nom d\'utilisateur unique',
        example: 'staff_marie',
        minLength: 3,
        maxLength: 100,
    })
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    username: string;

    @ApiProperty({
        description: 'Adresse email unique',
        example: 'marie@mtdakar.sn',
    })
    @IsEmail({}, { message: 'Format d\'email invalide' })
    email: string;

    @ApiProperty({
        description: 'Mot de passe',
        example: 'StaffPass123!',
        minLength: 8,
    })
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
    })
    password: string;

    @ApiProperty({
        description: 'Prénom',
        example: 'Marie',
    })
    @IsString()
    @MinLength(2)
    firstname: string;

    @ApiProperty({
        description: 'Nom de famille',
        example: 'Ndiaye',
    })
    @IsString()
    @MinLength(2)
    lastname: string;

    @ApiPropertyOptional({
        description: 'Numéro de téléphone',
        example: '+221776543210',
    })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({
        description: 'ID de la maison de transit',
        example: 1,
    })
    @IsInt()
    maisonTransitId: number;

    @ApiPropertyOptional({
        description: 'Rôle dans la maison de transit',
        example: 'STAFF',
        enum: ['RESPONSABLE', 'STAFF', 'MANAGER'],
    })
    @IsOptional()
    @IsString()
    maisonTransitRole?: string;
}

/**
 * DTO pour créer un agent avec compte utilisateur
 */
export class CreateAgentWithUserDto {
    // Informations utilisateur
    @ApiProperty({
        description: 'Nom d\'utilisateur unique',
        example: 'agent_ibrahima',
        minLength: 3,
        maxLength: 100,
    })
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    username: string;

    @ApiProperty({
        description: 'Adresse email unique',
        example: 'ibrahima.agent@douanes.sn',
    })
    @IsEmail({}, { message: 'Format d\'email invalide' })
    email: string;

    @ApiProperty({
        description: 'Mot de passe',
        example: 'AgentPass123!',
        minLength: 8,
    })
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
    })
    password: string;

    @ApiProperty({
        description: 'Prénom',
        example: 'Ibrahima',
    })
    @IsString()
    @MinLength(2)
    firstname: string;

    @ApiProperty({
        description: 'Nom de famille',
        example: 'Sarr',
    })
    @IsString()
    @MinLength(2)
    lastname: string;

    @ApiProperty({
        description: 'Numéro de téléphone',
        example: '+221779876543',
    })
    @IsString()
    phone: string;

    // Informations agent
    @ApiPropertyOptional({
        description: 'Matricule de l\'agent',
        example: 'AG-2024-001',
    })
    @IsOptional()
    @IsString()
    matricule?: string;

    @ApiPropertyOptional({
        description: 'Grade de l\'agent',
        example: 'Inspecteur',
    })
    @IsOptional()
    @IsString()
    grade?: string;

    @ApiPropertyOptional({
        description: 'ID du bureau d\'affectation',
        example: 1,
    })
    @IsOptional()
    @IsInt()
    officeId?: number;
}

/**
 * DTO pour mettre à jour un utilisateur
 */
export class UpdateUserDto {
    @ApiPropertyOptional({
        description: 'Nom d\'utilisateur',
        minLength: 3,
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    username?: string;

    @ApiPropertyOptional({
        description: 'Adresse email',
    })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({
        description: 'Prénom',
    })
    @IsOptional()
    @IsString()
    @MinLength(2)
    firstname?: string;

    @ApiPropertyOptional({
        description: 'Nom de famille',
    })
    @IsOptional()
    @IsString()
    @MinLength(2)
    lastname?: string;

    @ApiPropertyOptional({
        description: 'Numéro de téléphone',
    })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional({
        description: 'Statut actif',
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

/**
 * DTO pour la réponse utilisateur
 */
export class UserResponseDto {
    @ApiProperty({ description: 'ID de l\'utilisateur', example: 1 })
    id: number;

    @ApiProperty({ description: 'Nom d\'utilisateur', example: 'john_doe' })
    username: string;

    @ApiProperty({ description: 'Email', example: 'john@example.com' })
    email: string;

    @ApiProperty({ description: 'Prénom', example: 'John' })
    firstname: string;

    @ApiProperty({ description: 'Nom de famille', example: 'Doe' })
    lastname: string;

    @ApiProperty({ description: 'Téléphone', example: '+221773456789', required: false })
    phone?: string;

    @ApiProperty({ description: 'Rôle', enum: UserRole, example: UserRole.ADMIN })
    role: UserRole;

    @ApiProperty({ description: 'Compte actif', example: true })
    isActive: boolean;

    @ApiProperty({ description: 'Email vérifié', example: true })
    emailVerified: boolean;

    @ApiProperty({ description: 'Date de vérification email', required: false })
    emailVerifiedAt?: Date;

    @ApiProperty({ description: 'Dernière connexion', required: false })
    lastLogin?: Date;

    @ApiProperty({ description: 'Date de création' })
    createdAt: Date;

    @ApiProperty({ description: 'Date de mise à jour' })
    updatedAt: Date;
}

/**
 * DTO pour le filtre de listing des utilisateurs
 */
export class UserFilterDto {
    @ApiPropertyOptional({
        description: 'Filtrer par rôle',
        enum: UserRole,
    })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @ApiPropertyOptional({
        description: 'Filtrer par statut actif',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({
        description: 'Filtrer par email vérifié',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    emailVerified?: boolean;

    @ApiPropertyOptional({
        description: 'ID de la maison de transit',
        example: 1,
    })
    @IsOptional()
    @IsInt()
    maisonTransitId?: number;

    @ApiPropertyOptional({
        description: 'Recherche par nom, prénom, username ou email',
        example: 'john',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        description: 'Numéro de page',
        example: 1,
        default: 1,
    })
    @IsOptional()
    @IsInt()
    page?: number;

    @ApiPropertyOptional({
        description: 'Nombre d\'éléments par page',
        example: 10,
        default: 10,
    })
    @IsOptional()
    @IsInt()
    limit?: number;
}

/**
 * DTO pour la réponse paginée
 */
export class PaginatedUsersResponseDto {
    @ApiProperty({ description: 'Liste des utilisateurs', type: [UserResponseDto] })
    data: UserResponseDto[];

    @ApiProperty({ description: 'Nombre total d\'utilisateurs', example: 100 })
    total: number;

    @ApiProperty({ description: 'Page actuelle', example: 1 })
    page: number;

    @ApiProperty({ description: 'Nombre d\'éléments par page', example: 10 })
    limit: number;

    @ApiProperty({ description: 'Nombre total de pages', example: 10 })
    totalPages: number;
}
