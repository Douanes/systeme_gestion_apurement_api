import { AuditAction, StatutApurement, StatutOrdreMission, TypeNotification, UserRole } from "libs/enums/enum.dto";

// Export schema objects for Swagger
export const UserRoleSchema = {
    type: 'string',
    enum: Object.values(UserRole),
    description: 'Rôle de l\'utilisateur dans le système',
    example: UserRole.AGENT,
};

export const StatutApurementSchema = {
    type: 'string',
    enum: Object.values(StatutApurement),
    description: 'Statut d\'apurement de la déclaration ou de l\'ordre de mission',
    example: StatutApurement.NON_APURE,
};

export const StatutOrdreMissionSchema = {
    type: 'string',
    enum: Object.values(StatutOrdreMission),
    description: 'Statut de l\'ordre de mission',
    example: StatutOrdreMission.EN_COURS,
};

export const TypeNotificationSchema = {
    type: 'string',
    enum: Object.values(TypeNotification),
    description: 'Type de notification',
    example: TypeNotification.INFO,
};

export const AuditActionSchema = {
    type: 'string',
    enum: Object.values(AuditAction),
    description: 'Type d\'action d\'audit',
    example: AuditAction.CREATE,
};