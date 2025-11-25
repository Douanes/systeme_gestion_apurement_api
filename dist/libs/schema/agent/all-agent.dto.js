"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllAgentSchema = void 0;
exports.AllAgentSchema = {
    example: {
        data: [
            {
                id: 1,
                matricule: 'AG-2024-001',
                grade: 'Inspecteur Principal',
                firstname: 'Jean',
                lastname: 'Dupont',
                phone: '+221771234567',
                email: 'jean.dupont@douanes.sn',
                affectedAt: '2024-01-15T00:00:00.000Z',
                officeId: 1,
                isActive: true,
                createdAt: '2024-01-15T10:30:00.000Z',
                updatedAt: '2024-01-15T10:30:00.000Z',
            },
            {
                id: 2,
                matricule: 'AG-2024-002',
                grade: 'Inspecteur',
                firstname: 'Marie',
                lastname: 'Diop',
                phone: '+221772345678',
                email: 'marie.diop@douanes.sn',
                affectedAt: '2024-01-20T00:00:00.000Z',
                officeId: 1,
                isActive: true,
                createdAt: '2024-01-20T10:30:00.000Z',
                updatedAt: '2024-01-20T10:30:00.000Z',
            },
        ],
        meta: {
            page: 1,
            limit: 10,
            total: 100,
            totalPages: 10,
            hasNext: true,
            hasPrevious: false,
        },
    },
};
//# sourceMappingURL=all-agent.dto.js.map