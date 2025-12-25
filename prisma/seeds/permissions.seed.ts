import { PrismaClient, UserRole } from '@prisma/client';
import {
  PERMISSIONS,
  ALL_PERMISSIONS,
} from '../../src/permissions/constants/permissions.constant';
import { DEFAULT_ROLE_PERMISSIONS } from '../../src/permissions/constants/default-role-permissions.constant';

const prisma = new PrismaClient();

/**
 * Structure des permissions avec leurs descriptions
 */
const PERMISSION_DETAILS: Record<
  string,
  { resource: string; action: string; description: string }
> = {
  // Déclarations
  [PERMISSIONS.DECLARATIONS_READ]: {
    resource: 'declarations',
    action: 'read',
    description: 'Consulter les déclarations',
  },
  [PERMISSIONS.DECLARATIONS_CREATE]: {
    resource: 'declarations',
    action: 'create',
    description: 'Créer une nouvelle déclaration',
  },
  [PERMISSIONS.DECLARATIONS_UPDATE]: {
    resource: 'declarations',
    action: 'update',
    description: 'Modifier une déclaration existante',
  },
  [PERMISSIONS.DECLARATIONS_DELETE]: {
    resource: 'declarations',
    action: 'delete',
    description: 'Supprimer une déclaration',
  },
  [PERMISSIONS.DECLARATIONS_APPROVE]: {
    resource: 'declarations',
    action: 'approve',
    description: 'Approuver une déclaration',
  },
  [PERMISSIONS.DECLARATIONS_REJECT]: {
    resource: 'declarations',
    action: 'reject',
    description: 'Rejeter une déclaration',
  },
  [PERMISSIONS.DECLARATIONS_EXPORT]: {
    resource: 'declarations',
    action: 'export',
    description: 'Exporter les déclarations',
  },

  // Ordres de Mission
  [PERMISSIONS.ORDRE_MISSIONS_READ]: {
    resource: 'ordre-missions',
    action: 'read',
    description: 'Consulter les ordres de mission',
  },
  [PERMISSIONS.ORDRE_MISSIONS_CREATE]: {
    resource: 'ordre-missions',
    action: 'create',
    description: 'Créer un nouvel ordre de mission',
  },
  [PERMISSIONS.ORDRE_MISSIONS_UPDATE]: {
    resource: 'ordre-missions',
    action: 'update',
    description: 'Modifier un ordre de mission',
  },
  [PERMISSIONS.ORDRE_MISSIONS_DELETE]: {
    resource: 'ordre-missions',
    action: 'delete',
    description: 'Supprimer un ordre de mission',
  },
  [PERMISSIONS.ORDRE_MISSIONS_ASSIGN]: {
    resource: 'ordre-missions',
    action: 'assign',
    description: 'Assigner un ordre de mission à un agent',
  },
  [PERMISSIONS.ORDRE_MISSIONS_APPROVE]: {
    resource: 'ordre-missions',
    action: 'approve',
    description: 'Approuver un ordre de mission',
  },
  [PERMISSIONS.ORDRE_MISSIONS_EXPORT]: {
    resource: 'ordre-missions',
    action: 'export',
    description: 'Exporter les ordres de mission',
  },

  // Utilisateurs
  [PERMISSIONS.USERS_READ]: {
    resource: 'users',
    action: 'read',
    description: 'Consulter les utilisateurs',
  },
  [PERMISSIONS.USERS_CREATE]: {
    resource: 'users',
    action: 'create',
    description: 'Créer un nouvel utilisateur',
  },
  [PERMISSIONS.USERS_UPDATE]: {
    resource: 'users',
    action: 'update',
    description: 'Modifier un utilisateur',
  },
  [PERMISSIONS.USERS_DELETE]: {
    resource: 'users',
    action: 'delete',
    description: 'Supprimer un utilisateur',
  },
  [PERMISSIONS.USERS_ACTIVATE]: {
    resource: 'users',
    action: 'activate',
    description: 'Activer un utilisateur',
  },
  [PERMISSIONS.USERS_DEACTIVATE]: {
    resource: 'users',
    action: 'deactivate',
    description: 'Désactiver un utilisateur',
  },
  [PERMISSIONS.USERS_RESET_PASSWORD]: {
    resource: 'users',
    action: 'reset-password',
    description: 'Réinitialiser le mot de passe d\'un utilisateur',
  },
  [PERMISSIONS.USERS_MANAGE_PERMISSIONS]: {
    resource: 'users',
    action: 'manage-permissions',
    description: 'Gérer les permissions des utilisateurs',
  },

  // Agents
  [PERMISSIONS.AGENTS_READ]: {
    resource: 'agents',
    action: 'read',
    description: 'Consulter les agents',
  },
  [PERMISSIONS.AGENTS_CREATE]: {
    resource: 'agents',
    action: 'create',
    description: 'Créer un nouvel agent',
  },
  [PERMISSIONS.AGENTS_UPDATE]: {
    resource: 'agents',
    action: 'update',
    description: 'Modifier un agent',
  },
  [PERMISSIONS.AGENTS_DELETE]: {
    resource: 'agents',
    action: 'delete',
    description: 'Supprimer un agent',
  },
  [PERMISSIONS.AGENTS_ASSIGN]: {
    resource: 'agents',
    action: 'assign',
    description: 'Assigner un agent à une escouade',
  },

  // Maisons de Transit
  [PERMISSIONS.MAISONS_TRANSIT_READ]: {
    resource: 'maisons-transit',
    action: 'read',
    description: 'Consulter les maisons de transit',
  },
  [PERMISSIONS.MAISONS_TRANSIT_CREATE]: {
    resource: 'maisons-transit',
    action: 'create',
    description: 'Créer une nouvelle maison de transit',
  },
  [PERMISSIONS.MAISONS_TRANSIT_UPDATE]: {
    resource: 'maisons-transit',
    action: 'update',
    description: 'Modifier une maison de transit',
  },
  [PERMISSIONS.MAISONS_TRANSIT_DELETE]: {
    resource: 'maisons-transit',
    action: 'delete',
    description: 'Supprimer une maison de transit',
  },
  [PERMISSIONS.MAISONS_TRANSIT_MANAGE_STAFF]: {
    resource: 'maisons-transit',
    action: 'manage-staff',
    description: 'Gérer le personnel d\'une maison de transit',
  },

  // Bureaux de Sortie
  [PERMISSIONS.BUREAUX_SORTIES_READ]: {
    resource: 'bureaux-sorties',
    action: 'read',
    description: 'Consulter les bureaux de sortie',
  },
  [PERMISSIONS.BUREAUX_SORTIES_CREATE]: {
    resource: 'bureaux-sorties',
    action: 'create',
    description: 'Créer un nouveau bureau de sortie',
  },
  [PERMISSIONS.BUREAUX_SORTIES_UPDATE]: {
    resource: 'bureaux-sorties',
    action: 'update',
    description: 'Modifier un bureau de sortie',
  },
  [PERMISSIONS.BUREAUX_SORTIES_DELETE]: {
    resource: 'bureaux-sorties',
    action: 'delete',
    description: 'Supprimer un bureau de sortie',
  },

  // Escouades
  [PERMISSIONS.ESCOUADES_READ]: {
    resource: 'escouades',
    action: 'read',
    description: 'Consulter les escouades',
  },
  [PERMISSIONS.ESCOUADES_CREATE]: {
    resource: 'escouades',
    action: 'create',
    description: 'Créer une nouvelle escouade',
  },
  [PERMISSIONS.ESCOUADES_UPDATE]: {
    resource: 'escouades',
    action: 'update',
    description: 'Modifier une escouade',
  },
  [PERMISSIONS.ESCOUADES_DELETE]: {
    resource: 'escouades',
    action: 'delete',
    description: 'Supprimer une escouade',
  },
  [PERMISSIONS.ESCOUADES_ASSIGN_AGENTS]: {
    resource: 'escouades',
    action: 'assign-agents',
    description: 'Assigner des agents à une escouade',
  },

  // Dépositaires
  [PERMISSIONS.DEPOSITAIRES_READ]: {
    resource: 'depositaires',
    action: 'read',
    description: 'Consulter les dépositaires',
  },
  [PERMISSIONS.DEPOSITAIRES_CREATE]: {
    resource: 'depositaires',
    action: 'create',
    description: 'Créer un nouveau dépositaire',
  },
  [PERMISSIONS.DEPOSITAIRES_UPDATE]: {
    resource: 'depositaires',
    action: 'update',
    description: 'Modifier un dépositaire',
  },
  [PERMISSIONS.DEPOSITAIRES_DELETE]: {
    resource: 'depositaires',
    action: 'delete',
    description: 'Supprimer un dépositaire',
  },

  // Colis
  [PERMISSIONS.COLIS_READ]: {
    resource: 'colis',
    action: 'read',
    description: 'Consulter les colis',
  },
  [PERMISSIONS.COLIS_CREATE]: {
    resource: 'colis',
    action: 'create',
    description: 'Créer un nouveau colis',
  },
  [PERMISSIONS.COLIS_UPDATE]: {
    resource: 'colis',
    action: 'update',
    description: 'Modifier un colis',
  },
  [PERMISSIONS.COLIS_DELETE]: {
    resource: 'colis',
    action: 'delete',
    description: 'Supprimer un colis',
  },

  // Transports
  [PERMISSIONS.TRANSPORTS_READ]: {
    resource: 'transports',
    action: 'read',
    description: 'Consulter les transports',
  },
  [PERMISSIONS.TRANSPORTS_CREATE]: {
    resource: 'transports',
    action: 'create',
    description: 'Créer un nouveau transport',
  },
  [PERMISSIONS.TRANSPORTS_UPDATE]: {
    resource: 'transports',
    action: 'update',
    description: 'Modifier un transport',
  },
  [PERMISSIONS.TRANSPORTS_DELETE]: {
    resource: 'transports',
    action: 'delete',
    description: 'Supprimer un transport',
  },

  // Audit Logs
  [PERMISSIONS.AUDIT_LOGS_READ]: {
    resource: 'audit-logs',
    action: 'read',
    description: 'Consulter les logs d\'audit',
  },
  [PERMISSIONS.AUDIT_LOGS_EXPORT]: {
    resource: 'audit-logs',
    action: 'export',
    description: 'Exporter les logs d\'audit',
  },

  // Permissions
  [PERMISSIONS.PERMISSIONS_READ]: {
    resource: 'permissions',
    action: 'read',
    description: 'Consulter les permissions',
  },
  [PERMISSIONS.PERMISSIONS_ASSIGN]: {
    resource: 'permissions',
    action: 'assign',
    description: 'Attribuer des permissions',
  },
  [PERMISSIONS.PERMISSIONS_REVOKE]: {
    resource: 'permissions',
    action: 'revoke',
    description: 'Révoquer des permissions',
  },

  // Régimes
  [PERMISSIONS.REGIMES_READ]: {
    resource: 'regimes',
    action: 'read',
    description: 'Consulter les régimes',
  },
  [PERMISSIONS.REGIMES_CREATE]: {
    resource: 'regimes',
    action: 'create',
    description: 'Créer un nouveau régime',
  },
  [PERMISSIONS.REGIMES_UPDATE]: {
    resource: 'regimes',
    action: 'update',
    description: 'Modifier un régime',
  },
  [PERMISSIONS.REGIMES_DELETE]: {
    resource: 'regimes',
    action: 'delete',
    description: 'Supprimer un régime',
  },
};

/**
 * Seed des permissions
 */
export async function seedPermissions() {
  console.log('🔐 Seeding permissions...');

  // Créer toutes les permissions
  for (const permissionName of ALL_PERMISSIONS) {
    const details = PERMISSION_DETAILS[permissionName];

    if (!details) {
      console.warn(`⚠️  Détails manquants pour la permission: ${permissionName}`);
      continue;
    }

    await prisma.permission.upsert({
      where: { name: permissionName },
      update: {
        description: details.description,
        deletedAt: null,
      },
      create: {
        name: permissionName,
        resource: details.resource,
        action: details.action,
        description: details.description,
      },
    });
  }

  console.log(`✅ ${ALL_PERMISSIONS.length} permissions créées`);

  // Assigner les permissions aux rôles
  console.log('🔐 Assigning permissions to roles...');

  for (const [roleName, permissionNames] of Object.entries(
    DEFAULT_ROLE_PERMISSIONS,
  )) {
    const role = roleName as UserRole;

    for (const permissionName of permissionNames) {
      const permission = await prisma.permission.findUnique({
        where: { name: permissionName },
      });

      if (!permission) {
        console.warn(
          `⚠️  Permission non trouvée: ${permissionName} pour le rôle ${role}`,
        );
        continue;
      }

      await prisma.rolePermission.upsert({
        where: {
          role_permissionId: {
            role,
            permissionId: permission.id,
          },
        },
        update: {
          granted: true,
          deletedAt: null,
        },
        create: {
          role,
          permissionId: permission.id,
          granted: true,
        },
      });
    }

    console.log(
      `✅ ${permissionNames.length} permissions assignées au rôle ${role}`,
    );
  }

  console.log('✅ Permissions seeded successfully');
}

/**
 * Main function pour exécuter le seed indépendamment
 */
async function main() {
  try {
    await seedPermissions();
  } catch (error) {
    console.error('❌ Error seeding permissions:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  main();
}
