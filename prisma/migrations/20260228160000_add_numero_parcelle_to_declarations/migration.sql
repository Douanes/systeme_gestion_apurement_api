-- Migration: Add numero_parcelle to ordre_mission_declarations
-- Adds: numeroParcelle (Int?) to OrdreMissionDeclaration

DO $$ BEGIN
    ALTER TABLE "ordre_mission_declarations" ADD COLUMN "numero_parcelle" INTEGER;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
