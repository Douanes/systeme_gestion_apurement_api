
/**
 * Rôles d'utilisateur du système
 */
export enum UserRole {
    /** Administrateur système */
    ADMIN = 'ADMIN',
    /** Agent des douanes */
    AGENT = 'AGENT',
    /** Superviseur */
    SUPERVISEUR = 'SUPERVISEUR',
    /** Transitaire */
    TRANSITAIRE = 'TRANSITAIRE',
}

/**
 * Statut d'apurement des déclarations et ordres de mission
 */
export enum StatutApurement {
    /** En cours d'apurement */
    APURE_SE = 'APURE_SE',
    /** Apuré */
    APURE = 'APURE',
    /** Non apuré */
    NON_APURE = 'NON_APURE',
    /** Rejeté */
    REJET = 'REJET',
}

/**
 * Statut d'un ordre de mission
 */
export enum StatutOrdreMission {
    /** En cours de traitement */
    EN_COURS = 'EN_COURS',
    /** Déposé au bureau de sortie */
    DEPOSE = 'DEPOSE',
    /** Traité et validé */
    TRAITE = 'TRAITE',
    /** Rejeté */
    REJETE = 'REJETE',
    /** Annulé */
    ANNULE = 'ANNULE',
}

/**
 * Type de notification
 */
export enum TypeNotification {
    /** Information */
    INFO = 'INFO',
    /** Avertissement */
    WARNING = 'WARNING',
    /** Erreur */
    ERROR = 'ERROR',
    /** Succès */
    SUCCESS = 'SUCCESS',
}

/**
 * Actions d'audit du système
 */
export enum AuditAction {
    /** Création d'entité */
    CREATE = 'CREATE',
    /** Mise à jour d'entité */
    UPDATE = 'UPDATE',
    /** Suppression d'entité */
    DELETE = 'DELETE',
}
