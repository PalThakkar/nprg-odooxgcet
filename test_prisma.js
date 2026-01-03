const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
console.log('User keys:', Object.keys(prisma.user || {}));
console.log('User status field defined?', !!(prisma.user && prisma.user.create));
process.exit(0);
