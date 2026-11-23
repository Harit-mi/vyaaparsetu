"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MarketplaceStorage } from "@/lib/storage";
import { BuyerProfile, BuyerType } from "@/types/marketplace";
import { formatINR } from "@/lib/utils";
import { useToast } from "@/components/Toast";
import {
  UserCheck,
  ShieldCheck,
  Building,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export default function BuyingProfilePage() {
  const router = useRouter();
  const currentUser = MarketplaceStorage.getCurrentUser();
  const { showToast } = useToast();

  const [profile, setProfile] = useState<BuyerProfile>(MarketplaceStorage.getBuyerProfile());
  const [buyerType, setBuyerType] = useState<BuyerType>(profile.buyerType);
  const [minBudget, setMinBudget] = useState(profile.minBudget);
  const [maxBudget, setMaxBudget] = useState(profile.maxBudget);
  const [industries, setIndustries] = useState<string[]>(profile.preferredIndustries);
  const [locations, setLocations] = useState<string[]>(profile.preferredLocations);
  const [experience, setExperience] = useState(profile.acquisitionExperience);
  const [fundingSource, setFundingSource] = useState(profile.intendedFundingSource);
  const [liquidCapital, setLiquidCapital] = useState(profile.liquidCapitalRange);
  const [bio, setBio] = useState(profile.bio || "");
  const [proofSubmitted, setProofSubmitted] = useState(profile.verifiedIdentity);

  const availableIndustries = [
    "Manufacturing",
    "B2B SaaS & Tech",
    "Healthcare & Diagnostics",
    "FMCG / Food",
    "Logistics & Supply Chain",
    "Retail & E-commerce",
  ];

  const availableRegions = [
    "Maharashtra",
    "Karnataka",
    "Delhi NCR",
    "Telangana",
    "Gujarat",
    "Tamil Nadu",
  ];

  const toggleIndustry = (ind: string) => {
    if (industries.includes(ind)) {
      setIndustries(industries.filter((i) => i !== ind));
    } else {
      setIndustries([...industries, ind]);
    }
  };

  const toggleLocation = (loc: string) => {
    if (locations.includes(loc)) {
      setLocations(locations.filter((l) => l !== loc));
    } else {
      setLocations([...locations, loc]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: BuyerProfile = {
      ...profile,
      buyerType,
      minBudget,
      maxBudget,
      preferredIndustries: industries,
      preferredLocations: locations,
      acquisitionExperience: experience,
      intendedFundingSource: fundingSource,
      liquidCapitalRange: liquidCapital,
      bio,
      verifiedIdentity: proofSubmitted,
    };
    MarketplaceStorage.saveBuyerProfile(updated);
    setProfile(updated);
    showToast(
      "Acquirer Profile Updated",
      "Your investment criteria have been synchronized with the deal matching engine.",
      "success"
    );
    router.push("/dashboard/buyer");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. HEADER */}
      <div className="border-b border-slate-200 pb-5">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/70">
          <ShieldCheck className="w-3.5 h-3.5" />
          Acquirer Accreditation • Investment Mandate
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
          Buyer Investment Profile
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Business owners and M&A advisors review your investment criteria before granting access to confidential data rooms.
        </p>
      </div>

      {/* 2. ACCREDITATION STATUS CARD */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-slate-900">{currentUser.fullName}</span>
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold px-2 py-0.5 rounded-full">
                {profile.qualificationStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Entity: {currentUser.companyName || "VP Growth Investments Ltd"} • {profile.liquidCapitalRange}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Deal Matching:</span>
          <span className="font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 text-xs">
            Top 5% Accredited
          </span>
        </div>
      </div>

      {/* 3. STRUCTURED PROFILE FORM */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-card space-y-6 text-sm">
        {/* Acquirer Entity Type */}
        <div className="space-y-3">
          <label className="block font-semibold text-slate-800 text-xs uppercase tracking-wider">
            Acquirer Classification
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { key: "family_office", label: "Family Office" },
              { key: "corporate", label: "Corporate Strategic" },
              { key: "private_equity", label: "Private Equity" },
              { key: "search_fund", label: "Search Fund / Sponsor" },
            ].map((type) => (
              <button
                key={type.key}
                type="button"
                onClick={() => setBuyerType(type.key as BuyerType)}
                className={`p-3.5 rounded-xl border text-center transition text-xs font-semibold ${
                  buyerType === type.key
                    ? "border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs ring-1 ring-blue-500"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Investment Ticket Size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
          <div>
            <label className="block font-semibold text-slate-700 text-xs mb-1.5">
              Minimum Investment Budget (₹)
            </label>
            <input
              type="number"
              value={minBudget}
              onChange={(e) => setMinBudget(Number(e.target.value))}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
            />
            <span className="text-xs text-blue-600 font-semibold mt-1.5 block">
              Indicative: {formatINR(minBudget)}
            </span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 text-xs mb-1.5">
              Maximum Investment Budget (₹)
            </label>
            <input
              type="number"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
            />
            <span className="text-xs text-blue-600 font-semibold mt-1.5 block">
              Indicative: {formatINR(maxBudget)}
            </span>
          </div>
        </div>

        {/* Sector Preferences */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <label className="block font-semibold text-slate-800 text-xs uppercase tracking-wider">
            Target Industry Sectors
          </label>
          <div className="flex flex-wrap gap-2">
            {availableIndustries.map((ind) => (
              <button
                key={ind}
                type="button"
                onClick={() => toggleIndustry(ind)}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-medium transition ${
                  industries.includes(ind)
                    ? "border-blue-600 bg-blue-50 text-blue-800 font-semibold"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {industries.includes(ind) ? "✓ " : "+ "} {ind}
              </button>
            ))}
          </div>
        </div>

        {/* Regional Preferences */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <label className="block font-semibold text-slate-800 text-xs uppercase tracking-wider">
            Target States & Regions
          </label>
          <div className="flex flex-wrap gap-2">
            {availableRegions.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => toggleLocation(loc)}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-medium transition ${
                  locations.includes(loc)
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {locations.includes(loc) ? "✓ " : "+ "} {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Funding & Capital Verification */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
          <div>
            <label className="block font-semibold text-slate-700 text-xs mb-1.5">
              Primary Capital Source
            </label>
            <select
              value={fundingSource}
              onChange={(e) => setFundingSource(e.target.value as any)}
              className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="self_funded">Self-Funded / Balance Sheet Reserves</option>
              <option value="bank_debt">Commercial Bank Debt / Term Loan</option>
              <option value="equity_partner">Co-Investment / Equity Partner</option>
              <option value="syndicate">Private Equity / Syndicate Consortium</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 text-xs mb-1.5">
              Readily Deployable Liquid Capital
            </label>
            <select
              value={liquidCapital}
              onChange={(e) => setLiquidCapital(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="₹10 Cr – ₹25 Cr">₹10 Cr – ₹25 Cr Liquid</option>
              <option value="₹25 Cr – ₹50 Cr">₹25 Cr – ₹50 Cr Liquid</option>
              <option value="₹50 Cr+">₹50 Cr+ Institutional Facility</option>
            </select>
          </div>
        </div>

        {/* Executive Bio */}
        <div className="pt-4 border-t border-slate-200 space-y-2">
          <label className="block font-semibold text-slate-800 text-xs uppercase tracking-wider">
            Acquisition Thesis & Track Record
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Outline your acquisition focus, operating philosophy, and investment track record..."
          />
        </div>

        {/* Covenants Checkbox */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={proofSubmitted}
              onChange={(e) => setProofSubmitted(e.target.checked)}
              className="mt-0.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span className="text-xs text-slate-700 leading-relaxed">
              I certify that our entity is a bonafide acquirer with deployable equity capital. We covenant to preserve absolute confidentiality regarding all seller records under the Indian Contract Act, 1872.
            </span>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/dashboard/buyer")}
            className="btn-secondary"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn-brand btn-lg"
          >
            <span>Save Investment Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
