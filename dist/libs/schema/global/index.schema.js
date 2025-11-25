"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditActionSchema = exports.TypeNotificationSchema = exports.StatutOrdreMissionSchema = exports.StatutApurementSchema = exports.UserRoleSchema = void 0;
const enum_dto_1 = require("../../enums/enum.dto");
exports.UserRoleSchema = {
    type: 'string',
    enum: Object.values(enum_dto_1.UserRole),
    description: 'Rôle de l\'utilisateur dans le système',
    example: enum_dto_1.UserRole.AGENT,
};
exports.StatutApurementSchema = {
    type: 'string',
    enum: Object.values(enum_dto_1.StatutApurement),
    description: 'Statut d\'apurement de la déclaration ou de l\'ordre de mission',
    example: enum_dto_1.StatutApurement.NON_APURE,
};
exports.StatutOrdreMissionSchema = {
    type: 'string',
    enum: Object.values(enum_dto_1.StatutOrdreMission),
    description: 'Statut de l\'ordre de mission',
    example: enum_dto_1.StatutOrdreMission.EN_COURS,
};
exports.TypeNotificationSchema = {
    type: 'string',
    enum: Object.values(enum_dto_1.TypeNotification),
    description: 'Type de notification',
    example: enum_dto_1.TypeNotification.INFO,
};
exports.AuditActionSchema = {
    type: 'string',
    enum: Object.values(enum_dto_1.AuditAction),
    description: 'Type d\'action d\'audit',
    example: enum_dto_1.AuditAction.CREATE,
};
//# sourceMappingURL=index.schema.js.map