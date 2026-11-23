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
        return { label: "Compliance Desk", tag: "Admin", badgeClass: "bg-purple-50 text-purple-700 border-purple-200", icon: ShieldCheck };
      case "seller":
        return { label: "Promoter", tag: "Seller", badgeClass: "bg-blue-50 text-blue-700 border-blue-200", icon: Briefcase };
      case "buyer":
        return { label: "Acquirer", tag: "Buyer", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: UserCheck };
      default:
        return { label: "Public Visitor", tag: "Guest", badgeClass: "bg-slate-100 text-slate-700 border-slate-200", icon: Eye };
    }
  };

  const currentBadge = getRoleBadge(currentUser.role);
  const Icon = currentBadge.icon;

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-medium transition-all duration-150 rounded-lg shadow-xs hover:shadow-sm bg-white hover:bg-slate-50 ${currentBadge.badgeClass}`}
        title="Switch perspective between Buyer, Seller, Admin and Visitor"
      >
        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="font-semibold hidden lg:inline">
          {currentBadge.tag}:
        </span>
        <span className="text-slate-800 font-medium max-w-[90px] sm:max-w-[130px] truncate">
          {currentUser.fullName}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200/90 rounded-xl shadow-xl z-50 p-3 text-slate-800 text-xs animate-in fade-in duration-100">
          <div className="pb-2.5 mb-2 border-b border-slate-100 flex items-center justify-between">
            <span className="font-semibold text-xs text-slate-900">
              Demo Persona Switcher
            </span>
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-100">
              Interactive Mode
            </span>
          </div>

          <div className="space-y-1">
            {/* Buyer */}
            <button
              onClick={() => switchRole(SEED_USERS[2])}
              className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition ${
                currentUser.role === "buyer"
                  ? "bg-emerald-50 text-emerald-950 font-medium border border-emerald-200"
                  : "hover:bg-slate-50 border border-transparent"
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-slate-900">Vikram Patel</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-medium">
                    Buyer
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">VP Growth Investments (₹50 Cr Budget)</p>
              </div>
            </button>

            {/* Seller */}
            <button
              onClick={() => switchRole(SEED_USERS[1])}
              className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition ${
                currentUser.role === "seller"
                  ? "bg-blue-50 text-blue-950 font-medium border border-blue-200"
                  : "hover:bg-slate-50 border border-transparent"
              }`}
            >
              <Briefcase className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-slate-900">Sunil Sharma</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded font-medium">
                    Seller
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Director, Precision Auto Forgings</p>
              </div>
            </button>

            {/* Admin */}
            <button
              onClick={() => switchRole(SEED_USERS[0])}
              className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition ${
                currentUser.role === "admin"
                  ? "bg-purple-50 text-purple-950 font-medium border border-purple-200"
                  : "hover:bg-slate-50 border border-transparent"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-slate-900">Aarav Deshmukh</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded font-medium">
                    Admin
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Compliance & CA Panel Reviewer</p>
              </div>
            </button>

            {/* Visitor */}
            <button
              onClick={setVisitor}
              className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition ${
                currentUser.role === "visitor"
                  ? "bg-slate-100 text-slate-950 font-medium border border-slate-300"
                  : "hover:bg-slate-50 border border-transparent"
              }`}
            >
              <Eye className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-slate-900">Anonymous Visitor</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded font-medium">
                    Public
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Unregistered prospective acquirer</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
