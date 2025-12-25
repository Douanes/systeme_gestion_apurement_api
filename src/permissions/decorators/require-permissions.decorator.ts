import { SetMetadata } from '@nestjs/common';

/**
 * Clé de métadonnée pour les permissions requises
 */
export const PERMISSIONS_KEY = 'permissions';

/**
 * Options pour le décorateur de permissions
 */
export interface PermissionOptions {
  /**
   * Mode de vérification
   * - 'all': L'utilisateur doit avoir TOUTES les permissions spécifiées (AND)
   * - 'any': L'utilisateur doit avoir AU MOINS UNE des permissions spécifiées (OR)
   */
  mode?: 'all' | 'any';

  /**
   * Si true, vérifie uniquement l'ownership de la ressource
   * L'utilisateur doit être le propriétaire de la ressource pour y accéder
   */
  requireOwnership?: boolean;

  /**
   * Champ à vérifier pour l'ownership (par défaut: 'createdById' ou 'userId')
   */
  ownershipField?: string;
}

/**
 * Décorateur pour spécifier les permissions requises pour accéder à une route
 *
 * @param permissions - Liste des permissions requises
 * @param options - Options de vérification
 *
 * @example
 * // Requiert la permission 'declarations.create'
 * @RequirePermissions('declarations.create')
 * createDeclaration() { ... }
 *
 * @example
 * // Requiert TOUTES les permissions
 * @RequirePermissions(['declarations.create', 'declarations.update'], { mode: 'all' })
 * manageDeclaration() { ... }
 *
 * @example
 * // Requiert AU MOINS UNE des permissions
 * @RequirePermissions(['declarations.approve', 'declarations.reject'], { mode: 'any' })
 * processDeclaration() { ... }
 *
 * @example
 * // Requiert la permission ET l'ownership
 * @RequirePermissions('declarations.update', { requireOwnership: true })
 * updateOwnDeclaration() { ... }
 */
export const RequirePermissions = (
  permissions: string | string[],
  options: PermissionOptions = {},
) => {
  const permissionsArray = Array.isArray(permissions) ? permissions : [permissions];
  const defaultOptions: PermissionOptions = {
    mode: 'all',
    requireOwnership: false,
    ...options,
  };

  return SetMetadata(PERMISSIONS_KEY, {
    permissions: permissionsArray,
    options: defaultOptions,
  });
};

/**
 * Décorateur pour vérifier l'ownership d'une ressource
 * Équivalent à @RequirePermissions avec requireOwnership: true
 *
 * @example
 * @RequireOwnership('declarations.update')
 * updateOwnDeclaration() { ... }
 */
export const RequireOwnership = (
  permissions: string | string[],
  ownershipField?: string,
) => {
  return RequirePermissions(permissions, {
    requireOwnership: true,
    ownershipField,
  });
};

/**
 * Décorateur pour vérifier qu'au moins une permission est présente (OR)
 *
 * @example
 * @RequireAnyPermission(['declarations.approve', 'declarations.reject'])
 * processDeclaration() { ... }
 */
export const RequireAnyPermission = (permissions: string[]) => {
  return RequirePermissions(permissions, { mode: 'any' });
};

/**
 * Décorateur pour vérifier que toutes les permissions sont présentes (AND)
 *
 * @example
 * @RequireAllPermissions(['declarations.read', 'declarations.export'])
 * exportDeclarations() { ... }
 */
export const RequireAllPermissions = (permissions: string[]) => {
  return RequirePermissions(permissions, { mode: 'all' });
};
