# Configuration Cloudinary pour le Workflow Maison de Transit

## Vue d'ensemble

Le système utilise Cloudinary pour le stockage sécurisé des documents (RC, NINEA, Carte professionnelle) soumis lors des demandes de création de Maison de Transit.

## Étapes de configuration

### 1. Créer un compte Cloudinary (si pas déjà fait)

1. Aller sur https://cloudinary.com/users/register_free
2. S'inscrire avec votre email professionnel
3. Vérifier votre email
4. Se connecter au dashboard

### 2. Récupérer les credentials

Une fois connecté au dashboard Cloudinary :

1. Aller dans **Dashboard** (page d'accueil après connexion)
2. Vous verrez une section **Account Details** avec :
   - **Cloud name** (ex: `dxyz123abc`)
   - **API Key** (ex: `123456789012345`)
   - **API Secret** (cliquer sur "Show" pour l'afficher)

### 3. Créer un Upload Preset (optionnel mais recommandé)

1. Aller dans **Settings** → **Upload**
2. Scroller jusqu'à **Upload presets**
3. Cliquer sur **Add upload preset**
4. Configurer :
   - **Preset name**: `mt_documents`
   - **Signing mode**: `Signed` (important pour la sécurité)
   - **Folder**: `maison-transit-documents`
   - **Allowed formats**: `pdf,jpg,jpeg,png`
   - **Max file size**: `10 MB`
5. Sauvegarder

### 4. Configuration sur GitHub

#### Ajouter les secrets dans GitHub

1. Aller sur votre repo GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Cliquer sur **New repository secret**
4. Ajouter les 3 secrets suivants :

| Secret Name | Valeur | Exemple |
|------------|--------|---------|
| `CLOUDINARY_CLOUD_NAME` | Votre cloud name | `dxyz123abc` |
| `CLOUDINARY_API_KEY` | Votre API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Votre API secret | `abcdef123456...` |

### 5. Configuration sur le serveur de production

Sur votre serveur de production (`/opt/apurement/.env`), ajoutez :

```bash
# Cloudinary (Document Storage)
CLOUDINARY_CLOUD_NAME=votre_cloud_name_ici
CLOUDINARY_API_KEY=votre_api_key_ici
CLOUDINARY_API_SECRET=votre_api_secret_ici
CLOUDINARY_UPLOAD_PRESET=mt_documents
```

**Important** : Remplacez les valeurs par vos vraies credentials Cloudinary.

### 6. Configuration locale (développement)

Dans votre fichier `.env` local :

```bash
# Cloudinary (Document Storage)
CLOUDINARY_CLOUD_NAME=dxyz123abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=votre_api_secret
CLOUDINARY_UPLOAD_PRESET=mt_documents
```

## Workflow de l'upload

### Côté Frontend

1. Frontend demande une signature au backend : `POST /maison-transit-requests/upload-signature`
2. Backend répond avec :
   ```json
   {
     "signature": "abc123...",
     "timestamp": 1234567890,
     "api_key": "123456789012345",
     "cloud_name": "dxyz123abc"
   }
   ```
3. Frontend upload **directement** vers Cloudinary avec ces paramètres
4. Cloudinary répond avec l'URL du fichier uploadé
5. Frontend inclut cette URL dans la soumission de la demande

### Côté Backend

Le backend ne reçoit **jamais** le fichier, seulement l'URL du fichier uploadé sur Cloudinary.

## Sécurité

- **Upload signé** : Chaque upload nécessite une signature générée côté serveur
- **Expiration** : Les signatures ont une durée de vie limitée
- **Validation** : Le backend vérifie les URLs avant de les sauvegarder
- **Suppression automatique** : Les documents sont supprimés de Cloudinary si la demande est rejetée

## Endpoints API

| Endpoint | Méthode | Description | Auth |
|----------|---------|-------------|------|
| `/maison-transit-requests/upload-signature` | POST | Générer une signature pour upload | Public |
| `/maison-transit-requests/submit` | POST | Soumettre demande avec URLs documents | Public |
| `/maison-transit-requests/:id/review` | PATCH | Approuver/rejeter (supprime docs si rejet) | Admin |

## Limitations du plan gratuit Cloudinary

- **Stockage** : 25 GB
- **Bande passante** : 25 GB/mois
- **Transformations** : 25 crédits/mois
- **Nombre de fichiers** : Illimité

Pour ce projet, le plan gratuit devrait suffire largement.

## Vérification

Pour tester que la configuration fonctionne :

```bash
# En local
npm run start:dev

# Tester la génération de signature
curl -X POST http://localhost:3000/api/v1/maison-transit-requests/upload-signature \
  -H "Content-Type: application/json" \
  -d '{"folder": "test"}'
```

Vous devriez recevoir une réponse avec signature, timestamp, api_key et cloud_name.

## Troubleshooting

### Erreur : "Invalid signature"
- Vérifier que `CLOUDINARY_API_SECRET` est correct
- Vérifier que le timestamp n'a pas expiré

### Erreur : "Invalid cloud name"
- Vérifier que `CLOUDINARY_CLOUD_NAME` est correct

### Erreur : "Upload preset not found"
- Créer le preset `mt_documents` dans Cloudinary
- Ou changer `CLOUDINARY_UPLOAD_PRESET` dans `.env`

## Ressources

- [Documentation Cloudinary](https://cloudinary.com/documentation)
- [Upload Presets](https://cloudinary.com/documentation/upload_presets)
- [Signed Uploads](https://cloudinary.com/documentation/upload_images#signed_uploads)
