import { Agent as PrismaAgent, Statut } from '@prisma/client';

export class Agent implements PrismaAgent {
  id: number;
  nom: string;
  prenom: string;
  matricule: string;
  telephone: string;
  grade: string;
  dateAffectation: string;
  statut: Statut;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
