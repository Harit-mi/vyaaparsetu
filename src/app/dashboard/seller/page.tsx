"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MarketplaceStorage } from "@/lib/storage";
import {
  BusinessListing,
  Inquiry,
  ConfidentialityAgreement,
  DealRecord,
  ListingStatus,
} from "@/types/marketplace";
import { formatINR, formatDate } from "@/lib/utils";
import { DealPipelineView } from "@/components/DealPipelineView";
import { useToast } from "@/components/Toast";
import {
  Briefcase,
  PlusCircle,
  Clock,
  Eye,
  FileText,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Lock,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  Pause,
  Play,
  Edit3,
  Building2,
  FileSignature,
} from "lucide-react";

export default function SellerDashboardPage() {
  const [currentUser, setCurrentUser] = useState(MarketplaceStorage.getCurrentUser());
  const [listings, setListings] = useState<BusinessListing[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [ndas, setNdas] = useState<ConfidentialityAgreement[]>([]);
  const [deals, setDeals] = useState<DealRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"listings" | "inquiries" | "ndas" | "deals">("listings");
  const { showToast } = useToast();

  useEffect(() => {
    const sync = () => {
      const user = MarketplaceStorage.getCurrentUser();
      setCurrentUser(user);
      const allListings = MarketplaceStorage.getListings();
      const sellerListings = allListings.filter(
        (l) => l.sellerId === user.id || user.role === "seller" || user.role === "admin"
      );
      setListings(sellerListings);
      setInquiries(MarketplaceStorage.getInquiries());
      setNdas(MarketplaceStorage.getNDAs());
      setDeals(MarketplaceStorage.getDeals());
    };
    sync();
    window.addEventListener("vyapaarsetu_state_changed", sync);
    return () => window.removeEventListener("vyapaarsetu_state_changed", sync);
  }, []);

  const handleUpdateStatus = (listingId: string, newStatus: ListingStatus) => {
    const listing = MarketplaceStorage.getListingById(listingId);
    if (listing) {
      listing.status = newStatus;
      MarketplaceStorage.saveListing(listing);
      showToast("Mandate Status Updated", `${listing.displayTitle} is now marked as ${newStatus.replace(/_/g, " ")}`);
    }
  };

  const handleTogglePause = (listingId: string) => {
    const isPaused = MarketplaceStorage.togglePauseListing(listingId);
    showToast(
      isPaused ? "Listing Paused" : "Listing Resumed (Active)",
      isPaused ? "Acquirers cannot send new enquiries while paused." : "Listing is once again discoverable on marketplace ledger.",
      isPaused ? "info" : "success"
    );
  };

  const handleInquiryStatus = (inqId: string, status: Inquiry["status"]) => {
    const inqs = MarketplaceStorage.getInquiries();
    const target = inqs.find((i) => i.id === inqId);
    if (target) {
      target.status = status;
      MarketplaceStorage.addInquiry(target);
      showToast("Enquiry Status Updated", `Enquiry marked as ${status.replace(/_/g, " ")}`);
    }
  };

  const activeDeal = deals[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Editorial Masthead */}
      <div className="border-b border-[#e2dfd6] pb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono uppercase tracking-wider text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-navy-900 inline-block" />
            <span>PROMOTER DIVESTMENT DESK</span>
            <span>&bull;</span>
            <span className="text-navy-950 font-bold">PORTFOLIO MANDATE CONTROL</span>
          </div>
          <span className="text-slate-400">SECTION 79 IT ACT COMPLIANT RECORD</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
              {currentUser.companyName || `${currentUser.fullName}'s Divestment Portfolio`}
            </h1>
            <p className="font-mono text-xs text-slate-500 mt-1">
              PROMOTER: {currentUser.fullName.toUpperCase()} &bull; {currentUser.city.toUpperCase()}, {currentUser.state.toUpperCase()}
            </p>
          </div>

          <Link
            href="/sell/new"
            className="btn-primary self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4 text-teal-400" />
            <span>FILE NEW DIVESTMENT MANDATE</span>
          </Link>
        </div>
      </div>

      {/* KPI Ledger Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-[#e2dfd6] space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 block">
            MANDATES ACTIVE
          </span>
          <span className="font-mono text-3xl font-extrabold text-navy-950 block tabular-nums">
            {listings.length}
          </span>
          <span className="font-mono text-[10px] text-teal-800 font-semibold block uppercase">
            CA VERIFIED ASSETS
          </span>
        </div>

        <div className="p-4 bg-white border border-[#e2dfd6] space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 block">
            ACQUISITION ENQUIRIES
          </span>
          <span className="font-mono text-3xl font-extrabold text-navy-950 block tabular-nums">
            {inquiries.length}
          </span>
          <span className="font-mono text-[10px] text-slate-500 font-semibold block uppercase">
            SCREENED BUYER LEADS
          </span>
        </div>

        <div className="p-4 bg-white border border-[#e2dfd6] space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 block">
            ACTIVE NDAS EXECUTED
          </span>
          <span className="font-mono text-3xl font-extrabold text-navy-950 block tabular-nums">
            {ndas.length}
          </span>
          <span className="font-mono text-[10px] text-bronze-700 font-semibold block uppercase">
            WATERMARKED DATA ACCESS
          </span>
        </div>

        <div className="p-4 bg-white border border-[#e2dfd6] space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 block">
            ACTIVE PIPELINE STATUS
          </span>
          <span className="font-mono text-xl font-extrabold text-teal-800 block truncate mt-1">
            DUE DILIGENCE
          </span>
          <span className="font-mono text-[10px] text-slate-500 block uppercase">
            STAGE 7 OF 11 ACTIVE
          </span>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1 border-b border-[#e2dfd6] overflow-x-auto bg-[#f5f4ef] p-1">
        {[
          { key: "listings", label: "MANDATE REGISTRY & CONTROLS", count: listings.length },
          { key: "inquiries", label: "RECEIVED ENQUIRIES", count: inquiries.length },
          { key: "ndas", label: "NDAS & DATA VAULT ACCESS", count: ndas.length },
          { key: "deals", label: "ACQUISITION PIPELINE", count: deals.length },
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

      {/* TAB 1: LISTINGS & ACTIONS (EDIT & PAUSE) */}
      {activeTab === "listings" && (
        <div className="space-y-4">
          <div className="border border-[#e2dfd6] bg-white divide-y divide-[#e2dfd6]">
            <div className="p-4 bg-[#fbfbf9] flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-500">
              <span>ACTIVE PROMOTER MANDATES & EDITORIAL CONTROLS</span>
              <span>{listings.length} MANDATES RECORDED</span>
            </div>

            {listings.map((l) => (
              <div key={l.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 text-xs">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap font-mono text-[10px]">
                    <span
                      className={`font-bold uppercase tracking-wider px-2 py-0.5 border ${
                        l.isPaused
                          ? "bg-slate-100 text-slate-700 border-slate-300"
                          : l.status === "published"
                          ? "bg-teal-50 text-teal-800 border-teal-300"
                          : l.status === "under_offer"
                          ? "bg-amber-50 text-amber-800 border-amber-300"
                          : "bg-blue-50 text-blue-800 border-blue-300"
                      }`}
                    >
                      STATUS: {l.isPaused ? "PAUSED FROM SEARCH" : l.status.replace(/_/g, " ")}
                    </span>
                    <span className="text-slate-400">REF: #{l.id.toUpperCase()}</span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="text-navy-950 font-semibold">{l.industry}</span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="text-slate-600">{l.city}, {l.state}</span>
                  </div>

                  <h3 className="font-display font-bold text-navy-950 text-lg">{l.displayTitle}</h3>
                  <p className="text-xs text-slate-600 font-serif italic line-clamp-1">{l.tagline}</p>

                  <div className="grid grid-cols-3 gap-4 pt-2 font-mono text-xs border-t border-[#e2dfd6]/70">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">ASKING VALUATION</span>
                      <span className="font-bold text-navy-950 tabular-nums">{formatINR(l.askingPrice)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">ANNUAL TURNOVER</span>
                      <span className="font-bold text-navy-950 tabular-nums">{formatINR(l.annualRevenue)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">OPERATING EBITDA</span>
                      <span className="font-bold text-teal-800 tabular-nums">{formatINR(l.annualEbitda)}</span>
                    </div>
                  </div>
                </div>

                {/* Edit, Pause and Status Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border-t lg:border-t-0 pt-4 lg:pt-0">
                  <div className="text-xs">
                    <label className="block font-mono text-[10px] font-bold text-slate-400 uppercase mb-1">
                      MANDATE STAGE
                    </label>
                    <select
                      value={l.status}
                      onChange={(e) => handleUpdateStatus(l.id, e.target.value as ListingStatus)}
                      className="p-2 border border-[#e2dfd6] bg-[#fbfbf9] text-xs font-mono font-semibold text-navy-950 focus:ring-1 focus:ring-navy-950 focus:outline-hidden"
                    >
                      <option value="draft">Draft (Private)</option>
                      <option value="pending_review">Pending CA Review</option>
                      <option value="published">Published (Active)</option>
                      <option value="under_offer">Under Offer (Exclusivity)</option>
                      <option value="sold">Sold (Substantiated)</option>
                      <option value="withdrawn">Withdrawn</option>
                    </select>
                  </div>

                  {/* Pause / Resume Button */}
                  <div className="self-end sm:self-auto">
                    <label className="hidden sm:block font-mono text-[10px] text-transparent mb-1">.</label>
                    <button
                      onClick={() => handleTogglePause(l.id)}
                      className={`btn-sm ${
                        l.isPaused
                          ? "btn-secondary border-amber-400 bg-amber-50 text-amber-950"
                          : "btn-secondary"
                      }`}
                    >
                      {l.isPaused ? <Play className="w-3.5 h-3.5 text-amber-700" /> : <Pause className="w-3.5 h-3.5 text-slate-600" />}
                      <span>{l.isPaused ? "RESUME" : "PAUSE"}</span>
                    </button>
                  </div>

                  {/* View Teaser Link */}
                  <div className="self-end sm:self-auto">
                    <label className="hidden sm:block font-mono text-[10px] text-transparent mb-1">.</label>
                    <Link
                      href={`/businesses/${l.slug || l.id}`}
                      className="btn-secondary btn-sm"
                    >
                      <span>TEASER</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: INQUIRIES */}
      {activeTab === "inquiries" && (
        <div className="space-y-4">
          <div className="border border-[#e2dfd6] bg-white divide-y divide-[#e2dfd6]">
            <div className="p-4 bg-[#fbfbf9] flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-500">
              <span>RECEIVED ACQUISITION EXPRESSIONS & QUALIFICATIONS</span>
              <span>TOTAL: {inquiries.length} LEADS</span>
            </div>

            {inquiries.map((inq) => (
              <div key={inq.id} className="p-6 space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block">
                      TARGET MANDATE ASSET
                    </span>
                    <h4 className="font-display font-bold text-navy-950 text-base">{inq.listingTitle}</h4>
                  </div>
                  <span
                    className={`font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border self-start ${
                      inq.status === "accepted"
                        ? "bg-teal-50 text-teal-800 border-teal-300"
                        : inq.status === "pending_review"
                        ? "bg-amber-50 text-amber-800 border-amber-300"
                        : "bg-slate-100 text-slate-700 border-slate-300"
                    }`}
                  >
                    STATUS: {inq.status.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="bg-[#fbfbf9] p-4 border border-[#e2dfd6] space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-navy-900 border-b border-[#e2dfd6] pb-2">
                    <span>
                      ACQUIRER: <strong className="text-navy-950 font-bold">{inq.buyerName}</strong> ({inq.buyerType})
                    </span>
                    <span>
                      INDICATIVE VALUATION:{" "}
                      <strong className="text-teal-800 font-bold tabular-nums">
                        {inq.indicativeOfferBudget ? formatINR(inq.indicativeOfferBudget) : "ASKING VALUATION"}
                      </strong>
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-500">
                    FUNDING STRUCTURE: {inq.intendedFundingSource.toUpperCase()} &bull; TARGET TIMELINE: {inq.timelineMonths} MONTHS
                  </div>
                  <p className="mt-2 text-slate-700 font-serif italic text-xs leading-relaxed pt-1">
                    &ldquo;{inq.message}&rdquo;
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="font-mono text-[11px] text-slate-400">
                    TRANSMITTED ON {formatDate(inq.createdAt)} &bull; VERIFIED UNDER VYAPAARSETU PROTOCOL
                  </span>
                  <div className="flex items-center gap-2">
                    {inq.status !== "accepted" && (
                      <button
                        onClick={() => handleInquiryStatus(inq.id, "accepted")}
                        className="btn-teal btn-sm"
                      >
                        ACCEPT & CONNECT
                      </button>
                    )}
                    <Link
                      href="/messages"
                      className="btn-secondary btn-sm"
                    >
                      OPEN MESSAGES
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: NDAS */}
      {activeTab === "ndas" && (
        <div className="space-y-4">
          <div className="border border-[#e2dfd6] bg-white divide-y divide-[#e2dfd6]">
            <div className="p-4 bg-[#fbfbf9] flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-500">
              <span>EXECUTED NDAS & WATERMARKED DATA VAULT AUDIT</span>
              <span>TOTAL: {ndas.length} NDAS</span>
            </div>

            {ndas.map((nda) => (
              <div key={nda.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <span className="text-teal-800 font-bold bg-teal-50 border border-teal-200 px-2 py-0.5 uppercase tracking-wider">
                      {nda.status.replace(/_/g, " ").toUpperCase()}
                    </span>
                    <span className="text-slate-400">COVENANT REF #{nda.id}</span>
                  </div>
                  <h4 className="font-display font-bold text-navy-950 text-base">
                    {nda.buyerName} {nda.buyerCompany ? `(${nda.buyerCompany})` : ""}
                  </h4>
                  <div className="font-mono text-xs text-slate-500">
                    EXECUTED: {formatDate(nda.signedAt)} &bull; VALIDITY THROUGH: {formatDate(nda.validUntil)}
                  </div>
                  <div className="font-mono text-[10px] text-slate-400">
                    FORENSIC WATERMARK: <span className="text-navy-900 font-semibold">{nda.watermarkText}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    showToast("Audit Trail Confirmed", `Watermarked audit access active for ${nda.buyerName}`);
                  }}
                  className="px-4 py-2 border border-[#e2dfd6] font-mono text-xs uppercase font-bold text-navy-950 hover:bg-[#fbfbf9] self-start md:self-auto"
                >
                  VIEW ACCESS AUDIT LOG
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DEALS */}
      {activeTab === "deals" && activeDeal && (
        <div className="space-y-4">
          <DealPipelineView deal={activeDeal} />
        </div>
      )}
    </div>
  );
}
