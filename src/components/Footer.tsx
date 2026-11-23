import React from "react";
import Link from "next/link";
import { Building2, ShieldCheck, Scale, PhoneCall, FileText, ArrowUpRight, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm font-sans">
      {/* 1. Trust & Statutory Disclosure Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg flex-shrink-0 mt-0.5">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">
                Neutral Marketplace & Communications Intermediary Notice
              </h4>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed max-w-4xl">
                VyapaarSetu operates as a technology communications exchange connecting business sellers and qualified acquirers under Section 79 of the Information Technology Act, 2000. VyapaarSetu is not a broker, investment adviser, or escrow agent registered with SEBI or RBI. Financial claims are seller representations unless verified by independent chartered accountants.
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-md text-xs font-medium border border-slate-700">
              GSTIN: 27AABCV1234F1Z8
            </span>
          </div>
        </div>
      </div>

      {/* 2. Directory Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Col 1 & 2: Brand & Overview */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5 text-white">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">VyapaarSetu</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/50 text-blue-300 font-medium border border-blue-700/50">
              India
            </span>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed pr-6">
            The premier digital exchange facilitating confidential acquisitions, SME divestments, and strategic majority buyouts across Indian industrial corridors.
          </p>

          <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800/80">
            <p>Corporate: Maker Chambers IV, Nariman Point, Mumbai 400021</p>
            <p>Tech Hub: 100ft Road, Indiranagar, Bengaluru 560038</p>
            <p className="text-blue-400 font-medium">Grievance Desk: compliance@vyapaarsetu.in</p>
          </div>
        </div>

        {/* Col 3: For Buyers */}
        <div>
          <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
            For Acquirers
          </h5>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link href="/businesses" className="hover:text-white transition">All Live Opportunities</Link></li>
            <li><Link href="/businesses?industry=Manufacturing" className="hover:text-white transition">Manufacturing & Tier-1</Link></li>
            <li><Link href="/businesses?industry=B2B+SaaS+%26+Tech" className="hover:text-white transition">B2B SaaS Assets</Link></li>
            <li><Link href="/businesses?industry=Logistics+%26+Supply+Chain" className="hover:text-white transition">Cold-Chain & Fleets</Link></li>
            <li><Link href="/buying-profile" className="hover:text-white transition">Buyer Criteria Setup</Link></li>
            <li><Link href="/dashboard/buyer" className="hover:text-white transition">Buyer Management Hub</Link></li>
          </ul>
        </div>

        {/* Col 4: For Sellers */}
        <div>
          <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
            For Business Owners
          </h5>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link href="/sell/new" className="hover:text-white transition">List Your Business</Link></li>
            <li><Link href="/sell" className="hover:text-white transition">Valuation & Exit Guide</Link></li>
            <li><Link href="/dashboard/seller" className="hover:text-white transition">Seller Portfolio Hub</Link></li>
            <li><Link href="/dashboard/enquiries" className="hover:text-white transition">Manage Inquiries</Link></li>
            <li><Link href="/messages" className="hover:text-white transition">Deal Negotiation Rooms</Link></li>
            <li><Link href="/account" className="hover:text-white transition">Entity KYC & Verification</Link></li>
          </ul>
        </div>

        {/* Col 5: Security & Compliance */}
        <div>
          <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
            Trust & Security
          </h5>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /><span>Bilateral Digital NDA</span></li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /><span>CA Audited Financials</span></li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /><span>MCA21 CIN Verification</span></li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /><span>IT Act 2000 Compliant</span></li>
            <li className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
              Grievance Officer SLA: within 24 business hours.
            </li>
          </ul>
        </div>
      </div>

      {/* 3. Bottom Legal Line */}
      <div className="border-t border-slate-800/80 py-4 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} VyapaarSetu Technologies India Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <Link href="/terms" className="hover:text-white">Terms of Use</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <span>•</span>
            <span>Made for Indian Enterprises</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
