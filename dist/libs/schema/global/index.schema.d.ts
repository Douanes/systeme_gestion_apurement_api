import { AuditAction, StatutApurement, StatutOrdreMission, TypeNotification, UserRole } from "libs/enums/enum.dto";
export declare const UserRoleSchema: {
    type: string;
    enum: UserRole[];
    description: string;
    example: UserRole;
};
export declare const StatutApurementSchema: {
    type: string;
    enum: StatutApurement[];
    description: string;
    example: StatutApurement;
};
export declare const StatutOrdreMissionSchema: {
    type: string;
    enum: StatutOrdreMission[];
    description: string;
    example: StatutOrdreMission;
};
export declare const TypeNotificationSchema: {
    type: string;
    enum: TypeNotification[];
    description: string;
    example: TypeNotification;
};
export declare const AuditActionSchema: {
    type: string;
    enum: AuditAction[];
    description: string;
    example: AuditAction;
};
