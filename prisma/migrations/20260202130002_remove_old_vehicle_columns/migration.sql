-- DropForeignKey
ALTER TABLE "transports" DROP CONSTRAINT IF EXISTS "transports_ordre_mission_id_fkey";

-- DropForeignKey
ALTER TABLE "conteneurs" DROP CONSTRAINT IF EXISTS "conteneurs_ordre_mission_id_fkey";

-- DropForeignKey
ALTER TABLE "voitures" DROP CONSTRAINT IF EXISTS "voitures_ordre_mission_id_fkey";

-- AlterTable: Drop old columns from transports (camions)
ALTER TABLE "transports" DROP COLUMN IF EXISTS "ordre_mission_id";
ALTER TABLE "transports" DROP COLUMN IF EXISTS "driver_name";
ALTER TABLE "transports" DROP COLUMN IF EXISTS "driver_nationality";
ALTER TABLE "transports" DROP COLUMN IF EXISTS "ip_address";

-- AlterTable: Drop old columns from conteneurs
ALTER TABLE "conteneurs" DROP COLUMN IF EXISTS "ordre_mission_id";
ALTER TABLE "conteneurs" DROP COLUMN IF EXISTS "num_plomb";
ALTER TABLE "conteneurs" DROP COLUMN IF EXISTS "driver_name";
ALTER TABLE "conteneurs" DROP COLUMN IF EXISTS "driver_nationality";
ALTER TABLE "conteneurs" DROP COLUMN IF EXISTS "ip_address";

-- AlterTable: Drop old columns from voitures
ALTER TABLE "voitures" DROP COLUMN IF EXISTS "ordre_mission_id";
ALTER TABLE "voitures" DROP COLUMN IF EXISTS "driver_name";
ALTER TABLE "voitures" DROP COLUMN IF EXISTS "driver_nationality";
ALTER TABLE "voitures" DROP COLUMN IF EXISTS "ip_address";
