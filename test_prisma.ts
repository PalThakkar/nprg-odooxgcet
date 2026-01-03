import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('User model fields:');
  // @ts-ignore
  console.log(Object.keys(prisma.user.fields || {}));
}

main().catch(console.error);
