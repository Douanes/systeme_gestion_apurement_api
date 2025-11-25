export declare enum AgentSortField {
    ID = "id",
    MATRICULE = "matricule",
    GRADE = "grade",
    FIRSTNAME = "firstname",
    LASTNAME = "lastname",
    EMAIL = "email",
    PHONE = "phone",
    AFFECTED_AT = "affectedAt",
    IS_ACTIVE = "isActive",
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt"
}
export declare class AgentPaginationQueryDto {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    officeId?: number;
    grade?: string;
    sortBy?: AgentSortField;
    sortOrder?: 'asc' | 'desc';
}
