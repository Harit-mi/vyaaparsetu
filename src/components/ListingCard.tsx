"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BusinessListing } from "@/types/marketplace";
import { formatINR } from "@/lib/utils";
import { MarketplaceStorage } from "@/lib/storage";
import { useToast } from "@/components/Toast";
import { CategoryPlaceholder } from "./CategoryPlaceholder";
import {
  ShieldCheck,
  Lock,
  Bookmark,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";

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
      result ? "Saved to Shortlist" : "Removed from Shortlist",
      listing.displayTitle,
      result ? "success" : "info"
    );
  };

  const ebitdaMargin =
    listing.annualRevenue > 0
      ? ((listing.annualEbitda / listing.annualRevenue) * 100).toFixed(1)
      : "0";

  const targetSlug = listing.slug || listing.id;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-500/50 hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <div>
        {/* Cover Photo / Header */}
        <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
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
              className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
              onError={() => setImgError(true)}
              unoptimized
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

          {/* Top Chips Row */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="px-2.5 py-1 bg-white/95 backdrop-blur-xs text-slate-800 text-xs font-semibold rounded-full shadow-xs">
              {listing.industry}
            </span>

            <div className="flex items-center gap-1.5">
              {listing.visibility === "strictly_confidential" ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-amber-200/80 shadow-xs">
                  <Lock className="w-3 h-3" />
                  Confidential
                </span>
              ) : listing.visibility === "partially_confidential" ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs">
                  <Lock className="w-3 h-3" />
                  Partial Blind
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-emerald-200/80 shadow-xs">
                  Verified Public
                </span>
              )}

              {/* Bookmark Button */}
              <button
                onClick={toggleBookmark}
                type="button"
                className={`p-1.5 rounded-full transition-all shadow-xs ${
                  isSaved
                    ? "bg-blue-600 text-white"
                    : "bg-white/90 text-slate-600 hover:text-slate-900 hover:bg-white"
                }`}
                title={isSaved ? "Remove from shortlist" : "Save this business"}
                aria-label={isSaved ? "Remove from shortlist" : "Save to shortlist"}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>

          {/* Bottom Location & Age */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-1 font-medium text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>{listing.city}, {listing.state}</span>
            </div>
            <span className="text-slate-300 font-medium">
              {listing.yearsInOperation} yrs in business
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <Link href={`/businesses/${targetSlug}`} className="block group/title">
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 group-hover/title:text-blue-600 transition line-clamp-1">
              {listing.displayTitle}
            </h3>
            <p className="font-sans text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {listing.tagline}
            </p>
          </Link>

          {/* Financial Metrics Strip */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Asking Price
              </span>
              <span className="font-bold text-sm text-slate-900 mt-0.5 block tabular-nums">
                {formatINR(listing.askingPrice)}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                TTM Revenue
              </span>
              <span className="font-semibold text-xs text-slate-700 mt-0.5 block tabular-nums">
                {formatINR(listing.annualRevenue)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                TTM EBITDA
              </span>
              <span className="font-semibold text-xs text-emerald-600 mt-0.5 block tabular-nums">
                {formatINR(listing.annualEbitda)}
                <span className="text-[10px] text-slate-400 font-normal ml-0.5">({ebitdaMargin}%)</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Call to Action */}
      <div className="p-5 pt-0">
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="truncate max-w-[160px]">
              {listing.isFinancialVerified ? "CA Audited Books" : "Promoter Verified"}
            </span>
          </div>

          <Link
            href={`/businesses/${targetSlug}`}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shadow-xs group/btn"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
