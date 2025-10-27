import { OrdreMission as PrismaOrdreMission, EtatApurement } from '@prisma/client';

export class OrdreMission implements PrismaOrdreMission {
  id: number;
  numeroOrdre: string;
  date: string;
  poidsTotal: number;
  nombreColisTotal: number;
  naturesMarchandises: string;
  depositaire: string;
  telephone_dep: string;
  etatApurement: EtatApurement;
  bureauSortieId: number;
  escouadeId: number;
  maisonId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
