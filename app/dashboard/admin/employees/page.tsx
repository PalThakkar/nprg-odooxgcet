"use client";

import React, { useState, useEffect } from "react";
import AddEmployeeForm from "@/components/admin/AddEmployeeForm";
import EmployeeDetailTile from "@/components/EmployeeDetailTile";
import {
  Users,
  Plus,
  LayoutGrid,
  List,
  Search as SearchIcon,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminEmployeesPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/admin/employees");
      const data = await res.json();
      if (data.employees) {
        setEmployees(data.employees);
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(
    (emp) =>
      (emp.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.loginId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="space-y-8 p-6 lg:p-10 max-w-7xl mx-auto min-h-screen"
      style={{
        background: `linear-gradient(to bottom right, var(--color-slate-950), var(--color-slate-900), var(--color-slate-950))`,
      }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(to bottom right, var(--color-teal-600), var(--color-emerald-600))`,
            }}
          >
            <Users
              className="w-6 h-6"
              style={{ color: "var(--color-white)" }}
            />
          </div>
          <div>
            <h1
              className="text-3xl font-black tracking-tight"
              style={{ color: "var(--color-white)" }}
            >
              Employee Hub
            </h1>
            <p
              className="font-medium"
              style={{ color: "var(--color-slate-400)" }}
            >
              Manage your workforce at Odoo India
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsAdding(!isAdding)}
          className={`h-12 px-6 rounded-2xl font-bold transition-all active:scale-95 shadow-lg`}
          style={
            isAdding
              ? {
                  backgroundColor: `color-mix(in srgb, var(--color-slate-700) 50%, transparent)`,
                  color: "var(--color-slate-300)",
                  border: "1px solid var(--color-slate-700)",
                }
              : {
                  background: `linear-gradient(to right, var(--color-teal-600), var(--color-emerald-600))`,
                  color: "var(--color-white)",
                }
          }
        >
          {isAdding ? (
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Directory</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span>Register Employee</span>
            </div>
          )}
        </Button>
      </div>

      {isAdding ? (
        <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
          <AddEmployeeForm onSuccess={() => fetchEmployees()} />
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group">
              <SearchIcon
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors"
                style={{ color: "var(--color-slate-400)" }}
              />
              <input
                type="text"
                placeholder="Search by name, ID or email..."
                className="w-full rounded-2xl py-3.5 pl-11 pr-4 transition-all outline-none text-sm"
                style={{
                  backgroundColor: `color-mix(in srgb, var(--color-slate-700) 50%, transparent)`,
                  border: "1px solid var(--color-slate-700)",
                  color: "var(--color-white)",
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div
              className="flex rounded-2xl border p-1 shrink-0"
              style={{
                backgroundColor: `color-mix(in srgb, var(--color-slate-700) 50%, transparent)`,
                borderColor: "var(--color-slate-700)",
              }}
            >
              <button
                className="p-2.5 rounded-xl shadow-sm"
                style={{
                  backgroundColor: `color-mix(in srgb, var(--color-teal-500) 20%, transparent)`,
                  color: "var(--color-teal-500)",
                }}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                className="p-2.5 rounded-xl"
                style={{ color: "var(--color-slate-400)" }}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2
                className="w-10 h-10 animate-spin"
                style={{ color: "var(--color-teal-500)" }}
              />
              <p
                className="font-medium animate-pulse"
                style={{ color: "var(--color-slate-400)" }}
              >
                Scanning workforce directory...
              </p>
            </div>
          ) : filteredEmployees.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEmployees.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  className="rounded-3xl p-6 border shadow-sm hover:shadow-xl transition-all group cursor-pointer overflow-hidden relative"
                  style={{
                    backgroundColor: `color-mix(in srgb, var(--color-slate-700) 30%, transparent)`,
                    borderColor: "var(--color-slate-700)",
                  }}
                >
                  <div
                    className="absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500"
                    style={{
                      backgroundColor: `color-mix(in srgb, var(--color-teal-500) 5%, transparent)`,
                    }}
                  />

                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="w-16 h-16 rounded-2xl border-2 shadow-sm flex items-center justify-center font-black text-xl overflow-hidden group-hover:scale-105 transition-transform"
                      style={{
                        backgroundColor: `color-mix(in srgb, var(--color-teal-500) 15%, transparent)`,
                        borderColor: `color-mix(in srgb, var(--color-slate-700) 50%, transparent)`,
                        color: "var(--color-teal-500)",
                      }}
                    >
                      {emp.avatarUrl ? (
                        <img
                          src={emp.avatarUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        emp.name?.substring(0, 1).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full shadow-sm shadow-current`}
                          style={{
                            backgroundColor:
                              emp.status === "present"
                                ? "var(--color-emerald-500)"
                                : "var(--color-slate-500)",
                          }}
                        />
                        <p
                          className="text-xs font-bold uppercase tracking-widest"
                          style={{ color: "var(--color-slate-400)" }}
                        >
                          {emp.status || "Offline"}
                        </p>
                      </div>
                      <h3
                        className="font-bold group-hover:text-teal-400 transition-colors uppercase truncate max-w-[120px]"
                        style={{ color: "var(--color-white)" }}
                      >
                        {emp.name}
                      </h3>
                    </div>
                  </div>

                  <div
                    className="space-y-3 pt-4 border-t"
                    style={{ borderColor: "var(--color-slate-700)" }}
                  >
                    <div
                      className="flex justify-between items-center p-2 rounded-xl border"
                      style={{
                        backgroundColor: `color-mix(in srgb, var(--color-slate-700) 30%, transparent)`,
                        borderColor: "var(--color-slate-700)",
                      }}
                    >
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: "var(--color-slate-400)" }}
                      >
                        Employee ID
                      </span>
                      <span
                        className="text-xs font-mono font-black"
                        style={{ color: "var(--color-teal-500)" }}
                      >
                        {emp.loginId}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-1">
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: `color-mix(in srgb, var(--color-slate-700) 50%, transparent)`,
                        }}
                      >
                        <Users
                          className="w-3.5 h-3.5"
                          style={{ color: "var(--color-slate-400)" }}
                        />
                      </div>
                      <span
                        className="text-xs font-semibold capitalize"
                        style={{ color: "var(--color-slate-300)" }}
                      >
                        {emp.role?.name || "Employee"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="rounded-[40px] border-2 border-dashed py-32 text-center animate-in zoom-in duration-500"
              style={{
                backgroundColor: `color-mix(in srgb, var(--color-slate-700) 20%, transparent)`,
                borderColor: "var(--color-slate-700)",
              }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{
                  backgroundColor: `color-mix(in srgb, var(--color-slate-700) 50%, transparent)`,
                }}
              >
                <SearchIcon
                  className="w-10 h-10"
                  style={{ color: "var(--color-slate-500)" }}
                />
              </div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: "var(--color-white)" }}
              >
                Nobody found here
              </h3>
              <p
                className="max-w-sm mx-auto"
                style={{ color: "var(--color-slate-400)" }}
              >
                Try a different search term or register a new team member to
                populate the directory.
              </p>
              <Button
                variant="ghost"
                className="mt-6 font-bold"
                style={{ color: "var(--color-teal-500)" }}
                onClick={() => setSearchQuery("")}
              >
                Clear current search
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Floating Tile */}
      {selectedEmployee && (
        <EmployeeDetailTile
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          viewerRole="admin"
        />
      )}
    </div>
  );
}
