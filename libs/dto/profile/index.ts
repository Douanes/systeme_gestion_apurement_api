import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsEmail,
    IsNotEmpty,
    MinLength,
    MaxLength,
    Matches,
    IsOptional,
    IsInt,
} from 'class-validator';

/**
 * DTO pour les informations de la maison de transit (pour les transitaires)
 */
export class MaisonTransitInfoDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'MT-12345678' })
    code: string;

    @ApiProperty({ example: 'Transport Express SARL' })
    name: string;

    @ApiProperty({ example: 'Rue 10, Dakar, Sénégal', required: false })
    address?: string;

    @ApiProperty({ example: '+221771234567', required: false })
    phone?: string;

    @ApiProperty({ example: 'contact@transportexpress.sn', required: false })
    email?: string;

    @ApiProperty({ example: 'RESPONSABLE' })
    userRole: string;

    @ApiProperty({ example: true })
    isActive: boolean;
}

/**
 * DTO pour récupérer les informations du profil utilisateur
 */
export class UserProfileDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'johndoe' })
    username: string;

    @ApiProperty({ example: 'john.doe@example.com' })
    email: string;

    @ApiProperty({ example: 'John' })
    firstname: string;

    @ApiProperty({ example: 'Doe' })
    lastname: string;

    @ApiProperty({ example: '+221771234567', required: false })
    phone?: string;

    @ApiProperty({ example: 'TRANSITAIRE', enum: ['ADMIN', 'AGENT', 'SUPERVISEUR', 'TRANSITAIRE'] })
    role: string;

    @ApiProperty({ example: true })
    isActive: boolean;

    @ApiProperty({ example: true })
    emailVerified: boolean;

    @ApiProperty({ example: '2024-12-22T10:30:00.000Z' })
    createdAt: Date;

    @ApiProperty({ example: '2024-12-22T10:30:00.000Z', required: false })
    lastLogin?: Date;

    @ApiProperty({ type: MaisonTransitInfoDto, required: false, description: 'Informations de la maison de transit (uniquement pour les transitaires)' })
    maisonTransit?: MaisonTransitInfoDto;

    @ApiProperty({ required: false, description: 'Informations de l\'agent (uniquement pour les agents)' })
    agent?: AgentInfoDto;
}

export class AgentInfoDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'AG-001', required: false })
    matricule?: string;

    @ApiProperty({ example: 'Capitaine', required: false })
    grade?: string;

    @ApiProperty({ example: 'Jean' })
    firstname: string;

    @ApiProperty({ example: 'Dupont' })
    lastname: string;

    @ApiProperty({ example: '+221771234567', required: false })
    phone?: string;

    @ApiProperty({ example: 'jean.dupont@douanes.sn', required: false })
    email?: string;

    @ApiProperty({ example: true })
    isActive: boolean;

    @ApiProperty({
        required: false,
        description: 'Escouade de l\'agent (chef, adjoint ou membre)',
    })
    escouade?: {
        id: number;
        name: string;
        role: 'CHEF' | 'ADJOINT' | 'MEMBRE';
    };
}

/**
 * DTO pour mettre à jour le profil
 */
export class UpdateProfileDto {
    @ApiProperty({ example: 'John', description: 'Prénom de l\'utilisateur' })
    @IsString()
    @IsNotEmpty({ message: 'Le prénom est requis' })
    @MaxLength(100, { message: 'Le prénom ne peut pas dépasser 100 caractères' })
    firstname: string;

    @ApiProperty({ example: 'Doe', description: 'Nom de l\'utilisateur' })
    @IsString()
    @IsNotEmpty({ message: 'Le nom est requis' })
    @MaxLength(100, { message: 'Le nom ne peut pas dépasser 100 caractères' })
    lastname: string;

    @ApiProperty({ example: '+221771234567', description: 'Numéro de téléphone', required: false })
    @IsOptional()
    @IsString()
    @Matches(/^\+?[1-9]\d{1,14}$/, {
        message: 'Le numéro de téléphone doit être au format international (ex: +221771234567)',
    })
    phone?: string;
}

/**
 * DTO pour changer le mot de passe
 */
export class ChangePasswordDto {
    @ApiProperty({ example: 'OldPassword123!', description: 'Mot de passe actuel' })
    @IsString()
    @IsNotEmpty({ message: 'Le mot de passe actuel est requis' })
    currentPassword: string;

    @ApiProperty({ example: 'NewPassword123!', description: 'Nouveau mot de passe' })
    @IsString()
    @IsNotEmpty({ message: 'Le nouveau mot de passe est requis' })
    @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
    })
    newPassword: string;

    @ApiProperty({ example: 'NewPassword123!', description: 'Confirmation du nouveau mot de passe' })
    @IsString()
    @IsNotEmpty({ message: 'La confirmation du mot de passe est requise' })
    confirmPassword: string;
}

/**
 * DTO pour demander la réinitialisation du mot de passe
 */
export class ForgotPasswordDto {
    @ApiProperty({ example: 'user@example.com', description: 'Email de l\'utilisateur' })
    @IsEmail({}, { message: 'Email invalide' })
    @IsNotEmpty({ message: 'L\'email est requis' })
    email: string;
}

/**
 * DTO pour réinitialiser le mot de passe avec un token
 */
export class ResetPasswordDto {
    @ApiProperty({ example: 'abc123token456def', description: 'Token de réinitialisation' })
    @IsString()
    @IsNotEmpty({ message: 'Le token est requis' })
    token: string;

    @ApiProperty({ example: 'NewPassword123!', description: 'Nouveau mot de passe' })
    @IsString()
    @IsNotEmpty({ message: 'Le mot de passe est requis' })
    @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
    })
    newPassword: string;

    @ApiProperty({ example: 'NewPassword123!', description: 'Confirmation du mot de passe' })
    @IsString()
    @IsNotEmpty({ message: 'La confirmation du mot de passe est requise' })
    confirmPassword: string;
}

/**
 * DTO pour qu'un admin réinitialise le mot de passe d'un utilisateur
 */
export class AdminResetPasswordDto {
    @ApiProperty({ example: 1, description: 'ID de l\'utilisateur' })
    @IsInt({ message: 'L\'ID utilisateur doit être un nombre entier' })
    @IsNotEmpty({ message: 'L\'ID utilisateur est requis' })
    userId: number;

    @ApiProperty({
        example: 'TempPassword123!',
        description: 'Nouveau mot de passe temporaire',
        required: false,
    })
    @IsOptional()
    @IsString()
    @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
    })
    newPassword?: string;
}

/**
 * Réponse de succès pour les opérations sur le profil
 */
export class ProfileSuccessDto {
    @ApiProperty({ example: 'Profil mis à jour avec succès' })
    message: string;

    @ApiProperty({ type: UserProfileDto, required: false })
    user?: UserProfileDto;
}
