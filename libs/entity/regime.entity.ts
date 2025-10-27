import { Regime as PrismaRegime } from '@prisma/client';

export class Regime implements PrismaRegime {
  id: number;
  libelle: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
