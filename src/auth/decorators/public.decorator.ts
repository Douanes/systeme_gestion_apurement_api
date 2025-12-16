import { SetMetadata } from '@nestjs/common';

/**
 * Decorator pour marquer une route comme publique (pas besoin d'authentification)
 */
export const Public = () => SetMetadata('isPublic', true);
