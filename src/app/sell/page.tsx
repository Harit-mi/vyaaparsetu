"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  Lock,
  ShieldCheck,
  Scale,
  Sparkles,
  Building2,
  BadgeCheck,
  ChevronRight,
} from "lucide-react";

export default function SellOverviewPage() {
  return (
    <div className="space-y-16 pb-24">
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200/80 pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/40 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative space-y-6 text-center">
          <div className="inline-flex items-center gap-2 border border-blue-200 bg-blue-50/80 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-800 shadow-xs">
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span>Confidential Divestment Protocol • Promoter Advisory</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            Sell Your Business With{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Absolute Discretion
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            VyapaarSetu connects verified Indian enterprise owners directly with institutional acquirers, family offices, and strategic buyers. Zero leakages, blind teasers, and vetted diligence.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sell/new"
              className="btn-brand btn-lg w-full sm:w-auto shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2"
            >
              <span>List Your Business for Sale</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/businesses"
              className="btn-secondary btn-lg w-full sm:w-auto inline-flex items-center justify-center gap-2"
            >
              <span>Explore Active Listings</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500 font-medium">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              100% Blind Teasers
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Pre-vetted Institutional Buyers
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ₹0 Upfront Cost
            </span>
          </div>
        </div>
      </section>

      {/* 2. THE THREE PILLARS FOR PROMOTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            PROMOTER SAFEGUARDS
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Why Established Business Owners Trust VyapaarSetu
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Built specifically to prevent the operational disruption common in traditional brokerage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-card hover:shadow-card-hover transition-all duration-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl text-slate-900">
              Zero Commercial Leakage
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your registered entity name, exact address, and key customer lists are completely withheld. Competitors, suppliers, and employees cannot identify your operating entity from the public teaser.
            </p>
            <div className="pt-2 text-xs font-semibold text-blue-600 flex items-center gap-1">
              <span>Full blind teaser protection</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-card hover:shadow-card-hover transition-all duration-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl text-slate-900">
              CA & GST Diligence
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Legitimate institutional acquirers discount unverified revenue claims. Listings cross-verified with Form 3CD tax audit reports and 3-year GSTR-9 returns command up to 35% higher multiples.
            </p>
            <div className="pt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <span>Higher closing conversion</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-card hover:shadow-card-hover transition-all duration-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl text-slate-900">
              Enforceable Non-Circumvention
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every buyer introduction and document view is cryptographically time-stamped. Direct backchannel circumvention is strictly legally bound under the Indian Contract Act, 1872.
            </p>
            <div className="pt-2 text-xs font-semibold text-purple-600 flex items-center gap-1">
              <span>180-day attribution covenant</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRANSPARENT FEE STRUCTURE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  TRANSPARENT ECONOMICS
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Success-Based Fee Schedule
                </h3>
                <p className="text-slate-400 text-sm max-w-xl">
                  We only make money when your business successfully closes. No retainers, no marketing fees, no surprise charges.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 self-start sm:self-auto bg-emerald-500/10 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-emerald-500/20">
                <BadgeCheck className="w-4 h-4 text-emerald-400" />
                Zero Upfront Listing Fee
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60 space-y-3">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                  1. Listing & Onboarding
                </span>
                <span className="text-3xl font-extrabold text-white block">₹0 Free</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Teaser creation, valuation advisory benchmark, and verification checks are 100% free of charge.
                </p>
              </div>

              <div className="bg-slate-800/80 rounded-2xl p-6 border border-blue-500/30 space-y-3 relative">
                <div className="absolute -top-3 right-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Only Upon Sale
                </div>
                <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider block">
                  2. Closing Commission
                </span>
                <span className="text-3xl font-extrabold text-blue-400 block">2.0%</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Payable strictly upon definitive closing, escrow release, or share transfer agreement (+ 18% GST).
                </p>
              </div>

              <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60 space-y-3">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                  3. Attribution Window
                </span>
                <span className="text-3xl font-extrabold text-white block">180 Days</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Valid from the date of mutual inquiry acceptance or digital NDA execution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SELLER READINESS CHECKLIST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-slate-200/80 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            DILIGENCE PREPARATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Mandate Preparation Checklist for Promoters
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Having these ready accelerates buyer confidence and compresses diligence time by 4x.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: "1. Corporate Signatory Authority",
              detail: "Promoter DIN verification, Board Resolution, or Partnership Deed approving the divestment.",
            },
            {
              title: "2. 3-Year Audited Financial Statements",
              detail: "Balance sheets, P&L accounts, and Form 3CD Tax Audit Reports for FY22, FY23, and FY24.",
            },
            {
              title: "3. GST GSTR-9 Annual Reconciliations",
              detail: "E-invoice audit trails confirming claimed turnover and eliminating cash-sale discrepancies.",
            },
            {
              title: "4. Capital Asset & Machinery Schedules",
              detail: "Itemized list of machinery with unencumbered hypothecation status (No NOC dues).",
            },
          ].map((item, i) => (
            <div key={i} className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-xs flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">{item.title}</h4>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 text-center">
          <Link
            href="/sell/new"
            className="btn-brand btn-lg inline-flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <span>Proceed to Listing Wizard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
