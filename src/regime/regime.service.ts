import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Regime } from '@prisma/client';
import { CreateRegimeDto, UpdateRegimeDto } from 'libs/dto/regime.dto';
import { SearchDto } from 'libs/global/search.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class RegimeService {
  constructor(private prisma: PrismaService) {}

  // Récupérer tous les régimes avec pagination et recherche
  async findAll(searchDto?: SearchDto): Promise<{ size: number; data: Regime[] }> {
    searchDto = searchDto || {};

    const {
      q,
      order_by = 'id',
      order_dir = 'desc',
      limit = 10,
      offset = 0,
    } = searchDto;

    const where = {
      deletedAt: null,
      ...(q ? { libelle: { contains: q } } : {}),
    };

    const validOrderByFields = {
      id: 'id',
      libelle: 'libelle',
    };

    const orderBy = {
      [validOrderByFields[order_by] || 'id']: order_dir,
    };

    try {
      const [data, size] = await Promise.all([
        this.prisma.regime.findMany({
          where,
          orderBy,
          skip: offset,
          take: limit,
        }),
        this.prisma.regime.count({ where }),
      ]);

      return {
        size,
        data,
      };
    } catch (error) {
      console.error('Error during findAll:', error);
      throw new HttpException(
        `Erreur lors de la récupération des régimes.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  // Créer un régime
  async create(createRegimeDto: CreateRegimeDto): Promise<Regime> {
    const existingRegime = await this.prisma.regime.findFirst({
      where: {
        libelle: {
          equals: createRegimeDto.libelle.toLowerCase(),
        },
      },
    });

    if (existingRegime) {
      throw new HttpException(
        `Le régime avec le libellé "${createRegimeDto.libelle}" existe déjà.`,
        HttpStatus.CONFLICT,
      );
    }

    try {
      return await this.prisma.regime.create({
        data: createRegimeDto,
      });
    } catch (error) {
      console.error('Error during create:', error);
      throw new HttpException(
        `Une erreur s'est produite lors de la création du régime.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Récupérer un régime par ID
  async findOne(id: number): Promise<Regime> {
    const regime = await this.prisma.regime.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!regime) {
      throw new HttpException(
        `Régime non trouvé.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return regime;
  }

  // Mettre à jour un régime
  async update(id: number, updateRegimeDto: UpdateRegimeDto): Promise<Regime> {
    await this.findOne(id); // Vérifie si le régime existe

    try {
      return await this.prisma.$transaction(async (prisma) => {
        if (updateRegimeDto.libelle) {
          const conflictingRegime = await prisma.regime.findFirst({
            where: {
              libelle: updateRegimeDto.libelle,
              id: { not: id },
            },
          });

          if (conflictingRegime) {
            throw new HttpException(
              `Un régime avec ce libellé existe déjà.`,
              HttpStatus.CONFLICT,
            );
          }
        }

        return await prisma.regime.update({
          where: { id },
          data: updateRegimeDto,
        });
      });
    } catch (error) {
      console.error('Error during update:', error);
      throw new HttpException(
        `Une erreur s'est produite lors de la mise à jour du régime.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Supprimer un régime (soft delete)
  async remove(id: number): Promise<{ success: boolean }> {
    await this.findOne(id); // Vérifie si le régime existe
    try {
      await this.prisma.regime.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return { success: true };
    } catch (error) {
      throw new HttpException(
        `Une erreur s'est produite lors de la suppression du régime.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Restaurer un régime supprimé
  async restore(id: number): Promise<Regime> {
    const regime = await this.prisma.regime.findUnique({
      where: { id },
    });

    if (!regime || !regime.deletedAt) {
      throw new HttpException(
        `Régime non trouvé.`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      return await this.prisma.regime.update({
        where: { id },
        data: { deletedAt: null },
      });
    } catch (error) {
      throw new HttpException(
        `Une erreur s'est produite lors de la restauration du régime.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}