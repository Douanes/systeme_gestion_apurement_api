-- AlterTable - Add userId to agents table
ALTER TABLE "agents" ADD COLUMN "user_id" INTEGER;

-- CreateIndex - Add unique constraint on user_id
CREATE UNIQUE INDEX "agents_user_id_key" ON "agents"("user_id");

-- CreateTable - Create UserMaisonTransit junction table
CREATE TABLE "user_maison_transit" (
    "userId" INTEGER NOT NULL,
    "maisonTransitId" INTEGER NOT NULL,
    "role" VARCHAR(50),
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_by" INTEGER,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_maison_transit_pkey" PRIMARY KEY ("userId","maisonTransitId")
);

-- CreateIndex - Add indexes on UserMaisonTransit
CREATE INDEX "user_maison_transit_userId_idx" ON "user_maison_transit"("userId");
CREATE INDEX "user_maison_transit_maisonTransitId_idx" ON "user_maison_transit"("maisonTransitId");

-- AddForeignKey - User to Agent relation
ALTER TABLE "agents" ADD CONSTRAINT "agents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey - UserMaisonTransit to User
ALTER TABLE "user_maison_transit" ADD CONSTRAINT "user_maison_transit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey - UserMaisonTransit to MaisonTransit
ALTER TABLE "user_maison_transit" ADD CONSTRAINT "user_maison_transit_maisonTransitId_fkey" FOREIGN KEY ("maisonTransitId") REFERENCES "maisons_transits"("id") ON DELETE CASCADE ON UPDATE CASCADE;
