import { PrismaClient } from '@prisma/client';
import { seedPermissions } from './seeds/permissions.seed';

const prisma = new PrismaClient();

/**
 * Fonction principale de seed
 * Orchestration de tous les seeders
 */
async function main() {
  console.log('🌱 Starting database seeding...\n');

  const startTime = Date.now();

  try {
    // Seed des permissions
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 SEEDING PERMISSIONS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const permissionResults = await seedPermissions();

    console.log('\n📊 Permission Seed Summary:');
    console.log(`   Permissions: ${permissionResults.permissions.created} created, ${permissionResults.permissions.updated} updated, ${permissionResults.permissions.skipped} skipped`);
    console.log(`   Role Permissions: ${permissionResults.rolePermissions.created} created, ${permissionResults.rolePermissions.updated} updated, ${permissionResults.rolePermissions.skipped} skipped`);

    // Ajouter ici d'autres seeders si nécessaire
    // await seedOtherData();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Database seeding completed successfully in ${duration}s`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error) {
    console.error('\n❌ Error during database seeding:', error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
