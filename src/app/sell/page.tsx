"use client";

import React from "react";
import Link from "next/link";
import { MarketplaceIcon } from "@/components/icons";
import {
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
} from "lucide-react";

export default function SellOverviewPage() {
  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* 1. EDITORIAL HEADER */}
      <section className="bg-ivory-100 border-b border-ivory-400 pt-10 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 border border-bronze-400 bg-bronze-50 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-bronze-800">
            <MarketplaceIcon name="lock" size="xs" className="text-bronze-700" />
            <span>CONFIDENTIAL DIVESTMENT PROTOCOL • PROMOTER ADVISORY</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0c152b] leading-[1.15]">
            Discreet Enterprise Divestment to Qualified Institutional Acquirers.
          </h1>

          <p className="font-serif-editorial italic text-base sm:text-lg text-slate-700 leading-relaxed max-w-3xl">
            VyapaarSetu safeguards corporate goodwill, supplier accounts, and employee stability with strict blind teasers, dynamic cryptographic watermarking, and pre-screened financial acquirers.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/sell/new"
              className="btn-primary btn-lg w-full sm:w-auto"
            >
              <span>File Listing Mandate</span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
            </Link>

            <Link
              href="/businesses"
              className="btn-secondary btn-lg w-full sm:w-auto"
            >
              <span>Examine Live Market Teasers</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. THE THREE FIDUCIARY PILLARS FOR PROMOTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-ivory-400 pb-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-teal-800 font-bold">
            FOUNDER SAFEGUARDS
          </span>
          <h2 className="font-display text-2xl font-extrabold text-[#0c152b] mt-1">
            Why Established Business Owners Mandate VyapaarSetu
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div className="bg-white border border-ivory-400 p-6 space-y-3">
            <span className="text-bronze-700 font-bold uppercase tracking-wider text-[10px] block">
              PILLAR 01: BLIND TEASERS
            </span>
            <h3 className="font-display font-bold text-base text-[#0c152b]">
              Zero Commercial Leakage
            </h3>
            <p className="font-sans text-xs text-slate-600 leading-relaxed">
              Your registered CIN, company trade name, and exact address are completely withheld. Competitors, lenders, and employees cannot identify your operating entity from the public teaser.
            </p>
          </div>

          <div className="bg-white border border-ivory-400 p-6 space-y-3">
            <span className="text-teal-800 font-bold uppercase tracking-wider text-[10px] block">
              PILLAR 02: DILIGENCE DISCIPLINE
            </span>
            <h3 className="font-display font-bold text-base text-[#0c152b]">
              CA Audit Endorsement
            </h3>
            <p className="font-sans text-xs text-slate-600 leading-relaxed">
              Legitimate buyers discount unverified claims. Mandates cross-verified with Form 3CD tax audit reports and 3-year GSTR-9 returns command up to 35% higher multiples.
            </p>
          </div>

          <div className="bg-white border border-ivory-400 p-6 space-y-3">
            <span className="text-slate-800 font-bold uppercase tracking-wider text-[10px] block">
              PILLAR 03: LEGAL INTEGRITY
            </span>
            <h3 className="font-display font-bold text-base text-[#0c152b]">
              180-Day Attribution Covenant
            </h3>
            <p className="font-sans text-xs text-slate-600 leading-relaxed">
              Every introduction is legally time-stamped. Direct circumvention attempts by buyers are strictly bound by the platform agreement under the Indian Contract Act, 1872.
            </p>
          </div>
        </div>
      </section>

      {/* 3. M&A COMMISSION MATRIX & FEE SCHEDULE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-ivory-100 border border-ivory-400 p-6 sm:p-8 space-y-6">
          <div className="border-b border-ivory-300 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                COMMISSION TRANSPARENCY
              </span>
              <h3 className="font-display font-extrabold text-xl text-[#0c152b]">
                Success-Based Fiduciary Fee Schedule
              </h3>
            </div>
            <span className="font-mono text-xs text-teal-800 bg-teal-50 px-2 py-1 border border-teal-200 uppercase font-semibold">
              Zero Upfront Listing Fee
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="bg-white p-5 border border-ivory-300 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">1. LISTING & ONBOARDING</span>
              <span className="font-display font-bold text-lg text-[#0c152b] block">₹0 Upfront</span>
              <p className="font-sans text-xs text-slate-600">
                Mandate drafting, teaser creation, and initial verification are completely complimentary.
              </p>
            </div>

            <div className="bg-white p-5 border border-ivory-300 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">2. CLOSING COMMISSION</span>
              <span className="font-display font-bold text-lg text-teal-800 block">2.0% Success Fee</span>
              <p className="font-sans text-xs text-slate-600">
                Payable strictly upon definitive closing, escrow release, or share transfer (+ 18% GST).
              </p>
            </div>

            <div className="bg-white p-5 border border-ivory-300 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">3. ATTRIBUTION WINDOW</span>
              <span className="font-display font-bold text-lg text-bronze-700 block">180 Days</span>
              <p className="font-sans text-xs text-slate-600">
                Valid from date of mutual enquiry acceptance or digital NDA execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROMOTER EXIT READINESS CHECKLIST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-ivory-400 pb-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-teal-800 font-bold">
            STATUTORY READINESS
          </span>
          <h2 className="font-display text-2xl font-extrabold text-[#0c152b] mt-1">
            Mandate Preparation Checklist for Promoters
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
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
            <div key={i} className="p-4 bg-white border border-ivory-400 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900">{item.title}</h4>
                <p className="font-sans text-xs text-slate-500 mt-1">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 text-center">
          <Link
            href="/sell/new"
            className="btn-primary btn-lg inline-flex items-center gap-2"
          >
            <span>Proceed to Listing Mandate Wizard</span>
            <ArrowRight className="w-4 h-4 text-teal-400" />
          </Link>
        </div>
      </section>
    </div>
  );
}
