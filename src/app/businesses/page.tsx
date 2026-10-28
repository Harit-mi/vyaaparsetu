"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MarketplaceStorage } from "@/lib/storage";
import { BusinessListing } from "@/types/marketplace";
import { ListingCard } from "@/components/ListingCard";
import { formatINR } from "@/lib/utils";
import { MarketplaceIcon } from "@/components/icons";
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
  ArrowUpRight,
  Scale,
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
  const [minEbitda, setMinEbitda] = useState("");
  const [minMargin, setMinMargin] = useState("");
  const [businessType, setBusinessType] = useState(searchParams.get("businessType") || "");
  const [saleStructure, setSaleStructure] = useState("");
  const [minYears, setMinYears] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [franchiseOnly, setFranchiseOnly] = useState(false);
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [freshness, setFreshness] = useState("all");
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
        // Keyword Search
        if (keyword.trim()) {
          const q = keyword.toLowerCase();
          const matchTitle = listing.displayTitle.toLowerCase().includes(q);
          const matchTag = listing.tagline.toLowerCase().includes(q);
          const matchInd = listing.industry.toLowerCase().includes(q);
          const matchCity = listing.city.toLowerCase().includes(q);
          if (!matchTitle && !matchTag && !matchInd && !matchCity) return false;
        }

        // Industry
        if (selectedIndustry && listing.industry !== selectedIndustry) return false;

        // Location / State
        if (selectedLocation) {
          const loc = selectedLocation.toLowerCase();
          const matchState = listing.state.toLowerCase().includes(loc);
          const matchCity = listing.city.toLowerCase().includes(loc);
          if (!matchState && !matchCity) return false;
        }

        // Max Price
        if (maxPrice && listing.askingPrice > Number(maxPrice)) return false;

        // Min Revenue
        if (minRevenue && listing.annualRevenue < Number(minRevenue)) return false;

        // Min EBITDA
        if (minEbitda && listing.annualEbitda < Number(minEbitda)) return false;

        // Profitability margin %
        if (minMargin) {
          const margin = listing.annualRevenue > 0 ? (listing.annualEbitda / listing.annualRevenue) * 100 : 0;
          if (margin < Number(minMargin)) return false;
        }

        // Business Type
        if (businessType && listing.businessType !== businessType) return false;

        // Sale Structure
        if (saleStructure && listing.saleStructure !== saleStructure) return false;

        // Years in Operation
        if (minYears && listing.yearsInOperation < Number(minYears)) return false;

        // Verified Financials Only
        if (verifiedOnly && !listing.isFinancialVerified) return false;

        // Franchise
        if (franchiseOnly && !listing.franchiseAvailable) return false;

        // Visibility
        if (visibilityFilter === "confidential" && listing.visibility === "public") return false;
        if (visibilityFilter === "public" && listing.visibility !== "public") return false;

        // Freshness
        if (freshness !== "all") {
          const listingDate = new Date(listing.createdAt).getTime();
          const now = Date.now();
          const diffDays = (now - listingDate) / (1000 * 3600 * 24);
          if (freshness === "7d" && diffDays > 7) return false;
          if (freshness === "30d" && diffDays > 30) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return a.askingPrice - b.askingPrice;
        if (sortBy === "price_desc") return b.askingPrice - a.askingPrice;
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
    minEbitda,
    minMargin,
    businessType,
    saleStructure,
    minYears,
    verifiedOnly,
    franchiseOnly,
    visibilityFilter,
    freshness,
    sortBy,
  ]);

  // Active filter chips list
  const activeChips = useMemo(() => {
    const chips: { label: string; onRemove: () => void }[] = [];
    if (keyword) chips.push({ label: `Query: "${keyword}"`, onRemove: () => setKeyword("") });
    if (selectedIndustry) chips.push({ label: `Sector: ${selectedIndustry}`, onRemove: () => setSelectedIndustry("") });
    if (selectedLocation) chips.push({ label: `Hub: ${selectedLocation}`, onRemove: () => setSelectedLocation("") });
    if (maxPrice) chips.push({ label: `Max Valuation: ${formatINR(Number(maxPrice))}`, onRemove: () => setMaxPrice("") });
    if (minRevenue) chips.push({ label: `Min Revenue: ${formatINR(Number(minRevenue))}`, onRemove: () => setMinRevenue("") });
    if (minMargin) chips.push({ label: `Min Margin: ${minMargin}%`, onRemove: () => setMinMargin("") });
    if (businessType) chips.push({ label: `Type: ${businessType}`, onRemove: () => setBusinessType("") });
    if (saleStructure) chips.push({ label: `Structure: ${saleStructure}`, onRemove: () => setSaleStructure("") });
    if (verifiedOnly) chips.push({ label: "CA Verified Only", onRemove: () => setVerifiedOnly(false) });
    if (visibilityFilter !== "all") chips.push({ label: `Visibility: ${visibilityFilter}`, onRemove: () => setVisibilityFilter("all") });
    return chips;
  }, [
    keyword,
    selectedIndustry,
    selectedLocation,
    maxPrice,
    minRevenue,
    minMargin,
    businessType,
    saleStructure,
    verifiedOnly,
    visibilityFilter,
  ]);

  const resetFilters = () => {
    setKeyword("");
    setSelectedIndustry("");
    setSelectedLocation("");
    setMaxPrice("");
    setMinRevenue("");
    setMinEbitda("");
    setMinMargin("");
    setBusinessType("");
    setSaleStructure("");
    setMinYears("");
    setVerifiedOnly(false);
    setFranchiseOnly(false);
    setVisibilityFilter("all");
    setFreshness("all");
    setSortBy("newest");
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE) || 1;
  const paginatedListings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredListings.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredListings, currentPage]);

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
      {/* 1. EDITORIAL HEADER & SEARCH CONSOLE */}
      <div className="border-b border-ivory-400 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-teal-800 font-bold mb-1">
            <span>PRIVATE CAPITAL DEALBOOK • ACQUISITION DISCOVERY</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0c152b]">
            Indian Enterprise Mandates for Sale
          </h1>
          <p className="font-serif-editorial italic text-xs sm:text-sm text-slate-600 mt-0.5 max-w-2xl">
            Direct access to cash-flowing manufacturing plants, proprietary B2B SaaS assets, and mid-market commercial operations.
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="relative w-full md:w-80">
          <MarketplaceIcon name="search" size="xs" className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search sector, city, or keywords..."
            className="w-full pl-9 pr-8 py-2 text-xs font-sans border border-ivory-400 bg-white focus:border-navy-900 focus:outline-hidden shadow-2xs"
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

      {/* 2. ACTIVE FILTER CHIPS & CONTROLS */}
      {activeChips.length > 0 && (
        <div className="bg-ivory-100 p-3 border border-ivory-300 flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="font-bold text-[#0c152b] text-[10px] uppercase mr-1">Active Criteria:</span>
          {activeChips.map((chip, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white border border-ivory-400 text-slate-800 text-[11px]"
            >
              <span>{chip.label}</span>
              <button
                onClick={chip.onRemove}
                className="text-slate-400 hover:text-slate-900 font-bold"
                aria-label={`Remove filter ${chip.label}`}
              >
                ×
              </button>
            </span>
          ))}
          <button
            onClick={resetFilters}
            className="text-[11px] text-red-700 hover:text-red-900 font-bold ml-auto uppercase tracking-wider"
          >
            Clear All
          </button>
        </div>
      )}

      {/* 3. MAIN WORKBENCH: SIDEBAR FILTERS + RESULTS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between bg-white p-3 border border-ivory-400">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-slate-800"
          >
            <SlidersHorizontal className="w-4 h-4 text-teal-800" />
            <span>Refine Mandates ({filteredListings.length})</span>
          </button>
          <button onClick={resetFilters} className="text-xs text-red-700 font-bold uppercase font-mono">
            Reset
          </button>
        </div>

        {/* Structured Filter Sidebar */}
        <aside
          aria-label="Filter Criteria"
          className={`${
            isMobileFilterOpen ? "block" : "hidden"
          } lg:block bg-white p-5 border border-ivory-400 space-y-5 text-xs`}
        >
          <div className="flex items-center justify-between border-b border-ivory-300 pb-2">
            <div className="flex items-center gap-1.5 font-mono font-bold text-[#0c152b] text-xs uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-teal-800" />
              <span>Screener Parameters</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-[10px] font-mono uppercase text-slate-500 hover:text-red-700 flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* 1. Industry */}
          <div>
            <label className="block font-mono font-bold text-slate-600 uppercase tracking-wider text-[10px] mb-1.5">
              Industry Category
            </label>
            <select
              value={selectedIndustry}
              onChange={(e) => {
                setSelectedIndustry(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 border border-ivory-400 bg-ivory-50 text-slate-900 text-xs focus:outline-hidden focus:border-navy-900"
            >
              <option value="">All Sectors</option>
              {industriesList.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Region / Hub */}
          <div>
            <label className="block font-mono font-bold text-slate-600 uppercase tracking-wider text-[10px] mb-1.5">
              Industrial Region
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 border border-ivory-400 bg-ivory-50 text-slate-900 text-xs focus:outline-hidden focus:border-navy-900"
            >
              <option value="">All Regions</option>
              <option value="Maharashtra">Maharashtra (Mumbai / Pune)</option>
              <option value="Karnataka">Karnataka (Bengaluru)</option>
              <option value="Delhi NCR">Delhi NCR (Gurugram / Noida)</option>
              <option value="Gujarat">Gujarat (Ahmedabad)</option>
              <option value="Telangana">Telangana (Hyderabad)</option>
            </select>
          </div>

          {/* 3. Asking Valuation */}
          <div>
            <label className="block font-mono font-bold text-slate-600 uppercase tracking-wider text-[10px] mb-1.5">
              Max Enterprise Valuation
            </label>
            <select
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 border border-ivory-400 bg-ivory-50 text-slate-900 text-xs focus:outline-hidden focus:border-navy-900"
            >
              <option value="">No Ceiling</option>
              <option value="50000000">Up to ₹5.0 Cr</option>
              <option value="100000000">Up to ₹10.0 Cr</option>
              <option value="200000000">Up to ₹20.0 Cr</option>
              <option value="500000000">Up to ₹50.0 Cr</option>
            </select>
          </div>

          {/* 4. Minimum Turnover */}
          <div>
            <label className="block font-mono font-bold text-slate-600 uppercase tracking-wider text-[10px] mb-1.5">
              Min Annual Turnover
            </label>
            <select
              value={minRevenue}
              onChange={(e) => {
                setMinRevenue(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 border border-ivory-400 bg-ivory-50 text-slate-900 text-xs focus:outline-hidden focus:border-navy-900"
            >
              <option value="">Any Turnover</option>
              <option value="50000000">₹5.0 Cr +</option>
              <option value="100000000">₹10.0 Cr +</option>
              <option value="200000000">₹20.0 Cr +</option>
            </select>
          </div>

          {/* 5. Minimum Margin */}
          <div>
            <label className="block font-mono font-bold text-slate-600 uppercase tracking-wider text-[10px] mb-1.5">
              Min EBITDA Margin (%)
            </label>
            <select
              value={minMargin}
              onChange={(e) => {
                setMinMargin(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 border border-ivory-400 bg-ivory-50 text-slate-900 text-xs focus:outline-hidden focus:border-navy-900"
            >
              <option value="">Any Profit Margin</option>
              <option value="10">10% + EBITDA</option>
              <option value="15">15% + EBITDA</option>
              <option value="20">20% + EBITDA</option>
              <option value="30">30% + EBITDA (High Cash-Flow)</option>
            </select>
          </div>

          {/* 6. Verification & Confidentiality */}
          <div className="pt-3 border-t border-ivory-300 space-y-2">
            <label className="flex items-start gap-2 cursor-pointer font-sans text-xs">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => {
                  setVerifiedOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="mt-0.5 text-teal-700 rounded-none border-ivory-400"
              />
              <span className="text-slate-800 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                CA Audited Books Only
              </span>
            </label>

            <label className="flex items-start gap-2 cursor-pointer font-sans text-xs">
              <input
                type="checkbox"
                checked={franchiseOnly}
                onChange={(e) => {
                  setFranchiseOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="mt-0.5 text-teal-700 rounded-none border-ivory-400"
              />
              <span className="text-slate-700">Franchise Transfer Available</span>
            </label>
          </div>

          {/* 7. Confidentiality Mode */}
          <div className="pt-3 border-t border-ivory-300 font-mono text-[11px]">
            <label className="block font-bold text-slate-600 uppercase tracking-wider text-[10px] mb-2">
              Confidentiality Protocol
            </label>
            <div className="space-y-1.5">
              {[
                { key: "all", label: "All Active Mandates" },
                { key: "public", label: "Public Records" },
                { key: "confidential", label: "Blind Mandates (NDA Only)" },
              ].map((c) => (
                <label key={c.key} className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="radio"
                    name="visFilter"
                    checked={visibilityFilter === c.key}
                    onChange={() => {
                      setVisibilityFilter(c.key);
                      setCurrentPage(1);
                    }}
                    className="text-teal-700"
                  />
                  <span>{c.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Mobile Apply Button */}
          {isMobileFilterOpen && (
            <div className="lg:hidden pt-3 border-t border-ivory-300">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-2.5 bg-[#0c152b] text-white font-mono text-xs uppercase font-bold tracking-wider"
              >
                Apply Criteria ({filteredListings.length} Results)
              </button>
            </div>
          )}
        </aside>

        {/* Results Presentation Area */}
        <main className="lg:col-span-3 space-y-6">
          {/* Header Bar with View Switcher & Sorting */}
          <div className="bg-white p-3 border border-ivory-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="text-slate-500 uppercase tracking-wider">
                SHOWING <strong className="text-[#0c152b]">{filteredListings.length}</strong> VERIFIED MANDATES
              </span>

              {/* View Mode Toggle: Cards vs Ledger Table */}
              <div className="hidden sm:flex items-center border border-[#d6d2c4] bg-[#f5f4ef] p-0.5 rounded-[2px]">
                <button
                  type="button"
                  onClick={() => setViewMode("cards")}
                  className={`px-2.5 py-1 flex items-center gap-1.5 text-[10.5px] uppercase font-bold tracking-wider transition-all duration-150 rounded-[2px] ${
                    viewMode === "cards"
                      ? "bg-white text-navy-950 shadow-xs border border-[#d6d2c4]"
                      : "text-slate-600 hover:text-navy-950 border border-transparent"
                  }`}
                  title="Prospectus Cards"
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-teal-700" />
                  <span>Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("ledger")}
                  className={`px-2.5 py-1 flex items-center gap-1.5 text-[10.5px] uppercase font-bold tracking-wider transition-all duration-150 rounded-[2px] ${
                    viewMode === "ledger"
                      ? "bg-white text-navy-950 shadow-xs border border-[#d6d2c4]"
                      : "text-slate-600 hover:text-navy-950 border border-transparent"
                  }`}
                  title="Financial Ledger Table"
                >
                  <ListFilter className="w-3.5 h-3.5 text-teal-700" />
                  <span>Ledger Table</span>
                </button>
              </div>
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 uppercase text-[10px]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="p-1 border border-ivory-400 bg-ivory-50 text-slate-800 text-xs focus:outline-hidden"
              >
                <option value="newest">Freshness (Newest First)</option>
                <option value="price_desc">Valuation: High to Low</option>
                <option value="price_asc">Valuation: Low to High</option>
                <option value="revenue_desc">Annual Turnover: High to Low</option>
                <option value="ebitda_desc">Adjusted EBITDA: High to Low</option>
              </select>
            </div>
          </div>

          {/* Empty State */}
          {filteredListings.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-ivory-400 p-12 text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-ivory-100 border border-ivory-300 flex items-center justify-center text-slate-500">
                <Search className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="font-display font-bold text-base text-[#0c152b]">
                  No Matching Mandates in Current Ledger
                </h3>
                <p className="font-sans text-xs text-slate-500 mt-1">
                  No active business acquisitions match the specified screener parameters. Reset your filters to explore all live opportunities.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-[#0c152b] text-white font-mono text-xs uppercase font-bold tracking-wider"
              >
                Reset All Criteria
              </button>
            </div>
          ) : viewMode === "ledger" ? (
            /* DUAL VIEW 1: FINANCIAL LEDGER TABLE */
            <div className="bg-white border border-ivory-400 overflow-x-auto shadow-xs">
              <table className="w-full text-left font-mono text-xs divide-y divide-ivory-300">
                <thead className="bg-ivory-100 text-[10px] text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Ref #</th>
                    <th className="p-3">Enterprise Opportunity</th>
                    <th className="p-3">Sector & Hub</th>
                    <th className="p-3 text-right">Turnover</th>
                    <th className="p-3 text-right">Adj. EBITDA</th>
                    <th className="p-3 text-right">Asking EV</th>
                    <th className="p-3 text-center">Audit Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-300">
                  {paginatedListings.map((l) => {
                    const ref = `VS-${(l.state || "IN").slice(0, 2).toUpperCase()}-${l.id.replace(/[^a-zA-Z0-9]/g, "").slice(-4).toUpperCase()}`;
                    const margin = l.annualRevenue > 0 ? ((l.annualEbitda / l.annualRevenue) * 100).toFixed(1) : "0";
                    return (
                      <tr key={l.id} className="hover:bg-ivory-50 transition">
                        <td className="p-3 text-[11px] font-bold text-[#0c152b]">#{ref}</td>
                        <td className="p-3">
                          <Link
                            href={`/businesses/${l.slug || l.id}`}
                            className="font-display font-bold text-slate-900 hover:text-teal-800 transition block max-w-xs truncate"
                          >
                            {l.displayTitle}
                          </Link>
                          <span className="text-[10px] text-slate-500 block truncate max-w-xs font-sans">
                            {l.tagline}
                          </span>
                        </td>
                        <td className="p-3 text-[11px] text-slate-600">
                          <span className="font-semibold block">{l.industry}</span>
                          <span className="text-[10px] text-slate-400 font-sans">{l.city}, {l.state}</span>
                        </td>
                        <td className="p-3 text-right font-medium text-slate-900">{formatINR(l.annualRevenue)}</td>
                        <td className="p-3 text-right text-teal-800 font-semibold">
                          {formatINR(l.annualEbitda)}
                          <span className="text-[10px] text-slate-400 block font-normal">({margin}%)</span>
                        </td>
                        <td className="p-3 text-right font-display font-bold text-sm text-[#0c152b]">
                          {formatINR(l.askingPrice)}
                        </td>
                        <td className="p-3 text-center">
                          {l.isFinancialVerified ? (
                            <span className="px-1.5 py-0.5 text-[9px] bg-teal-50 text-teal-900 border border-teal-200 font-bold uppercase">
                              CA Verified
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 text-[9px] bg-ivory-200 text-slate-600 border border-ivory-300 uppercase">
                              Seller MIS
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <Link
                            href={`/businesses/${l.slug || l.id}`}
                            className="inline-flex items-center gap-1 font-bold text-[11px] text-[#0c152b] hover:text-teal-800 uppercase"
                          >
                            <span>Teaser</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* DUAL VIEW 2: PROSPECTUS CARDS GRID */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white p-3 border border-ivory-400 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500 uppercase text-[10px]">
                PAGE {currentPage} OF {totalPages}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 border border-ivory-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-ivory-100 flex items-center gap-1 text-[11px]"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-7 h-7 border text-xs font-bold transition ${
                      currentPage === i + 1
                        ? "bg-[#0c152b] text-white border-[#0c152b]"
                        : "border-ivory-400 bg-white text-slate-700 hover:bg-ivory-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1 border border-ivory-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-ivory-100 flex items-center gap-1 text-[11px]"
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
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs font-mono text-slate-500">
          INITIALIZING PRIVATE DEALBOOK LEDGER...
        </div>
      }
    >
      <BusinessesContent />
    </Suspense>
  );
}
