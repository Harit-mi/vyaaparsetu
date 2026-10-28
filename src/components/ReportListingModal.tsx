"use client";

import React, { useState } from "react";
import { BusinessListing, ComplaintReport } from "@/types/marketplace";
import { MarketplaceStorage } from "@/lib/storage";
import { AlertTriangle, X, CheckCircle2 } from "lucide-react";

interface ReportListingModalProps {
  listing: BusinessListing;
  isOpen: boolean;
  onClose: () => void;
}

export function ReportListingModal({ listing, isOpen, onClose }: ReportListingModalProps) {
  const currentUser = MarketplaceStorage.getCurrentUser();
  const [reason, setReason] = useState<ComplaintReport["reason"]>("misleading_financials");
  const [details, setDetails] = useState("");
  const [evidenceNotes, setEvidenceNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const complaint: ComplaintReport = {
      id: `cmp-${Date.now()}`,
      reporterId: currentUser.id,
      reporterRole: currentUser.role,
      targetListingId: listing.id,
      targetTitle: listing.displayTitle,
      reason,
      details,
      evidenceNotes,
      status: "open",
      createdAt: new Date().toISOString(),
    };

    MarketplaceStorage.addComplaint(complaint);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-[2px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-red-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h3 className="font-bold text-sm">Report Listing to Compliance Officer</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-slate-900 text-sm">Complaint Transmitted</h4>
            <p className="text-xs text-slate-500">
              The compliance and grievance team will review this report within 24 working hours under Rule 3(2) of the Information Technology Intermediary Rules.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Primary Violation Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as ComplaintReport["reason"])}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="misleading_financials">Misleading or Unsubstantiated Turnover / EBITDA</option>
                <option value="unauthorized_listing">Unauthorized Broker / No Authority to Sell</option>
                <option value="fraudulent_identity">Fake CIN / GST / Identity Details</option>
                <option value="circumvention_attempt">Off-Platform Fee Circumvention Request</option>
                <option value="other">Other Commercial Dispute</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Detailed Explanation</label>
              <textarea
                required
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Explain the inaccuracy or concern with specific evidence..."
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Evidence Reference (MCA/GST/Public Filing)</label>
              <input
                type="text"
                value={evidenceNotes}
                onChange={(e) => setEvidenceNotes(e.target.value)}
                placeholder="e.g. MCA portal indicates company struck off or differing directors"
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary btn-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-danger btn-sm"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
