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
  User,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Employee {
  id: string;
  name: string;
  email: string;
  loginId: string;
  role: { name: string };
  status: string;
  avatarUrl?: string;
}

export default function EmployeeList() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/admin/employees');
      const data = await res.json();
      if (!res.ok) {
        console.error('API Error:', data.error || data);
      }
      if (data.employees) {
        setEmployees(data.employees);
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.id !== user?.id && // Exclude current admin user
      ((emp.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.loginId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.email || "").toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 p-6 lg:p-10 max-w-7xl mx-auto min-h-screen bg-transparent relative z-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-2 border-slate-800 pb-8 bg-slate-950/80 backdrop-blur-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 border-2 border-primary bg-slate-900 flex items-center justify-center shadow-[4px_4px_0px_0px_var(--color-primary)]">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white drop-shadow-[4px_4px_0px_var(--color-slate-800)]">
              Employee Hub
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
              Manage your workforce
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`h-12 px-6 border-2 font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-200
            ${isAdding
              ? 'bg-slate-900 border-slate-600 text-slate-400 hover:bg-slate-800'
              : 'bg-primary border-primary text-slate-950 shadow-[4px_4px_0px_0px_var(--color-slate-200)] hover:shadow-[6px_6px_0px_0px_var(--color-slate-200)] hover:-translate-y-0.5'
            }`}
        >
          {isAdding ? (
            <>
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Directory</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>Register Employee</span>
            </>
          )}
        </button>
      </div>

      {isAdding ? (
        <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
          <AddEmployeeForm
            onSuccess={() => {
              fetchEmployees();
              setIsAdding(false);
            }}
          />
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-900 border-2 border-slate-800 shadow-[4px_4px_0px_0px_var(--color-slate-800)]">
            <div className="relative flex-1 group">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="SEARCH MEMBERS..."
                className="w-full bg-slate-950 border-2 border-slate-800 py-3 pl-11 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-primary focus:shadow-[4px_4px_0px_0px_var(--color-primary)] transition-all font-mono uppercase text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex border-2 border-slate-800 bg-slate-950 p-1 gap-1">
              <button className="p-2 bg-primary text-slate-950 border-2 border-primary shadow-sm">
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-500 hover:bg-slate-800 hover:text-white transition-colors">
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content Section */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="font-bold text-slate-500 uppercase tracking-widest animate-pulse">
                Scanning directory...
              </p>
            </div>
          ) : filteredEmployees.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredEmployees.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  className="group relative bg-slate-900 border-2 border-slate-800 p-6 transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:border-primary hover:shadow-[8px_8px_0px_0px_var(--color-primary)]"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 border-l-2 border-b-2 border-slate-800 bg-slate-950/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="text-4xl text-slate-800 font-black">#</span>
                  </div>

                  <div className="flex flex-col gap-6 relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="w-16 h-16 border-2 border-slate-700 bg-slate-800 flex items-center justify-center overflow-hidden">
                        {emp.avatarUrl ? (
                          <img
                            src={emp.avatarUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-black text-slate-600">
                            {emp.name?.substring(0, 1).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest border-2 ${emp.status === 'present'
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                          : 'bg-slate-800 border-slate-600 text-slate-500'
                        }`}>
                        {emp.status || "OFFLINE"}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-white uppercase truncate mb-1 group-hover:text-primary transition-colors">
                        {emp.name}
                      </h3>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Users className="w-3 h-3" />
                        {emp.role?.name || "Employee"}
                      </p>
                    </div>

                    <div className="pt-4 border-t-2 border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        ID: <span className="text-white font-mono text-xs">{emp.loginId}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-700 bg-slate-900/50 py-32 text-center">
              <div className="w-20 h-20 border-2 border-slate-700 bg-slate-800 flex items-center justify-center mx-auto mb-6 rotate-3">
                <SearchIcon className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-xl font-black text-white uppercase mb-2 tracking-wide">
                No Results Found
              </h3>
              <p className="text-slate-400 font-medium max-w-sm mx-auto mb-8">
                Try a different search term or register a new team member.
              </p>
              <button
                className="btn-secondary"
                onClick={() => setSearchQuery("")}
              >
                Clear Filter
              </button>
            </div>
          )}

          {/* Floating Tile Detail View - Keeping internal component structure but passing brutalist toggle if supported */}
          {selectedEmployee && (
            <EmployeeDetailTile
              employee={selectedEmployee}
              onClose={() => setSelectedEmployee(null)}
              viewerRole="admin"
            />
          )}
        </div>
      )}
    </div>
  );
}
