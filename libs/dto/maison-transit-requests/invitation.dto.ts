import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class InviteTransitaireDto {
    @IsEmail({}, { message: 'Email invalide' })
    @IsNotEmpty({ message: 'L\'email est requis' })
    email: string;

    @IsString({ message: 'Le nom de l\'entreprise doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'Le nom de l\'entreprise est requis' })
    companyName: string;
}
