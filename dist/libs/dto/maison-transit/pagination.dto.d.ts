export declare enum MaisonTransitSortField {
    ID = "id",
    CODE = "code",
    NAME = "name",
    ADDRESS = "address",
    PHONE = "phone",
    EMAIL = "email",
    IS_ACTIVE = "isActive",
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt"
}
export declare class MaisonTransitPaginationQueryDto {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    sortBy?: MaisonTransitSortField;
    sortOrder?: 'asc' | 'desc';
}
