import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type AttendanceWithUser = Prisma.AttendanceGetPayload<{
    include: {
        user: {
            select: {
                id: true;
                name: true;
                email: true;
                employeeId: true;
                department: true;
            };
        };
    };
}>;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        const employeeId = searchParams.get("employeeId");

        // Build date filter
        const dateFilter: { gte?: Date; lte?: Date } = {};
        if (startDate) {
            dateFilter.gte = new Date(startDate);
        }
        if (endDate) {
            dateFilter.lte = new Date(endDate);
        }

        // Build where clause
        const whereClause: {
            date?: { gte?: Date; lte?: Date };
            userId?: string;
        } = {};

        if (Object.keys(dateFilter).length > 0) {
            whereClause.date = dateFilter;
        }
        if (employeeId) {
            whereClause.userId = employeeId;
        }

        // Fetch attendance records with user details
        const attendanceRecords: AttendanceWithUser[] = await prisma.attendance.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        employeeId: true,
                        department: true,
                    },
                },
            },
            orderBy: {
                date: "desc",
            },
        });

        // Calculate summary statistics
        const totalRecords = attendanceRecords.length;
        const totalWorkHours = attendanceRecords.reduce(
            (sum, r) => sum + (r.workHours || 0),
            0
        );
        const totalExtraHours = attendanceRecords.reduce(
            (sum, r) => sum + (r.extraHours || 0),
            0
        );
        const presentCount = attendanceRecords.filter(
            (r) => r.status === "present"
        ).length;
        const lateCount = attendanceRecords.filter(
            (r) => r.status === "late"
        ).length;

        // Group by employee for summary
        const employeeSummary: Record<
            string,
            {
                employeeId: string;
                name: string;
                department: string;
                totalDays: number;
                totalHours: number;
                avgHours: number;
            }
        > = {};

        attendanceRecords.forEach((record) => {
            const id = record.userId;
            if (!employeeSummary[id]) {
                employeeSummary[id] = {
                    employeeId: record.user.employeeId || id,
                    name: record.user.name || "Unknown",
                    department: record.user.department || "Unassigned",
                    totalDays: 0,
                    totalHours: 0,
                    avgHours: 0,
                };
            }
            employeeSummary[id].totalDays++;
            employeeSummary[id].totalHours += record.workHours || 0;
        });

        // Calculate averages
        Object.values(employeeSummary).forEach((emp) => {
            emp.avgHours = emp.totalDays > 0 ? emp.totalHours / emp.totalDays : 0;
        });

        return NextResponse.json({
            success: true,
            data: {
                records: attendanceRecords.map((r) => ({
                    id: r.id,
                    employeeId: r.user.employeeId,
                    employeeName: r.user.name,
                    department: r.user.department,
                    date: r.date,
                    checkIn: r.checkIn,
                    checkOut: r.checkOut,
                    workHours: r.workHours,
                    extraHours: r.extraHours,
                    status: r.status,
                })),
                summary: {
                    totalRecords,
                    totalWorkHours: Math.round(totalWorkHours * 100) / 100,
                    totalExtraHours: Math.round(totalExtraHours * 100) / 100,
                    presentCount,
                    lateCount,
                    averageWorkHours:
                        totalRecords > 0
                            ? Math.round((totalWorkHours / totalRecords) * 100) / 100
                            : 0,
                },
                employeeSummary: Object.values(employeeSummary),
            },
        });
    } catch (error) {
        console.error("Attendance Report Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to generate attendance report" },
            { status: 500 }
        );
    }
}
