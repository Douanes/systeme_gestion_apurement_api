-- AlterTable: Add unique constraints for vehicle identification numbers

-- Add unique constraint on immatriculation (Camion)
ALTER TABLE "transports" ADD CONSTRAINT "transports_immatriculation_key" UNIQUE ("immatriculation");

-- Add unique constraint on num_conteneur (Conteneur)
ALTER TABLE "conteneurs" ADD CONSTRAINT "conteneurs_num_conteneur_key" UNIQUE ("num_conteneur");

-- Add unique constraint on chassis (Voiture)
ALTER TABLE "voitures" ADD CONSTRAINT "voitures_chassis_key" UNIQUE ("chassis");
