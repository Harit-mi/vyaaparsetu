"use client";

import React, { useState } from "react";
import { DealRecord, DealStage } from "@/types/marketplace";
import { MarketplaceStorage } from "@/lib/storage";
import { formatINR, formatDate } from "@/lib/utils";
import {
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileCheck,
  Building,
  Shield,
  ArrowRight,
  TrendingUp,
  FileSignature,
  Building2,
  Check,
} from "lucide-react";

interface DealPipelineViewProps {
  deal: DealRecord;
  onUpdate?: () => void;
}

const STAGES: { key: DealStage; label: string; desc: string; num: string }[] = [
  { key: "inquiry_received", label: "Inquiry Received", desc: "First introduction logged", num: "01" },
  { key: "seller_reviewing", label: "Seller Reviewing", desc: "Evaluating buyer credentials", num: "02" },
  { key: "buyer_qualified", label: "Buyer Qualified", desc: "Proof of funds & identity verified", num: "03" },
  { key: "initial_conversation", label: "Introductory Call", desc: "Direct commercial discussion", num: "04" },
  { key: "nda_step", label: "NDA Executed", desc: "Bilateral confidentiality covenant active", num: "05" },
  { key: "information_shared", label: "Data Room Shared", desc: "Audited financials & schedules", num: "06" },
  { key: "due_diligence", label: "Confirmatory Diligence", desc: "Legal, tax & technical diligence", num: "07" },
  { key: "loi_or_offer", label: "LOI / Term Sheet", desc: "Non-binding acquisition term sheet", num: "08" },
  { key: "negotiation", label: "Commercial Negotiation", desc: "Reps & warranties drafting", num: "09" },
  { key: "definitive_agreements", label: "Definitive Agreement", desc: "Share Purchase / BTA execution", num: "10" },
  { key: "closed_successfully", label: "Deal Closed", desc: "Funds transferred & MCA filings verified", num: "11" },
];

export function DealPipelineView({ deal, onUpdate }: DealPipelineViewProps) {
  const [selectedStage, setSelectedStage] = useState<DealStage>(deal.currentStage);
  const [stageNotes, setStageNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const currentUser = MarketplaceStorage.getCurrentUser();

  const currentIdx = STAGES.findIndex((s) => s.key === deal.currentStage);

  const handleStageChange = () => {
    setIsUpdating(true);
    MarketplaceStorage.updateDealStage(
      deal.id,
      selectedStage,
      stageNotes || `Advanced to ${selectedStage.replace("_", " ")} by ${currentUser.fullName}`
    );
    setIsUpdating(false);
    setStageNotes("");
    if (onUpdate) onUpdate();
  };

  // Attribution days remaining
  const attributionEnd = new Date(deal.platformAttributionWindowEnds).getTime();
  const now = new Date().getTime();
  const daysRemaining = Math.max(0, Math.ceil((attributionEnd - now) / (1000 * 60 * 60 * 24)));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
      {/* Top Header */}
      <div className="p-6 bg-slate-900 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-blue-300 bg-blue-900/60 border border-blue-700/60 px-2.5 py-0.5 rounded-full">
              Deal Ref #{deal.id}
            </span>
            <span className="text-xs font-semibold text-amber-300 bg-amber-900/60 border border-amber-700/60 px-2.5 py-0.5 rounded-full">
              Stage {currentIdx + 1} of 11 Active
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {deal.listingTitle}
          </h3>
          <p className="text-xs text-slate-300">
            Seller: <span className="text-white font-semibold">{deal.sellerName}</span> &nbsp;|&nbsp; Buyer:{" "}
            <span className="text-white font-semibold">{deal.buyerName}</span>
          </p>
        </div>

        {/* Attribution & Success Fee */}
        <div className="flex flex-wrap items-stretch gap-4 bg-slate-800/90 rounded-xl border border-slate-700/80 p-3.5 text-xs">
          <div className="pr-4 border-r border-slate-700">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
              Attribution Window
            </span>
            <div className="font-bold text-white flex items-center gap-1.5 mt-1 text-sm">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{daysRemaining} Days Remaining</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">180-Day Protected Window</span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
              Platform Success Fee (2.0%)
            </span>
            <span className="text-base font-bold text-emerald-400 block mt-0.5">
              {formatINR(deal.expectedCommission)}
            </span>
            <span className="text-[10px] text-slate-400 block">+18% GST upon closing</span>
          </div>
        </div>
      </div>

      {/* 11-Stage Horizontal Stepper */}
      <div className="p-6 overflow-x-auto border-b border-slate-200 bg-slate-50/50">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Acquisition Milestones & Progress
        </div>
        <div className="flex items-start justify-between min-w-[840px] relative pt-2">
          {/* Background Line */}
          <div className="absolute top-5 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

          {STAGES.map((s, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div key={s.key} className="flex flex-col items-center relative z-10 w-24 text-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border ${
                    isCompleted
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : isCurrent
                      ? "bg-blue-600 text-white border-blue-600 ring-4 ring-blue-100"
                      : "bg-white text-slate-400 border-slate-300"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span
                  className={`text-[11px] font-semibold mt-2 line-clamp-1 ${
                    isCurrent ? "text-blue-600 font-bold" : isCompleted ? "text-slate-800" : "text-slate-400"
                  }`}
                >
                  {s.label}
                </span>
                <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{s.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage Action & History */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs bg-white">
        {/* Left: Stage Advancer Controls */}
        <div className="space-y-4 border-r border-slate-200 pr-0 md:pr-6">
          <div className="border-b border-slate-100 pb-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Advance Deal Milestone
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Update current deal milestone to notify transaction counsel and counterparties.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Milestone Stage
              </label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value as DealStage)}
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              >
                {STAGES.map((s) => (
                  <option key={s.key} value={s.key}>
                    Stage {s.num}: {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Milestone Notes / Memo
              </label>
              <textarea
                rows={3}
                value={stageNotes}
                onChange={(e) => setStageNotes(e.target.value)}
                placeholder="E.g., Virtual data room folder 4 (tax audits) shared; physical plant visit conducted with promoters."
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <button
              onClick={handleStageChange}
              disabled={isUpdating}
              className="btn-brand w-full"
            >
              {isUpdating ? "Recording Milestone..." : "Confirm & Advance Milestone"}
            </button>
          </div>
        </div>

        {/* Right: Milestone Audit Trail */}
        <div className="space-y-3">
          <div className="border-b border-slate-100 pb-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-indigo-600" />
              Milestone Audit Trail
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Time-stamped audit records maintained for deal attribution.
            </p>
          </div>

          <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1">
            {(deal.stageHistory || []).map((h, i) => (
              <div key={i} className="py-2.5 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900 capitalize">
                    {h.stage.replace(/_/g, " ")}
                  </span>
                  <span className="text-[11px] text-slate-400">{formatDate(h.timestamp)}</span>
                </div>
                {h.notes && <p className="text-slate-600 text-xs leading-relaxed">{h.notes}</p>}
                <div className="text-[10px] text-slate-400">Recorded by: {h.updatedBy}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
