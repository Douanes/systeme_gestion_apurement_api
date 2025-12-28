import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
}
