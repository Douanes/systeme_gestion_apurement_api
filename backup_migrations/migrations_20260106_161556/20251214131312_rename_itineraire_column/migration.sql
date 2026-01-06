/*
  Warnings:

  - The column `itinéraire` on the `ordres_missions` table will be renamed to `itineraire`.

*/
-- AlterEnum
ALTER TYPE "StatutOrdreMission" ADD VALUE 'COTATION';

-- AlterTable - Rename column to preserve data
ALTER TABLE "ordres_missions" RENAME COLUMN "itinéraire" TO "itineraire";

-- AlterTable - Add escouade_id column
ALTER TABLE "ordres_missions" ADD COLUMN "escouade_id" INTEGER;

-- AddForeignKey
ALTER TABLE "ordres_missions" ADD CONSTRAINT "ordres_missions_escouade_id_fkey" FOREIGN KEY ("escouade_id") REFERENCES "escouades"("id") ON DELETE SET NULL ON UPDATE CASCADE;
