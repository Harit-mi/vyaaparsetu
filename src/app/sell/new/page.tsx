"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MarketplaceStorage } from "@/lib/storage";
import { BusinessListing, ListingDocument, VisibilityMode, SaleStructure } from "@/types/marketplace";
import { formatINR } from "@/lib/utils";
import { useToast } from "@/components/Toast";
import {
  Building2,
  CheckCircle2,
  ShieldCheck,
  Lock,
  ArrowRight,
  ArrowLeft,
  Upload,
  AlertCircle,
  FileText,
  DollarSign,
  Scale,
  Eye,
  Trash2,
  Save,
  Check,
} from "lucide-react";

export default function SellerNewListingWizard() {
  const router = useRouter();
  const currentUser = MarketplaceStorage.getCurrentUser();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1: Legal Entity & Authority
  const [legalName, setLegalName] = useState("Shree Ganesh Precision Forgings LLP");
  const [cinGstin, setCinGstin] = useState("27AABCS1234F1Z8");
  const [authorityType, setAuthorityType] = useState("mca_director_cin");
  const [sellerDeclaration, setSellerDeclaration] = useState(true);

  // Step 2: Listing Details & Category
  const [displayTitle, setDisplayTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [industry, setIndustry] = useState("Manufacturing");
  const [subCategory, setSubCategory] = useState("Automotive Ancillary");
  const [city, setCity] = useState("Pune");
  const [state, setState] = useState("Maharashtra");
  const [area, setArea] = useState("Chakan Industrial Belt");
  const [yearsRunning, setYearsRunning] = useState(12);
  const [businessType, setBusinessType] = useState<"physical" | "online" | "hybrid" | "franchise">("physical");
  const [teamSize, setTeamSize] = useState<"1-5" | "6-15" | "16-50" | "51-150" | "150+">("16-50");
  const [saleStructure, setSaleStructure] = useState<SaleStructure>("share_sale");

  // Step 3: Financials (INR)
  const [askingPrice, setAskingPrice] = useState(50000000); // ₹5.0 Cr
  const [annualRevenue, setAnnualRevenue] = useState(85000000); // ₹8.5 Cr
  const [annualEbitda, setAnnualEbitda] = useState(14000000); // ₹1.4 Cr
  const [assetsValue, setAssetsValue] = useState(25000000); // ₹2.5 Cr
  const [inventoryValue, setInventoryValue] = useState(6000000); // ₹60 L
  const [reportingPeriod, setReportingPeriod] = useState<
    "FY2023-24 (Audited)" | "FY2024-25 (Management MIS)" | "TTM (Trailing 12 Months)" | "Provisional"
  >("FY2023-24 (Audited)");
  const [isAudited, setIsAudited] = useState(true);

  // Step 4: Narrative & Operations
  const [executiveSummary, setExecutiveSummary] = useState(
    "High-tonnage stamping and precision forging enterprise supplying commercial vehicle manufacturers with long-term vendor contracts and IATF certification."
  );
  const [operatingModel, setOperatingModel] = useState(
    "B2B contract manufacturing with raw material price escalation indexation."
  );
  const [reasonForSale, setReasonForSale] = useState(
    "Promoters divesting to consolidate into agricultural processing."
  );
  const [products, setProducts] = useState(
    "Transmission shafts, High-tensile forged flanges, CNC machined sub-assemblies"
  );
  const [growthLevers, setGrowthLevers] = useState(
    "Capacity available on third shift; EV 2-wheeler motor casing tooling ready"
  );
  const [assetsIncluded, setAssetsIncluded] = useState(
    "8 CNC machining centers, 2 hydraulic presses, MIDC industrial shed lease"
  );

  // Step 5: Images & Confidentiality & Documents
  const [visibility, setVisibility] = useState<VisibilityMode>("partially_confidential");
  const [uploadedDocTitle, setUploadedDocTitle] = useState("Tax Audit Report (Form 3CD) FY24");
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
  ]);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Step 6: Platform terms
  const [agreedToCommission, setAgreedToCommission] = useState(true);

  // Auto-load draft from localStorage if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const draft = localStorage.getItem("vyapaarsetu_seller_draft");
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          if (parsed.displayTitle) setDisplayTitle(parsed.displayTitle);
          if (parsed.askingPrice) setAskingPrice(parsed.askingPrice);
          if (parsed.legalName) setLegalName(parsed.legalName);
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const handleSaveDraft = () => {
    if (typeof window !== "undefined") {
      const draftObj = {
        legalName,
        cinGstin,
        displayTitle,
        tagline,
        industry,
        city,
        state,
        askingPrice,
        annualRevenue,
        annualEbitda,
        visibility,
      };
      localStorage.setItem("vyapaarsetu_seller_draft", JSON.stringify(draftObj));
      showToast("Draft Saved to Local Storage", "You can resume editing anytime on this browser.", "info");
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!legalName.trim()) newErrors.legalName = "Legal entity name is required.";
      if (!cinGstin.trim()) newErrors.cinGstin = "CIN / GSTIN is required.";
      if (!sellerDeclaration) newErrors.declaration = "You must confirm legal authority to list.";
    }
    if (currentStep === 2) {
      if (!displayTitle.trim()) newErrors.displayTitle = "Display title is required.";
      if (!tagline.trim()) newErrors.tagline = "Summary tagline is required.";
      if (!city.trim()) newErrors.city = "City is required.";
      if (yearsRunning < 0) newErrors.yearsRunning = "Years operating must be 0 or more.";
    }
    if (currentStep === 3) {
      if (askingPrice <= 0) newErrors.askingPrice = "Asking price must be greater than 0.";
      if (annualRevenue < 0) newErrors.annualRevenue = "Revenue cannot be negative.";
    }
    if (currentStep === 4) {
      if (!executiveSummary.trim() || executiveSummary.length < 20) {
        newErrors.executiveSummary = "Please provide an executive summary (at least 20 chars).";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl("");
      showToast("Photo Added to Listing", "Preview thumbnail generated.");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (status: "draft" | "pending_review") => {
    if (status === "pending_review" && !sellerDeclaration) {
      alert("Please confirm seller authority declaration.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const generatedSlug = (displayTitle || `${industry} Business in ${city}`)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const newListing: BusinessListing = {
        id: `list-${Date.now()}`,
        slug: generatedSlug,
        sellerId: currentUser.id,
        sellerProfileId: `sp-${currentUser.id}`,
        businessName: legalName,
        displayTitle: displayTitle || `${industry} Business in ${city}`,
        tagline: tagline || `Profitable ${industry} operational enterprise in ${city}, ${state}`,
        industry,
        subCategory,
        city,
        state,
        country: "India",
        postalCodeArea: area,
        askingPrice: Number(askingPrice),
        annualRevenue: Number(annualRevenue),
        annualEbitda: Number(annualEbitda),
        inventoryValueIncluded: Number(inventoryValue),
        assetsValueIncluded: Number(assetsValue),
        financialReportingPeriod: reportingPeriod,
        isFinancialVerified: isAudited,
        financialVerificationNote: isAudited
          ? "Seller has deposited Form 3CD tax audit for CA panel verification."
          : "Self-declared management MIS; confirmatory audit required.",
        financialRanges: {
          askingPriceRange: formatINR(askingPrice),
          revenueRange: formatINR(annualRevenue),
          ebitdaRange: `${formatINR(annualEbitda)} (${((annualEbitda / (annualRevenue || 1)) * 100).toFixed(1)}%)`,
        },
        yearsInOperation: Number(yearsRunning),
        businessType,
        teamSizeRange: teamSize,
        saleStructure,
        franchiseAvailable: businessType === "franchise",
        executiveSummary,
        productsAndServices: products.split(",").map((s) => s.trim()),
        customerSegments: ["OEM Tier 1", "Industrial Distributors", "Commercial Fleets"],
        operatingModel,
        growthOpportunities: growthLevers.split(",").map((s) => s.trim()),
        assetsIncluded: assetsIncluded.split(",").map((s) => s.trim()),
        reasonForSale,
        visibility,
        status: status === "draft" ? "draft" : "pending_review",
        isPaused: false,
        isFeatured: false,
        requiresNdaForFinancials: true,
        sellerVerificationStatus: "submitted",
        viewsCount: 1,
        inquiriesCount: 0,
        savedCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastUpdatedDate: new Date().toISOString().split("T")[0],
        imageUrl: images[0] || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
        galleryImages: images,
      };

      MarketplaceStorage.saveListing(newListing);

      if (uploadedDocTitle) {
        const doc: ListingDocument = {
          id: `doc-${Date.now()}`,
          listingId: newListing.id,
          title: uploadedDocTitle,
          category: isAudited ? "audit_report" : "financial_mis",
          fileName: `${uploadedDocTitle.replace(/\s+/g, "_")}.pdf`,
          fileSize: "3.8 MB",
          isConfidential: true,
          uploadedAt: new Date().toISOString(),
          downloadRestricted: true,
          accessCount: 0,
        };
        MarketplaceStorage.addDocument(doc);
      }

      // Clear draft
      if (typeof window !== "undefined") {
        localStorage.removeItem("vyapaarsetu_seller_draft");
      }

      setSubmitting(false);
      showToast(
        status === "pending_review" ? "Listing Transmitted for CA Moderation" : "Draft Saved Successfully",
        "You can manage it from your Seller Dashboard.",
        "success"
      );
      router.push("/dashboard/seller");
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ivory-400 pb-4">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-teal-800 bg-teal-50 px-2 py-0.5 border border-teal-200">
            STATUTORY FILING DOSSIER • M&A LISTING MANDATE
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0c152b] mt-1">
            File Corporate Divestment Mandate
          </h1>
          <p className="font-mono text-xs text-slate-500 mt-0.5">
            STAGE 0{step} OF 06 • CONFIDENTIALITY PROTOCOLS & AUTOSAVE ACTIVE
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-ivory-400 bg-white hover:bg-ivory-100 text-slate-800 transition"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" />
            <span className="uppercase tracking-wider">Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#0c152b] text-white hover:bg-navy-800 transition font-bold"
          >
            <Eye className="w-3.5 h-3.5 text-bronze-300" />
            <span className="uppercase tracking-wider">{showPreview ? "Back to Form" : "Live Teaser"}</span>
          </button>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white p-3 border border-ivory-400">
        {/* Mobile Compact Progress Indicator */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-1.5 font-mono text-xs">
            <span className="font-bold text-[#0c152b]">
              STAGE 0{step}/06: {["Authority", "Info", "Financials", "Operations", "Vault", "Submit"][step - 1]}
            </span>
            <span className="font-bold text-teal-800">
              {Math.round((step / 6) * 100)}%
            </span>
          </div>
          <div className="w-full bg-ivory-200 h-1.5 overflow-hidden">
            <div
              className="bg-teal-700 h-full transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Desktop / Tablet Stepper Tabs */}
        <div className="hidden md:flex items-center justify-between font-mono text-xs text-slate-500 overflow-x-auto gap-2">
          {[
            "01. Authority",
            "02. Business Info",
            "03. Financials",
            "04. Operations",
            "05. Data Room",
            "06. Covenants & File",
          ].map((title, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                if (validateStep(step)) setStep(i + 1);
              }}
              className={`flex items-center gap-1 pb-1 border-b-2 uppercase tracking-wider font-semibold whitespace-nowrap transition-colors ${
                step === i + 1
                  ? "border-[#0c152b] text-[#0c152b] font-bold"
                  : step > i + 1
                  ? "border-teal-700 text-teal-900"
                  : "border-transparent text-slate-400"
              }`}
            >
              <span>{title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* LIVE PREVIEW DRAWER */}
      {showPreview && (
        <div className="p-6 bg-ivory-100 border border-ivory-400 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between font-mono">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0c152b]">
              ACQUISITION TEASER PREVIEW
            </span>
            <span className="text-[10px] text-slate-500 uppercase">How verified buyers will see your mandate</span>
          </div>

          <div className="bg-white p-5 border border-ivory-400 space-y-3 font-mono">
            <div className="flex items-center gap-2 text-[10px]">
              <span className="bg-[#0c152b] text-white px-2 py-0.5 uppercase tracking-wider font-bold">
                {industry}
              </span>
              <span className="bg-teal-50 text-teal-800 font-bold px-2 py-0.5 border border-teal-200 uppercase">
                {isAudited ? "CA Audited Books" : "Management Accounts"}
              </span>
              <span className="text-slate-500 font-sans">{city}, {state}</span>
            </div>

            <h3 className="font-display text-lg font-bold text-[#0c152b]">
              {displayTitle || "Untitled Business Teaser"}
            </h3>
            <p className="font-serif-editorial italic text-xs text-slate-600 font-normal">{tagline || "Tagline will appear here..."}</p>

            <div className="pt-2 border-t border-ivory-300 grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Asking EV</span>
                <span className="font-display font-bold text-sm text-[#0c152b]">{formatINR(askingPrice)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Turnover</span>
                <span className="font-semibold text-slate-800">{formatINR(annualRevenue)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">EBITDA Margin</span>
                <span className="font-semibold text-teal-800">
                  {formatINR(annualEbitda)} ({((annualEbitda / (annualRevenue || 1)) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP FORMS */}
      <div className="bg-white p-6 sm:p-8 border border-ivory-400 space-y-6 text-xs">
        {/* STEP 1: Corporate Authority & Legal Proof */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">Step 1: Legal Entity Verification & Authority</h3>
              <p className="text-slate-500 text-xs">
                To eliminate unauthorized brokers, specify your statutory credentials. This data remains confidential.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Registered Legal Entity Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  className={`w-full p-2.5 border rounded-[2px] ${errors.legalName ? "border-red-500" : "border-slate-300"}`}
                  placeholder="e.g. Acme Precision Tools Private Limited"
                />
                {errors.legalName && <p className="text-red-500 text-[11px] mt-1">{errors.legalName}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  CIN / LLPIN / GSTIN Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={cinGstin}
                  onChange={(e) => setCinGstin(e.target.value)}
                  className={`w-full p-2.5 border rounded-[2px] font-mono uppercase ${errors.cinGstin ? "border-red-500" : "border-slate-300"}`}
                  placeholder="e.g. U29100MH2012PTC123456"
                />
                {errors.cinGstin && <p className="text-red-500 text-[11px] mt-1">{errors.cinGstin}</p>}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Signatory Authority Proof</label>
              <select
                value={authorityType}
                onChange={(e) => setAuthorityType(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-[2px] bg-white"
              >
                <option value="mca_director_cin">Promoter / Registered Director (DIN Verified)</option>
                <option value="partnership_deed">Managing Partner (Partnership Deed)</option>
                <option value="board_resolution">Authorized Corporate Officer (Board Resolution)</option>
                <option value="sole_proprietor">Sole Proprietor (GST Registration)</option>
              </select>
            </div>

            <div className="p-4 bg-emerald-50 rounded-[2px] border border-emerald-200 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sellerDeclaration}
                  onChange={(e) => setSellerDeclaration(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-emerald-600 rounded"
                />
                <span className="text-xs text-slate-800 leading-snug">
                  I solemnly declare that I hold bonafide corporate/legal authority from the shareholders to list and solicit acquisition discussions for this entity under the Indian Contract Act, 1872.
                </span>
              </label>
              {errors.declaration && <p className="text-red-600 text-[11px]">{errors.declaration}</p>}
            </div>
          </div>
        )}

        {/* STEP 2: Business Teaser Info */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">Step 2: Business Profile & Location</h3>
              <p className="text-slate-500 text-xs">Define how the business will appear to prospective acquirers.</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Public Display Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={displayTitle}
                onChange={(e) => setDisplayTitle(e.target.value)}
                placeholder="e.g. Profitable Tier-1 Precision Auto Component Manufacturer"
                className={`w-full p-2.5 border rounded-[2px] ${errors.displayTitle ? "border-red-500" : "border-slate-300"}`}
              />
              {errors.displayTitle && <p className="text-red-500 text-[11px] mt-1">{errors.displayTitle}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Short Tagline <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. 15-year operational history with 40% repeat customer EBITDA margins"
                className={`w-full p-2.5 border rounded-[2px] ${errors.tagline ? "border-red-500" : "border-slate-300"}`}
              />
              {errors.tagline && <p className="text-red-500 text-[11px] mt-1">{errors.tagline}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-[2px] bg-white"
                >
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="B2B SaaS & Tech">B2B SaaS & Tech</option>
                  <option value="Healthcare & Diagnostics">Healthcare & Diagnostics</option>
                  <option value="FMCG / Food">FMCG / Food</option>
                  <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                  <option value="Retail & E-commerce">Retail & E-commerce</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-[2px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-[2px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Years Operating</label>
                <input
                  type="number"
                  value={yearsRunning}
                  onChange={(e) => setYearsRunning(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-[2px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Operating Model</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-[2px] bg-white"
                >
                  <option value="physical">Physical Plant / Factory</option>
                  <option value="online">Online / SaaS</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="franchise">Franchise</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sale Structure</label>
                <select
                  value={saleStructure}
                  onChange={(e) => setSaleStructure(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-[2px] bg-white"
                >
                  <option value="share_sale">100% Share Sale</option>
                  <option value="asset_sale">Asset Sale (BTA)</option>
                  <option value="majority_stake">Majority Stake (51%+)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Financials */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">Step 3: Financial Metrics & Range Disclosures</h3>
              <p className="text-slate-500 text-xs">Enter your revenue, profitability, and balance sheet indicators in INR.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Asking Price (Target Valuation)</label>
                <input
                  type="number"
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-[2px]"
                />
                <span className="text-[10px] text-emerald-700 font-bold mt-1 block">
                  Formatted: {formatINR(askingPrice)}
                </span>
                {errors.askingPrice && <p className="text-red-500 text-[11px] mt-1">{errors.askingPrice}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Annual Revenue (Turnover)</label>
                <input
                  type="number"
                  value={annualRevenue}
                  onChange={(e) => setAnnualRevenue(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-[2px]"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Formatted: {formatINR(annualRevenue)}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Annual EBITDA (Operating Profit)</label>
                <input
                  type="number"
                  value={annualEbitda}
                  onChange={(e) => setAnnualEbitda(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-[2px]"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Margin: {((annualEbitda / (annualRevenue || 1)) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fixed Assets & Machinery Value (₹)</label>
                <input
                  type="number"
                  value={assetsValue}
                  onChange={(e) => setAssetsValue(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-[2px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Inventory / Stock Transferred (₹)</label>
                <input
                  type="number"
                  value={inventoryValue}
                  onChange={(e) => setInventoryValue(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-[2px]"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAudited}
                  onChange={(e) => setIsAudited(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="font-semibold text-slate-800">
                  I will deposit Form 3CD or GSTR-9 returns for CA Verification
                </span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 4: Operations & Narrative */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">Step 4: Operational Model & Diligence Story</h3>
              <p className="text-slate-500 text-xs">Help serious buyers understand why your business is attractive.</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Executive Overview <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={executiveSummary}
                onChange={(e) => setExecutiveSummary(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-[2px] text-xs"
              />
              {errors.executiveSummary && <p className="text-red-500 text-[11px] mt-1">{errors.executiveSummary}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Primary Products & Services (comma-separated)</label>
              <input
                type="text"
                value={products}
                onChange={(e) => setProducts(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-[2px]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assets Included in Transfer</label>
              <input
                type="text"
                value={assetsIncluded}
                onChange={(e) => setAssetsIncluded(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-[2px]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sale Rationale (Why are you selling?)</label>
              <input
                type="text"
                value={reasonForSale}
                onChange={(e) => setReasonForSale(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-[2px]"
              />
            </div>
          </div>
        )}

        {/* STEP 5: Photos & Confidential Vault */}
        {step === 5 && (
          <div className="space-y-5">
            <div className="border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">Step 5: Photos, Confidentiality & Data Vault</h3>
              <p className="text-slate-500 text-xs">Upload facility photos and choose how strictly your identity is protected.</p>
            </div>

            {/* Photo Gallery Uploader */}
            <div className="space-y-3">
              <label className="block font-semibold text-slate-700">Photo Gallery ({images.length} photos)</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative h-24 rounded-[2px] overflow-hidden border border-slate-200 group">
                    <Image src={img} alt={`Preview ${idx}`} fill sizes="150px" className="object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-[2px] opacity-0 group-hover:opacity-100 transition"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Paste image URL (e.g. from Unsplash or corporate CDN)..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 p-2 border border-slate-300 rounded-[2px] text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-3 py-2 bg-navy-900 text-white rounded-[2px] text-xs font-semibold hover:bg-navy-800"
                >
                  Add Photo
                </button>
              </div>
            </div>

            {/* Confidentiality Options */}
            <div className="pt-2">
              <label className="block font-semibold text-slate-700 mb-2">Confidentiality Mode</label>
              <div className="space-y-2">
                {[
                  {
                    key: "partially_confidential",
                    title: "Partially Confidential (Recommended)",
                    desc: "City and industry are visible. Exact address, CIN, and customer names are redacted until NDA execution.",
                  },
                  {
                    key: "strictly_confidential",
                    title: "Strictly Confidential (Blind Mandate)",
                    desc: "Complete blind teaser. Even state and machine brands are shielded until seller approves buyer.",
                  },
                  {
                    key: "public",
                    title: "Public Listing",
                    desc: "Business identity is public. Suitable for retail outlets, franchises, or non-sensitive assets.",
                  },
                ].map((mode) => (
                  <label
                    key={mode.key}
                    className={`block p-3 rounded-[2px] border cursor-pointer transition ${
                      visibility === mode.key ? "border-emerald-600 bg-emerald-50/70" : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="vis"
                        checked={visibility === mode.key}
                        onChange={() => setVisibility(mode.key as any)}
                        className="text-emerald-600"
                      />
                      <span className="font-bold text-slate-900 text-xs">{mode.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 ml-5 mt-1">{mode.desc}</p>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Terms & Commission Engagement */}
        {step === 6 && (
          <div className="space-y-4">
            <div className="border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">Step 6: Success Fee Agreement & Confirmation</h3>
              <p className="text-slate-500 text-xs">Review marketplace covenants before submitting for CA review.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-[2px] border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Target Opportunity:</span>
                <span className="font-bold text-slate-900">{displayTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Asking Valuation:</span>
                <span className="font-bold text-emerald-700">{formatINR(askingPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Legal Entity:</span>
                <span className="text-slate-800">{legalName} (CIN: {cinGstin})</span>
              </div>
            </div>

            <div className="p-4 bg-amber-50/80 rounded-[2px] border border-amber-200 text-xs text-amber-950 space-y-2">
              <h4 className="font-bold flex items-center gap-1.5 text-sm">
                <Scale className="w-4 h-4 text-amber-800" />
                180-Day Deal Attribution Covenant
              </h4>
              <p className="leading-relaxed">
                By submitting this listing, you confirm that upon deal closing with any introduced buyer within the 180-day attribution window, a marketplace success fee of <strong>2.0% of transaction enterprise value (+ 18% GST)</strong> shall become payable.
              </p>
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreedToCommission}
                  onChange={(e) => setAgreedToCommission(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="font-semibold text-xs">
                  I accept the platform attribution covenant and fee schedule.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="pt-5 border-t border-ivory-300 flex items-center justify-between font-mono">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="btn-secondary"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSubmit("draft")}
              className="btn-secondary"
            >
              Save as Draft
            </button>

            {step < 6 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="btn-primary"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
              </button>
            ) : (
              <button
                type="button"
                disabled={!agreedToCommission || submitting}
                onClick={() => handleSubmit("pending_review")}
                className="btn-teal btn-lg"
              >
                <ShieldCheck className="w-4 h-4 text-teal-300" />
                <span>{submitting ? "Transmitting Mandate..." : "Submit for CA Review"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
