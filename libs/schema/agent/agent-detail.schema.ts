export const AgentDetailSchema = {
  example: {
    id: 1,
    matricule: 'AG-2024-001',
    grade: 'Inspecteur Principal',
    firstname: 'Jean',
    lastname: 'Dupont',
    phone: '+221771234567',
    email: 'jean.dupont@douanes.sn',
    affectedAt: '2024-01-15T00:00:00.000Z',
    officeId: 1,
    isActive: true,
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z',
    bureauAffectation: {
      id: 1,
      name: 'Bureau des Douanes de Dakar',
      code: 'BDD-001',
      address: 'Avenue Malick Sy, Dakar',
      phone: '+221771111111',
    },
    declarations: [
      {
        id: 1,
        numeroDeclaration: 'DECL-2024-001',
        dateDeclaration: '2024-01-15T00:00:00.000Z',
        typeDeclaration: 'Import',
        statut: 'Validée',
      },
      {
        id: 2,
        numeroDeclaration: 'DECL-2024-002',
        dateDeclaration: '2024-01-16T00:00:00.000Z',
        typeDeclaration: 'Export',
        statut: 'En cours',
      },
    ],
    escouadesAsChef: [
      {
        id: 1,
        name: 'Escouade Alpha',
        description: 'Escouade spécialisée dans les contrôles frontaliers',
        operationalDate: '2024-01-15T00:00:00.000Z',
      },
    ],
    escouadesAsAdjoint: [
      {
        id: 3,
        name: 'Escouade Gamma',
        description: 'Escouade de contrôle aérien',
        operationalDate: '2024-01-20T00:00:00.000Z',
      },
    ],
    escouadeAgents: [
      {
        escouadeId: 4,
        agentId: 1,
        escouade: {
          id: 4,
          name: 'Escouade Delta',
          description: 'Escouade d\'intervention rapide',
          operationalDate: '2024-03-01T00:00:00.000Z',
        },
      },
    ],
    ordreMissions: [
      {
        id: 1,
        numeroOrdre: 'OM-2024-001',
        dateDebut: '2024-01-15T00:00:00.000Z',
        dateFin: '2024-01-20T00:00:00.000Z',
        lieu: 'Port de Dakar',
        objectif: 'Contrôle des marchandises',
        statut: 'En cours',
      },
    ],
  }
};