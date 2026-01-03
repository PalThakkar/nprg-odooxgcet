import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import EmployeeGrid from "@/components/EmployeeGrid";
import AttendanceTray from "@/components/AttendanceTray";
import { Button } from "@/components/ui/button";
import { Download, Plane, Calendar, User, Phone, Mail, Building, Shield, Clock } from "lucide-react";

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
    present: "text-emerald-500",
    absent: "text-red-500",
    "on-leave": "text-blue-500",
  };

  const statusText: Record<string, string> = {
    present: "Active",
    absent: "Absent",
    "on-leave": "On Leave",
  };

  return (
    <div className="space-y-8 p-8 min-h-screen relative overflow-hidden font-mono bg-transparent z-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-2 border-slate-800 pb-8 bg-slate-950/80 backdrop-blur-sm">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white drop-shadow-[4px_4px_0px_var(--color-slate-800)] flex items-center gap-2">
            <span className="w-4 h-4 bg-primary inline-block" />
            Overview
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mt-1 ml-6">
            Employee Dashboard
          </p>
        </div>
        <Button
          className="bg-slate-900 text-white border-2 border-slate-700 hover:border-primary hover:text-primary hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_var(--color-primary)] transition-all font-black uppercase tracking-wider"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* Welcome Section */}
      <div className="brutal-card p-0 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />

        <div className="p-8 border-b-2 border-slate-800 bg-slate-900/50">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">
            Welcome back, <span className="text-primary">{userRole === "admin" ? "Administrator" : "Employee"}</span>
          </h2>
          <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest text-xs">
            Logged in as <span className="bg-slate-800 text-white px-2 py-1 border border-slate-600 ml-2">{loginId}</span>
          </p>
        </div>

        <div className="p-8 bg-slate-900 border-t-2 border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-950 border-2 border-slate-800 hover:border-primary transition-colors hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] group/card">
              <div className="flex justify-between items-start">
                <div>
                  <div className="bg-slate-900 p-2 w-fit border border-slate-700 mb-3 group-hover/card:border-primary transition-colors">
                    <Plane className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-black uppercase text-white mb-1">Time Off</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">Submit a new request</p>
                </div>
              </div>
              <Button
                size="sm"
                className="w-full bg-slate-800 border-2 border-slate-700 text-white font-bold uppercase hover:bg-primary hover:text-slate-950 hover:border-primary transition-all"
              >
                Submit Request
              </Button>
            </div>

            <div className="p-6 bg-slate-950 border-2 border-slate-800 hover:border-emerald-500 transition-colors hover:shadow-[4px_4px_0px_0px_rgba(16,185,129,0.3)] group/card">
              <div className="flex justify-between items-start">
                <div>
                  <div className="bg-slate-900 p-2 w-fit border border-slate-700 mb-3 group-hover/card:border-emerald-500 transition-colors">
                    <Calendar className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-black uppercase text-white mb-1">Schedule</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">View upcoming shifts</p>
                </div>
              </div>
              <Button
                size="sm"
                className="w-full bg-slate-800 border-2 border-slate-700 text-white font-bold uppercase hover:bg-emerald-500 hover:text-slate-950 hover:border-emerald-500 transition-all"
              >
                View Calendar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* User Details Section */}
      <div className="brutal-card p-0 overflow-hidden">
        <div className="px-8 py-6 border-b-2 border-slate-800 bg-slate-900">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-slate-800 border-2 border-slate-600 flex items-center justify-center">
              <User className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase text-white tracking-wide">
                {currentUser?.name || "Employee"}
              </h2>
              <p className="text-sm font-bold text-primary uppercase tracking-widest">
                {currentUser?.jobTitle || "NO TITLE"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-950">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Detail Item */}
            <div className="p-4 border-2 border-slate-800 bg-slate-900 hover:border-slate-600 transition-colors">
              <div className="flex items-center gap-2 mb-2 text-slate-500">
                <Shield className="w-4 h-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Employee ID</p>
              </div>
              <p className="text-lg font-bold font-mono text-white">
                {currentUser?.employeeId || "—"}
              </p>
            </div>

            <div className="p-4 border-2 border-slate-800 bg-slate-900 hover:border-slate-600 transition-colors">
              <div className="flex items-center gap-2 mb-2 text-slate-500">
                <Mail className="w-4 h-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Email</p>
              </div>
              <p className="text-sm font-bold text-white truncate" title={currentUser?.email}>
                {currentUser?.email || "—"}
              </p>
            </div>

            <div className="p-4 border-2 border-slate-800 bg-slate-900 hover:border-slate-600 transition-colors">
              <div className="flex items-center gap-2 mb-2 text-slate-500">
                <Phone className="w-4 h-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Phone</p>
              </div>
              <p className="text-lg font-bold text-white">
                {currentUser?.phone || "—"}
              </p>
            </div>

            <div className="p-4 border-2 border-slate-800 bg-slate-900 hover:border-slate-600 transition-colors">
              <div className="flex items-center gap-2 mb-2 text-slate-500">
                <Building className="w-4 h-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Deparment</p>
              </div>
              <p className="text-lg font-bold text-white uppercase">
                {currentUser?.department || "—"}
              </p>
            </div>

            <div className="p-4 border-2 border-slate-800 bg-slate-900 hover:border-slate-600 transition-colors">
              <div className="flex items-center gap-2 mb-2 text-slate-500">
                <Shield className="w-4 h-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Role</p>
              </div>
              <p className="text-lg font-bold text-white uppercase">
                {currentUser?.role?.name || "—"}
              </p>
            </div>

            <div className="p-4 border-2 border-slate-800 bg-slate-900 hover:border-slate-600 transition-colors">
              <div className="flex items-center gap-2 mb-2 text-slate-500">
                <Clock className="w-4 h-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Status</p>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 border border-black ${currentUser?.status === "present" ? "bg-emerald-500 animate-pulse" :
                      currentUser?.status === "on-leave" ? "bg-blue-500" : "bg-red-500"
                    }`}
                />
                <p className={`text-lg font-bold uppercase ${currentUser?.status === "present" ? "text-emerald-500" :
                    currentUser?.status === "on-leave" ? "text-blue-500" : "text-red-500"
                  }`}>
                  {statusText[currentUser?.status || ""] || currentUser?.status || "ABSENT"}
                </p>
              </div>
            </div>

            <div className="p-4 border-2 border-slate-800 bg-slate-900 hover:border-slate-600 transition-colors col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-2 text-slate-500">
                <Calendar className="w-4 h-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Joined On</p>
              </div>
              <p className="text-lg font-bold text-white">
                {currentUser?.dateJoined
                  ? new Date(currentUser.dateJoined).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  ).toUpperCase()
                  : "—"}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
