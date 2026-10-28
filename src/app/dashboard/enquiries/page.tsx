"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MarketplaceStorage } from "@/lib/storage";
import { Inquiry, BusinessListing } from "@/types/marketplace";
import { formatINR, formatDate } from "@/lib/utils";
import { useToast } from "@/components/Toast";
import {
  Inbox,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  Filter,
  MessageSquare,
  Building,
  ShieldCheck,
  Search,
  FileText,
  Building2,
} from "lucide-react";

export default function EnquiriesDashboardPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filterType, setFilterType] = useState<"all" | "incoming" | "outgoing">("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const currentUser = MarketplaceStorage.getCurrentUser();
  const { showToast } = useToast();

  useEffect(() => {
    const sync = () => {
      setInquiries(MarketplaceStorage.getInquiries());
    };
    sync();
    window.addEventListener("vyapaarsetu_state_changed", sync);
    return () => window.removeEventListener("vyapaarsetu_state_changed", sync);
  }, []);

  const handleUpdateStatus = (inqId: string, status: Inquiry["status"]) => {
    const list = MarketplaceStorage.getInquiries();
    const item = list.find((i) => i.id === inqId);
    if (item) {
      item.status = status;
      MarketplaceStorage.addInquiry(item);
      showToast("Enquiry Status Updated", `Status changed to ${status.replace(/_/g, " ")}`);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    // Type filter
    if (filterType === "incoming" && inq.sellerId !== currentUser.id && currentUser.role !== "seller" && currentUser.role !== "admin") {
      return false;
    }
    if (filterType === "outgoing" && inq.buyerId !== currentUser.id && currentUser.role !== "buyer") {
      return false;
    }

    // Status filter
    if (filterStatus !== "all" && inq.status !== filterStatus) return false;

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = inq.listingTitle.toLowerCase().includes(q);
      const matchBuyer = inq.buyerName.toLowerCase().includes(q);
      if (!matchTitle && !matchBuyer) return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#e2dfd6] pb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono uppercase tracking-wider text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-navy-900 inline-block" />
            <span>COMMERCIAL ENQUIRY REGISTRY</span>
            <span>&bull;</span>
            <span className="text-navy-950 font-bold">ATTRIBUTION RECORD</span>
          </div>
          <span className="text-slate-400">SECTION 79 IT ACT COMPLIANT ARCHIVE</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
              Enquiry Management Ledger
            </h1>
            <p className="font-mono text-xs text-slate-500 mt-1">
              Track acquisition expressions of interest, screen funding sources, and advance commercial dialogue.
            </p>
          </div>

          <Link
            href="/messages"
            className="btn-primary self-start sm:self-auto"
          >
            <MessageSquare className="w-4 h-4 text-teal-400" />
            <span>OPEN NEGOTIATION ROOMS</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-[#e2dfd6] flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs font-mono">
        {/* Type Toggle */}
        <div className="flex items-center gap-1 bg-[#f5f4ef] p-1 border border-[#e2dfd6]">
          {[
            { key: "all", label: "ALL ENQUIRIES" },
            { key: "incoming", label: "INCOMING LEADS" },
            { key: "outgoing", label: "MY TRANSMISSIONS" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setFilterType(t.key as any)}
              className={`px-3 py-1.5 uppercase tracking-wider text-xs font-bold transition ${
                filterType === t.key
                  ? "bg-white text-navy-950 border border-[#e2dfd6] shadow-xs"
                  : "text-slate-600 hover:text-navy-950"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Status Dropdown & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 uppercase text-[10px] tracking-wider font-bold">STATUS:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-1.5 border border-[#e2dfd6] bg-[#fbfbf9] text-navy-950 font-mono text-xs font-semibold focus:ring-1 focus:ring-navy-950 focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="pending_review">Pending Review</option>
              <option value="accepted">Accepted / In Diligence</option>
              <option value="declined">Declined</option>
              <option value="nda_requested">NDA Requested</option>
            </select>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search enquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 border border-[#e2dfd6] bg-[#fbfbf9] text-xs font-sans text-navy-950 placeholder:text-slate-400 focus:ring-1 focus:ring-navy-950 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Enquiries List */}
      <div className="space-y-4">
        {filteredInquiries.length > 0 ? (
          <div className="border border-[#e2dfd6] bg-white divide-y divide-[#e2dfd6]">
            {filteredInquiries.map((inq) => (
              <div key={inq.id} className="p-6 space-y-4 hover:bg-[#fbfbf9]/60 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-mono text-[10px]">
                      <span className="text-slate-400 font-bold uppercase tracking-wider">
                        ENQUIRY REF #{inq.id.toUpperCase()}
                      </span>
                      <span
                        className={`font-bold uppercase tracking-wider px-2 py-0.5 border ${
                          inq.status === "accepted"
                            ? "bg-teal-50 text-teal-800 border-teal-300"
                            : inq.status === "pending_review"
                            ? "bg-amber-50 text-amber-800 border-amber-300"
                            : "bg-slate-100 text-slate-700 border-slate-300"
                        }`}
                      >
                        {inq.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-navy-950 text-base">{inq.listingTitle}</h3>
                  </div>

                  <span className="font-mono text-xs text-slate-400">
                    RECORDED {formatDate(inq.createdAt)}
                  </span>
                </div>

                {/* Acquirer & Target Specs Ledger */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#fbfbf9] p-4 border border-[#e2dfd6] text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      ACQUIRING PARTY
                    </span>
                    <span className="font-bold text-navy-950 mt-0.5 block">{inq.buyerName}</span>
                    <span className="text-[11px] text-slate-500 uppercase">{inq.buyerType.replace(/_/g, " ")}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      INDICATIVE VALUATION
                    </span>
                    <span className="font-bold text-teal-800 mt-0.5 block tabular-nums">
                      {inq.indicativeOfferBudget ? formatINR(inq.indicativeOfferBudget) : "NEGOTIABLE"}
                    </span>
                    <span className="text-[11px] text-slate-500 uppercase">TIMELINE: {inq.timelineMonths} MONTHS</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      CAPITAL ALLOCATION MECHANISM
                    </span>
                    <span className="font-bold text-navy-950 mt-0.5 block uppercase">{inq.intendedFundingSource}</span>
                    <span className="text-[11px] text-slate-500">BILATERAL NDA MANDATE</span>
                  </div>
                </div>

                {/* Message Body */}
                <div className="p-4 bg-white border border-[#e2dfd6] text-slate-700 font-serif italic text-xs leading-relaxed">
                  &ldquo;{inq.message}&rdquo;
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    {inq.status !== "accepted" && (
                      <button
                        onClick={() => handleUpdateStatus(inq.id, "accepted")}
                        className="btn-teal btn-sm"
                      >
                        ACCEPT & QUALIFY
                      </button>
                    )}
                    {inq.status !== "declined" && (
                      <button
                        onClick={() => handleUpdateStatus(inq.id, "declined")}
                        className="btn-secondary btn-sm"
                      >
                        DECLINE LEAD
                      </button>
                    )}
                  </div>

                  <Link
                    href="/messages"
                    className="btn-primary btn-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
                    <span>OPEN NEGOTIATION THREAD</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 border border-[#e2dfd6] text-center space-y-3">
            <div className="w-12 h-12 border border-[#e2dfd6] bg-[#fbfbf9] flex items-center justify-center mx-auto text-slate-400">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-navy-950 text-base">NO ENQUIRIES MATCHING FILTER</h3>
            <p className="text-xs text-slate-500 font-sans max-w-md mx-auto">
              There are no acquisition expressions of interest matching your current filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
