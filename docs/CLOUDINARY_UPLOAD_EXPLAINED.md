# Cloudinary Upload - Explication complète

## 🎯 Question posée

> "Au lieu de retourner la signature, est-ce qu'on peut retourner l'URL directement pour upload le fichier ?"

## ✅ Réponse : Oui ET Non

### ❌ Impossible : URL Pré-signée complète (comme AWS S3)

Cloudinary **ne supporte PAS** les URLs pré-signées comme AWS S3.

**AWS S3 peut faire :**
```
URL = https://bucket.s3.amazonaws.com/file.pdf?signature=xyz&expires=123
→ Le frontend fait un simple PUT vers cette URL avec le fichier
```

**Cloudinary ne peut PAS :**
- Cloudinary nécessite toujours d'envoyer les paramètres dans le FormData
- On ne peut pas juste faire `PUT file → URL`

### ✅ Possible : Simplifier au maximum côté frontend

C'est ce qu'on a implémenté !

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
  "upload_url": "https://api.cloudinary.com/v1_1/votre-cloud/auto/upload",  // ← URL complète
  "signature": "abc123...",                                                  // ← Signature cryptée
  "timestamp": 1703419200,                                                   // ← Timestamp
  "api_key": "123456789",                                                    // ← API key
  "cloud_name": "votre-cloud",                                               // ← Cloud name
  "public_id": "maison-transit-documents/REGISTRE_COMMERCE_RC_..._1703419200" // ← ID unique (inclut le dossier)
}
```

> **Note importante:** Le paramètre `folder` n'est **pas** inclus dans la réponse car il n'est pas dans la signature. Le `public_id` contient déjà le chemin complet avec le dossier (`maison-transit-documents/...`), donc envoyer `folder` séparément à Cloudinary causerait une erreur de signature invalide.

### 3️⃣ Frontend upload vers Cloudinary

```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('api_key', api_key);
formData.append('timestamp', timestamp);
formData.append('signature', signature);
formData.append('public_id', public_id);
// ⚠️ IMPORTANT: Ne PAS envoyer 'folder' - il est déjà dans le public_id !
// formData.append('folder', folder); // ❌ ERREUR: causerait "Invalid Signature"

fetch(upload_url, { method: 'POST', body: formData })
```

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
  "secure_url": "https://res.cloudinary.com/.../REGISTRE_COMMERCE_RC_..._1703419200.pdf",
  "public_id": "maison-transit-documents/REGISTRE_COMMERCE_RC_..._1703419200",
  "bytes": 245600,
  "format": "pdf"
}
```

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

   // ❌ INCORRECT - Ne PAS envoyer ces paramètres:
   // formData.append('folder', ...);        // Pas dans la signature !
   // formData.append('upload_preset', ...); // Pas dans la signature !
   // formData.append('cloud_name', ...);    // Pas dans la signature !
   ```

   > **Important**: Envoyez **uniquement** les paramètres qui ont été signés côté serveur. Actuellement, seuls `public_id` et `timestamp` sont signés, donc envoyez seulement ces paramètres + `file`, `api_key` et `signature`.

2. **Vérifiez la réponse du backend:**
   - Si un paramètre est retourné mais cause une erreur de signature, ne l'envoyez pas
   - Seuls `api_key`, `timestamp`, `signature`, `public_id` doivent être envoyés

3. **Le `public_id` contient déjà le folder:**
   ```
   public_id = "maison-transit-documents/REGISTRE_COMMERCE_file_123456"
                └────────── folder ──────────┘└────── filename ──────┘
   ```
   Donc pas besoin d'envoyer `folder` séparément.

## 🔒 Sécurité

### Pourquoi on ne peut PAS utiliser une URL pré-signée simple

1. **Cloudinary nécessite une signature** dans le FormData
2. La signature est générée avec le `API_SECRET` (côté serveur uniquement)
3. Si on exposait le `API_SECRET` au frontend, n'importe qui pourrait uploader

### Ce qu'on fait (sécurisé)

1. ✅ Le `API_SECRET` reste sur le serveur
2. ✅ Le backend génère la signature avec les bons paramètres
3. ✅ Le frontend reçoit la signature (valide 10 minutes)
4. ✅ Cloudinary vérifie que la signature correspond aux paramètres envoyés

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
