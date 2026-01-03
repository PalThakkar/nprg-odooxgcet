"use client";

import React from "react";
import {
  User,
  MapPin,
  Globe,
  Mail,
  Heart,
  Calendar,
  CreditCard,
  Landmark,
  Fingerprint,
  BadgeInfo,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrivateInfoViewProps {
  employee: any;
  isAdmin: boolean;
}

export default function PrivateInfoView({
  employee,
  isAdmin,
}: PrivateInfoViewProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 py-4">
      {/* Personal Information */}
      <div
        className="border rounded-[2.5rem] p-8 shadow-sm"
        style={{
          backgroundColor: "var(--color-slate-900)",
          borderColor: "var(--color-slate-700)",
        }}
      >
        <h3
          className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2"
          style={{ color: "var(--color-slate-400)" }}
        >
          <User
            className="w-4 h-4"
            style={{ color: "var(--color-teal-500)" }}
          />
          Personal Identity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InfoInput
            icon={Calendar}
            label="Date of Birth"
            placeholder="Select date"
            type="date"
            disabled={!isAdmin}
          />
          <InfoInput
            icon={MapPin}
            label="Residing Address"
            placeholder="Street, City, Zip"
            disabled={!isAdmin}
          />
          <InfoInput
            icon={Globe}
            label="Nationality"
            placeholder="e.g. Indian"
            disabled={!isAdmin}
          />
          <InfoInput
            icon={Mail}
            label="Personal Email"
            placeholder="personal@example.com"
            disabled={!isAdmin}
          />
          <InfoInput
            icon={Heart}
            label="Marital Status"
            placeholder="Single / Married"
            disabled={!isAdmin}
          />
          <InfoInput
            icon={BadgeInfo}
            label="Gender"
            placeholder="Male / Female"
            disabled={!isAdmin}
          />
        </div>
      </div>

      {/* Financial & Corporate */}
      <div
        className="border rounded-[2.5rem] p-8 shadow-sm"
        style={{
          backgroundColor: "var(--color-slate-900)",
          borderColor: "var(--color-slate-700)",
        }}
      >
        <h3
          className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2"
          style={{ color: "var(--color-slate-400)" }}
        >
          <Landmark
            className="w-4 h-4"
            style={{ color: "var(--color-emerald-500)" }}
          />
          Bank & Corporate Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InfoInput
            icon={CreditCard}
            label="Account Number"
            placeholder="0000 0000 0000"
            disabled={!isAdmin}
          />
          <InfoInput
            icon={Landmark}
            label="Bank Name"
            placeholder="e.g. HDFC Bank"
            disabled={!isAdmin}
          />
          <InfoInput
            icon={Fingerprint}
            label="IFSC Code"
            placeholder="HDFC0001234"
            disabled={!isAdmin}
          />
          <InfoInput
            icon={BadgeInfo}
            label="PAN Number"
            placeholder="ABCDE1234F"
            disabled={!isAdmin}
          />
          <InfoInput
            icon={BadgeInfo}
            label="UAN Number"
            placeholder="100000000000"
            disabled={!isAdmin}
          />
          <InfoInput
            icon={BadgeInfo}
            label="Employee Code"
            placeholder="EMP-001"
            disabled={!isAdmin}
          />
        </div>
      </div>

      {isAdmin && (
        <Button
          className="w-full h-14 rounded-2xl font-black shadow-lg transition-all active:scale-[0.98]"
          style={{
            background:
              "linear-gradient(135deg, var(--color-teal-600), var(--color-emerald-600))",
            color: "var(--color-white)",
          }}
        >
          <Save className="w-5 h-5 mr-3" />
          Save All Changes
        </Button>
      )}
    </div>
  );
}

function InfoInput({
  icon: Icon,
  label,
  placeholder,
  type = "text",
  disabled,
}: any) {
  return (
    <div className="space-y-2 group">
      <label
        className="text-[10px] font-black uppercase tracking-widest ml-1"
        style={{ color: "var(--color-slate-400)" }}
      >
        {label}
      </label>
      <div className="relative">
        <Icon
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors"
          style={{ color: "var(--color-slate-400)" }}
        />
        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full border-none rounded-2xl py-4 pl-11 pr-4 text-sm font-bold transition-all"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--color-slate-800) 50%, transparent)",
            color: "var(--color-white)",
          }}
        />
      </div>
    </div>
  );
}
