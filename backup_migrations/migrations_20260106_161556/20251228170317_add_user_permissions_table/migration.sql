-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('EN_ATTENTE', 'EN_REVISION', 'APPROUVE', 'REJETE', 'EXPIRE', 'ANNULE');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('REGISTRE_COMMERCE', 'NINEA', 'CARTE_PROFESSIONNELLE', 'AUTRE');

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "resource" VARCHAR(50) NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" SERIAL NOT NULL,
    "role" "UserRole" NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "granted" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_permissions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "granted_by" INTEGER,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maison_transit_requests" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "company_name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "address" TEXT,
    "ninea" VARCHAR(100),
    "registre_commerce" VARCHAR(100),
    "status" "RequestStatus" NOT NULL DEFAULT 'EN_ATTENTE',
    "invitation_token" VARCHAR(255) NOT NULL,
    "token_expires_at" TIMESTAMP(3) NOT NULL,
    "invited_by" INTEGER NOT NULL,
    "reviewed_by" INTEGER,
    "reviewed_at" TIMESTAMP(3),
    "rejection_reason" TEXT,
    "activated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "maison_transit_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_documents" (
    "id" SERIAL NOT NULL,
    "request_id" INTEGER NOT NULL,
    "type" "DocumentType" NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,
    "mime_type" VARCHAR(100),
    "cloudinary_id" VARCHAR(255),
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "request_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE INDEX "permissions_resource_idx" ON "permissions"("resource");

-- CreateIndex
CREATE INDEX "permissions_name_idx" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_resource_action_key" ON "permissions"("resource", "action");

-- CreateIndex
CREATE INDEX "role_permissions_role_idx" ON "role_permissions"("role");

-- CreateIndex
CREATE INDEX "role_permissions_permission_id_idx" ON "role_permissions"("permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_role_permission_id_key" ON "role_permissions"("role", "permission_id");

-- CreateIndex
CREATE INDEX "user_permissions_user_id_idx" ON "user_permissions"("user_id");

-- CreateIndex
CREATE INDEX "user_permissions_permission_id_idx" ON "user_permissions"("permission_id");

-- CreateIndex
CREATE INDEX "user_permissions_expires_at_idx" ON "user_permissions"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_permissions_user_id_permission_id_key" ON "user_permissions"("user_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "maison_transit_requests_invitation_token_key" ON "maison_transit_requests"("invitation_token");

-- CreateIndex
CREATE INDEX "maison_transit_requests_email_idx" ON "maison_transit_requests"("email");

-- CreateIndex
CREATE INDEX "maison_transit_requests_invitation_token_idx" ON "maison_transit_requests"("invitation_token");

-- CreateIndex
CREATE INDEX "maison_transit_requests_status_idx" ON "maison_transit_requests"("status");

-- CreateIndex
CREATE INDEX "maison_transit_requests_invited_by_idx" ON "maison_transit_requests"("invited_by");

-- CreateIndex
CREATE INDEX "request_documents_request_id_idx" ON "request_documents"("request_id");

-- CreateIndex
CREATE INDEX "request_documents_type_idx" ON "request_documents"("type");

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maison_transit_requests" ADD CONSTRAINT "maison_transit_requests_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maison_transit_requests" ADD CONSTRAINT "maison_transit_requests_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_documents" ADD CONSTRAINT "request_documents_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "maison_transit_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
