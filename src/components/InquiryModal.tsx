"use client";

import React, { useState } from "react";
import { BusinessListing, Inquiry, BuyerType } from "@/types/marketplace";
import { MarketplaceStorage } from "@/lib/storage";
import { formatINR } from "@/lib/utils";
import { Send, X, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";

interface InquiryModalProps {
  listing: BusinessListing;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (inquiry: Inquiry) => void;
}

export function InquiryModal({ listing, isOpen, onClose, onSuccess }: InquiryModalProps) {
  const currentUser = MarketplaceStorage.getCurrentUser();
  const [buyerType, setBuyerType] = useState<BuyerType>("family_office");
  const [fundingSource, setFundingSource] = useState("Direct Liquid Reserves (Self-Funded)");
  const [offerBudget, setOfferBudget] = useState(listing.askingPrice);
  const [timelineMonths, setTimelineMonths] = useState(3);
  const [message, setMessage] = useState(
    `We have reviewed the listing teaser for ${listing.displayTitle}. We are actively investing in ${listing.industry} and would like to review detailed historical MIS and discuss acquisition terms with the promoter.`
  );
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      const newInquiry: Inquiry = {
        id: `inq-${Date.now()}`,
        listingId: listing.id,
        listingTitle: listing.displayTitle,
        sellerId: listing.sellerId,
        buyerId: currentUser.id,
        buyerName: currentUser.fullName,
        buyerEmail: currentUser.email,
        buyerPhone: currentUser.phone,
        buyerType: buyerType,
        message: message,
        intendedFundingSource: fundingSource,
        indicativeOfferBudget: Number(offerBudget),
        timelineMonths: Number(timelineMonths),
        status: "pending_review",
        createdAt: new Date().toISOString(),
      };

      MarketplaceStorage.addInquiry(newInquiry);
      setSubmitting(false);
      onSuccess(newInquiry);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-[2px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-navy-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Direct Seller Acquisition Inquiry</h3>
            <p className="text-xs text-slate-300">Target: {listing.displayTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Buyer Credential Summary */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-[2px] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Inquirer Credentials</span>
              <span className="font-bold text-slate-900 text-sm">{currentUser.fullName}</span>
              <span className="text-slate-500 block text-[11px]">{currentUser.email} • {currentUser.phone}</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Inquirer
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Acquirer Type
              </label>
              <select
                value={buyerType}
                onChange={(e) => setBuyerType(e.target.value as BuyerType)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="family_office">Family Office / Private Equity</option>
                <option value="corporate">Corporate Strategic Acquirer</option>
                <option value="individual">Individual Entrepreneur</option>
                <option value="search_fund">Search Fund / Operator</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Intended Funding Source
              </label>
              <select
                value={fundingSource}
                onChange={(e) => setFundingSource(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="Direct Liquid Reserves (Self-Funded)">Direct Liquid Reserves (Self-Funded)</option>
                <option value="Private Equity Syndicate">Private Equity Syndicate</option>
                <option value="Bank Debt & Term Loan Facility">Bank Debt & Term Loan Facility</option>
                <option value="Internal Corporate Cash Flow">Internal Corporate Cash Flow</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Indicative Budget / Target Valuation (₹)
              </label>
              <input
                type="number"
                required
                value={offerBudget}
                onChange={(e) => setOfferBudget(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Formatted: {formatINR(offerBudget)}
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Target Close Timeline
              </label>
              <select
                value={timelineMonths}
                onChange={(e) => setTimelineMonths(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="1">Within 30 Days (Fast Track)</option>
                <option value="2">60 Days (Standard Commercial)</option>
                <option value="3">90 Days (Confirmatory Diligence)</option>
                <option value="6">180 Days (Long-term Strategic)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Introduction & Acquisition Interest Statement
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden leading-relaxed"
              placeholder="State your background, investment rationale, and next steps..."
            />
          </div>

          {/* Platform Attribution Notice */}
          <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-[2px] text-[11px] text-amber-900 leading-snug">
            <span className="font-bold">Deal Attribution Protocol:</span> Submitting this inquiry creates a formal recorded platform introduction. Any subsequent transaction resulting within 180 days is subject to the accepted marketplace commission schedule.
          </div>

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 font-mono">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary btn-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-teal btn-sm"
            >
              <Send className="w-3.5 h-3.5 text-teal-300" />
              <span>{submitting ? "Registering Inquiry..." : "Transmit Inquiry to Seller"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
