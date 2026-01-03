import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        // Get total employees count
        const totalEmployees = await prisma.user.count();

        // Get employees by department
        const departmentStats = await prisma.user.groupBy({
            by: ["department"],
            _count: { id: true },
        });

        // Get attendance stats for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayAttendance = await prisma.attendance.count({
            where: {
                date: {
                    gte: today,
                    lt: tomorrow,
                },
            },
        });

        // Get attendance stats for last 7 days
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);

        const weeklyAttendance = await prisma.attendance.groupBy({
            by: ["date"],
            _count: { id: true },
            where: {
                date: {
                    gte: last7Days,
                },
            },
            orderBy: {
                date: "asc",
            },
        });

        // Get leave request stats
        const leaveStats = await prisma.leaveRequest.groupBy({
            by: ["status"],
            _count: { id: true },
        });

        const pendingLeaves = leaveStats.find(
            (s) => s.status.toUpperCase() === "PENDING"
        )?._count?.id || 0;
        const approvedLeaves = leaveStats.find(
            (s) => s.status.toUpperCase() === "APPROVED"
        )?._count?.id || 0;
        const rejectedLeaves = leaveStats.find(
            (s) => s.status.toUpperCase() === "REJECTED"
        )?._count?.id || 0;

        // Get salary statistics
        const salaryStats = await prisma.salaryInfo.aggregate({
            _avg: { monthlyWage: true },
            _sum: { monthlyWage: true },
            _min: { monthlyWage: true },
            _max: { monthlyWage: true },
        });

        // Get payroll summary for current month
        const currentMonth = new Date().toISOString().slice(0, 7); // "2026-01"
        const payrollSummary = await prisma.payroll.aggregate({
            _sum: { netSalary: true },
            _count: { id: true },
            where: {
                payPeriod: currentMonth,
            },
        });

        // Get recent notifications count
        const unreadNotifications = await prisma.notification.count({
            where: {
                isRead: false,
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                overview: {
                    totalEmployees,
                    presentToday: todayAttendance,
                    absentToday: totalEmployees - todayAttendance,
                    attendanceRate: totalEmployees > 0
                        ? Math.round((todayAttendance / totalEmployees) * 100)
                        : 0,
                },
                departments: departmentStats.map((d) => ({
                    name: d.department || "Unassigned",
                    count: d._count.id,
                })),
                weeklyAttendance: weeklyAttendance.map((w) => ({
                    date: w.date,
                    count: w._count.id,
                })),
                leaves: {
                    pending: pendingLeaves,
                    approved: approvedLeaves,
                    rejected: rejectedLeaves,
                    total: pendingLeaves + approvedLeaves + rejectedLeaves,
                },
                salary: {
                    averageMonthly: salaryStats._avg?.monthlyWage || 0,
                    totalMonthly: salaryStats._sum?.monthlyWage || 0,
                    minSalary: salaryStats._min?.monthlyWage || 0,
                    maxSalary: salaryStats._max?.monthlyWage || 0,
                },
                payroll: {
                    currentMonth,
                    totalPayout: payrollSummary._sum?.netSalary || 0,
                    employeesProcessed: payrollSummary._count?.id || 0,
                },
                notifications: {
                    unread: unreadNotifications,
                },
            },
        });
    } catch (error) {
        console.error("Analytics API Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch analytics" },
            { status: 500 }
        );
    }
}
