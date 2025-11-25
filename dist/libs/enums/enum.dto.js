"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditAction = exports.TypeNotification = exports.StatutOrdreMission = exports.StatutApurement = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["AGENT"] = "AGENT";
    UserRole["SUPERVISEUR"] = "SUPERVISEUR";
    UserRole["TRANSITAIRE"] = "TRANSITAIRE";
})(UserRole || (exports.UserRole = UserRole = {}));
var StatutApurement;
(function (StatutApurement) {
    StatutApurement["APURE_SE"] = "APURE_SE";
    StatutApurement["APURE"] = "APURE";
    StatutApurement["NON_APURE"] = "NON_APURE";
    StatutApurement["REJET"] = "REJET";
})(StatutApurement || (exports.StatutApurement = StatutApurement = {}));
var StatutOrdreMission;
(function (StatutOrdreMission) {
    StatutOrdreMission["EN_COURS"] = "EN_COURS";
    StatutOrdreMission["DEPOSE"] = "DEPOSE";
    StatutOrdreMission["TRAITE"] = "TRAITE";
    StatutOrdreMission["REJETE"] = "REJETE";
    StatutOrdreMission["ANNULE"] = "ANNULE";
})(StatutOrdreMission || (exports.StatutOrdreMission = StatutOrdreMission = {}));
var TypeNotification;
(function (TypeNotification) {
    TypeNotification["INFO"] = "INFO";
    TypeNotification["WARNING"] = "WARNING";
    TypeNotification["ERROR"] = "ERROR";
    TypeNotification["SUCCESS"] = "SUCCESS";
})(TypeNotification || (exports.TypeNotification = TypeNotification = {}));
var AuditAction;
(function (AuditAction) {
    AuditAction["CREATE"] = "CREATE";
    AuditAction["UPDATE"] = "UPDATE";
    AuditAction["DELETE"] = "DELETE";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
//# sourceMappingURL=enum.dto.js.map