import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Depositaire } from '@prisma/client';
import {
    CreateDepositaireDto,
    UpdateDepositaireDto,
    DepositaireResponseDto,
    DepositaireWithRelationsDto,
} from 'libs/dto/depositaire';
import { DepositairePaginationQueryDto } from 'libs/dto/depositaire/pagination.dto';
import { PaginatedResponseDto } from 'libs/dto/global/response.dto';

@Injectable()
export class DepositaireService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Transform Prisma Depositaire to DepositaireResponseDto
     */
    private toResponseDto(depositaire: Depositaire): DepositaireResponseDto {
        return {
            id: depositaire.id,
            name: depositaire.name,
            phone1: depositaire.phone1,
            phone2: depositaire.phone2,
            address: depositaire.address,
            email: depositaire.email,
            identificationNumber: depositaire.identificationNumber,
            isActive: depositaire.isActive,
            maisonTransitId: depositaire.maisonTransitId,
            createdAt: depositaire.createdAt,
            updatedAt: depositaire.updatedAt,
        };
    }

    /**
     * Transform Prisma Depositaire with relations to DepositaireWithRelationsDto
     */
    private toResponseDtoWithRelations(depositaire: any): DepositaireWithRelationsDto {
        return {
            ...this.toResponseDto(depositaire),
            maisonTransit: depositaire.maisonTransit || undefined,
            declarationsCount: depositaire._count?.savedDeclarations,
            ordreMissionsCount: depositaire._count?.ordreMissions,
        };
    }

    /**
     * Vérifier si l'utilisateur possède/a accès au dépositaire
     */
    private checkOwnership(depositaire: any, currentUser?: { role: string; maisonTransitIds: number[] }) {
        if (currentUser && !['ADMIN', 'AGENT', 'SUPERVISEUR'].includes(currentUser.role)) {
            if (!depositaire.maisonTransitId || !currentUser.maisonTransitIds.includes(depositaire.maisonTransitId)) {
                throw new ForbiddenException("Vous n'avez pas les droits nécessaires pour accéder à ce dépositaire");
            }
        }
    }

    /**
     * Créer un nouveau dépositaire
     */
    async create(createDepositaireDto: CreateDepositaireDto): Promise<DepositaireResponseDto> {
        // Vérifier si une maison de transit existe si fournie
        if (createDepositaireDto.maisonTransitId) {
            const maisonTransit = await this.prisma.maisonTransit.findFirst({
                where: {
                    id: createDepositaireDto.maisonTransitId,
                    deletedAt: null,
                },
            });

            if (!maisonTransit) {
                throw new NotFoundException(
                    `Maison de transit avec l'ID ${createDepositaireDto.maisonTransitId} non trouvée`,
                );
            }
        }

        const depositaire = await this.prisma.depositaire.create({
            data: {
                name: createDepositaireDto.name,
                phone1: createDepositaireDto.phone1,
                phone2: createDepositaireDto.phone2,
                address: createDepositaireDto.address,
                email: createDepositaireDto.email,
                identificationNumber: createDepositaireDto.identificationNumber,
                maisonTransitId: createDepositaireDto.maisonTransitId,
            },
        });

        return this.toResponseDto(depositaire);
    }

    /**
     * Récupérer tous les dépositaires avec pagination et filtres
     */
    async findAll(
        paginationQuery: DepositairePaginationQueryDto,
        currentUser?: { role: string; maisonTransitIds: number[] },
    ): Promise<PaginatedResponseDto<DepositaireWithRelationsDto>> {
        const {
            page = 1,
            limit = 10,
            search,
            isActive,
            maisonTransitId,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = paginationQuery;

        const skip = (page - 1) * limit;

        // Construction du filtre de recherche
        const where: any = {
            deletedAt: null,
        };

        // Filtrage automatique par maison de transit pour TRANSITAIRE/DECLARANT
        if (currentUser && !['ADMIN', 'AGENT', 'SUPERVISEUR'].includes(currentUser.role)) {
            if (currentUser.maisonTransitIds.length > 0) {
                where.maisonTransitId = { in: currentUser.maisonTransitIds };
            } else {
                where.maisonTransitId = -1;
            }
        } else if (maisonTransitId) {
            where.maisonTransitId = maisonTransitId;
        }

        // Recherche textuelle
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone1: { contains: search } },
                { phone2: { contains: search } },
            ];
        }

        // Filtrer par statut actif
        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        // Récupération des données
        const [depositaires, total] = await Promise.all([
            this.prisma.depositaire.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [sortBy]: sortOrder,
                },
                include: {
                    maisonTransit: {
                        select: {
                            id: true,
                            name: true,
                            code: true,
                        },
                    },
                    _count: {
                        select: {
                            savedDeclarations: true,
                            ordreMissions: true,
                        },
                    },
                },
            }),
            this.prisma.depositaire.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data: depositaires.map((depositaire) => this.toResponseDtoWithRelations(depositaire)),
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
     * Récupérer un dépositaire par ID
     */
    async findOne(
        id: number,
        currentUser?: { role: string; maisonTransitIds: number[] },
    ): Promise<DepositaireWithRelationsDto> {
        const depositaire = await this.prisma.depositaire.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                maisonTransit: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        email: true,
                        phone: true,
                    },
                },
                _count: {
                    select: {
                        savedDeclarations: true,
                        ordreMissions: true,
                    },
                },
            },
        });

        if (!depositaire) {
            throw new NotFoundException(`Dépositaire avec l'ID ${id} non trouvé`);
        }

        // Vérifier les droits
        this.checkOwnership(depositaire, currentUser);

        return this.toResponseDtoWithRelations(depositaire);
    }

    /**
     * Mettre à jour un dépositaire
     */
    async update(
        id: number,
        updateDepositaireDto: UpdateDepositaireDto,
        currentUser?: { role: string; maisonTransitIds: number[] },
    ): Promise<DepositaireResponseDto> {
        // Vérifier si le dépositaire existe
        const existing = await this.findOne(id, currentUser);

        // Vérifier les droits
        this.checkOwnership(existing, currentUser);

        // Vérifier si une maison de transit existe si fournie
        if (updateDepositaireDto.maisonTransitId) {
            const maisonTransit = await this.prisma.maisonTransit.findFirst({
                where: {
                    id: updateDepositaireDto.maisonTransitId,
                    deletedAt: null,
                },
            });

            if (!maisonTransit) {
                throw new NotFoundException(
                    `Maison de transit avec l'ID ${updateDepositaireDto.maisonTransitId} non trouvée`,
                );
            }
        }

        const depositaire = await this.prisma.depositaire.update({
            where: { id },
            data: {
                name: updateDepositaireDto.name,
                phone1: updateDepositaireDto.phone1,
                phone2: updateDepositaireDto.phone2,
                address: updateDepositaireDto.address,
                email: updateDepositaireDto.email,
                identificationNumber: updateDepositaireDto.identificationNumber,
                isActive: updateDepositaireDto.isActive,
                maisonTransitId: updateDepositaireDto.maisonTransitId,
                updatedAt: new Date(),
            },
        });

        return this.toResponseDto(depositaire);
    }

    /**
     * Supprimer un dépositaire (soft delete)
     */
    async remove(
        id: number,
        currentUser?: { role: string; maisonTransitIds: number[] },
    ): Promise<void> {
        // Vérifier si le dépositaire existe
        const existing = await this.findOne(id, currentUser);

        // Vérifier les droits
        this.checkOwnership(existing, currentUser);

        // Vérifier s'il y a des ordres de mission associés
        const ordreMissionsCount = await this.prisma.ordreMission.count({
            where: {
                depositaireId: id,
                deletedAt: null,
            },
        });

        if (ordreMissionsCount > 0) {
            throw new ConflictException(
                `Impossible de supprimer ce dépositaire car il est lié à ${ordreMissionsCount} ordre(s) de mission. ` +
                `Veuillez d'abord désassocier ou supprimer ces ordres.`,
            );
        }

        // Vérifier s'il y a des déclarations associées
        const declarationsCount = await this.prisma.declaration.count({
            where: {
                depositaireId: id,
                deletedAt: null,
            },
        });

        if (declarationsCount > 0) {
            throw new ConflictException(
                `Impossible de supprimer ce dépositaire car il est lié à ${declarationsCount} déclaration(s). ` +
                `Veuillez d'abord désassocier ou supprimer ces déclarations.`,
            );
        }

        // Soft delete
        await this.prisma.depositaire.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    /**
     * Récupérer les statistiques d'un dépositaire
     */
    async getStatistics(
        id: number,
        currentUser?: { role: string; maisonTransitIds: number[] },
    ) {
        await this.findOne(id, currentUser);

        const [declarationsCount, ordreMissionsCount] = await Promise.all([
            this.prisma.declaration.count({
                where: {
                    depositaireId: id,
                    deletedAt: null,
                },
            }),
            this.prisma.ordreMission.count({
                where: {
                    depositaireId: id,
                    deletedAt: null,
                },
            }),
        ]);

        return {
            depositaireId: id,
            totalDeclarations: declarationsCount,
            totalOrdreMissions: ordreMissionsCount,
        };
    }
}
