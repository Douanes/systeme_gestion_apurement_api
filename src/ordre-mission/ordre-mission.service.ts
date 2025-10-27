import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateOrdreMissionDto, UpdateOrdreMissionDto } from 'libs/dto/ordre-mission.dto';
import { OrdreMission } from 'libs/entity/ordre-mission.entity';
import { SearchDto } from 'libs/global/search.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class OrdreMissionService {
  constructor(private prisma: PrismaService) {}

  async findAll(searchDto?: SearchDto): Promise<{ size: number; data: OrdreMission[] }> {
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
      ...(q ? {
        OR: [
          { numeroOrdre: { contains: q } },
          { depositaire: { contains: q } },
        ],
      } : {}),
    };

    const validOrderByFields = {
      id: 'id',
      numeroOrdre: 'numeroOrdre',
      date: 'date',
      poidsTotal: 'poidsTotal',
    };

    const orderBy = {
      [validOrderByFields[order_by] || 'id']: order_dir,
    };

    try {
      const [data, size] = await Promise.all([
        this.prisma.ordreMission.findMany({
          where,
          orderBy,
          skip: offset,
          take: limit,
          include: {
            bureauSortie: true,
            escouade: true,
            maisonTransit: true,
            declaration: true,
          },
        }),
        this.prisma.ordreMission.count({ where }),
      ]);

      return {
        size,
        data,
      };
    } catch (error) {
      console.error('Error during findAll:', error);
      throw new HttpException(
        `Erreur lors de la récupération des ordres de mission.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(createOrdreMissionDto: CreateOrdreMissionDto): Promise<OrdreMission> {
    const existingOrdre = await this.prisma.ordreMission.findFirst({
      where: {
        numeroOrdre: {
          equals: createOrdreMissionDto.numeroOrdre,
        },
      },
    });

    if (existingOrdre) {
      throw new HttpException(
        `Un ordre de mission avec le numéro "${createOrdreMissionDto.numeroOrdre}" existe déjà.`,
        HttpStatus.CONFLICT,
      );
    }

    try {
      const data = {
        ...createOrdreMissionDto,
        naturesMarchandises: JSON.stringify(createOrdreMissionDto.naturesMarchandises),
      };

      return await this.prisma.ordreMission.create({
        data,
        include: {
          bureauSortie: true,
          escouade: true,
          maisonTransit: true,
          declaration: true,
        },
      });
    } catch (error) {
      console.error('Error during create:', error);
      throw new HttpException(
        `Une erreur s'est produite lors de la création de l'ordre de mission.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<OrdreMission> {
    const ordre = await this.prisma.ordreMission.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        bureauSortie: true,
        escouade: true,
        maisonTransit: true,
        declaration: true,
      },
    });

    if (!ordre) {
      throw new HttpException(
        `Ordre de mission non trouvé.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return ordre;
  }

  async update(id: number, updateOrdreMissionDto: UpdateOrdreMissionDto): Promise<OrdreMission> {
    await this.findOne(id);

    try {
      return await this.prisma.$transaction(async (prisma) => {
        if (updateOrdreMissionDto.numeroOrdre) {
          const conflictingOrdre = await prisma.ordreMission.findFirst({
            where: {
              numeroOrdre: updateOrdreMissionDto.numeroOrdre,
              id: { not: id },
            },
          });

          if (conflictingOrdre) {
            throw new HttpException(
              `Un ordre de mission avec ce numéro existe déjà.`,
              HttpStatus.CONFLICT,
            );
          }
        }

        const { bureauSortieId, escouadeId, maisonId, naturesMarchandises, ...otherFields } = updateOrdreMissionDto;

        const data: any = {
          ...otherFields,
          ...(naturesMarchandises && {
            naturesMarchandises: JSON.stringify(naturesMarchandises),
          }),
        };

        // Ajouter les relations seulement si elles sont définies
        if (bureauSortieId !== undefined) {
          data.bureauSortie = { connect: { id: bureauSortieId } };
        }
        if (escouadeId !== undefined) {
          data.escouade = { connect: { id: escouadeId } };
        }
        if (maisonId !== undefined) {
          data.maisonTransit = { connect: { id: maisonId } };
        }

        return await prisma.ordreMission.update({
          where: { id },
          data,
          include: {
            bureauSortie: true,
            escouade: true,
            maisonTransit: true,
            declaration: true,
          },
        });
      });
    } catch (error) {
      console.error('Error during update:', error);
      throw new HttpException(
        `Une erreur s'est produite lors de la mise à jour de l'ordre de mission.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number): Promise<{ success: boolean }> {
    await this.findOne(id);
    try {
      await this.prisma.ordreMission.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return { success: true };
    } catch (error) {
      throw new HttpException(
        `Une erreur s'est produite lors de la suppression de l'ordre de mission.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async restore(id: number): Promise<OrdreMission> {
    const ordre = await this.prisma.ordreMission.findUnique({
      where: { id },
    });

    if (!ordre || !ordre.deletedAt) {
      throw new HttpException(
        `Ordre de mission non trouvé.`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      return await this.prisma.ordreMission.update({
        where: { id },
        data: { deletedAt: null },
        include: {
          bureauSortie: true,
          escouade: true,
          maisonTransit: true,
          declaration: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Une erreur s'est produite lors de la restauration de l'ordre de mission.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
