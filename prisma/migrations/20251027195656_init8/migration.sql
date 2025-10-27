-- CreateTable
CREATE TABLE `maison_transits` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `regimes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bureaux_sortie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `ville` VARCHAR(191) NOT NULL,
    `region` VARCHAR(191) NOT NULL,
    `statut` ENUM('actif', 'inactif') NOT NULL DEFAULT 'actif',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `bureaux_sortie_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NOT NULL,
    `matricule` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NOT NULL,
    `grade` VARCHAR(191) NOT NULL,
    `dateAffectation` VARCHAR(191) NOT NULL,
    `statut` ENUM('actif', 'inactif') NOT NULL DEFAULT 'actif',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

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
CREATE TABLE `escouades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `statut` ENUM('actif', 'inactif') NOT NULL DEFAULT 'inactif',
    `dateCreation` VARCHAR(191) NOT NULL,
    `chefId` INTEGER NULL,
    `adjointId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `escouades_nom_key`(`nom`),
    UNIQUE INDEX `escouades_chefId_key`(`chefId`),
    UNIQUE INDEX `escouades_adjointId_key`(`adjointId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `declarations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `num_ordre` INTEGER NOT NULL,
    `num_declaration` VARCHAR(191) NOT NULL,
    `nbre_colis` INTEGER NOT NULL,
    `poids` DOUBLE NOT NULL,
    `marchandise` VARCHAR(191) NOT NULL,
    `depositaire` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NOT NULL,
    `etatApurement` ENUM('apure', 'apure_se', 'non_apure', 'rejetter') NOT NULL DEFAULT 'non_apure',
    `regimeId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `declarations_num_ordre_key`(`num_ordre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ordres_mission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numeroOrdre` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `poidsTotal` DOUBLE NOT NULL,
    `nombreColisTotal` INTEGER NOT NULL,
    `naturesMarchandises` TEXT NOT NULL,
    `depositaire` VARCHAR(191) NOT NULL,
    `telephone_dep` VARCHAR(191) NOT NULL,
    `etatApurement` ENUM('apure', 'apure_se', 'non_apure', 'rejetter') NOT NULL DEFAULT 'non_apure',
    `bureauSortieId` INTEGER NOT NULL,
    `escouadeId` INTEGER NOT NULL,
    `maisonId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `ordres_mission_numeroOrdre_key`(`numeroOrdre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_EscouadeAgents` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_EscouadeAgents_AB_unique`(`A`, `B`),
    INDEX `_EscouadeAgents_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DeclarationToOrdreMission` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DeclarationToOrdreMission_AB_unique`(`A`, `B`),
    INDEX `_DeclarationToOrdreMission_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `escouade_agents` ADD CONSTRAINT `escouade_agents_escouadeId_fkey` FOREIGN KEY (`escouadeId`) REFERENCES `escouades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `escouade_agents` ADD CONSTRAINT `escouade_agents_agentId_fkey` FOREIGN KEY (`agentId`) REFERENCES `agents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `escouades` ADD CONSTRAINT `escouades_chefId_fkey` FOREIGN KEY (`chefId`) REFERENCES `agents`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `escouades` ADD CONSTRAINT `escouades_adjointId_fkey` FOREIGN KEY (`adjointId`) REFERENCES `agents`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `declarations` ADD CONSTRAINT `declarations_regimeId_fkey` FOREIGN KEY (`regimeId`) REFERENCES `regimes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ordres_mission` ADD CONSTRAINT `ordres_mission_bureauSortieId_fkey` FOREIGN KEY (`bureauSortieId`) REFERENCES `bureaux_sortie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ordres_mission` ADD CONSTRAINT `ordres_mission_escouadeId_fkey` FOREIGN KEY (`escouadeId`) REFERENCES `escouades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ordres_mission` ADD CONSTRAINT `ordres_mission_maisonId_fkey` FOREIGN KEY (`maisonId`) REFERENCES `maison_transits`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EscouadeAgents` ADD CONSTRAINT `_EscouadeAgents_A_fkey` FOREIGN KEY (`A`) REFERENCES `agents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EscouadeAgents` ADD CONSTRAINT `_EscouadeAgents_B_fkey` FOREIGN KEY (`B`) REFERENCES `escouades`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DeclarationToOrdreMission` ADD CONSTRAINT `_DeclarationToOrdreMission_A_fkey` FOREIGN KEY (`A`) REFERENCES `declarations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DeclarationToOrdreMission` ADD CONSTRAINT `_DeclarationToOrdreMission_B_fkey` FOREIGN KEY (`B`) REFERENCES `ordres_mission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
