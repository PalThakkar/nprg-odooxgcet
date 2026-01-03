"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Calculator, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface SalaryInfoViewProps {
  employeeId: string;
  isAdmin: boolean;
}

export default function SalaryInfoView({
  employeeId,
  isAdmin,
}: SalaryInfoViewProps) {
  const [wage, setWage] = useState(50000);
  const [workingDays, setWorkingDays] = useState(5);
  const [loading, setLoading] = useState(false);

  // Percentages (Rules)
  const [rules, setRules] = useState({
    basic: 50, // 50% of Wage
    hra: 50, // 50% of Basic
    standard: 4167, // Fixed or %? Wireframe show both. Let's use % for auto-calc
    performance: 8.33,
    lta: 8.33,
    pf: 12,
    tax: 200,
  });

  // Calculated Values
  const basic = (wage * rules.basic) / 100;
  const hra = (basic * rules.hra) / 100;
  const standard = rules.standard; // Fixed for now based on wireframe sample
  const performance = (wage * rules.performance) / 100;
  const lta = (wage * rules.lta) / 100;
  const totalComponents = basic + hra + standard + performance + lta;
  const fixedAllowance = Math.max(0, wage - totalComponents);
  const yearlyWage = wage * 12;

  const pfEmployee = (basic * rules.pf) / 100;
  const pfEmployer = (basic * rules.pf) / 100; // Usually same

  return (
    <div className="space-y-8 animate-in fade-in duration-500 py-4">
      {/* Wage Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="border p-6 rounded-3xl shadow-sm space-y-4"
          style={{
            backgroundColor: "var(--color-slate-900)",
            borderColor: "var(--color-slate-700)",
          }}
        >
          <label
            className="text-xs font-black uppercase tracking-widest block"
            style={{ color: "var(--color-slate-400)" }}
          >
            Month Wage
          </label>
          <div className="relative">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 font-bold"
              style={{ color: "var(--color-slate-400)" }}
            >
              ₹
            </span>
            <input
              type="number"
              value={wage}
              onChange={(e) => setWage(Number(e.target.value))}
              className="w-full border-none rounded-2xl py-4 pl-10 pr-4 text-xl font-black"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-slate-800) 50%, transparent)",
                color: "var(--color-white)",
              }}
              disabled={!isAdmin}
            />
          </div>
          <div className="flex justify-between items-center px-2">
            <span
              className="text-xs font-bold"
              style={{ color: "var(--color-slate-400)" }}
            >
              Yearly Wage: ₹{yearlyWage.toLocaleString()}
            </span>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>

        <div
          className="border p-6 rounded-3xl shadow-sm space-y-4"
          style={{
            backgroundColor: "var(--color-slate-900)",
            borderColor: "var(--color-slate-700)",
          }}
        >
          <label
            className="text-xs font-black uppercase tracking-widest block"
            style={{ color: "var(--color-slate-400)" }}
          >
            Working Schedule
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <span
                className="text-[10px] font-bold uppercase"
                style={{ color: "var(--color-slate-400)" }}
              >
                Days/Week
              </span>
              <input
                type="number"
                value={workingDays}
                onChange={(e) => setWorkingDays(Number(e.target.value))}
                className="w-full border-none rounded-xl p-3 font-bold"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--color-slate-800) 50%, transparent)",
                  color: "var(--color-white)",
                }}
                disabled={!isAdmin}
              />
            </div>
            <div className="space-y-2">
              <span
                className="text-[10px] font-bold uppercase"
                style={{ color: "var(--color-slate-400)" }}
              >
                Break Time (hrs)
              </span>
              <input
                type="number"
                defaultValue={1}
                className="w-full border-none rounded-xl p-3 font-bold"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--color-slate-800) 50%, transparent)",
                  color: "var(--color-white)",
                }}
                disabled={!isAdmin}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Salary Components Table */}
      <div
        className="border rounded-[2rem] overflow-hidden shadow-sm"
        style={{
          backgroundColor: "var(--color-slate-900)",
          borderColor: "var(--color-slate-700)",
        }}
      >
        <div
          className="px-8 py-4 border-b flex justify-between items-center"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--color-slate-800) 50%, transparent)",
            borderColor: "var(--color-slate-700)",
          }}
        >
          <h3
            className="font-black uppercase tracking-tighter text-sm"
            style={{ color: "var(--color-white)" }}
          >
            Salary Components
          </h3>
          <Calculator
            className="w-4 h-4"
            style={{ color: "var(--color-teal-500)" }}
          />
        </div>

        <div className="p-2">
          <table className="w-full text-left">
            <thead>
              <tr
                className="text-[10px] font-black uppercase tracking-widest border-b"
                style={{
                  color: "var(--color-slate-400)",
                  borderColor: "var(--color-slate-800)",
                }}
              >
                <th className="px-6 py-4">Component</th>
                <th className="px-6 py-4">Monthly Value</th>
                <th className="px-6 py-4 text-right">Calculation (%)</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              <ComponentRow
                label="Basic Salary"
                amount={basic}
                percentage={rules.basic}
              />
              <ComponentRow
                label="House Rent Allowance"
                amount={hra}
                percentage={rules.hra}
                subtext="(50% of Basic)"
              />
              <ComponentRow
                label="Standard Allowance"
                amount={standard}
                percentage={16.67}
                subtext="Fixed Amount"
              />
              <ComponentRow
                label="Performance Bonus"
                amount={performance}
                percentage={rules.performance}
              />
              <ComponentRow
                label="Leave Travel Allowance"
                amount={lta}
                percentage={rules.lta}
              />
              <ComponentRow
                label="Fixed Allowance"
                amount={fixedAllowance}
                percentage={11.67}
                isCalculated
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* PF & Tax Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="border p-6 rounded-3xl space-y-4"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--color-teal-500) 10%, transparent)",
            borderColor:
              "color-mix(in srgb, var(--color-teal-500) 20%, transparent)",
          }}
        >
          <h4
            className="text-[10px] font-black uppercase tracking-widest mb-4"
            style={{ color: "var(--color-teal-400)" }}
          >
            Provident Fund (12%)
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span
                className="text-sm"
                style={{ color: "var(--color-slate-300)" }}
              >
                Employee Contribution
              </span>
              <span
                className="font-bold"
                style={{ color: "var(--color-white)" }}
              >
                ₹{pfEmployee.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span
                className="text-sm"
                style={{ color: "var(--color-slate-300)" }}
              >
                Employer Contribution
              </span>
              <span
                className="font-bold"
                style={{ color: "var(--color-white)" }}
              >
                ₹{pfEmployer.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div
          className="border p-6 rounded-3xl space-y-4"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--color-red-500) 10%, transparent)",
            borderColor:
              "color-mix(in srgb, var(--color-red-500) 20%, transparent)",
          }}
        >
          <h4
            className="text-[10px] font-black uppercase tracking-widest mb-4"
            style={{ color: "var(--color-red-400)" }}
          >
            Tax Deductions
          </h4>
          <div className="flex justify-between items-center">
            <span
              className="text-sm"
              style={{ color: "var(--color-slate-300)" }}
            >
              Professional Tax
            </span>
            <span
              className="font-bold"
              style={{ color: "var(--color-red-400)" }}
            >
              ₹{rules.tax}.00
            </span>
          </div>
        </div>
      </div>

      {isAdmin && (
        <Button
          className="w-full h-14 rounded-2xl font-black shadow-lg"
          style={{
            background:
              "linear-gradient(135deg, var(--color-teal-600), var(--color-emerald-600))",
            color: "var(--color-white)",
          }}
        >
          <Save className="w-5 h-5 mr-3" />
          Update Salary Structure
        </Button>
      )}
    </div>
  );
}

function ComponentRow({
  label,
  amount,
  percentage,
  subtext,
  isCalculated,
}: {
  label: string;
  amount: number;
  percentage: number;
  subtext?: string;
  isCalculated?: boolean;
}) {
  return (
    <tr className="transition-colors group">
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-bold" style={{ color: "var(--color-white)" }}>
            {label}
          </span>
          {subtext && (
            <span
              className="text-[10px] font-bold"
              style={{ color: "var(--color-slate-400)" }}
            >
              {subtext}
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={cn("font-black")}
          style={{
            color: isCalculated
              ? "var(--color-teal-400)"
              : "var(--color-white)",
          }}
        >
          ₹{amount.toFixed(2)}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <span
          className="text-xs font-bold px-2 py-1 rounded-lg"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--color-slate-700) 50%, transparent)",
            color: "var(--color-slate-400)",
          }}
        >
          {percentage}%
        </span>
      </td>
    </tr>
  );
}
