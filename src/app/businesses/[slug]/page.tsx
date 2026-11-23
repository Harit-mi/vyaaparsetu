"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MarketplaceStorage } from "@/lib/storage";
import { BusinessListing, ListingDocument, ConfidentialityAgreement } from "@/types/marketplace";
import { formatINR, formatDate } from "@/lib/utils";
import { NDAWorkflowModal } from "@/components/NDAWorkflowModal";
import { InquiryModal } from "@/components/InquiryModal";
import { DocumentVaultModal } from "@/components/DocumentVaultModal";
import { ReportListingModal } from "@/components/ReportListingModal";
import { PhotoGallery } from "@/components/PhotoGallery";
import { useToast } from "@/components/Toast";
import {
  ShieldCheck,
  Lock,
  Building,
  Bookmark,
  Share2,
  AlertTriangle,
  ChevronRight,
  Check,
  ArrowLeft,
  FileText,
  Scale,
  Users,
  Briefcase,
  Layers,
  ArrowRight,
  CheckCircle2,
  MapPin,
  TrendingUp,
  Clock,
  Sparkles,
  Download,
} from "lucide-react";

export default function BusinessDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slugParam = (params.slug || params.id) as string;
  const { showToast } = useToast();

  const [listing, setListing] = useState<BusinessListing | null>(null);
  const [documents, setDocuments] = useState<ListingDocument[]>([]);
  const [activeNDA, setActiveNDA] = useState<ConfidentialityAgreement | undefined>(undefined);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Modals
  const [isNDAModalOpen, setIsNDAModalOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    const sync = () => {
      const found = MarketplaceStorage.getListingBySlug(slugParam);
      if (found) {
        setListing(found);
        setDocuments(MarketplaceStorage.getDocumentsByListingId(found.id));
        const currentUser = MarketplaceStorage.getCurrentUser();
        const nda = MarketplaceStorage.getNDAByListingAndBuyer(found.id, currentUser.id);
        setActiveNDA(nda);
        setIsSaved(MarketplaceStorage.getSavedListings().includes(found.id));
      }
    };
    sync();
    window.addEventListener("vyapaarsetu_state_changed", sync);
    return () => window.removeEventListener("vyapaarsetu_state_changed", sync);
  }, [slugParam]);

  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <Building className="w-7 h-7" />
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-900">Business Opportunity Not Found</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          The requested business listing ({slugParam}) may have been acquired, paused by the owner, or is undergoing compliance vetting.
        </p>
        <Link
          href="/businesses"
          className="btn-primary inline-flex mt-2"
        >
          Return to Marketplace Directory
        </Link>
      </div>
    );
  }

  const toggleSave = () => {
    const res = MarketplaceStorage.toggleSaveListing(listing.id);
    setIsSaved(res);
    showToast(
      res ? "Business Added to Shortlist" : "Removed from Shortlist",
      listing.displayTitle,
      res ? "success" : "info"
    );
  };

  const copyShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      showToast("Link Copied", "Sharable confidential opportunity link copied to clipboard.");
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const currentUser = MarketplaceStorage.getCurrentUser();
  const hasUnlockedNDA = activeNDA && activeNDA.status === "approved_active";
  const isAuthorized =
    currentUser.role === "admin" || currentUser.id === listing.sellerId || hasUnlockedNDA;

  const isConfidential = listing.visibility !== "public";
  const ebitdaMargin =
    listing.annualRevenue > 0
      ? ((listing.annualEbitda / listing.annualRevenue) * 100).toFixed(1)
      : "0";

  const refCode = `VS-${(listing.state || "IN").slice(0, 2).toUpperCase()}-${listing.id.replace(/[^a-zA-Z0-9]/g, "").slice(-4).toUpperCase()}`;

  const gallery = listing.galleryImages && listing.galleryImages.length > 0
    ? listing.galleryImages
    : [listing.imageUrl];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Breadcrumbs & Actions Bar */}
      <div className="border-b border-slate-200/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link
            href="/businesses"
            className="hover:text-blue-600 font-semibold flex items-center gap-1 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Marketplace</span>
          </Link>
          <span>/</span>
          <span>{listing.industry}</span>
          <span>/</span>
          <span className="font-semibold text-slate-900">ID #{refCode}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyShareLink}
            className="btn-secondary btn-sm"
            title="Share this listing"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copiedLink ? "Link Copied" : "Share"}</span>
          </button>

          <button
            onClick={toggleSave}
            className={`btn-sm ${
              isSaved
                ? "bg-blue-600 text-white border border-blue-600 hover:bg-blue-700"
                : "btn-secondary"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
            <span>{isSaved ? "Saved" : "Save"}</span>
          </button>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="btn-ghost btn-sm text-slate-400 hover:text-rose-600"
            title="Report this listing"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Report</span>
          </button>
        </div>
      </div>

      {/* 2. Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Gallery */}
          <PhotoGallery
            images={gallery}
            title={listing.displayTitle}
            industry={listing.industry}
            subCategory={listing.subCategory}
          />

          {/* Title & Overview Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 font-semibold rounded-full border border-blue-100">
                {listing.industry}
              </span>
              {listing.subCategory && (
                <span className="px-3 py-1 bg-slate-100 text-slate-700 font-medium rounded-full">
                  {listing.subCategory}
                </span>
              )}
              {isConfidential ? (
                <span className="px-3 py-1 bg-amber-50 text-amber-800 font-semibold rounded-full border border-amber-200/70 flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  Confidential Opportunity
                </span>
              ) : (
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 font-semibold rounded-full border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Public Record
                </span>
              )}
            </div>

            <div className="space-y-2">
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight leading-tight">
                {listing.displayTitle}
              </h1>
              <p className="text-base text-slate-600 leading-relaxed">
                {listing.tagline}
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Location</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{listing.city}, {listing.state}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Operational Age</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{listing.yearsInOperation} Years</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Team Size</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{listing.teamSizeRange || "15 – 30 Staff"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Deal Structure</span>
                <span className="font-bold text-slate-800 mt-0.5 block">
                  {listing.saleStructure === "share_sale" ? "100% Equity Buyout" : "Asset Sale"}
                </span>
              </div>
            </div>

            {/* Audited Financials Summary */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900">
                    Financial Performance & Multiples
                  </h3>
                  <p className="text-xs text-slate-500">
                    Reporting Period: {listing.financialReportingPeriod}
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  {ebitdaMargin}% EBITDA Margin
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs divide-y divide-slate-100">
                  <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase">
                    <tr>
                      <th className="p-3.5">Metric</th>
                      <th className="p-3.5 text-right">Value (INR)</th>
                      <th className="p-3.5 text-right">Verification Basis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    <tr>
                      <td className="p-3.5 font-medium text-slate-800">Annual Gross Revenue / Turnover</td>
                      <td className="p-3.5 text-right font-bold text-slate-900 tabular-nums">{formatINR(listing.annualRevenue)}</td>
                      <td className="p-3.5 text-right text-slate-500">GSTR-9 Annual Return</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-medium text-slate-800">Adjusted Operating EBITDA</td>
                      <td className="p-3.5 text-right font-bold text-emerald-600 tabular-nums">{formatINR(listing.annualEbitda)}</td>
                      <td className="p-3.5 text-right text-emerald-700 font-medium">{ebitdaMargin}% Margin</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-medium text-slate-800">Inventory Included in Sale</td>
                      <td className="p-3.5 text-right font-medium text-slate-800 tabular-nums">{formatINR(listing.inventoryValueIncluded)}</td>
                      <td className="p-3.5 text-right text-slate-500">Raw Materials & WIP</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-medium text-slate-800">Machinery & Fixed Assets Book Value</td>
                      <td className="p-3.5 text-right font-medium text-slate-800 tabular-nums">{formatINR(listing.assetsValueIncluded)}</td>
                      <td className="p-3.5 text-right text-slate-500">Audited Asset Schedule</td>
                    </tr>
                    <tr className="bg-slate-50 font-semibold">
                      <td className="p-3.5 font-bold text-slate-900">Indicative Asking Enterprise Value</td>
                      <td className="p-3.5 text-right font-display font-extrabold text-base text-slate-900 tabular-nums">
                        {formatINR(listing.askingPrice)}
                      </td>
                      <td className="p-3.5 text-right text-blue-700 font-semibold">
                        {listing.annualEbitda > 0 ? (listing.askingPrice / listing.annualEbitda).toFixed(1) : "N/A"}x EBITDA
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* CA Statement Card */}
              <div className="bg-emerald-50/80 rounded-xl border border-emerald-200/80 p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Chartered Accountant Verification Statement</span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  {listing.financialVerificationNote || "Form 3CD Tax Audit Reports and GST GSTR-9 annual reconciliation filings have been verified against banking statements."}
                </p>
              </div>
            </div>

            {/* Operational Model & Moat */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="font-display font-bold text-lg text-slate-900">
                Business Model & Competitive Moat
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {listing.operatingModel || listing.executiveSummary}
              </p>

              {listing.growthOpportunities && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <h4 className="font-semibold text-xs text-slate-800 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Growth & Expansion Potential
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {Array.isArray(listing.growthOpportunities)
                      ? listing.growthOpportunities.join(". ")
                      : listing.growthOpportunities}
                  </p>
                </div>
              )}
            </div>

            {/* Included Assets */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="font-display font-bold text-lg text-slate-900">
                Assets Included in Transfer
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {(Array.isArray(listing.assetsIncluded) && listing.assetsIncluded.length > 0
                  ? listing.assetsIncluded
                  : [
                      "100% Equity / Business Goodwill",
                      "All Plant Machinery & Stamping Presses",
                      "Existing Customer Contracts & Tier-1 OEM Vendor Codes",
                      "GST Registration & Factory Licenses",
                      "Key Operating Staff Retention Support",
                    ]
                ).map((item: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Column (Action Sidebar) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-card space-y-6">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Indicative Valuation
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
                  {formatINR(listing.askingPrice)}
                </span>
                <span className="text-xs font-medium text-slate-500">EV</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setIsInquiryModalOpen(true)}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-sm hover:shadow flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <span>Submit Acquisition Inquiry</span>
                <ArrowRight className="w-4 h-4 text-blue-200" />
              </button>

              <button
                onClick={() => {
                  if (activeNDA && activeNDA.status === "approved_active") {
                    setIsVaultModalOpen(true);
                  } else {
                    setIsNDAModalOpen(true);
                  }
                }}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition border ${
                  activeNDA && activeNDA.status === "approved_active"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                    : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <FileText className="w-4 h-4 text-slate-500" />
                <span>
                  {activeNDA && activeNDA.status === "approved_active"
                    ? "Open Data Room (Files Unlocked)"
                    : "Sign NDA to Unlock Data Room"}
                </span>
              </button>
            </div>

            {/* Seller Diligence Checklist */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3 text-xs">
              <span className="font-bold text-slate-900 block border-b border-slate-200 pb-2">
                Diligence & Verification Status
              </span>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Director DIN (MCA21):</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">GST Registration:</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">GSTR-9 Reconciliation:</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Audited
                  </span>
                </div>
              </div>
            </div>

            {/* Attribution Notice */}
            <div className="text-[11px] text-slate-500 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 space-y-1">
              <span className="font-semibold text-slate-700 block">180-Day Deal Attribution Covenant</span>
              <p className="leading-relaxed">
                Introductory interactions on this platform are governed by standard 180-day attribution and success commission terms (2.0% + GST).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-4 py-3 flex items-center justify-between gap-3 shadow-lg lg:hidden">
        <div>
          <span className="text-[11px] text-slate-500 block">Asking Price</span>
          <span className="font-bold text-base text-slate-900">{formatINR(listing.askingPrice)}</span>
        </div>
        <div className="flex items-center gap-2">
          {isConfidential && !hasUnlockedNDA ? (
            <button
              onClick={() => setIsNDAModalOpen(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg"
            >
              Sign NDA
            </button>
          ) : (
            <button
              onClick={() => setIsVaultModalOpen(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg"
            >
              Data Room
            </button>
          )}

          <button
            onClick={() => setIsInquiryModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm"
          >
            Inquire Now
          </button>
        </div>
      </div>

      {/* Modals */}
      <InquiryModal
        listing={listing}
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        onSuccess={() => {
          showToast("Inquiry Transmitted", "The promoter has been notified of your interest.");
        }}
      />

      <NDAWorkflowModal
        listing={listing}
        isOpen={isNDAModalOpen}
        onClose={() => setIsNDAModalOpen(false)}
        onSignedSuccess={(nda) => {
          setActiveNDA(nda);
          setIsVaultModalOpen(true);
        }}
      />

      <DocumentVaultModal
        documents={documents}
        activeNDA={activeNDA}
        isOpen={isVaultModalOpen}
        onClose={() => setIsVaultModalOpen(false)}
        onRequestNDA={() => setIsNDAModalOpen(true)}
      />

      <ReportListingModal
        listing={listing}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
