-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `role` ENUM('ADMIN', 'AGENT', 'SUPERVISEUR', 'TRANSITAIRE') NOT NULL,
    `is_active` BOOLEAN NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `last_login` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `regimes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `escouades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `operationalDate` DATETIME(3) NULL,
    `chefId` INTEGER NULL,
    `adjointId` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `agentId` INTEGER NULL,

    UNIQUE INDEX `escouades_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matricule` VARCHAR(191) NULL,
    `grade` VARCHAR(191) NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `affected_at` DATETIME(3) NULL,
    `office_id` INTEGER NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `agents_matricule_key`(`matricule`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `escouade_agents` (
    `escouadeId` INTEGER NOT NULL,
    `agentId` INTEGER NOT NULL,

    PRIMARY KEY (`escouadeId`, `agentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bureaux_sorties` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `localisation` VARCHAR(191) NULL,
    `pays_frontiere` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `bureaux_sorties_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `maisons_transits` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` TEXT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `responsable_id` INTEGER NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `maisons_transits_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ordres_missions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `number` INTEGER NOT NULL,
    `destination` VARCHAR(191) NULL,
    `itinéraire` TEXT NULL,
    `date_ordre` DATETIME(3) NULL,
    `depositaire_id` INTEGER NULL,
    `maison_transit_id` INTEGER NULL,
    `created_by` INTEGER NULL,
    `statut` ENUM('EN_COURS', 'DEPOSE', 'TRAITE', 'REJETE', 'ANNULE') NOT NULL DEFAULT 'EN_COURS',
    `statut_apurement` ENUM('APURE_SE', 'APURE', 'NON_APURE', 'REJET') NOT NULL DEFAULT 'NON_APURE',
    `agent_escorteur_id` INTEGER NULL,
    `bureau_sortie_id` INTEGER NULL,
    `observations` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `ordres_missions_number_key`(`number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `depositaires` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `phone1` VARCHAR(20) NOT NULL,
    `phone2` VARCHAR(191) NULL,
    `address` TEXT NULL,
    `email` VARCHAR(191) NULL,
    `identification_number` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `maisonTransitId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `declarations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero_declaration` VARCHAR(50) NOT NULL,
    `date_declaration` DATE NOT NULL,
    `ordre_mission_id` INTEGER NULL,
    `statut_apurement` ENUM('APURE_SE', 'APURE', 'NON_APURE', 'REJET') NULL DEFAULT 'NON_APURE',
    `date_apurement` DATE NULL,
    `motif_rejet` TEXT NULL,
    `bureauSortieId` INTEGER NULL,
    `maisonTransitId` INTEGER NULL,
    `depositaireId` INTEGER NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `agentId` INTEGER NULL,

    UNIQUE INDEX `declarations_numero_declaration_key`(`numero_declaration`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `colis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ordre_mission_id` INTEGER NULL,
    `nature_marchandise` TEXT NOT NULL,
    `position_tarifaire` INTEGER NULL,
    `poids` DECIMAL(12, 2) NULL,
    `valeur_declaree` DECIMAL(15, 2) NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transports` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ordre_mission_id` INTEGER NULL,
    `immatriculation` VARCHAR(191) NOT NULL,
    `driver_name` VARCHAR(191) NULL,
    `driver_nationality` VARCHAR(191) NULL,
    `ip_address` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `conteneurs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ordre_mission_id` INTEGER NULL,
    `num_conteneur` VARCHAR(191) NOT NULL,
    `driver_name` VARCHAR(191) NULL,
    `driver_nationality` VARCHAR(191) NULL,
    `ip_address` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `voitures` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ordre_mission_id` INTEGER NULL,
    `chassis` VARCHAR(191) NOT NULL,
    `driver_name` VARCHAR(191) NULL,
    `driver_nationality` VARCHAR(191) NULL,
    `ip_address` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `table_name` VARCHAR(100) NULL,
    `Description` VARCHAR(191) NULL,
    `action` ENUM('CREATE', 'UPDATE', 'DELETE') NOT NULL,
    `old_values` JSON NULL,
    `new_values` JSON NULL,
    `user_id` INTEGER NULL,
    `ip_address` VARCHAR(191) NULL,
    `user_agent` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `escouades` ADD CONSTRAINT `escouades_chefId_fkey` FOREIGN KEY (`chefId`) REFERENCES `agents`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `escouades` ADD CONSTRAINT `escouades_adjointId_fkey` FOREIGN KEY (`adjointId`) REFERENCES `agents`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `escouades` ADD CONSTRAINT `escouades_agentId_fkey` FOREIGN KEY (`agentId`) REFERENCES `agents`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agents` ADD CONSTRAINT `agents_office_id_fkey` FOREIGN KEY (`office_id`) REFERENCES `bureaux_sorties`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `escouade_agents` ADD CONSTRAINT `escouade_agents_escouadeId_fkey` FOREIGN KEY (`escouadeId`) REFERENCES `escouades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `escouade_agents` ADD CONSTRAINT `escouade_agents_agentId_fkey` FOREIGN KEY (`agentId`) REFERENCES `agents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maisons_transits` ADD CONSTRAINT `maisons_transits_responsable_id_fkey` FOREIGN KEY (`responsable_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ordres_missions` ADD CONSTRAINT `ordres_missions_depositaire_id_fkey` FOREIGN KEY (`depositaire_id`) REFERENCES `depositaires`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ordres_missions` ADD CONSTRAINT `ordres_missions_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ordres_missions` ADD CONSTRAINT `ordres_missions_agent_escorteur_id_fkey` FOREIGN KEY (`agent_escorteur_id`) REFERENCES `agents`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ordres_missions` ADD CONSTRAINT `ordres_missions_bureau_sortie_id_fkey` FOREIGN KEY (`bureau_sortie_id`) REFERENCES `bureaux_sorties`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ordres_missions` ADD CONSTRAINT `ordres_missions_maison_transit_id_fkey` FOREIGN KEY (`maison_transit_id`) REFERENCES `maisons_transits`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `depositaires` ADD CONSTRAINT `depositaires_maisonTransitId_fkey` FOREIGN KEY (`maisonTransitId`) REFERENCES `maisons_transits`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `declarations` ADD CONSTRAINT `declarations_ordre_mission_id_fkey` FOREIGN KEY (`ordre_mission_id`) REFERENCES `ordres_missions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `declarations` ADD CONSTRAINT `declarations_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `declarations` ADD CONSTRAINT `declarations_bureauSortieId_fkey` FOREIGN KEY (`bureauSortieId`) REFERENCES `bureaux_sorties`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `declarations` ADD CONSTRAINT `declarations_maisonTransitId_fkey` FOREIGN KEY (`maisonTransitId`) REFERENCES `maisons_transits`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `declarations` ADD CONSTRAINT `declarations_depositaireId_fkey` FOREIGN KEY (`depositaireId`) REFERENCES `depositaires`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `declarations` ADD CONSTRAINT `declarations_agentId_fkey` FOREIGN KEY (`agentId`) REFERENCES `agents`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `colis` ADD CONSTRAINT `colis_ordre_mission_id_fkey` FOREIGN KEY (`ordre_mission_id`) REFERENCES `ordres_missions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `colis` ADD CONSTRAINT `colis_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transports` ADD CONSTRAINT `transports_ordre_mission_id_fkey` FOREIGN KEY (`ordre_mission_id`) REFERENCES `ordres_missions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conteneurs` ADD CONSTRAINT `conteneurs_ordre_mission_id_fkey` FOREIGN KEY (`ordre_mission_id`) REFERENCES `ordres_missions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `voitures` ADD CONSTRAINT `voitures_ordre_mission_id_fkey` FOREIGN KEY (`ordre_mission_id`) REFERENCES `ordres_missions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_log` ADD CONSTRAINT `audit_log_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
