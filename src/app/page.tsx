"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MarketplaceStorage } from "@/lib/storage";
import { BusinessListing } from "@/types/marketplace";
import { formatINR } from "@/lib/utils";
import { ListingCard } from "@/components/ListingCard";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Lock,
  Scale,
  Building2,
  Users,
  Sparkles,
  ChevronRight,
  FileText,
  BadgeCheck,
  Compass,
  DollarSign,
  Layers,
} from "lucide-react";

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
    {
      name: "Manufacturing & Engineering",
      count: "2 Businesses",
      range: "₹8.5 Cr – ₹18.0 Cr",
      desc: "Tier-1 auto forgings, precision tooling, MIDC industrial facilities",
    },
    {
      name: "B2B SaaS & Enterprise Tech",
      count: "1 Business",
      range: "₹12.0 Cr EV",
      desc: "Enterprise cloud software, recurring ARR, proprietary IP",
    },
    {
      name: "Logistics & Supply Chain",
      count: "1 Business",
      range: "₹6.0 Cr EV",
      desc: "Temperature-controlled reefer fleet, pan-India distribution routes",
    },
    {
      name: "Consumer Brands & D2C",
      count: "1 Business",
      range: "₹4.5 Cr EV",
      desc: "Ayurvedic personal care, omnichannel retail, 40%+ gross margins",
    },
    {
      name: "Commercial Food & Beverage",
      count: "1 Business",
      range: "₹3.8 Cr EV",
      desc: "Multi-brand cloud kitchen network, central production commissaries",
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-24">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/70 to-slate-100/40 border-b border-slate-200/80 pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Trust Badge Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>India&apos;s Verified Business Acquisition Exchange</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            The Modern Marketplace to <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Buy & Sell Businesses
            </span>{" "}
            in India.
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover profitable manufacturing plants, B2B SaaS firms, logistics networks, and retail brands. Connect directly with verified business owners with CA-audited financials and bilateral NDA protection.
          </p>

          {/* Dual Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/businesses"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-sm hover:shadow active:scale-[0.99]"
            >
              <span>Explore All Businesses</span>
              <ArrowRight className="w-4 h-4 text-blue-200" />
            </Link>

            <Link
              href="/sell/new"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 shadow-xs transition hover:border-slate-300 active:scale-[0.99]"
            >
              <span>List Your Business Free</span>
            </Link>
          </div>

          {/* Floating Search Console */}
          <div className="pt-8">
            <form
              onSubmit={handleHeroSearch}
              className="bg-white rounded-2xl shadow-card border border-slate-200/90 p-4 sm:p-5 text-left max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-blue-600" />
                  Quick Business Screener
                </span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  {listings.length} Active Verified Mandates
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Sector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Sector / Industry
                  </label>
                  <select
                    value={searchIndustry}
                    onChange={(e) => setSearchIndustry(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                  >
                    <option value="">All Industries</option>
                    <option value="Manufacturing">Manufacturing & Engineering</option>
                    <option value="B2B SaaS & Tech">B2B SaaS & Tech</option>
                    <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                    <option value="Healthcare & Diagnostics">Healthcare & Pharma</option>
                    <option value="Retail & E-commerce">Consumer Brands & Retail</option>
                    <option value="FMCG / Food">Commercial F&B</option>
                  </select>
                </div>

                {/* Region */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Location / Hub
                  </label>
                  <select
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                  >
                    <option value="">All Regions</option>
                    <option value="Maharashtra">Maharashtra (Mumbai / Pune)</option>
                    <option value="Karnataka">Karnataka (Bengaluru)</option>
                    <option value="Delhi NCR">Delhi NCR (Gurugram / Noida)</option>
                    <option value="Gujarat">Gujarat (Ahmedabad / Surat)</option>
                    <option value="Telangana">Telangana (Hyderabad)</option>
                  </select>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Maximum Valuation
                  </label>
                  <select
                    value={searchMaxPrice}
                    onChange={(e) => setSearchMaxPrice(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                  >
                    <option value="">Any Size</option>
                    <option value="50000000">Up to ₹5.0 Cr</option>
                    <option value="100000000">Up to ₹10.0 Cr</option>
                    <option value="250000000">Up to ₹25.0 Cr</option>
                    <option value="500000000">Up to ₹50.0 Cr</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition shadow-xs"
                >
                  <Search className="w-3.5 h-3.5 text-blue-400" />
                  <span>Search {listings.length} Listings</span>
                </button>

                <Link
                  href="/businesses"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>Browse Full Directory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. TRUST STATS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-card">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="pt-3 md:pt-0 md:px-4 first:pl-0 space-y-1">
              <span className="text-xs font-medium text-slate-500 block">Total Active Dealbook</span>
              <span className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 block tracking-tight">
                ₹142.5 Cr+
              </span>
              <span className="text-xs text-emerald-600 font-medium">6 curated enterprises</span>
            </div>

            <div className="pt-3 md:pt-0 md:px-4 space-y-1">
              <span className="text-xs font-medium text-slate-500 block">Audited EBITDA Margin</span>
              <span className="font-display font-extrabold text-2xl sm:text-3xl text-emerald-600 block tracking-tight">
                16.2%
              </span>
              <span className="text-xs text-slate-500 font-medium">Median operating cashflow</span>
            </div>

            <div className="pt-3 md:pt-0 md:px-4 space-y-1">
              <span className="text-xs font-medium text-slate-500 block">Promoter Confidentiality</span>
              <span className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 block tracking-tight">
                100% Blind
              </span>
              <span className="text-xs text-slate-500 font-medium">Bilateral NDA required</span>
            </div>

            <div className="pt-3 md:pt-0 md:px-4 space-y-1">
              <span className="text-xs font-medium text-slate-500 block">Verification Standard</span>
              <span className="font-display font-extrabold text-2xl sm:text-3xl text-blue-600 block tracking-tight">
                CA & MCA
              </span>
              <span className="text-xs text-slate-500 font-medium">Form 3CD & GSTR-9 cross-checked</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED BUSINESS OPPORTUNITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Opportunities</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Indian Businesses for Sale
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Profitable enterprises with audited financials, established customer contracts, and motivated owners.
            </p>
          </div>

          <Link
            href="/businesses"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            <span>View all {listings.length} businesses</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Listing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      {/* 4. SECTORS DIRECTORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-xl overflow-hidden relative">
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
            <div>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Industrial Directory
              </span>
              <h3 className="font-display text-2xl font-bold text-white mt-1">
                Explore Indian Acquisition Sectors
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                From Tier-1 automotive manufacturing in Pune to enterprise B2B SaaS in Bengaluru.
              </p>
            </div>
            <Link
              href="/businesses"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
            >
              <span>Explore All Sectors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {industries.map((ind, idx) => (
              <Link
                key={idx}
                href={`/businesses?industry=${encodeURIComponent(ind.name)}`}
                className="p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 transition group space-y-2 block"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white group-hover:text-blue-300 transition">
                    {ind.name}
                  </span>
                  <span className="text-xs font-semibold text-blue-400 bg-blue-950 px-2 py-0.5 rounded-full border border-blue-800">
                    {ind.count}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">{ind.desc}</p>
                <div className="pt-2 border-t border-slate-700/40 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Valuation Range</span>
                  <span className="font-semibold text-slate-200">{ind.range}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (ACQUISITION LIFECYCLE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Safe & Structured Process
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How Business Acquisitions Work on VyapaarSetu
          </h2>
          <p className="text-sm text-slate-500">
            A secure four-stage pipeline designed for serious business owners and qualified buyers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Discover & Screen",
              desc: "Browse verified opportunities by revenue, profitability, location, and industry vertical.",
              icon: Search,
            },
            {
              step: "02",
              title: "Sign Digital NDA",
              desc: "Execute a compliant bilateral Non-Disclosure Agreement directly online to request private access.",
              icon: Lock,
            },
            {
              step: "03",
              title: "Review Data Room",
              desc: "Examine watermarked CA audit reports, customer concentration profiles, and asset schedules.",
              icon: FileText,
            },
            {
              step: "04",
              title: "Meet Owners & Close",
              desc: "Communicate directly in private deal rooms, draft Letters of Intent (LOI), and close safely.",
              icon: CheckCircle2,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-4 relative"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-600 block mb-1">
                    Step {item.step}
                  </span>
                  <h4 className="font-bold text-base text-slate-900">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. TRUST & REGULATORY DISCLOSURE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
            <Scale className="w-4 h-4 text-blue-600" />
            <span>Information Technology Act, 2000 — Intermediary Neutrality</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
            VyapaarSetu operates purely as a neutral digital communications and introduction exchange connecting business sellers and qualified acquirers under Section 79 of the Information Technology Act, 2000. VyapaarSetu is not a broker, investment adviser, portfolio manager, legal counsel, or escrow agent registered with SEBI or RBI. All financial figures are seller representations unless endorsed with independent CA verification.
          </p>

          <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <span>GSTIN: 27AABCV1234F1Z8 (Maharashtra)</span>
            <span>Grievance Desk: compliance@vyapaarsetu.in</span>
            <span>180-Day Introduction Attribution Covenant</span>
          </div>
        </div>
      </section>
    </div>
  );
}
