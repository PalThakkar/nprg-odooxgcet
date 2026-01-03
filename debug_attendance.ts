
import prisma from './lib/prisma';

async function main() {
  console.log('Checking for open attendance records...');
  const openSessions = await prisma.attendance.findMany({
    where: {
      checkOut: null
    },
    include: {
        user: true
    }
  });

  console.log(`Found ${openSessions.length} open sessions.`);
  
  openSessions.forEach(session => {
    console.log(`User: ${session.user.name} (${session.userId}) - Date: ${session.date} - CheckIn: ${session.checkIn}`);
  });
  
  // Check specifically for duplicate open sessions per user
  const userCounts = openSessions.reduce((acc, session) => {
    acc[session.userId] = (acc[session.userId] || 0) + 1;
    return acc;
  }, {});
  
  Object.entries(userCounts).forEach(([userId, count]) => {
      // @ts-ignore
      if (count > 1) {
          console.log(`WARNING: User ${userId} has ${count} open sessions!`);
      }
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
