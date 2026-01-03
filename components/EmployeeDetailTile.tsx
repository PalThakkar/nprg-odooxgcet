"use client";

import React, { useState } from "react";
import {
  X,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Shield,
  MapPin,
  Globe,
  CreditCard,
  User,
  Wallet,
  Lock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SalaryInfoView from "./admin/SalaryInfoView";
import PrivateInfoView from "./admin/PrivateInfoView";

interface EmployeeDetailTileProps {
  employee: any;
  onClose: () => void;
  viewerRole?: string | null;
}

type Tab = "basic" | "private" | "salary" | "security";

export default function EmployeeDetailTile({
  employee,
  onClose,
  viewerRole = "user",
}: EmployeeDetailTileProps) {
  const [activeTab, setActiveTab] = useState<Tab>("basic");
  const [isLoading, setIsLoading] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [showAnnounceInput, setShowAnnounceInput] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  if (!employee) return null;

  const isAdmin = viewerRole?.toLowerCase() === "admin";

  const handleResetPassword = async () => {
    if (
      !confirm(
        "Are you sure you want to reset this password? A new one will be generated and emailed."
      )
    )
      return;
    setIsLoading(true);
    setStatusMsg(null);
    try {
      const res = await fetch(
        `/api/admin/employees/${employee.id}/reset-password`,
        { method: "POST" }
      );
      const data = await res.json();
      if (res.ok) {
        setStatusMsg({
          type: "success",
          text: `Success! New password: ${data.tempPassword}`,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnnounce = async () => {
    if (!announcement.trim()) return;
    setIsLoading(true);
    setStatusMsg(null);
    try {
      const res = await fetch(`/api/admin/employees/${employee.id}/announce`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: announcement,
          title: "Personal Announcement",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg({
          type: "success",
          text: "Announcement posted to dashboard",
        });
        setAnnouncement("");
        setShowAnnounceInput(false);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: User },
    { id: "private", label: "Private Info", icon: Lock },
    ...(isAdmin ? [{ id: "salary", label: "Salary Info", icon: Wallet }] : []),
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Tile */}
      <div
        className="relative w-full max-w-4xl rounded-[3.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-20 duration-500 max-h-[90vh] flex flex-col"
        style={{ backgroundColor: "var(--color-slate-900)" }}
      >
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Header/Banner */}
          <div
            className="h-40 relative overflow-hidden shrink-0"
            style={{
              background: `linear-gradient(to bottom right, var(--color-teal-600), var(--color-emerald-600))`,
            }}
          >
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            />
            <button
              onClick={onClose}
              className="absolute top-8 right-8 p-3 rounded-full transition-all active:scale-95 z-10 backdrop-blur-md"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "var(--color-white)",
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Section */}
          <div className="px-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-end gap-8 mb-10 -mt-20 relative">
              <div className="relative">
                {/* <div
                  className="w-40 h-40 rounded-[3rem] border-12 shadow-2xl flex items-center justify-center font-black text-5xl overflow-hidden ring-1 ring-slate-700"
                  style={{
                    backgroundColor: `color-mix(in srgb, var(--color-teal-500) 10%, transparent)`,
                    borderColor: "var(--color-slate-900)",
                    color: "var(--color-teal-600)",
                  }}
                >
                  {employee.avatarUrl ? (
                    <img
                      src={employee.avatarUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    employee.name?.substring(0, 1).toUpperCase() || "U"
                  )}
                </div> */}
                
              </div>

              <div className="flex-1 pb-4">
                <div className="flex flex-wrap items-center gap-4 mb-2">
                  <h2
                    className="text-4xl font-black tracking-tighter"
                    style={{ color: "var(--color-black)" }}
                  >
                    {employee.name || "Unknown User"}
                  </h2>
                  <span
                    className="text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border backdrop-blur-sm"
                    style={{
                      color: "var(--color-teal-400)",
                      backgroundColor:
                        "color-mix(in srgb, var(--color-teal-500) 15%, transparent)",
                      borderColor:
                        "color-mix(in srgb, var(--color-teal-500) 30%, transparent)",
                    }}
                  >
                    {employee.role?.name || "Employee"}
                  </span>
                </div>
                <div
                  className="flex flex-wrap gap-6 font-bold text-sm"
                  style={{ color: "var(--color-slate-400)" }}
                >
                  <p className="flex items-center gap-2">
                    <Shield
                      className="w-4 h-4"
                      style={{ color: "var(--color-teal-400)" }}
                    />
                    ID:{" "}
                    <span
                      className="font-mono"
                      style={{ color: "var(--color-teal-400)" }}
                    >
                      {employee.loginId || "N/A"}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Globe
                      className="w-4 h-4"
                      style={{ color: "var(--color-emerald-400)" }}
                    />
                    Odoo India
                  </p>
                </div>
              </div>
            </div>

            {/* Status Message Overlay */}
            {statusMsg && (
              <div
                className={cn(
                  "mb-6 p-4 rounded-2xl font-bold text-sm flex items-center justify-between animate-in slide-in-from-top-4 duration-300",
                  statusMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : "bg-rose-50 text-rose-700 border border-rose-100"
                )}
              >
                <span>{statusMsg.text}</span>
                <button
                  onClick={() => setStatusMsg(null)}
                  className="opacity-50 hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Navigation Tabs */}
            <div
              className="flex gap-2 p-1.5 rounded-[2rem] border mb-10 overflow-x-auto scrollbar-hide"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-slate-800) 50%, transparent)",
                borderColor: "var(--color-slate-700)",
              }}
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as Tab);
                      setStatusMsg(null);
                    }}
                    className={cn(
                      "flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap",
                      isActive ? "shadow-lg translate-y-[-1px]" : ""
                    )}
                    style={
                      isActive
                        ? {
                            background:
                              "linear-gradient(to right, var(--color-teal-600), var(--color-emerald-600))",
                            color: "var(--color-white)",
                            boxShadow: "0 4px 20px rgba(20, 184, 166, 0.2)",
                          }
                        : {
                            color: "var(--color-slate-400)",
                            backgroundColor: "transparent",
                          }
                    }
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{
                        color: isActive
                          ? "var(--color-white)"
                          : "var(--color-slate-400)",
                      }}
                    />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === "basic" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem
                      icon={Mail}
                      label="Email Address"
                      value={employee.email || "N/A"}
                    />
                    <DetailItem
                      icon={Phone}
                      label="Phone Number"
                      value={employee.phone || "N/A"}
                    />
                    <DetailItem
                      icon={Briefcase}
                      label="Department"
                      value="Operations"
                    />
                    <DetailItem
                      icon={Calendar}
                      label="Joining Date"
                      value="Jan 12, 2024"
                    />
                    <DetailItem
                      icon={MapPin}
                      label="Location"
                      value="Ahmedabad, India"
                    />
                    <DetailItem
                      icon={Globe}
                      label="Timezone"
                      value="IST (GMT+5:30)"
                    />
                  </div>

                  {isAdmin && (
                    <div className="space-y-4">
                      {showAnnounceInput ? (
                        <div
                          className="border p-6 rounded-[2.5rem] shadow-xl animate-in zoom-in-95 duration-300"
                          style={{
                            backgroundColor: "var(--color-slate-800)",
                            borderColor: "var(--color-slate-700)",
                            boxShadow: "0 8px 32px rgba(20, 184, 166, 0.1)",
                          }}
                        >
                          <label
                            className="text-[10px] font-black uppercase tracking-widest block mb-4"
                            style={{ color: "var(--color-slate-400)" }}
                          >
                            Post Personalized Announcement
                          </label>
                          <textarea
                            value={announcement}
                            onChange={(e) => setAnnouncement(e.target.value)}
                            placeholder="Type a message for this employee's dashboard..."
                            className="w-full border rounded-2xl p-4 text-sm font-bold h-32 focus:ring-4 transition-all resize-none"
                            style={{
                              backgroundColor: "var(--color-slate-900)",
                              borderColor: "var(--color-slate-700)",
                              color: "var(--color-white)",
                            }}
                          />
                          <div className="flex gap-2 mt-4">
                            <Button
                              onClick={handleAnnounce}
                              disabled={isLoading || !announcement.trim()}
                              className="flex-1 h-12 rounded-xl font-black transition-all active:scale-95"
                              style={{
                                background:
                                  "linear-gradient(to right, var(--color-teal-600), var(--color-emerald-600))",
                                color: "var(--color-white)",
                              }}
                            >
                              {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                "Post Announcement"
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => setShowAnnounceInput(false)}
                              className="px-6 h-12 rounded-xl font-bold"
                              style={{ color: "var(--color-slate-400)" }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-4">
                          <Button
                            onClick={() => setShowAnnounceInput(true)}
                            className="flex-1 h-16 rounded-[1.5rem] text-base font-black shadow-xl transition-all active:scale-[0.98]"
                            style={{
                              background:
                                "linear-gradient(to right, var(--color-teal-600), var(--color-emerald-600))",
                              color: "var(--color-white)",
                              boxShadow: "0 8px 32px rgba(20, 184, 166, 0.2)",
                            }}
                          >
                            <Mail className="w-5 h-5 mr-3" />
                            Post Announcement
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setActiveTab("salary")}
                            className="flex-1 h-16 rounded-[1.5rem] text-base font-black transition-all active:scale-[0.98]"
                            style={{
                              borderColor: "var(--color-slate-700)",
                              backgroundColor: "var(--color-slate-800)",
                              color: "var(--color-white)",
                            }}
                          >
                            <Wallet
                              className="w-5 h-5 mr-3"
                              style={{ color: "var(--color-teal-400)" }}
                            />
                            Config Salary
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "salary" && (
                <SalaryInfoView employeeId={employee.id} isAdmin={isAdmin} />
              )}

              {activeTab === "private" && (
                <PrivateInfoView employee={employee} isAdmin={isAdmin} />
              )}

              {activeTab === "security" && (
                <div
                  className="border rounded-[2.5rem] p-12 text-center space-y-4 max-w-lg mx-auto mt-10"
                  style={{
                    backgroundColor: "var(--color-slate-800)",
                    borderColor: "var(--color-slate-700)",
                  }}
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ backgroundColor: "var(--color-slate-900)" }}
                  >
                    <Lock
                      className="w-10 h-10"
                      style={{ color: "var(--color-slate-600)" }}
                    />
                  </div>
                  <h3
                    className="text-xl font-bold"
                    style={{ color: "var(--color-white)" }}
                  >
                    Account Security
                  </h3>
                  <p
                    className="font-medium"
                    style={{ color: "var(--color-slate-400)" }}
                  >
                    Reset password and manage MFA settings for this member.
                  </p>

                  <Button
                    variant="outline"
                    onClick={handleResetPassword}
                    disabled={isLoading}
                    className="h-14 px-10 rounded-2xl font-black border-2 transition-all w-full hover:bg-rose-500/10"
                    style={{
                      borderColor: "var(--color-slate-700)",
                      color: "var(--color-white)",
                    }}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <Shield className="w-5 h-5 mr-2" />
                    )}
                    Reset Access Password
                  </Button>

                  <p
                    className="text-[10px] font-bold uppercase tracking-widest pt-4"
                    style={{ color: "var(--color-slate-500)" }}
                  >
                    This action will be logged for security audits
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div
      className="border p-6 rounded-[2rem] group transition-all cursor-default shadow-sm hover:shadow-md"
      style={{
        backgroundColor: "var(--color-slate-800)",
        borderColor: "var(--color-slate-700)",
      }}
    >
      <div className="flex items-center gap-4 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--color-slate-700) 50%, transparent)",
          }}
        >
          <Icon
            className="w-5 h-5 transition-colors"
            style={{ color: "var(--color-slate-400)" }}
          />
        </div>
        <span
          className="text-[10px] font-black uppercase tracking-[0.2em]"
          style={{ color: "var(--color-slate-400)" }}
        >
          {label}
        </span>
      </div>
      <p
        className="text-lg font-black truncate tracking-tight"
        style={{ color: "var(--color-white)" }}
      >
        {value}
      </p>
    </div>
  );
}
