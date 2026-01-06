-- AlterTable: Make passwordHash nullable to allow activation by token
ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;

-- CreateTable: account_activation_tokens for agent activation and MT staff invitations
CREATE TABLE "account_activation_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "email" VARCHAR(255) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "used_at" TIMESTAMP(3),
    "maison_transit_id" INTEGER,
    "invited_by" INTEGER,
    "staff_role" VARCHAR(50),

    CONSTRAINT "account_activation_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_activation_tokens_token_key" ON "account_activation_tokens"("token");

-- CreateIndex
CREATE INDEX "account_activation_tokens_token_idx" ON "account_activation_tokens"("token");

-- CreateIndex
CREATE INDEX "account_activation_tokens_user_id_idx" ON "account_activation_tokens"("user_id");

-- CreateIndex
CREATE INDEX "account_activation_tokens_email_idx" ON "account_activation_tokens"("email");

-- AddForeignKey
ALTER TABLE "account_activation_tokens" ADD CONSTRAINT "account_activation_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_activation_tokens" ADD CONSTRAINT "account_activation_tokens_maison_transit_id_fkey" FOREIGN KEY ("maison_transit_id") REFERENCES "maisons_transits"("id") ON DELETE CASCADE ON UPDATE CASCADE;
