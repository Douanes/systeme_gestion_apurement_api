# Guide des Migrations de Base de Données

Ce document décrit le processus de gestion des migrations Prisma dans le projet.

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Migrations automatiques (CI/CD)](#migrations-automatiques-cicd)
- [Migrations manuelles](#migrations-manuelles)
- [Rollback et récupération](#rollback-et-récupération)
- [Bonnes pratiques](#bonnes-pratiques)

## 🎯 Vue d'ensemble

Le projet utilise **Prisma** comme ORM pour gérer les migrations de base de données. Les migrations sont appliquées automatiquement lors du déploiement via le CI/CD.

### Flux de migration

```
┌─────────────────┐
│  Code modifié   │
│  (schema.prisma)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Créer migration │
│  (dev local)    │
│ prisma migrate  │
│      dev        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Git commit &   │
│      push       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Build Docker  │
│     Image       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Deploy +     │
│   Run migrations│
│ (automatique)   │
└─────────────────┘
```

## 🚀 Migrations automatiques (CI/CD)

### Comment ça marche ?

Les migrations sont exécutées **automatiquement** lors de chaque déploiement :

1. **Build de l'image Docker** : L'image inclut tous les fichiers de migration
2. **Démarrage du conteneur** : Le script `docker-entrypoint.sh` s'exécute
3. **Application des migrations** : Exécution de `prisma migrate deploy`
4. **Démarrage de l'app** : L'application démarre une fois les migrations terminées

### Configuration

Le comportement des migrations est contrôlé par la variable d'environnement :

```bash
# Dans le fichier .env ou docker-compose
RUN_MIGRATIONS=true  # Exécute les migrations (défaut)
RUN_MIGRATIONS=false # Saute les migrations (pour debug)
```

### Logs de migration

Pour voir les logs de migration pendant le déploiement :

```bash
docker logs apurement-api -f
```

Vous verrez des messages comme :
```
🚀 Running database migrations...
⏳ Waiting for database to be ready...
✅ Database is ready!
📦 Deploying Prisma migrations...
✅ Migrations completed successfully
⚙️ Generating Prisma Client...
✅ Prisma Client generated
🚀 Starting NestJS application...
```

## 🛠 Migrations manuelles

### En développement local

#### 1. Créer une nouvelle migration

Après avoir modifié le fichier `prisma/schema.prisma` :

```bash
# Créer et appliquer la migration
npx prisma migrate dev --name description_de_la_migration

# Exemple
npx prisma migrate dev --name add_user_avatar_field
```

Cette commande :
- Crée un fichier SQL de migration dans `prisma/migrations/`
- Applique la migration à votre base de données locale
- Génère le Prisma Client mis à jour

#### 2. Vérifier l'état des migrations

```bash
# Voir l'état actuel
npx prisma migrate status

# Voir l'historique des migrations
npx prisma migrate resolve --show
```

### En production (si nécessaire)

#### Option 1 : Via script (recommandé)

```bash
# SSH vers le serveur
ssh user@server

# Naviguer vers le répertoire de l'application
cd /opt/apurement

# Exécuter le script de migration
./scripts/migrate.sh production
```

#### Option 2 : Via Docker

```bash
# Exécuter les migrations dans le conteneur en cours d'exécution
docker exec apurement-api npx prisma migrate deploy

# Ou redémarrer le conteneur (les migrations s'exécuteront au démarrage)
docker restart apurement-api
```

#### Option 3 : Via docker-compose

```bash
# Redéployer avec migrations
cd /opt/apurement
docker compose -f docker-compose.apurement.yml up -d
```

## 🔄 Rollback et récupération

### Backup automatique

Le script `migrate.sh` crée automatiquement un backup avant chaque migration :

```bash
# Localisation des backups
/opt/apurement/backups/migrations/backup_YYYYMMDD_HHMMSS.sql.gz
```

### Restaurer un backup

```bash
# Décompresser le backup
gunzip /opt/apurement/backups/migrations/backup_20231215_143022.sql.gz

# Restaurer la base de données
psql -h localhost -U user -d database < backup_20231215_143022.sql
```

### Marquer une migration comme appliquée/non appliquée

```bash
# Marquer comme appliquée (si migration déjà effectuée manuellement)
npx prisma migrate resolve --applied "20231215_add_user_field"

# Marquer comme rollback (si migration a échoué)
npx prisma migrate resolve --rolled-back "20231215_add_user_field"
```

### En cas d'échec de migration pendant le déploiement

Le système effectue un rollback automatique :

1. Le conteneur s'arrête si la migration échoue
2. Le script de déploiement détecte l'échec
3. L'ancienne version du conteneur est restaurée
4. Les logs sont disponibles pour diagnostic

```bash
# Voir les logs de l'échec
docker logs apurement-api --tail 200

# Le système rollback automatiquement vers la version précédente
```

## ✅ Bonnes pratiques

### 1. **Toujours tester localement d'abord**

```bash
# Créer et tester la migration en local
npx prisma migrate dev --name ma_migration

# Vérifier que l'app fonctionne
npm run start:dev

# Pousser seulement si tout fonctionne
git add prisma/migrations/
git commit -m "feat: add new migration"
git push
```

### 2. **Nommer les migrations de manière descriptive**

✅ Bon :
```bash
npx prisma migrate dev --name add_email_verification_system
npx prisma migrate dev --name rename_column_itineraire
npx prisma migrate dev --name add_account_activation_token
```

❌ Mauvais :
```bash
npx prisma migrate dev --name update
npx prisma migrate dev --name fix
npx prisma migrate dev --name changes
```

### 3. **Éviter les migrations destructrices**

Privilégier les migrations non-destructrices :

✅ Bon :
```prisma
// Ajouter une nouvelle colonne (nullable ou avec valeur par défaut)
model User {
  avatar String? // Nullable
  status String @default("active") // Avec défaut
}
```

❌ À éviter :
```prisma
// Supprimer une colonne utilisée
model User {
  // oldField String // ❌ Commenté = supprimé
}
```

### 4. **Migrations en plusieurs étapes pour les changements majeurs**

Pour renommer une colonne :

**Étape 1** : Ajouter la nouvelle colonne
```prisma
model Order {
  itinéraire String? // Ancienne
  itineraire String? // Nouvelle
}
```

**Étape 2** : Copier les données (migration personnalisée)
```sql
UPDATE orders SET itineraire = itinéraire WHERE itineraire IS NULL;
```

**Étape 3** : Supprimer l'ancienne colonne
```prisma
model Order {
  itineraire String // Nouvelle colonne uniquement
}
```

### 5. **Vérifier les migrations avant le déploiement**

```bash
# Voir le SQL qui sera exécuté
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datasource prisma/schema.prisma \
  --script

# Vérifier l'état sur le serveur de staging
npx prisma migrate status
```

### 6. **Documenter les migrations complexes**

Pour les migrations avec logique métier :

```sql
-- Migration: 20231215_add_order_numbering
-- Description: Ajoute un système de numérotation automatique des ordres
-- Auteur: Developer Name
-- Date: 2023-12-15

-- Créer la table...
CREATE TABLE...

-- Note: Cette migration nécessite que la table transit_houses existe déjà
```

## 🚨 Troubleshooting

### Problème : "Migration already applied"

```bash
# Vérifier l'état
npx prisma migrate status

# Marquer comme appliquée si nécessaire
npx prisma migrate resolve --applied "nom_de_la_migration"
```

### Problème : "Database is locked"

```bash
# Vérifier les connexions actives
docker exec postgres psql -U user -d database -c "SELECT * FROM pg_stat_activity;"

# Arrêter les connexions si nécessaire
docker restart apurement-api
```

### Problème : "Cannot connect to database"

```bash
# Vérifier que DATABASE_URL est correct
echo $DATABASE_URL

# Tester la connexion
docker exec apurement-api npx prisma db execute --stdin <<< "SELECT 1;"
```

## 📚 Ressources

- [Documentation Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Best Practices Prisma](https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate)
- [Schema Prisma Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

## 🔐 Sécurité

- ✅ Les migrations sont exécutées avec les permissions minimales nécessaires
- ✅ Les backups sont créés automatiquement avant chaque migration
- ✅ Le rollback automatique est activé en cas d'échec
- ✅ Les logs de migration sont conservés pour audit
- ✅ Les migrations sont versionnées avec Git
