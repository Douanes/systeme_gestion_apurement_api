export declare enum StatutOrdreMission {
    EN_COURS = "EN_COURS",
    TERMINE = "TERMINE",
    ANNULE = "ANNULE"
}
export declare enum StatutApurement {
    NON_APURE = "NON_APURE",
    APURE_SE = "APURE_SE",
    REJET = "REJET"
}
export declare class CreateNestedDeclarationDto {
    numeroDeclaration: string;
    dateDeclaration: string;
    depositaireId?: number;
    maisonTransitId?: number;
    bureauSortieId?: number;
}
export declare class CreateNestedColisDto {
    natureMarchandise: string;
    positionTarifaire?: number;
    poids?: number;
    valeurDeclaree?: number;
}
export declare class CreateNestedConteneurDto {
    numConteneur: string;
    driverName?: string;
    driverNationality?: string;
    phone?: string;
}
export declare class CreateNestedCamionDto {
    immatriculation: string;
    driverName?: string;
    driverNationality?: string;
    phone?: string;
}
export declare class CreateNestedVoitureDto {
    chassis: string;
    driverName?: string;
    driverNationality?: string;
    phone?: string;
}
export declare class CreateOrdreMissionDto {
    number: number;
    destination?: string;
    itinéraire?: string;
    dateOrdre?: string;
    depositaireId?: number;
    maisonTransitId?: number;
    statut?: StatutOrdreMission;
    statutApurement?: StatutApurement;
    agentEscorteurId?: number;
    bureauSortieId?: number;
    observations?: string;
    declarations?: CreateNestedDeclarationDto[];
    colis?: CreateNestedColisDto[];
    conteneurs?: CreateNestedConteneurDto[];
    camions?: CreateNestedCamionDto[];
    voitures?: CreateNestedVoitureDto[];
}
declare const UpdateOrdreMissionDto_base: import("@nestjs/common").Type<Partial<CreateOrdreMissionDto>>;
export declare class UpdateOrdreMissionDto extends UpdateOrdreMissionDto_base {
}
export declare class OrdreMissionResponseDto {
    id: number;
    number: number;
    destination?: string | null;
    itinéraire?: string | null;
    dateOrdre?: Date | null;
    depositaireId?: number | null;
    maisonTransitId?: number | null;
    createdById?: number | null;
    statut: StatutOrdreMission;
    statutApurement: StatutApurement;
    agentEscorteurId?: number | null;
    bureauSortieId?: number | null;
    observations?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare class OrdreMissionWithRelationsDto extends OrdreMissionResponseDto {
    depositaire?: {
        id: number;
        name: string;
        phone1: string;
    } | null;
    maisonTransit?: {
        id: number;
        name: string;
        code: string;
    } | null;
    createdBy?: {
        id: number;
        username: string;
        email: string;
    } | null;
    agentEscorteur?: {
        id: number;
        matricule?: string | null;
        firstname: string;
        lastname: string;
    } | null;
    bureauSortie?: {
        id: number;
        name: string;
        code: string;
    } | null;
    declarations?: Array<{
        id: number;
        numeroDeclaration: string;
        dateDeclaration: Date;
        statutApurement?: string | null;
    }>;
    colis?: Array<{
        id: number;
        natureMarchandise: string;
        poids?: number | null;
        valeurDeclaree?: number | null;
    }>;
    conteneurs?: Array<{
        id: number;
        numConteneur: string;
        driverName?: string | null;
    }>;
    camions?: Array<{
        id: number;
        immatriculation: string;
        driverName?: string | null;
    }>;
    voitures?: Array<{
        id: number;
        chassis: string;
        driverName?: string | null;
    }>;
}
export {};
