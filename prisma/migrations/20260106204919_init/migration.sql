-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'AGENT', 'SUPERVISEUR', 'TRANSITAIRE', 'DECLARANT');

-- CreateEnum
CREATE TYPE "StatutApurement" AS ENUM ('APURE_SE', 'APURE', 'NON_APURE', 'REJET');

-- CreateEnum
CREATE TYPE "StatutOrdreMission" AS ENUM ('EN_COURS', 'DEPOSE', 'TRAITE', 'COTATION', 'REJETE', 'ANNULE');

-- CreateEnum
CREATE TYPE "TypeNotification" AS ENUM ('INFO', 'WARNING', 'ERROR', 'SUCCESS');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('EN_ATTENTE', 'EN_REVISION', 'APPROUVE', 'REJETE', 'EXPIRE', 'ANNULE');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('REGISTRE_COMMERCE', 'NINEA', 'CARTE_PROFESSIONNELLE', 'AUTRE');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT,
    "role" "UserRole" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verified_at" TIMESTAMP(3),
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
    "user_id" INTEGER,
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
    "number" VARCHAR(50) NOT NULL,
    "destination" TEXT,
    "itineraire" TEXT,
    "date_ordre" TIMESTAMP(3),
    "depositaire_id" INTEGER,
    "maison_transit_id" INTEGER,
    "created_by" INTEGER,
    "statut" "StatutOrdreMission" NOT NULL DEFAULT 'EN_COURS',
    "statut_apurement" "StatutApurement" NOT NULL DEFAULT 'NON_APURE',
    "escouade_id" INTEGER,
    "agent_escorteur_id" INTEGER,
    "bureau_sortie_id" INTEGER,
    "observations" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ordres_missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ordre_mission_declarations" (
    "id" SERIAL NOT NULL,
    "ordre_mission_id" INTEGER NOT NULL,
    "declaration_id" INTEGER NOT NULL,
    "nbre_colis_parcelle" INTEGER NOT NULL,
    "poids_parcelle" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ordre_mission_declarations_pkey" PRIMARY KEY ("id")
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
    "nbre_colis_total" INTEGER NOT NULL,
    "poids_total" DECIMAL(12,2) NOT NULL,
    "nbre_colis_restant" INTEGER NOT NULL DEFAULT 0,
    "poids_restant" DECIMAL(12,2) NOT NULL DEFAULT 0,
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
    "declaration_id" INTEGER,
    "nature_marchandise" TEXT NOT NULL,
    "position_tarifaire" INTEGER,
    "nbre_colis" INTEGER,
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

-- CreateTable
CREATE TABLE "email_verifications" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified_at" TIMESTAMP(3),

    CONSTRAINT "email_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_maison_transit" (
    "userId" INTEGER NOT NULL,
    "maisonTransitId" INTEGER NOT NULL,
    "role" VARCHAR(50),
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_by" INTEGER,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_maison_transit_pkey" PRIMARY KEY ("userId","maisonTransitId")
);

-- CreateTable
CREATE TABLE "account_activation_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "email" VARCHAR(255) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "used_at" TIMESTAMP(3),
    "maison_transit_id" INTEGER,
    "invited_by" INTEGER,
    "staff_role" VARCHAR(50),

    CONSTRAINT "account_activation_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "used_at" TIMESTAMP(3),

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "resource" VARCHAR(50) NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" SERIAL NOT NULL,
    "role" "UserRole" NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "granted" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_permissions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "granted_by" INTEGER,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maison_transit_requests" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "company_name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "address" TEXT,
    "ninea" VARCHAR(100),
    "registre_commerce" VARCHAR(100),
    "status" "RequestStatus" NOT NULL DEFAULT 'EN_ATTENTE',
    "invitation_token" VARCHAR(255) NOT NULL,
    "token_expires_at" TIMESTAMP(3) NOT NULL,
    "invited_by" INTEGER NOT NULL,
    "reviewed_by" INTEGER,
    "reviewed_at" TIMESTAMP(3),
    "rejection_reason" TEXT,
    "activated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "maison_transit_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_documents" (
    "id" SERIAL NOT NULL,
    "request_id" INTEGER NOT NULL,
    "type" "DocumentType" NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,
    "mime_type" VARCHAR(100),
    "cloudinary_id" VARCHAR(255),
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "request_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "escouades_name_key" ON "escouades"("name");

-- CreateIndex
CREATE UNIQUE INDEX "agents_user_id_key" ON "agents"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "agents_matricule_key" ON "agents"("matricule");

-- CreateIndex
CREATE UNIQUE INDEX "bureaux_sorties_code_key" ON "bureaux_sorties"("code");

-- CreateIndex
CREATE UNIQUE INDEX "maisons_transits_code_key" ON "maisons_transits"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ordres_missions_number_key" ON "ordres_missions"("number");

-- CreateIndex
CREATE UNIQUE INDEX "ordre_mission_declarations_ordre_mission_id_declaration_id_key" ON "ordre_mission_declarations"("ordre_mission_id", "declaration_id");

-- CreateIndex
CREATE UNIQUE INDEX "transports_immatriculation_key" ON "transports"("immatriculation");

-- CreateIndex
CREATE UNIQUE INDEX "conteneurs_num_conteneur_key" ON "conteneurs"("num_conteneur");

-- CreateIndex
CREATE UNIQUE INDEX "voitures_chassis_key" ON "voitures"("chassis");

-- CreateIndex
CREATE UNIQUE INDEX "email_verifications_token_key" ON "email_verifications"("token");

-- CreateIndex
CREATE INDEX "email_verifications_user_id_idx" ON "email_verifications"("user_id");

-- CreateIndex
CREATE INDEX "email_verifications_token_idx" ON "email_verifications"("token");

-- CreateIndex
CREATE INDEX "user_maison_transit_userId_idx" ON "user_maison_transit"("userId");

-- CreateIndex
CREATE INDEX "user_maison_transit_maisonTransitId_idx" ON "user_maison_transit"("maisonTransitId");

-- CreateIndex
CREATE UNIQUE INDEX "account_activation_tokens_token_key" ON "account_activation_tokens"("token");

-- CreateIndex
CREATE INDEX "account_activation_tokens_token_idx" ON "account_activation_tokens"("token");

-- CreateIndex
CREATE INDEX "account_activation_tokens_user_id_idx" ON "account_activation_tokens"("user_id");

-- CreateIndex
CREATE INDEX "account_activation_tokens_email_idx" ON "account_activation_tokens"("email");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "password_reset_tokens_user_id_idx" ON "password_reset_tokens"("user_id");

-- CreateIndex
CREATE INDEX "password_reset_tokens_token_idx" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE INDEX "permissions_resource_idx" ON "permissions"("resource");

-- CreateIndex
CREATE INDEX "permissions_name_idx" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_resource_action_key" ON "permissions"("resource", "action");

-- CreateIndex
CREATE INDEX "role_permissions_role_idx" ON "role_permissions"("role");

-- CreateIndex
CREATE INDEX "role_permissions_permission_id_idx" ON "role_permissions"("permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_role_permission_id_key" ON "role_permissions"("role", "permission_id");

-- CreateIndex
CREATE INDEX "user_permissions_user_id_idx" ON "user_permissions"("user_id");

-- CreateIndex
CREATE INDEX "user_permissions_permission_id_idx" ON "user_permissions"("permission_id");

-- CreateIndex
CREATE INDEX "user_permissions_expires_at_idx" ON "user_permissions"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_permissions_user_id_permission_id_key" ON "user_permissions"("user_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "maison_transit_requests_invitation_token_key" ON "maison_transit_requests"("invitation_token");

-- CreateIndex
CREATE INDEX "maison_transit_requests_email_idx" ON "maison_transit_requests"("email");

-- CreateIndex
CREATE INDEX "maison_transit_requests_invitation_token_idx" ON "maison_transit_requests"("invitation_token");

-- CreateIndex
CREATE INDEX "maison_transit_requests_status_idx" ON "maison_transit_requests"("status");

-- CreateIndex
CREATE INDEX "maison_transit_requests_invited_by_idx" ON "maison_transit_requests"("invited_by");

-- CreateIndex
CREATE INDEX "request_documents_request_id_idx" ON "request_documents"("request_id");

-- CreateIndex
CREATE INDEX "request_documents_type_idx" ON "request_documents"("type");

-- AddForeignKey
ALTER TABLE "escouades" ADD CONSTRAINT "escouades_chefId_fkey" FOREIGN KEY ("chefId") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escouades" ADD CONSTRAINT "escouades_adjointId_fkey" FOREIGN KEY ("adjointId") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escouades" ADD CONSTRAINT "escouades_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "ordres_missions" ADD CONSTRAINT "ordres_missions_escouade_id_fkey" FOREIGN KEY ("escouade_id") REFERENCES "escouades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordre_mission_declarations" ADD CONSTRAINT "ordre_mission_declarations_ordre_mission_id_fkey" FOREIGN KEY ("ordre_mission_id") REFERENCES "ordres_missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordre_mission_declarations" ADD CONSTRAINT "ordre_mission_declarations_declaration_id_fkey" FOREIGN KEY ("declaration_id") REFERENCES "declarations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "depositaires" ADD CONSTRAINT "depositaires_maisonTransitId_fkey" FOREIGN KEY ("maisonTransitId") REFERENCES "maisons_transits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "colis" ADD CONSTRAINT "colis_declaration_id_fkey" FOREIGN KEY ("declaration_id") REFERENCES "declarations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "email_verifications" ADD CONSTRAINT "email_verifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_maison_transit" ADD CONSTRAINT "user_maison_transit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_maison_transit" ADD CONSTRAINT "user_maison_transit_maisonTransitId_fkey" FOREIGN KEY ("maisonTransitId") REFERENCES "maisons_transits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_activation_tokens" ADD CONSTRAINT "account_activation_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_activation_tokens" ADD CONSTRAINT "account_activation_tokens_maison_transit_id_fkey" FOREIGN KEY ("maison_transit_id") REFERENCES "maisons_transits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maison_transit_requests" ADD CONSTRAINT "maison_transit_requests_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maison_transit_requests" ADD CONSTRAINT "maison_transit_requests_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_documents" ADD CONSTRAINT "request_documents_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "maison_transit_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
