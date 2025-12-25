# Système de Gestion des Permissions

Ce module implémente un système de contrôle d'accès hybride **RBAC (Role-Based Access Control)** et **ABAC (Attribute-Based Access Control)** pour gérer finement les permissions des utilisateurs.

## 📋 Table des matières

- [Concepts](#concepts)
- [Architecture](#architecture)
- [Utilisation](#utilisation)
- [API Endpoints](#api-endpoints)
- [Permissions disponibles](#permissions-disponibles)
- [Configuration par défaut](#configuration-par-défaut)
- [Migration](#migration)

## 🎯 Concepts

### RBAC (Role-Based Access Control)
- Les permissions sont attribuées aux **rôles** (ADMIN, SUPERVISEUR, AGENT, TRANSITAIRE)
- Un utilisateur hérite automatiquement des permissions de son rôle
- Configuration par défaut définie dans `default-role-permissions.constant.ts`

### Override Utilisateur
- Possibilité d'**accorder** des permissions supplémentaires à un utilisateur spécifique
- Possibilité de **révoquer** explicitement des permissions héritées du rôle
- Support de **permissions temporaires** avec date d'expiration

### Calcul des Permissions Effectives
```
Permissions Effectives = (Permissions du Rôle) + (Permissions Accordées) - (Permissions Révoquées)
```

## 🏗️ Architecture

### Modèles de Données

#### Permission
```prisma
model Permission {
  id          Int       @id @default(autoincrement())
  name        String    @unique      // "declarations.create"
  resource    String                 // "declarations"
  action      String                 // "create"
  description String?
  createdAt   DateTime
  updatedAt   DateTime
  deletedAt   DateTime?
}
```

#### RolePermission (RBAC)
```prisma
model RolePermission {
  id           Int       @id @default(autoincrement())
  role         UserRole               // ADMIN, SUPERVISEUR, AGENT, TRANSITAIRE
  permissionId Int
  granted      Boolean   @default(true)
  createdAt    DateTime
  updatedAt    DateTime
  deletedAt    DateTime?
}
```

#### UserPermission (Override)
```prisma
model UserPermission {
  id           Int       @id @default(autoincrement())
  userId       Int
  permissionId Int
  granted      Boolean                // true = accordé, false = révoqué
  grantedBy    Int?                  // ID de l'admin
  grantedAt    DateTime
  expiresAt    DateTime?             // Permission temporaire
  createdAt    DateTime
  updatedAt    DateTime
  deletedAt    DateTime?
}
```

## 🚀 Utilisation

### 1. Protéger une Route avec des Permissions

#### Requiert une permission spécifique
```typescript
import { RequirePermissions } from 'src/permissions';
import { PERMISSIONS } from 'src/permissions';

@Controller('declarations')
export class DeclarationsController {

  @Get()
  @RequirePermissions(PERMISSIONS.DECLARATIONS_READ)
  async findAll() {
    // Seuls les utilisateurs avec la permission 'declarations.read' peuvent accéder
  }

  @Post()
  @RequirePermissions(PERMISSIONS.DECLARATIONS_CREATE)
  async create(@Body() dto: CreateDeclarationDto) {
    // Seuls les utilisateurs avec la permission 'declarations.create' peuvent créer
  }
}
```

#### Requiert TOUTES les permissions (AND)
```typescript
@Get('export')
@RequireAllPermissions([
  PERMISSIONS.DECLARATIONS_READ,
  PERMISSIONS.DECLARATIONS_EXPORT
])
async exportDeclarations() {
  // L'utilisateur DOIT avoir les deux permissions
}
```

#### Requiert AU MOINS UNE permission (OR)
```typescript
@Post(':id/process')
@RequireAnyPermission([
  PERMISSIONS.DECLARATIONS_APPROVE,
  PERMISSIONS.DECLARATIONS_REJECT
])
async processDeclaration(@Param('id') id: number) {
  // L'utilisateur doit avoir soit 'approve' soit 'reject'
}
```

#### Vérifier l'ownership (propriétaire de la ressource)
```typescript
@Put(':id')
@RequireOwnership(PERMISSIONS.DECLARATIONS_UPDATE)
async updateOwnDeclaration(@Param('id') id: number) {
  // L'utilisateur doit avoir la permission ET être le créateur
}
```

### 2. Vérifier les Permissions dans le Code

```typescript
import { PermissionsService } from 'src/permissions';

@Injectable()
export class DeclarationsService {
  constructor(private permissionsService: PermissionsService) {}

  async someMethod(userId: number) {
    // Vérifier une permission
    const hasPermission = await this.permissionsService.checkUserPermission(
      userId,
      PERMISSIONS.DECLARATIONS_CREATE
    );

    if (!hasPermission.hasPermission) {
      throw new ForbiddenException('Permission denied');
    }

    // Vérifier plusieurs permissions (AND)
    const hasAll = await this.permissionsService.checkUserPermissions(
      userId,
      [PERMISSIONS.DECLARATIONS_READ, PERMISSIONS.DECLARATIONS_EXPORT],
      'all'
    );

    // Vérifier plusieurs permissions (OR)
    const hasAny = await this.permissionsService.checkUserPermissions(
      userId,
      [PERMISSIONS.DECLARATIONS_APPROVE, PERMISSIONS.DECLARATIONS_REJECT],
      'any'
    );
  }
}
```

### 3. Gérer les Permissions via l'API

Voir la section [API Endpoints](#api-endpoints) ci-dessous.

## 🔌 API Endpoints

### Permissions CRUD

#### Créer une permission
```http
POST /permissions
Authorization: Bearer <token>

{
  "name": "custom-resource.custom-action",
  "resource": "custom-resource",
  "action": "custom-action",
  "description": "Description de la permission"
}
```

#### Récupérer toutes les permissions
```http
GET /permissions
Authorization: Bearer <token>
```

#### Récupérer une permission
```http
GET /permissions/:id
Authorization: Bearer <token>
```

#### Mettre à jour une permission
```http
PUT /permissions/:id
Authorization: Bearer <token>

{
  "description": "Nouvelle description"
}
```

#### Supprimer une permission
```http
DELETE /permissions/:id
Authorization: Bearer <token>
```

### Gestion des Permissions par Rôle

#### Attribuer une permission à un rôle
```http
POST /permissions/roles/assign
Authorization: Bearer <token>

{
  "role": "AGENT",
  "permissionId": 1,
  "granted": true
}
```

#### Attribuer plusieurs permissions à un rôle
```http
POST /permissions/roles/assign-multiple
Authorization: Bearer <token>

{
  "role": "AGENT",
  "permissionIds": [1, 2, 3],
  "granted": true
}
```

#### Récupérer les permissions d'un rôle
```http
GET /permissions/roles/AGENT
Authorization: Bearer <token>
```

### Gestion des Permissions par Utilisateur

#### Attribuer une permission à un utilisateur
```http
POST /permissions/users/assign
Authorization: Bearer <token>

{
  "userId": 123,
  "permissionId": 1,
  "granted": true,
  "expiresAt": "2025-12-31T23:59:59.999Z"  // Optionnel
}
```

#### Attribuer plusieurs permissions à un utilisateur
```http
POST /permissions/users/assign-multiple
Authorization: Bearer <token>

{
  "userId": 123,
  "permissionIds": [1, 2, 3],
  "granted": true,
  "expiresAt": "2025-12-31T23:59:59.999Z"  // Optionnel
}
```

#### Récupérer les permissions d'un utilisateur
```http
GET /permissions/users/123
Authorization: Bearer <token>
```

Réponse:
```json
{
  "userId": 123,
  "rolePermissions": [...],        // Permissions héritées du rôle
  "grantedPermissions": [...],     // Permissions accordées directement
  "revokedPermissions": [...],     // Permissions révoquées explicitement
  "effectivePermissions": [...]    // Permissions effectives (calculées)
}
```

#### Vérifier si un utilisateur a une permission
```http
GET /permissions/users/123/check?permission=declarations.create
Authorization: Bearer <token>
```

Réponse:
```json
{
  "hasPermission": true,
  "source": "role",  // "role", "user", ou "none"
  "expiresAt": null  // Date d'expiration si applicable
}
```

#### Révoquer toutes les permissions custom d'un utilisateur
```http
DELETE /permissions/users/123/revoke-all
Authorization: Bearer <token>
```

## 📦 Permissions Disponibles

### Déclarations
- `declarations.read` - Consulter les déclarations
- `declarations.create` - Créer une déclaration
- `declarations.update` - Modifier une déclaration
- `declarations.delete` - Supprimer une déclaration
- `declarations.approve` - Approuver une déclaration
- `declarations.reject` - Rejeter une déclaration
- `declarations.export` - Exporter les déclarations

### Ordres de Mission
- `ordre-missions.read` - Consulter les ordres de mission
- `ordre-missions.create` - Créer un ordre de mission
- `ordre-missions.update` - Modifier un ordre de mission
- `ordre-missions.delete` - Supprimer un ordre de mission
- `ordre-missions.assign` - Assigner un ordre de mission
- `ordre-missions.approve` - Approuver un ordre de mission
- `ordre-missions.export` - Exporter les ordres de mission

### Utilisateurs
- `users.read` - Consulter les utilisateurs
- `users.create` - Créer un utilisateur
- `users.update` - Modifier un utilisateur
- `users.delete` - Supprimer un utilisateur
- `users.activate` - Activer un utilisateur
- `users.deactivate` - Désactiver un utilisateur
- `users.reset-password` - Réinitialiser le mot de passe
- `users.manage-permissions` - Gérer les permissions

### Agents
- `agents.read` - Consulter les agents
- `agents.create` - Créer un agent
- `agents.update` - Modifier un agent
- `agents.delete` - Supprimer un agent
- `agents.assign` - Assigner un agent

### Autres Ressources
Voir `src/permissions/constants/permissions.constant.ts` pour la liste complète.

## ⚙️ Configuration par Défaut

### ADMIN
- **Accès complet** à toutes les ressources et actions

### SUPERVISEUR
- Déclarations: **Accès complet**
- Ordres de Mission: **Accès complet**
- Escouades: **Accès complet**
- Agents: Read, Assign
- Autres: Read only

### AGENT
- Déclarations: Create, Read, Update
- Ordres de Mission: Create, Read, Update
- Colis & Transports: Create, Read, Update
- Autres: Read only

### TRANSITAIRE
- Déclarations: Read (seulement les siennes)
- Ordres de Mission: Create, Read (seulement les siens)
- Colis & Transports: Create, Read
- Autres: Read only limité

Voir `src/permissions/constants/default-role-permissions.constant.ts` pour les détails.

## 🔄 Migration

### 1. Créer la Migration
```bash
npx prisma migrate dev --name add_permission_system
```

### 2. Exécuter les Seeds
```bash
npx ts-node prisma/seeds/permissions.seed.ts
```

Ou via le seed principal si configuré:
```bash
npx prisma db seed
```

## 🔐 Sécurité

### Bonnes Pratiques
1. **Principe du moindre privilège**: Accordez uniquement les permissions nécessaires
2. **Permissions temporaires**: Utilisez `expiresAt` pour les accès temporaires
3. **Audit**: Toutes les attributions sont tracées (`grantedBy`, `grantedAt`)
4. **Révocation explicite**: Permet de bloquer des permissions même si elles viennent du rôle
5. **Soft Delete**: Les permissions ne sont jamais supprimées définitivement

### Permissions Sensibles
Les permissions suivantes nécessitent une attention particulière:
- `users.manage-permissions` - Permet de gérer les permissions d'autres utilisateurs
- `permissions.assign` - Permet d'attribuer des permissions
- `permissions.revoke` - Permet de révoquer des permissions
- `users.delete` - Permet de supprimer des utilisateurs
- `*.delete` - Toutes les permissions de suppression

## 📝 Exemples d'Usage

### Exemple 1: Donner temporairement accès à un AGENT pour approuver des déclarations
```typescript
await permissionsService.assignPermissionToUser({
  userId: 123,
  permissionId: PERMISSIONS.DECLARATIONS_APPROVE,
  granted: true,
  expiresAt: '2025-12-31T23:59:59.999Z'  // Expire fin 2025
}, adminId);
```

### Exemple 2: Empêcher un SUPERVISEUR de supprimer des déclarations
```typescript
await permissionsService.assignPermissionToUser({
  userId: 456,
  permissionId: PERMISSIONS.DECLARATIONS_DELETE,
  granted: false  // Révocation explicite
}, adminId);
```

### Exemple 3: Vérifier les permissions avant une action sensible
```typescript
const canApprove = await permissionsService.checkUserPermission(
  userId,
  PERMISSIONS.DECLARATIONS_APPROVE
);

if (!canApprove.hasPermission) {
  throw new ForbiddenException('Vous ne pouvez pas approuver cette déclaration');
}

if (canApprove.expiresAt && canApprove.expiresAt < new Date()) {
  throw new ForbiddenException('Votre permission a expiré');
}
```

## 🛠️ Développement

### Ajouter une Nouvelle Permission

1. Ajouter la constante dans `constants/permissions.constant.ts`:
```typescript
export const PERMISSIONS = {
  // ...
  NEW_RESOURCE_ACTION: 'new-resource.action',
};
```

2. Ajouter aux groupes si nécessaire:
```typescript
export const PERMISSION_GROUPS = {
  // ...
  NEW_RESOURCE: [PERMISSIONS.NEW_RESOURCE_ACTION],
};
```

3. Mettre à jour les permissions par défaut dans `default-role-permissions.constant.ts`:
```typescript
export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.ADMIN]: [
    // ...
    PERMISSIONS.NEW_RESOURCE_ACTION,
  ],
  // ...
};
```

4. Ajouter les détails dans le seed `prisma/seeds/permissions.seed.ts`:
```typescript
const PERMISSION_DETAILS = {
  // ...
  [PERMISSIONS.NEW_RESOURCE_ACTION]: {
    resource: 'new-resource',
    action: 'action',
    description: 'Description de la permission',
  },
};
```

5. Exécuter la migration et le seed:
```bash
npx ts-node prisma/seeds/permissions.seed.ts
```

## 📚 Ressources

- [NestJS Guards](https://docs.nestjs.com/guards)
- [Prisma Relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)
- [RBAC Best Practices](https://en.wikipedia.org/wiki/Role-based_access_control)
