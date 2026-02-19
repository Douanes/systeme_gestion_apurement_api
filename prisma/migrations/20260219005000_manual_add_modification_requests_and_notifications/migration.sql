-- CreateEnum
CREATE TYPE "ModificationRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TypeNotification" AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ERROR');

-- CreateTable
CREATE TABLE "ordre_mission_modification_requests" (
    "id" SERIAL NOT NULL,
    "ordre_mission_id" INTEGER NOT NULL,
    "requester_id" INTEGER NOT NULL,
    "reviewer_id" INTEGER,
    "reason" TEXT NOT NULL,
    "rejection_reason" TEXT,
    "status" "ModificationRequestStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "reviewed_at" TIMESTAMP(3),

    CONSTRAINT "ordre_mission_modification_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "TypeNotification" NOT NULL DEFAULT 'INFO',
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "related_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ordre_mission_documents" (
    "id" SERIAL NOT NULL,
    "ordre_mission_id" INTEGER NOT NULL,
    "maison_transit_id" INTEGER,
    "file_name" VARCHAR(255) NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,
    "mime_type" VARCHAR(100),
    "public_id" VARCHAR(255),
    "uploaded_by" INTEGER,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ordre_mission_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_parameters" (
    "id" SERIAL NOT NULL,
    "chef_bureau_id" INTEGER,
    "chef_section_id" INTEGER,
    "phone" VARCHAR(20),
    "email" VARCHAR(255),
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_parameters_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "colis" ADD COLUMN "ordre_mission_id" INTEGER;

-- AlterTable
ALTER TABLE "ordres_missions" ADD COLUMN "chef_bureau_id" INTEGER,
ADD COLUMN "chef_section_id" INTEGER;

-- CreateIndex
CREATE INDEX "ordre_mission_documents_ordre_mission_id_idx" ON "ordre_mission_documents"("ordre_mission_id");
CREATE INDEX "ordre_mission_documents_maison_transit_id_idx" ON "ordre_mission_documents"("maison_transit_id");

-- AddForeignKey
ALTER TABLE "ordre_mission_documents" ADD CONSTRAINT "ordre_mission_documents_ordre_mission_id_fkey" FOREIGN KEY ("ordre_mission_id") REFERENCES "ordres_missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ordre_mission_documents" ADD CONSTRAINT "ordre_mission_documents_maison_transit_id_fkey" FOREIGN KEY ("maison_transit_id") REFERENCES "maisons_transit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ordre_mission_documents" ADD CONSTRAINT "ordre_mission_documents_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_parameters" ADD CONSTRAINT "system_parameters_chef_bureau_id_fkey" FOREIGN KEY ("chef_bureau_id") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "system_parameters" ADD CONSTRAINT "system_parameters_chef_section_id_fkey" FOREIGN KEY ("chef_section_id") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colis" ADD CONSTRAINT "colis_ordre_mission_id_fkey" FOREIGN KEY ("ordre_mission_id") REFERENCES "ordres_missions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordre_mission_modification_requests" ADD CONSTRAINT "ordre_mission_modification_requests_ordre_mission_id_fkey" FOREIGN KEY ("ordre_mission_id") REFERENCES "ordres_missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ordre_mission_modification_requests" ADD CONSTRAINT "ordre_mission_modification_requests_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ordre_mission_modification_requests" ADD CONSTRAINT "ordre_mission_modification_requests_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
