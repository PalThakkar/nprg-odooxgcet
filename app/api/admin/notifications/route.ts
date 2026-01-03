import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Fetch all notifications (for admin to view all)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");
        const unreadOnly = searchParams.get("unreadOnly") === "true";

        const whereClause: {
            type?: string;
            isRead?: boolean;
        } = {};

        if (type) {
            whereClause.type = type;
        }
        if (unreadOnly) {
            whereClause.isRead = false;
        }

        const notifications = await prisma.notification.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        employeeId: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 100, // Limit to last 100 notifications
        });

        // Get counts by type
        const countByType = await prisma.notification.groupBy({
            by: ["type"],
            _count: { id: true },
        });

        const unreadCount = await prisma.notification.count({
            where: { isRead: false },
        });

        return NextResponse.json({
            success: true,
            data: {
                notifications: notifications.map((n) => ({
                    id: n.id,
                    userId: n.userId,
                    userName: n.user.name,
                    userEmail: n.user.email,
                    employeeId: n.user.employeeId,
                    type: n.type,
                    title: n.title,
                    message: n.message,
                    isRead: n.isRead,
                    createdAt: n.createdAt,
                })),
                summary: {
                    total: notifications.length,
                    unread: unreadCount,
                    byType: countByType.reduce(
                        (acc, item) => {
                            acc[item.type] = item._count.id;
                            return acc;
                        },
                        {} as Record<string, number>
                    ),
                },
            },
        });
    } catch (error) {
        console.error("Notifications GET Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch notifications" },
            { status: 500 }
        );
    }
}

// POST - Send notification to employee(s)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userIds, type, title, message, sendToAll } = body;

        if (!title || !message) {
            return NextResponse.json(
                { success: false, error: "Title and message are required" },
                { status: 400 }
            );
        }

        let targetUserIds: string[] = [];

        if (sendToAll) {
            // Get all user IDs
            const allUsers = await prisma.user.findMany({
                select: { id: true },
            });
            targetUserIds = allUsers.map((u) => u.id);
        } else if (userIds && Array.isArray(userIds) && userIds.length > 0) {
            targetUserIds = userIds;
        } else {
            return NextResponse.json(
                {
                    success: false,
                    error: "Either userIds or sendToAll must be provided",
                },
                { status: 400 }
            );
        }

        // Create notifications for all target users
        const notifications = await prisma.notification.createMany({
            data: targetUserIds.map((userId) => ({
                userId,
                type: type || "ANNOUNCEMENT",
                title,
                message,
            })),
        });

        return NextResponse.json({
            success: true,
            message: `Notification sent to ${notifications.count} users`,
            data: {
                count: notifications.count,
                type: type || "ANNOUNCEMENT",
                title,
            },
        });
    } catch (error) {
        console.error("Notifications POST Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to send notification" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a notification
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Notification ID is required" },
                { status: 400 }
            );
        }

        await prisma.notification.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: "Notification deleted successfully",
        });
    } catch (error) {
        console.error("Notifications DELETE Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete notification" },
            { status: 500 }
        );
    }
}
