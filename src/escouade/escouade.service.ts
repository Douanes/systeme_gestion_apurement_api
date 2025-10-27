import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateEscouadeDto, UpdateEscouadeDto } from 'libs/dto/escouade.dto';
import { Escouade } from 'libs/entity/escouade.entity';
import { SearchDto } from 'libs/global/search.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class EscouadeService {
  constructor(private prisma: PrismaService) {}

  async findAll(searchDto?: SearchDto): Promise<{ size: number; data: Escouade[] }> {
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
          { description: { contains: q } },
        ],
      } : {}),
    };

    const validOrderByFields = {
      id: 'id',
      nom: 'nom',
      dateCreation: 'dateCreation',
    };

    const orderBy = {
      [validOrderByFields[order_by] || 'id']: order_dir,
    };

    try {
      const [data, size] = await Promise.all([
        this.prisma.escouade.findMany({
          where,
          orderBy,
          skip: offset,
          take: limit,
          include: {
            chef: true,
            adjoint: true,
            agents: true,
          },
        }),
        this.prisma.escouade.count({ where }),
      ]);

      const mappedData = data.map(escouade => ({
        ...escouade,
        agents: escouade.agents.map(agent => agent.id),
      }));

      return {
        size,
        data: mappedData,
      };
    } catch (error) {
      console.error('Error during findAll:', error);
      throw new HttpException(
        `Erreur lors de la récupération des escouades.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(createEscouadeDto: CreateEscouadeDto): Promise<Escouade> {
    const existingEscouade = await this.prisma.escouade.findFirst({
      where: {
        nom: {
          equals: createEscouadeDto.nom,
        },
      },
    });

    if (existingEscouade) {
      throw new HttpException(
        `Une escouade avec le nom "${createEscouadeDto.nom}" existe déjà.`,
        HttpStatus.CONFLICT,
      );
    }

    try {
      const { agents, ...escouadeData } = createEscouadeDto;

      const data: any = {
        ...escouadeData,
      };

      // Connecter les agents si des IDs sont fournis
      if (agents && agents.length > 0) {
        data.agents = {
          connect: agents.map(id => ({ id }))
        };
      }

      const escouade = await this.prisma.escouade.create({
        data,
        include: {
          chef: true,
          adjoint: true,
          agents: true,
        },
      });

      return {
        ...escouade,
        agents: escouade.agents.map(agent => agent.id),
      };
    } catch (error) {
      console.error('Error during create:', error);
      throw new HttpException(
        `Une erreur s'est produite lors de la création de l'escouade.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<Escouade> {
    const escouade = await this.prisma.escouade.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        chef: true,
        adjoint: true,
        agents: true,
      },
    });

    if (!escouade) {
      throw new HttpException(
        `Escouade non trouvée.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      ...escouade,
      agents: escouade.agents.map(agent => agent.id),
    };
  }

  async update(id: number, updateEscouadeDto: UpdateEscouadeDto): Promise<Escouade> {
    await this.findOne(id);

    try {
      return await this.prisma.$transaction(async (prisma) => {
        if (updateEscouadeDto.nom) {
          const conflictingEscouade = await prisma.escouade.findFirst({
            where: {
              nom: updateEscouadeDto.nom,
              id: { not: id },
            },
          });

          if (conflictingEscouade) {
            throw new HttpException(
              `Une escouade avec ce nom existe déjà.`,
              HttpStatus.CONFLICT,
            );
          }
        }

        const { agents, ...escouadeData } = updateEscouadeDto;

        const data: any = {
          ...escouadeData,
        };

        // Mettre à jour les agents si des IDs sont fournis
        if (agents !== undefined) {
          if (agents.length === 0) {
            // Déconnecter tous les agents
            data.agents = { set: [] };
          } else {
            // Remplacer tous les agents par les nouveaux
            data.agents = {
              set: agents.map(id => ({ id }))
            };
          }
        }

        const escouade = await prisma.escouade.update({
          where: { id },
          data,
          include: {
            chef: true,
            adjoint: true,
            agents: true,
          },
        });

        return {
          ...escouade,
          agents: escouade.agents.map(agent => agent.id),
        };
      });
    } catch (error) {
      console.error('Error during update:', error);
      throw new HttpException(
        `Une erreur s'est produite lors de la mise à jour de l'escouade.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number): Promise<{ success: boolean }> {
    await this.findOne(id);
    try {
      await this.prisma.escouade.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return { success: true };
    } catch (error) {
      throw new HttpException(
        `Une erreur s'est produite lors de la suppression de l'escouade.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async restore(id: number): Promise<Escouade> {
    const escouade = await this.prisma.escouade.findUnique({
      where: { id },
    });

    if (!escouade || !escouade.deletedAt) {
      throw new HttpException(
        `Escouade non trouvée.`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      const escouade = await this.prisma.escouade.update({
        where: { id },
        data: { deletedAt: null },
        include: {
          chef: true,
          adjoint: true,
          agents: true,
        },
      });

      return {
        ...escouade,
        agents: escouade.agents.map(agent => agent.id),
      };
    } catch (error) {
      throw new HttpException(
        `Une erreur s'est produite lors de la restauration de l'escouade.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
