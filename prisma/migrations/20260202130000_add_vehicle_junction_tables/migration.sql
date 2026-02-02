-- CreateTable: ordre_mission_camions (table de liaison)
CREATE TABLE "ordre_mission_camions" (
    "id" SERIAL NOT NULL,
    "ordre_mission_id" INTEGER NOT NULL,
    "camion_id" INTEGER NOT NULL,
    "driver_name" VARCHAR(255),
    "driver_nationality" VARCHAR(255),
    "phone" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ordre_mission_camions_pkey" PRIMARY KEY ("id")
);

-- CreateTable: ordre_mission_conteneurs (table de liaison)
CREATE TABLE "ordre_mission_conteneurs" (
    "id" SERIAL NOT NULL,
    "ordre_mission_id" INTEGER NOT NULL,
    "conteneur_id" INTEGER NOT NULL,
    "num_plomb" VARCHAR(255),
    "driver_name" VARCHAR(255),
    "driver_nationality" VARCHAR(255),
    "phone" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ordre_mission_conteneurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable: ordre_mission_voitures (table de liaison)
CREATE TABLE "ordre_mission_voitures" (
    "id" SERIAL NOT NULL,
    "ordre_mission_id" INTEGER NOT NULL,
    "voiture_id" INTEGER NOT NULL,
    "driver_name" VARCHAR(255),
    "driver_nationality" VARCHAR(255),
    "phone" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ordre_mission_voitures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ordre_mission_camions_ordre_mission_id_camion_id_key" ON "ordre_mission_camions"("ordre_mission_id", "camion_id");

-- CreateIndex
CREATE UNIQUE INDEX "ordre_mission_conteneurs_ordre_mission_id_conteneur_id_key" ON "ordre_mission_conteneurs"("ordre_mission_id", "conteneur_id");

-- CreateIndex
CREATE UNIQUE INDEX "ordre_mission_voitures_ordre_mission_id_voiture_id_key" ON "ordre_mission_voitures"("ordre_mission_id", "voiture_id");

-- AddForeignKey
ALTER TABLE "ordre_mission_camions" ADD CONSTRAINT "ordre_mission_camions_ordre_mission_id_fkey" FOREIGN KEY ("ordre_mission_id") REFERENCES "ordres_missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordre_mission_camions" ADD CONSTRAINT "ordre_mission_camions_camion_id_fkey" FOREIGN KEY ("camion_id") REFERENCES "transports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordre_mission_conteneurs" ADD CONSTRAINT "ordre_mission_conteneurs_ordre_mission_id_fkey" FOREIGN KEY ("ordre_mission_id") REFERENCES "ordres_missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordre_mission_conteneurs" ADD CONSTRAINT "ordre_mission_conteneurs_conteneur_id_fkey" FOREIGN KEY ("conteneur_id") REFERENCES "conteneurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordre_mission_voitures" ADD CONSTRAINT "ordre_mission_voitures_ordre_mission_id_fkey" FOREIGN KEY ("ordre_mission_id") REFERENCES "ordres_missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordre_mission_voitures" ADD CONSTRAINT "ordre_mission_voitures_voiture_id_fkey" FOREIGN KEY ("voiture_id") REFERENCES "voitures"("id") ON DELETE CASCADE ON UPDATE CASCADE;
