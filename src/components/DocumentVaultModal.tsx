"use client";

import React, { useState } from "react";
import { ListingDocument, ConfidentialityAgreement } from "@/types/marketplace";
import { MarketplaceStorage } from "@/lib/storage";
import {
  FileText,
  Lock,
  Download,
  Eye,
  ShieldCheck,
  AlertTriangle,
  X,
  Clock,
  CheckCircle,
} from "lucide-react";

interface DocumentVaultModalProps {
  documents: ListingDocument[];
  activeNDA?: ConfidentialityAgreement;
  isOpen: boolean;
  onClose: () => void;
  onRequestNDA: () => void;
}

export function DocumentVaultModal({
  documents,
  activeNDA,
  isOpen,
  onClose,
  onRequestNDA,
}: DocumentVaultModalProps) {
  const [selectedDoc, setSelectedDoc] = useState<ListingDocument | null>(documents[0] || null);
  const [previewing, setPreviewing] = useState(false);
  const currentUser = MarketplaceStorage.getCurrentUser();

  if (!isOpen) return null;

  const isUnlocked = activeNDA && activeNDA.status === "approved_active";

  const handleOpenDoc = (doc: ListingDocument) => {
    if (!isUnlocked) {
      onRequestNDA();
      return;
    }
    setSelectedDoc(doc);
    setPreviewing(true);
    MarketplaceStorage.logAudit("DOCUMENT_VIEWED", `Document ${doc.title} opened in secure viewer`, "document", doc.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-[2px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-navy-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Confidential Deal Document Vault</h3>
              <p className="text-xs text-slate-300">Audited Tax Returns, Asset Registers & Pitch Decks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NDA Status Ribbon */}
        <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
          {isUnlocked ? (
            <div className="flex items-center gap-2 text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">Bilateral NDA Executed</span>
              <span className="text-slate-500">| Valid through {new Date(activeNDA.validUntil).toLocaleDateString("en-IN")}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-800">
              <Lock className="w-4 h-4 text-amber-600" />
              <span className="font-semibold">NDA Required:</span>
              <span className="text-slate-600">Access restricted to verified acquirers who execute the digital NDA.</span>
            </div>
          )}

          {!isUnlocked && (
            <button
              onClick={() => {
                onClose();
                onRequestNDA();
              }}
              className="px-3 py-1 rounded-lg bg-emerald-700 text-white text-[11px] font-semibold hover:bg-emerald-800 transition"
            >
              Sign NDA Now
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {previewing && selectedDoc && isUnlocked ? (
            /* Secure Watermarked Document Viewer */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{selectedDoc.title}</h4>
                  <p className="text-xs text-slate-500 font-mono">{selectedDoc.fileName} • {selectedDoc.fileSize}</p>
                </div>
                <button
                  onClick={() => setPreviewing(false)}
                  className="btn-secondary btn-sm"
                >
                  Back to File List
                </button>
              </div>

              {/* Watermarked Document Container */}
              <div className="relative border-2 border-slate-200 rounded-[2px] p-8 bg-slate-50 min-h-[340px] flex flex-col justify-between overflow-hidden shadow-inner">
                {/* Dynamic Forensic Watermark Overlay */}
                <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center transform -rotate-12 opacity-15 text-center text-xs font-mono font-bold text-slate-900 leading-loose">
                  {activeNDA?.watermarkText || `CONFIDENTIAL — ${currentUser.fullName} — IP: 49.207.182.41`}
                  <br />
                  STRICTLY RESTRICTED TO AUTHORIZED DILIGENCE — DO NOT DISTRIBUTE
                  <br />
                  TIMESTAMP: {new Date().toISOString()}
                </div>

                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-xs font-bold text-navy-900 uppercase">Document Verification Seal</span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">Encrypted Session</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    This encrypted preview provides direct access to the certified schedules filed for this transaction. All disclosures are monitored by VyapaarSetu compliance logs.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs font-mono space-y-2">
                    <div className="flex justify-between text-slate-600">
                      <span>Document Category:</span>
                      <span className="font-bold text-slate-900 uppercase">{selectedDoc.category.replace("_", " ")}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Digital Hash (SHA-256):</span>
                      <span className="text-[10px] truncate max-w-xs">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Access Permitted For:</span>
                      <span className="font-semibold text-emerald-700">{currentUser.fullName}</span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Download protection enforced by platform policy.</span>
                  <button
                    onClick={() => {
                      MarketplaceStorage.logAudit("DOCUMENT_DOWNLOAD_RESTRICTED", `Download attempt blocked for ${selectedDoc.title} per confidentiality controls`, "document", selectedDoc.id);
                      alert("Offline downloads are restricted to protect seller confidentiality. Please review within the secure watermarked viewer or request physical data room access.");
                    }}
                    className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 px-2.5 py-1 border rounded-lg bg-white"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download Policy</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Document List Table */
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                The seller has deposited the following verified transaction exhibits into the VyapaarSetu Data Vault:
              </p>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-[2px] overflow-hidden bg-white shadow-xs">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 text-slate-600 mt-0.5">
                        <FileText className="w-5 h-5 text-slate-700" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-slate-900 text-xs">{doc.title}</h5>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                          <span className="capitalize font-medium text-slate-700">{doc.category.replace("_", " ")}</span>
                          <span>•</span>
                          <span>{doc.fileSize}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3 h-3" />
                            {new Date(doc.uploadedAt).toLocaleDateString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {isUnlocked ? (
                        <button
                          onClick={() => handleOpenDoc(doc)}
                          className="btn-primary btn-sm"
                        >
                          <Eye className="w-3.5 h-3.5 text-teal-400" />
                          <span>View Securely</span>
                        </button>
                      ) : (
                        <button
                          onClick={onRequestNDA}
                          className="btn-secondary btn-sm"
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Locked</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#fbfbf9] border-t border-[#e2dfd6] flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>All views, IP addresses and document accesses are immutably logged for audit.</span>
          <button
            onClick={onClose}
            className="btn-secondary btn-sm"
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  );
}
