-- AlterTable
ALTER TABLE "declarations" ADD COLUMN     "regime_id" INTEGER;

-- AddForeignKey
ALTER TABLE "declarations" ADD CONSTRAINT "declarations_regime_id_fkey" FOREIGN KEY ("regime_id") REFERENCES "regimes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
