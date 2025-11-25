export declare const AgentDetailSchema: {
    example: {
        id: number;
        matricule: string;
        grade: string;
        firstname: string;
        lastname: string;
        phone: string;
        email: string;
        affectedAt: string;
        officeId: number;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
        bureauAffectation: {
            id: number;
            name: string;
            code: string;
            address: string;
            phone: string;
        };
        declarations: {
            id: number;
            numeroDeclaration: string;
            dateDeclaration: string;
            typeDeclaration: string;
            statut: string;
        }[];
        escouadesAsChef: {
            id: number;
            name: string;
            description: string;
            operationalDate: string;
        }[];
        escouadesAsAdjoint: {
            id: number;
            name: string;
            description: string;
            operationalDate: string;
        }[];
        escouadeAgents: {
            escouadeId: number;
            agentId: number;
            escouade: {
                id: number;
                name: string;
                description: string;
                operationalDate: string;
            };
        }[];
        ordreMissions: {
            id: number;
            numeroOrdre: string;
            dateDebut: string;
            dateFin: string;
            lieu: string;
            objectif: string;
            statut: string;
        }[];
    };
};
