-- Migration: Refactor declaration to support parcelle (partial delivery) system
-- This migration transforms the schema to allow a single declaration to be split across multiple ordre missions

-- Step 1: Create the new junction table for ordre_mission <-> declaration relationship
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

-- Step 2: Migrate existing data from declarations to ordre_mission_declarations
-- For each declaration that has an ordre_mission_id, create an entry in the junction table
INSERT INTO "ordre_mission_declarations" (
    "ordre_mission_id",
    "declaration_id",
    "nbre_colis_parcelle",
    "poids_parcelle",
    "created_at",
    "updated_at"
)
SELECT
    d."ordre_mission_id",
    d."id",
    COALESCE(d."nbre_colis", 0),
    COALESCE(d."poids", 0),
    d."created_at",
    d."updated_at"
FROM "declarations" d
WHERE d."ordre_mission_id" IS NOT NULL
  AND d."deleted_at" IS NULL;

-- Step 3: Modify declarations table structure
-- Rename columns to reflect total vs remaining quantities
ALTER TABLE "declarations" RENAME COLUMN "nbre_colis" TO "nbre_colis_total";
ALTER TABLE "declarations" RENAME COLUMN "poids" TO "poids_total";

-- Fix typo in column name (nbre_colisèrestant -> nbre_colis_restant)
ALTER TABLE "declarations" RENAME COLUMN "nbre_colisèrestant" TO "nbre_colis_restant";

-- Set NOT NULL and defaults for new columns
ALTER TABLE "declarations" ALTER COLUMN "nbre_colis_total" SET NOT NULL;
ALTER TABLE "declarations" ALTER COLUMN "poids_total" SET NOT NULL;
ALTER TABLE "declarations" ALTER COLUMN "nbre_colis_restant" SET NOT NULL;
ALTER TABLE "declarations" ALTER COLUMN "nbre_colis_restant" SET DEFAULT 0;
ALTER TABLE "declarations" ALTER COLUMN "poids_restant" SET NOT NULL;
ALTER TABLE "declarations" ALTER COLUMN "poids_restant" SET DEFAULT 0;

-- Initialize restant fields with total values for existing records
UPDATE "declarations"
SET "nbre_colis_restant" = "nbre_colis_total",
    "poids_restant" = "poids_total"
WHERE "nbre_colis_restant" = 0 OR "poids_restant" = 0;

-- Step 4: Drop the unique constraint on numero_declaration
-- A declaration can now appear in multiple ordre missions (parcelles)
ALTER TABLE "declarations" DROP CONSTRAINT IF EXISTS "declarations_numero_declaration_key";

-- Step 5: Fix Colis table - rename column from ordre_mission_id to declaration_id
ALTER TABLE "colis" RENAME COLUMN "ordre_mission_id" TO "declaration_id";

-- Step 6: Drop the old foreign key from declarations to ordres_missions
ALTER TABLE "declarations" DROP CONSTRAINT IF EXISTS "declarations_ordre_mission_id_fkey";

-- Step 7: Drop the ordre_mission_id column from declarations table
ALTER TABLE "declarations" DROP COLUMN IF EXISTS "ordre_mission_id";

-- Step 8: Create unique constraint on ordre_mission_declarations
CREATE UNIQUE INDEX "ordre_mission_declarations_ordre_mission_id_declaration_id_key"
ON "ordre_mission_declarations"("ordre_mission_id", "declaration_id");

-- Step 9: Add foreign key constraints to ordre_mission_declarations
ALTER TABLE "ordre_mission_declarations"
ADD CONSTRAINT "ordre_mission_declarations_ordre_mission_id_fkey"
FOREIGN KEY ("ordre_mission_id")
REFERENCES "ordres_missions"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "ordre_mission_declarations"
ADD CONSTRAINT "ordre_mission_declarations_declaration_id_fkey"
FOREIGN KEY ("declaration_id")
REFERENCES "declarations"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Step 10: Update existing Colis foreign key to point to declarations
-- First drop the old constraint if it exists
ALTER TABLE "colis" DROP CONSTRAINT IF EXISTS "colis_ordre_mission_id_fkey";

-- Add the new foreign key constraint
ALTER TABLE "colis"
ADD CONSTRAINT "colis_declaration_id_fkey"
FOREIGN KEY ("declaration_id")
REFERENCES "declarations"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
