export declare const AllAgentSchema: {
    example: {
        data: {
            id: number;
            matricule: string;
            grade: string;
            firstname: string;
            lastname: string;
            phone: string;
            email: string;
            affectedAt: string;
            officeId: number;
            isActive: boolean;
            createdAt: string;
            updatedAt: string;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrevious: boolean;
        };
    };
};
