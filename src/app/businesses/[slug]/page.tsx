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
import { MarketplaceIcon } from "@/components/icons";
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
  ArrowUpRight,
  TrendingUp,
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
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <MarketplaceIcon name="office-building" size="xl" className="text-slate-400 mx-auto" />
        <h2 className="font-display text-xl font-bold text-[#0c152b]">Mandate Dossier Not Located</h2>
        <p className="font-sans text-xs text-slate-500">
          The requested mandate identifier ({slugParam}) may have been withdrawn, acquired, or is under compliance review.
        </p>
        <Link
          href="/businesses"
          className="btn-primary inline-flex"
        >
          Return to Dealbook Directory
        </Link>
      </div>
    );
  }

  const toggleSave = () => {
    const res = MarketplaceStorage.toggleSaveListing(listing.id);
    setIsSaved(res);
    showToast(
      res ? "Mandate Added to Shortlist" : "Removed from Shortlist",
      listing.displayTitle,
      res ? "success" : "info"
    );
  };

  const copyShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      showToast("Link Copied to Clipboard", "Sharable confidential opportunity URL copied.");
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
      {/* 1. TOP DOCUMENT HEADER / REGISTRY BAR */}
      <div className="border-b border-ivory-400 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono">
          <Link
            href="/businesses"
            className="text-slate-500 hover:text-[#0c152b] flex items-center gap-1 font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dealbook</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500 uppercase">{listing.industry}</span>
          <span className="text-slate-300">/</span>
          <span className="font-bold text-[#0c152b]">#{refCode}</span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={copyShareLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-ivory-400 bg-white hover:bg-ivory-100 text-slate-700 transition"
            title="Copy confidential memorandum link"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-teal-700" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="uppercase tracking-wider text-[11px] font-semibold">{copiedLink ? "Copied" : "Share"}</span>
          </button>

          <button
            onClick={toggleSave}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 border transition ${
              isSaved
                ? "bg-teal-700 text-white border-teal-700"
                : "bg-white text-slate-700 border-ivory-400 hover:bg-ivory-100"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
            <span className="uppercase tracking-wider text-[11px] font-semibold">{isSaved ? "Shortlisted" : "Shortlist"}</span>
          </button>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-ivory-400 bg-white hover:text-red-700 text-slate-600 transition"
            title="File regulatory grievance / report listing"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
            <span className="uppercase tracking-wider text-[11px] font-semibold">Report</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN DOSSIER GRID: MEMORANDUM (LEFT 2/3) + ACTION CENTER (RIGHT 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols: Exhibits, Financial Schedules & Operations */}
        <div className="lg:col-span-8 space-y-8">
          {/* Photo / Blueprint Gallery */}
          <PhotoGallery
            images={gallery}
            title={listing.displayTitle}
            isConfidential={isConfidential}
            industry={listing.industry}
            subCategory={listing.subCategory}
          />

          {/* Primary Opportunity Card */}
          <div className="bg-white p-6 sm:p-8 border border-ivory-400 space-y-6">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
              <span className="bg-[#0c152b] text-white px-2 py-0.5 uppercase tracking-wider font-bold">
                {listing.industry}
              </span>
              {listing.subCategory && (
                <span className="bg-ivory-200 text-slate-700 px-2 py-0.5 uppercase tracking-wider font-semibold border border-ivory-300">
                  {listing.subCategory}
                </span>
              )}
              {isConfidential ? (
                <span className="bg-bronze-50 text-bronze-800 px-2 py-0.5 uppercase tracking-wider font-bold border border-bronze-300 flex items-center gap-1">
                  <MarketplaceIcon name="lock" size="xs" />
                  RESTRICTED ANONYMIZED DISCLOSURE
                </span>
              ) : (
                <span className="bg-teal-50 text-teal-800 px-2 py-0.5 uppercase tracking-wider font-semibold border border-teal-200">
                  PUBLIC RECORD
                </span>
              )}
            </div>

            <div>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0c152b] leading-tight">
                {listing.displayTitle}
              </h1>
              <p className="font-serif-editorial italic text-sm sm:text-base text-slate-700 mt-2 leading-relaxed">
                {listing.tagline}
              </p>
            </div>

            {/* Structured Quick Facts Accounting Ledger */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-ivory-100 p-4 border border-ivory-300 font-mono text-xs">
              <div>
                <span className="text-[9px] text-slate-500 uppercase block tracking-wider">REGION</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{listing.city}, {listing.state}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 uppercase block tracking-wider">OPERATIONAL AGE</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{listing.yearsInOperation} Years</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 uppercase block tracking-wider">TEAM SIZE</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{listing.teamSizeRange || "15 – 30 Staff"}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 uppercase block tracking-wider">STRUCTURE</span>
                <span className="font-bold text-slate-900 mt-0.5 block uppercase">
                  {listing.saleStructure === "share_sale" ? "100% Equity" : "Asset Sale"}
                </span>
              </div>
            </div>

            {/* SCHEDULE A: AUDITED FINANCIAL LEDGER */}
            <div className="space-y-3 pt-4 border-t border-ivory-300">
              <div className="flex items-center justify-between font-mono">
                <span className="text-xs font-bold text-[#0c152b] uppercase tracking-wider">
                  SCHEDULE A: FINANCIAL PERFORMANCE & VALUATION MULTIPLES
                </span>
                <span className="text-[10px] text-slate-500 uppercase">
                  {listing.financialReportingPeriod}
                </span>
              </div>

              <div className="border border-ivory-400 overflow-x-auto">
                <table className="w-full text-left font-mono text-xs divide-y divide-ivory-300">
                  <thead className="bg-ivory-100 text-[10px] text-slate-500 uppercase">
                    <tr>
                      <th className="p-3">Financial Metric</th>
                      <th className="p-3 text-right">Amount (INR)</th>
                      <th className="p-3 text-right">Percentage / Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory-300 bg-white">
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">Annual Gross Turnover / Revenue</td>
                      <td className="p-3 text-right font-bold text-slate-900">{formatINR(listing.annualRevenue)}</td>
                      <td className="p-3 text-right text-slate-500 text-[11px]">FY2023-24 Filings</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">Adjusted Operating EBITDA</td>
                      <td className="p-3 text-right font-bold text-teal-800">{formatINR(listing.annualEbitda)}</td>
                      <td className="p-3 text-right text-teal-800 font-bold text-[11px]">{ebitdaMargin}% Margin</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">Raw Material & WIP Inventory Included</td>
                      <td className="p-3 text-right text-slate-900">{formatINR(listing.inventoryValueIncluded)}</td>
                      <td className="p-3 text-right text-slate-500 text-[11px]">Included in Asking EV</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">Machinery, Plant & Fixed Assets Included</td>
                      <td className="p-3 text-right text-slate-900">{formatINR(listing.assetsValueIncluded)}</td>
                      <td className="p-3 text-right text-slate-500 text-[11px]">Book Value Schedule</td>
                    </tr>
                    <tr className="bg-ivory-50">
                      <td className="p-3 font-bold text-[#0c152b]">Indicative Enterprise Valuation (Asking EV)</td>
                      <td className="p-3 text-right font-display font-extrabold text-sm text-[#0c152b]">
                        {formatINR(listing.askingPrice)}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-teal-900 text-[11px]">
                        {listing.annualEbitda > 0 ? (listing.askingPrice / listing.annualEbitda).toFixed(1) : "N/A"}x EBITDA
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* CA Audit Certification Card */}
              <div className="bg-teal-50 border-l-4 border-teal-700 p-4 space-y-1">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-teal-950">
                  <MarketplaceIcon name="shield-check" size="sm" className="text-teal-700" />
                  <span>Chartered Accountant Panel Verification Statement</span>
                </div>
                <p className="font-sans text-xs text-teal-900 leading-relaxed">
                  {listing.financialVerificationNote || "Form 3CD Tax Audit Reports and GST GSTR-9 annual reconciliation filings have been verified against banking statements."}
                </p>
              </div>
            </div>

            {/* SCHEDULE B: OPERATIONAL MODEL & MOAT */}
            <div className="space-y-3 pt-4 border-t border-ivory-300">
              <span className="font-mono text-xs font-bold text-[#0c152b] uppercase tracking-wider block">
                SCHEDULE B: BUSINESS OPERATIONS & STRATEGIC POSITIONING
              </span>

              <p className="font-sans text-xs sm:text-sm text-slate-700 leading-relaxed">
                {listing.executiveSummary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-sans text-xs">
                <div className="p-3 bg-ivory-50 border border-ivory-300 space-y-1">
                  <span className="font-mono text-[10px] font-bold uppercase text-slate-500">Products & Service Lines</span>
                  <p className="text-slate-800">{listing.productsAndServices || "Precision machined forgings and custom pressings."}</p>
                </div>
                <div className="p-3 bg-ivory-50 border border-ivory-300 space-y-1">
                  <span className="font-mono text-[10px] font-bold uppercase text-slate-500">Key Customer Segments</span>
                  <p className="text-slate-800">{listing.customerSegments || "OEM Tier-1 automotive and industrial machinery clients."}</p>
                </div>
              </div>
            </div>

            {/* SCHEDULE C: ASSETS & INVENTORY SCHEDULE */}
            {listing.assetsIncluded && listing.assetsIncluded.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-ivory-300">
                <span className="font-mono text-xs font-bold text-[#0c152b] uppercase tracking-wider block">
                  SCHEDULE C: INCLUDED CAPITAL ASSETS & INFRASTRUCTURE
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                  {listing.assetsIncluded.map((asset, i) => (
                    <li key={i} className="flex items-start gap-2 p-2 bg-ivory-100 border border-ivory-300">
                      <span className="font-mono font-bold text-teal-800">0{i + 1}.</span>
                      <span className="text-slate-800">{asset}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* SCHEDULE D: SALE RATIONALE */}
            {listing.reasonForSale && (
              <div className="space-y-2 pt-4 border-t border-ivory-300">
                <span className="font-mono text-xs font-bold text-[#0c152b] uppercase tracking-wider block">
                  SCHEDULE D: PROMOTER SUCCESSION & SALE RATIONALE
                </span>
                <p className="font-serif-editorial italic text-xs text-slate-700 bg-ivory-50 p-3 border border-ivory-300">
                  &ldquo;{listing.reasonForSale}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Cols: Sticky Investment Action Center */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border-2 border-[#0c152b] p-6 space-y-5 sticky top-24 shadow-md">
            <div className="border-b border-ivory-300 pb-3">
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block font-bold">
                MANDATE VALUATION
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="font-display font-extrabold text-2xl text-[#0c152b]">
                  {formatINR(listing.askingPrice)}
                </span>
                <span className="font-mono text-xs text-teal-800 font-bold">
                  {listing.annualEbitda > 0 ? (listing.askingPrice / listing.annualEbitda).toFixed(1) : "N/A"}x EBITDA
                </span>
              </div>
              <p className="font-mono text-[10px] text-slate-400 mt-0.5">
                Negotiable via formal Letter of Intent (LOI)
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3 font-mono">
              <button
                onClick={() => setIsInquiryModalOpen(true)}
                className="btn-teal w-full py-3 text-xs shadow-md group/inq"
              >
                <span>Submit Acquisition Enquiry</span>
                <MarketplaceIcon name="arrow-up-right" size="xs" className="text-teal-300 group-hover/inq:translate-x-0.5 group-hover/inq:-translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={() => {
                  if (activeNDA && activeNDA.status === "approved_active") {
                    setIsVaultModalOpen(true);
                  } else {
                    setIsNDAModalOpen(true);
                  }
                }}
                className={`w-full py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all rounded-[2px] ${
                  activeNDA && activeNDA.status === "approved_active"
                    ? "btn-secondary border-teal-700 bg-teal-50 text-teal-950 font-bold"
                    : "btn-secondary text-navy-950"
                }`}
              >
                <MarketplaceIcon name="verified-document" size="xs" className="text-bronze-600" />
                <span>
                  {activeNDA && activeNDA.status === "approved_active"
                    ? "Open Data Room (3 Files Unlocked)"
                    : "Sign NDA to Unlock Data Room"}
                </span>
              </button>
            </div>

            {/* Diligence & Verification Dossier */}
            <div className="bg-ivory-100 p-4 border border-ivory-300 space-y-2 font-mono text-xs">
              <span className="font-bold text-[#0c152b] uppercase text-[10px] block border-b border-ivory-300 pb-1">
                SELLER DILIGENCE STATUS
              </span>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">MCA21 Director DIN:</span>
                  <span className="text-teal-800 font-bold">MATCH CONFIRMED</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Statutory Authority:</span>
                  <span className="text-slate-900">DIN / Board Resolution</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">GSTR-9 Reconciliation:</span>
                  <span className="text-teal-800 font-bold">AUDITED</span>
                </div>
              </div>
            </div>

            {/* 180-Day Attribution Covenant */}
            <div className="text-[10px] font-sans text-slate-500 bg-ivory-50 p-3 border border-ivory-300 space-y-1">
              <span className="font-mono font-bold text-slate-700 block uppercase">180-Day Deal Attribution Protocol:</span>
              <p>
                Any introductory transaction resulting from this mandate within 180 days is subject to VyapaarSetu success commission terms (2% + 18% GST).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. STICKY MOBILE ACQUISITION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-ivory-400 px-4 py-3 flex items-center justify-between gap-3 shadow-lg lg:hidden">
        <div>
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Asking Valuation</span>
          <span className="font-display font-extrabold text-base text-[#0c152b]">{formatINR(listing.askingPrice)}</span>
        </div>
        <div className="flex items-center gap-2">
          {isConfidential && !hasUnlockedNDA ? (
            <button
              onClick={() => setIsNDAModalOpen(true)}
              className="px-3.5 py-2 bg-bronze-700 hover:bg-bronze-800 text-white font-mono text-xs uppercase font-bold"
            >
              Sign NDA
            </button>
          ) : (
            <button
              onClick={() => setIsInquiryModalOpen(true)}
              className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-mono text-xs uppercase font-bold"
            >
              Enquire
            </button>
          )}
        </div>
      </div>

      {/* MODALS */}
      <NDAWorkflowModal
        listing={listing}
        isOpen={isNDAModalOpen}
        onClose={() => setIsNDAModalOpen(false)}
        onSignedSuccess={(nda) => {
          setActiveNDA(nda);
          setIsVaultModalOpen(true);
          showToast("Digital NDA Executed", "Data Room documents are now unlocked with dynamic watermarking.");
        }}
      />

      <InquiryModal
        listing={listing}
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        onSuccess={() => {
          showToast("Enquiry Transmitted to Seller", "Your qualified introduction has been recorded.", "success");
          router.push("/dashboard/enquiries");
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
