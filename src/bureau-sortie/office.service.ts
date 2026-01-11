import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { BureauSortie } from '@prisma/client';
import {
    CreateBureauSortieDto,
    UpdateBureauSortieDto,
    BureauSortieResponseDto,
    BureauSortieWithRelationsDto,
} from 'libs/dto/bureau-sortie/office.dto';
import { BureauSortiePaginationQueryDto } from 'libs/dto/bureau-sortie/pagination.dto';
import { PaginatedResponseDto } from 'libs/dto/global/response.dto';

@Injectable()
export class BureauSortieService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Transform Prisma BureauSortie to BureauSortieResponseDto
     */
    private toResponseDto(bureauSortie: BureauSortie): BureauSortieResponseDto {
        return {
            id: bureauSortie.id,
            code: bureauSortie.code,
            name: bureauSortie.name,
            localisation: bureauSortie.localisation,
            paysFrontiere: bureauSortie.paysFrontiere,
            itineraire: bureauSortie.itineraire,
            isActive: bureauSortie.isActive,
            createdAt: bureauSortie.createdAt,
            updatedAt: bureauSortie.updatedAt,
        };
    }

    /**
     * Créer un nouveau bureau de sortie
     */
    async create(
        createBureauSortieDto: CreateBureauSortieDto,
    ): Promise<BureauSortieResponseDto> {
        // Vérifier si un bureau avec le même code existe déjà
        const existingBureau = await this.prisma.bureauSortie.findFirst({
            where: {
                code: createBureauSortieDto.code,
                deletedAt: null,
            },
        });

        if (existingBureau) {
            throw new ConflictException(
                `Un bureau de sortie avec le code "${createBureauSortieDto.code}" existe déjà`,
            );
        }

        const bureauSortie = await this.prisma.bureauSortie.create({
            data: {
                code: createBureauSortieDto.code,
                name: createBureauSortieDto.name,
                localisation: createBureauSortieDto.localisation,
                paysFrontiere: createBureauSortieDto.paysFrontiere,
                isActive: createBureauSortieDto.isActive ?? true,
            },
        });

        return this.toResponseDto(bureauSortie);
    }

    /**
     * Récupérer tous les bureaux de sortie avec pagination
     */
    async findAll(
        paginationQuery: BureauSortiePaginationQueryDto,
    ): Promise<PaginatedResponseDto<BureauSortieResponseDto>> {
        const {
            page = 1,
            limit = 10,
            search,
            isActive,
            paysFrontiere,
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

        // Filtre par pays frontalier
        if (paysFrontiere) {
            where.paysFrontiere = {
                contains: paysFrontiere,
            };
        }

        // Recherche textuelle
        if (search) {
            where.OR = [
                { code: { contains: search } },
                { name: { contains: search } },
                { localisation: { contains: search } },
                { paysFrontiere: { contains: search } },
            ];
        }

        // Récupération des données
        const [bureaux, total] = await Promise.all([
            this.prisma.bureauSortie.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [sortBy]: sortOrder,
                },
            }),
            this.prisma.bureauSortie.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data: bureaux.map((bureau) => this.toResponseDto(bureau)),
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
     * Récupérer un bureau de sortie par ID
     */
    async findOne(id: number): Promise<BureauSortieResponseDto | BureauSortieWithRelationsDto> {
        const bureauSortie = await this.prisma.bureauSortie.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include:
            {
                declarations: true,
                agents: true,
                ordreMissions: true,
            },

        });

        if (!bureauSortie) {
            throw new NotFoundException(
                `Bureau de sortie avec l'ID ${id} non trouvé`,
            );
        }

        return {
            ...this.toResponseDto(bureauSortie),
            declarations: bureauSortie.declarations,
            agents: bureauSortie.agents,
            ordreMissions: bureauSortie.ordreMissions,
        };

    }

    /**
     * Mettre à jour un bureau de sortie
     */
    async update(
        id: number,
        updateBureauSortieDto: UpdateBureauSortieDto,
    ): Promise<BureauSortieResponseDto> {
        // Vérifier si le bureau existe
        await this.findOne(id);

        // Si le code est modifié, vérifier qu'il n'existe pas déjà
        if (updateBureauSortieDto.code) {
            const existingBureau = await this.prisma.bureauSortie.findFirst({
                where: {
                    code: updateBureauSortieDto.code,
                    id: { not: id },
                    deletedAt: null,
                },
            });

            if (existingBureau) {
                throw new ConflictException(
                    `Un bureau de sortie avec le code "${updateBureauSortieDto.code}" existe déjà`,
                );
            }
        }

        const bureauSortie = await this.prisma.bureauSortie.update({
            where: { id },
            data: {
                code: updateBureauSortieDto.code,
                name: updateBureauSortieDto.name,
                localisation: updateBureauSortieDto.localisation,
                paysFrontiere: updateBureauSortieDto.paysFrontiere,
                isActive: updateBureauSortieDto.isActive,
                updatedAt: new Date(),
            },
        });

        return this.toResponseDto(bureauSortie);
    }

    /**
     * Supprimer un bureau de sortie (soft delete)
     */
    async remove(id: number): Promise<void> {
        // Vérifier si le bureau existe
        await this.findOne(id);

        // Vérifier s'il y a des relations actives
        const relationsCount = await this.prisma.bureauSortie.findUnique({
            where: { id },
            select: {
                _count: {
                    select: {
                        declarations: true,
                        agents: true,
                        ordreMissions: true,
                    },
                },
            },
        });

        if (relationsCount) {
            const totalRelations =
                relationsCount._count.declarations +
                relationsCount._count.agents +
                relationsCount._count.ordreMissions;

            if (totalRelations > 0) {
                throw new ConflictException(
                    `Impossible de supprimer ce bureau de sortie car il est associé à ${totalRelations} enregistrement(s) ` +
                    `(${relationsCount._count.declarations} déclaration(s), ` +
                    `${relationsCount._count.agents} agent(s), ` +
                    `${relationsCount._count.ordreMissions} ordre(s) de mission)`,
                );
            }
        }

        // Soft delete
        await this.prisma.bureauSortie.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    /**
     * Récupérer tous les bureaux de sortie actifs (sans pagination) - pour listes déroulantes
     */
    async findAllActive(): Promise<BureauSortieResponseDto[]> {
        const bureaux = await this.prisma.bureauSortie.findMany({
            where: {
                deletedAt: null,
                isActive: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        return bureaux.map((bureau) => this.toResponseDto(bureau));
    }

    /**
     * Activer un bureau de sortie
     */
    async activate(id: number): Promise<BureauSortieResponseDto> {
        await this.findOne(id);

        const bureauSortie = await this.prisma.bureauSortie.update({
            where: { id },
            data: {
                isActive: true,
                updatedAt: new Date(),
            },
        });

        return this.toResponseDto(bureauSortie);
    }

    /**
     * Désactiver un bureau de sortie
     */
    async deactivate(id: number): Promise<BureauSortieResponseDto> {
        await this.findOne(id);

        const bureauSortie = await this.prisma.bureauSortie.update({
            where: { id },
            data: {
                isActive: false,
                updatedAt: new Date(),
            },
        });

        return this.toResponseDto(bureauSortie);
    }

    /**
     * Récupérer les statistiques d'un bureau
     */
    async getStatistics(id: number) {
        await this.findOne(id);

        const stats = await this.prisma.bureauSortie.findUnique({
            where: { id },
            select: {
                _count: {
                    select: {
                        declarations: true,
                        agents: true,
                        ordreMissions: true,
                    },
                },
            },
        });

        return {
            bureauId: id,
            totalDeclarations: stats?._count.declarations || 0,
            totalAgents: stats?._count.agents || 0,
            totalOrdreMissions: stats?._count.ordreMissions || 0,
        };
    }
}