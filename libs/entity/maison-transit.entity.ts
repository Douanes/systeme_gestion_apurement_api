import { MaisonTransit as PrismaMaisonTransit } from '@prisma/client';

export class MaisonTransit implements PrismaMaisonTransit {
  id: number;
  nom: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
