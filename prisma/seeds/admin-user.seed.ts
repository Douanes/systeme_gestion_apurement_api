import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Seed pour créer un utilisateur admin par défaut
 * ATTENTION: À utiliser uniquement en développement local!
 */
export async function seedAdminUser() {
  // Vérifier qu'on est en environnement de développement
  if (process.env.NODE_ENV === 'production') {
    console.log('⚠️  Admin user seed skipped in production environment');
    return {
      created: 0,
      skipped: 1,
      message: 'Skipped in production',
    };
  }

  console.log('👤 Starting admin user seed (LOCAL ONLY)...');

  const adminEmail = 'admin@apurement.sn';
  const adminUsername = 'admin';
  const adminPassword = 'Admin@2024'; // Mot de passe par défaut pour dev

  try {
    // Vérifier si l'admin existe déjà
    const existingAdmin = await prisma.user.findFirst({
      where: {
        OR: [{ email: adminEmail }, { username: adminUsername }],
      },
    });

    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists, skipping...');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Username: ${existingAdmin.username}`);
      return {
        created: 0,
        skipped: 1,
        message: 'Admin already exists',
      };
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // Créer l'utilisateur admin
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        username: adminUsername,
        passwordHash: passwordHash,
        firstname: 'Super',
        lastname: 'Admin',
        phone: '+221 77 000 00 00',
        role: UserRole.ADMIN,
        isActive: true,
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    ', admin.email);
    console.log('👤 Username: ', admin.username);
    console.log('🔑 Password: ', adminPassword);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  IMPORTANT: Change this password in production!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return {
      created: 1,
      skipped: 0,
      message: 'Admin user created',
      credentials: {
        email: admin.email,
        username: admin.username,
        password: adminPassword,
      },
    };
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  }
}

/**
 * Script autonome pour créer l'admin
 * Peut être exécuté directement: npx ts-node prisma/seeds/admin-user.seed.ts
 */
if (require.main === module) {
  seedAdminUser()
    .then((result) => {
      console.log('Seed completed:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed failed:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
