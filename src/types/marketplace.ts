export type UserRole = "buyer" | "seller" | "admin" | "visitor";

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  avatarUrl?: string;
  companyName?: string;
  city: string;
  state: string;
}

export type BuyerType = "individual" | "corporate" | "private_equity" | "family_office" | "search_fund";
export type QualificationStatus = "unverified" | "pending_review" | "qualified" | "high_net_worth" | "rejected";

export interface BuyerProfile {
  id: string;
  userId: string;
  buyerType: BuyerType;
  qualificationStatus: QualificationStatus;
  preferredIndustries: string[];
  preferredLocations: string[];
  minBudget: number; // in INR
  maxBudget: number; // in INR
  acquisitionExperience: "first_time" | "1_to_3_acquisitions" | "serial_acquirer_4plus";
  intendedFundingSource: "self_funded" | "bank_debt" | "equity_partner" | "syndicate";
  liquidCapitalRange: string;
  verifiedIdentity: boolean;
  ndaSignedCount: number;
  activeInquiriesCount: number;
  bio?: string;
}

export type SellerVerificationStatus = "unverified" | "submitted" | "verified_owner" | "verified_authorized_broker" | "rejected";

export interface SellerProfile {
  id: string;
  userId: string;
  verificationStatus: SellerVerificationStatus;
  idProofType?: "aadhaar" | "pan" | "passport";
  idProofReference?: string;
  authorityProofType?: "mca_director_cin" | "gst_registration" | "partnership_deed" | "board_resolution";
  verifiedAt?: string;
  verifiedByAdminId?: string;
  totalListingsCount: number;
  successfulExitsCount: number;
  reputationScore: number;
}

export type SaleStructure = "asset_sale" | "share_sale" | "majority_stake" | "franchise_transfer";
export type ListingStatus = "draft" | "pending_review" | "published" | "under_offer" | "sold" | "withdrawn" | "rejected";
export type VisibilityMode = "public" | "partially_confidential" | "strictly_confidential";

export interface BusinessListing {
  id: string;
  slug: string;
  sellerId: string;
  sellerProfileId: string;
  businessName: string; // If confidential, displayed as "Confidential High-Growth SaaS" or similar
  displayTitle: string;
  tagline: string;
  industry: string;
  subCategory: string;
  city: string;
  state: string;
  country: string;
  postalCodeArea?: string; // High level area, e.g. "Koramangala, Bengaluru"
  
  // Pricing & Financials (INR)
  askingPrice: number;
  annualRevenue: number;
  annualEbitda: number;
  inventoryValueIncluded: number;
  assetsValueIncluded: number;
  financialReportingPeriod: "FY2023-24 (Audited)" | "FY2024-25 (Management MIS)" | "TTM (Trailing 12 Months)" | "Provisional";
  isFinancialVerified: boolean;
  financialVerificationNote: string;
  financialRanges?: {
    revenueRange: string;
    ebitdaRange: string;
    askingPriceRange: string;
  };
  
  // Operational Details
  yearsInOperation: number;
  businessType: "online" | "physical" | "hybrid" | "franchise";
  teamSizeRange: "1-5" | "6-15" | "16-50" | "51-150" | "150+";
  saleStructure: SaleStructure;
  franchiseAvailable: boolean;
  
  // Descriptions
  executiveSummary: string;
  productsAndServices: string[];
  customerSegments: string[];
  operatingModel: string;
  growthOpportunities: string[];
  assetsIncluded: string[];
  reasonForSale?: string;
  
  // Confidentiality & Status
  visibility: VisibilityMode;
  status: ListingStatus;
  isPaused?: boolean;
  isFeatured: boolean;
  requiresNdaForFinancials: boolean;
  sellerVerificationStatus: SellerVerificationStatus;
  
  // Metadata
  viewsCount: number;
  inquiriesCount: number;
  savedCount: number;
  createdAt: string;
  updatedAt: string;
  lastUpdatedDate?: string;
  imageUrl: string;
  galleryImages?: string[];
  matchScore?: number;
}

export interface ListingDocument {
  id: string;
  listingId: string;
  title: string;
  category: "financial_mis" | "tax_return_gst" | "audit_report" | "incorporation_mca" | "pitch_deck" | "asset_register";
  fileName: string;
  fileSize: string;
  isConfidential: boolean;
  uploadedAt: string;
  downloadRestricted: boolean;
  accessCount: number;
}

export interface ConfidentialityAgreement {
  id: string;
  listingId: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerCompany?: string;
  status: "pending_seller_approval" | "approved_active" | "rejected" | "revoked";
  signedAt: string;
  validUntil: string;
  ipAddress: string;
  watermarkText: string;
  agreementVersion: string;
  termsAccepted: boolean;
}

export interface Inquiry {
  id: string;
  listingId: string;
  listingTitle: string;
  sellerId: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerType: BuyerType;
  message: string;
  intendedFundingSource: string;
  indicativeOfferBudget?: number;
  timelineMonths: number;
  status: "pending_review" | "accepted" | "declined" | "nda_requested";
  createdAt: string;
}

export interface MessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole | "system";
  content: string;
  timestamp: string;
  isRead: boolean;
  isSystemNotice?: boolean;
}

export interface Conversation {
  id: string;
  listingId: string;
  listingTitle: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCountBuyer: number;
  unreadCountSeller: number;
  dealRecordId?: string;
  status: "active" | "archived" | "blocked";
  meetingScheduled?: {
    date: string;
    time: string;
    agenda: string;
    platform: "VyapaarSetu Secure Audio/Video" | "In-Person Meeting";
    status: "scheduled" | "completed" | "rescheduled";
  };
}

export type DealStage = 
  | "inquiry_received"
  | "seller_reviewing"
  | "buyer_qualified"
  | "initial_conversation"
  | "nda_step"
  | "information_shared"
  | "due_diligence"
  | "loi_or_offer"
  | "negotiation"
  | "definitive_agreements"
  | "closed_successfully"
  | "closed_unsuccessfully"
  | "withdrawn";

export interface DealRecord {
  id: string;
  listingId: string;
  listingTitle: string;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  currentStage: DealStage;
  firstContactDate: string;
  platformAttributionWindowEnds: string; // Typically 180 days from introduction
  indicativeDealValue: number;
  finalTransactionValue?: number;
  commissionRatePct: number; // e.g. 2.0%
  expectedCommission: number;
  commissionAgreementSigned: boolean;
  commissionAgreementVersion: string;
  closingNotificationDate?: string;
  substantiatedEvidence?: string;
  invoiceId?: string;
  stageHistory: {
    stage: DealStage;
    timestamp: string;
    updatedBy: string;
    notes?: string;
  }[];
}

export interface PlatformFeePlan {
  id: string;
  planName: string;
  price: number;
  period: "one_time" | "monthly";
  features: string[];
  recommended: boolean;
  isActive: boolean;
}

export interface CommissionConfig {
  id: string;
  category: string;
  commissionType: "percentage" | "fixed_tiered";
  percentageRate: number; // e.g. 2.0
  minFee: number;
  maxFee?: number;
  attributionWindowDays: number; // 180
  gstApplicablePct: number; // 18% GST in India
  activeContractVersion: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  dealRecordId: string;
  userId: string;
  userName: string;
  amount: number;
  gstAmount: number;
  totalAmount: number;
  dueDate: string;
  status: "draft" | "issued" | "paid" | "overdue" | "cancelled";
  issuedAt: string;
  paidAt?: string;
  paymentReference?: string;
}

export interface ComplaintReport {
  id: string;
  reporterId: string;
  reporterRole: UserRole;
  targetListingId?: string;
  targetUserId?: string;
  targetTitle: string;
  reason: "misleading_financials" | "unauthorized_listing" | "circumvention_attempt" | "harassment" | "fraudulent_identity" | "other";
  details: string;
  evidenceNotes?: string;
  status: "open" | "investigating" | "resolved" | "dismissed";
  resolutionAction?: string;
  createdAt: string;
  resolvedAt?: string;
  assignedAdminId?: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  targetEntity: "listing" | "user" | "document" | "nda" | "deal" | "invoice" | "config";
  targetId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}
