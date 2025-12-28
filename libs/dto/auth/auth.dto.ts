import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEmail,
    IsString,
    MinLength,
    MaxLength,
    IsEnum,
    IsOptional,
    Matches,
} from 'class-validator';

export enum UserRole {
    ADMIN = 'ADMIN',
    AGENT = 'AGENT',
    SUPERVISEUR = 'SUPERVISEUR',
    TRANSITAIRE = 'TRANSITAIRE',
    DECLARANT = 'DECLARANT',
}

/**
 * DTO pour l'inscription d'une maison de transit
 */
export class RegisterTransitHouseDto {
    // Informations utilisateur
    @ApiProperty({
        description: 'Nom d\'utilisateur unique',
        example: 'mtd_admin',
        minLength: 3,
        maxLength: 100,
    })
    @IsString()
    @MinLength(3, { message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères' })
    @MaxLength(100)
    username: string;

    @ApiProperty({
        description: 'Adresse email unique',
        example: 'contact@mtdakar.sn',
    })
    @IsEmail({}, { message: 'Format d\'email invalide' })
    email: string;

    @ApiProperty({
        description: 'Mot de passe (minimum 8 caractères, doit contenir majuscule, minuscule, chiffre et caractère spécial)',
        example: 'Motdepasse123!',
        minLength: 8,
    })
    @IsString()
    @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        {
            message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
        },
    )
    password: string;

    @ApiProperty({
        description: 'Prénom',
        example: 'Mamadou',
    })
    @IsString()
    @MinLength(2)
    firstname: string;

    @ApiProperty({
        description: 'Nom de famille',
        example: 'Diallo',
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

    // Informations maison de transit
    @ApiProperty({
        description: 'Code unique de la maison de transit (3-10 caractères)',
        example: 'MTD',
        minLength: 3,
        maxLength: 10,
    })
    @IsString()
    @MinLength(3)
    @MaxLength(10)
    @Matches(/^[A-Z0-9]+$/, {
        message: 'Le code doit contenir uniquement des lettres majuscules et des chiffres',
    })
    maisonTransitCode: string;

    @ApiProperty({
        description: 'Nom de la maison de transit',
        example: 'Maison de Transit Dakar',
    })
    @IsString()
    @MinLength(3)
    maisonTransitName: string;

    @ApiPropertyOptional({
        description: 'Adresse de la maison de transit',
        example: 'Zone Industrielle, Dakar, Sénégal',
    })
    @IsOptional()
    @IsString()
    maisonTransitAddress?: string;

    @ApiPropertyOptional({
        description: 'Téléphone de la maison de transit',
        example: '+221338234567',
    })
    @IsOptional()
    @IsString()
    maisonTransitPhone?: string;

    @ApiPropertyOptional({
        description: 'Email de la maison de transit',
        example: 'info@mtdakar.sn',
    })
    @IsOptional()
    @IsEmail()
    maisonTransitEmail?: string;
}

/**
 * DTO pour la connexion
 */
export class LoginDto {
    @ApiProperty({
        description: 'Nom d\'utilisateur ou email',
        example: 'mtd_admin',
    })
    @IsString()
    usernameOrEmail: string;

    @ApiProperty({
        description: 'Mot de passe',
        example: 'Motdepasse123!',
    })
    @IsString()
    password: string;
}

/**
 * DTO pour la réponse de connexion
 */
export class LoginResponseDto {
    @ApiProperty({
        description: 'Token JWT d\'accès',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    accessToken: string;

    @ApiProperty({
        description: 'Type de token',
        example: 'Bearer',
    })
    tokenType: string;

    @ApiProperty({
        description: 'Durée de validité en secondes',
        example: 86400,
    })
    expiresIn: number;

    @ApiProperty({
        description: 'Informations de l\'utilisateur connecté',
    })
    user: {
        id: number;
        username: string;
        email: string;
        firstname: string;
        lastname: string;
        role: UserRole;
        isActive: boolean;
        emailVerified: boolean;
    };
}

/**
 * DTO pour la vérification d'email
 */
export class VerifyEmailDto {
    @ApiProperty({
        description: 'Token de vérification reçu par email',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    @IsString()
    token: string;
}

/**
 * DTO pour renvoyer l'email de vérification
 */
export class ResendVerificationEmailDto {
    @ApiProperty({
        description: 'Adresse email de l\'utilisateur',
        example: 'contact@mtdakar.sn',
    })
    @IsEmail()
    email: string;
}

/**
 * DTO pour la réponse d'inscription
 */
export class RegisterResponseDto {
    @ApiProperty({
        description: 'Message de succès',
        example: 'Inscription réussie. Un email de vérification a été envoyé à votre adresse.',
    })
    message: string;

    @ApiProperty({
        description: 'Informations de l\'utilisateur créé',
    })
    user: {
        id: number;
        username: string;
        email: string;
        firstname: string;
        lastname: string;
        role: UserRole;
    };

    @ApiProperty({
        description: 'Informations de la maison de transit créée',
    })
    maisonTransit: {
        id: number;
        code: string;
        name: string;
    };
}

/**
 * DTO pour la réponse de vérification email
 */
export class VerifyEmailResponseDto {
    @ApiProperty({
        description: 'Message de succès',
        example: 'Email vérifié avec succès. Votre compte est maintenant actif.',
    })
    message: string;

    @ApiProperty({
        description: 'Indique si le compte est maintenant actif',
        example: true,
    })
    isActive: boolean;
}

/**
 * DTO pour la demande de réinitialisation de mot de passe
 */
export class ForgotPasswordDto {
    @ApiProperty({
        description: 'Adresse email de l\'utilisateur',
        example: 'contact@mtdakar.sn',
    })
    @IsEmail()
    email: string;
}

/**
 * DTO pour la réinitialisation de mot de passe
 */
export class ResetPasswordDto {
    @ApiProperty({
        description: 'Token de réinitialisation reçu par email',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    @IsString()
    token: string;

    @ApiProperty({
        description: 'Nouveau mot de passe',
        example: 'NouveauMotdepasse123!',
        minLength: 8,
    })
    @IsString()
    @MinLength(8)
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        {
            message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
        },
    )
    newPassword: string;
}

/**
 * DTO pour activer un compte (agent ou autre) et définir le mot de passe
 */
export class ActivateAccountDto {
    @ApiProperty({
        description: 'Token d\'activation reçu par email',
        example: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
    })
    @IsString()
    @MinLength(32)
    token: string;

    @ApiProperty({
        description: 'Nouveau mot de passe (minimum 8 caractères, doit contenir majuscule, minuscule, chiffre et caractère spécial)',
        example: 'MonMotDePasse123!',
        minLength: 8,
    })
    @IsString()
    @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        {
            message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
        },
    )
    password: string;
}

/**
 * DTO pour inviter un staff à rejoindre une maison de transit
 */
export class InviteStaffDto {
    @ApiProperty({
        description: 'Email de la personne à inviter',
        example: 'staff@example.com',
    })
    @IsEmail({}, { message: 'Format d\'email invalide' })
    email: string;

    @ApiPropertyOptional({
        description: 'Rôle du staff dans la maison de transit',
        example: 'STAFF',
        enum: ['STAFF', 'MANAGER'],
        default: 'STAFF',
    })
    @IsOptional()
    @IsString()
    staffRole?: string;
}

/**
 * DTO pour accepter une invitation MT et créer son compte
 */
export class AcceptInvitationDto {
    @ApiProperty({
        description: 'Token d\'invitation reçu par email',
        example: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
    })
    @IsString()
    @MinLength(32)
    token: string;

    @ApiProperty({
        description: 'Nom d\'utilisateur souhaité',
        example: 'john.doe',
        minLength: 3,
        maxLength: 100,
    })
    @IsString()
    @MinLength(3, { message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères' })
    @MaxLength(100)
    username: string;

    @ApiProperty({
        description: 'Mot de passe (minimum 8 caractères, doit contenir majuscule, minuscule, chiffre et caractère spécial)',
        example: 'MonMotDePasse123!',
        minLength: 8,
    })
    @IsString()
    @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        {
            message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
        },
    )
    password: string;

    @ApiProperty({
        description: 'Prénom',
        example: 'John',
        minLength: 2,
    })
    @IsString()
    @MinLength(2, { message: 'Le prénom doit contenir au moins 2 caractères' })
    firstname: string;

    @ApiProperty({
        description: 'Nom de famille',
        example: 'Doe',
        minLength: 2,
    })
    @IsString()
    @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
    lastname: string;

    @ApiPropertyOptional({
        description: 'Numéro de téléphone',
        example: '+221771234567',
    })
    @IsOptional()
    @IsString()
    phone?: string;
}

/**
 * Réponse après vérification d'un token d'invitation
 */
export class InvitationInfoDto {
    @ApiProperty({
        description: 'Email associé à l\'invitation',
        example: 'staff@example.com',
    })
    email: string;

    @ApiProperty({
        description: 'Nom de la maison de transit',
        example: 'Maison de Transit Dakar',
    })
    maisonTransitName: string;

    @ApiProperty({
        description: 'Rôle dans la maison de transit',
        example: 'STAFF',
    })
    staffRole: string;

    @ApiProperty({
        description: 'Nom de la personne qui a envoyé l\'invitation',
        example: 'Admin User',
    })
    invitedBy: string;

    @ApiProperty({
        description: 'Date d\'expiration du token',
        example: '2024-12-24T12:00:00.000Z',
    })
    expiresAt: Date;
}
