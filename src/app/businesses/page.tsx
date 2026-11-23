"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MarketplaceStorage } from "@/lib/storage";
import { BusinessListing } from "@/types/marketplace";
import { ListingCard } from "@/components/ListingCard";
import { formatINR } from "@/lib/utils";
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  Building,
  ShieldCheck,
  Lock,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  ListFilter,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

function BusinessesContent() {
  const searchParams = useSearchParams();
  const [allListings, setAllListings] = useState<BusinessListing[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "ledger">("cards");

  // Filter States
  const [keyword, setKeyword] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState(searchParams.get("industry") || "");
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get("location") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minRevenue, setMinRevenue] = useState("");
  const [minMargin, setMinMargin] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const sync = () => {
      setAllListings(MarketplaceStorage.getListings());
    };
    sync();
    window.addEventListener("vyapaarsetu_state_changed", sync);
    return () => window.removeEventListener("vyapaarsetu_state_changed", sync);
  }, []);

  // Filter Logic
  const filteredListings = useMemo(() => {
    return allListings
      .filter((listing) => {
        if (keyword.trim()) {
          const q = keyword.toLowerCase();
          const matchTitle = listing.displayTitle.toLowerCase().includes(q);
          const matchTag = listing.tagline.toLowerCase().includes(q);
          const matchInd = listing.industry.toLowerCase().includes(q);
          const matchCity = listing.city.toLowerCase().includes(q);
          if (!matchTitle && !matchTag && !matchInd && !matchCity) return false;
        }

        if (selectedIndustry && listing.industry !== selectedIndustry) return false;

        if (selectedLocation) {
          const loc = selectedLocation.toLowerCase();
          const matchState = listing.state.toLowerCase().includes(loc);
          const matchCity = listing.city.toLowerCase().includes(loc);
          if (!matchState && !matchCity) return false;
        }

        if (maxPrice && listing.askingPrice > Number(maxPrice)) return false;
        if (minRevenue && listing.annualRevenue < Number(minRevenue)) return false;

        if (minMargin && listing.annualRevenue > 0) {
          const margin = (listing.annualEbitda / listing.annualRevenue) * 100;
          if (margin < Number(minMargin)) return false;
        }

        if (verifiedOnly && !listing.isFinancialVerified) return false;

        if (visibilityFilter !== "all") {
          if (visibilityFilter === "public" && listing.visibility !== "public") return false;
          if (visibilityFilter === "confidential" && listing.visibility === "public") return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_desc") return b.askingPrice - a.askingPrice;
        if (sortBy === "price_asc") return a.askingPrice - b.askingPrice;
        if (sortBy === "revenue_desc") return b.annualRevenue - a.annualRevenue;
        if (sortBy === "ebitda_desc") return b.annualEbitda - a.annualEbitda;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [
    allListings,
    keyword,
    selectedIndustry,
    selectedLocation,
    maxPrice,
    minRevenue,
    minMargin,
    verifiedOnly,
    visibilityFilter,
    sortBy,
  ]);

  const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE) || 1;
  const paginatedListings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredListings.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredListings, currentPage]);

  const resetFilters = () => {
    setKeyword("");
    setSelectedIndustry("");
    setSelectedLocation("");
    setMaxPrice("");
    setMinRevenue("");
    setMinMargin("");
    setVerifiedOnly(false);
    setVisibilityFilter("all");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const activeChips = [];
  if (selectedIndustry) activeChips.push({ label: selectedIndustry, onRemove: () => setSelectedIndustry("") });
  if (selectedLocation) activeChips.push({ label: selectedLocation, onRemove: () => setSelectedLocation("") });
  if (maxPrice) activeChips.push({ label: `Max ${formatINR(Number(maxPrice))}`, onRemove: () => setMaxPrice("") });
  if (minRevenue) activeChips.push({ label: `Min Rev ${formatINR(Number(minRevenue))}`, onRemove: () => setMinRevenue("") });
  if (minMargin) activeChips.push({ label: `${minMargin}%+ EBITDA`, onRemove: () => setMinMargin("") });
  if (verifiedOnly) activeChips.push({ label: "CA Audited Only", onRemove: () => setVerifiedOnly(false) });
  if (visibilityFilter !== "all") activeChips.push({ label: visibilityFilter === "public" ? "Public Only" : "Confidential Only", onRemove: () => setVisibilityFilter("all") });

  const industriesList = [
    "Manufacturing",
    "B2B SaaS & Tech",
    "Healthcare & Diagnostics",
    "FMCG / Food",
    "Logistics & Supply Chain",
    "Retail & E-commerce",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. Header & Search Console */}
      <div className="border-b border-slate-200/80 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Marketplace Directory</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Businesses for Sale in India
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Discover vetted, cash-flowing Indian enterprises with verified revenue, audited tax filings, and motivated promoters.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search sector, city, or keywords..."
            className="w-full pl-9 pr-8 py-2.5 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition shadow-xs"
          />
          {keyword && (
            <button
              onClick={() => setKeyword("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Active Filter Chips */}
      {activeChips.length > 0 && (
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-700 text-xs mr-1">Active Filters:</span>
          {activeChips.map((chip, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 text-slate-800 rounded-full font-medium shadow-xs"
            >
              <span>{chip.label}</span>
              <button
                onClick={chip.onRemove}
                className="text-slate-400 hover:text-slate-900 font-bold ml-0.5"
                aria-label={`Remove filter ${chip.label}`}
              >
                ×
              </button>
            </span>
          ))}
          <button
            onClick={resetFilters}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold ml-auto"
          >
            Clear All
          </button>
        </div>
      )}

      {/* 3. Main Content: Sidebar + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-800"
          >
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>Refine Criteria ({filteredListings.length})</span>
          </button>
          <button onClick={resetFilters} className="text-xs text-rose-600 font-semibold">
            Reset
          </button>
        </div>

        {/* Sidebar Filters */}
        <aside
          aria-label="Filter Criteria"
          className={`${
            isMobileFilterOpen ? "block" : "hidden"
          } lg:block bg-white p-5 rounded-2xl border border-slate-200/90 shadow-card space-y-5 text-xs`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              <span>Filter Opportunities</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-[11px] text-slate-400 hover:text-slate-700 font-medium"
            >
              Reset
            </button>
          </div>

          {/* Industry */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Sector / Industry
            </label>
            <select
              value={selectedIndustry}
              onChange={(e) => {
                setSelectedIndustry(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
            >
              <option value="">All Sectors</option>
              {industriesList.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Region */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Region / Hub
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
            >
              <option value="">All States</option>
              <option value="Maharashtra">Maharashtra (Mumbai / Pune)</option>
              <option value="Karnataka">Karnataka (Bengaluru)</option>
              <option value="Delhi">Delhi NCR (Noida / Gurugram)</option>
              <option value="Gujarat">Gujarat (Ahmedabad)</option>
              <option value="Telangana">Telangana (Hyderabad)</option>
            </select>
          </div>

          {/* Max Asking Price */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Max Asking Price
            </label>
            <select
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
            >
              <option value="">Any Price</option>
              <option value="50000000">Up to ₹5.0 Cr</option>
              <option value="100000000">Up to ₹10.0 Cr</option>
              <option value="250000000">Up to ₹25.0 Cr</option>
              <option value="500000000">Up to ₹50.0 Cr</option>
            </select>
          </div>

          {/* Min Annual Turnover */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Min Annual Revenue
            </label>
            <select
              value={minRevenue}
              onChange={(e) => {
                setMinRevenue(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
            >
              <option value="">Any Turnover</option>
              <option value="50000000">₹5.0 Cr +</option>
              <option value="100000000">₹10.0 Cr +</option>
              <option value="200000000">₹20.0 Cr +</option>
            </select>
          </div>

          {/* Min Margin */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Min EBITDA Margin
            </label>
            <select
              value={minMargin}
              onChange={(e) => {
                setMinMargin(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
            >
              <option value="">Any Margin</option>
              <option value="10">10%+ EBITDA</option>
              <option value="15">15%+ EBITDA</option>
              <option value="20">20%+ EBITDA</option>
            </select>
          </div>

          {/* Verified Only */}
          <div className="pt-3 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => {
                  setVerifiedOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300"
              />
              <span className="flex items-center gap-1 text-slate-900 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                CA Audited Books Only
              </span>
            </label>
          </div>

          {/* Confidentiality */}
          <div className="pt-3 border-t border-slate-100 space-y-1.5">
            <label className="block font-semibold text-slate-700 mb-1.5">
              Confidentiality Mode
            </label>
            {[
              { key: "all", label: "All Active Opportunities" },
              { key: "public", label: "Public Listings" },
              { key: "confidential", label: "Blind Teasers (NDA Required)" },
            ].map((c) => (
              <label key={c.key} className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                <input
                  type="radio"
                  name="visFilter"
                  checked={visibilityFilter === c.key}
                  onChange={() => {
                    setVisibilityFilter(c.key);
                    setCurrentPage(1);
                  }}
                  className="text-blue-600"
                />
                <span>{c.label}</span>
              </label>
            ))}
          </div>

          {/* Mobile Apply */}
          {isMobileFilterOpen && (
            <div className="lg:hidden pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Apply Filters ({filteredListings.length} Results)
              </button>
            </div>
          )}
        </aside>

        {/* Results Area */}
        <main className="lg:col-span-3 space-y-6">
          {/* Header Controls */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center gap-3">
              <span className="text-slate-600 font-medium">
                Showing <strong className="text-slate-900 font-bold">{filteredListings.length}</strong> businesses
              </span>

              {/* View Switcher */}
              <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setViewMode("cards")}
                  className={`px-3 py-1 flex items-center gap-1 text-xs font-semibold rounded-md transition ${
                    viewMode === "cards"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("ledger")}
                  className={`px-3 py-1 flex items-center gap-1 text-xs font-semibold rounded-md transition ${
                    viewMode === "ledger"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>Table</span>
                </button>
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="newest">Newest Listed</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="revenue_desc">Revenue: High to Low</option>
                <option value="ebitda_desc">EBITDA: High to Low</option>
              </select>
            </div>
          </div>

          {/* Empty State */}
          {filteredListings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-card">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <Search className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="font-display font-bold text-base text-slate-900">
                  No Businesses Found
                </h3>
                <p className="text-xs text-slate-500">
                  No business listings match your current filters. Try relaxing your filters or resetting your search.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === "ledger" ? (
            /* Table View */
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-x-auto shadow-card">
              <table className="w-full text-left text-xs divide-y divide-slate-100">
                <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Business / Title</th>
                    <th className="p-3.5">Industry & Hub</th>
                    <th className="p-3.5 text-right">TTM Revenue</th>
                    <th className="p-3.5 text-right">TTM EBITDA</th>
                    <th className="p-3.5 text-right">Asking Price</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedListings.map((l) => {
                    const margin = l.annualRevenue > 0 ? ((l.annualEbitda / l.annualRevenue) * 100).toFixed(1) : "0";
                    return (
                      <tr key={l.id} className="hover:bg-slate-50/70 transition">
                        <td className="p-3.5 max-w-xs">
                          <Link
                            href={`/businesses/${l.slug || l.id}`}
                            className="font-bold text-slate-900 hover:text-blue-600 transition block truncate"
                          >
                            {l.displayTitle}
                          </Link>
                          <span className="text-[11px] text-slate-500 truncate block mt-0.5">
                            {l.tagline}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-slate-800 block">{l.industry}</span>
                          <span className="text-[11px] text-slate-500">{l.city}, {l.state}</span>
                        </td>
                        <td className="p-3.5 text-right font-medium text-slate-700">{formatINR(l.annualRevenue)}</td>
                        <td className="p-3.5 text-right font-semibold text-emerald-600">
                          {formatINR(l.annualEbitda)}
                          <span className="text-[10px] text-slate-400 font-normal ml-0.5">({margin}%)</span>
                        </td>
                        <td className="p-3.5 text-right font-bold text-slate-900">
                          {formatINR(l.askingPrice)}
                        </td>
                        <td className="p-3.5 text-center">
                          {l.isFinancialVerified ? (
                            <span className="px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-700 rounded-full font-semibold border border-emerald-100">
                              CA Audited
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-600 rounded-full font-medium">
                              Promoter MIS
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <Link
                            href={`/businesses/${l.slug || l.id}`}
                            className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700"
                          >
                            <span>View</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Cards View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 flex items-center justify-between text-xs shadow-xs">
              <span className="text-slate-500 font-medium">
                Page {currentPage} of {totalPages}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 flex items-center gap-1 font-medium"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg font-semibold text-xs transition ${
                      currentPage === i + 1
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 flex items-center gap-1 font-medium"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function BusinessesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs font-sans text-slate-500">
          Loading marketplace directory...
        </div>
      }
    >
      <BusinessesContent />
    </Suspense>
  );
}
