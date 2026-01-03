
import 'dotenv/config';
import prisma from './lib/prisma';

async function main() {
  try {
    console.log('Attempting to initialize and connect Prisma...');
    // The error was "PrismaClient needs to be constructed with...", so just reaching here implies construction succeeded.
    // We also try to connect to verify everything is wired up correctly.
    await prisma.$connect();
    console.log('✅ Success: Prisma Client initialized and connected to the database.');
    await prisma.$disconnect();
  } catch (e) {
    console.error('❌ Error:', e);
    process.exit(1);
  }
}

main();
