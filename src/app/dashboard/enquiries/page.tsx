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
  ArrowRight,
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
      showToast("Inquiry Status Updated", `Status changed to ${status.replace(/_/g, " ")}`);
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
      <div className="border-b border-slate-200 pb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
            <span className="font-semibold text-slate-700">Inquiry Registry</span>
            <span>•</span>
            <span className="text-slate-500">Attribution Records</span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-blue-700 font-semibold bg-blue-50 px-3 py-1 rounded-full border border-blue-200/80 text-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            Protected Dialogue
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Inquiry Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track acquisition expressions of interest, verify funding sources, and advance deal conversations.
            </p>
          </div>

          <Link
            href="/messages"
            className="btn-brand btn-md self-start sm:self-auto inline-flex items-center gap-2 shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open Negotiation Rooms</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-card flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
        {/* Type Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {[
            { key: "all", label: "All Inquiries" },
            { key: "incoming", label: "Incoming Leads" },
            { key: "outgoing", label: "My Inquiries" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setFilterType(t.key as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterType === t.key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Status Dropdown & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium text-xs">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs font-medium focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="pending_review">Pending Review</option>
              <option value="accepted">Accepted / In Diligence</option>
              <option value="declined">Declined</option>
              <option value="nda_requested">NDA Requested</option>
            </select>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search inquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3.5 py-2 border border-slate-300 rounded-lg bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Enquiries List */}
      <div className="space-y-4">
        {filteredInquiries.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card divide-y divide-slate-100 overflow-hidden">
            {filteredInquiries.map((inq) => (
              <div key={inq.id} className="p-6 space-y-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400 font-medium">
                        Ref #{inq.id}
                      </span>
                      <span
                        className={`font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                          inq.status === "accepted"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : inq.status === "pending_review"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {inq.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">{inq.listingTitle}</h3>
                  </div>

                  <span className="text-xs text-slate-400">
                    Received {formatDate(inq.createdAt)}
                  </span>
                </div>

                {/* Acquirer & Target Specs Card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-xs">
                  <div>
                    <span className="text-slate-400 uppercase tracking-wider text-[11px] font-semibold block">
                      Acquiring Party
                    </span>
                    <span className="font-bold text-slate-900 text-sm mt-0.5 block">{inq.buyerName}</span>
                    <span className="text-slate-500 capitalize">{inq.buyerType.replace(/_/g, " ")}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 uppercase tracking-wider text-[11px] font-semibold block">
                      Indicative Valuation
                    </span>
                    <span className="font-bold text-emerald-700 text-sm mt-0.5 block">
                      {inq.indicativeOfferBudget ? formatINR(inq.indicativeOfferBudget) : "Negotiable"}
                    </span>
                    <span className="text-slate-500">Timeline: {inq.timelineMonths} Months</span>
                  </div>

                  <div>
                    <span className="text-slate-400 uppercase tracking-wider text-[11px] font-semibold block">
                      Funding Source
                    </span>
                    <span className="font-bold text-slate-900 text-sm mt-0.5 block capitalize">{inq.intendedFundingSource}</span>
                    <span className="text-slate-500">Bilateral NDA Required</span>
                  </div>
                </div>

                {/* Message Body */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 text-slate-600 text-xs leading-relaxed">
                  &ldquo;{inq.message}&rdquo;
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    {inq.status !== "accepted" && (
                      <button
                        onClick={() => handleUpdateStatus(inq.id, "accepted")}
                        className="btn-brand btn-sm"
                      >
                        Accept & Qualify
                      </button>
                    )}
                    {inq.status !== "declined" && (
                      <button
                        onClick={() => handleUpdateStatus(inq.id, "declined")}
                        className="btn-secondary btn-sm"
                      >
                        Decline
                      </button>
                    )}
                  </div>

                  <Link
                    href="/messages"
                    className="btn-secondary btn-sm inline-flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    <span>Open Conversation</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3 shadow-card">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">No Inquiries Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              There are no acquisition expressions of interest matching your current filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
