import { Escouade as PrismaEscouade, Statut } from '@prisma/client';

export class Escouade implements PrismaEscouade {
  id: number;
  nom: string;
  description: string;
  statut: Statut;
  dateCreation: string;
  chefId: number | null;
  adjointId: number | null;
  agents: number[] | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
