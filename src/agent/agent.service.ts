import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateAgentDto, UpdateAgentDto } from 'libs/dto/agent.dto';
import { Agent } from 'libs/entity/agent.entity';
import { SearchDto } from 'libs/global/search.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AgentService {
  constructor(private prisma: PrismaService) {}

  async findAll(searchDto?: SearchDto): Promise<{ size: number; data: Agent[] }> {
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
          { prenom: { contains: q } },
          { matricule: { contains: q } },
          { telephone: { contains: q } },
          { grade: { contains: q } },
        ],
      } : {}),
    };

    const validOrderByFields = {
      id: 'id',
      nom: 'nom',
      prenom: 'prenom',
      matricule: 'matricule',
      grade: 'grade',
    };

    const orderBy = {
      [validOrderByFields[order_by] || 'id']: order_dir,
    };

    try {
      const [data, size] = await Promise.all([
        this.prisma.agent.findMany({
          where,
          orderBy,
          skip: offset,
          take: limit,
        }),
        this.prisma.agent.count({ where }),
      ]);

      return {
        size,
        data,
      };
    } catch (error) {
      console.error('Error during findAll:', error);
      throw new HttpException(
        `Erreur lors de la récupération des agents.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(createAgentDto: CreateAgentDto): Promise<Agent> {
    const existingAgent = await this.prisma.agent.findFirst({
      where: {
        matricule: {
          equals: createAgentDto.matricule,
        },
      },
    });

    if (existingAgent) {
      throw new HttpException(
        `Un agent avec le matricule "${createAgentDto.matricule}" existe déjà.`,
        HttpStatus.CONFLICT,
      );
    }

    try {
      return await this.prisma.agent.create({
        data: createAgentDto,
      });
    } catch (error) {
      console.error('Error during create:', error);
      throw new HttpException(
        `Une erreur s'est produite lors de la création de l'agent.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<Agent> {
    const agent = await this.prisma.agent.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!agent) {
      throw new HttpException(
        `Agent non trouvé.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return agent;
  }

  async update(id: number, updateAgentDto: UpdateAgentDto): Promise<Agent> {
    await this.findOne(id);

    try {
      return await this.prisma.$transaction(async (prisma) => {
        if (updateAgentDto.matricule) {
          const conflictingAgent = await prisma.agent.findFirst({
            where: {
              matricule: updateAgentDto.matricule,
              id: { not: id },
            },
          });

          if (conflictingAgent) {
            throw new HttpException(
              `Un agent avec ce matricule existe déjà.`,
              HttpStatus.CONFLICT,
            );
          }
        }

        return await prisma.agent.update({
          where: { id },
          data: updateAgentDto,
        });
      });
    } catch (error) {
      console.error('Error during update:', error);
      throw new HttpException(
        `Une erreur s'est produite lors de la mise à jour de l'agent.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number): Promise<{ success: boolean }> {
    await this.findOne(id);
    try {
      await this.prisma.agent.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return { success: true };
    } catch (error) {
      throw new HttpException(
        `Une erreur s'est produite lors de la suppression de l'agent.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async restore(id: number): Promise<Agent> {
    const agent = await this.prisma.agent.findUnique({
      where: { id },
    });

    if (!agent || !agent.deletedAt) {
      throw new HttpException(
        `Agent non trouvé.`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      return await this.prisma.agent.update({
        where: { id },
        data: { deletedAt: null },
      });
    } catch (error) {
      throw new HttpException(
        `Une erreur s'est produite lors de la restauration de l'agent.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
