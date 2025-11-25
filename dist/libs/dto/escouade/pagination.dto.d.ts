export declare enum EscouadeSortField {
    ID = "id",
    NAME = "name",
    DESCRIPTION = "description",
    OPERATIONAL_DATE = "operationalDate",
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt"
}
export declare class EscouadePaginationQueryDto {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: EscouadeSortField;
    sortOrder?: 'asc' | 'desc';
}
