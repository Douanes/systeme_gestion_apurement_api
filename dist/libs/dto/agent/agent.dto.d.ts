export declare class CreateAgentDto {
    matricule?: string;
    grade?: string;
    firstname: string;
    lastname: string;
    phone?: string;
    email?: string;
    affectedAt?: string;
    officeId?: number;
    isActive?: boolean;
}
declare const UpdateAgentDto_base: import("@nestjs/common").Type<Partial<CreateAgentDto>>;
export declare class UpdateAgentDto extends UpdateAgentDto_base {
}
export declare class AgentResponseDto {
    id: number;
    matricule?: string | null;
    grade?: string | null;
    firstname: string;
    lastname: string;
    phone?: string | null;
    email?: string | null;
    affectedAt?: Date | null;
    officeId?: number | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class AgentWithRelationsDto extends AgentResponseDto {
    bureauAffectation?: {
        id: number;
        name: string;
        code: string;
        address?: string;
        phone?: string;
    } | null;
    declarations?: Array<{
        id: number;
        numeroDeclaration: string;
        dateDeclaration: Date;
        typeDeclaration?: string;
        statut?: string;
    }>;
    escouadesAsChef?: Array<{
        id: number;
        name: string;
        description?: string;
        operationalDate?: Date;
    }>;
    escouadesAsAdjoint?: Array<{
        id: number;
        name: string;
        description?: string;
        operationalDate?: Date;
    }>;
    escouadeAgents?: Array<{
        escouadeId: number;
        agentId: number;
        escouade: {
            id: number;
            name: string;
            description?: string;
            operationalDate?: Date;
        };
    }>;
    ordreMissions?: Array<{
        id: number;
        numeroOrdre: string;
        dateDebut: Date;
        dateFin: Date;
        lieu?: string;
        objectif?: string;
        statut?: string;
    }>;
}
export {};
