import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MaisonTransit } from '@prisma/client';
import {
    CreateMaisonTransitDto,
    UpdateMaisonTransitDto,
    MaisonTransitResponseDto,
    MaisonTransitWithRelationsDto,
} from 'libs/dto/maison-transit/transit.dto';
import { MaisonTransitPaginationQueryDto } from 'libs/dto/maison-transit/pagination.dto';
import { PaginatedResponseDto } from 'libs/dto/global/response.dto';

@Injectable()
export class MaisonTransitService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Transform Prisma MaisonTransit to MaisonTransitResponseDto
     */
    private toResponseDto(maisonTransit: MaisonTransit): MaisonTransitResponseDto {
        return {
            id: maisonTransit.id,
            code: maisonTransit.code,
            name: maisonTransit.name,
            address: maisonTransit.address,
            phone: maisonTransit.phone,
            email: maisonTransit.email,
            responsableId: maisonTransit.responsableId,
            isActive: maisonTransit.isActive,
            createdAt: maisonTransit.createdAt,
            updatedAt: maisonTransit.updatedAt,
        };
    }

    /**
     * Créer une nouvelle maison de transit
     */
    async create(
        createMaisonTransitDto: CreateMaisonTransitDto,
    ): Promise<MaisonTransitResponseDto> {
        // Vérifier si une maison de transit avec le même code existe déjà
        const existingMaison = await this.prisma.maisonTransit.findFirst({
            where: {
                code: createMaisonTransitDto.code,
                deletedAt: null,
            },
        });

        if (existingMaison) {
            throw new ConflictException(
                `Une maison de transit avec le code "${createMaisonTransitDto.code}" existe déjà`,
            );
        }

        const maisonTransit = await this.prisma.maisonTransit.create({
            data: {
                code: createMaisonTransitDto.code,
                name: createMaisonTransitDto.name,
                address: createMaisonTransitDto.address,
                phone: createMaisonTransitDto.phone,
                email: createMaisonTransitDto.email,
                responsableId: createMaisonTransitDto.responsableId,
                isActive: createMaisonTransitDto.isActive ?? true,
            },
        });

        return this.toResponseDto(maisonTransit);
    }

    /**
     * Récupérer toutes les maisons de transit avec pagination et filtres
     */
    async findAll(
        paginationQuery: MaisonTransitPaginationQueryDto,
    ): Promise<PaginatedResponseDto<MaisonTransitResponseDto>> {
        const {
            page = 1,
            limit = 10,
            search,
            isActive,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = paginationQuery;

        const skip = (page - 1) * limit;

        // Construction du filtre de recherche
        const where: any = {
            deletedAt: null,
        };

        // Filtre par statut actif
        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        // Recherche textuelle
        if (search) {
            where.OR = [
                { code: { contains: search } },
                { name: { contains: search } },
                { address: { contains: search } },
                { phone: { contains: search } },
                { email: { contains: search } },
            ];
        }

        // Récupération des données
        const [maisons, total] = await Promise.all([
            this.prisma.maisonTransit.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [sortBy]: sortOrder,
                },
            }),
            this.prisma.maisonTransit.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data: maisons.map((maison) => this.toResponseDto(maison)),
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
     * Récupérer une maison de transit par ID
     */
    async findOne(id: number): Promise<MaisonTransitResponseDto | MaisonTransitWithRelationsDto> {
        const maisonTransit = await this.prisma.maisonTransit.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                responsable: true,
                depositaires: {
                    where: { deletedAt: null },
                    orderBy: { name: 'asc' },
                },
                declarations: {
                    where: { deletedAt: null },
                    orderBy: { createdAt: 'desc' },
                },
            }
        });

        if (!maisonTransit) {
            throw new NotFoundException(
                `Maison de transit avec l'ID ${id} non trouvée`,
            );
        }

        return {
            ...this.toResponseDto(maisonTransit),
            responsable: maisonTransit.responsable,
            depositaires: maisonTransit.depositaires,
            declarations: maisonTransit.declarations,
        };

    }

    /**
     * Mettre à jour une maison de transit
     */
    async update(
        id: number,
        updateMaisonTransitDto: UpdateMaisonTransitDto,
    ): Promise<MaisonTransitResponseDto> {
        // Vérifier si la maison de transit existe
        await this.findOne(id);

        // Si le code est modifié, vérifier qu'il n'existe pas déjà
        if (updateMaisonTransitDto.code) {
            const existingMaison = await this.prisma.maisonTransit.findFirst({
                where: {
                    code: updateMaisonTransitDto.code,
                    id: { not: id },
                    deletedAt: null,
                },
            });

            if (existingMaison) {
                throw new ConflictException(
                    `Une maison de transit avec le code "${updateMaisonTransitDto.code}" existe déjà`,
                );
            }
        }

        const maisonTransit = await this.prisma.maisonTransit.update({
            where: { id },
            data: {
                code: updateMaisonTransitDto.code,
                name: updateMaisonTransitDto.name,
                address: updateMaisonTransitDto.address,
                phone: updateMaisonTransitDto.phone,
                email: updateMaisonTransitDto.email,
                responsableId: updateMaisonTransitDto.responsableId,
                isActive: updateMaisonTransitDto.isActive,
                updatedAt: new Date(),
            },
        });

        return this.toResponseDto(maisonTransit);
    }

    /**
     * Supprimer une maison de transit (soft delete)
     */
    async remove(id: number): Promise<void> {
        // Vérifier si la maison de transit existe
        await this.findOne(id);

        // Vérifier s'il y a des relations actives
        const relationsCount = await this.prisma.maisonTransit.findUnique({
            where: { id },
            select: {
                _count: {
                    select: {
                        depositaires: true,
                        declarations: true,
                    },
                },
            },
        });

        if (relationsCount) {
            const totalRelations =
                relationsCount._count.depositaires +
                relationsCount._count.declarations;

            if (totalRelations > 0) {
                throw new ConflictException(
                    `Impossible de supprimer cette maison de transit car elle est associée à ${totalRelations} enregistrement(s) ` +
                    `(${relationsCount._count.depositaires} dépositaire(s), ` +
                    `${relationsCount._count.declarations} déclaration(s))`,
                );
            }
        }

        // Soft delete
        await this.prisma.maisonTransit.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    /**
     * Activer une maison de transit
     */
    async activate(id: number): Promise<MaisonTransitResponseDto> {
        await this.findOne(id);

        const maisonTransit = await this.prisma.maisonTransit.update({
            where: { id },
            data: {
                isActive: true,
                updatedAt: new Date(),
            },
        });

        return this.toResponseDto(maisonTransit);
    }

    /**
     * Désactiver une maison de transit
     */
    async deactivate(id: number): Promise<MaisonTransitResponseDto> {
        await this.findOne(id);

        const maisonTransit = await this.prisma.maisonTransit.update({
            where: { id },
            data: {
                isActive: false,
                updatedAt: new Date(),
            },
        });

        return this.toResponseDto(maisonTransit);
    }

    /**
     * Récupérer les statistiques d'une maison de transit
     */
    async getStatistics(id: number) {
        await this.findOne(id);

        const stats = await this.prisma.maisonTransit.findUnique({
            where: { id },
            select: {
                _count: {
                    select: {
                        depositaires: true,
                        declarations: true,
                    },
                },
            },
        });

        return {
            maisonTransitId: id,
            totalDepositaires: stats?._count.depositaires || 0,
            totalDeclarations: stats?._count.declarations || 0,
        };
    }
}