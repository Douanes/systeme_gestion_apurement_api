export declare enum OrdreMissionSortField {
    ID = "id",
    NUMERO_ORDRE = "numeroOrdre",
    DATE_DEBUT = "dateDebut",
    DATE_FIN = "dateFin",
    LIEU = "lieu",
    STATUT = "statut",
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt"
}
export declare class OrdreMissionPaginationQueryDto {
    page?: number;
    limit?: number;
    search?: string;
    statut?: string;
    agentId?: number;
    escouadeId?: number;
    dateDebutMin?: string;
    dateDebutMax?: string;
    sortBy?: OrdreMissionSortField;
    sortOrder?: 'asc' | 'desc';
}
