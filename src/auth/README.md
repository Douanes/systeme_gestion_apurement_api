# Module d'Authentification

Ce module fournit un système d'authentification complet avec JWT, vérification d'email, et contrôle d'accès basé sur les rôles.

## Utilisation des Guards et Decorators

### 1. Protéger une route (Authentication requise)

Par défaut, toutes les routes sont publiques. Pour protéger une route avec authentification JWT :

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators';

@Controller('profile')
@UseGuards(JwtAuthGuard)  // Toutes les routes de ce controller nécessitent une authentification
export class ProfileController {

    @Get()
    getProfile(@CurrentUser() user) {
        return user;  // Retourne l'utilisateur connecté
    }

    @Get('id')
    getMyId(@CurrentUser('id') userId: number) {
        return { id: userId };  // Récupère uniquement l'ID
    }
}
```

### 2. Route publique (Pas d'authentification)

Pour marquer une route spécifique comme publique :

```typescript
import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators';

@Controller('public')
export class PublicController {

    @Get()
    @Public()  // Cette route est accessible sans authentification
    getPublicData() {
        return { message: 'Données publiques' };
    }
}
```

### 3. Contrôle d'accès par rôle

Pour limiter l'accès à certains rôles :

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators';
import { UserRole } from 'libs/dto/auth';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)  // Ordre important : JWT puis Roles
export class AdminController {

    @Get()
    @Roles(UserRole.ADMIN)  // Seuls les ADMIN peuvent accéder
    adminOnly() {
        return { message: 'Admin only' };
    }

    @Get('superviseur')
    @Roles(UserRole.ADMIN, UserRole.SUPERVISEUR)  // ADMIN ou SUPERVISEUR
    adminOrSuperviseur() {
        return { message: 'Admin ou Superviseur' };
    }
}
```

### 4. Combinaison complète (Auth + Rôles + CurrentUser)

```typescript
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, CurrentUser } from '../auth/decorators';
import { UserRole } from 'libs/dto/auth';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {

    @Post('create-admin')
    @Roles(UserRole.ADMIN)  // Seuls les ADMIN peuvent créer des ADMIN
    createAdmin(
        @Body() createUserDto: any,
        @CurrentUser() currentUser: any
    ) {
        return {
            message: 'Admin créé',
            createdBy: currentUser.username
        };
    }

    @Get('my-profile')
    @Roles(UserRole.ADMIN, UserRole.SUPERVISEUR, UserRole.TRANSITAIRE, UserRole.AGENT)
    getMyProfile(@CurrentUser() user: any) {
        return user;
    }
}
```

## Rôles disponibles

```typescript
enum UserRole {
    ADMIN = 'ADMIN',
    SUPERVISEUR = 'SUPERVISEUR',
    TRANSITAIRE = 'TRANSITAIRE',
    AGENT = 'AGENT',
}
```

## Decorators disponibles

### @Public()
Marque une route comme publique (pas d'authentification requise)

### @Roles(...roles: UserRole[])
Spécifie les rôles autorisés à accéder à la route

### @CurrentUser()
Récupère l'utilisateur authentifié depuis la requête
- `@CurrentUser()` - Retourne l'objet utilisateur complet
- `@CurrentUser('id')` - Retourne uniquement l'ID
- `@CurrentUser('email')` - Retourne uniquement l'email

## Guards disponibles

### JwtAuthGuard
Vérifie que la requête contient un token JWT valide

### RolesGuard
Vérifie que l'utilisateur a l'un des rôles requis

## Structure de l'utilisateur retourné

```typescript
{
    id: number;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    role: UserRole;
    isActive: boolean;
    emailVerified: boolean;
}
```

## Bonnes pratiques

1. **Ordre des Guards** : Toujours mettre `JwtAuthGuard` avant `RolesGuard`
   ```typescript
   @UseGuards(JwtAuthGuard, RolesGuard)  // ✅ Correct
   @UseGuards(RolesGuard, JwtAuthGuard)  // ❌ Incorrect
   ```

2. **Routes publiques** : Utiliser `@Public()` uniquement sur les routes qui doivent être accessibles sans authentification

3. **Rôles** : Être spécifique sur les rôles requis, ne pas donner plus de permissions que nécessaire

4. **CurrentUser** : Toujours typer l'utilisateur pour la sécurité TypeScript
   ```typescript
   @CurrentUser() user: { id: number; role: UserRole; ... }
   ```
