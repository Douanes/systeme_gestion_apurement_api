import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateRegimeDto, UpdateRegimeDto, RegimeResponseDto } from 'libs/dto/regime/regime.dto';
import { PaginationQueryDto } from 'libs/dto/global/pagination.dto';
import { PaginatedResponseDto } from 'libs/dto/global/response.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Regime } from '@prisma/client';

@Injectable()
export class RegimeService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Créer un nouveau régime
   */
  async create(createRegimeDto: CreateRegimeDto): Promise<RegimeResponseDto> {
    // Vérifier si un régime avec le même nom existe déjà
    const existingRegime = await this.prisma.regime.findFirst({
      where: {
        name: createRegimeDto.name,
        deletedAt: null,
      },
    });

    if (existingRegime) {
      throw new ConflictException(
        `Un régime avec le nom "${createRegimeDto.name}" existe déjà`,
      );
    }

    const regime = await this.prisma.regime.create({
      data: {
        name: createRegimeDto.name,
        description: createRegimeDto.description,
      },
    });

    return this.toResponseDto(regime);
  }

  /**
   * Récupérer tous les régimes avec pagination
   */
  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<RegimeResponseDto>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = paginationQuery;

    const skip = (page - 1) * limit;

    // Construction du filtre de recherche
    const where: any = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    // Récupération des données
    const [regimes, total] = await Promise.all([
      this.prisma.regime.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.prisma.regime.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: regimes.map(regime => this.toResponseDto(regime)),
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
   * Récupérer un régime par ID
   */
  async findOne(id: number): Promise<RegimeResponseDto> {
    const regime = await this.prisma.regime.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!regime) {
      throw new NotFoundException(`Régime avec l'ID ${id} non trouvé`);
    }

    return this.toResponseDto(regime);
  }

  /**
   * Mettre à jour un régime
   */
  async update(
    id: number,
    updateRegimeDto: UpdateRegimeDto,
  ): Promise<RegimeResponseDto> {
    // Vérifier si le régime existe
    await this.findOne(id);

    // Si le nom est modifié, vérifier qu'il n'existe pas déjà
    if (updateRegimeDto.name) {
      const existingRegime = await this.prisma.regime.findFirst({
        where: {
          name: updateRegimeDto.name,
          id: { not: id },
          deletedAt: null,
        },
      });

      if (existingRegime) {
        throw new ConflictException(
          `Un régime avec le nom "${updateRegimeDto.name}" existe déjà`,
        );
      }
    }

    const regime = await this.prisma.regime.update({
      where: { id },
      data: {
        name: updateRegimeDto.name,
        description: updateRegimeDto.description,
        updatedAt: new Date(),
      },
    });

    return this.toResponseDto(regime);
  }

  /**
   * Supprimer un régime (soft delete)
   */
  async remove(id: number): Promise<void> {
    // Vérifier si le régime existe
    await this.findOne(id);

    // Soft delete
    await this.prisma.regime.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Récupérer tous les régimes (sans pagination) - utile pour les listes déroulantes
   */
  async findAllSimple(): Promise<RegimeResponseDto[]> {
    const regimes = await this.prisma.regime.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return regimes.map(regime => this.toResponseDto(regime));
  }

  private toResponseDto(regime: Regime): RegimeResponseDto {
    return {
      id: regime.id,
      name: regime.name,
      description: regime.description,
      createdAt: regime.createdAt,
      updatedAt: regime.updatedAt,
    };
  }
}

