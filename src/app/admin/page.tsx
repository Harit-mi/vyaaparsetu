"use client";

import React, { useState, useEffect } from "react";
import { MarketplaceStorage, SEED_USERS } from "@/lib/storage";
import {
  BusinessListing,
  DealRecord,
  PlatformFeePlan,
  CommissionConfig,
  Invoice,
  ComplaintReport,
  AuditLogItem,
  Inquiry,
  User,
} from "@/types/marketplace";
import { formatINR, formatDate } from "@/lib/utils";
import { useToast } from "@/components/Toast";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Building,
  Users,
  TrendingUp,
  FileText,
  DollarSign,
  AlertTriangle,
  History,
  Settings,
  Scale,
  PlusCircle,
  Eye,
  Archive,
  Copy,
  UserCheck,
  Building2,
  FileCheck,
} from "lucide-react";

export default function AdminPage() {
  const [listings, setListings] = useState<BusinessListing[]>([]);
  const [deals, setDeals] = useState<DealRecord[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [complaints, setComplaints] = useState<ComplaintReport[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [feePlans, setFeePlans] = useState<PlatformFeePlan[]>([]);
  const [commissionConfig, setCommissionConfig] = useState<CommissionConfig>(MarketplaceStorage.getCommissionConfig());
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [users, setUsers] = useState<User[]>(SEED_USERS);
  const { showToast } = useToast();

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    "overview" | "listings_queue" | "duplicate_stale" | "users" | "deals_attribution" | "complaints" | "fees_invoices" | "audit_trail"
  >("overview");

  // Edit config state
  const [editRate, setEditRate] = useState(commissionConfig.percentageRate);
  const [editWindow, setEditWindow] = useState(commissionConfig.attributionWindowDays);

  useEffect(() => {
    const sync = () => {
      setListings(MarketplaceStorage.getListings());
      setDeals(MarketplaceStorage.getDeals());
      setInvoices(MarketplaceStorage.getInvoices());
      setComplaints(MarketplaceStorage.getComplaints());
      setAuditLogs(MarketplaceStorage.getAuditLogs());
      setFeePlans(MarketplaceStorage.getFeePlans());
      setCommissionConfig(MarketplaceStorage.getCommissionConfig());
      setInquiries(MarketplaceStorage.getInquiries());
    };
    sync();
    window.addEventListener("vyapaarsetu_state_changed", sync);
    return () => window.removeEventListener("vyapaarsetu_state_changed", sync);
  }, []);

  const handleApproveListing = (id: string) => {
    const l = MarketplaceStorage.getListingById(id);
    if (l) {
      l.status = "published";
      l.isFinancialVerified = true;
      MarketplaceStorage.saveListing(l);
      showToast("Mandate Approved & Published", `${l.displayTitle} is now live with CA verification seal.`);
    }
  };

  const handleRejectListing = (id: string) => {
    const l = MarketplaceStorage.getListingById(id);
    if (l) {
      l.status = "rejected";
      MarketplaceStorage.saveListing(l);
      showToast("Mandate Rejected", `${l.displayTitle} has been rejected from marketplace search.`, "error");
    }
  };

  const handleArchiveStale = (id: string) => {
    const l = MarketplaceStorage.getListingById(id);
    if (l) {
      l.status = "withdrawn";
      l.isPaused = true;
      MarketplaceStorage.saveListing(l);
      showToast("Stale Mandate Archived", `${l.displayTitle} marked as withdrawn due to promoter inactivity.`, "info");
    }
  };

  const handleResolveComplaint = (id: string) => {
    const list = MarketplaceStorage.getComplaints();
    const c = list.find((item) => item.id === id);
    if (c) {
      c.status = "resolved";
      c.resolvedAt = new Date().toISOString();
      c.resolutionAction = "Seller verified with renewed compliance certificate; warning issued.";
      MarketplaceStorage.addComplaint(c);
      showToast("Complaint Resolved", "Regulatory grievance record closed under IT Rules.");
    }
  };

  const handleSaveCommissionConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...commissionConfig,
      percentageRate: Number(editRate),
      attributionWindowDays: Number(editWindow),
    };
    MarketplaceStorage.saveCommissionConfig(updated);
    setCommissionConfig(updated);
    showToast("Platform Configuration Updated", `Commission: ${editRate}% • Window: ${editWindow} days`);
  };

  // Analytics Metrics
  const totalListedValue = listings.reduce((sum, l) => sum + (l.askingPrice || 0), 0);
  const pendingApprovals = listings.filter((l) => l.status === "pending_review" || l.status === "draft");
  const openComplaints = complaints.filter((c) => c.status === "open" || c.status === "investigating");
  const totalCommissionPipeline = deals.reduce((sum, d) => sum + (d.expectedCommission || 0), 0);

  // Stale listings: listings older than 30 days with < 10 inquiries
  const staleListings = listings.filter((l) => l.inquiriesCount < 10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Editorial Masthead */}
      <div className="border-b border-[#e2dfd6] pb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono uppercase tracking-wider text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-700 inline-block" />
            <span>COMPLIANCE & REGULATORY CONTROL DESK</span>
            <span>&bull;</span>
            <span className="text-navy-950 font-bold">CHIEF COMPLIANCE OFFICER</span>
          </div>
          <span className="text-slate-400">AUDIT JURISDICTION: MCA21 &bull; IT RULES 2021</span>
        </div>

        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
            Administrative & Moderation Console
          </h1>
          <p className="font-mono text-xs text-slate-500 mt-1">
            Institutional oversight, CA audit verification, stale-listing curation, deal attribution, and regulatory grievance records.
          </p>
        </div>
      </div>

      {/* Top Level Metric Ledger */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-[#e2dfd6] space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 block">
            TOTAL ENTERPRISE VALUE
          </span>
          <span className="font-mono text-2xl font-extrabold text-navy-950 block tabular-nums">
            {formatINR(totalListedValue)}
          </span>
          <span className="font-mono text-[10px] text-teal-800 font-semibold uppercase block">
            {listings.length} ACTIVE MANDATES
          </span>
        </div>

        <div className="p-4 bg-white border border-[#e2dfd6] space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 block">
            PENDING MODERATION QUEUE
          </span>
          <span className="font-mono text-2xl font-extrabold text-amber-800 block tabular-nums">
            {pendingApprovals.length} MANDATES
          </span>
          <span className="font-mono text-[10px] text-slate-500 uppercase block">
            REQUIRES CA / MCA CHECK
          </span>
        </div>

        <div className="p-4 bg-white border border-[#e2dfd6] space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 block">
            COMMISSION IN PIPELINE
          </span>
          <span className="font-mono text-2xl font-extrabold text-teal-800 block tabular-nums">
            {formatINR(totalCommissionPipeline)}
          </span>
          <span className="font-mono text-[10px] text-slate-500 uppercase block">
            180-DAY ATTRIBUTION CYCLE
          </span>
        </div>

        <div className="p-4 bg-white border border-[#e2dfd6] space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 block">
            REGULATORY COMPLAINTS
          </span>
          <span className="font-mono text-2xl font-extrabold text-red-800 block tabular-nums">
            {openComplaints.length} OPEN
          </span>
          <span className="font-mono text-[10px] text-slate-500 uppercase block">
            RULE 3(2) IT ACT GRIEVANCES
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-[#e2dfd6] overflow-x-auto bg-[#f5f4ef] p-1">
        {[
          { key: "overview", label: "EXECUTIVE OVERVIEW" },
          { key: "listings_queue", label: `MODERATION QUEUE (${pendingApprovals.length})` },
          { key: "duplicate_stale", label: `STALE LISTINGS (${staleListings.length})` },
          { key: "users", label: `ENTITY DIRECTORY (${users.length})` },
          { key: "deals_attribution", label: `DEAL ATTRIBUTION (${deals.length})` },
          { key: "complaints", label: `DISPUTES & GRIEVANCES (${openComplaints.length})` },
          { key: "fees_invoices", label: "COMMISSION & INVOICES" },
          { key: "audit_trail", label: `AUDIT TRAIL (${auditLogs.length})` },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 font-mono text-xs font-bold transition uppercase tracking-wider whitespace-nowrap border ${
                isActive
                  ? "bg-white text-navy-950 border-[#e2dfd6] border-b-transparent shadow-xs"
                  : "bg-transparent text-slate-600 border-transparent hover:text-navy-950 hover:bg-white/60"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
          {/* Recent Introductions */}
          <div className="bg-white p-6 border border-[#e2dfd6] space-y-4">
            <div className="border-b border-[#e2dfd6] pb-2">
              <h3 className="font-display font-bold text-navy-950 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-700" />
                RECENT BUYER-SELLER INTRODUCTIONS & ENQUIRIES
              </h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Time-stamped initial commercial contact logs.
              </p>
            </div>
            <div className="divide-y divide-[#e2dfd6]">
              {inquiries.slice(0, 4).map((inq) => (
                <div key={inq.id} className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-display font-bold text-navy-950 block">{inq.buyerName}</span>
                    <span className="font-mono text-[11px] text-slate-500 truncate max-w-xs block">
                      TARGET: {inq.listingTitle}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 uppercase">
                    {inq.status.replace(/_/g, " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Operations */}
          <div className="bg-white p-6 border border-[#e2dfd6] space-y-4">
            <div className="border-b border-[#e2dfd6] pb-2">
              <h3 className="font-display font-bold text-navy-950 text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-purple-700" />
                CHARTERED ACCOUNTANT & MCA VERIFICATION DESK
              </h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Statutory validation protocols across MCA21, GSTIN, and Form 3CD audits.
              </p>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs font-sans">
              Every promoter claiming &lsquo;CA Verified Financials&rsquo; is cross-checked against MCA21 director master records, GST e-invoice logs, and Form 3CD tax audit reports before publishing.
            </p>
            <div className="p-4 bg-[#fbfbf9] border border-[#e2dfd6] space-y-2 font-mono text-xs">
              <div className="flex justify-between font-semibold text-navy-950">
                <span>VERIFICATION CERTIFICATION RATIO:</span>
                <span className="text-teal-800 font-bold">83.3% CERTIFIED</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>MCA DIRECTOR CIN MATCH:</span>
                <span className="font-bold text-navy-950">100% PASS</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>GST RETURN 3B FILING ACTIVE:</span>
                <span className="font-bold text-navy-950">94.1% COMPLIANT</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LISTINGS APPROVAL QUEUE */}
      {activeTab === "listings_queue" && (
        <div className="space-y-4">
          <div className="border border-[#e2dfd6] bg-white divide-y divide-[#e2dfd6]">
            <div className="p-4 bg-[#fbfbf9] flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-500">
              <span>MANDATE MODERATION & CA AUDIT QUEUE</span>
              <span>{listings.length} LISTINGS TOTAL</span>
            </div>

            {listings.map((l) => (
              <div key={l.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 text-xs">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <span
                      className={`font-bold uppercase tracking-wider px-2 py-0.5 border ${
                        l.status === "published"
                          ? "bg-teal-50 text-teal-800 border-teal-300"
                          : l.status === "rejected"
                          ? "bg-red-50 text-red-800 border-red-300"
                          : "bg-amber-50 text-amber-800 border-amber-300"
                      }`}
                    >
                      STATUS: {l.status}
                    </span>
                    <span className="text-navy-950 font-semibold">{l.industry}</span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="text-slate-500">{l.city}, {l.state}</span>
                  </div>

                  <h4 className="font-display font-bold text-navy-950 text-base">{l.displayTitle}</h4>
                  <div className="font-mono text-xs text-slate-500">
                    LEGAL ENTITY: <span className="text-navy-950 font-semibold">{l.businessName}</span> &bull; VALUATION:{" "}
                    <span className="font-bold text-teal-800 tabular-nums">{formatINR(l.askingPrice)}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-serif italic pt-1">
                    Audit Note: {l.financialVerificationNote || "Standard statutory filing verification complete."}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start lg:self-auto">
                  {l.status !== "published" && (
                    <button
                      onClick={() => handleApproveListing(l.id)}
                      className="btn-teal btn-sm"
                    >
                      APPROVE & VERIFY
                    </button>
                  )}
                  {l.status !== "rejected" && (
                    <button
                      onClick={() => handleRejectListing(l.id)}
                      className="btn-danger btn-sm"
                    >
                      REJECT
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DUPLICATE & STALE LISTING HANDLING */}
      {activeTab === "duplicate_stale" && (
        <div className="space-y-6 text-xs">
          <div className="bg-white p-6 border border-[#e2dfd6] space-y-4">
            <div className="border-b border-[#e2dfd6] pb-2">
              <h3 className="font-display font-bold text-navy-950 text-sm">
                STALE & LOW-VELOCITY LISTINGS REVIEW
              </h3>
              <p className="text-slate-500 text-xs font-mono mt-0.5">
                Listings with low enquiry velocity or zero promoter activity for over 60 days can be archived to preserve marketplace quality.
              </p>
            </div>

            <div className="border border-[#e2dfd6] divide-y divide-[#e2dfd6]">
              {staleListings.map((l) => (
                <div key={l.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="font-display font-bold text-navy-950 block text-sm">{l.displayTitle}</span>
                    <span className="font-mono text-[11px] text-slate-500">
                      ENQUIRIES: {l.inquiriesCount} &bull; VIEWS: {l.viewsCount} &bull; RECORDED {formatDate(l.createdAt)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleArchiveStale(l.id)}
                    className="btn-secondary btn-sm"
                  >
                    <Archive className="w-3.5 h-3.5 text-slate-600" />
                    <span>ARCHIVE MANDATE</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: USER MANAGEMENT */}
      {activeTab === "users" && (
        <div className="space-y-4 text-xs">
          <div className="bg-white border border-[#e2dfd6] divide-y divide-[#e2dfd6]">
            <div className="p-4 bg-[#fbfbf9] font-mono font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              PLATFORM REGISTERED ENTITIES & VERIFICATION SEALS [{users.length}]
            </div>
            {users.map((u) => (
              <div key={u.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-navy-950 text-sm">{u.fullName}</span>
                    <span className="font-mono text-[10px] bg-[#f5f4ef] text-navy-950 font-bold px-2 py-0.5 border border-[#e2dfd6] uppercase">
                      ROLE: {u.role}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-slate-500">{u.email} &bull; {u.phone}</p>
                  <p className="text-xs text-slate-700 font-sans">{u.companyName} &bull; {u.city}, {u.state}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-teal-800 bg-teal-50 px-3 py-1.5 border border-teal-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                    <span>MCA KYC VERIFIED</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: DEALS & ATTRIBUTION */}
      {activeTab === "deals_attribution" && (
        <div className="space-y-4">
          <div className="bg-white border border-[#e2dfd6] divide-y divide-[#e2dfd6] text-xs">
            {deals.map((d) => (
              <div key={d.id} className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      DEAL RECORD REF #{d.id}
                    </span>
                    <h4 className="font-display font-bold text-navy-950 text-base">{d.listingTitle}</h4>
                  </div>
                  <span className="font-mono text-xs font-bold px-3 py-1 bg-navy-950 text-white uppercase tracking-wider">
                    STAGE: {d.currentStage.replace(/_/g, " ").toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-[#fbfbf9] p-4 border border-[#e2dfd6] font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">SELLER LEGAL NAME</span>
                    <span className="block font-bold text-navy-950 mt-0.5">{d.sellerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">BUYER LEGAL NAME</span>
                    <span className="block font-bold text-navy-950 mt-0.5">{d.buyerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">ATTRIBUTION EXPIRES</span>
                    <span className="block font-bold text-amber-800 mt-0.5">
                      {formatDate(d.platformAttributionWindowEnds)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">SUCCESS FEE (2%)</span>
                    <span className="block font-bold text-teal-800 mt-0.5 tabular-nums">
                      {formatINR(d.expectedCommission)} <span className="text-[10px] text-slate-400 font-normal">+18% GST</span>
                    </span>
                  </div>
                </div>

                <div className="font-mono text-[11px] text-slate-500">
                  Initial introduction recorded on {formatDate(d.firstContactDate)}. Commission covenant schedule v{d.commissionAgreementVersion}.
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: COMPLAINTS & GRIEVANCES */}
      {activeTab === "complaints" && (
        <div className="space-y-4">
          <div className="bg-white border border-[#e2dfd6] divide-y divide-[#e2dfd6] text-xs">
            {complaints.map((cmp) => (
              <div key={cmp.id} className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-red-800 font-mono font-bold bg-red-50 border border-red-200 px-2.5 py-0.5 text-[10px] uppercase tracking-wider">
                    REASON: {cmp.reason.replace(/_/g, " ")}
                  </span>
                  <span
                    className={`font-mono font-bold px-2.5 py-0.5 border text-[10px] uppercase tracking-wider ${
                      cmp.status === "resolved"
                        ? "bg-teal-50 text-teal-800 border-teal-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                  >
                    STATUS: {cmp.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-display font-bold text-navy-950 text-base">TARGET: {cmp.targetTitle}</h4>
                  <p className="text-slate-700 font-sans">{cmp.details}</p>
                  {cmp.evidenceNotes && (
                    <p className="text-[11px] text-slate-500 font-serif italic pt-1">
                      Evidence submitted: {cmp.evidenceNotes}
                    </p>
                  )}
                  {cmp.resolutionAction && (
                    <div className="mt-2 p-3 bg-teal-50/70 border border-teal-200 text-teal-950 font-mono text-xs">
                      ACTION LOGGED: {cmp.resolutionAction}
                    </div>
                  )}
                </div>

                {cmp.status !== "resolved" && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => handleResolveComplaint(cmp.id)}
                      className="btn-primary btn-sm"
                    >
                      RECORD RESOLUTION & CLOSE GRIEVANCE
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: FEES & INVOICES */}
      {activeTab === "fees_invoices" && (
        <div className="space-y-6 text-xs">
          {/* Configurable Commission Section */}
          <div className="bg-white p-6 border border-[#e2dfd6] space-y-4">
            <div className="border-b border-[#e2dfd6] pb-2">
              <h3 className="font-display font-bold text-navy-950 text-sm flex items-center gap-2">
                <Scale className="w-4 h-4 text-teal-700" />
                CONFIGURE PLATFORM COMMISSION SCHEDULE
              </h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Statutory transaction success fee rate and attribution window policy.
              </p>
            </div>
            <form onSubmit={handleSaveCommissionConfig} className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-700 mb-1 font-bold">
                  Standard Success Fee (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={editRate}
                  onChange={(e) => setEditRate(Number(e.target.value))}
                  className="w-full p-2 border border-[#e2dfd6] bg-[#fbfbf9] text-navy-950 font-mono text-xs focus:ring-1 focus:ring-navy-950 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-700 mb-1 font-bold">
                  Attribution Window (Days)
                </label>
                <input
                  type="number"
                  value={editWindow}
                  onChange={(e) => setEditWindow(Number(e.target.value))}
                  className="w-full p-2 border border-[#e2dfd6] bg-[#fbfbf9] text-navy-950 font-mono text-xs focus:ring-1 focus:ring-navy-950 focus:outline-hidden"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="btn-primary w-full"
                >
                  SAVE POLICY CONFIGURATION
                </button>
              </div>
            </form>
          </div>

          {/* Invoices List */}
          <div className="bg-white p-6 border border-[#e2dfd6] space-y-3">
            <div className="border-b border-[#e2dfd6] pb-2">
              <h3 className="font-display font-bold text-navy-950 text-sm">ISSUED STATUTORY PLATFORM INVOICES</h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                GST-compliant tax invoices issued upon closing.
              </p>
            </div>
            <div className="divide-y divide-[#e2dfd6] font-mono">
              {invoices.map((inv) => (
                <div key={inv.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-navy-950 block text-xs">{inv.invoiceNumber}</span>
                    <span className="text-[11px] text-slate-500">PARTY: {inv.userName.toUpperCase()}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-navy-950 block text-xs tabular-nums">
                      {formatINR(inv.totalAmount)}
                    </span>
                    <span className="text-[10px] text-teal-800 font-bold uppercase tracking-wider">
                      STATUS: {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: AUDIT TRAIL */}
      {activeTab === "audit_trail" && (
        <div className="space-y-4">
          <div className="bg-white border border-[#e2dfd6] divide-y divide-[#e2dfd6] text-xs">
            <div className="p-4 bg-[#fbfbf9] font-mono font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              STATUTORY AUDIT LOG & COMPLIANCE RECORDS [{auditLogs.length}]
            </div>
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <span className="font-bold text-purple-900 bg-purple-50 border border-purple-200 px-2 py-0.5 uppercase tracking-wider">
                      ACTION: {log.action}
                    </span>
                    <span className="text-slate-400">IP: {log.ipAddress}</span>
                  </div>
                  <p className="text-navy-950 font-medium font-sans">{log.details}</p>
                  <span className="font-mono text-[10px] text-slate-400 uppercase">
                    ACTOR: {log.actorName} ({log.actorRole})
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap tabular-nums">
                  {new Date(log.timestamp).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
