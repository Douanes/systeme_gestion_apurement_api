# Guide de Seeding pour CI/CD

Ce document explique comment utiliser les seeders de manière sûre et idempotente dans un environnement CI/CD.

## 📋 Table des Matières

- [Concepts](#concepts)
- [Scripts Disponibles](#scripts-disponibles)
- [Utilisation en Développement](#utilisation-en-développement)
- [Utilisation en CI/CD](#utilisation-en-cicd)
- [Idempotence](#idempotence)
- [Gestion des Erreurs](#gestion-des-erreurs)
- [Bonnes Pratiques](#bonnes-pratiques)

## 🎯 Concepts

### Qu'est-ce que le Seeding?

Le seeding est le processus d'initialisation de la base de données avec des données par défaut nécessaires au bon fonctionnement de l'application.

### Pourquoi l'Idempotence est Importante?

En CI/CD, les seeders peuvent être exécutés plusieurs fois (redéploiements, rollbacks, etc.). Un seeder **idempotent** garantit que:
- ✅ Peut être exécuté plusieurs fois sans erreur
- ✅ Ne crée pas de doublons
- ✅ Met à jour les données existantes si nécessaire
- ✅ Ne supprime pas les données utilisateur

## 🔧 Scripts Disponibles

### Scripts NPM

```bash
# Exécuter tous les seeders
npm run db:seed

# Exécuter uniquement le seeder de permissions
npm run db:seed:permissions

# Migration + Seed (setup complet)
npm run db:setup

# Migration seule (production)
npm run db:migrate:deploy

# Migration + génération client (développement)
npm run db:migrate:dev
```

### Via Prisma CLI

```bash
# Exécuter le seed défini dans package.json
npx prisma db seed

# Après une migration en développement
npx prisma migrate dev  # Exécute automatiquement le seed
```

## 💻 Utilisation en Développement

### Setup Initial

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# 3. Créer la base de données et exécuter les migrations
npx prisma migrate dev

# 4. Le seed s'exécute automatiquement après la migration
# Ou manuellement:
npm run db:seed
```

### Reset Complet de la Base de Données

```bash
# ATTENTION: Supprime TOUTES les données
npx prisma migrate reset

# Cette commande:
# 1. Drop la base de données
# 2. Recrée la base de données
# 3. Applique toutes les migrations
# 4. Exécute les seeders
```

### Développement avec Hot Reload

Les seeders ne s'exécutent PAS automatiquement pendant le développement avec `npm run start:dev`. Vous devez les exécuter manuellement si vous modifiez le schéma.

## 🚀 Utilisation en CI/CD

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma Client
        run: npx prisma generate

      - name: Run database migrations
        run: npm run db:migrate:deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          DIRECT_URL: ${{ secrets.DIRECT_URL }}

      - name: Seed database (idempotent)
        run: npm run db:seed
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          DIRECT_URL: ${{ secrets.DIRECT_URL }}
        continue-on-error: false  # Arrêter le déploiement si le seed échoue

      - name: Build application
        run: npm run build

      # ... autres étapes de déploiement
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

# Script d'entrée
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/main"]
```

```bash
#!/bin/bash
# docker-entrypoint.sh

set -e

echo "🔄 Running database migrations..."
npm run db:migrate:deploy

echo "🌱 Seeding database..."
npm run db:seed

echo "🚀 Starting application..."
exec "$@"
```

### Kubernetes Init Container

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-deployment
spec:
  template:
    spec:
      initContainers:
        - name: db-migration
          image: your-api-image:latest
          command: ["npm", "run", "db:migrate:deploy"]
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-secrets
                  key: database-url

        - name: db-seed
          image: your-api-image:latest
          command: ["npm", "run", "db:seed"]
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-secrets
                  key: database-url

      containers:
        - name: api
          image: your-api-image:latest
          # ... reste de la config
```

## 🔄 Idempotence

### Comment nos Seeders sont Idempotents

Le seeder de permissions suit cette logique:

```typescript
// Pour chaque permission
1. Vérifier si la permission existe (par nom unique)
2. SI existe:
   - Vérifier si mise à jour nécessaire (description modifiée, soft-deleted)
   - Mettre à jour si nécessaire
   - Sinon, skip
3. SINON:
   - Créer la nouvelle permission

// Pour chaque attribution de permission à un rôle
1. Vérifier si l'attribution existe
2. SI existe:
   - Vérifier si elle est révoquée ou supprimée
   - Réactiver si nécessaire
   - Sinon, skip
3. SINON:
   - Créer l'attribution
```

### Exemple de Sortie Idempotente

```bash
🔐 Starting permission seed (idempotent mode)...
📝 Processing 95 permissions...
✅ Permissions: 0 created, 5 updated, 90 skipped
🔐 Assigning permissions to roles...
✅ Role permissions: 0 created, 2 updated, 348 skipped
✅ Permission seed completed successfully
```

### Garanties d'Idempotence

- ✅ **Pas de doublons**: Utilisation de contraintes `@unique` et vérification avant création
- ✅ **Soft delete**: Les données supprimées peuvent être réactivées
- ✅ **Updates sélectifs**: Seulement si les données ont changé
- ✅ **Gestion d'erreurs**: Continue avec les autres éléments en cas d'erreur
- ✅ **Transactions**: Pas de transactions globales pour permettre la poursuite en cas d'erreur partielle

## ⚠️ Gestion des Erreurs

### Stratégie de Gestion d'Erreurs

```typescript
try {
  // Traiter chaque élément individuellement
  for (const item of items) {
    try {
      // Créer ou mettre à jour
      await processItem(item);
      itemsProcessed++;
    } catch (error) {
      // Logger l'erreur mais continuer
      console.error(`Error processing ${item.name}:`, error.message);
      itemsFailed++;
      continue; // Continue avec les autres
    }
  }
} catch (error) {
  // Erreur fatale seulement si problème de connexion DB
  console.error('Fatal error:', error);
  throw error;
}
```

### Types d'Erreurs

1. **Erreurs Non-Fatales** (le seed continue):
   - Permission individuelle en erreur
   - Attribution de permission échouée
   - Données manquantes dans la configuration

2. **Erreurs Fatales** (le seed s'arrête):
   - Connexion à la base de données impossible
   - Schéma de base de données incompatible
   - Erreur de syntaxe dans le code du seeder

### Logs et Monitoring

```bash
# Logs détaillés en CI/CD
npm run db:seed 2>&1 | tee seed.log

# Vérifier le code de sortie
if [ $? -ne 0 ]; then
  echo "❌ Seeding failed!"
  exit 1
fi
```

## ✅ Bonnes Pratiques

### 1. Toujours Tester les Seeders Localement

```bash
# Tester l'idempotence
npm run db:seed
npm run db:seed  # Devrait fonctionner sans erreur
npm run db:seed  # Encore une fois
```

### 2. Séparer les Seeders par Domaine

```
prisma/seeds/
├── permissions.seed.ts      # Données système essentielles
├── users.seed.ts            # Utilisateurs par défaut (admin, etc.)
├── reference-data.seed.ts   # Données de référence
└── demo-data.seed.ts        # Données de démo (DEV uniquement)
```

### 3. Environnement-Aware Seeding

```typescript
// seed.ts
const environment = process.env.NODE_ENV || 'development';

if (environment === 'development') {
  await seedDemoData();  // Données de démo
}

// Toujours exécuter les seeds essentiels
await seedPermissions();
await seedReferenceData();
```

### 4. Versionning des Seeds

```typescript
// permissions.seed.ts
const SEED_VERSION = '1.0.0';

async function seedPermissions() {
  console.log(`🔐 Permission Seed v${SEED_VERSION}`);
  // ...
}
```

### 5. Documentation des Changements

```typescript
/**
 * CHANGELOG:
 * - v1.0.0 (2025-01-01): Initial permission system
 * - v1.1.0 (2025-01-15): Added audit-logs permissions
 * - v1.2.0 (2025-02-01): Added regime permissions
 */
```

### 6. Ne Jamais Supprimer de Données Utilisateur

```typescript
// ❌ MAUVAIS
await prisma.user.deleteMany();

// ✅ BON
// Ne seeder que les données système/référence
// Laisser les données utilisateur intactes
```

### 7. Utiliser des Transactions Quand Approprié

```typescript
// Pour des opérations atomiques
await prisma.$transaction([
  prisma.permission.create({ data: permission1 }),
  prisma.rolePermission.create({ data: rolePermission1 }),
]);
```

### 8. Monitoring en Production

```bash
# Ajouter des métriques
echo "SEED_START=$(date +%s)" >> $GITHUB_ENV
npm run db:seed
echo "SEED_END=$(date +%s)" >> $GITHUB_ENV
echo "SEED_DURATION=$((SEED_END - SEED_START))s"
```

## 🔐 Sécurité

### Variables d'Environnement

```bash
# Ne JAMAIS commiter ces valeurs
DATABASE_URL="postgresql://user:password@host:5432/db"
DIRECT_URL="postgresql://user:password@host:5432/db"
```

### Secrets en CI/CD

- Utiliser les secrets du fournisseur CI/CD (GitHub Secrets, GitLab Variables, etc.)
- Ne jamais logger les URLs de connexion
- Utiliser des credentials différents par environnement

### Permissions Minimales

Le compte de base de données utilisé pour le seeding devrait avoir:
- ✅ `SELECT`, `INSERT`, `UPDATE` sur les tables concernées
- ❌ PAS de `DROP`, `TRUNCATE`, `DELETE` en production

## 📊 Métriques et Reporting

### Exemple de Rapport de Seed

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 SEEDING PERMISSIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 Starting permission seed (idempotent mode)...
📝 Processing 95 permissions...
✅ Permissions: 3 created, 2 updated, 90 skipped
🔐 Assigning permissions to roles...
✅ Role permissions: 5 created, 0 updated, 345 skipped

📊 Permission Seed Summary:
   Permissions: 3 created, 2 updated, 90 skipped
   Role Permissions: 5 created, 0 updated, 345 skipped

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Database seeding completed successfully in 2.34s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🆘 Troubleshooting

### "Permission denied" en CI/CD

```bash
# Vérifier que le compte DB a les bonnes permissions
# Se connecter à la DB et exécuter:
GRANT INSERT, UPDATE, SELECT ON permissions TO your_user;
GRANT INSERT, UPDATE, SELECT ON role_permissions TO your_user;
GRANT INSERT, UPDATE, SELECT ON user_permissions TO your_user;
```

### Timeout en Production

```bash
# Augmenter le timeout Prisma
DATABASE_URL="${DATABASE_URL}?connect_timeout=30"
```

### Rollback de Seed

Les seeders sont idempotents mais ne suppriment rien. Pour un vrai rollback:

```bash
# Rollback de migration (inclut le schéma ET les données)
npx prisma migrate reset

# Ou manuellement via SQL
DELETE FROM role_permissions;
DELETE FROM permissions;
```

## 📚 Ressources

- [Prisma Seeding Guide](https://www.prisma.io/docs/guides/database/seed-database)
- [Idempotent Operations](https://en.wikipedia.org/wiki/Idempotence)
- [CI/CD Best Practices](https://docs.github.com/en/actions/deployment/about-deployments)
