import { Declaration as PrismaDeclaration, EtatApurement } from '@prisma/client';

export class Declaration implements PrismaDeclaration {
  id: number;
  num_ordre: number;
  num_declaration: string;
  nbre_colis: number;
  poids: number;
  marchandise: string;
  depositaire: string;
  telephone: string;
  etatApurement: EtatApurement;
  regimeId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}