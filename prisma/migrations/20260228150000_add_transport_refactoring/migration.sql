-- Migration: Transport refactoring
-- Adds: typeConteneur and ordreMissionCamionId to ordre_mission_conteneurs
-- Adds: ordreMissionCamionId to ordre_mission_voitures

-- AlterTable: ordre_mission_conteneurs
DO $$ BEGIN
    ALTER TABLE "ordre_mission_conteneurs" ADD COLUMN "type_conteneur" VARCHAR(50);
EXCEPTION WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "ordre_mission_conteneurs" ADD COLUMN "ordre_mission_camion_id" INTEGER;
EXCEPTION WHEN duplicate_column THEN null;
END $$;

-- AlterTable: ordre_mission_voitures
DO $$ BEGIN
    ALTER TABLE "ordre_mission_voitures" ADD COLUMN "ordre_mission_camion_id" INTEGER;
EXCEPTION WHEN duplicate_column THEN null;
END $$;

-- AddForeignKey: ordre_mission_conteneurs -> ordre_mission_camions
DO $$ BEGIN
    ALTER TABLE "ordre_mission_conteneurs"
        ADD CONSTRAINT "ordre_mission_conteneurs_ordre_mission_camion_id_fkey"
        FOREIGN KEY ("ordre_mission_camion_id")
        REFERENCES "ordre_mission_camions"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey: ordre_mission_voitures -> ordre_mission_camions
DO $$ BEGIN
    ALTER TABLE "ordre_mission_voitures"
        ADD CONSTRAINT "ordre_mission_voitures_ordre_mission_camion_id_fkey"
        FOREIGN KEY ("ordre_mission_camion_id")
        REFERENCES "ordre_mission_camions"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
