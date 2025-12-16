import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'libs/dto/auth';

/**
 * Decorator pour spécifier les rôles autorisés à accéder à une route
 *
 * @example
 * @Roles(UserRole.ADMIN, UserRole.SUPERVISEUR)
 * @Get('admin-only')
 * adminOnlyRoute() { ... }
 */
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
