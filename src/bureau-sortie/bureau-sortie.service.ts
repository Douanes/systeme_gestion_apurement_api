import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateBureauSortieDto, UpdateBureauSortieDto } from 'libs/dto/bureau-sortie.dto';
import { BureauSortie } from 'libs/entity/bureau-sortie.entity';
import { SearchDto } from 'libs/global/search.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class BureauSortieService {
  constructor(private prisma: PrismaService) {}

  async findAll(searchDto?: SearchDto): Promise<{ size: number; data: BureauSortie[] }> {
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
          { nom: { contains: q } },
          { code: { contains: q } },
          { ville: { contains: q } },
          { region: { contains: q } },
        ],
      } : {}),
    };

    const validOrderByFields = {
      id: 'id',
      nom: 'nom',
      code: 'code',
      ville: 'ville',
      region: 'region',
    };

    const orderBy = {
      [validOrderByFields[order_by] || 'id']: order_dir,
    };

    try {
      const [data, size] = await Promise.all([
        this.prisma.bureauSortie.findMany({
          where,
          orderBy,
          skip: offset,
          take: limit,
        }),
        this.prisma.bureauSortie.count({ where }),
      ]);

      return {
        size,
        data,
      };
    } catch (error) {
      console.error('Error during findAll:', error);
      throw new HttpException(
        `Erreur lors de la récupération des bureaux de sortie.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(createBureauSortieDto: CreateBureauSortieDto): Promise<BureauSortie> {
    const existingBureau = await this.prisma.bureauSortie.findFirst({
      where: {
        code: {
          equals: createBureauSortieDto.code,
        },
      },
    });

    if (existingBureau) {
      throw new HttpException(
        `Un bureau de sortie avec le code "${createBureauSortieDto.code}" existe déjà.`,
        HttpStatus.CONFLICT,
      );
    }

    try {
      return await this.prisma.bureauSortie.create({
        data: createBureauSortieDto,
      });
    } catch (error) {
      console.error('Error during create:', error);
      throw new HttpException(
        `Une erreur s'est produite lors de la création du bureau de sortie.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<BureauSortie> {
    const bureau = await this.prisma.bureauSortie.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!bureau) {
      throw new HttpException(
        `Bureau de sortie non trouvé.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return bureau;
  }

  async update(id: number, updateBureauSortieDto: UpdateBureauSortieDto): Promise<BureauSortie> {
    await this.findOne(id);

    try {
      return await this.prisma.$transaction(async (prisma) => {
        if (updateBureauSortieDto.code) {
          const conflictingBureau = await prisma.bureauSortie.findFirst({
            where: {
              code: updateBureauSortieDto.code,
              id: { not: id },
            },
          });

          if (conflictingBureau) {
            throw new HttpException(
              `Un bureau de sortie avec ce code existe déjà.`,
              HttpStatus.CONFLICT,
            );
          }
        }

        return await prisma.bureauSortie.update({
          where: { id },
          data: updateBureauSortieDto,
        });
      });
    } catch (error) {
      console.error('Error during update:', error);
      throw new HttpException(
        `Une erreur s'est produite lors de la mise à jour du bureau de sortie.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number): Promise<{ success: boolean }> {
    await this.findOne(id);
    try {
      await this.prisma.bureauSortie.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return { success: true };
    } catch (error) {
      throw new HttpException(
        `Une erreur s'est produite lors de la suppression du bureau de sortie.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async restore(id: number): Promise<BureauSortie> {
    const bureau = await this.prisma.bureauSortie.findUnique({
      where: { id },
    });

    if (!bureau || !bureau.deletedAt) {
      throw new HttpException(
        `Bureau de sortie non trouvé.`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      return await this.prisma.bureauSortie.update({
        where: { id },
        data: { deletedAt: null },
      });
    } catch (error) {
      throw new HttpException(
        `Une erreur s'est produite lors de la restauration du bureau de sortie.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
