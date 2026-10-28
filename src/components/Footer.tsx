import React from "react";
import Link from "next/link";
import { MarketplaceIcon } from "@/components/icons";

export function Footer() {
  return (
    <footer className="bg-[#070d1e] text-slate-400 border-t border-[#1a284d] text-xs font-sans">
      {/* 1. TOP STATUTORY NOTICE ACCORD */}
      <div className="border-b border-[#142343] bg-[#0c152b] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <MarketplaceIcon name="scale" size="sm" className="text-bronze-300 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-mono uppercase tracking-wider text-xs font-bold">
                Statutory Intermediary Notice & Market Operating Model
              </h4>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed max-w-4xl">
                VyapaarSetu operates purely as a neutral digital communications and introduction exchange connecting business sellers and qualified acquirers under Section 79 of the Information Technology Act, 2000. VyapaarSetu is not a broker, investment adviser, portfolio manager, legal counsel, or escrow agent registered with SEBI, RBI, or any financial regulator. All listings, turnover claims, and EBITDA figures are seller-provided representations unless explicitly endorsed with the &apos;CA Verified&apos; badge.
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 font-mono text-[11px]">
            <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-ivory-200 uppercase font-semibold">
              GSTIN: 27AABCV1234F1Z8
            </span>
          </div>
        </div>
      </div>

      {/* 2. EDITORIAL DIRECTORY COLUMNS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Col 1 & 2: Colophon & Corporate Registry */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5 text-white">
            <div className="w-8 h-8 bg-[#0c152b] border border-bronze-500/40 flex items-center justify-center">
              <MarketplaceIcon name="office-building" size="sm" className="text-bronze-300" />
            </div>
            <div>
              <span className="font-display font-extrabold text-base tracking-tight uppercase">VyapaarSetu</span>
              <span className="font-mono text-[9px] text-teal-400 ml-1.5 font-bold uppercase tracking-widest">[v2.4-IND]</span>
            </div>
          </div>

          <p className="font-serif-editorial italic text-xs text-slate-300 leading-relaxed pr-6">
            Private-market exchange facilitating discreet acquisitions, majority recapitalizations, and strategic asset transfers across Indian industrial corridors.
          </p>

          <div className="font-mono text-[11px] text-slate-400 space-y-1 pt-2 border-t border-[#142343]">
            <p>Corporate: Maker Chambers IV, Nariman Point, Mumbai 400021</p>
            <p>Tech Registry: 100ft Road, Indiranagar, Bengaluru 560038</p>
            <p className="text-teal-400">Grievance Desk: compliance@vyapaarsetu.in</p>
          </div>
        </div>

        {/* Col 3: For Acquirers */}
        <div>
          <h5 className="font-mono text-[11px] uppercase tracking-wider text-white font-bold mb-3">
            Acquisition Mandates
          </h5>
          <ul className="space-y-2 font-mono text-xs text-slate-400">
            <li><Link href="/businesses" className="hover:text-white transition">All Live Mandates</Link></li>
            <li><Link href="/businesses?industry=Manufacturing" className="hover:text-white transition">Manufacturing & Tier-1</Link></li>
            <li><Link href="/businesses?industry=B2B+SaaS+%26+Tech" className="hover:text-white transition">B2B SaaS Assets</Link></li>
            <li><Link href="/businesses?industry=Logistics+%26+Supply+Chain" className="hover:text-white transition">Cold-Chain & Fleets</Link></li>
            <li><Link href="/buying-profile" className="hover:text-white transition">Acquisition Profile Criteria</Link></li>
            <li><Link href="/dashboard/buyer" className="hover:text-white transition">Buyer Management Hub</Link></li>
          </ul>
        </div>

        {/* Col 4: For Business Owners */}
        <div>
          <h5 className="font-mono text-[11px] uppercase tracking-wider text-white font-bold mb-3">
            Promoter Advisory
          </h5>
          <ul className="space-y-2 font-mono text-xs text-slate-400">
            <li><Link href="/sell/new" className="hover:text-white transition">File Mandate Listing</Link></li>
            <li><Link href="/sell" className="hover:text-white transition">Exit Preparation Guide</Link></li>
            <li><Link href="/dashboard/seller" className="hover:text-white transition">Seller Portfolio Hub</Link></li>
            <li><Link href="/dashboard/enquiries" className="hover:text-white transition">Manage Inquiries</Link></li>
            <li><Link href="/messages" className="hover:text-white transition">Deal Negotiation Rooms</Link></li>
            <li><Link href="/account" className="hover:text-white transition">Entity KYC & Authority</Link></li>
          </ul>
        </div>

        {/* Col 5: Governance & Standards */}
        <div>
          <h5 className="font-mono text-[11px] uppercase tracking-wider text-white font-bold mb-3">
            Legal & Governance
          </h5>
          <ul className="space-y-2 font-mono text-xs text-slate-400">
            <li><span className="text-white">Bilateral NDA Workflow</span></li>
            <li><span className="text-white">180-Day Deal Attribution</span></li>
            <li><span className="text-white">CA Panel Verification</span></li>
            <li><span className="text-white">IT Act Section 79 Compliance</span></li>
            <li className="pt-2 border-t border-[#142343] text-[10px]">
              <span className="text-bronze-300 font-bold block">DISPUTES & GRIEVANCE:</span>
              <span>Grievance Officer response within 24 business hours.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. BOTTOM LEGAL LINE & ATTRIBUTION */}
      <div className="border-t border-[#142343] py-4 px-4 font-mono text-[10px] text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} VyapaarSetu Technologies India Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Regulated-compliant intermediary</span>
            <span>•</span>
            <span className="text-slate-400">
              Icons curated from <a href="https://www.flaticon.com/" target="_blank" rel="noopener noreferrer" className="hover:text-teal-300 underline">Flaticon</a> by Freepik (Basic License with attribution)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
