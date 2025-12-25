import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RequestStatus } from './enums';

export class ReviewRequestDto {
    @IsEnum(RequestStatus, { message: 'Statut invalide' })
    @IsNotEmpty({ message: 'Le statut est requis' })
    status: RequestStatus.APPROUVE | RequestStatus.REJETE;

    @IsOptional()
    @IsString({ message: 'La raison du rejet doit être une chaîne de caractères' })
    rejectionReason?: string;
}
