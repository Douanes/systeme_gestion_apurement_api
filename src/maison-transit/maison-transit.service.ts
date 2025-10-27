import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateMaisonTransitDto, UpdateMaisonTransitDto } from 'libs/dto/maison_transit.dto';
import { MaisonTransit } from 'libs/entity/maison-transit.entity';
import { SearchDto } from 'libs/global/search.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MaisonTransitService {
  constructor(private prisma: PrismaService) {}

  // Récupérer toutes les maisons de transit avec pagination et recherche
  async findAll(searchDto?: SearchDto): Promise<{ size: number; data: MaisonTransit[] }> {
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
      ...(q ? { nom: { contains: q } } : {}),
    };

    const validOrderByFields = {
      id: 'id',
      nom: 'nom',
    };

    const orderBy = {
      [validOrderByFields[order_by] || 'id']: order_dir,
    };

    try {
      const [data, size] = await Promise.all([
        this.prisma.maisonTransit.findMany({
          where,
          orderBy,
          skip: offset,
          take: limit,
        }),
        this.prisma.maisonTransit.count({ where }),
      ]);

      return {
        size,
        data,
      };
    } catch (error) {
      console.error('Error during findAll:', error);
      throw new HttpException(
        `Erreur lors de la récupération des maisons de transit.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  // Créer une maison de transit
  async create(createMaisonTransitDto: CreateMaisonTransitDto): Promise<MaisonTransit> {
    const existingMaisonTransit = await this.prisma.maisonTransit.findFirst({
      where: {
        nom: {
          equals: createMaisonTransitDto.nom.toLowerCase(),
        },
      },
    });

    if (existingMaisonTransit) {
      throw new HttpException(
        `La maison de transit "${createMaisonTransitDto.nom}" existe déjà.`,
        HttpStatus.CONFLICT,
      );
    }

    try {
      return await this.prisma.maisonTransit.create({
        data: createMaisonTransitDto,
      });
    } catch (error) {
      console.error('Error during create:', error);
      throw new HttpException(
        `Une erreur s'est produite lors de la création de la maison de transit.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Récupérer une maison de transit par ID
  async findOne(id: number): Promise<MaisonTransit> {
    const maisonTransit = await this.prisma.maisonTransit.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!maisonTransit) {
      throw new HttpException(
        `Maison de transit non trouvée.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return maisonTransit;
  }

  // Mettre à jour une maison de transit
  async update(id: number, updateMaisonTransitDto: UpdateMaisonTransitDto): Promise<MaisonTransit> {
    await this.findOne(id); // Vérifie si la maison de transit existe

    try {
      return await this.prisma.$transaction(async (prisma) => {
        if (updateMaisonTransitDto.nom) {
          const conflictingMaisonTransit = await prisma.maisonTransit.findFirst({
            where: {
              nom: updateMaisonTransitDto.nom,
              id: { not: id },
            },
          });

          if (conflictingMaisonTransit) {
            throw new HttpException(
              `Une maison de transit avec ce nom existe déjà.`,
              HttpStatus.CONFLICT,
            );
          }
        }

        return await prisma.maisonTransit.update({
          where: { id },
          data: updateMaisonTransitDto,
        });
      });
    } catch (error) {
      console.error('Error during update:', error);
      throw new HttpException(
        `Une erreur s'est produite lors de la mise à jour de la maison de transit.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Supprimer une maison de transit (soft delete)
  async remove(id: number): Promise<{ success: boolean }> {
    await this.findOne(id); // Vérifie si la maison de transit existe
    try {
      await this.prisma.maisonTransit.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return { success: true };
    } catch (error) {
      throw new HttpException(
        `Une erreur s'est produite lors de la suppression de la maison de transit.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Restaurer une maison de transit supprimée
  async restore(id: number): Promise<MaisonTransit> {
    const maisonTransit = await this.prisma.maisonTransit.findUnique({
      where: { id },
    });

    if (!maisonTransit || !maisonTransit.deletedAt) {
      throw new HttpException(
        `Maison de transit non trouvée.`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      return await this.prisma.maisonTransit.update({
        where: { id },
        data: { deletedAt: null },
      });
    } catch (error) {
      throw new HttpException(
        `Une erreur s'est produite lors de la restauration de la maison de transit.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}