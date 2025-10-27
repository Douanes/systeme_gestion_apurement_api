import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateDeclarationDto, UpdateDeclarationDto } from 'libs/dto/declaration.dto';
import { Declaration } from 'libs/entity/declaration.entity';
import { SearchDto } from 'libs/global/search.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DeclarationService {
  constructor(private prisma: PrismaService) {}

    // Récupérer toutes les déclarations avec pagination et recherche
    async findAll(searchDto?: SearchDto): Promise<{ size: number; data: Declaration[] }> {
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
            { num_declaration: { contains: q } },
            { marchandise: { contains: q } },
            { depositaire: { contains: q } },
          ],
        } : {}),
      };
  
      const validOrderByFields = {
        id: 'id',
        num_ordre: 'num_ordre',
        num_declaration: 'num_declaration',
        marchandise: 'marchandise',
        depositaire: 'depositaire',
      };
  
      const orderBy = {
        [validOrderByFields[order_by] || 'id']: order_dir,
      };
  
      try {
        const [data, size] = await Promise.all([
          this.prisma.declaration.findMany({
            where,
            orderBy,
            skip: offset,
            take: limit,
          }),
          this.prisma.declaration.count({ where }),
        ]);
  
        return {
          size,
          data,
        };
      } catch (error) {
        console.error('Error during findAll:', error);
        throw new HttpException(
          `Erreur lors de la récupération des déclarations.`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
  }
  
  // Créer une déclaration
  async create(createDeclarationDto: CreateDeclarationDto): Promise<Declaration> {
    const existingDeclaration = await this.prisma.declaration.findFirst({
      where: {
        num_ordre: {
          equals: createDeclarationDto.num_ordre,
        },
      },
    });

    if (existingDeclaration) {
      throw new HttpException(
        `Une déclaration avec le numéro d'ordre "${createDeclarationDto.num_ordre}" existe déjà.`,
        HttpStatus.CONFLICT,
      );
    }

    try {
      return await this.prisma.declaration.create({
        data: createDeclarationDto,
      });
    } catch (error) {
      console.error('Error during create:', error);
      throw new HttpException(
        `Une erreur s'est produite lors de la création de la déclaration.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Récupérer une déclaration par ID
  async findOne(id: number): Promise<Declaration> {
    const declaration = await this.prisma.declaration.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!declaration) {
      throw new HttpException(
        `Déclaration non trouvée.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return declaration;
  }

  // Mettre à jour une déclaration
  async update(id: number, updateDeclarationDto: UpdateDeclarationDto): Promise<Declaration> {
    await this.findOne(id); // Vérifie si la déclaration existe

    try {
      return await this.prisma.$transaction(async (prisma) => {
        if (updateDeclarationDto.num_ordre) {
          const conflictingDeclaration = await prisma.declaration.findFirst({
            where: {
              num_ordre: updateDeclarationDto.num_ordre,
              id: { not: id },
            },
          });

          if (conflictingDeclaration) {
            throw new HttpException(
              `Une déclaration avec ce numéro d'ordre existe déjà.`,
              HttpStatus.CONFLICT,
            );
          }
        }

        return await prisma.declaration.update({
          where: { id },
          data: updateDeclarationDto,
        });
      });
    } catch (error) {
      console.error('Error during update:', error);
      throw new HttpException(
        `Une erreur s'est produite lors de la mise à jour de la déclaration.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Supprimer une déclaration (soft delete)
  async remove(id: number): Promise<{ success: boolean }> {
    await this.findOne(id); // Vérifie si la déclaration existe
    try {
      await this.prisma.declaration.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return { success: true };
    } catch (error) {
      throw new HttpException(
        `Une erreur s'est produite lors de la suppression de la déclaration.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Restaurer une déclaration supprimée
  async restore(id: number): Promise<Declaration> {
    const declaration = await this.prisma.declaration.findUnique({
      where: { id },
    });

    if (!declaration || !declaration.deletedAt) {
      throw new HttpException(
        `Déclaration non trouvée.`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      return await this.prisma.declaration.update({
        where: { id },
        data: { deletedAt: null },
      });
    } catch (error) {
      throw new HttpException(
        `Une erreur s'est produite lors de la restauration de la déclaration.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}