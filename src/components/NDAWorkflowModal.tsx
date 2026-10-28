"use client";

import React, { useState } from "react";
import { BusinessListing, ConfidentialityAgreement } from "@/types/marketplace";
import { MarketplaceStorage } from "@/lib/storage";
import { ShieldCheck, Lock, FileText, CheckCircle2, X, AlertTriangle } from "lucide-react";

interface NDAWorkflowModalProps {
  listing: BusinessListing;
  isOpen: boolean;
  onClose: () => void;
  onSignedSuccess: (nda: ConfidentialityAgreement) => void;
}

export function NDAWorkflowModal({
  listing,
  isOpen,
  onClose,
  onSignedSuccess,
}: NDAWorkflowModalProps) {
  const currentUser = MarketplaceStorage.getCurrentUser();
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [companyName, setCompanyName] = useState(currentUser.companyName || "VP Growth Investments Ltd");
  const [signerTitle, setSignerTitle] = useState("Managing Principal");

  if (!isOpen) return null;

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;

    setSubmitting(true);
    setTimeout(() => {
      const newNDA: ConfidentialityAgreement = {
        id: `nda-${Date.now()}`,
        listingId: listing.id,
        buyerId: currentUser.id,
        buyerName: currentUser.fullName,
        buyerEmail: currentUser.email,
        buyerCompany: companyName,
        status: "approved_active", // Auto-approved for verified qualified buyers, or immediate unlock
        signedAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        ipAddress: "49.207.182.41 (Bengaluru, IN)",
        watermarkText: `CONFIDENTIAL — LICENSED TO ${currentUser.fullName.toUpperCase()} (${companyName.toUpperCase()}) — IP: 49.207.182.41`,
        agreementVersion: "v1.4-in",
        termsAccepted: true,
      };

      MarketplaceStorage.signNDA(newNDA);
      setSubmitting(false);
      onSignedSuccess(newNDA);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-[2px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-navy-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Digital Confidentiality & Non-Disclosure Agreement</h3>
              <p className="text-xs text-slate-300">Indian Contract Act, 1872 Compliant Digital Bilateral Covenant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Agreement Text */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed flex-1">
          {/* Summary Box */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-[2px] space-y-1.5">
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Target Opportunity:</span>
              <span className="font-bold text-navy-900">{listing.displayTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Disclosing Principal:</span>
              <span className="text-slate-800">{listing.businessName} (Represented by VyapaarSetu Verified Seller)</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Receiving Party:</span>
              <span className="font-semibold text-slate-800">{currentUser.fullName} ({currentUser.email})</span>
            </div>
          </div>

          {/* Legal Clauses Scroll Box */}
          <div className="border border-slate-200 rounded-[2px] p-4 bg-white space-y-3 h-48 overflow-y-auto text-slate-600 font-mono text-[11px] leading-normal shadow-inner">
            <p className="font-bold text-slate-900 font-sans text-xs">
              1. SCOPE OF CONFIDENTIAL PROPRIETARY INFORMATION
            </p>
            <p>
              The Disclosing Party agrees to disclose to the Receiving Party certain sensitive proprietary information including but not limited to audited/management profit & loss accounts, balance sheets, customer lists, vendor supplier agreements, software code, intellectual property schedules, and employee compensation registers (collectively, &quot;Evaluation Material&quot;).
            </p>

            <p className="font-bold text-slate-900 font-sans text-xs">
              2. NON-DISCLOSURE, SECURE CUSTODY & WATERMARKING
            </p>
            <p>
              The Receiving Party agrees to treat all Evaluation Material with the strictest confidentiality. The Receiving Party specifically consents that all downloaded or previewed documents will be dynamically embedded with a forensic cryptographic watermark containing the Receiving Party&apos;s legal name, company designation, IP address, and timestamp.
            </p>

            <p className="font-bold text-slate-900 font-sans text-xs">
              3. NON-CIRCUMVENTION & DEAL ATTRIBUTION
            </p>
            <p>
              The Receiving Party covenants and agrees that it will not directly or indirectly circumvent VyapaarSetu to contact the seller, its directors, employees, suppliers, or customers, nor attempt to execute any acquisition, share transfer, or asset purchase outside the VyapaarSetu Deal Attribution Framework for a period of eighteen (18) months from the date hereof.
            </p>

            <p className="font-bold text-slate-900 font-sans text-xs">
              4. REMEDIES & GOVERNING JURISDICTION
            </p>
            <p>
              Any unauthorized disclosure or breach shall entitle the Disclosing Party and VyapaarSetu to seek immediate injunctive relief and liquidated damages under the laws of the Republic of India, subject to exclusive court jurisdiction in Mumbai, Maharashtra.
            </p>
          </div>

          {/* Form details */}
          <form onSubmit={handleSign} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Acquiring Entity / Legal Company
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  placeholder="e.g. VP Growth Investments Ltd"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Authorized Signatory Designation
                </label>
                <input
                  type="text"
                  required
                  value={signerTitle}
                  onChange={(e) => setSignerTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  placeholder="e.g. Director / Partner"
                />
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-2.5 p-3 rounded-[2px] bg-emerald-50/70 border border-emerald-200">
              <input
                id="nda-checkbox"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <label htmlFor="nda-checkbox" className="text-xs text-slate-800 leading-snug cursor-pointer">
                I hereby declare that I am legally authorized to execute this bilateral Non-Disclosure Agreement on behalf of the acquiring entity. I agree to the non-circumvention terms and forensic watermark embedding.
              </label>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 font-mono">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary btn-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!agreed || submitting}
                className="btn-teal btn-sm"
              >
                <ShieldCheck className="w-4 h-4 text-teal-300" />
                <span>{submitting ? "Cryptographically Signing..." : "Execute NDA & Unlock Data Vault"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
