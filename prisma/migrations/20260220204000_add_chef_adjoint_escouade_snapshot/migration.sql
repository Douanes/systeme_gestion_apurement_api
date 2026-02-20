-- AlterTable
ALTER TABLE "ordres_missions" ADD COLUMN "chef_escouade_id" INTEGER,
ADD COLUMN "adjoint_escouade_id" INTEGER;

-- AddForeignKey
ALTER TABLE "ordres_missions" ADD CONSTRAINT "ordres_missions_chef_escouade_id_fkey" FOREIGN KEY ("chef_escouade_id") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ordres_missions" ADD CONSTRAINT "ordres_missions_adjoint_escouade_id_fkey" FOREIGN KEY ("adjoint_escouade_id") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;
