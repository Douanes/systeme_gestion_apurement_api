import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InviteTransitaireDto {
    @ApiProperty({
        description: 'Email du transitaire à inviter',
        example: 'transitaire@example.com',
    })
    @IsEmail({}, { message: 'Email invalide' })
    @IsNotEmpty({ message: 'L\'email est requis' })
    email: string;

    @ApiProperty({
        description: 'Nom de l\'entreprise (maison de transit)',
        example: 'TRANSIT PLUS SARL',
    })
    @IsString({ message: 'Le nom de l\'entreprise doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'Le nom de l\'entreprise est requis' })
    companyName: string;
}
