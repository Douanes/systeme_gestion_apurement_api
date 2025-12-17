# Scripts de Déploiement et Migration

Ce dossier contient les scripts pour le déploiement et la gestion des migrations de l'API Apurement.

## 📁 Fichiers

### `deploy.sh`
Script principal de déploiement de l'application.

**Usage:**
```bash
./deploy.sh
```

**Fonctionnalités:**
- Télécharge la dernière image Docker
- Sauvegarde l'état actuel
- Déploie la nouvelle version
- Vérifie la santé de l'application
- Rollback automatique en cas d'échec

**Variables d'environnement:**
- `IMAGE_TAG`: Tag de l'image Docker à déployer
- `DOCKER_USERNAME`: Nom d'utilisateur Docker Hub
- `DOCKER_PASSWORD`: Mot de passe Docker Hub

### `migrate.sh`
Script de migration de base de données Prisma.

**Usage:**
```bash
./migrate.sh [environment]
```

**Exemples:**
```bash
# Migration en production (par défaut)
./migrate.sh production

# Migration en staging
./migrate.sh staging
```

**Fonctionnalités:**
- Vérifie la connexion à la base de données
- Crée un backup automatique avant migration
- Applique les migrations Prisma
- Génère le Prisma Client
- Garde les logs de migration
- Conserve les 10 derniers backups

**Backups:**
- Localisation: `/opt/apurement/backups/migrations/`
- Format: `backup_YYYYMMDD_HHMMSS.sql.gz`
- Retention: 10 derniers backups

**Logs:**
- Fichier: `/opt/apurement/logs/migrations.log`

### `docker-entrypoint.sh`
Point d'entrée du conteneur Docker. Exécuté au démarrage du conteneur.

**Fonctionnalités:**
- Attend que la base de données soit prête
- Exécute les migrations automatiquement (si `RUN_MIGRATIONS=true`)
- Génère le Prisma Client
- Démarre l'application NestJS

**Variables d'environnement:**
- `RUN_MIGRATIONS`: `true` (défaut) ou `false` pour désactiver les migrations
- `DATABASE_URL`: URL de connexion PostgreSQL

**Exemple de désactivation des migrations:**
```yaml
# docker-compose.yml
services:
  apurement-api:
    environment:
      - RUN_MIGRATIONS=false  # Désactive les migrations au démarrage
```

## 🚀 Processus de Déploiement Complet

### 1. Développement Local

```bash
# Créer une migration
cd /path/to/project
npx prisma migrate dev --name description_migration

# Tester localement
npm run start:dev
```

### 2. Commit et Push

```bash
git add prisma/migrations/
git commit -m "feat: add new migration"
git push origin main
```

### 3. CI/CD (Automatique)

Le pipeline GitHub Actions:
1. Build l'image Docker avec les migrations
2. Push l'image sur Docker Hub
3. Se connecte au serveur via SSH
4. Télécharge et exécute `deploy.sh`

### 4. Déploiement (Automatique)

Le script `deploy.sh`:
1. Pull la nouvelle image
2. Sauvegarde l'état actuel
3. Démarre le nouveau conteneur
4. Le conteneur exécute `docker-entrypoint.sh`
5. Les migrations s'appliquent automatiquement
6. L'application démarre
7. Health check vérifie le bon fonctionnement
8. Rollback automatique si échec

## 🔧 Utilisation Manuelle

### Exécuter les migrations manuellement

```bash
# Option 1: Via le script de migration
ssh user@server
cd /opt/apurement
./scripts/migrate.sh production

# Option 2: Via Docker exec
docker exec apurement-api npx prisma migrate deploy

# Option 3: Redémarrer le conteneur (migrations auto)
docker restart apurement-api
```

### Voir les logs de migration

```bash
# Logs du conteneur
docker logs apurement-api -f

# Fichier de log des migrations
cat /opt/apurement/logs/migrations.log

# Logs de déploiement
cat /opt/apurement/deployment.log
```

### Vérifier l'état des migrations

```bash
# Dans le conteneur
docker exec apurement-api npx prisma migrate status

# Depuis le serveur (avec le script)
cd /opt/apurement
npx prisma migrate status --schema=./prisma/schema.prisma
```

### Restaurer un backup

```bash
# Lister les backups disponibles
ls -lh /opt/apurement/backups/migrations/

# Décompresser un backup
gunzip /opt/apurement/backups/migrations/backup_20231215_143022.sql.gz

# Restaurer (attention: écrase la base actuelle!)
psql -h host -U user -d database < backup_20231215_143022.sql
```

## ⚠️ Précautions

1. **Toujours tester les migrations en local d'abord**
2. **Les backups sont créés automatiquement** avant chaque migration
3. **Le rollback est automatique** en cas d'échec de déploiement
4. **Ne jamais exécuter des migrations manuellement** en production sauf en cas d'urgence
5. **Vérifier les logs** après chaque déploiement

## 🐛 Dépannage

### Les migrations ne s'exécutent pas

```bash
# Vérifier la variable d'environnement
docker exec apurement-api env | grep RUN_MIGRATIONS

# Vérifier la connexion à la DB
docker exec apurement-api npx prisma db execute --stdin <<< "SELECT 1;"

# Forcer l'exécution
docker exec apurement-api ./scripts/migrate.sh production
```

### Échec de migration

```bash
# Voir les logs détaillés
docker logs apurement-api --tail 200

# Voir le fichier de log
cat /opt/apurement/logs/migrations.log

# Vérifier l'état
docker exec apurement-api npx prisma migrate status

# Marquer une migration comme appliquée (si déjà faite manuellement)
docker exec apurement-api npx prisma migrate resolve --applied "migration_name"
```

### Le conteneur ne démarre pas après migration

Le système rollback automatiquement, mais si nécessaire:

```bash
# Voir les logs
docker logs apurement-api

# Restaurer manuellement la version précédente
source /opt/apurement/backups/last_deployment.state
export APUREMENT_VERSION=$PREVIOUS_IMAGE
docker compose -f /opt/apurement/docker-compose.apurement.yml up -d
```

## 📚 Documentation

Pour plus d'informations sur les migrations, consultez:
- [Documentation des Migrations](../docs/MIGRATIONS.md)
- [Documentation Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)

## 🔐 Sécurité

- ✅ Les scripts sont exécutés avec les permissions minimales
- ✅ Les backups sont automatiques
- ✅ Rollback automatique en cas d'échec
- ✅ Les logs sont conservés pour audit
- ✅ Les migrations sont versionnées avec Git
