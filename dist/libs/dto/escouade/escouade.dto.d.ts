export declare class CreateEscouadeDto {
    name: string;
    description?: string;
    operationalDate?: string;
    chefId?: number;
    adjointId?: number;
}
declare const UpdateEscouadeDto_base: import("@nestjs/common").Type<Partial<CreateEscouadeDto>>;
export declare class UpdateEscouadeDto extends UpdateEscouadeDto_base {
}
export declare class EscouadeResponseDto {
    id: number;
    name: string;
    description?: string | null;
    operationalDate?: Date | null;
    chefId?: number | null;
    adjointId?: number | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare class EscouadeWithRelationsDto extends EscouadeResponseDto {
    chef?: any;
    adjoint?: any;
    escouadeAgents?: any[];
}
export declare class AddAgentToEscouadeDto {
    agentId: number;
}
export declare class RemoveAgentFromEscouadeDto {
    agentId: number;
}
export {};
