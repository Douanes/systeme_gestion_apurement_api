import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
    DeclarationPaginationQueryDto,
    DeclarationWithOrdersResponseDto,
    StatutLivraisonFilter,
} from 'libs/dto/declaration/declaration.dto';
import { PaginatedResponseDto } from 'libs/dto/global/response.dto';

@Injectable()
export class DeclarationService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Récupérer toutes les déclarations avec leurs ordres de mission (parcelles)
     */
    async findAll(
        query: DeclarationPaginationQueryDto,
    ): Promise<PaginatedResponseDto<DeclarationWithOrdersResponseDto>> {
        const {
            page = 1,
            limit = 10,
            search,
            statutLivraison,
            maisonTransitId,
            depositaireId,
            bureauSortieId,
            regimeId,
            dateDeclarationMin,
            dateDeclarationMax,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = query;

        const skip = (page - 1) * limit;

        // Construction du filtre de base
        const where: Prisma.DeclarationWhereInput = {
            deletedAt: null,
        };

        // Filtre par recherche
        if (search) {
            where.numeroDeclaration = { contains: search };
        }

        // Filtres par relations
        if (maisonTransitId) {
            where.maisonTransitId = maisonTransitId;
        }

        if (depositaireId) {
            where.depositaireId = depositaireId;
        }

        if (bureauSortieId) {
            where.bureauSortieId = bureauSortieId;
        }

        if (regimeId) {
            where.regimeId = regimeId;
        }

        // Filtre par date de déclaration
        if (dateDeclarationMin || dateDeclarationMax) {
            where.dateDeclaration = {};
            if (dateDeclarationMin) {
                where.dateDeclaration.gte = new Date(dateDeclarationMin);
            }
            if (dateDeclarationMax) {
                where.dateDeclaration.lte = new Date(dateDeclarationMax);
            }
        }

        // Filtre par statut de livraison
        if (statutLivraison) {
            switch (statutLivraison) {
                case StatutLivraisonFilter.TOTALEMENT_LIVRE:
                    // nbreColisRestant = 0 (tout a été livré)
                    where.nbreColisRestant = 0;
                    break;
                case StatutLivraisonFilter.PARTIELLEMENT_LIVRE:
                    // nbreColisRestant > 0 et a au moins une parcelle
                    where.AND = [
                        { nbreColisRestant: { gt: 0 } },
                        {
                            ordreMissions: {
                                some: { deletedAt: null }
                            }
                        }
                    ];
                    break;
                case StatutLivraisonFilter.NON_LIVRE:
                    // Aucune parcelle ou nbreColisRestant = nbreColisTotal
                    where.ordreMissions = {
                        none: { deletedAt: null }
                    };
                    break;
            }
        }

        // Récupération des données avec les relations
        const [declarations, total] = await Promise.all([
            this.prisma.declaration.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    regime: {
                        select: { id: true, name: true }
                    },
                    maisonTransit: {
                        select: { id: true, name: true, code: true }
                    },
                    depositaire: {
                        select: { id: true, name: true }
                    },
                    bureauSortie: {
                        select: { id: true, name: true, code: true }
                    },
                    ordreMissions: {
                        where: { deletedAt: null },
                        include: {
                            ordreMission: {
                                select: {
                                    id: true,
                                    number: true,
                                    destination: true,
                                    itineraire: true,
                                    statut: true,
                                    statutApurement: true,
                                    dateOrdre: true,
                                }
                            }
                        },
                        orderBy: { createdAt: 'desc' }
                    }
                }
            }),
            this.prisma.declaration.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        // Transformer les déclarations en DTOs
        const data = declarations.map(decl => this.toResponseDto(decl));

        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrevious: page > 1,
            },
        };
    }

    /**
     * Récupérer une déclaration par ID avec tous ses ordres de mission
     */
    async findOne(id: number): Promise<DeclarationWithOrdersResponseDto> {
        const declaration = await this.prisma.declaration.findFirst({
            where: { id, deletedAt: null },
            include: {
                regime: {
                    select: { id: true, name: true }
                },
                maisonTransit: {
                    select: { id: true, name: true, code: true }
                },
                depositaire: {
                    select: { id: true, name: true }
                },
                bureauSortie: {
                    select: { id: true, name: true, code: true }
                },
                ordreMissions: {
                    where: { deletedAt: null },
                    include: {
                        ordreMission: {
                            select: {
                                id: true,
                                number: true,
                                destination: true,
                                itineraire: true,
                                statut: true,
                                statutApurement: true,
                                dateOrdre: true,
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!declaration) {
            throw new NotFoundException(`Déclaration avec l'ID ${id} non trouvée`);
        }

        return this.toResponseDto(declaration);
    }

    /**
     * Transformer une déclaration Prisma en DTO de réponse
     */
    private toResponseDto(declaration: any): DeclarationWithOrdersResponseDto {
        const nbreColisTotal = declaration.nbreColisTotal;
        const nbreColisRestant = declaration.nbreColisRestant;
        const nbreColisLivres = nbreColisTotal - nbreColisRestant;

        const poidsTotal = declaration.poidsTotal ? Number(declaration.poidsTotal) : 0;
        const poidsRestant = declaration.poidsRestant ? Number(declaration.poidsRestant) : 0;
        const poidsLivre = poidsTotal - poidsRestant;

        // Calcul du pourcentage de livraison
        const pourcentageLivraison = nbreColisTotal > 0
            ? Math.round((nbreColisLivres / nbreColisTotal) * 100)
            : 0;

        // Détermination du statut de livraison
        let statutLivraison: string;
        if (nbreColisRestant === 0 && nbreColisTotal > 0) {
            statutLivraison = 'TOTALEMENT_LIVRE';
        } else if (declaration.ordreMissions?.length > 0 && nbreColisRestant > 0) {
            statutLivraison = 'PARTIELLEMENT_LIVRE';
        } else {
            statutLivraison = 'NON_LIVRE';
        }

        // Transformation des parcelles
        const parcelles = declaration.ordreMissions?.map((omd: any) => ({
            id: omd.id,
            nbreColisParcelle: omd.nbreColisParcelle,
            poidsParcelle: omd.poidsParcelle ? Number(omd.poidsParcelle) : 0,
            createdAt: omd.createdAt,
            ordreMission: {
                id: omd.ordreMission.id,
                number: omd.ordreMission.number,
                destination: omd.ordreMission.destination,
                itineraire: omd.ordreMission.itineraire,
                statut: omd.ordreMission.statut,
                statutApurement: omd.ordreMission.statutApurement,
                dateOrdre: omd.ordreMission.dateOrdre,
            }
        })) || [];

        return {
            id: declaration.id,
            numeroDeclaration: declaration.numeroDeclaration,
            dateDeclaration: declaration.dateDeclaration,
            nbreColisTotal,
            poidsTotal,
            nbreColisRestant,
            poidsRestant,
            nbreColisLivres,
            poidsLivre,
            pourcentageLivraison,
            statutLivraison,
            statutApurement: declaration.statutApurement,
            dateApurement: declaration.dateApurement,
            regime: declaration.regime,
            maisonTransit: declaration.maisonTransit,
            depositaire: declaration.depositaire,
            bureauSortie: declaration.bureauSortie,
            parcelles,
            totalParcelles: parcelles.length,
            createdAt: declaration.createdAt,
            updatedAt: declaration.updatedAt,
        };
    }
}
