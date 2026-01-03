const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const leaves = await prisma.leaveRequest.findMany({
    include: {
      user: {
        select: {
          name: true,
          companyId: true
        }
      }
    }
  });
  console.log('Leaves:', JSON.stringify(leaves, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
