-- AlterEnum: Add new values if they don't already exist
DO $$ BEGIN
    ALTER TYPE "ModificationRequestType" ADD VALUE 'RECTIFICATION_POIDS';
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE "ModificationRequestType" ADD VALUE 'RECTIFICATION_COLIS';
EXCEPTION WHEN duplicate_object THEN null;
END $$;
