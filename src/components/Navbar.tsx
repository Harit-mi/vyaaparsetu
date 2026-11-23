"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RoleSwitcher } from "./RoleSwitcher";
import { MarketplaceStorage } from "@/lib/storage";
import { User } from "@/types/marketplace";
import {
  Building2,
  Bookmark,
  MessageSquare,
  Plus,
  Menu,
  X,
  ShieldCheck,
  UserCheck,
  Inbox,
  Briefcase,
  Layers,
  ArrowRight,
} from "lucide-react";

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
    { label: "Marketplace", href: "/businesses" },
    { label: "Sell a Business", href: "/sell" },
    { label: "Acquisition Criteria", href: "/buying-profile" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 flex-shrink-0 group focus:outline-hidden"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-lg font-bold tracking-tight text-slate-900">
                Vyapaar<span className="text-blue-600">Setu</span>
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">
                IN
              </span>
            </div>
            <span className="text-[10px] font-medium text-slate-500 -mt-1 hidden sm:block">
              Business Acquisition Exchange
            </span>
          </div>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center h-full gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "text-blue-600 bg-blue-50 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Quick Portals Divider */}
          <div className="h-4 w-px bg-slate-200 mx-1" />

          <Link
            href="/dashboard/buyer"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
              pathname === "/dashboard/buyer"
                ? "text-blue-600 bg-blue-50 font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            Buyer Hub
          </Link>

          <Link
            href="/dashboard/seller"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
              pathname === "/dashboard/seller"
                ? "text-blue-600 bg-blue-50 font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            Seller Hub
          </Link>

          <Link
            href="/dashboard/enquiries"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
              pathname === "/dashboard/enquiries"
                ? "text-blue-600 bg-blue-50 font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
            title="Inquiries"
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Inquiries</span>
          </Link>

          <Link
            href="/messages"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
              pathname === "/messages"
                ? "text-blue-600 bg-blue-50 font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
            title="Deal Rooms"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Deal Rooms</span>
          </Link>

          {/* Admin link */}
          {currentUser?.role === "admin" && (
            <Link
              href="/admin"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Compliance</span>
            </Link>
          )}
        </nav>

        {/* Right Tools & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Saved Shortlist */}
          <Link
            href="/dashboard/buyer"
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition hidden sm:flex items-center gap-1 text-xs"
            title="Saved Businesses"
          >
            <Bookmark className="w-4 h-4 text-slate-500" />
            {savedCount > 0 && (
              <span className="font-semibold text-xs text-blue-600">
                {savedCount}
              </span>
            )}
          </Link>

          {/* Role Switcher */}
          <RoleSwitcher />

          {/* Primary CTA */}
          <Link
            href="/sell/new"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shadow-xs hover:shadow"
          >
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            <span>List Business</span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 text-sm shadow-lg">
          <Link
            href="/businesses"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-3 font-semibold text-slate-900 hover:bg-slate-50 rounded-lg"
          >
            Marketplace Discovery
          </Link>
          <Link
            href="/sell"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-3 font-semibold text-slate-900 hover:bg-slate-50 rounded-lg"
          >
            Sell a Business
          </Link>
          <Link
            href="/buying-profile"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-3 font-semibold text-slate-900 hover:bg-slate-50 rounded-lg"
          >
            Acquisition Mandates
          </Link>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <Link
              href="/dashboard/buyer"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-slate-50 text-slate-800 text-center font-semibold rounded-lg hover:bg-slate-100"
            >
              Buyer Hub
            </Link>
            <Link
              href="/dashboard/seller"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-slate-50 text-slate-800 text-center font-semibold rounded-lg hover:bg-slate-100"
            >
              Seller Hub
            </Link>
            <Link
              href="/dashboard/enquiries"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-slate-50 text-slate-800 text-center font-semibold rounded-lg hover:bg-slate-100"
            >
              Inquiries
            </Link>
            <Link
              href="/messages"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-slate-50 text-slate-800 text-center font-semibold rounded-lg hover:bg-slate-100"
            >
              Deal Rooms
            </Link>
          </div>

          <Link
            href="/sell/new"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full py-2.5 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm"
          >
            + List Your Business Free
          </Link>
        </div>
      )}
    </header>
  );
}
