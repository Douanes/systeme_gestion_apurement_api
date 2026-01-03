# Cloudinary Upload avec URLs Signées - Explication complète

## 🎯 Architecture de Sécurité

Ce système utilise une approche **similaire aux presigned URLs d'AWS S3** pour sécuriser les fichiers:

1. **Upload**: Les fichiers sont uploadés en mode `authenticated` (privé)
2. **Stockage**: Les fichiers sont stockés de manière sécurisée dans Cloudinary
3. **Accès**: Les URLs signées temporaires sont générées à la demande (expiration 1 heure)

### 🔒 Avantages de cette approche

- ✅ Les fichiers ne sont **jamais accessibles publiquement**
- ✅ Les URLs signées expirent après 1 heure (comme AWS S3)
- ✅ Chaque demande de document génère une nouvelle URL signée
- ✅ Impossible d'accéder aux fichiers sans passer par l'API
- ✅ Contrôle total sur qui peut accéder aux documents

### 📋 Workflow complet

**Upload** → Fichier privé → **API génère URL signée** → Client accède (1h) → **URL expire**

## 🔄 Workflow Cloudinary (Comment ça marche)

### 1️⃣ Frontend demande une signature

```javascript
POST /maison-transit-requests/upload-signature
Body: {
  "documentType": "REGISTRE_COMMERCE",
  "fileName": "RC_Transport_Express.pdf"
}
```

### 2️⃣ Backend génère et retourne TOUT

```javascript
Response: {
  "upload_url": "https://api.cloudinary.com/v1_1/votre-cloud/raw/upload",    // ← URL complète (raw pour PDFs)
  "signature": "abc123...",                                                   // ← Signature cryptée
  "timestamp": 1703419200,                                                    // ← Timestamp
  "api_key": "123456789",                                                     // ← API key
  "cloud_name": "votre-cloud",                                                // ← Cloud name
  "public_id": "maison-transit-documents/REGISTRE_COMMERCE_RC_..._1703419200", // ← ID unique (inclut le dossier)
  "resource_type": "raw",                                                     // ← Type de ressource (NON signé)
  "type": "authenticated"                                                     // ← Mode privé (NON signé)
}
```

> **Note importante:**
> - Le paramètre `folder` n'est **pas** inclus dans la réponse car le `public_id` contient déjà le chemin complet
> - Le paramètre `type: 'authenticated'` est **DANS la signature** (obligatoire pour les fichiers privés)
> - Le paramètre `resource_type: 'raw'` n'est **PAS dans la signature** mais doit être envoyé
> - Paramètres signés: `public_id`, `type`, `timestamp`
> - Paramètre non signé mais requis: `resource_type`

### 3️⃣ Frontend upload vers Cloudinary

```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('api_key', response.api_key);
formData.append('timestamp', response.timestamp);
formData.append('signature', response.signature);
formData.append('public_id', response.public_id);
formData.append('type', response.type);                      // 'authenticated' - Mode privé
formData.append('resource_type', response.resource_type);    // 'raw' - Pour PDFs/documents

// ⚠️ IMPORTANT: Utiliser l'upload_url retournée (déjà configurée pour /raw/upload)
fetch(response.upload_url, { method: 'POST', body: formData })
```

**Points clés:**
- ✅ Tous les paramètres nécessaires sont retournés par le backend
- ✅ Le frontend n'a qu'à construire le FormData avec les valeurs reçues
- ✅ Paramètres signés: `public_id`, `type`, `timestamp`
- ✅ Paramètre non signé: `resource_type` (mais doit être envoyé)

**⚠️ Erreur courante à éviter:**
Si vous envoyez le paramètre `folder` à Cloudinary alors qu'il n'est pas inclus dans la signature, vous obtiendrez cette erreur:
```json
{
  "error": {
    "message": "Invalid Signature 54cac220fc599dcd70ef87bdde10f8bb6cc08026. String to sign - 'folder=maison-transit-documents&public_id=maison-transit-documents/REGISTRE_COMMERCE_ODM_1767045206837&timestamp=1767045207'."
  }
}
```

**Solution:** N'envoyez que les paramètres retournés par le backend (`api_key`, `timestamp`, `signature`, `public_id`). Le dossier est déjà inclus dans le `public_id`.

### 4️⃣ Cloudinary retourne les infos du fichier uploadé

```javascript
{
  "secure_url": "https://res.cloudinary.com/.../authenticated/.../REGISTRE_COMMERCE_RC_..._1703419200.pdf",
  "public_id": "maison-transit-documents/REGISTRE_COMMERCE_RC_..._1703419200",
  "type": "authenticated", // ← Fichier stocké en mode privé
  "bytes": 245600,
  "format": "pdf"
}
```

⚠️ **IMPORTANT**: L'URL retournée par Cloudinary (`secure_url`) **ne fonctionne PAS directement** car le fichier est privé. Elle retournera une erreur 401 Unauthorized si utilisée directement.

### 5️⃣ Frontend récupère les documents via l'API

Quand le frontend demande les détails d'une demande (ex: `GET /maison-transit-requests/:id`), l'API:

1. Lit les URLs des fichiers depuis la base de données
2. **Génère automatiquement des URLs signées** pour chaque fichier (expiration 1 heure)
3. Retourne les URLs signées au frontend

```javascript
// Exemple de réponse
{
  "id": 123,
  "documents": [
    {
      "id": 1,
      "type": "REGISTRE_COMMERCE",
      "fileName": "RC_Transport.pdf",
      "fileUrl": "https://res.cloudinary.com/xxx/raw/authenticated/s--SIGNATURE--/fl_attachment/maison-transit-documents/REGISTRE_COMMERCE_RC_..._1703419200.pdf",
      // ↑ URL signée valide 1 heure
      "fileSize": 245600,
      "mimeType": "application/pdf"
    }
  ]
}
```

### 6️⃣ Frontend accède au fichier avec l'URL signée

Le frontend peut maintenant:
- ✅ Afficher le PDF dans un viewer
- ✅ Télécharger le fichier
- ✅ Partager l'URL (valide pendant 1 heure)

Après expiration (1 heure):
- ❌ L'URL signée ne fonctionne plus
- ✅ Le frontend doit redemander les détails pour obtenir une nouvelle URL signée

## 🎁 Ce qui a été amélioré

### ❌ Avant (ce qu'on aurait pu faire - moins bien)

Frontend devait gérer :
- ❌ Le folder (hardcodé dans le code frontend)
- ❌ La construction de l'URL d'upload
- ❌ La génération du public_id

```typescript
// Frontend devait faire ça (pas terrible)
const folder = 'maison-transit-documents'; // Hardcodé !
const public_id = `${folder}/${type}_${Date.now()}_${file.name}`; // Frontend génère l'ID
const upload_url = `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`; // Frontend construit l'URL
```

### ✅ Maintenant (ce qu'on a implémenté - mieux)

Backend gère TOUT :
- ✅ Le folder vient de `CLOUDINARY_FOLDER` (variable d'environnement)
- ✅ L'URL d'upload est retournée par le backend
- ✅ Le public_id est généré côté backend (unique, sécurisé)

```typescript
// Frontend fait juste ça (simple et propre)
const response = await fetch('/maison-transit-requests/upload-signature', {
  method: 'POST',
  body: JSON.stringify({
    documentType: 'REGISTRE_COMMERCE',
    fileName: file.name
  })
});

const { upload_url, signature, timestamp, api_key, public_id } = await response.json();
// Tout est prêt, on upload directement !
```

## 📦 Qu'est-ce que le `public_id` ?

Le `public_id` est **l'identifiant unique** du fichier dans Cloudinary.

### Structure

```
public_id = "maison-transit-documents/REGISTRE_COMMERCE_RC_Transport_Express_1703419200123"
            └─────────── folder ───────────┘ └─────────────── filename ───────────────────┘
```

### Pourquoi c'est important

1. **Unicité** : Évite les collisions de noms
   ```
   REGISTRE_COMMERCE_RC_Transport_Express_1703419200123
   REGISTRE_COMMERCE_RC_Transport_Express_1703419300456  ← Différent timestamp !
   ```

2. **Traçabilité** : Contient le type de document
   ```
   REGISTRE_COMMERCE_...  ← On sait que c'est un RC
   NINEA_...              ← On sait que c'est un NINEA
   ```

3. **Organisation** : Inclut le dossier
   ```
   maison-transit-documents/REGISTRE_COMMERCE_...
   └─ Tous dans le même dossier
   ```

## 🐛 Problèmes courants et solutions

### ❌ Erreur: "Invalid Signature"

**Symptôme:**
```json
{
  "error": {
    "message": "Invalid Signature abc123. String to sign - 'folder=maison-transit-documents&public_id=...&timestamp=...'"
  }
}
```

**Cause:**
Vous envoyez un paramètre à Cloudinary qui n'est pas inclus dans la signature.

**Solutions:**

1. **N'envoyez QUE les paramètres signés:**
   ```javascript
   // ✅ CORRECT - Envoyer seulement ces paramètres:
   formData.append('file', file);
   formData.append('api_key', response.api_key);
   formData.append('timestamp', response.timestamp);
   formData.append('signature', response.signature);
   formData.append('public_id', response.public_id);
   formData.append('type', 'authenticated');      // Mode privé (sécurisé)
   formData.append('resource_type', 'raw');        // Type raw pour documents

   // ❌ INCORRECT - Ne PAS envoyer ces paramètres:
   // formData.append('folder', ...);        // Pas dans la signature !
   // formData.append('upload_preset', ...); // Pas dans la signature !
   // formData.append('cloud_name', ...);    // Pas dans la signature !
   ```

   > **Important**: Envoyez **uniquement** les paramètres retournés par le backend:
   > - Signés: `public_id`, `type`, `timestamp`
   > - Non signé: `resource_type`
   > - Requis: `file`, `api_key`, `signature`

2. **Le fichier sera uploadé en mode `authenticated` (privé)**:
   - Les URLs directes depuis Cloudinary ne fonctionneront pas (401 Unauthorized)
   - L'API génère automatiquement des URLs signées lors de la récupération
   - Les URLs signées expirent après 1 heure

3. **Le `public_id` contient déjà le folder:**
   ```
   public_id = "maison-transit-documents/REGISTRE_COMMERCE_file_123456"
                └────────── folder ──────────┘└────── filename ──────┘
   ```
   Donc pas besoin d'envoyer `folder` séparément.

## 🔒 Sécurité - Similaire à AWS S3 Presigned URLs

### Upload sécurisé

1. **Signature pour l'upload**
   - Le `API_SECRET` reste sur le serveur
   - Le backend génère la signature avec les paramètres signés: `public_id`, `type`, `timestamp`
   - Le paramètre `resource_type` n'est PAS signé mais doit être envoyé
   - La signature est valide pendant la durée de l'upload
   - Cloudinary vérifie que la signature correspond exactement aux paramètres signés

2. **Stockage privé**
   - Les fichiers sont uploadés en mode `authenticated` (privé)
   - Impossible d'accéder directement aux fichiers via leur URL
   - Toute tentative d'accès direct retourne 401 Unauthorized

### Accès sécurisé (Signed URLs)

1. **Génération d'URL signée**
   - Quand un utilisateur demande les documents, l'API génère une URL signée
   - L'URL contient une signature cryptographique unique
   - ⚠️ **Différence importante avec AWS S3**: Les URLs signées Cloudinary `authenticated` n'expirent PAS automatiquement
   - La sécurité vient du fait que seul le serveur avec `API_SECRET` peut générer ces URLs
   - Pour révoquer l'accès, il faut supprimer le fichier ou le déplacer vers un autre public_id

2. **Avantages**
   - ✅ Contrôle total: seule l'API peut générer les URLs d'accès
   - ✅ Sécurisé: impossible de générer une URL valide sans l'API_SECRET
   - ✅ Traçable: chaque génération d'URL peut être loggée
   - ✅ Révocable: on peut supprimer le fichier de Cloudinary
   - ⚠️ Les URLs ne sont PAS temporaires (pas d'expiration automatique comme AWS S3)

3. **Comparaison avec AWS S3**
   ```javascript
   // AWS S3 Presigned URL (expire après 1 heure)
   const url = s3.getSignedUrl('getObject', {
     Bucket: 'my-bucket',
     Key: 'document.pdf',
     Expires: 3600 // 1 heure
   });

   // Cloudinary Signed URL (ne expire PAS automatiquement)
   const url = cloudinaryService.generateSignedUrl(
     'maison-transit-documents/REGISTRE_COMMERCE_...'
   );
   ```

   **Différence importante**:
   - AWS S3: URLs temporaires avec expiration automatique
   - Cloudinary: URLs signées permanentes (jusqu'à suppression du fichier)

## 📝 Configuration requise

### Variables d'environnement

```env
# Cloudinary (Document Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name         # Nom de votre compte Cloudinary
CLOUDINARY_API_KEY=your_api_key               # API Key publique
CLOUDINARY_API_SECRET=your_api_secret         # API Secret (PRIVÉ !)
CLOUDINARY_UPLOAD_PRESET=apurement_document   # Preset créé dans Cloudinary
CLOUDINARY_FOLDER=maison-transit-documents    # Dossier de destination
```

### Où les mettre ?

1. **Développement local** : `.env`
2. **Production** : `/opt/apurement/.env`
3. **CI/CD** : GitHub Secrets (pour les tests)
4. **Docker** : `docker-compose.apurement.yml` (variables passées au container)

## 🎓 Résumé

| Aspect | Qui le gère ? | Pourquoi ? |
|--------|---------------|------------|
| **API Secret** | Backend uniquement | Sécurité : ne doit JAMAIS être exposé |
| **Folder** | Backend (variable d'env) | Flexibilité : changeable sans toucher au code |
| **Public ID** | Backend (généré) | Unicité garantie |
| **Upload URL** | Backend (retourné) | Simplicité côté frontend |
| **Signature** | Backend (générée) | Sécurité : seul le backend peut signer |
| **Fichier** | Frontend → Cloudinary | Performance : upload direct |

## ✨ Conclusion

**Question** : "Est-ce qu'on peut retourner l'URL directement ?"

**Réponse** : On retourne maintenant :
- ✅ L'URL d'upload (`upload_url`)
- ✅ Tous les paramètres nécessaires (`signature`, `api_key`, `public_id`, etc.)
- ✅ Le frontend n'a qu'à construire le FormData et envoyer

C'est le **maximum de simplification possible** avec Cloudinary, car contrairement à S3, Cloudinary ne supporte pas les URLs pré-signées complètes.

Le frontend ne gère plus :
- ❌ Le folder (vient du backend)
- ❌ La construction de l'URL (retournée par le backend)
- ❌ La génération du public_id (généré par le backend)

Il envoie juste :
- ✅ Le type de document
- ✅ Le nom du fichier
- ✅ Le fichier lui-même à Cloudinary
