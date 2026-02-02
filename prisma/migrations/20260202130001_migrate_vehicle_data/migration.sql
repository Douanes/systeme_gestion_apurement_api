-- Migration des données véhicules vers les tables de liaison
-- Cette migration doit être exécutée APRÈS la création des tables de liaison (20260202130000)
-- et AVANT la suppression des anciennes colonnes (20260202130002)

-- Migration des camions (transports -> ordre_mission_camions)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'transports' AND column_name = 'ordre_mission_id'
    ) THEN
        INSERT INTO ordre_mission_camions (ordre_mission_id, camion_id, driver_name, driver_nationality, phone, created_at, updated_at, deleted_at)
        SELECT
            ordre_mission_id,
            id,
            driver_name,
            driver_nationality,
            ip_address,
            created_at,
            COALESCE(updated_at, NOW()),
            deleted_at
        FROM transports
        WHERE ordre_mission_id IS NOT NULL
        ON CONFLICT (ordre_mission_id, camion_id) DO NOTHING;

        RAISE NOTICE 'Camions migrés avec succès';
    ELSE
        RAISE NOTICE 'Colonne ordre_mission_id non trouvée dans transports - migration ignorée';
    END IF;
END $$;

-- Migration des conteneurs (conteneurs -> ordre_mission_conteneurs)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'conteneurs' AND column_name = 'ordre_mission_id'
    ) THEN
        INSERT INTO ordre_mission_conteneurs (ordre_mission_id, conteneur_id, num_plomb, driver_name, driver_nationality, phone, created_at, updated_at, deleted_at)
        SELECT
            ordre_mission_id,
            id,
            num_plomb,
            driver_name,
            driver_nationality,
            ip_address,
            created_at,
            COALESCE(updated_at, NOW()),
            deleted_at
        FROM conteneurs
        WHERE ordre_mission_id IS NOT NULL
        ON CONFLICT (ordre_mission_id, conteneur_id) DO NOTHING;

        RAISE NOTICE 'Conteneurs migrés avec succès';
    ELSE
        RAISE NOTICE 'Colonne ordre_mission_id non trouvée dans conteneurs - migration ignorée';
    END IF;
END $$;

-- Migration des voitures (voitures -> ordre_mission_voitures)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'voitures' AND column_name = 'ordre_mission_id'
    ) THEN
        INSERT INTO ordre_mission_voitures (ordre_mission_id, voiture_id, driver_name, driver_nationality, phone, created_at, updated_at, deleted_at)
        SELECT
            ordre_mission_id,
            id,
            driver_name,
            driver_nationality,
            ip_address,
            created_at,
            COALESCE(updated_at, NOW()),
            deleted_at
        FROM voitures
        WHERE ordre_mission_id IS NOT NULL
        ON CONFLICT (ordre_mission_id, voiture_id) DO NOTHING;

        RAISE NOTICE 'Voitures migrés avec succès';
    ELSE
        RAISE NOTICE 'Colonne ordre_mission_id non trouvée dans voitures - migration ignorée';
    END IF;
END $$;
