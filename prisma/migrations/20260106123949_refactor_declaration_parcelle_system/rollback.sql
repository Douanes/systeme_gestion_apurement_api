-- Rollback script for parcelle system migration
-- Execute this if you need to revert to the old structure

-- Step 1: Restore ordre_mission_id column in declarations
ALTER TABLE "declarations" ADD COLUMN IF NOT EXISTS "ordre_mission_id" INTEGER;

-- Step 2: Restore data from junction table
UPDATE "declarations" d
SET "ordre_mission_id" = omd."ordre_mission_id"
FROM "ordre_mission_declarations" omd
WHERE d."id" = omd."declaration_id"
  AND omd."deleted_at" IS NULL;

-- Step 3: Restore FK constraint
ALTER TABLE "declarations"
ADD CONSTRAINT "declarations_ordre_mission_id_fkey"
FOREIGN KEY ("ordre_mission_id")
REFERENCES "ordres_missions"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Step 4: Drop junction table
DROP TABLE IF EXISTS "ordre_mission_declarations" CASCADE;

-- Step 5: Restore colis.ordre_mission_id column
ALTER TABLE "colis" DROP CONSTRAINT IF EXISTS "colis_declaration_id_fkey";
ALTER TABLE "colis" RENAME COLUMN "declaration_id" TO "ordre_mission_id";
ALTER TABLE "colis"
ADD CONSTRAINT "colis_ordre_mission_id_fkey"
FOREIGN KEY ("ordre_mission_id")
REFERENCES "ordres_missions"("id")
ON DELETE CASCADE;

-- Step 6: Restore old column names
ALTER TABLE "declarations" RENAME COLUMN "nbre_colis_total" TO "nbre_colis";
ALTER TABLE "declarations" RENAME COLUMN "poids_total" TO "poids";
ALTER TABLE "declarations" DROP COLUMN IF EXISTS "nbre_colis_restant";
ALTER TABLE "declarations" DROP COLUMN IF EXISTS "poids_restant";

-- Step 7: Restore unique constraint
ALTER TABLE "declarations" ADD CONSTRAINT "declarations_numero_declaration_key" UNIQUE ("numero_declaration");
