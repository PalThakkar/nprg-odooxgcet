import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type SalaryInfoWithUser = Prisma.SalaryInfoGetPayload<{
    include: {
        user: {
            select: {
                id: true;
                name: true;
                email: true;
                employeeId: true;
                department: true;
                jobTitle: true;
                dateJoined: true;
            };
        };
    };
}>;

type PayrollWithUser = Prisma.PayrollGetPayload<{
    include: {
        user: {
            select: {
                id: true;
                name: true;
                employeeId: true;
                department: true;
            };
        };
    };
}>;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const employeeId = searchParams.get("employeeId");
        const month = searchParams.get("month"); // Format: "2026-01"
        const department = searchParams.get("department");

        // Build where clause for payroll
        const payrollWhere: {
            userId?: string;
            payPeriod?: string;
        } = {};

        if (employeeId) {
            payrollWhere.userId = employeeId;
        }
        if (month) {
            payrollWhere.payPeriod = month;
        }

        // Fetch salary information for all employees
        const salaryRecords: SalaryInfoWithUser[] = await prisma.salaryInfo.findMany({
            where: employeeId ? { userId: employeeId } : undefined,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        employeeId: true,
                        department: true,
                        jobTitle: true,
                        dateJoined: true,
                    },
                },
            },
        });

        // Filter by department if specified
        const filteredRecords = department
            ? salaryRecords.filter((r) => r.user.department === department)
            : salaryRecords;

        // Fetch payroll records
        const payrollRecords: PayrollWithUser[] = await prisma.payroll.findMany({
            where: payrollWhere,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        employeeId: true,
                        department: true,
                    },
                },
            },
            orderBy: {
                payPeriod: "desc",
            },
        });

        // Calculate summary
        const totalMonthlyWage = filteredRecords.reduce(
            (sum, r) => sum + r.monthlyWage,
            0
        );
        const totalYearlyWage = filteredRecords.reduce(
            (sum, r) => sum + r.yearlyWage,
            0
        );
        const totalEmployerPF = filteredRecords.reduce(
            (sum, r) => sum + r.pfEmployer,
            0
        );
        const totalEmployeePF = filteredRecords.reduce(
            (sum, r) => sum + r.pfEmployee,
            0
        );

        // Group by department
        const departmentWages: Record<
            string,
            { department: string; totalWage: number; employeeCount: number }
        > = {};
        filteredRecords.forEach((record) => {
            const dept = record.user.department || "Unassigned";
            if (!departmentWages[dept]) {
                departmentWages[dept] = {
                    department: dept,
                    totalWage: 0,
                    employeeCount: 0,
                };
            }
            departmentWages[dept].totalWage += record.monthlyWage;
            departmentWages[dept].employeeCount++;
        });

        return NextResponse.json({
            success: true,
            data: {
                salarySlips: filteredRecords.map((r) => ({
                    id: r.id,
                    employeeId: r.user.employeeId,
                    employeeName: r.user.name,
                    email: r.user.email,
                    department: r.user.department,
                    jobTitle: r.user.jobTitle,
                    dateJoined: r.user.dateJoined,
                    // Earnings
                    basic: r.basic,
                    hra: r.hra,
                    standardAllowance: r.standardAllowance,
                    performanceBonus: r.performanceBonus,
                    lta: r.lta,
                    fixedAllowance: r.fixedAllowance,
                    grossEarnings:
                        r.basic +
                        r.hra +
                        r.standardAllowance +
                        r.performanceBonus +
                        r.lta +
                        r.fixedAllowance,
                    // Deductions
                    pfEmployee: r.pfEmployee,
                    professionalTax: r.professionalTax,
                    totalDeductions: r.pfEmployee + r.professionalTax,
                    // Net
                    monthlyWage: r.monthlyWage,
                    yearlyWage: r.yearlyWage,
                    // Additional
                    pfEmployer: r.pfEmployer,
                    workingDays: r.workingDays,
                    workingHours: r.workingHours,
                })),
                payrollHistory: payrollRecords.map((p) => ({
                    id: p.id,
                    employeeId: p.user.employeeId,
                    employeeName: p.user.name,
                    department: p.user.department,
                    payPeriod: p.payPeriod,
                    basicSalary: p.basicSalary,
                    allowances: p.allowances,
                    deductions: p.deductions,
                    netSalary: p.netSalary,
                    status: p.status,
                    processedAt: p.processedAt,
                })),
                summary: {
                    totalEmployees: filteredRecords.length,
                    totalMonthlyWage: Math.round(totalMonthlyWage * 100) / 100,
                    totalYearlyWage: Math.round(totalYearlyWage * 100) / 100,
                    averageSalary:
                        filteredRecords.length > 0
                            ? Math.round((totalMonthlyWage / filteredRecords.length) * 100) /
                            100
                            : 0,
                    totalEmployerPF: Math.round(totalEmployerPF * 100) / 100,
                    totalEmployeePF: Math.round(totalEmployeePF * 100) / 100,
                },
                departmentBreakdown: Object.values(departmentWages),
            },
        });
    } catch (error) {
        console.error("Salary Report Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to generate salary report" },
            { status: 500 }
        );
    }
}
