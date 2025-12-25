import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ActivateAccountDto {
    @IsString({ message: 'Le token d\'activation doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'Le token d\'activation est requis' })
    activationToken: string;

    @IsString({ message: 'Le nom d\'utilisateur doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'Le nom d\'utilisateur est requis' })
    username: string;

    @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
    @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
    @IsNotEmpty({ message: 'Le mot de passe est requis' })
    password: string;

    @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'Le prénom est requis' })
    firstname: string;

    @IsString({ message: 'Le nom doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'Le nom est requis' })
    lastname: string;

    @IsString({ message: 'Le téléphone doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'Le téléphone est requis' })
    phone: string;
}
