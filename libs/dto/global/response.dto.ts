import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
    @ApiProperty({
        description: 'Page actuelle',
        example: 1,
    })
    page: number;

    @ApiProperty({
        description: 'Nombre d\'éléments par page',
        example: 10,
    })
    limit: number;

    @ApiProperty({
        description: 'Nombre total d\'éléments',
        example: 100,
    })
    total: number;

    @ApiProperty({
        description: 'Nombre total de pages',
        example: 10,
    })
    totalPages: number;

    @ApiProperty({
        description: 'Indique s\'il y a une page suivante',
        example: true,
    })
    hasNext: boolean;

    @ApiProperty({
        description: 'Indique s\'il y a une page précédente',
        example: false,
    })
    hasPrevious: boolean;
}

export class PaginatedResponseDto<T> {
    @ApiProperty({
        description: 'Liste des éléments',
        isArray: true,
    })
    data: T[];

    @ApiProperty({
        description: 'Métadonnées de pagination',
        type: PaginationMetaDto,
    })
    meta: PaginationMetaDto;
}

export class SuccessResponseDto<T> {
    @ApiProperty({
        description: 'Indique si la requête a réussi',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: 'Message de succès',
        example: 'Opération effectuée avec succès',
    })
    message: string;

    @ApiProperty({
        description: 'Données de la réponse',
    })
    data?: T;
}

export class ErrorResponseDto {
    @ApiProperty({
        description: 'Indique si la requête a échoué',
        example: false,
    })
    success: boolean;

    @ApiProperty({
        description: 'Message d\'erreur',
        example: 'Une erreur s\'est produite',
    })
    message: string;

    @ApiProperty({
        description: 'Code d\'erreur HTTP',
        example: 400,
    })
    statusCode: number;

    @ApiProperty({
        description: 'Timestamp de l\'erreur',
        example: '2024-01-15T10:30:00.000Z',
    })
    timestamp: string;

    @ApiProperty({
        description: 'Chemin de la requête',
        example: '/api/agents',
    })
    path: string;

    @ApiProperty({
        description: 'Détails supplémentaires de l\'erreur',
        required: false,
        isArray: true,
    })
    errors?: any[];
}