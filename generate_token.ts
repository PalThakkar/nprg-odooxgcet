
import 'dotenv/config';
import { SignJWT } from 'jose';
import prisma from './lib/prisma';

const SECRET_KEY = process.env.JWT_SECRET || 'fallback-secret-for-dev';
const key = new TextEncoder().encode(SECRET_KEY);

async function signToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

async function main() {
  try {
    await prisma.$connect();
    const company = await prisma.company.findFirst();
    if (!company) {
        console.log('No company found');
        return;
    }
    
    // Create a fake admin payload
    const payload = {
        id: 'admin-id',
        role: 'admin',
        companyId: company.id,
        loginId: 'ADMIN001'
    };

    const token = await signToken(payload);
    console.log('Token:', token);
    console.log('\nCurl command:');
    console.log(`curl -v http://localhost:3000/api/admin/employees -H "Authorization: Bearer ${token}"`);

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
