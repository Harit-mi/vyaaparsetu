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
  ArrowRight,
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
      showToast("Listing Status Updated", `${listing.displayTitle} is now marked as ${newStatus.replace(/_/g, " ")}`);
    }
  };

  const handleTogglePause = (listingId: string) => {
    const isPaused = MarketplaceStorage.togglePauseListing(listingId);
    showToast(
      isPaused ? "Listing Paused" : "Listing Resumed (Active)",
      isPaused ? "Buyers cannot send new inquiries while paused." : "Listing is once again discoverable on marketplace.",
      isPaused ? "info" : "success"
    );
  };

  const handleInquiryStatus = (inqId: string, status: Inquiry["status"]) => {
    const inqs = MarketplaceStorage.getInquiries();
    const target = inqs.find((i) => i.id === inqId);
    if (target) {
      target.status = status;
      MarketplaceStorage.addInquiry(target);
      showToast("Inquiry Status Updated", `Inquiry marked as ${status.replace(/_/g, " ")}`);
    }
  };

  const activeDeal = deals[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Masthead */}
      <div className="border-b border-slate-200 pb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
            <span className="font-semibold text-slate-700">Seller Advisory Desk</span>
            <span>•</span>
            <span className="text-slate-500">Portfolio Mandate Control</span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-blue-700 font-semibold bg-blue-50 px-3 py-1 rounded-full border border-blue-200/80 text-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            Active Promoter Mandate
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {currentUser.companyName || `${currentUser.fullName}'s Businesses`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Promoter: {currentUser.fullName} • {currentUser.city}, {currentUser.state}
            </p>
          </div>

          <Link
            href="/sell/new"
            className="btn-brand btn-md self-start sm:self-auto inline-flex items-center gap-2 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List Another Business</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-card space-y-1">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
            Active Listings
          </span>
          <span className="text-3xl font-extrabold text-slate-900 block">
            {listings.length}
          </span>
          <span className="text-xs text-emerald-600 font-medium block">
            CA Verified Assets
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-card space-y-1">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
            Acquisition Inquiries
          </span>
          <span className="text-3xl font-extrabold text-slate-900 block">
            {inquiries.length}
          </span>
          <span className="text-xs text-slate-500 font-medium block">
            Screened Buyer Leads
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-card space-y-1">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
            Executed NDAs
          </span>
          <span className="text-3xl font-extrabold text-slate-900 block">
            {ndas.length}
          </span>
          <span className="text-xs text-blue-600 font-medium block">
            Watermarked Access
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-card space-y-1">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
            Pipeline Stage
          </span>
          <span className="text-xl font-bold text-emerald-700 block truncate mt-1">
            Due Diligence
          </span>
          <span className="text-xs text-slate-500 font-medium block">
            Stage 7 of 11 Active
          </span>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/70">
        {[
          { key: "listings", label: "My Listings", count: listings.length },
          { key: "inquiries", label: "Inquiries", count: inquiries.length },
          { key: "ndas", label: "Signed NDAs", count: ndas.length },
          { key: "deals", label: "Deal Pipeline", count: deals.length },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? "bg-blue-50 text-blue-700" : "bg-slate-200/70 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: LISTINGS & ACTIONS (EDIT & PAUSE) */}
      {activeTab === "listings" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card divide-y divide-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Active Business Mandates</span>
              <span>{listings.length} Listed</span>
            </div>

            {listings.map((l) => (
              <div key={l.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 text-xs">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span
                      className={`font-semibold px-2.5 py-0.5 rounded-full ${
                        l.isPaused
                          ? "bg-slate-100 text-slate-700 border border-slate-300"
                          : l.status === "published"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : l.status === "under_offer"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {l.isPaused ? "Paused From Search" : l.status.replace(/_/g, " ")}
                    </span>
                    <span className="text-slate-400">Ref #{l.id}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-800 font-medium">{l.industry}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">{l.city}, {l.state}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg">{l.displayTitle}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{l.tagline}</p>

                  <div className="grid grid-cols-3 gap-4 pt-3 text-xs border-t border-slate-100">
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium block">Asking Price</span>
                      <span className="font-bold text-slate-900 text-sm">{formatINR(l.askingPrice)}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium block">Turnover</span>
                      <span className="font-semibold text-slate-800 text-sm">{formatINR(l.annualRevenue)}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium block">EBITDA</span>
                      <span className="font-bold text-emerald-700 text-sm">{formatINR(l.annualEbitda)}</span>
                    </div>
                  </div>
                </div>

                {/* Edit, Pause and Status Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border-t lg:border-t-0 pt-4 lg:pt-0">
                  <div className="text-xs">
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Status
                    </label>
                    <select
                      value={l.status}
                      onChange={(e) => handleUpdateStatus(l.id, e.target.value as ListingStatus)}
                      className="p-2 border border-slate-300 rounded-lg bg-white text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                    >
                      <option value="draft">Draft (Private)</option>
                      <option value="pending_review">Pending CA Review</option>
                      <option value="published">Published (Active)</option>
                      <option value="under_offer">Under Offer</option>
                      <option value="sold">Sold</option>
                      <option value="withdrawn">Withdrawn</option>
                    </select>
                  </div>

                  {/* Pause / Resume Button */}
                  <div className="self-end sm:self-auto">
                    <label className="hidden sm:block text-[11px] text-transparent mb-1">Action</label>
                    <button
                      onClick={() => handleTogglePause(l.id)}
                      className={`btn-sm ${
                        l.isPaused
                          ? "btn-secondary border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                          : "btn-secondary"
                      }`}
                    >
                      {l.isPaused ? <Play className="w-3.5 h-3.5 text-amber-600" /> : <Pause className="w-3.5 h-3.5 text-slate-500" />}
                      <span>{l.isPaused ? "Resume" : "Pause"}</span>
                    </button>
                  </div>

                  {/* View Teaser Link */}
                  <div className="self-end sm:self-auto">
                    <label className="hidden sm:block text-[11px] text-transparent mb-1">Preview</label>
                    <Link
                      href={`/businesses/${l.slug || l.id}`}
                      className="btn-secondary btn-sm inline-flex items-center gap-1.5"
                    >
                      <span>Teaser</span>
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
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card divide-y divide-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Received Buyer Inquiries</span>
              <span>Total: {inquiries.length} Inquiries</span>
            </div>

            {inquiries.map((inq) => (
              <div key={inq.id} className="p-6 space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                      Target Listing
                    </span>
                    <h4 className="font-bold text-slate-900 text-base">{inq.listingTitle}</h4>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full self-start capitalize ${
                      inq.status === "accepted"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : inq.status === "pending_review"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                  >
                    {inq.status.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-800 border-b border-slate-200 pb-2">
                    <span>
                      Buyer: <strong className="font-bold text-slate-900">{inq.buyerName}</strong> ({inq.buyerType})
                    </span>
                    <span>
                      Indicative Offer:{" "}
                      <strong className="text-emerald-700 font-bold">
                        {inq.indicativeOfferBudget ? formatINR(inq.indicativeOfferBudget) : "Asking Price"}
                      </strong>
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 capitalize">
                    Funding Source: {inq.intendedFundingSource} • Target Timeline: {inq.timelineMonths} Months
                  </div>
                  <p className="mt-2 text-slate-600 text-xs leading-relaxed pt-1">
                    &ldquo;{inq.message}&rdquo;
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="text-xs text-slate-400">
                    Received on {formatDate(inq.createdAt)}
                  </span>
                  <div className="flex items-center gap-2">
                    {inq.status !== "accepted" && (
                      <button
                        onClick={() => handleInquiryStatus(inq.id, "accepted")}
                        className="btn-brand btn-sm"
                      >
                        Accept & Connect
                      </button>
                    )}
                    <Link
                      href="/messages"
                      className="btn-secondary btn-sm"
                    >
                      Open Chat
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
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card divide-y divide-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Executed NDAs & Data Room Access</span>
              <span>Total: {ndas.length} NDAs</span>
            </div>

            {ndas.map((nda) => (
              <div key={nda.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full capitalize">
                      {nda.status.replace(/_/g, " ")}
                    </span>
                    <span className="text-slate-400">Ref #{nda.id}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">
                    {nda.buyerName} {nda.buyerCompany ? `(${nda.buyerCompany})` : ""}
                  </h4>
                  <div className="text-xs text-slate-500">
                    Executed: {formatDate(nda.signedAt)} • Valid through: {formatDate(nda.validUntil)}
                  </div>
                  <div className="text-xs text-slate-400">
                    Watermark: <span className="text-slate-800 font-medium">{nda.watermarkText}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    showToast("Audit Log Confirmed", `Watermarked audit access active for ${nda.buyerName}`);
                  }}
                  className="btn-secondary btn-sm self-start md:self-auto"
                >
                  View Audit Trail
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
