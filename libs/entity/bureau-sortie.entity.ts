import { BureauSortie as PrismaBureauSortie, Statut } from '@prisma/client';

export class BureauSortie implements PrismaBureauSortie {
  id: number;
  nom: string;
  code: string;
  ville: string;
  region: string;
  statut: Statut;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
