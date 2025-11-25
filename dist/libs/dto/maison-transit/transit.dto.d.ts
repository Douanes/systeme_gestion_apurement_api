export declare class CreateMaisonTransitDto {
    code: string;
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    responsableId?: number;
    isActive?: boolean;
}
declare const UpdateMaisonTransitDto_base: import("@nestjs/common").Type<Partial<CreateMaisonTransitDto>>;
export declare class UpdateMaisonTransitDto extends UpdateMaisonTransitDto_base {
}
export declare class MaisonTransitResponseDto {
    id: number;
    code: string;
    name: string;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    responsableId?: number | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class MaisonTransitWithRelationsDto extends MaisonTransitResponseDto {
    responsable?: any;
    depositaires?: any[];
    declarations?: any[];
}
export {};
