import prisma from './prisma';

/**
 * Generates a unique Login ID for an employee based on the format:
 * [CompanyInitials][NameInitials][Year][SerialNumber]
 * Example: OIJODO20220001
 * 
 * @param companyId The ID of the company
 * @param companyInitials The 2-letter initials of the company (e.g., "OI")
 * @param employeeName Full name of the employee (e.g., "John Doe")
 * @param joiningYear The year of joining (e.g., 2022)
 */
export async function generateLoginId(
  companyId: string,
  companyInitials: string,
  employeeName: string,
  joiningYear: number = new Date().getFullYear(),
  tx?: any
): Promise<string> {
  const db = tx || prisma;
  // 1. Get Name Initials (First 2 chars of first name + First 2 chars of last name)
  const nameParts = employeeName.trim().split(/\s+/);
  let nameInitials = '';

  if (nameParts.length >= 2) {
    const first = nameParts[0].substring(0, 2).toUpperCase();
    const last = nameParts[nameParts.length - 1].substring(0, 2).toUpperCase();
    nameInitials = (first.padEnd(2, 'X') + last.padEnd(2, 'X')).substring(0, 4);
  } else if (nameParts.length === 1) {
    nameInitials = nameParts[0].substring(0, 4).toUpperCase().padEnd(4, 'X');
  } else {
    nameInitials = 'XXXX';
  }

  // 2. Atomic increment of the serial counter for this company and year
  const counter = await db.employeeCounter.upsert({
    where: {
      companyId_year: {
        companyId,
        year: joiningYear,
      },
    },
    update: {
      count: {
        increment: 1,
      },
    },
    create: {
      companyId,
      year: joiningYear,
      count: 1,
    },
  });

  // 3. Format Serial Number (0001)
  const serialNumber = counter.count.toString().padStart(4, '0');

  // 4. Combine parts
  // Format: [CO][NAME][YEAR][SERIAL]
  return `${companyInitials.toUpperCase().substring(0, 2)}${nameInitials}${joiningYear}${serialNumber}`;
}
