-- AlterTable: ordre_mission_camions - align column types to VARCHAR
ALTER TABLE "ordre_mission_camions" ALTER COLUMN "driver_name" TYPE VARCHAR(255);
ALTER TABLE "ordre_mission_camions" ALTER COLUMN "driver_nationality" TYPE VARCHAR(255);
ALTER TABLE "ordre_mission_camions" ALTER COLUMN "phone" TYPE VARCHAR(50);

-- AlterTable: ordre_mission_conteneurs - align column types to VARCHAR
ALTER TABLE "ordre_mission_conteneurs" ALTER COLUMN "num_plomb" TYPE VARCHAR(255);
ALTER TABLE "ordre_mission_conteneurs" ALTER COLUMN "driver_name" TYPE VARCHAR(255);
ALTER TABLE "ordre_mission_conteneurs" ALTER COLUMN "driver_nationality" TYPE VARCHAR(255);
ALTER TABLE "ordre_mission_conteneurs" ALTER COLUMN "phone" TYPE VARCHAR(50);

-- AlterTable: ordre_mission_voitures - align column types to VARCHAR
ALTER TABLE "ordre_mission_voitures" ALTER COLUMN "driver_name" TYPE VARCHAR(255);
ALTER TABLE "ordre_mission_voitures" ALTER COLUMN "driver_nationality" TYPE VARCHAR(255);
ALTER TABLE "ordre_mission_voitures" ALTER COLUMN "phone" TYPE VARCHAR(50);
