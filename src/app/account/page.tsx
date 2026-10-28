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
    showToast("Statutory Credentials Saved", "Corporate profile updated across bilateral agreements.", "success");
  };

  const handleResetData = () => {
    if (confirm("Reset all local demonstration listings, NDAs, and deal pipelines to initial seed state?")) {
      MarketplaceStorage.resetToSeed();
      showToast("Demonstration Data Reset", "All platform records restored to default seed state.", "info");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Editorial Masthead */}
      <div className="border-b border-[#e2dfd6] pb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono uppercase tracking-wider text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-navy-900 inline-block" />
            <span>ACCOUNT GOVERNANCE & IDENTITY</span>
            <span>&bull;</span>
            <span className="text-navy-950 font-bold">MCA COMPLIANCE</span>
          </div>
          <span className="text-slate-400">SESSION ID: #{currentUser.id.toUpperCase()}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
              User Profile & Security
            </h1>
            <p className="font-mono text-xs text-slate-500 mt-1">
              Manage statutory corporate identity, verified contact credentials, and session preferences.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <RoleSwitcher />
          </div>
        </div>
      </div>

      {/* Identity Card Dossier */}
      <div className="bg-white p-6 border border-[#e2dfd6] flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-navy-950 text-white flex items-center justify-center font-display font-bold text-xl border border-navy-900">
            {fullName.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-navy-950 text-base">{fullName}</span>
              <span className="font-mono text-[10px] bg-teal-50 text-teal-800 border border-teal-200 font-bold px-2 py-0.5 uppercase tracking-wider">
                ROLE: {currentUser.role}
              </span>
            </div>
            <p className="font-mono text-xs text-slate-500">
              {companyName || "Private Acquisition Principal"} &bull; {city}, {state}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-teal-800 bg-teal-50 px-3 py-1.5 border border-teal-200">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>MCA DIN & PHONE VERIFIED</span>
          </span>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-white p-6 sm:p-8 border border-[#e2dfd6] space-y-6 text-xs">
        <div className="border-b border-[#e2dfd6] pb-3">
          <h3 className="font-display font-bold text-navy-950 text-base">
            Personal & Corporate Statutory Identity
          </h3>
          <p className="text-slate-500 text-xs font-sans mt-0.5">
            These legal credentials will be automatically embedded into executed bilateral NDAs and deal room covenants.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-700 mb-1 font-bold">
              Full Legal Name (as per PAN / DIN)
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2.5 border border-[#e2dfd6] bg-[#fbfbf9] text-navy-950 text-xs focus:ring-1 focus:ring-navy-950 focus:outline-hidden font-sans"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-700 mb-1 font-bold">
              Official Corporate / Firm Entity Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-2.5 border border-[#e2dfd6] bg-[#fbfbf9] text-navy-950 text-xs focus:ring-1 focus:ring-navy-950 focus:outline-hidden font-sans"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-700 mb-1 font-bold">
              Verified Corporate Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 border border-[#e2dfd6] bg-[#fbfbf9] text-navy-950 text-xs focus:ring-1 focus:ring-navy-950 focus:outline-hidden font-sans"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-700 mb-1 font-bold">
              Contact Phone (WhatsApp & SMS Authenticated)
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 border border-[#e2dfd6] bg-[#fbfbf9] text-navy-950 text-xs font-mono focus:ring-1 focus:ring-navy-950 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-700 mb-1 font-bold">
              Principal City / Jurisdiction
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-2.5 border border-[#e2dfd6] bg-[#fbfbf9] text-navy-950 text-xs focus:ring-1 focus:ring-navy-950 focus:outline-hidden font-sans"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-700 mb-1 font-bold">
              State / Union Territory
            </label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full p-2.5 border border-[#e2dfd6] bg-[#fbfbf9] text-navy-950 text-xs focus:ring-1 focus:ring-navy-950 focus:outline-hidden font-sans"
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="pt-4 border-t border-[#e2dfd6] space-y-3">
          <h4 className="font-display font-bold text-navy-950 text-sm">
            Statutory Alert Covenants
          </h4>
          <label className="flex items-center gap-3 cursor-pointer text-slate-700 font-sans">
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 text-teal-700 border-[#e2dfd6] rounded-none focus:ring-0"
            />
            <span>Receive instant deal notification emails when matching acquisition prospectuses are published</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer text-slate-700 font-sans">
            <input
              type="checkbox"
              checked={ndaAlerts}
              onChange={(e) => setNdaAlerts(e.target.checked)}
              className="w-4 h-4 text-teal-700 border-[#e2dfd6] rounded-none focus:ring-0"
            />
            <span>Receive alerts when a bilateral non-disclosure agreement is executed or data vault exhibits are accessed</span>
          </label>
        </div>

        {/* Action button */}
        <div className="pt-4 border-t border-[#e2dfd6] flex justify-end">
          <button
            type="submit"
            className="btn-primary btn-lg"
          >
            CONFIRM & COMMIT PROFILE UPDATES
          </button>
        </div>
      </form>

      {/* Demonstration Sandbox Controls */}
      <div className="p-6 bg-[#fbfbf9] border border-[#e2dfd6] text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">
            LOCAL SANDBOX ENVIRONMENT
          </span>
          <h4 className="font-display font-bold text-navy-950 text-sm">Demonstration State Reset</h4>
          <p className="text-[11px] text-slate-500 font-sans">
            Restore default verified Indian seed listings, CA verified accounts, NDAs, and deal pipeline records.
          </p>
        </div>
        <button
          onClick={handleResetData}
          className="btn-danger btn-sm self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET DEMO DATA</span>
        </button>
      </div>
    </div>
  );
}
