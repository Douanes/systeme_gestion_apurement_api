import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RequestStatus } from './enums';

export class ReviewRequestDto {
    @ApiProperty({
        description: 'Décision de validation (APPROUVE ou REJETE)',
        enum: [RequestStatus.APPROUVE, RequestStatus.REJETE],
        example: RequestStatus.APPROUVE,
    })
    @IsEnum(RequestStatus, { message: 'Statut invalide' })
    @IsNotEmpty({ message: 'Le statut est requis' })
    status: RequestStatus.APPROUVE | RequestStatus.REJETE;

    @ApiPropertyOptional({
        description: 'Raison du rejet (obligatoire si status = REJETE)',
        example: 'Documents incomplets ou invalides',
    })
    @IsOptional()
    @IsString({ message: 'La raison du rejet doit être une chaîne de caractères' })
    rejectionReason?: string;
}
