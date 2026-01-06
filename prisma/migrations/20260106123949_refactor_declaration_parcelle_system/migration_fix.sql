-- Migration corrective: Refactor declaration to support parcelle system
-- Cette version est plus robuste et gère les erreurs potentielles

-- Step 0: Vérifier et nettoyer l'état si la migration précédente a partiellement échoué
DO $$
BEGIN
    -- Supprimer la table si elle existe déjà partiellement
    DROP TABLE IF EXISTS "ordre_mission_declarations" CASCADE;

    -- Restaurer la colonne ordre_mission_id si elle a été supprimée
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'declarations' AND column_name = 'ordre_mission_id'
    ) THEN
        ALTER TABLE "declarations" ADD COLUMN "ordre_mission_id" INTEGER;
    END IF;
END $$;

-- Step 1: Create the junction table
CREATE TABLE IF NOT EXISTS "ordre_mission_declarations" (
    "id" SERIAL NOT NULL,
    "ordre_mission_id" INTEGER NOT NULL,
    "declaration_id" INTEGER NOT NULL,
    "nbre_colis_parcelle" INTEGER NOT NULL DEFAULT 0,
    "poids_parcelle" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "ordre_mission_declarations_pkey" PRIMARY KEY ("id")
);

-- Step 2: Renommer les colonnes si elles existent
DO $$
BEGIN
    -- Renommer nbre_colis vers nbre_colis_total
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'declarations' AND column_name = 'nbre_colis'
    ) THEN
        ALTER TABLE "declarations" RENAME COLUMN "nbre_colis" TO "nbre_colis_total";
    END IF;

    -- Renommer poids vers poids_total
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'declarations' AND column_name = 'poids'
    ) THEN
        ALTER TABLE "declarations" RENAME COLUMN "poids" TO "poids_total";
    END IF;

    -- Corriger le typo si la colonne existe
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'declarations' AND column_name = 'nbre_colisèrestant'
    ) THEN
        ALTER TABLE "declarations" RENAME COLUMN "nbre_colisèrestant" TO "nbre_colis_restant";
    END IF;
END $$;

-- Step 3: Ajouter les nouvelles colonnes si elles n'existent pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'declarations' AND column_name = 'nbre_colis_total'
    ) THEN
        ALTER TABLE "declarations" ADD COLUMN "nbre_colis_total" INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'declarations' AND column_name = 'poids_total'
    ) THEN
        ALTER TABLE "declarations" ADD COLUMN "poids_total" DECIMAL(12,2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'declarations' AND column_name = 'nbre_colis_restant'
    ) THEN
        ALTER TABLE "declarations" ADD COLUMN "nbre_colis_restant" INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'declarations' AND column_name = 'poids_restant'
    ) THEN
        ALTER TABLE "declarations" ADD COLUMN "poids_restant" DECIMAL(12,2) DEFAULT 0;
    END IF;
END $$;

-- Step 4: Initialiser les valeurs pour les enregistrements existants
UPDATE "declarations"
SET
    "nbre_colis_total" = COALESCE("nbre_colis_total", 0),
    "poids_total" = COALESCE("poids_total", 0),
    "nbre_colis_restant" = COALESCE("nbre_colis_total", 0),
    "poids_restant" = COALESCE("poids_total", 0)
WHERE "nbre_colis_total" IS NULL OR "poids_total" IS NULL;

-- Step 5: Migrer les données existantes vers la table de liaison
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
    COALESCE(d."nbre_colis_total", 0),
    COALESCE(d."poids_total", 0),
    d."created_at",
    d."updated_at"
FROM "declarations" d
WHERE d."ordre_mission_id" IS NOT NULL
  AND d."deleted_at" IS NULL
  AND NOT EXISTS (
      SELECT 1 FROM "ordre_mission_declarations" omd
      WHERE omd."ordre_mission_id" = d."ordre_mission_id"
        AND omd."declaration_id" = d."id"
  );

-- Step 6: Rendre les colonnes NOT NULL
ALTER TABLE "declarations" ALTER COLUMN "nbre_colis_total" SET NOT NULL;
ALTER TABLE "declarations" ALTER COLUMN "poids_total" SET NOT NULL;
ALTER TABLE "declarations" ALTER COLUMN "nbre_colis_restant" SET NOT NULL;
ALTER TABLE "declarations" ALTER COLUMN "nbre_colis_restant" SET DEFAULT 0;
ALTER TABLE "declarations" ALTER COLUMN "poids_restant" SET NOT NULL;
ALTER TABLE "declarations" ALTER COLUMN "poids_restant" SET DEFAULT 0;

-- Step 7: Supprimer la contrainte unique sur numero_declaration si elle existe
ALTER TABLE "declarations" DROP CONSTRAINT IF EXISTS "declarations_numero_declaration_key";

-- Step 8: Fix Colis table - renommer la colonne
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'colis' AND column_name = 'ordre_mission_id'
    ) THEN
        -- Supprimer l'ancienne contrainte
        ALTER TABLE "colis" DROP CONSTRAINT IF EXISTS "colis_ordre_mission_id_fkey";

        -- Renommer la colonne
        ALTER TABLE "colis" RENAME COLUMN "ordre_mission_id" TO "declaration_id";
    END IF;
END $$;

-- Step 9: Supprimer la FK de declarations vers ordres_missions
ALTER TABLE "declarations" DROP CONSTRAINT IF EXISTS "declarations_ordre_mission_id_fkey";

-- Step 10: Supprimer la colonne ordre_mission_id de declarations
ALTER TABLE "declarations" DROP COLUMN IF EXISTS "ordre_mission_id";

-- Step 11: Créer les contraintes sur ordre_mission_declarations
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'ordre_mission_declarations_ordre_mission_id_declaration_id_key'
    ) THEN
        CREATE UNIQUE INDEX "ordre_mission_declarations_ordre_mission_id_declaration_id_key"
        ON "ordre_mission_declarations"("ordre_mission_id", "declaration_id");
    END IF;
END $$;

-- Step 12: Ajouter les foreign keys
ALTER TABLE "ordre_mission_declarations"
DROP CONSTRAINT IF EXISTS "ordre_mission_declarations_ordre_mission_id_fkey";

ALTER TABLE "ordre_mission_declarations"
ADD CONSTRAINT "ordre_mission_declarations_ordre_mission_id_fkey"
FOREIGN KEY ("ordre_mission_id")
REFERENCES "ordres_missions"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "ordre_mission_declarations"
DROP CONSTRAINT IF EXISTS "ordre_mission_declarations_declaration_id_fkey";

ALTER TABLE "ordre_mission_declarations"
ADD CONSTRAINT "ordre_mission_declarations_declaration_id_fkey"
FOREIGN KEY ("declaration_id")
REFERENCES "declarations"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Step 13: Ajouter la FK de colis vers declarations
ALTER TABLE "colis" DROP CONSTRAINT IF EXISTS "colis_declaration_id_fkey";

ALTER TABLE "colis"
ADD CONSTRAINT "colis_declaration_id_fkey"
FOREIGN KEY ("declaration_id")
REFERENCES "declarations"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
