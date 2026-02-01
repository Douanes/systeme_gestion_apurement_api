-- AlterTable
ALTER TABLE "conteneurs" ADD COLUMN "num_plomb" VARCHAR(255);

-- CreateIndex (after data migration if needed)
-- Note: If you need unique constraint, uncomment after ensuring no duplicates
-- CREATE UNIQUE INDEX "conteneurs_num_plomb_key" ON "conteneurs"("num_plomb");
