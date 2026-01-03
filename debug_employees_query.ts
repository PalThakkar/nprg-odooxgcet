
import 'dotenv/config';
import prisma from './lib/prisma';

async function main() {
  try {
    console.log('Connecting...');
    await prisma.$connect();
    console.log('Connected.');

    // Find a company
    const company = await prisma.company.findFirst();
    if (!company) {
        console.log('No company found.');
        return;
    }
    console.log('Using company:', company.id, company.name);

    const companyId = company.id;

    console.log('Executing query...');
    const employees = await prisma.user.findMany({
      where: {
        companyId: companyId,
        role: { name: 'user' }
      },
      include: {
        role: true,
        salaryInfo: true,
        privateInfo: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log('Query successful.');
    console.log('Employees found:', employees.length);
    if (employees.length > 0) {
        console.log('First employee:', JSON.stringify(employees[0], null, 2));
    }

  } catch (e) {
    console.error('❌ Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
