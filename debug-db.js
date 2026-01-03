const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany({
            include: { role: true, company: true }
        });
        console.log('Total Users:', users.length);
        users.forEach(u => {
            console.log(`ID: ${u.id} | Email: ${u.email} | Role: ${u.role?.name} | Company: ${u.company?.name} (${u.companyId})`);
        });

        const roles = await prisma.role.findMany();
        console.log('Available Roles:', roles.map(r => r.name));
    } catch (err) {
        console.error('Prisma Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
