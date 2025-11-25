export declare class CreateRegimeDto {
    name: string;
    description?: string;
}
declare const UpdateRegimeDto_base: import("@nestjs/common").Type<Partial<CreateRegimeDto>>;
export declare class UpdateRegimeDto extends UpdateRegimeDto_base {
}
export declare class RegimeResponseDto {
    id: number;
    name: string;
    description?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export {};
