import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import EmployeeGrid from "@/components/EmployeeGrid";
import AttendanceTray from "@/components/AttendanceTray";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const headersList = await headers();
  const userId = headersList.get("x-user-id");
  const headerCompanyId = headersList.get("x-user-company-id");

  // Fetch current user for status and company info
  const currentUser = await prisma.user.findUnique({
    where: { id: userId || "" },
    include: { role: true },
  });

  const userRole = currentUser?.role?.name || headersList.get("x-user-role");
  const loginId = currentUser?.loginId || headersList.get("x-user-login-id");
  const companyId = currentUser?.companyId || headerCompanyId;

  // Fetch employees from the same company
  const employees = await prisma.user.findMany({
    where: {
      companyId: companyId || "",
    },
    include: {
      role: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const statusColors: Record<string, string> = {
    present: "text-green-600",
    absent: "text-red-600",
    "on-leave": "text-blue-600",
  };

  const statusText: Record<string, string> = {
    present: "Active",
    absent: "Absent",
    "on-leave": "On Leave",
  };

  return (
    <div
      className="space-y-8 p-8"
      style={{
        background: `linear-gradient(to bottom right, var(--color-slate-950), var(--color-slate-900), var(--color-slate-950))`,
      }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1
            className="text-4xl font-bold tracking-tight mb-2"
            style={{ color: "var(--color-white)" }}
          >
            Overview
          </h1>
          <p style={{ color: "var(--color-slate-400)" }}>
            Welcome to your dashboard
          </p>
        </div>
        <Button
          style={{
            background: `linear-gradient(to right, var(--color-teal-600), var(--color-emerald-600))`,
            color: "var(--color-white)",
          }}
        >
          Download Report
        </Button>
      </div>

      {/* Welcome Section */}
      <div
        className="rounded-lg"
        style={{
          backgroundColor: `color-mix(in srgb, var(--color-slate-700) 50%, transparent)`,
          border: "1px solid var(--color-slate-700)",
        }}
      >
        <div
          className="p-6 border-b"
          style={{ borderColor: "var(--color-slate-700)" }}
        >
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--color-white)" }}
          >
            Welcome back, {userRole === "admin" ? "Administrator" : "Employee"}
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <p style={{ color: "var(--color-slate-400)" }}>
            You are currently logged in as{" "}
            <span
              className="font-mono px-2 py-0.5 rounded"
              style={{
                backgroundColor: `color-mix(in srgb, var(--color-teal-500) 10%, transparent)`,
                color: "var(--color-teal-400)",
              }}
            >
              {loginId}
            </span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div
              className="p-4 rounded-lg flex items-center justify-between"
              style={{
                backgroundColor: `color-mix(in srgb, var(--color-teal-500) 10%, transparent)`,
                border: "1px solid var(--color-teal-600)",
              }}
            >
              <div>
                <p
                  className="font-bold"
                  style={{ color: "var(--color-white)" }}
                >
                  Request Time Off
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--color-slate-400)" }}
                >
                  Submit a new leave request.
                </p>
              </div>
              <Button
                size="sm"
                style={{
                  background: `linear-gradient(to right, var(--color-teal-600), var(--color-emerald-600))`,
                  color: "var(--color-white)",
                }}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* User Details Section */}
      <div
        className="rounded-2xl overflow-hidden border"
        style={{
          backgroundColor: `color-mix(in srgb, var(--color-slate-800) 50%, transparent)`,
          border: "1px solid var(--color-slate-700)",
        }}
      >
        <div className="px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              className="p-6 rounded-xl"
              style={{
                backgroundColor: `color-mix(in srgb, var(--color-slate-700) 50%, transparent)`,
                border: "1px solid var(--color-slate-700)",
              }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "var(--color-slate-400)" }}
              >
                Employee ID
              </p>
              <p
                className="text-lg font-bold font-mono"
                style={{ color: "var(--color-teal-400)" }}
              >
                {currentUser?.employeeId || "Not assigned"}
              </p>
            </div>

            <div
              className="p-6 rounded-xl"
              style={{
                backgroundColor: `color-mix(in srgb, var(--color-slate-700) 50%, transparent)`,
                border: "1px solid var(--color-slate-700)",
              }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "var(--color-slate-400)" }}
              >
                Email
              </p>
              <p
                className="text-sm font-medium truncate"
                style={{ color: "var(--color-slate-300)" }}
              >
                {currentUser?.email || "Not provided"}
              </p>
            </div>

            <div
              className="p-6 rounded-xl"
              style={{
                backgroundColor: `color-mix(in srgb, var(--color-slate-700) 50%, transparent)`,
                border: "1px solid var(--color-slate-700)",
              }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "var(--color-slate-400)" }}
              >
                Phone
              </p>
              <p
                className="text-lg font-bold"
                style={{ color: "var(--color-slate-300)" }}
              >
                {currentUser?.phone || "Not provided"}
              </p>
            </div>

            <div
              className="p-6 rounded-xl"
              style={{
                backgroundColor: `color-mix(in srgb, var(--color-slate-700) 50%, transparent)`,
                border: "1px solid var(--color-slate-700)",
              }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "var(--color-slate-400)" }}
              >
                Department
              </p>
              <p
                className="text-lg font-bold"
                style={{ color: "var(--color-slate-300)" }}
              >
                {currentUser?.department || "Not assigned"}
              </p>
            </div>

            <div
              className="p-6 rounded-xl"
              style={{
                backgroundColor: `color-mix(in srgb, var(--color-slate-700) 50%, transparent)`,
                border: "1px solid var(--color-slate-700)",
              }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "var(--color-slate-400)" }}
              >
                Role
              </p>
              <p
                className="text-lg font-bold capitalize"
                style={{ color: "var(--color-emerald-400)" }}
              >
                {currentUser?.role?.name || "Not assigned"}
              </p>
            </div>

            <div
              className="p-6 rounded-xl"
              style={{
                backgroundColor: `color-mix(in srgb, var(--color-slate-700) 50%, transparent)`,
                border: "1px solid var(--color-slate-700)",
              }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "var(--color-slate-400)" }}
              >
                Current Status
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor:
                      currentUser?.status === "present"
                        ? "#10b981"
                        : currentUser?.status === "on-leave"
                        ? "#3b82f6"
                        : "#ef4444",
                  }}
                />
                <p
                  className="text-lg font-bold capitalize"
                  style={{
                    color:
                      currentUser?.status === "present"
                        ? "#10b981"
                        : currentUser?.status === "on-leave"
                        ? "#3b82f6"
                        : "#ef4444",
                  }}
                >
                  {statusText[currentUser?.status || ""] ||
                    currentUser?.status ||
                    "Absent"}
                </p>
              </div>
            </div>

            <div
              className="p-6 rounded-xl"
              style={{
                backgroundColor: `color-mix(in srgb, var(--color-slate-700) 50%, transparent)`,
                border: "1px solid var(--color-slate-700)",
              }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "var(--color-slate-400)" }}
              >
                Join Date
              </p>
              <p
                className="text-lg font-bold"
                style={{ color: "var(--color-slate-300)" }}
              >
                {currentUser?.dateJoined
                  ? new Date(currentUser.dateJoined).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )
                  : "Not set"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
