"use client";

import React, { useState, useEffect } from "react";
import { MarketplaceStorage, SEED_USERS } from "@/lib/storage";
import { User } from "@/types/marketplace";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { useToast } from "@/components/Toast";
import {
  UserCircle,
  ShieldCheck,
  Building,
  Mail,
  Phone,
  MapPin,
  Lock,
  Bell,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Key,
  Building2,
  FileCheck,
} from "lucide-react";

export default function AccountSettingsPage() {
  const [currentUser, setCurrentUser] = useState<User>(MarketplaceStorage.getCurrentUser());
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [companyName, setCompanyName] = useState(currentUser.companyName || "");
  const [city, setCity] = useState(currentUser.city);
  const [state, setState] = useState(currentUser.state);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [ndaAlerts, setNdaAlerts] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const sync = () => {
      const u = MarketplaceStorage.getCurrentUser();
      setCurrentUser(u);
      setFullName(u.fullName);
      setEmail(u.email);
      setPhone(u.phone);
      setCompanyName(u.companyName || "");
      setCity(u.city);
      setState(u.state);
    };
    sync();
    window.addEventListener("vyapaarsetu_state_changed", sync);
    return () => window.removeEventListener("vyapaarsetu_state_changed", sync);
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...currentUser,
      fullName,
      email,
      phone,
      companyName,
      city,
      state,
    };
    MarketplaceStorage.setCurrentUser(updated);
    showToast("Profile Saved", "Your profile details have been successfully updated.", "success");
  };

  const handleResetData = () => {
    if (confirm("Reset all local demonstration listings, NDAs, and deal pipelines to initial seed state?")) {
      MarketplaceStorage.resetToSeed();
      showToast("Demonstration Data Reset", "All platform records restored to default seed state.", "info");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
            <span className="font-semibold text-slate-700">Account Governance</span>
            <span>•</span>
            <span className="text-slate-500">Session ID #{currentUser.id}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Profile & Security
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage your verified credentials, company entity information, and alert settings.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <RoleSwitcher />
          </div>
        </div>
      </div>

      {/* Identity Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-xs">
            {fullName.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-base">{fullName}</span>
              <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded-full capitalize">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {companyName || "Private Acquisition Principal"} • {city}, {state}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <ShieldCheck className="w-4 h-4" />
            <span>KYC & Phone Verified</span>
          </span>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-card space-y-6 text-sm">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base">
            Personal & Entity Information
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">
            These details are used when generating digitally watermarked NDAs and deal room documents.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Full Legal Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Company / Entity Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Official Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Contact Phone
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              State
            </label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h4 className="font-bold text-slate-900 text-sm">
            Notifications & Alerts
          </h4>
          <label className="flex items-center gap-3 cursor-pointer text-slate-600 text-xs">
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span>Receive instant deal notification emails when matching acquisition prospectuses are published</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer text-slate-600 text-xs">
            <input
              type="checkbox"
              checked={ndaAlerts}
              onChange={(e) => setNdaAlerts(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span>Receive alerts when a bilateral non-disclosure agreement is executed or data vault exhibits are accessed</span>
          </label>
        </div>

        {/* Action button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="btn-brand btn-lg"
          >
            Save Profile Changes
          </button>
        </div>
      </form>

      {/* Demonstration Sandbox Controls */}
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[11px]">
            Demo Environment Controls
          </span>
          <h4 className="font-bold text-slate-900 text-sm">Demonstration State Reset</h4>
          <p className="text-xs text-slate-500">
            Restore default verified Indian seed listings, CA verified accounts, NDAs, and deal pipeline records.
          </p>
        </div>
        <button
          onClick={handleResetData}
          className="btn-danger btn-sm self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </div>
  );
}
