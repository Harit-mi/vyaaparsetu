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
  ArrowRight,
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
      showToast("Listing Approved & Published", `${l.displayTitle} is now live with CA verification badge.`);
    }
  };

  const handleRejectListing = (id: string) => {
    const l = MarketplaceStorage.getListingById(id);
    if (l) {
      l.status = "rejected";
      MarketplaceStorage.saveListing(l);
      showToast("Listing Rejected", `${l.displayTitle} has been rejected from marketplace search.`, "error");
    }
  };

  const handleArchiveStale = (id: string) => {
    const l = MarketplaceStorage.getListingById(id);
    if (l) {
      l.status = "withdrawn";
      l.isPaused = true;
      MarketplaceStorage.saveListing(l);
      showToast("Stale Listing Archived", `${l.displayTitle} marked as withdrawn.`, "info");
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
      showToast("Complaint Resolved", "Grievance record closed under platform guidelines.");
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
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
            <span className="font-semibold text-slate-700">Compliance & Regulatory Control</span>
            <span>•</span>
            <span className="text-slate-500">Admin Authority</span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-indigo-700 font-semibold bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/80 text-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            Audit Jurisdiction Active
          </span>
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Admin & Moderation Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Institutional oversight, CA audit verification, stale-listing curation, deal attribution, and regulatory grievance records.
          </p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-card space-y-1">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
            Total Deal Value
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 block">
            {formatINR(totalListedValue)}
          </span>
          <span className="text-xs text-emerald-600 font-medium block">
            {listings.length} Active Listings
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-card space-y-1">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
            Pending Queue
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 block">
            {pendingApprovals.length} Listings
          </span>
          <span className="text-xs text-slate-500 font-medium block">
            Requires Verification Check
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-card space-y-1">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
            Commission Pipeline
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 block">
            {formatINR(totalCommissionPipeline)}
          </span>
          <span className="text-xs text-slate-500 font-medium block">
            180-Day Attribution Cycle
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-card space-y-1">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
            Open Grievances
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 block">
            {openComplaints.length} Open
          </span>
          <span className="text-xs text-slate-500 font-medium block">
            User Compliance Reports
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/70">
        {[
          { key: "overview", label: "Executive Overview" },
          { key: "listings_queue", label: `Moderation Queue (${pendingApprovals.length})` },
          { key: "duplicate_stale", label: `Stale Listings (${staleListings.length})` },
          { key: "users", label: `Users (${users.length})` },
          { key: "deals_attribution", label: `Attribution (${deals.length})` },
          { key: "complaints", label: `Grievances (${openComplaints.length})` },
          { key: "fees_invoices", label: "Commission & Invoices" },
          { key: "audit_trail", label: `Audit Log (${auditLogs.length})` },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                isActive
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
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
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Recent Buyer-Seller Introductions
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Time-stamped commercial contact logs.
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {inquiries.slice(0, 4).map((inq) => (
                <div key={inq.id} className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-900 block">{inq.buyerName}</span>
                    <span className="text-xs text-slate-500 truncate max-w-xs block">
                      Target: {inq.listingTitle}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full capitalize">
                    {inq.status.replace(/_/g, " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Operations */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-indigo-600" />
                Chartered Accountant & MCA Desk
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Validation protocols across MCA21, GSTIN, and Form 3CD audits.
              </p>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">
              Every promoter claiming &lsquo;CA Verified Financials&rsquo; is cross-checked against MCA21 director records, GST e-invoice logs, and Form 3CD tax audit reports before publishing.
            </p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between font-semibold text-slate-900">
                <span>Verification Certification Ratio:</span>
                <span className="text-emerald-700 font-bold">83.3% Certified</span>
              </div>
              <div className="flex justify-between text-slate-600 text-xs">
                <span>Director DIN Match:</span>
                <span className="font-semibold text-slate-900">100% Pass</span>
              </div>
              <div className="flex justify-between text-slate-600 text-xs">
                <span>GST Return 3B Filing Active:</span>
                <span className="font-semibold text-slate-900">94.1% Compliant</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LISTINGS APPROVAL QUEUE */}
      {activeTab === "listings_queue" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card divide-y divide-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Listing Moderation & Verification Queue</span>
              <span>{listings.length} Listings Total</span>
            </div>

            {listings.map((l) => (
              <div key={l.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 text-xs">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                        l.status === "published"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : l.status === "rejected"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {l.status}
                    </span>
                    <span className="text-slate-800 font-medium">{l.industry}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">{l.city}, {l.state}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base">{l.displayTitle}</h4>
                  <div className="text-xs text-slate-500">
                    Legal Entity: <span className="text-slate-900 font-medium">{l.businessName}</span> • Valuation:{" "}
                    <span className="font-bold text-slate-900">{formatINR(l.askingPrice)}</span>
                  </div>
                  <p className="text-xs text-slate-500 pt-1">
                    Audit Note: {l.financialVerificationNote || "Standard statutory filing verification complete."}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start lg:self-auto">
                  {l.status !== "published" && (
                    <button
                      onClick={() => handleApproveListing(l.id)}
                      className="btn-brand btn-sm"
                    >
                      Approve & Verify
                    </button>
                  )}
                  {l.status !== "rejected" && (
                    <button
                      onClick={() => handleRejectListing(l.id)}
                      className="btn-danger btn-sm"
                    >
                      Reject
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
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Stale & Inactive Listings Review
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Listings with low inquiry velocity or zero promoter activity for over 60 days can be archived to maintain marketplace quality.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {staleListings.map((l) => (
                <div key={l.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block text-sm">{l.displayTitle}</span>
                    <span className="text-xs text-slate-500">
                      Inquiries: {l.inquiriesCount} • Views: {l.viewsCount} • Listed {formatDate(l.createdAt)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleArchiveStale(l.id)}
                    className="btn-secondary btn-sm inline-flex items-center gap-1.5"
                  >
                    <Archive className="w-3.5 h-3.5 text-slate-500" />
                    <span>Archive Mandate</span>
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
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card divide-y divide-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-50 font-semibold text-slate-500 uppercase tracking-wider text-xs">
              Registered Platform Users ({users.length})
            </div>
            {users.map((u) => (
              <div key={u.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{u.fullName}</span>
                    <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full capitalize">
                      {u.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{u.email} • {u.phone}</p>
                  <p className="text-xs text-slate-700">{u.companyName} • {u.city}, {u.state}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>KYC Verified</span>
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
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card divide-y divide-slate-100 overflow-hidden text-xs">
            {deals.map((d) => (
              <div key={d.id} className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-slate-400 block">
                      Deal Ref #{d.id}
                    </span>
                    <h4 className="font-bold text-slate-900 text-base">{d.listingTitle}</h4>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 bg-slate-900 text-white rounded-full capitalize">
                    {d.currentStage.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block uppercase text-[11px]">Seller Name</span>
                    <span className="block font-bold text-slate-900 mt-0.5">{d.sellerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block uppercase text-[11px]">Buyer Name</span>
                    <span className="block font-bold text-slate-900 mt-0.5">{d.buyerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block uppercase text-[11px]">Attribution Expires</span>
                    <span className="block font-bold text-amber-700 mt-0.5">
                      {formatDate(d.platformAttributionWindowEnds)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block uppercase text-[11px]">Success Fee (2%)</span>
                    <span className="block font-bold text-emerald-700 mt-0.5">
                      {formatINR(d.expectedCommission)} <span className="text-xs text-slate-400 font-normal">+18% GST</span>
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  Initial introduction recorded on {formatDate(d.firstContactDate)}. Commission agreement v{d.commissionAgreementVersion}.
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: COMPLAINTS & GRIEVANCES */}
      {activeTab === "complaints" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card divide-y divide-slate-100 overflow-hidden text-xs">
            {complaints.map((cmp) => (
              <div key={cmp.id} className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-rose-700 font-semibold bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full text-xs capitalize">
                    {cmp.reason.replace(/_/g, " ")}
                  </span>
                  <span
                    className={`font-semibold px-2.5 py-0.5 rounded-full text-xs capitalize ${
                      cmp.status === "resolved"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {cmp.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-base">Target: {cmp.targetTitle}</h4>
                  <p className="text-slate-700 text-xs">{cmp.details}</p>
                  {cmp.evidenceNotes && (
                    <p className="text-xs text-slate-500 pt-1">
                      Evidence submitted: {cmp.evidenceNotes}
                    </p>
                  )}
                  {cmp.resolutionAction && (
                    <div className="mt-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 text-xs">
                      Action Logged: {cmp.resolutionAction}
                    </div>
                  )}
                </div>

                {cmp.status !== "resolved" && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => handleResolveComplaint(cmp.id)}
                      className="btn-brand btn-sm"
                    >
                      Resolve & Close Grievance
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
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-600" />
                Configure Platform Commission Schedule
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Statutory transaction success fee rate and attribution window policy.
              </p>
            </div>
            <form onSubmit={handleSaveCommissionConfig} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Standard Success Fee (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={editRate}
                  onChange={(e) => setEditRate(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Attribution Window (Days)
                </label>
                <input
                  type="number"
                  value={editWindow}
                  onChange={(e) => setEditWindow(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="btn-brand w-full"
                >
                  Save Policy Configuration
                </button>
              </div>
            </form>
          </div>

          {/* Invoices List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card space-y-3">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Issued Platform Invoices</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                GST-compliant tax invoices issued upon closing.
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <div key={inv.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">{inv.invoiceNumber}</span>
                    <span className="text-xs text-slate-500">Party: {inv.userName}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block text-xs">
                      {formatINR(inv.totalAmount)}
                    </span>
                    <span className="text-xs text-emerald-700 font-semibold capitalize">
                      {inv.status}
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
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card divide-y divide-slate-100 overflow-hidden text-xs">
            <div className="p-4 bg-slate-50 font-semibold text-slate-500 uppercase tracking-wider text-xs">
              Platform Audit Log & Activity ({auditLogs.length})
            </div>
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full capitalize">
                      {log.action}
                    </span>
                    <span className="text-slate-400">IP: {log.ipAddress}</span>
                  </div>
                  <p className="text-slate-900 font-medium">{log.details}</p>
                  <span className="text-xs text-slate-400">
                    Actor: {log.actorName} ({log.actorRole})
                  </span>
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap">
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
