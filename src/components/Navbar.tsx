"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RoleSwitcher } from "./RoleSwitcher";
import { MarketplaceStorage } from "@/lib/storage";
import { User } from "@/types/marketplace";
import { MarketplaceIcon } from "@/components/icons";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [savedCount, setSavedCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const syncState = () => {
      setCurrentUser(MarketplaceStorage.getCurrentUser());
      setSavedCount(MarketplaceStorage.getSavedListings().length);
    };
    syncState();
    window.addEventListener("vyapaarsetu_state_changed", syncState);
    return () => window.removeEventListener("vyapaarsetu_state_changed", syncState);
  }, []);

  const navLinks = [
    { label: "Deal Discovery", href: "/businesses" },
    { label: "Seller Advisory", href: "/sell" },
    { label: "Acquisition Mandates", href: "/buying-profile" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-ivory-50 border-b border-ivory-400">
      {/* 1. TOP MARKET DATELINE & STATUTORY ADVISORY BAR */}
      <div className="bg-[#0c152b] text-ivory-300 text-[10px] font-mono py-1 px-4 border-b border-[#1a284d] flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="text-bronze-400 font-bold uppercase tracking-widest flex items-center gap-1.5 flex-shrink-0">
            <span className="w-1.5 h-1.5 bg-teal-400 rounded-none inline-block animate-pulse" />
            MARKET ACTIVE
          </span>
          <span className="text-white/40 hidden md:inline">|</span>
          <span className="text-white/80 hidden md:inline truncate">
            MUMBAI • BENGALURU • DELHI NCR • PUNE • HYDERABAD • AHMEDABAD
          </span>
          <span className="text-white/40 hidden lg:inline">|</span>
          <span className="text-teal-300 hidden lg:inline font-semibold">
            ₹142.5 CR TOTAL MANDATES UNDER ATTRIBUTION
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 text-white/60">
          <span className="hidden sm:inline">IT ACT SEC 79 INTERMEDIARY</span>
          <span className="px-1 py-0.2 bg-white/10 text-ivory-200 uppercase font-semibold text-[9px] border border-white/15">
            SAMPLE RECORDS DEMO
          </span>
        </div>
      </div>

      {/* 2. MAIN PUBLICATION HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Masthead */}
        <Link
          href="/"
          className="flex items-center gap-3 flex-shrink-0 group focus:outline-hidden"
        >
          <div className="w-9 h-9 bg-[#0c152b] border border-bronze-500/40 flex items-center justify-center text-white shadow-xs">
            <MarketplaceIcon name="office-building" size="sm" className="text-bronze-300" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-[#0c152b] uppercase">
                VyapaarSetu
              </span>
              <span className="font-mono text-[9px] font-bold text-teal-800 bg-teal-50 px-1 py-0.2 border border-teal-200">
                INDIA
              </span>
            </div>
            <p className="font-serif-editorial italic text-[11px] text-slate-500 -mt-0.5 tracking-normal">
              Private Enterprise Acquisition Exchange
            </p>
          </div>
        </Link>

        {/* Center Editorial Navigation */}
        <nav className="hidden md:flex items-center h-full gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`h-full flex items-center px-3 text-xs uppercase tracking-wider font-semibold transition-colors border-b-2 ${
                  isActive
                    ? "border-[#0c152b] text-[#0c152b] font-bold"
                    : "border-transparent text-slate-600 hover:text-navy-900 hover:border-slate-300"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Institutional Hubs */}
          <div className="flex items-center h-full pl-2 border-l border-ivory-400 gap-1">
            <Link
              href="/dashboard/buyer"
              className={`h-full flex items-center px-2.5 text-[11px] uppercase tracking-wider font-semibold border-b-2 transition ${
                pathname === "/dashboard/buyer"
                  ? "border-teal-700 text-teal-900 bg-teal-50/50"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Buyer Hub
            </Link>

            <Link
              href="/dashboard/seller"
              className={`h-full flex items-center px-2.5 text-[11px] uppercase tracking-wider font-semibold border-b-2 transition ${
                pathname === "/dashboard/seller"
                  ? "border-blue-700 text-blue-900 bg-blue-50/50"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Seller Hub
            </Link>

            <Link
              href="/dashboard/enquiries"
              className={`h-full flex items-center px-2.5 text-[11px] uppercase tracking-wider font-semibold border-b-2 transition gap-1 ${
                pathname === "/dashboard/enquiries"
                  ? "border-navy-900 text-navy-950 bg-ivory-200"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
              title="Enquiries Registry"
            >
              <MarketplaceIcon name="inbox" size="xs" />
              <span>Enquiries</span>
            </Link>

            <Link
              href="/messages"
              className={`h-full flex items-center px-2.5 text-[11px] uppercase tracking-wider font-semibold border-b-2 transition gap-1 ${
                pathname === "/messages"
                  ? "border-navy-900 text-navy-950 bg-ivory-200"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
              title="Deal Negotiation Rooms"
            >
              <MarketplaceIcon name="handshake" size="xs" />
              <span>Deal Rooms</span>
            </Link>
          </div>

          {/* Admin Command Link if role is admin */}
          {currentUser?.role === "admin" && (
            <Link
              href="/admin"
              className="h-full flex items-center px-2.5 text-[11px] font-mono uppercase tracking-wider font-bold text-purple-900 bg-purple-50 border-b-2 border-purple-800 transition"
            >
              <MarketplaceIcon name="shield-check" size="xs" className="mr-1 text-purple-700" />
              <span>Compliance Desk</span>
            </Link>
          )}
        </nav>

        {/* Right Tools & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Saved Mandates Shortcut */}
          <Link
            href="/dashboard/buyer"
            className="p-1.5 text-slate-600 hover:text-navy-950 border border-[#d6d2c4] bg-white hover:bg-[#fbfbf9] hover:border-navy-950/40 rounded-[2px] transition shadow-2xs hidden sm:flex items-center gap-1.5 text-xs"
            title="Saved Mandates Shortlist"
          >
            <MarketplaceIcon name="bookmark" size="xs" className="text-slate-500" />
            {savedCount > 0 && (
              <span className="font-mono text-[10px] font-bold text-teal-800">
                ({savedCount})
              </span>
            )}
          </Link>

          {/* User Account */}
          <Link
            href="/account"
            className={`p-1.5 border rounded-[2px] transition shadow-2xs hidden sm:flex ${
              pathname === "/account"
                ? "border-[#0c152b] bg-navy-950 text-white"
                : "border-[#d6d2c4] bg-white text-slate-600 hover:text-navy-950 hover:border-navy-950/40 hover:bg-[#fbfbf9]"
            }`}
            title="Entity Credentials & KYC"
          >
            <MarketplaceIcon name="user" size="sm" />
          </Link>

          {/* Institutional Role Perspective Switcher */}
          <RoleSwitcher />

          {/* Submit Mandate Primary CTA */}
          <Link
            href="/sell/new"
            className="btn-primary btn-sm hidden sm:inline-flex"
          >
            <MarketplaceIcon name="plus" size="xs" className="text-teal-400" />
            <span>List Mandate</span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 border border-[#d6d2c4] bg-white text-navy-950 hover:bg-[#fbfbf9] rounded-[2px] transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-ivory-400 bg-ivory-50 px-4 py-4 space-y-2 text-xs">
          <Link
            href="/businesses"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 border-b border-ivory-300 font-semibold text-[#0c152b] uppercase tracking-wider"
          >
            Deal Discovery
          </Link>
          <Link
            href="/sell"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 border-b border-ivory-300 font-semibold text-[#0c152b] uppercase tracking-wider"
          >
            Seller Advisory & Valuation
          </Link>
          <Link
            href="/buying-profile"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 border-b border-ivory-300 font-semibold text-[#0c152b] uppercase tracking-wider"
          >
            Acquisition Mandates
          </Link>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Link
              href="/dashboard/buyer"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 border border-ivory-400 bg-white text-center font-bold text-teal-900 uppercase tracking-wider text-[11px]"
            >
              Buyer Hub
            </Link>
            <Link
              href="/dashboard/seller"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 border border-ivory-400 bg-white text-center font-bold text-blue-900 uppercase tracking-wider text-[11px]"
            >
              Seller Hub
            </Link>
            <Link
              href="/dashboard/enquiries"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 border border-ivory-400 bg-white text-center font-bold text-slate-800 uppercase tracking-wider text-[11px]"
            >
              Enquiries
            </Link>
            <Link
              href="/messages"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 border border-ivory-400 bg-white text-center font-bold text-slate-800 uppercase tracking-wider text-[11px]"
            >
              Deal Rooms
            </Link>
          </div>
          <Link
            href="/sell/new"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full py-2.5 mt-2 bg-[#0c152b] text-white text-center font-mono font-bold uppercase tracking-wider"
          >
            + File Listing Mandate
          </Link>
        </div>
      )}
    </header>
  );
}
