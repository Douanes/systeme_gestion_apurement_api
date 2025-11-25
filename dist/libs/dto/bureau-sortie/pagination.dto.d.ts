export declare enum BureauSortieSortField {
    ID = "id",
    CODE = "code",
    NAME = "name",
    LOCALISATION = "localisation",
    PAYS_FRONTIERE = "paysFrontiere",
    IS_ACTIVE = "isActive",
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt"
}
export declare class BureauSortiePaginationQueryDto {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    paysFrontiere?: string;
    sortBy?: BureauSortieSortField;
    sortOrder?: 'asc' | 'desc';
}
