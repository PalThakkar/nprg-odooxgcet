import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        include: { role: true, company: true }
    });
    console.log('Total Users:', users.length);
    users.forEach(u => {
        console.log(`ID: ${u.id} | Email: ${u.email} | Role: ${u.role?.name} | Company: ${u.company?.name} (${u.companyId})`);
    });

    const roles = await prisma.role.findMany();
    console.log('Available Roles:', roles.map(r => r.name));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
