# Upload de documents - Ordre de Mission

## Vue d'ensemble

L'upload de documents pour les ordres de mission se fait en **3 etapes** :

1. **Obtenir une signature** depuis le backend
2. **Uploader le fichier** directement sur Cloudinary depuis le frontend
3. **Enregistrer les metadonnees** du document dans le backend

Les fichiers sont stockes en mode `authenticated` sur Cloudinary, ce qui signifie qu'ils ne sont accessibles que via des URLs signees generees par le serveur.

---

## Etape 1 : Obtenir la signature d'upload

### `POST /ordres-mission/upload-signature`

**Headers :**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body :**
```json
{
  "fileName": "bon_de_livraison.pdf"
}
```

**Reponse (201) :**
```json
{
  "upload_url": "https://api.cloudinary.com/v1_1/dbwj6eccm/raw/upload",
  "signature": "a1b2c3d4e5f6...",
  "timestamp": 1771162283,
  "api_key": "411417854393229",
  "cloud_name": "dbwj6eccm",
  "public_id": "ordre-mission-documents/document_bon_de_livraison_1771162283596",
  "resource_type": "raw",
  "type": "authenticated"
}
```

---

## Etape 2 : Uploader le fichier sur Cloudinary

Envoyer le fichier directement a Cloudinary en utilisant les informations de l'etape 1.

### Requete `POST` vers `upload_url`

**Format : `multipart/form-data`**

| Champ           | Valeur                                    | Description                        |
|-----------------|-------------------------------------------|------------------------------------|
| `file`          | *(le fichier binaire)*                    | Le fichier a uploader              |
| `api_key`       | `api_key` de l'etape 1                    | Cle API Cloudinary                 |
| `timestamp`     | `timestamp` de l'etape 1                  | Timestamp de la signature          |
| `signature`     | `signature` de l'etape 1                  | Signature generee par le serveur   |
| `public_id`     | `public_id` de l'etape 1                  | Identifiant unique du fichier      |
| `type`          | `authenticated`                           | Mode d'acces prive                 |
| `resource_type` | `raw`                                     | Type de ressource                  |

### Exemple JavaScript/TypeScript (Frontend)

```typescript
// Etape 1 : Obtenir la signature
const signatureResponse = await fetch('/api/ordres-mission/upload-signature', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ fileName: file.name }),
});
const signatureData = await signatureResponse.json();

// Etape 2 : Uploader sur Cloudinary
const formData = new FormData();
formData.append('file', file);
formData.append('api_key', signatureData.api_key);
formData.append('timestamp', String(signatureData.timestamp));
formData.append('signature', signatureData.signature);
formData.append('public_id', signatureData.public_id);
formData.append('type', signatureData.type);
formData.append('resource_type', signatureData.resource_type);

const cloudinaryResponse = await fetch(signatureData.upload_url, {
  method: 'POST',
  body: formData,
});
const cloudinaryData = await cloudinaryResponse.json();
```

### Reponse Cloudinary (succes) :

```json
{
  "asset_id": "4063428cb62d60b31fbe35a83177b063",
  "public_id": "ordre-mission-documents/document_bon_de_livraison_1771162283596.pdf",
  "version": 1771163808,
  "signature": "968734f7000731b1f9b5f5c6ecd34faeadf5412b",
  "resource_type": "raw",
  "created_at": "2026-02-15T13:56:48Z",
  "bytes": 212432,
  "type": "authenticated",
  "url": "http://res.cloudinary.com/...",
  "secure_url": "https://res.cloudinary.com/...",
  "original_filename": "bon_de_livraison",
  "api_key": "411417854393229"
}
```

---

## Etape 3 : Enregistrer le document dans le backend

### `POST /ordres-mission/:id/documents`

**Headers :**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body :**

Utiliser les champs de la reponse Cloudinary pour remplir le body :

```json
{
  "fileName": "bon_de_livraison.pdf",
  "fileUrl": "<secure_url de la reponse Cloudinary>",
  "fileSize": 212432,
  "mimeType": "application/pdf",
  "publicId": "<public_id de la reponse Cloudinary>"
}
```

### Correspondance des champs (Cloudinary -> Backend)

| Champ Backend | Champ Cloudinary | Description                              |
|---------------|------------------|------------------------------------------|
| `fileName`    | *(nom original)* | Nom du fichier original                  |
| `fileUrl`     | `secure_url`     | URL HTTPS du fichier                     |
| `fileSize`    | `bytes`          | Taille du fichier en octets              |
| `mimeType`    | *(type du fichier)* | Type MIME (application/pdf, image/jpeg, etc.) |
| `publicId`    | `public_id`      | Identifiant Cloudinary du fichier        |

> **Note :** Le champ `mimeType` n'est pas retourne par Cloudinary pour les uploads `raw`. Il faut le determiner cote frontend a partir du fichier original (`file.type` en JavaScript).

### Exemple complet (Etape 3) :

```typescript
// Etape 3 : Enregistrer dans le backend
const documentData = {
  fileName: file.name,                        // nom original du fichier
  fileUrl: cloudinaryData.secure_url,          // secure_url de Cloudinary
  fileSize: cloudinaryData.bytes,              // taille en octets
  mimeType: file.type,                         // type MIME du fichier original
  publicId: cloudinaryData.public_id,          // public_id de Cloudinary
};

const saveResponse = await fetch(`/api/ordres-mission/${ordreId}/documents`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(documentData),
});
const savedDocument = await saveResponse.json();
```

**Reponse (201) :**
```json
{
  "id": 1,
  "ordreMissionId": 5,
  "maisonTransitId": 2,
  "fileName": "bon_de_livraison.pdf",
  "fileUrl": "https://res.cloudinary.com/...",
  "fileSize": 212432,
  "mimeType": "application/pdf",
  "publicId": "ordre-mission-documents/document_bon_de_livraison_1771162283596.pdf",
  "uploadedById": 3,
  "uploadedAt": "2026-02-15T14:00:00.000Z",
  "maisonTransit": {
    "id": 2,
    "name": "Transport Express SARL",
    "code": "MT-12345678"
  },
  "uploadedBy": {
    "id": 3,
    "firstname": "Amadou",
    "lastname": "Diallo"
  }
}
```

> **Note :** Le champ `maisonTransitId` est automatiquement rempli par le backend a partir de la maison de transit de l'utilisateur connecte.

---

## Consulter les documents

### Dans le detail d'un ordre : `GET /ordres-mission/:id`

Les documents sont inclus dans la reponse du `findOne` avec des **URLs signees** :

```json
{
  "id": 5,
  "number": "26-000001",
  "documents": [
    {
      "id": 1,
      "fileName": "bon_de_livraison.pdf",
      "fileUrl": "https://res.cloudinary.com/.../authenticated/s--xxxx--/v1771163808/...",
      "fileSize": 212432,
      "mimeType": "application/pdf",
      "publicId": "ordre-mission-documents/document_bon_de_livraison_1771162283596.pdf",
      "uploadedAt": "2026-02-15T14:00:00.000Z",
      "maisonTransit": { "id": 2, "name": "Transport Express SARL", "code": "MT-12345678" },
      "uploadedBy": { "id": 3, "firstname": "Amadou", "lastname": "Diallo" }
    }
  ]
}
```

### Liste dediee : `GET /ordres-mission/:id/documents`

Retourne uniquement les documents. Les TRANSITAIRE/DECLARANT ne voient que les documents de leur maison de transit.

---

## Supprimer un document

### `DELETE /ordres-mission/:id/documents/:documentId`

**Headers :**
```
Authorization: Bearer <token>
```

**Reponse (200) :**
```json
{
  "message": "Document supprimé avec succès"
}
```

> **Permissions :** Les TRANSITAIRE/DECLARANT ne peuvent supprimer que les documents de leur maison de transit. Les ADMIN/AGENT/SUPERVISEUR peuvent supprimer tous les documents.

---

## Securite

- Les fichiers sont uploades en mode **`authenticated`** sur Cloudinary
- Les URLs brutes stockees en base ne sont **pas accessibles** directement (erreur 403)
- Seules les **URLs signees** generees par le serveur permettent d'acceder aux fichiers
- La signature est generee avec l'`API_SECRET` Cloudinary, qui n'est jamais expose au frontend
- Les URLs signees Cloudinary **n'expirent pas** (contrairement a AWS S3 presigned URLs)
- Pour revoquer l'acces a un fichier, il faut le supprimer de Cloudinary

---

## Types de fichiers supportes

L'upload supporte tous les types de fichiers. Le comportement d'affichage differe :

| Type          | Extensions                          | Comportement                  |
|---------------|-------------------------------------|-------------------------------|
| **Images**    | jpg, jpeg, png, gif, webp, svg, bmp | Affichage inline (navigateur) |
| **Documents** | pdf, docx, xlsx, etc.               | Telechargement force          |

---

## Code complet (Frontend)

```typescript
async function uploadDocument(ordreId: number, file: File, token: string) {
  // 1. Obtenir la signature
  const sigRes = await fetch('/api/ordres-mission/upload-signature', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileName: file.name }),
  });
  const sigData = await sigRes.json();

  // 2. Upload sur Cloudinary
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', sigData.api_key);
  formData.append('timestamp', String(sigData.timestamp));
  formData.append('signature', sigData.signature);
  formData.append('public_id', sigData.public_id);
  formData.append('type', sigData.type);
  formData.append('resource_type', sigData.resource_type);

  const cloudRes = await fetch(sigData.upload_url, {
    method: 'POST',
    body: formData,
  });
  const cloudData = await cloudRes.json();

  // 3. Enregistrer dans le backend
  const saveRes = await fetch(`/api/ordres-mission/${ordreId}/documents`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileName: file.name,
      fileUrl: cloudData.secure_url,
      fileSize: cloudData.bytes,
      mimeType: file.type,
      publicId: cloudData.public_id,
    }),
  });

  return await saveRes.json();
}
```
