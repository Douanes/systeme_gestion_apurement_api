export declare class CreateBureauSortieDto {
    code: string;
    name: string;
    localisation?: string;
    paysFrontiere?: string;
    isActive?: boolean;
}
declare const UpdateBureauSortieDto_base: import("@nestjs/common").Type<Partial<CreateBureauSortieDto>>;
export declare class UpdateBureauSortieDto extends UpdateBureauSortieDto_base {
}
export declare class BureauSortieResponseDto {
    id: number;
    code: string;
    name: string;
    localisation?: string | null;
    paysFrontiere?: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class BureauSortieWithRelationsDto extends BureauSortieResponseDto {
    declarations?: any[];
    agents?: any[];
    ordreMissions?: any[];
}
export {};
