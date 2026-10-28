"use client";

import React, { useState, useEffect } from "react";
import { MarketplaceStorage, SEED_USERS } from "@/lib/storage";
import { User, UserRole } from "@/types/marketplace";
import { ShieldCheck, UserCheck, Briefcase, Eye, ChevronDown } from "lucide-react";

export function RoleSwitcher() {
  const [currentUser, setCurrentUser] = useState<User>(SEED_USERS[2]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setCurrentUser(MarketplaceStorage.getCurrentUser());
    const handleUpdate = () => {
      setCurrentUser(MarketplaceStorage.getCurrentUser());
    };
    window.addEventListener("vyapaarsetu_state_changed", handleUpdate);
    return () => window.removeEventListener("vyapaarsetu_state_changed", handleUpdate);
  }, []);

  const switchRole = (user: User) => {
    MarketplaceStorage.setCurrentUser(user);
    setCurrentUser(user);
    setIsOpen(false);
  };

  const setVisitor = () => {
    const visitor: User = {
      id: "usr-guest",
      email: "guest@visitor.in",
      fullName: "Guest Observer",
      phone: "+91 00000 00000",
      role: "visitor",
      isEmailVerified: false,
      isPhoneVerified: false,
      city: "New Delhi",
      state: "Delhi",
      createdAt: new Date().toISOString(),
    };
    MarketplaceStorage.setCurrentUser(visitor);
    setCurrentUser(visitor);
    setIsOpen(false);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return { label: "COMPLIANCE DESK", tag: "Admin", border: "border-purple-300 text-purple-900 bg-purple-50", icon: ShieldCheck };
      case "seller":
        return { label: "MANDATE PROMOTER", tag: "Seller", border: "border-blue-300 text-blue-900 bg-blue-50", icon: Briefcase };
      case "buyer":
        return { label: "QUALIFIED ACQUIRER", tag: "Buyer", border: "border-teal-700 text-teal-900 bg-teal-50", icon: UserCheck };
      default:
        return { label: "PUBLIC OBSERVER", tag: "Guest", border: "border-ivory-400 text-slate-800 bg-ivory-100", icon: Eye };
    }
  };

  const currentBadge = getRoleBadge(currentUser.role);
  const Icon = currentBadge.icon;

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 border text-xs transition-all duration-150 rounded-[2px] shadow-2xs hover:shadow-xs hover:bg-white focus-visible:outline-hidden ${currentBadge.border}`}
        title="Switch perspective between Buyer, Seller, Admin and Visitor"
      >
        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="font-mono text-[10px] tracking-wider uppercase font-semibold hidden lg:inline">
          {currentBadge.label}:
        </span>
        <span className="font-sans font-medium text-xs max-w-[80px] sm:max-w-[120px] truncate">
          {currentUser.fullName}
        </span>
        <ChevronDown className="w-3 h-3 opacity-60 flex-shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-80 bg-white border border-ivory-400 shadow-xl z-50 p-3 text-slate-800 text-xs animate-in fade-in duration-100">
          <div className="pb-2 mb-2 border-b border-ivory-300 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold">
              Simulate Market Role
            </span>
            <span className="font-mono text-[9px] text-teal-800 uppercase bg-teal-50 px-1.5 py-0.5 border border-teal-200">
              Session Sandbox
            </span>
          </div>

          <div className="space-y-1.5">
            {/* Buyer */}
            <button
              onClick={() => switchRole(SEED_USERS[2])}
              className={`w-full flex items-start gap-2.5 p-2 text-left border transition ${
                currentUser.role === "buyer"
                  ? "bg-teal-50 border-teal-700 text-teal-950 font-medium"
                  : "border-transparent hover:bg-ivory-100 hover:border-ivory-300"
              }`}
            >
              <UserCheck className="w-4 h-4 text-teal-700 mt-0.5 flex-shrink-0" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs">Vikram Patel</span>
                  <span className="font-mono text-[9px] uppercase px-1 bg-teal-100 text-teal-900 font-semibold">
                    Acquirer
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">VP Growth Investments Ltd (₹50 Cr ticket size)</p>
              </div>
            </button>

            {/* Seller */}
            <button
              onClick={() => switchRole(SEED_USERS[1])}
              className={`w-full flex items-start gap-2.5 p-2 text-left border transition ${
                currentUser.role === "seller"
                  ? "bg-blue-50 border-blue-700 text-blue-950 font-medium"
                  : "border-transparent hover:bg-ivory-100 hover:border-ivory-300"
              }`}
            >
              <Briefcase className="w-4 h-4 text-blue-700 mt-0.5 flex-shrink-0" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs">Sunil Sharma</span>
                  <span className="font-mono text-[9px] uppercase px-1 bg-blue-100 text-blue-900 font-semibold">
                    Promoter
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Shree Ganesh Precision Forgings LLP (Pune)</p>
              </div>
            </button>

            {/* Admin */}
            <button
              onClick={() => switchRole(SEED_USERS[0])}
              className={`w-full flex items-start gap-2.5 p-2 text-left border transition ${
                currentUser.role === "admin"
                  ? "bg-purple-50 border-purple-700 text-purple-950 font-medium"
                  : "border-transparent hover:bg-ivory-100 hover:border-ivory-300"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-700 mt-0.5 flex-shrink-0" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs">Aarav Deshmukh</span>
                  <span className="font-mono text-[9px] uppercase px-1 bg-purple-100 text-purple-900 font-semibold">
                    Compliance
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Chief Compliance Officer & Listing Moderator</p>
              </div>
            </button>

            {/* Public Visitor */}
            <button
              onClick={setVisitor}
              className={`w-full flex items-start gap-2.5 p-2 text-left border transition ${
                currentUser.role === "visitor"
                  ? "bg-ivory-200 border-slate-600 text-slate-900 font-medium"
                  : "border-transparent hover:bg-ivory-100 hover:border-ivory-300"
              }`}
            >
              <Eye className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs">Guest Observer</span>
                  <span className="font-mono text-[9px] uppercase px-1 bg-slate-200 text-slate-800">
                    Public
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Unregistered explorer (Standard blind listings)</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
