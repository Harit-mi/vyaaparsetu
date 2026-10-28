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
    <div className="bg-white border border-[#e2dfd6] shadow-xs overflow-hidden">
      {/* Top Ledger Header */}
      <div className="p-6 bg-navy-950 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-navy-800">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-teal-400 bg-teal-950/80 border border-teal-800/80 px-2 py-0.5">
              PROTOCOL REF #{deal.id}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-amber-300 bg-amber-950/80 border border-amber-800/80 px-2 py-0.5">
              STAGE {currentIdx + 1} OF 11 ACTIVE
            </span>
          </div>
          <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
            {deal.listingTitle}
          </h3>
          <p className="font-mono text-xs text-slate-300">
            SELLER: <span className="text-white font-semibold">{deal.sellerName}</span> &nbsp;|&nbsp; BUYER:{" "}
            <span className="text-white font-semibold">{deal.buyerName}</span>
          </p>
        </div>

        {/* Attribution & Success Fee Ledger Strip */}
        <div className="flex flex-wrap items-stretch gap-4 bg-navy-900/90 border border-navy-800 p-3.5 text-xs">
          <div className="pr-4 border-r border-navy-800">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">
              ATTRIBUTION WINDOW
            </span>
            <div className="font-mono font-bold text-white flex items-center gap-1.5 mt-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{daysRemaining} DAYS REMAINING</span>
            </div>
            <span className="font-mono text-[10px] text-slate-400 block mt-0.5">180-Day Protected Cycle</span>
          </div>

          <div>
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">
              PLATFORM SUCCESS FEE (2.0%)
            </span>
            <span className="font-mono text-base font-bold text-teal-400 block mt-0.5 tabular-nums">
              {formatINR(deal.expectedCommission)}
            </span>
            <span className="font-mono text-[10px] text-slate-400 block">+18% Statutory GST upon closing</span>
          </div>
        </div>
      </div>

      {/* 11-Stage Horizontal Stepper */}
      <div className="p-6 overflow-x-auto border-b border-[#e2dfd6] bg-[#fbfbf9]">
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-3">
          STATUTORY ACQUISITION MILESTONES — CHRONOLOGICAL RECORD
        </div>
        <div className="flex items-start justify-between min-w-[840px] relative pt-2">
          {/* Background Connecting Line */}
          <div className="absolute top-5 left-6 right-6 h-px bg-[#e2dfd6] -z-0" />

          {STAGES.map((s, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div key={s.key} className="flex flex-col items-center relative z-10 w-24 text-center">
                <div
                  className={`w-7 h-7 flex items-center justify-center font-mono text-[11px] font-bold transition-all border ${
                    isCompleted
                      ? "bg-teal-700 text-white border-teal-700"
                      : isCurrent
                      ? "bg-navy-950 text-white border-navy-950 ring-2 ring-bronze-500"
                      : "bg-white text-slate-400 border-slate-300"
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <span
                  className={`text-[10px] font-bold mt-2 uppercase tracking-wide line-clamp-1 ${
                    isCurrent ? "text-navy-950 font-extrabold" : isCompleted ? "text-teal-900" : "text-slate-400"
                  }`}
                >
                  {s.label}
                </span>
                <span className="text-[9px] text-slate-500 line-clamp-1 mt-0.5">{s.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage Action & History Ledger */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs bg-white">
        {/* Left: Stage Advancer Controls */}
        <div className="space-y-4 border-r border-[#e2dfd6] pr-0 md:pr-6">
          <div className="border-b border-[#e2dfd6] pb-2">
            <h4 className="font-display font-bold text-navy-950 text-sm flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-teal-700" />
              ADVANCE ACQUISITION PROTOCOL
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Update current deal milestone to notify transaction counsel and both counterparties.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-700 mb-1">
                Target Milestone Stage
              </label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value as DealStage)}
                className="w-full p-2.5 border border-[#e2dfd6] bg-[#fbfbf9] text-navy-950 font-mono text-xs focus:ring-1 focus:ring-navy-950 focus:outline-hidden"
              >
                {STAGES.map((s) => (
                  <option key={s.key} value={s.key}>
                    Stage {s.num}: {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-700 mb-1">
                Substantiating Audit Memo / Note
              </label>
              <textarea
                rows={3}
                value={stageNotes}
                onChange={(e) => setStageNotes(e.target.value)}
                placeholder="E.g., Virtual data room folder 4 (tax audits) shared; physical plant visit conducted with promoters."
                className="w-full p-2.5 border border-[#e2dfd6] bg-[#fbfbf9] text-xs text-navy-950 placeholder:text-slate-400 focus:ring-1 focus:ring-navy-950 focus:outline-hidden font-sans"
              />
            </div>

            <button
              onClick={handleStageChange}
              disabled={isUpdating}
              className="btn-primary w-full"
            >
              {isUpdating ? "Recording Protocol Entry..." : "Confirm & Commit Milestone Stage"}
            </button>
          </div>
        </div>

        {/* Right: Milestone Audit Trail */}
        <div className="space-y-3">
          <div className="border-b border-[#e2dfd6] pb-2">
            <h4 className="font-display font-bold text-navy-950 text-sm flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-bronze-600" />
              MILESTONE EVENT LOG & AUDIT TRAIL
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Time-stamped audit records maintained for legal deal attribution.
            </p>
          </div>

          <div className="divide-y divide-[#e2dfd6] max-h-64 overflow-y-auto pr-1">
            {(deal.stageHistory || []).map((h, i) => (
              <div key={i} className="py-2.5 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono font-bold text-navy-950 uppercase">
                    {h.stage.replace(/_/g, " ")}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">{formatDate(h.timestamp)}</span>
                </div>
                {h.notes && <p className="text-slate-600 text-xs font-serif italic">{h.notes}</p>}
                <div className="text-[10px] font-mono text-slate-400">Recorded by: {h.updatedBy}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
