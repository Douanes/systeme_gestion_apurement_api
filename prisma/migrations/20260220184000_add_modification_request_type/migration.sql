-- CreateEnum
CREATE TYPE "ModificationRequestType" AS ENUM ('CHANGEMENT_CAMION', 'CHANGEMENT_ITINERAIRE', 'RECTIFICATION_POIDS_COLIS', 'ANNULATION');

-- AlterTable
ALTER TABLE "ordre_mission_modification_requests" ADD COLUMN "type" "ModificationRequestType";
