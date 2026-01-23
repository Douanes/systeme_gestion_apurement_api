import {
    Controller,
    Get,
    Param,
    Query,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { DeclarationService } from './declaration.service';
import {
    DeclarationPaginationQueryDto,
    DeclarationWithOrdersResponseDto,
    StatutLivraisonFilter,
} from 'libs/dto/declaration/declaration.dto';
import { PaginatedResponseDto } from 'libs/dto/global/response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Déclarations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('declarations')
export class DeclarationController {
    constructor(private readonly declarationService: DeclarationService) { }

    @Get()
    @ApiOperation({
        summary: 'Liste des déclarations avec leurs ordres de mission',
        description: `
Récupère la liste paginée des déclarations avec leurs parcelles (ordres de mission associés).

**Filtres disponibles:**
- **statutLivraison**: Filtrer par statut de livraison
  - \`TOTALEMENT_LIVRE\`: Toutes les quantités ont été livrées (nbreColisRestant = 0)
  - \`PARTIELLEMENT_LIVRE\`: Au moins une parcelle mais encore des quantités à livrer
  - \`NON_LIVRE\`: Aucune parcelle créée

**Informations retournées pour chaque déclaration:**
- Totaux déclarés et restants
- Pourcentage de livraison calculé
- Liste complète des parcelles avec détails de l'ordre de mission
        `,
    })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        example: 1,
        description: 'Numéro de page',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        example: 10,
        description: 'Nombre d\'éléments par page',
    })
    @ApiQuery({
        name: 'search',
        required: false,
        type: String,
        description: 'Recherche par numéro de déclaration',
    })
    @ApiQuery({
        name: 'statutLivraison',
        required: false,
        enum: StatutLivraisonFilter,
        description: 'Filtrer par statut de livraison',
    })
    @ApiQuery({
        name: 'maisonTransitId',
        required: false,
        type: Number,
        description: 'Filtrer par maison de transit',
    })
    @ApiQuery({
        name: 'depositaireId',
        required: false,
        type: Number,
        description: 'Filtrer par dépositaire',
    })
    @ApiQuery({
        name: 'bureauSortieId',
        required: false,
        type: Number,
        description: 'Filtrer par bureau de sortie',
    })
    @ApiQuery({
        name: 'regimeId',
        required: false,
        type: Number,
        description: 'Filtrer par régime douanier',
    })
    @ApiQuery({
        name: 'dateDeclarationMin',
        required: false,
        type: String,
        description: 'Date de déclaration minimum (YYYY-MM-DD)',
    })
    @ApiQuery({
        name: 'dateDeclarationMax',
        required: false,
        type: String,
        description: 'Date de déclaration maximum (YYYY-MM-DD)',
    })
    @ApiQuery({
        name: 'sortBy',
        required: false,
        type: String,
        example: 'createdAt',
        description: 'Champ de tri',
    })
    @ApiQuery({
        name: 'sortOrder',
        required: false,
        enum: ['asc', 'desc'],
        example: 'desc',
        description: 'Ordre de tri',
    })
    @ApiResponse({
        status: 200,
        description: 'Liste paginée des déclarations avec leurs ordres de mission',
        schema: {
            example: {
                data: [
                    {
                        id: 1,
                        numeroDeclaration: 'DECL-2024-001',
                        dateDeclaration: '2024-01-15',
                        nbreColisTotal: 100,
                        poidsTotal: 500.5,
                        nbreColisRestant: 50,
                        poidsRestant: 250.25,
                        nbreColisLivres: 50,
                        poidsLivre: 250.25,
                        pourcentageLivraison: 50,
                        statutLivraison: 'PARTIELLEMENT_LIVRE',
                        statutApurement: 'NON_APURE',
                        regime: { id: 1, name: 'Transit' },
                        maisonTransit: { id: 1, name: 'Maison Transit Dakar', code: 'MTD' },
                        parcelles: [
                            {
                                id: 1,
                                nbreColisParcelle: 50,
                                poidsParcelle: 250.25,
                                createdAt: '2024-01-15T10:30:00.000Z',
                                ordreMission: {
                                    id: 1,
                                    number: 'MTD-2024-000001',
                                    destination: 'Port de Dakar',
                                    statut: 'EN_COURS',
                                    statutApurement: 'NON_APURE',
                                },
                            },
                        ],
                        totalParcelles: 1,
                    },
                ],
                meta: {
                    page: 1,
                    limit: 10,
                    total: 1,
                    totalPages: 1,
                    hasNext: false,
                    hasPrevious: false,
                },
            },
        },
    })
    async findAll(
        @Query() query: DeclarationPaginationQueryDto,
    ): Promise<PaginatedResponseDto<DeclarationWithOrdersResponseDto>> {
        return this.declarationService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Détails d\'une déclaration',
        description: 'Récupère une déclaration par son ID avec tous ses ordres de mission (parcelles)',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        description: 'ID de la déclaration',
    })
    @ApiResponse({
        status: 200,
        description: 'Détails de la déclaration',
        type: DeclarationWithOrdersResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Déclaration non trouvée',
    })
    async findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<DeclarationWithOrdersResponseDto> {
        return this.declarationService.findOne(id);
    }
}
