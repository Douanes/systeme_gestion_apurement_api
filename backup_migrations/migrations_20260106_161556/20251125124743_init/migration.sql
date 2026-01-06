-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'AGENT', 'SUPERVISEUR', 'TRANSITAIRE');

-- CreateEnum
CREATE TYPE "StatutApurement" AS ENUM ('APURE_SE', 'APURE', 'NON_APURE', 'REJET');

-- CreateEnum
CREATE TYPE "StatutOrdreMission" AS ENUM ('EN_COURS', 'DEPOSE', 'TRAITE', 'REJETE', 'ANNULE');

-- CreateEnum
CREATE TYPE "TypeNotification" AS ENUM ('INFO', 'WARNING', 'ERROR', 'SUCCESS');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT,
    "role" "UserRole" NOT NULL,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regimes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "regimes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escouades" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "operationalDate" TIMESTAMP(3),
    "chefId" INTEGER,
    "adjointId" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "agentId" INTEGER,

    CONSTRAINT "escouades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agents" (
    "id" SERIAL NOT NULL,
    "matricule" TEXT,
    "grade" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "affected_at" TIMESTAMP(3),
    "office_id" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escouade_agents" (
    "escouadeId" INTEGER NOT NULL,
    "agentId" INTEGER NOT NULL,

    CONSTRAINT "escouade_agents_pkey" PRIMARY KEY ("escouadeId","agentId")
);

-- CreateTable
CREATE TABLE "bureaux_sorties" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "localisation" TEXT,
    "pays_frontiere" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "bureaux_sorties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maisons_transits" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "responsable_id" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "maisons_transits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ordres_missions" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "destination" TEXT,
    "itinéraire" TEXT,
    "date_ordre" TIMESTAMP(3),
    "depositaire_id" INTEGER,
    "maison_transit_id" INTEGER,
    "created_by" INTEGER,
    "statut" "StatutOrdreMission" NOT NULL DEFAULT 'EN_COURS',
    "statut_apurement" "StatutApurement" NOT NULL DEFAULT 'NON_APURE',
    "agent_escorteur_id" INTEGER,
    "bureau_sortie_id" INTEGER,
    "observations" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ordres_missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "depositaires" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone1" VARCHAR(20) NOT NULL,
    "phone2" TEXT,
    "address" TEXT,
    "email" TEXT,
    "identification_number" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "maisonTransitId" INTEGER,

    CONSTRAINT "depositaires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "declarations" (
    "id" SERIAL NOT NULL,
    "numero_declaration" VARCHAR(50) NOT NULL,
    "date_declaration" DATE NOT NULL,
    "ordre_mission_id" INTEGER,
    "statut_apurement" "StatutApurement" DEFAULT 'NON_APURE',
    "date_apurement" DATE,
    "motif_rejet" TEXT,
    "bureauSortieId" INTEGER,
    "maisonTransitId" INTEGER,
    "depositaireId" INTEGER,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "agentId" INTEGER,

    CONSTRAINT "declarations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "colis" (
    "id" SERIAL NOT NULL,
    "ordre_mission_id" INTEGER,
    "nature_marchandise" TEXT NOT NULL,
    "position_tarifaire" INTEGER,
    "poids" DECIMAL(12,2),
    "valeur_declaree" DECIMAL(15,2),
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "colis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transports" (
    "id" SERIAL NOT NULL,
    "ordre_mission_id" INTEGER,
    "immatriculation" TEXT NOT NULL,
    "driver_name" TEXT,
    "driver_nationality" TEXT,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "transports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conteneurs" (
    "id" SERIAL NOT NULL,
    "ordre_mission_id" INTEGER,
    "num_conteneur" TEXT NOT NULL,
    "driver_name" TEXT,
    "driver_nationality" TEXT,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "conteneurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voitures" (
    "id" SERIAL NOT NULL,
    "ordre_mission_id" INTEGER,
    "chassis" TEXT NOT NULL,
    "driver_name" TEXT,
    "driver_nationality" TEXT,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "voitures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" SERIAL NOT NULL,
    "table_name" VARCHAR(100),
    "Description" TEXT,
    "action" "AuditAction" NOT NULL,
    "old_values" JSONB,
    "new_values" JSONB,
    "user_id" INTEGER,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "escouades_name_key" ON "escouades"("name");

-- CreateIndex
CREATE UNIQUE INDEX "agents_matricule_key" ON "agents"("matricule");

-- CreateIndex
CREATE UNIQUE INDEX "bureaux_sorties_code_key" ON "bureaux_sorties"("code");

-- CreateIndex
CREATE UNIQUE INDEX "maisons_transits_code_key" ON "maisons_transits"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ordres_missions_number_key" ON "ordres_missions"("number");

-- CreateIndex
CREATE UNIQUE INDEX "declarations_numero_declaration_key" ON "declarations"("numero_declaration");

-- AddForeignKey
ALTER TABLE "escouades" ADD CONSTRAINT "escouades_chefId_fkey" FOREIGN KEY ("chefId") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escouades" ADD CONSTRAINT "escouades_adjointId_fkey" FOREIGN KEY ("adjointId") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escouades" ADD CONSTRAINT "escouades_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_office_id_fkey" FOREIGN KEY ("office_id") REFERENCES "bureaux_sorties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escouade_agents" ADD CONSTRAINT "escouade_agents_escouadeId_fkey" FOREIGN KEY ("escouadeId") REFERENCES "escouades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escouade_agents" ADD CONSTRAINT "escouade_agents_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maisons_transits" ADD CONSTRAINT "maisons_transits_responsable_id_fkey" FOREIGN KEY ("responsable_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordres_missions" ADD CONSTRAINT "ordres_missions_depositaire_id_fkey" FOREIGN KEY ("depositaire_id") REFERENCES "depositaires"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordres_missions" ADD CONSTRAINT "ordres_missions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordres_missions" ADD CONSTRAINT "ordres_missions_agent_escorteur_id_fkey" FOREIGN KEY ("agent_escorteur_id") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordres_missions" ADD CONSTRAINT "ordres_missions_bureau_sortie_id_fkey" FOREIGN KEY ("bureau_sortie_id") REFERENCES "bureaux_sorties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordres_missions" ADD CONSTRAINT "ordres_missions_maison_transit_id_fkey" FOREIGN KEY ("maison_transit_id") REFERENCES "maisons_transits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "depositaires" ADD CONSTRAINT "depositaires_maisonTransitId_fkey" FOREIGN KEY ("maisonTransitId") REFERENCES "maisons_transits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "declarations" ADD CONSTRAINT "declarations_ordre_mission_id_fkey" FOREIGN KEY ("ordre_mission_id") REFERENCES "ordres_missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "declarations" ADD CONSTRAINT "declarations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "declarations" ADD CONSTRAINT "declarations_bureauSortieId_fkey" FOREIGN KEY ("bureauSortieId") REFERENCES "bureaux_sorties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "declarations" ADD CONSTRAINT "declarations_maisonTransitId_fkey" FOREIGN KEY ("maisonTransitId") REFERENCES "maisons_transits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "declarations" ADD CONSTRAINT "declarations_depositaireId_fkey" FOREIGN KEY ("depositaireId") REFERENCES "depositaires"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "declarations" ADD CONSTRAINT "declarations_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colis" ADD CONSTRAINT "colis_ordre_mission_id_fkey" FOREIGN KEY ("ordre_mission_id") REFERENCES "ordres_missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colis" ADD CONSTRAINT "colis_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transports" ADD CONSTRAINT "transports_ordre_mission_id_fkey" FOREIGN KEY ("ordre_mission_id") REFERENCES "ordres_missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conteneurs" ADD CONSTRAINT "conteneurs_ordre_mission_id_fkey" FOREIGN KEY ("ordre_mission_id") REFERENCES "ordres_missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voitures" ADD CONSTRAINT "voitures_ordre_mission_id_fkey" FOREIGN KEY ("ordre_mission_id") REFERENCES "ordres_missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
