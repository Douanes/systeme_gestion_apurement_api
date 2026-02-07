import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ActivateAccountDto {
    @ApiProperty({
        description: 'Token d\'activation reçu par email après validation de la demande',
        example: 'activation-abc123def456',
    })
    @IsString({ message: 'Le token d\'activation doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'Le token d\'activation est requis' })
    activationToken: string;

    @ApiProperty({
        description: 'Nom d\'utilisateur unique pour la connexion',
        example: 'transitaire_user',
    })
    @IsString({ message: 'Le nom d\'utilisateur doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'Le nom d\'utilisateur est requis' })
    username: string;

    @ApiProperty({
        description: 'Mot de passe (minimum 8 caractères)',
        example: 'SecureP@ssw0rd',
        minLength: 8,
    })
    @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
    @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
    @IsNotEmpty({ message: 'Le mot de passe est requis' })
    password: string;

    @ApiProperty({
        description: 'Prénom du responsable',
        example: 'Moussa',
    })
    @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'Le prénom est requis' })
    firstname: string;

    @ApiProperty({
        description: 'Nom de famille du responsable',
        example: 'Diallo',
    })
    @IsString({ message: 'Le nom doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'Le nom est requis' })
    lastname: string;

    @ApiProperty({
        description: 'Numéro de téléphone du responsable',
        example: '+221 77 123 45 67',
    })
    @IsString({ message: 'Le téléphone doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'Le téléphone est requis' })
    phone: string;

    @ApiPropertyOptional({
        description: 'Code unique de la maison de transit (3-10 caractères, majuscules et chiffres). Si non fourni, un code sera généré automatiquement.',
        example: 'MTD',
        maxLength: 10,
    })
    @IsString({ message: 'Le code doit être une chaîne de caractères' })
    @MaxLength(10, { message: 'Le code doit contenir au maximum 10 caractères' })
    @Matches(/^[A-Z0-9]+$/, {
        message: 'Le code doit contenir uniquement des lettres majuscules et des chiffres',
    })
    code: string;
}
