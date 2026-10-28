"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MarketplaceStorage } from "@/lib/storage";
import { BusinessListing } from "@/types/marketplace";
import { formatINR } from "@/lib/utils";
import { ListingCard } from "@/components/ListingCard";
import { MarketplaceIcon } from "@/components/icons";
import { ArrowRight, ChevronRight } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [listings, setListings] = useState<BusinessListing[]>([]);
  const [searchIndustry, setSearchIndustry] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchMaxPrice, setSearchMaxPrice] = useState("");

  useEffect(() => {
    const sync = () => {
      setListings(MarketplaceStorage.getListings());
    };
    sync();
    window.addEventListener("vyapaarsetu_state_changed", sync);
    return () => window.removeEventListener("vyapaarsetu_state_changed", sync);
  }, []);

  const featuredListings = listings.slice(0, 4);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchIndustry) params.set("industry", searchIndustry);
    if (searchLocation) params.set("location", searchLocation);
    if (searchMaxPrice) params.set("maxPrice", searchMaxPrice);
    router.push(`/businesses?${params.toString()}`);
  };

  const industries = [
    { name: "Manufacturing & Engineering", count: "2 Mandates", range: "₹8.5 Cr – ₹18.0 Cr", desc: "Tier-1 auto forgings, MIDC tooling plants" },
    { name: "B2B SaaS & Enterprise Tech", count: "1 Mandate", range: "₹12.0 Cr ARR Multiple", desc: "Enterprise cloud vendor sourcing software" },
    { name: "Logistics & Supply Chain", count: "1 Mandate", range: "₹6.0 Cr EV", desc: "Temperature-controlled reefer fleet network" },
    { name: "Consumer Brands & Retail", count: "1 Mandate", range: "₹4.5 Cr EV", desc: "Ayurvedic personal care D2C omnichannel" },
    { name: "Commercial Food & Beverage", count: "1 Mandate", range: "₹3.8 Cr EV", desc: "Cloud kitchen & central production commissary" },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* 1. ASYMMETRIC EDITORIAL MASTHEAD */}
      <section className="bg-ivory-100 border-b border-ivory-400 pt-8 sm:pt-12 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left 7 Columns: Editorial Headline, Mission & Deal Screener */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 border border-bronze-400 bg-bronze-50 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-bronze-800">
                <span className="w-1.5 h-1.5 bg-bronze-600 inline-block" />
                <span>PRIVATE MERGERS & ACQUISITIONS EXCHANGE — INDIA</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0c152b] leading-[1.15]">
                The Private Exchange for Established Indian Enterprises.
              </h1>

              <p className="font-serif-editorial italic text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl">
                VyapaarSetu facilitates discreet, qualified acquisitions between serious business owners, corporate consolidators, and institutional family offices across India.
              </p>

              {/* Institutional Guarantees Stamp Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-ivory-300 font-mono text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-teal-700" />
                  <span>100% Blind Protection</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-teal-700" />
                  <span>CA Audited Accounts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-teal-700" />
                  <span>180-Day Attribution</span>
                </div>
              </div>

              {/* Integrated Deal Screener Terminal */}
              <div className="pt-2">
                <form
                  onSubmit={handleHeroSearch}
                  className="bg-white border border-ivory-400 p-3 sm:p-4 shadow-sm"
                >
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 pb-2 mb-3 border-b border-ivory-300 flex items-center justify-between">
                    <span className="font-bold text-[#0c152b]">DEAL SCREENER TERMINAL</span>
                    <span className="text-teal-800">6 LIVE VERIFIED MANDATES</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Industry */}
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Sector Filter
                      </label>
                      <select
                        value={searchIndustry}
                        onChange={(e) => setSearchIndustry(e.target.value)}
                        className="w-full text-xs font-sans p-2 border border-ivory-400 bg-ivory-50 text-slate-900 focus:outline-hidden focus:border-navy-900"
                      >
                        <option value="">All Sectors</option>
                        <option value="Manufacturing">Manufacturing & Engineering</option>
                        <option value="B2B SaaS & Tech">B2B SaaS & Tech</option>
                        <option value="Logistics & Supply Chain">Logistics & Cold-Chain</option>
                        <option value="Healthcare & Diagnostics">Healthcare & Pharma</option>
                        <option value="Retail & E-commerce">D2C & Retail</option>
                        <option value="FMCG / Food">Commercial F&B</option>
                      </select>
                    </div>

                    {/* Regional Hub */}
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Industrial Region
                      </label>
                      <select
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        className="w-full text-xs font-sans p-2 border border-ivory-400 bg-ivory-50 text-slate-900 focus:outline-hidden focus:border-navy-900"
                      >
                        <option value="">All Major Hubs</option>
                        <option value="Maharashtra">Maharashtra (Mumbai / Pune)</option>
                        <option value="Karnataka">Karnataka (Bengaluru)</option>
                        <option value="Delhi NCR">Delhi NCR (Gurugram / Noida)</option>
                        <option value="Gujarat">Gujarat (Ahmedabad)</option>
                        <option value="Telangana">Telangana (Hyderabad)</option>
                      </select>
                    </div>

                    {/* Valuation Ceiling */}
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Valuation Ceiling
                      </label>
                      <select
                        value={searchMaxPrice}
                        onChange={(e) => setSearchMaxPrice(e.target.value)}
                        className="w-full text-xs font-sans p-2 border border-ivory-400 bg-ivory-50 text-slate-900 focus:outline-hidden focus:border-navy-900"
                      >
                        <option value="">Any Indicative Size</option>
                        <option value="50000000">Up to ₹5.0 Cr</option>
                        <option value="100000000">Up to ₹10.0 Cr</option>
                        <option value="250000000">Up to ₹25.0 Cr</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-ivory-300 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      type="submit"
                      className="btn-primary w-full sm:w-auto"
                    >
                      <MarketplaceIcon name="search" size="xs" className="text-teal-400" />
                      <span>Screen Mandates ({listings.length})</span>
                    </button>

                    <Link
                      href="/businesses"
                      className="text-xs font-mono uppercase tracking-wider text-teal-800 hover:text-teal-950 font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <span>Open Full Dealbook</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </form>
              </div>
            </div>

            {/* Right 5 Columns: Spotlight Mandate Dossier Slip */}
            <div className="lg:col-span-5">
              <div className="bg-white border-2 border-[#0c152b] shadow-md p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-ivory-300 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] bg-[#0c152b] text-white px-1.5 py-0.5 uppercase tracking-widest font-bold">
                      DEAL SPOTLIGHT
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 font-bold">
                      #VS-MH-PUNE
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-teal-800 bg-teal-50 border border-teal-200 px-1 py-0.2 uppercase font-semibold">
                    180-Day Active
                  </span>
                </div>

                <div>
                  <span className="font-mono text-[10px] uppercase text-bronze-700 tracking-wider font-semibold">
                    Tier-1 Automotive Machining
                  </span>
                  <h3 className="font-display font-extrabold text-lg text-[#0c152b] mt-0.5">
                    Profitable Tier-1 Automotive Components Manufacturer
                  </h3>
                  <p className="font-serif-editorial italic text-xs text-slate-600 mt-1">
                    Supplying Bajaj, Tata & Mahindra with high-tonnage stamping presses and Zeiss 3D CMM inspection.
                  </p>
                </div>

                {/* Structured Financial Ledger */}
                <div className="bg-ivory-100 border border-ivory-300 font-mono text-xs divide-y divide-ivory-300">
                  <div className="p-2 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase">INDICATIVE ENTERPRISE VALUE</span>
                    <span className="font-display font-extrabold text-base text-[#0c152b]">₹8.50 Cr</span>
                  </div>
                  <div className="p-2 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">FY24 TURNOVER</span>
                      <span className="font-semibold text-slate-900">₹14.20 Cr</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">ADJUSTED EBITDA</span>
                      <span className="font-semibold text-teal-800">₹2.35 Cr (16.5%)</span>
                    </div>
                  </div>
                  <div className="p-2 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">INVENTORY INCLUDED</span>
                      <span className="text-slate-800">₹1.80 Cr raw steel</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">MACHINERY ASSETS</span>
                      <span className="text-slate-800">₹4.20 Cr lines</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] font-sans text-slate-600 bg-ivory-50 p-2.5 border-l-2 border-teal-700">
                  <p className="font-semibold text-slate-800">Chartered Accountant Verification:</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Form 3CD Tax Audit Report and 3 years GST GSTR-9 returns cross-verified by CA panel.
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Link
                    href="/businesses/precision-auto-forgings-pune"
                    className="btn-teal flex-1 text-center group/memo"
                  >
                    <span>Examine Memorandum</span>
                    <ArrowRight className="w-3.5 h-3.5 text-teal-300 group-hover/memo:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    href="/sell/new"
                    className="btn-secondary py-2.5 px-3.5"
                    title="List a business mandate"
                  >
                    <span>+ File Mandate</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PRIVATE MARKET LEDGER (Summary Metrics) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-ivory-400 p-4 sm:p-6">
          <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 pb-2 mb-4 border-b border-ivory-300 flex items-center justify-between">
            <span className="font-bold text-[#0c152b]">EXCHANGE METRICS & DEALBOOK SUMMARY</span>
            <span>UPDATED AS OF TODAY</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-ivory-300 font-mono">
            <div className="pt-2 md:pt-0 md:px-4 first:pl-0">
              <span className="text-[10px] text-slate-500 uppercase block">AGGREGATE MANDATE VALUE</span>
              <span className="font-display font-extrabold text-2xl text-[#0c152b] block mt-1">₹142.5 Cr</span>
              <span className="text-[11px] text-teal-800 font-sans font-medium">6 active enterprises listed</span>
            </div>

            <div className="pt-2 md:pt-0 md:px-4">
              <span className="text-[10px] text-slate-500 uppercase block">MEDIAN EBITDA MARGIN</span>
              <span className="font-display font-extrabold text-2xl text-teal-800 block mt-1">16.2%</span>
              <span className="text-[11px] text-slate-600 font-sans font-medium">Audited cash-flow positive</span>
            </div>

            <div className="pt-2 md:pt-0 md:px-4">
              <span className="text-[10px] text-slate-500 uppercase block">IDENTITY SECURITY</span>
              <span className="font-display font-extrabold text-2xl text-[#0c152b] block mt-1">100% Blind</span>
              <span className="text-[11px] text-slate-600 font-sans font-medium">Bilateral NDA required</span>
            </div>

            <div className="pt-2 md:pt-0 md:px-4">
              <span className="text-[10px] text-slate-500 uppercase block">ATTRIBUTION WINDOW</span>
              <span className="font-display font-extrabold text-2xl text-bronze-700 block mt-1">180 Days</span>
              <span className="text-[11px] text-slate-600 font-sans font-medium">Success fee protection</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ACTIVE MANDATES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ivory-400 pb-4">
          <div>
            <div className="flex items-center gap-2 text-teal-800 text-[10px] font-mono uppercase tracking-widest font-bold">
              <span>ACTIVE DEALBOOK</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0c152b] mt-1">
              Verified Acquisition Opportunities
            </h2>
            <p className="font-serif-editorial italic text-xs sm:text-sm text-slate-600 mt-0.5">
              Strictly vetted commercial enterprises with statutory filings and cross-verified books.
            </p>
          </div>

          <Link
            href="/businesses"
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider font-bold text-[#0c152b] hover:text-teal-800 transition"
          >
            <span>View All {listings.length} Mandates</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 2-Column Editorial Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      {/* 4. SECTOR FOCUS TABLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-ivory-100 border border-ivory-400 p-6">
          <div className="border-b border-ivory-300 pb-3 mb-4 flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                MANDATE DIRECTORY
              </span>
              <h3 className="font-display font-extrabold text-lg text-[#0c152b]">
                Indian Private Market Sectors
              </h3>
            </div>
            <Link
              href="/businesses"
              className="font-mono text-xs uppercase tracking-wider font-bold text-teal-800 hover:text-teal-950"
            >
              Browse Full Sector Matrix →
            </Link>
          </div>

          <div className="divide-y divide-ivory-300 font-mono text-xs">
            {industries.map((ind, idx) => (
              <div
                key={idx}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-white/60 px-2 transition"
              >
                <div className="space-y-0.5">
                  <span className="font-display font-bold text-sm text-[#0c152b]">{ind.name}</span>
                  <p className="font-sans text-xs text-slate-500">{ind.desc}</p>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">VALUATION RANGE</span>
                    <span className="font-bold text-slate-800">{ind.range}</span>
                  </div>
                  <span className="px-2 py-1 bg-ivory-200 border border-ivory-300 text-slate-800 font-semibold text-[11px]">
                    {ind.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ACQUISITION PROTOCOL (How Buying & Selling Works) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-ivory-400 pb-4">
          <span className="font-mono text-[10px] uppercase tracking-widest text-teal-800 font-bold">
            GOVERNANCE PROTOCOL
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0c152b] mt-1">
            The Institutional Acquisition Lifecycle
          </h2>
          <p className="font-serif-editorial italic text-xs sm:text-sm text-slate-600 mt-0.5">
            Structured in compliance with the Indian Contract Act, 1872 and IT Act Intermediary Rules.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: "PHASE 01",
              title: "Mandate Vetting & MCA Check",
              desc: "Seller authority is verified via Director DIN, MCA21 CIN master data, and GSTIN registration.",
            },
            {
              step: "PHASE 02",
              title: "Blind Teaser & Bilateral NDA",
              desc: "Buyers browse anonymized metrics. Sensitive corporate disclosures require a digitally executed NDA.",
            },
            {
              step: "PHASE 03",
              title: "Watermarked Data Room Access",
              desc: "Audit reports and customer schedules are shielded with dynamic user-IP cryptographic watermarking.",
            },
            {
              step: "PHASE 04",
              title: "Definitive Closing & Settlement",
              desc: "Legal counsel drafts definitive agreements. Clear 180-day deal attribution governs success fees.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-ivory-400 p-5 space-y-3 relative flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-[10px] text-bronze-700 uppercase font-bold tracking-widest block">
                  {item.step}
                </span>
                <h4 className="font-display font-bold text-sm text-[#0c152b] mt-1">
                  {item.title}
                </h4>
                <p className="font-sans text-xs text-slate-600 mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="pt-3 border-t border-ivory-300 text-[10px] font-mono text-slate-400">
                PROTOCOL STAGE 0{idx + 1}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. STATUTORY & INTERMEDIARY SAFE HARBOR DISCLOSURE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0c152b] text-ivory-200 border-2 border-bronze-500/40 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-bronze-300 font-mono text-[10px] uppercase tracking-widest">
            <MarketplaceIcon name="scale" size="sm" />
            <span>STATUTORY NOTICE & INTERMEDIARY STATUS — IT ACT, 2000</span>
          </div>

          <h3 className="font-display font-bold text-lg sm:text-xl text-white">
            VyapaarSetu operates as a neutral digital communications and introduction exchange.
          </h3>

          <p className="font-sans text-xs text-slate-300 leading-relaxed max-w-4xl">
            VyapaarSetu is not a broker, investment adviser, portfolio manager, legal counsel, or escrow agent registered with SEBI, RBI, or any financial regulator. All listings, turnover claims, and EBITDA figures are seller-provided representations unless explicitly endorsed with the &apos;CA Verified&apos; badge. Prospective buyers are strictly advised to retain independent chartered accountants and corporate legal advisers for confirmatory due diligence.
          </p>

          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] text-slate-400">
            <span>GSTIN: 27AABCV1234F1Z8 (Maharashtra)</span>
            <span>GRIEVANCE OFFICER: compliance@vyapaarsetu.in</span>
            <span>ATTRIBUTION PROTOCOL: 180 DAYS</span>
          </div>
        </div>
      </section>
    </div>
  );
}
