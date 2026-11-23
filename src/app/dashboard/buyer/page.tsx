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
      {/* Header & Mandate Summary */}
      <div className="border-b border-slate-200 pb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-700">Acquisition Control Desk</span>
            <span>•</span>
            <span className="font-medium text-slate-500">ID #{currentUser.id}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              MCA DIN & Funds Verified
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {currentUser.fullName}
            </h1>
            <p className="text-sm text-slate-600">
              {currentUser.companyName || "Growth Capital Holdings Ltd"} &nbsp;•&nbsp; {currentUser.city}, {currentUser.state}
            </p>
          </div>

          {/* Mandate Strip */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 text-xs space-y-3 lg:min-w-[420px] shadow-card">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                Investment Mandate
              </span>
              <Link
                href="/buying-profile"
                className="text-xs text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1 transition"
              >
                <span>Edit Criteria</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Capital Allocation</span>
                <span className="text-slate-900 font-bold text-sm">
                  {formatINR(buyerProfile.minBudget)} – {formatINR(buyerProfile.maxBudget)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Acquisition Experience</span>
                <span className="text-slate-900 font-bold text-sm capitalize">
                  {buyerProfile.acquisitionExperience.replace(/_/g, " ")}
                </span>
              </div>
            </div>
            <div className="text-xs text-slate-600 truncate border-t border-slate-100 pt-2">
              <span className="text-slate-400 font-medium">Target Sectors: </span>
              {buyerProfile.preferredIndustries.join(", ")}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/70">
        {[
          { key: "matches", label: "Curated Matches", count: matchedListings.length },
          { key: "saved", label: "Shortlisted", count: savedListings.length },
          { key: "inquiries", label: "Inquiries", count: inquiries.length },
          { key: "ndas", label: "Signed NDAs", count: ndas.length },
          { key: "deals", label: "Deal Rooms", count: deals.length },
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

      {/* TAB 1: CURATED MATCHES */}
      {activeTab === "matches" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Mandate-Matched Businesses
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Target opportunities matching your budget ({formatINR(buyerProfile.minBudget)} – {formatINR(buyerProfile.maxBudget)}) and preferred sectors.
              </p>
            </div>
            <Link
              href="/businesses"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              <span>Browse All {allListings.length} Listings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedListings.map((l) => (
              <div key={l.id} className="relative">
                <div className="absolute top-3 right-3 z-20 bg-emerald-600 text-white font-semibold text-xs px-2.5 py-1 rounded-full shadow-sm">
                  {l.matchScore || 94}% Match
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
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4 shadow-card">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Bookmark className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-base">No Shortlisted Opportunities</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Click the bookmark icon on any business card to save it to your confidential investment shortlist.
                </p>
              </div>
              <Link
                href="/businesses"
                className="btn-brand btn-md inline-flex items-center gap-2"
              >
                <span>Browse Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: INQUIRIES */}
      {activeTab === "inquiries" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card divide-y divide-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Transmitted Commercial Inquiries</span>
              <span>Total: {inquiries.length} Active</span>
            </div>

            {inquiries.map((inq) => (
              <div key={inq.id} className="p-6 space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                      Target Mandate
                    </span>
                    <h4 className="font-bold text-slate-900 text-base">{inq.listingTitle}</h4>
                    <span className="text-xs text-slate-500">
                      Sent on {formatDate(inq.createdAt)} • Seller Ref #{inq.sellerId}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full self-start capitalize ${
                      inq.status === "accepted"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {inq.status.replace("_", " ")}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700 border-b border-slate-200 pb-2">
                    <span>
                      Indicative Budget:{" "}
                      <strong className="text-slate-900 font-bold">
                        {inq.indicativeOfferBudget ? formatINR(inq.indicativeOfferBudget) : "Negotiable"}
                      </strong>
                    </span>
                    <span>
                      Funding Source: <strong className="text-slate-900 font-bold capitalize">{inq.intendedFundingSource}</strong>
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed pt-1">
                    &ldquo;{inq.message}&rdquo;
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="text-xs text-slate-400">
                    Protected under platform attribution covenants
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/dashboard/enquiries"
                      className="btn-secondary btn-sm"
                    >
                      View All Inquiries
                    </Link>
                    <Link
                      href="/messages"
                      className="btn-brand btn-sm"
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

      {/* TAB 4: NDAS */}
      {activeTab === "ndas" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card divide-y divide-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Executed Confidentiality Agreements</span>
              <span>Total: {ndas.length} Active</span>
            </div>

            {ndas.map((nda) => (
              <div key={nda.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 text-xs">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      Active Bilateral NDA
                    </span>
                    <span className="text-slate-400">Ref #{nda.id}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">
                    Confidential Disclosure Covenant &mdash; #{nda.listingId}
                  </h4>
                  <div className="text-xs text-slate-500 space-y-0.5">
                    <div>
                      Executed: {formatDate(nda.signedAt)} • Valid through: {formatDate(nda.validUntil)}
                    </div>
                    <div className="text-slate-400">
                      Watermark Embedded: <span className="text-slate-800 font-medium">{nda.watermarkText}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/businesses/${nda.listingId}`}
                  className="btn-brand btn-sm self-start md:self-auto"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Access Data Room</span>
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
