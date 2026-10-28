"use client";

import React, { useState, useEffect } from "react";
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* 1. EDITORIAL HEADER */}
      <div className="border-b border-ivory-400 pb-4">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-teal-800 bg-teal-50 px-2 py-0.5 border border-teal-200">
          ACQUIRER ACCREDITATION • INVESTMENT MANDATE CRITERIA
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0c152b] mt-1">
          Corporate & Acquirer Buying Profile
        </h1>
        <p className="font-serif-editorial italic text-xs sm:text-sm text-slate-600 mt-0.5">
          Enterprise promoters review your institutional accreditation before executing bilateral NDAs and granting Data Room exhibits.
        </p>
      </div>

      {/* 2. ACCREDITATION STATUS CARD */}
      <div className="p-5 bg-white border border-ivory-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0c152b] border border-bronze-500/40 text-bronze-300 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm text-[#0c152b]">{currentUser.fullName}</span>
              <span className="text-[9px] bg-teal-50 text-teal-900 border border-teal-200 font-bold px-1.5 py-0.2 uppercase">
                {profile.qualificationStatus}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-sans mt-0.5">
              Entity: {currentUser.companyName || "VP Growth Investments Ltd"} • {profile.liquidCapitalRange}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 uppercase text-[10px]">MATCH ENGINE:</span>
          <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 border border-teal-200 uppercase text-[11px]">
            TOP 5% ACCREDITED
          </span>
        </div>
      </div>

      {/* 3. STRUCTURED PROFILE FORM */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 border border-ivory-400 space-y-6 text-xs font-sans">
        {/* Acquirer Entity Type */}
        <div>
          <label className="block font-mono font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-2">
            Acquirer Classification
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            {[
              { key: "family_office", label: "Family Investment Office" },
              { key: "corporate", label: "Corporate Strategic M&A" },
              { key: "private_equity", label: "Private Equity / Growth" },
              { key: "search_fund", label: "Search Fund / Sponsor" },
            ].map((type) => (
              <button
                key={type.key}
                type="button"
                onClick={() => setBuyerType(type.key as BuyerType)}
                className={`p-3 border text-center transition text-xs ${
                  buyerType === type.key
                    ? "border-[#0c152b] bg-[#0c152b] text-white font-bold"
                    : "border-ivory-400 bg-ivory-50 text-slate-700 hover:bg-white"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Investment Ticket Size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-ivory-300 font-mono">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
              Minimum Investment Budget (₹)
            </label>
            <input
              type="number"
              value={minBudget}
              onChange={(e) => setMinBudget(Number(e.target.value))}
              className="w-full p-2.5 border border-ivory-400 bg-ivory-50 text-slate-900 focus:bg-white focus:border-navy-900 text-xs"
            />
            <span className="text-[10px] text-teal-800 font-bold mt-1 block">
              Indicative: {formatINR(minBudget)}
            </span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
              Maximum Investment Budget (₹)
            </label>
            <input
              type="number"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full p-2.5 border border-ivory-400 bg-ivory-50 text-slate-900 focus:bg-white focus:border-navy-900 text-xs"
            />
            <span className="text-[10px] text-teal-800 font-bold mt-1 block">
              Indicative: {formatINR(maxBudget)}
            </span>
          </div>
        </div>

        {/* Sector Preferences */}
        <div className="pt-4 border-t border-ivory-300">
          <label className="block font-mono font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-2">
            Target Sector Mandates
          </label>
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            {availableIndustries.map((ind) => (
              <button
                key={ind}
                type="button"
                onClick={() => toggleIndustry(ind)}
                className={`px-3 py-1.5 border transition ${
                  industries.includes(ind)
                    ? "border-teal-700 bg-teal-50 text-teal-950 font-bold"
                    : "border-ivory-400 bg-ivory-50 text-slate-600 hover:bg-white"
                }`}
              >
                {industries.includes(ind) ? "✓ " : "+ "} {ind}
              </button>
            ))}
          </div>
        </div>

        {/* Regional Preferences */}
        <div className="pt-4 border-t border-ivory-300">
          <label className="block font-mono font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-2">
            Target Industrial Corridors & States
          </label>
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            {availableRegions.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => toggleLocation(loc)}
                className={`px-3 py-1.5 border transition ${
                  locations.includes(loc)
                    ? "border-teal-700 bg-teal-50 text-teal-950 font-bold"
                    : "border-ivory-400 bg-ivory-50 text-slate-600 hover:bg-white"
                }`}
              >
                {locations.includes(loc) ? "✓ " : "+ "} {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Funding & Capital Verification */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-ivory-300 font-mono">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
              Primary Capital Source
            </label>
            <select
              value={fundingSource}
              onChange={(e) => setFundingSource(e.target.value as any)}
              className="w-full p-2.5 border border-ivory-400 bg-ivory-50 text-slate-900 text-xs focus:bg-white focus:border-navy-900"
            >
              <option value="self_funded">Self-Funded / Balance Sheet Reserves</option>
              <option value="bank_debt">Commercial Bank Debt / Term Loan</option>
              <option value="equity_partner">Co-Investment / Equity Partner</option>
              <option value="syndicate">Private Equity / Syndicate Consortium</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
              Readily Deployable Liquid Capital
            </label>
            <select
              value={liquidCapital}
              onChange={(e) => setLiquidCapital(e.target.value)}
              className="w-full p-2.5 border border-ivory-400 bg-ivory-50 text-slate-900 text-xs focus:bg-white focus:border-navy-900"
            >
              <option value="₹10 Cr – ₹25 Cr">₹10 Cr – ₹25 Cr Liquid</option>
              <option value="₹25 Cr – ₹50 Cr">₹25 Cr – ₹50 Cr Liquid</option>
              <option value="₹50 Cr+">₹50 Cr+ Institutional Facility</option>
            </select>
          </div>
        </div>

        {/* Executive Bio */}
        <div className="pt-4 border-t border-ivory-300">
          <label className="block font-mono font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
            Acquisition Thesis & Corporate Background
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3 border border-ivory-400 bg-ivory-50 text-slate-900 text-xs focus:bg-white focus:border-navy-900"
            placeholder="Outline your acquisition focus, operating philosophy, and investment track record..."
          />
        </div>

        {/* Covenants Checkbox */}
        <div className="p-4 bg-ivory-100 border border-ivory-300 font-mono text-xs space-y-2">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={proofSubmitted}
              onChange={(e) => setProofSubmitted(e.target.checked)}
              className="mt-0.5 text-teal-700 rounded-none border-ivory-400"
            />
            <span className="text-[11px] text-slate-800 leading-snug">
              I certify that our entity is a bonafide acquirer with deployable equity capital. We covenant to preserve absolute confidentiality regarding all seller records under the Indian Contract Act, 1872.
            </span>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-2 flex items-center justify-between font-mono">
          <button
            type="button"
            onClick={() => router.push("/dashboard/buyer")}
            className="btn-secondary"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn-primary btn-lg"
          >
            <span>Save Mandate Criteria</span>
            <ArrowRight className="w-4 h-4 text-teal-400" />
          </button>
        </div>
      </form>
    </div>
  );
}
