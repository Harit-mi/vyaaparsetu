"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BusinessListing } from "@/types/marketplace";
import { formatINR, formatDate } from "@/lib/utils";
import { MarketplaceStorage } from "@/lib/storage";
import { useToast } from "@/components/Toast";
import { CategoryPlaceholder } from "./CategoryPlaceholder";
import { MarketplaceIcon } from "@/components/icons";

interface ListingCardProps {
  listing: BusinessListing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const saved = MarketplaceStorage.getSavedListings();
    setIsSaved(saved.includes(listing.id));
  }, [listing.id]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = MarketplaceStorage.toggleSaveListing(listing.id);
    setIsSaved(result);
    showToast(
      result ? "Mandate Added to Shortlist" : "Removed from Shortlist",
      listing.displayTitle,
      result ? "success" : "info"
    );
  };

  const ebitdaMargin =
    listing.annualRevenue > 0
      ? ((listing.annualEbitda / listing.annualRevenue) * 100).toFixed(1)
      : "0";

  const targetSlug = listing.slug || listing.id;
  const refCode = `VS-${(listing.state || "IN").slice(0, 2).toUpperCase()}-${listing.id.replace(/[^a-zA-Z0-9]/g, "").slice(-4).toUpperCase()}`;

  return (
    <div className="group bg-white border border-ivory-400 hover:border-[#0c152b] transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md">
      <div>
        {/* 1. TOP DOCUMENT HEADER / REGISTRY STAMP */}
        <div className="bg-ivory-100 px-4 py-2 border-b border-ivory-300 flex items-center justify-between text-[10px] font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0c152b] tracking-wider uppercase">
              MANDATE #{refCode}
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-600 uppercase truncate max-w-[130px] sm:max-w-[180px]">
              {listing.city}, {listing.state}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {listing.visibility === "strictly_confidential" ? (
              <span className="inline-flex items-center gap-1 font-semibold text-bronze-700 bg-bronze-50 px-1.5 py-0.5 border border-bronze-300">
                <MarketplaceIcon name="lock" size="xs" />
                STRICTLY BLIND
              </span>
            ) : listing.visibility === "partially_confidential" ? (
              <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-ivory-200 px-1.5 py-0.5 border border-slate-300">
                <MarketplaceIcon name="lock" size="xs" />
                PARTIAL BLIND
              </span>
            ) : (
              <span className="font-medium text-teal-800 bg-teal-50 px-1.5 py-0.5 border border-teal-200">
                PUBLIC RECORD
              </span>
            )}

            {/* Bookmark button */}
            <button
              onClick={toggleBookmark}
              type="button"
              className={`p-1.5 border transition-all duration-150 rounded-[2px] shadow-2xs ${
                isSaved
                  ? "bg-teal-800 text-white border-teal-700 shadow-inner"
                  : "bg-white text-slate-500 hover:text-navy-950 border-[#d6d2c4] hover:border-navy-950/40 hover:bg-[#fbfbf9]"
              }`}
              title={isSaved ? "Remove from portfolio shortlist" : "Save this mandate"}
              aria-label={isSaved ? "Remove from shortlist" : "Save to shortlist"}
            >
              <MarketplaceIcon name="bookmark" size="xs" className={isSaved ? "fill-current" : ""} />
            </button>
          </div>
        </div>

        {/* 2. MEDIA / BLUEPRINT FRAME */}
        <div className="relative h-44 w-full bg-[#0c152b] overflow-hidden border-b border-ivory-300">
          <CategoryPlaceholder
            industry={listing.industry}
            subCategory={listing.subCategory}
            className="absolute inset-0 w-full h-full"
          />

          {!imgError && listing.imageUrl && (
            <Image
              src={listing.imageUrl}
              alt={listing.displayTitle}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover opacity-90 group-hover:scale-102 transition-transform duration-300"
              onError={() => setImgError(true)}
              unoptimized
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#0c152b]/95 via-transparent to-transparent pointer-events-none" />

          {/* Overlay Industry Capsule */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-[11px] font-mono">
            <span className="px-1.5 py-0.5 bg-black/60 border border-white/20 text-ivory-200 uppercase tracking-wider text-[10px]">
              {listing.industry}
            </span>
            <span className="text-white/80 font-sans text-xs">
              {listing.yearsInOperation} Yrs Operating
            </span>
          </div>
        </div>

        {/* 3. CORE PROSPECTUS COPY */}
        <div className="p-4 space-y-3">
          <Link href={`/businesses/${targetSlug}`} className="block group/title">
            <h3 className="font-display font-bold text-sm sm:text-base text-[#0c152b] group-hover/title:text-teal-800 transition line-clamp-1">
              {listing.displayTitle}
            </h3>
            <p className="font-sans text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
              {listing.tagline}
            </p>
          </Link>

          {/* 4. FINANCIAL LEDGER TABLE (Private-Market Financial Publication Style) */}
          <div className="bg-ivory-100 border border-ivory-300 p-2.5 font-mono text-xs">
            <div className="grid grid-cols-3 gap-2 pb-2 border-b border-ivory-300 text-[10px] text-slate-500 uppercase tracking-wider">
              <span>ASKING VALUATION</span>
              <span>ANNUAL TURNOVER</span>
              <span className="text-right">ADJ. EBITDA</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 items-baseline">
              <span className="font-display font-bold text-sm text-[#0c152b]">
                {formatINR(listing.askingPrice)}
              </span>
              <span className="font-mono text-xs text-slate-800">
                {formatINR(listing.annualRevenue)}
              </span>
              <span className="font-mono text-xs text-teal-800 font-semibold text-right">
                {formatINR(listing.annualEbitda)} <span className="text-[10px] text-slate-500 block font-normal">({ebitdaMargin}%)</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. FOOTER VERIFICATION DOSSIER & CALL TO ACTION */}
      <div className="p-4 pt-0">
        <div className="pt-2.5 border-t border-ivory-300 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-teal-900 font-medium">
            <MarketplaceIcon name="shield-check" size="sm" className="text-teal-700 flex-shrink-0" />
            <span className="truncate max-w-[170px]">
              {listing.isFinancialVerified ? "CA Verified Books (GSTR-9)" : "Management Accounts"}
            </span>
          </div>

          <Link
            href={`/businesses/${targetSlug}`}
            className="btn-primary btn-sm group/btn"
          >
            <span>Inspect Dossier</span>
            <MarketplaceIcon
              name="arrow-up-right"
              size="xs"
              className="text-teal-400 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
