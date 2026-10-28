"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MarketplaceStorage } from "@/lib/storage";
import {
  BusinessListing,
  Inquiry,
  ConfidentialityAgreement,
  DealRecord,
  BuyerProfile,
} from "@/types/marketplace";
import { formatINR, formatDate } from "@/lib/utils";
import { ListingCard } from "@/components/ListingCard";
import { DealPipelineView } from "@/components/DealPipelineView";
import { useToast } from "@/components/Toast";
import {
  UserCheck,
  Bookmark,
  Send,
  Lock,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  SlidersHorizontal,
  Building,
  ArrowRight,
  Briefcase,
  Sparkles,
  Search,
  FileText,
  Building2,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export default function BuyerDashboardPage() {
  const [currentUser, setCurrentUser] = useState(MarketplaceStorage.getCurrentUser());
  const [savedListingIds, setSavedListingIds] = useState<string[]>([]);
  const [allListings, setAllListings] = useState<BusinessListing[]>([]);
  const [matchedListings, setMatchedListings] = useState<BusinessListing[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [ndas, setNdas] = useState<ConfidentialityAgreement[]>([]);
  const [deals, setDeals] = useState<DealRecord[]>([]);
  const [buyerProfile, setBuyerProfile] = useState<BuyerProfile>(MarketplaceStorage.getBuyerProfile());
  const [activeTab, setActiveTab] = useState<"matches" | "saved" | "inquiries" | "ndas" | "deals">("matches");
  const { showToast } = useToast();

  useEffect(() => {
    const sync = () => {
      setCurrentUser(MarketplaceStorage.getCurrentUser());
      setSavedListingIds(MarketplaceStorage.getSavedListings());
      setAllListings(MarketplaceStorage.getListings());
      setMatchedListings(MarketplaceStorage.getMatchesForBuyer());
      setInquiries(MarketplaceStorage.getInquiries());
      setNdas(MarketplaceStorage.getNDAs());
      setDeals(MarketplaceStorage.getDeals());
      setBuyerProfile(MarketplaceStorage.getBuyerProfile());
    };
    sync();
    window.addEventListener("vyapaarsetu_state_changed", sync);
    return () => window.removeEventListener("vyapaarsetu_state_changed", sync);
  }, []);

  const savedListings = allListings.filter((l) => savedListingIds.includes(l.id));
  const activeDeal = deals[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Editorial Header / Desk Masthead */}
      <div className="border-b border-[#e2dfd6] pb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono uppercase tracking-wider text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-teal-600 inline-block" />
            <span>ACQUISITION CONTROL DESK</span>
            <span>&bull;</span>
            <span className="text-navy-950 font-bold">DOSSIER #ACQ-{currentUser.id.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-teal-800 font-semibold bg-teal-50 px-2.5 py-0.5 border border-teal-200">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
              MCA DIN & PROOF OF FUNDS VERIFIED
            </span>
            <span className="text-slate-400">ACTIVE SESSION</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
              {currentUser.fullName}
            </h1>
            <p className="font-mono text-xs text-slate-600">
              {currentUser.companyName || "Growth Capital Holdings Ltd"} &nbsp;|&nbsp; {currentUser.city}, {currentUser.state}
            </p>
          </div>

          {/* Mandate Ledger Strip */}
          <div className="bg-white border border-[#e2dfd6] p-4 text-xs space-y-2 lg:min-w-[420px]">
            <div className="flex items-center justify-between border-b border-[#e2dfd6] pb-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                ACQUISITION MANDATE LEDGER
              </span>
              <Link
                href="/buying-profile"
                className="font-mono text-[11px] text-teal-700 font-bold hover:underline flex items-center gap-1"
              >
                <span>EDIT CRITERIA</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-1 font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">CAPITAL ALLOCATION</span>
                <span className="text-navy-950 font-bold text-xs tabular-nums">
                  {formatINR(buyerProfile.minBudget)} – {formatINR(buyerProfile.maxBudget)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">ACQUISITION EXP</span>
                <span className="text-navy-950 font-bold text-xs uppercase">
                  {buyerProfile.acquisitionExperience.replace(/_/g, " ")}
                </span>
              </div>
            </div>
            <div className="text-[11px] text-slate-600 truncate border-t border-[#e2dfd6]/70 pt-1.5 font-sans">
              <span className="font-mono text-[10px] text-slate-400 uppercase">TARGET SECTORS: </span>
              {buyerProfile.preferredIndustries.join(", ")}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1 border-b border-[#e2dfd6] overflow-x-auto bg-[#f5f4ef] p-1">
        {[
          { key: "matches", label: "CURATED MATCHES", count: matchedListings.length },
          { key: "saved", label: "SAVED SHORTLIST", count: savedListings.length },
          { key: "inquiries", label: "TRANSMITTED ENQUIRIES", count: inquiries.length },
          { key: "ndas", label: "BILATERAL NDAS", count: ndas.length },
          { key: "deals", label: "DEAL ROOM PIPELINE", count: deals.length },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 font-mono text-xs font-bold transition uppercase tracking-wider whitespace-nowrap border ${
                isActive
                  ? "bg-white text-navy-950 border-[#e2dfd6] border-b-transparent shadow-xs"
                  : "bg-transparent text-slate-600 border-transparent hover:text-navy-950 hover:bg-white/60"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`ml-1.5 font-mono text-[11px] tabular-nums ${isActive ? "text-teal-700 font-extrabold" : "text-slate-400"}`}>
                [{tab.count}]
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CURATED MATCHES */}
      {activeTab === "matches" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e2dfd6] pb-3">
            <div>
              <h2 className="font-display text-lg font-bold text-navy-950 tracking-tight">
                MANDATE-MATCHED PROSPECTUSES
              </h2>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Qualified opportunities matching your ticket size ({formatINR(buyerProfile.minBudget)} – {formatINR(buyerProfile.maxBudget)}) and target industries.
              </p>
            </div>
            <Link
              href="/businesses"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-teal-800 hover:text-teal-950 uppercase tracking-wider"
            >
              <span>SEARCH ALL {allListings.length} LISTINGS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedListings.map((l) => (
              <div key={l.id} className="relative">
                <div className="absolute top-3 right-3 z-20 bg-teal-800 text-white font-mono font-bold text-[10px] px-2 py-0.5 border border-teal-900 tracking-wider shadow-xs">
                  {l.matchScore || 94}% MANDATE MATCH
                </div>
                <ListingCard listing={l} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SAVED LISTINGS */}
      {activeTab === "saved" && (
        <div className="space-y-4">
          {savedListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedListings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 border border-[#e2dfd6] text-center space-y-4">
              <div className="w-12 h-12 border border-[#e2dfd6] bg-[#fbfbf9] flex items-center justify-center mx-auto text-slate-400">
                <Bookmark className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-navy-950 text-base">NO SHORTLISTED OPPORTUNITIES</h3>
                <p className="text-xs text-slate-500 font-sans max-w-md mx-auto">
                  Click the bookmark action on any business listing card to save it to your confidential investment committee shortlist.
                </p>
              </div>
              <Link
                href="/businesses"
                className="inline-block mt-2 px-5 py-2.5 bg-navy-950 text-white font-mono text-xs uppercase tracking-wider font-bold hover:bg-navy-900 transition"
              >
                BROWSE OPPORTUNITY CATALOGUE
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: INQUIRIES */}
      {activeTab === "inquiries" && (
        <div className="space-y-4">
          <div className="border border-[#e2dfd6] bg-white divide-y divide-[#e2dfd6]">
            <div className="p-4 bg-[#fbfbf9] flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-500">
              <span>TRANSMITTED COMMERCIAL ENQUIRY LEDGER</span>
              <span>TOTAL: {inquiries.length} TRANSMISSIONS</span>
            </div>

            {inquiries.map((inq) => (
              <div key={inq.id} className="p-6 space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block">
                      TARGET MANDATE OPPORTUNITY
                    </span>
                    <h4 className="font-display font-bold text-navy-950 text-base">{inq.listingTitle}</h4>
                    <span className="font-mono text-[11px] text-slate-500">
                      TRANSMITTED ON {formatDate(inq.createdAt)} &bull; PROMOTER REF: #{inq.sellerId}
                    </span>
                  </div>

                  <span
                    className={`font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border self-start ${
                      inq.status === "accepted"
                        ? "bg-teal-50 text-teal-800 border-teal-300"
                        : "bg-amber-50 text-amber-800 border-amber-300"
                    }`}
                  >
                    STATUS: {inq.status.replace("_", " ")}
                  </span>
                </div>

                <div className="bg-[#fbfbf9] p-4 border border-[#e2dfd6] space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-navy-900 border-b border-[#e2dfd6] pb-2">
                    <span>
                      INDICATIVE VALUATION:{" "}
                      <strong className="text-teal-800 font-bold tabular-nums">
                        {inq.indicativeOfferBudget ? formatINR(inq.indicativeOfferBudget) : "NEGOTIABLE / UNDISCLOSED"}
                      </strong>
                    </span>
                    <span>
                      SOURCE OF FUNDS: <strong className="text-navy-950 font-bold uppercase">{inq.intendedFundingSource}</strong>
                    </span>
                  </div>
                  <p className="text-slate-700 font-serif italic text-xs leading-relaxed pt-1">
                    &ldquo;{inq.message}&rdquo;
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="font-mono text-[11px] text-slate-400">
                    TRANSACTION ATTRIBUTION WINDOW PROTECTED UNDER SECTION 79 IT ACT
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/dashboard/enquiries"
                      className="btn-secondary btn-sm"
                    >
                      FULL ENQUIRY LOG
                    </Link>
                    <Link
                      href="/messages"
                      className="btn-primary btn-sm"
                    >
                      OPEN DEAL ROOM CHAT
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: NDAS */}
      {activeTab === "ndas" && (
        <div className="space-y-4">
          <div className="border border-[#e2dfd6] bg-white divide-y divide-[#e2dfd6]">
            <div className="p-4 bg-[#fbfbf9] flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-500">
              <span>EXECUTED BILATERAL CONFIDENTIALITY COVENANTS</span>
              <span>TOTAL: {ndas.length} ACTIVE COVENANTS</span>
            </div>

            {ndas.map((nda) => (
              <div key={nda.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 text-xs">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                    <span className="text-teal-800 font-bold bg-teal-50 border border-teal-200 px-2 py-0.5 uppercase tracking-wider">
                      ACTIVE BILATERAL COVENANT
                    </span>
                    <span className="text-slate-400">AGREEMENT REF #{nda.id}</span>
                  </div>
                  <h4 className="font-display font-bold text-navy-950 text-base">
                    CONFIDENTIAL DISCLOSURE COVENANT &mdash; OPPORTUNITY #{nda.listingId}
                  </h4>
                  <div className="font-mono text-xs text-slate-500 space-y-0.5">
                    <div>
                      EXECUTED: {formatDate(nda.signedAt)} &bull; VALIDITY THROUGH: {formatDate(nda.validUntil)}
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      FORENSIC WATERMARK EMBEDDED: <span className="text-navy-900 font-semibold">{nda.watermarkText}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/businesses/${nda.listingId}`}
                  className="btn-teal self-start md:self-auto"
                >
                  <ShieldCheck className="w-4 h-4 text-teal-300" />
                  <span>ACCESS DATA ROOM EXHIBITS</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: DEALS */}
      {activeTab === "deals" && activeDeal && (
        <div className="space-y-4">
          <DealPipelineView deal={activeDeal} />
        </div>
      )}
    </div>
  );
}
