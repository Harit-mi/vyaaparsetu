import {
  User,
  BuyerProfile,
  SellerProfile,
  BusinessListing,
  ListingDocument,
  ConfidentialityAgreement,
  Inquiry,
  Conversation,
  MessageItem,
  DealRecord,
  PlatformFeePlan,
  CommissionConfig,
  Invoice,
  ComplaintReport,
  AuditLogItem,
} from "@/types/marketplace";

// ----------------------------------------------------------------------------
// SEED MOCK USERS (Clearly distinguished roles for seamless demonstration)
// ----------------------------------------------------------------------------
export const SEED_USERS: User[] = [
  {
    id: "usr-admin-01",
    email: "compliance@vyapaarsetu.in",
    fullName: "Aarav Deshmukh",
    phone: "+91 98200 11223",
    role: "admin",
    isEmailVerified: true,
    isPhoneVerified: true,
    companyName: "VyapaarSetu Operations & Compliance Unit",
    city: "Mumbai",
    state: "Maharashtra",
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "usr-seller-01",
    email: "sunil.sharma@autotechpune.in",
    fullName: "Sunil Sharma",
    phone: "+91 98450 77889",
    role: "seller",
    isEmailVerified: true,
    isPhoneVerified: true,
    companyName: "Shree Ganesh Precision Forgings LLP",
    city: "Pune",
    state: "Maharashtra",
    createdAt: "2024-02-10T11:30:00Z",
  },
  {
    id: "usr-buyer-01",
    email: "vikram@vpcapital.in",
    fullName: "Vikram Patel",
    phone: "+91 99801 44556",
    role: "buyer",
    isEmailVerified: true,
    isPhoneVerified: true,
    companyName: "VP Growth Investments Ltd",
    city: "Bengaluru",
    state: "Karnataka",
    createdAt: "2024-03-01T14:15:00Z",
  },
  {
    id: "usr-seller-02",
    email: "priya.nair@saasflow.io",
    fullName: "Priya Nair",
    phone: "+91 97412 88990",
    role: "seller",
    isEmailVerified: true,
    isPhoneVerified: true,
    companyName: "ProcureEasy Software Technologies Pvt Ltd",
    city: "Bengaluru",
    state: "Karnataka",
    createdAt: "2024-02-18T10:00:00Z",
  },
];

export const SEED_BUYER_PROFILE: BuyerProfile = {
  id: "bp-01",
  userId: "usr-buyer-01",
  buyerType: "family_office",
  qualificationStatus: "qualified",
  preferredIndustries: ["Manufacturing", "B2B SaaS & Tech", "Healthcare & Diagnostics", "FMCG / Food"],
  preferredLocations: ["Maharashtra", "Karnataka", "Telangana", "Delhi NCR"],
  minBudget: 15000000, // ₹1.5 Cr
  maxBudget: 250000000, // ₹25 Cr
  acquisitionExperience: "1_to_3_acquisitions",
  intendedFundingSource: "self_funded",
  liquidCapitalRange: "₹10 Cr – ₹30 Cr Ready Reserves",
  verifiedIdentity: true,
  ndaSignedCount: 3,
  activeInquiriesCount: 2,
  bio: "Managing principal at family investment office targeting established cash-flow positive manufacturing and B2B SaaS businesses with >15% EBITDA margins.",
};

export const SEED_SELLER_PROFILE: SellerProfile = {
  id: "sp-01",
  userId: "usr-seller-01",
  verificationStatus: "verified_owner",
  idProofType: "pan",
  idProofReference: "AAAPS****K",
  authorityProofType: "mca_director_cin",
  verifiedAt: "2024-02-12T16:00:00Z",
  totalListingsCount: 1,
  successfulExitsCount: 1,
  reputationScore: 4.9,
};

// ----------------------------------------------------------------------------
// SEED BUSINESS LISTINGS (Realistic Indian Demographics & Audited Demarcations)
// ----------------------------------------------------------------------------
export const SEED_LISTINGS: BusinessListing[] = [
  {
    id: "list-auto-pune",
    slug: "precision-auto-forgings-pune",
    sellerId: "usr-seller-01",
    sellerProfileId: "sp-01",
    businessName: "Precision Tier-1 Automotive Machining & Forging Unit",
    displayTitle: "Profitable Tier-1 Automotive Components Manufacturer",
    tagline: "18-year operational track record supplying Bajaj, Tata & Mahindra with high-tonnage stamping presses.",
    industry: "Manufacturing",
    subCategory: "Automotive Ancillary",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    postalCodeArea: "Chakan Industrial Belt, Pune",
    askingPrice: 85000000, // ₹8.5 Cr
    annualRevenue: 142000000, // ₹14.2 Cr
    annualEbitda: 23500000, // ₹2.35 Cr (16.5% EBITDA)
    inventoryValueIncluded: 18000000, // ₹1.8 Cr raw steel coils & WIP
    assetsValueIncluded: 42000000, // ₹4.2 Cr German CNC & hydraulic press lines
    financialReportingPeriod: "FY2023-24 (Audited)",
    isFinancialVerified: true,
    financialVerificationNote: "Audited Tax Audit Report (Form 3CD) and 3 years GST GSTR-9 returns cross-verified by CA panel.",
    financialRanges: {
      askingPriceRange: "₹8.0 Cr – ₹9.0 Cr",
      revenueRange: "₹14.0 Cr – ₹15.0 Cr",
      ebitdaRange: "₹2.2 Cr – ₹2.5 Cr (16.5% Margin)",
    },
    yearsInOperation: 18,
    businessType: "physical",
    teamSizeRange: "51-150",
    saleStructure: "share_sale",
    franchiseAvailable: false,
    executiveSummary: "Established precision machining company located in the prime Chakan industrial corridor of Pune. Possesses IATF 16949:2016 automotive certification and long-term supply contracts with major OEM tier-1 vendors. Facility covers 25,000 sq ft MIDC leased plot with 65 years remaining on industrial lease.",
    productsAndServices: [
      "High-precision forged transmission shafts",
      "Hydraulic steering control blocks",
      "Aluminium die-cast sub-assemblies for EV 2-wheelers",
      "Custom tooling & jig fabrication",
    ],
    customerSegments: ["OEM Tier-1 Vendors", "Commercial Vehicle Assemblers", "Industrial Tractor Manufacturers"],
    operatingModel: "B2B long-term procurement framework with cost-plus raw material indexation clause, insulating from steel price spikes.",
    growthOpportunities: [
      "35% unutilized capacity during 3rd shift can support EV component manufacturing",
      "Export inquiries pending from European agricultural equipment suppliers",
      "Solar rooftop installation pending which could reduce monthly power tariff by ₹2.4 Lakhs",
    ],
    assetsIncluded: [
      "12 Haas & Mazak CNC Vertical Machining Centers (Fully unencumbered)",
      "2 500-ton hydraulic forging presses",
      "Quality inspection lab with Zeiss 3D CMM scanner",
      "MIDC Industrial shed & electrical sub-station (250 KVA sanctioned load)",
    ],
    reasonForSale: "Promoter reaching retirement age (67 years); second generation settled abroad in robotics research.",
    visibility: "public",
    status: "published",
    isPaused: false,
    isFeatured: true,
    requiresNdaForFinancials: true,
    sellerVerificationStatus: "verified_owner",
    viewsCount: 1420,
    inquiriesCount: 14,
    savedCount: 38,
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-03-20T12:00:00Z",
    lastUpdatedDate: "2024-03-24",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    ],
    matchScore: 96,
  },
  {
    id: "list-saas-blr",
    slug: "procureeasy-saas-bengaluru",
    sellerId: "usr-seller-02",
    sellerProfileId: "sp-02",
    businessName: "ProcureEasy Enterprise Cloud Platform",
    displayTitle: "Profitable B2B Enterprise Vendor & Sourcing SaaS",
    tagline: "₹38L MRR with 118% Net Revenue Retention across 45 mid-market enterprise manufacturing clients.",
    industry: "B2B SaaS & Tech",
    subCategory: "Enterprise Cloud Software",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    postalCodeArea: "HSR Layout, Bengaluru",
    askingPrice: 120000000, // ₹12.0 Cr
    annualRevenue: 48000000, // ₹4.8 Cr
    annualEbitda: 19200000, // ₹1.92 Cr (40% EBITDA)
    inventoryValueIncluded: 0,
    assetsValueIncluded: 8500000, // Proprietary codebase, trademarks, SOC2 certifications
    financialReportingPeriod: "FY2024-25 (Management MIS)",
    isFinancialVerified: true,
    financialVerificationNote: "Stripe & Razorpay payment logs verified; 12-month bank statement reconcile matches claimed ARR.",
    financialRanges: {
      askingPriceRange: "₹11.0 Cr – ₹13.0 Cr",
      revenueRange: "₹4.5 Cr – ₹5.0 Cr ARR",
      ebitdaRange: "₹1.8 Cr – ₹2.1 Cr (40% EBITDA)",
    },
    yearsInOperation: 5,
    businessType: "online",
    teamSizeRange: "16-50",
    saleStructure: "share_sale",
    franchiseAvailable: false,
    executiveSummary: "Cloud-native indirect procurement and vendor management software tailored to Indian GST compliance. Integrates out of the box with SAP, Tally Prime, and Zoho Books. Low churn rate of <0.7% monthly with average contract duration of 24 months paid annually in advance.",
    productsAndServices: [
      "Vendor reverse-auction portal",
      "Automated 3-way invoice matching with GSTIN e-invoice portal",
      "Spend analytics & purchase order compliance engine",
      "Custom workflow APIs for ERP systems",
    ],
    customerSegments: ["Mid-market FMCG", "Textile & Garment Exporters", "Pharma Formulations"],
    operatingModel: "Pure subscription SaaS (ARR) with annual upfront billing; AWS cloud infrastructure managed by dedicated DevOps team.",
    growthOpportunities: [
      "Launch of international edition for Middle East (UAE & Saudi) where GST/VAT laws align",
      "Upsell vendor financing module with partnering NBFCs for additional take-rate",
      "Build field-service procurement for infrastructure subcontractors",
    ],
    assetsIncluded: [
      "100% proprietary intellectual property with full copyright assignment",
      "Registered trademarks in India and Singapore",
      "SOC-2 Type II and ISO 27001 certifications",
      "Customer contracts, master service agreements, and automated CI/CD pipeline",
    ],
    reasonForSale: "Founders seeking full acquisition to transition toward their AI research lab.",
    visibility: "partially_confidential",
    status: "published",
    isPaused: false,
    isFeatured: true,
    requiresNdaForFinancials: true,
    sellerVerificationStatus: "verified_owner",
    viewsCount: 2890,
    inquiriesCount: 29,
    savedCount: 72,
    createdAt: "2024-03-05T08:30:00Z",
    updatedAt: "2024-03-24T15:20:00Z",
    lastUpdatedDate: "2024-03-25",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    ],
    matchScore: 92,
  },
  {
    id: "list-cloudkit-mum",
    slug: "bombae-crust-cloud-kitchen-mumbai",
    sellerId: "usr-seller-03",
    sellerProfileId: "sp-03",
    businessName: "Bombae Crust & Biryani Central",
    displayTitle: "High-Margin QSR & Cloud Kitchen Network (7 Outlets)",
    tagline: "Established delivery-first food brand across Mumbai Western suburbs with 4.3+ Zomato/Swiggy rating.",
    industry: "FMCG / Food",
    subCategory: "Food & Beverage / QSR",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    postalCodeArea: "Andheri West, Bandra, Powai, Borivali",
    askingPrice: 32000000, // ₹3.2 Cr
    annualRevenue: 54000000, // ₹5.4 Cr
    annualEbitda: 8600000, // ₹86 Lakhs (16% EBITDA)
    inventoryValueIncluded: 1200000, // ₹12 L frozen stock & packaging
    assetsValueIncluded: 9500000, // Commercial kitchen equipment & cold rooms
    financialReportingPeriod: "TTM (Trailing 12 Months)",
    isFinancialVerified: false,
    financialVerificationNote: "Figures derived from seller management MIS and Swiggy/Zomato merchant dashboard statements.",
    financialRanges: {
      askingPriceRange: "₹3.0 Cr – ₹3.5 Cr",
      revenueRange: "₹5.0 Cr – ₹5.5 Cr GMV",
      ebitdaRange: "₹80 L – ₹90 L (16% Margin)",
    },
    yearsInOperation: 4,
    businessType: "hybrid",
    teamSizeRange: "16-50",
    saleStructure: "asset_sale",
    franchiseAvailable: true,
    executiveSummary: "Rapidly expanding QSR brand operating 7 high-density delivery hubs and 2 express takeaway counters. Standardized central prep kitchen in Goregaon ensures zero recipe deviation and 22% food cost margin. POS integrated with UrbanPiper.",
    productsAndServices: [
      "Signature artisanal sourdough pizzas",
      "Authentic Dum Biryanis in clay handis",
      "Late-night dessert and mocktail delivery",
      "Corporate catering boxes for BKC offices",
    ],
    customerSegments: ["Young professionals", "Late-night Gen Z diners", "Corporate catering desks"],
    operatingModel: "Centralized commissary model supplying pre-portioned cold cuts and gravies to satellite kitchens with 10-minute turnaround.",
    growthOpportunities: [
      "Expand into Navi Mumbai and Thane via franchise model",
      "Launch ready-to-cook packaged spice mixes into gourmet supermarkets (Nature's Basket)",
      "Add corporate lunch subscription app",
    ],
    assetsIncluded: [
      "Rational combi-ovens and blast chillers across all 7 operational kitchens",
      "Central commissary leasehold improvements and cold storage facility",
      "Active brand IP, recipes, SOP manuals, and supplier credit lines",
      "UrbanPiper & POS cloud account transfer",
    ],
    reasonForSale: "Co-founder relocating to UK for family reasons; remaining partner unable to manage multiple hubs alone.",
    visibility: "public",
    status: "published",
    isPaused: false,
    isFeatured: false,
    requiresNdaForFinancials: true,
    sellerVerificationStatus: "verified_owner",
    viewsCount: 1150,
    inquiriesCount: 11,
    savedCount: 24,
    createdAt: "2024-03-10T14:00:00Z",
    updatedAt: "2024-03-22T09:10:00Z",
    lastUpdatedDate: "2024-03-22",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    ],
    matchScore: 84,
  },
  {
    id: "list-pharma-hyd",
    slug: "sterile-formulations-plant-hyderabad",
    sellerId: "usr-seller-04",
    sellerProfileId: "sp-04",
    businessName: "WHO-GMP Certified Sterile Injectables Formulation Unit",
    displayTitle: "WHO-GMP Sterile Liquid Formulations Plant",
    tagline: "Turnkey USFDA-compliant layout in Genome Valley with DCGI approvals for 42 oncology & antibiotic molecules.",
    industry: "Healthcare & Diagnostics",
    subCategory: "Pharmaceutical Manufacturing",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    postalCodeArea: "Genome Valley, Shamirpet, Hyderabad",
    askingPrice: 380000000, // ₹38.0 Cr
    annualRevenue: 520000000, // ₹52.0 Cr
    annualEbitda: 88000000, // ₹8.8 Cr (17% EBITDA)
    inventoryValueIncluded: 45000000, // ₹4.5 Cr API raw chemicals & sterile vials
    assetsValueIncluded: 160000000, // Class-100 clean rooms, autoclaves & lyophilizers
    financialReportingPeriod: "FY2023-24 (Audited)",
    isFinancialVerified: true,
    financialVerificationNote: "Statutory Auditor report signed by ICAI chartered firm; DCGI compliance certification valid till 2027.",
    financialRanges: {
      askingPriceRange: "₹36 Cr – ₹40 Cr",
      revenueRange: "₹50 Cr – ₹55 Cr",
      ebitdaRange: "₹8.5 Cr – ₹9.2 Cr (17% EBITDA)",
    },
    yearsInOperation: 12,
    businessType: "physical",
    teamSizeRange: "150+",
    saleStructure: "share_sale",
    franchiseAvailable: false,
    executiveSummary: "Premier sterile pharmaceutical manufacturing company situated on 3 acres of freehold industrial land in Hyderabad's biotechnology hub. Currently executing contract manufacturing for domestic generic giants and exporting to ASEAN & CIS nations.",
    productsAndServices: [
      "Small volume parenterals (SVP) in glass ampoules",
      "Lyophilized sterile powders for injection",
      "Ophthalmic drops in automated BFS (Blow-Fill-Seal) lines",
      "Analytical stability testing lab services",
    ],
    customerSegments: ["Large Indian Pharma MNCs", "Government Tender Authorities", "Export Distributors in Vietnam & Uzbekistan"],
    operatingModel: "Contract manufacturing under loan licensing and third-party manufacturing models with guaranteed volume commitments.",
    growthOpportunities: [
      "Phase-II expansion ready with existing HVAC for pre-filled syringes (PFS)",
      "EU-GMP inspection audit scheduled which will open European high-margin markets",
      "Biosimilar fill-finish opportunities",
    ],
    assetsIncluded: [
      "3-acre freehold land with 45,000 sq ft built-up GMP production cleanrooms",
      "IMA automated vial filling line (12,000 vials/hour)",
      "Telstar Lyophilizer (100 sq ft shelf area)",
      "Dedicated effluent treatment plant (Zero Liquid Discharge compliant)",
    ],
    reasonForSale: "Promoters divesting formulation assets to focus exclusively on active pharmaceutical ingredient (API) synthesis.",
    visibility: "strictly_confidential",
    status: "published",
    isPaused: false,
    isFeatured: true,
    requiresNdaForFinancials: true,
    sellerVerificationStatus: "verified_owner",
    viewsCount: 3100,
    inquiriesCount: 18,
    savedCount: 54,
    createdAt: "2024-02-20T11:00:00Z",
    updatedAt: "2024-03-25T16:00:00Z",
    lastUpdatedDate: "2024-03-25",
    imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1579165466791-78822231cb67?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
    ],
    matchScore: 89,
  },
  {
    id: "list-d2c-ahmedabad",
    slug: "vedicroots-ayurvedic-d2c-ahmedabad",
    sellerId: "usr-seller-05",
    sellerProfileId: "sp-05",
    businessName: "VedicRoots Herbal Personal Care",
    displayTitle: "Profitable Ayurvedic Hair & Skin Care D2C Brand",
    tagline: "₹1.2 Cr monthly GMV on Shopify + Nykaa with 44% repeat order rate and Ayush Ministry certifications.",
    industry: "Retail & E-commerce",
    subCategory: "D2C Personal Care",
    city: "Ahmedabad",
    state: "Gujarat",
    country: "India",
    postalCodeArea: "Prahlad Nagar, Ahmedabad",
    askingPrice: 45000000, // ₹4.5 Cr
    annualRevenue: 145000000, // ₹14.5 Cr
    annualEbitda: 21500000, // ₹2.15 Cr (14.8% EBITDA)
    inventoryValueIncluded: 8500000, // ₹85 L inventory in Delhivery & Amazon FBA warehouses
    assetsValueIncluded: 4200000, // Formulations, Ayush licenses, digital assets
    financialReportingPeriod: "FY2024-25 (Management MIS)",
    isFinancialVerified: true,
    financialVerificationNote: "Shopify GMV and Razorpay settlement logs verified; Blended ROAS tracked at 3.1x.",
    financialRanges: {
      askingPriceRange: "₹4.2 Cr – ₹4.8 Cr",
      revenueRange: "₹14 Cr – ₹15 Cr GMV",
      ebitdaRange: "₹2.0 Cr – ₹2.3 Cr",
    },
    yearsInOperation: 3,
    businessType: "online",
    teamSizeRange: "16-50",
    saleStructure: "share_sale",
    franchiseAvailable: false,
    executiveSummary: "Clean Ayurveda personal care brand enjoying strong cult following. 60% revenue originates from organic brand search and email marketing sequences. Clean debt-free balance sheet with high gross margin of 68%.",
    productsAndServices: [
      "Rosemary & Bhringraj Scalp Therapy Oil",
      "Kumkumadi Radiance Face Serum",
      "Sulphate-free Onion Keratin Shampoo",
      "Kansa Wand holistic massage kits",
    ],
    customerSegments: ["Urban females 22-38", "Clean beauty consumers", "Tier 2 gift buyers"],
    operatingModel: "Third-party contract manufacturing under proprietary AYUSH licensed formulas; distribution via D2C site, Amazon, Nykaa, and Blinkit.",
    growthOpportunities: [
      "Offline modern trade entry into Wellness Forever & Health & Glow",
      "Quick-commerce expansion (Instamart & Zepto) currently under-indexed",
      "International Amazon US brand registry launched with zero ad spend yet",
    ],
    assetsIncluded: [
      "Proprietary 34 AYUSH approved formulas and stability test records",
      "D2C Shopify store with 180,000 customer email/phone database",
      "Instagram account with 145,000 organic followers",
      "Amazon Seller Central account (Brand Registry 2.0)",
    ],
    reasonForSale: "Founders seeking liquidity after 3 years of bootstrapped scaling without external venture funding.",
    visibility: "public",
    status: "published",
    isPaused: false,
    isFeatured: false,
    requiresNdaForFinancials: true,
    sellerVerificationStatus: "verified_owner",
    viewsCount: 1840,
    inquiriesCount: 22,
    savedCount: 61,
    createdAt: "2024-03-12T13:45:00Z",
    updatedAt: "2024-03-24T11:20:00Z",
    lastUpdatedDate: "2024-03-24",
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1608248597359-0f04e8d26ea3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80",
    ],
    matchScore: 81,
  },
  {
    id: "list-logistics-delhi",
    slug: "northstar-cold-chain-fleet-delhi",
    sellerId: "usr-seller-06",
    sellerProfileId: "sp-06",
    businessName: "Northstar Express Cold-Chain Fleet",
    displayTitle: "Temperature-Controlled Logistics & Reefer Fleet",
    tagline: "42 GPS-enabled reefer trucks on fixed long-term dairy and quick-commerce dark store replenishment runs.",
    industry: "Logistics & Supply Chain",
    subCategory: "Cold Chain Transport",
    city: "Gurugram",
    state: "Delhi NCR",
    country: "India",
    postalCodeArea: "Manesar Transport Nagar, Gurugram",
    askingPrice: 62000000, // ₹6.2 Cr
    annualRevenue: 98000000, // ₹9.8 Cr
    annualEbitda: 14800000, // ₹1.48 Cr (15.1% EBITDA)
    inventoryValueIncluded: 1500000, // Spare parts & diesel storage tank
    assetsValueIncluded: 38000000, // 42 Ashok Leyland & Tata Reefer Trucks
    financialReportingPeriod: "FY2023-24 (Audited)",
    isFinancialVerified: true,
    financialVerificationNote: "Vehicle registration certificates (RCs), fitness certificates, and VAHAN database records verified.",
    financialRanges: {
      askingPriceRange: "₹5.8 Cr – ₹6.5 Cr",
      revenueRange: "₹9.5 Cr – ₹10.2 Cr",
      ebitdaRange: "₹1.4 Cr – ₹1.6 Cr",
    },
    yearsInOperation: 9,
    businessType: "physical",
    teamSizeRange: "51-150",
    saleStructure: "asset_sale",
    franchiseAvailable: false,
    executiveSummary: "Specialized cold-chain fleet operating across Delhi NCR, Punjab, and Uttar Pradesh. Exclusive logistics vendor to 2 national ice-cream brands and 3 quick-commerce warehouse hubs. All vehicles average under 4.5 years of age.",
    productsAndServices: [
      "-20°C Deep freeze transport (Ice cream & meat)",
      "2°C to 8°C Chilled pharmaceutical cargo",
      "Real-time IoT temperature logging & telematics portal",
    ],
    customerSegments: ["Dairy Cooperatives", "Quick-commerce supply chains", "Multinational confectioneries"],
    operatingModel: "Monthly dedicated lease contracts with minimum guaranteed kilometers plus diesel price escalation clauses.",
    growthOpportunities: [
      "Acquire 15 additional medium-duty reefers to service expanding quick-commerce dark stores",
      "Launch return-trip pharmaceutical consolidation service",
    ],
    assetsIncluded: [
      "42 fully-owned refrigerated trucks with Carrier & Thermo King units",
      "IoT telematics software license & control room setup in Manesar",
      "Long-term client master transportation agreements",
    ],
    reasonForSale: "Partner moving into commercial real estate development.",
    visibility: "public",
    status: "published",
    isPaused: false,
    isFeatured: false,
    requiresNdaForFinancials: false,
    sellerVerificationStatus: "verified_owner",
    viewsCount: 920,
    inquiriesCount: 8,
    savedCount: 19,
    createdAt: "2024-03-14T09:15:00Z",
    updatedAt: "2024-03-23T14:30:00Z",
    lastUpdatedDate: "2024-03-23",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
    ],
    matchScore: 78,
  },
];

// ----------------------------------------------------------------------------
// SEED DOCUMENTS (Vault metadata - zero public exposure without signed NDA)
// ----------------------------------------------------------------------------
export const SEED_DOCUMENTS: ListingDocument[] = [
  {
    id: "doc-auto-01",
    listingId: "list-auto-pune",
    title: "FY2023-24 Audited Financial Statement & Tax Audit (Form 3CB-3CD)",
    category: "audit_report",
    fileName: "Audited_Financials_FY24_ShreeGaneshForging.pdf",
    fileSize: "4.8 MB",
    isConfidential: true,
    uploadedAt: "2024-02-15T11:00:00Z",
    downloadRestricted: true,
    accessCount: 14,
  },
  {
    id: "doc-auto-02",
    listingId: "list-auto-pune",
    title: "Detailed Plant & Machinery Valuation Register (Chartered Engineer Certified)",
    category: "asset_register",
    fileName: "Chartered_Engineer_Asset_Appraisal_Report.pdf",
    fileSize: "6.2 MB",
    isConfidential: true,
    uploadedAt: "2024-02-16T14:30:00Z",
    downloadRestricted: true,
    accessCount: 9,
  },
  {
    id: "doc-auto-03",
    listingId: "list-auto-pune",
    title: "Confidential Information Memorandum (CIM & Operations Deck)",
    category: "pitch_deck",
    fileName: "Confidential_Information_Memorandum_2024.pdf",
    fileSize: "12.4 MB",
    isConfidential: true,
    uploadedAt: "2024-02-18T16:00:00Z",
    downloadRestricted: true,
    accessCount: 22,
  },
  {
    id: "doc-saas-01",
    listingId: "list-saas-blr",
    title: "SaaS Cohort Retention, LTV/CAC & Unit Economics Model (Excel Model)",
    category: "financial_mis",
    fileName: "Cohort_Unit_Economics_ProcureEasy_FY24.xlsx",
    fileSize: "2.1 MB",
    isConfidential: true,
    uploadedAt: "2024-02-22T09:00:00Z",
    downloadRestricted: true,
    accessCount: 31,
  },
  {
    id: "doc-saas-02",
    listingId: "list-saas-blr",
    title: "SOC-2 Type II Independent Service Auditor Security Report",
    category: "audit_report",
    fileName: "SOC2_TypeII_Report_2024.pdf",
    fileSize: "3.5 MB",
    isConfidential: true,
    uploadedAt: "2024-02-23T11:15:00Z",
    downloadRestricted: true,
    accessCount: 16,
  },
];

// ----------------------------------------------------------------------------
// SEED NDAs (Digital Confidentiality Agreements)
// ----------------------------------------------------------------------------
export const SEED_NDAS: ConfidentialityAgreement[] = [
  {
    id: "nda-01",
    listingId: "list-auto-pune",
    buyerId: "usr-buyer-01",
    buyerName: "Vikram Patel",
    buyerEmail: "vikram@vpcapital.in",
    buyerCompany: "VP Growth Investments Ltd",
    status: "approved_active",
    signedAt: "2024-03-02T11:45:00Z",
    validUntil: "2024-09-02T11:45:00Z",
    ipAddress: "49.207.182.41 (Bengaluru, IN)",
    watermarkText: "CONFIDENTIAL — LICENSED TO VIKRAM PATEL (VP CAPITAL) — IP: 49.207.182.41",
    agreementVersion: "v1.4-in",
    termsAccepted: true,
  },
  {
    id: "nda-02",
    listingId: "list-saas-blr",
    buyerId: "usr-buyer-01",
    buyerName: "Vikram Patel",
    buyerEmail: "vikram@vpcapital.in",
    buyerCompany: "VP Growth Investments Ltd",
    status: "pending_seller_approval",
    signedAt: "2024-03-24T18:30:00Z",
    validUntil: "2024-09-24T18:30:00Z",
    ipAddress: "49.207.182.41 (Bengaluru, IN)",
    watermarkText: "PENDING APPROVAL — VIKRAM PATEL",
    agreementVersion: "v1.4-in",
    termsAccepted: true,
  },
];

// ----------------------------------------------------------------------------
// SEED INQUIRIES & CONVERSATIONS
// ----------------------------------------------------------------------------
export const SEED_INQUIRIES: Inquiry[] = [
  {
    id: "inq-01",
    listingId: "list-auto-pune",
    listingTitle: "Profitable Tier-1 Automotive Components Manufacturer (Pune)",
    sellerId: "usr-seller-01",
    buyerId: "usr-buyer-01",
    buyerName: "Vikram Patel",
    buyerEmail: "vikram@vpcapital.in",
    buyerPhone: "+91 99801 44556",
    buyerType: "family_office",
    message: "We have reviewed your teaser and signed the bilateral NDA. We operate a small PE vehicle focused on precision auto-components and are keen to inspect the Chakan unit and meet Mr. Sharma.",
    intendedFundingSource: "Full Equity Reserves (No Bank Debt Contingency)",
    indicativeOfferBudget: 85000000,
    timelineMonths: 2,
    status: "accepted",
    createdAt: "2024-03-02T12:00:00Z",
  },
  {
    id: "inq-02",
    listingId: "list-saas-blr",
    listingTitle: "Profitable B2B Enterprise Vendor & Sourcing SaaS",
    sellerId: "usr-seller-02",
    buyerId: "usr-buyer-01",
    buyerName: "Vikram Patel",
    buyerEmail: "vikram@vpcapital.in",
    buyerPhone: "+91 99801 44556",
    buyerType: "family_office",
    message: "Interested in the enterprise cohort dynamics and churn profile. We submitted an NDA request and would like to review the financial model.",
    intendedFundingSource: "Self-funded / Partner Equity",
    indicativeOfferBudget: 115000000,
    timelineMonths: 3,
    status: "pending_review",
    createdAt: "2024-03-24T18:35:00Z",
  },
];

export const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-01",
    listingId: "list-auto-pune",
    listingTitle: "Profitable Tier-1 Automotive Components Manufacturer",
    buyerId: "usr-buyer-01",
    buyerName: "Vikram Patel",
    sellerId: "usr-seller-01",
    sellerName: "Sunil Sharma",
    lastMessage: "Plant visit confirmed for this Thursday 11:30 AM at Chakan Phase II facility. Looking forward to our discussion.",
    lastMessageTime: "2024-03-22T14:10:00Z",
    unreadCountBuyer: 0,
    unreadCountSeller: 0,
    dealRecordId: "deal-01",
    status: "active",
    meetingScheduled: {
      date: "2024-03-28",
      time: "11:30 AM IST",
      agenda: "Facility Walkthrough & CNC Inspection with Lead Metallurgical Engineer",
      platform: "In-Person Meeting",
      status: "scheduled",
    },
  },
];

export const SEED_MESSAGES: MessageItem[] = [
  {
    id: "msg-01",
    conversationId: "conv-01",
    senderId: "usr-buyer-01",
    senderName: "Vikram Patel",
    senderRole: "buyer",
    content: "Namaste Mr. Sharma. Thank you for approving our NDA and granting access to the FY24 audit reports. Our technical diligence lead has reviewed the Haas CNC schedules.",
    timestamp: "2024-03-03T10:15:00Z",
    isRead: true,
  },
  {
    id: "msg-02",
    conversationId: "conv-01",
    senderId: "usr-seller-01",
    senderName: "Sunil Sharma",
    senderRole: "seller",
    content: "Namaste Vikram ji. Pleased to connect with VP Capital. All 12 CNC centers are fully unencumbered with zero hypothecation. Would you like to schedule an on-site visit to inspect the facility?",
    timestamp: "2024-03-03T11:00:00Z",
    isRead: true,
  },
  {
    id: "msg-03",
    conversationId: "conv-01",
    senderId: "system",
    senderName: "VyapaarSetu Deal Tracker",
    senderRole: "system",
    content: "Notice: Deal stage updated to 'Due Diligence'. Both parties acknowledge that introductions and transactions stemming from this exchange are subject to the VyapaarSetu Commission Terms (Version v2024-in).",
    timestamp: "2024-03-15T09:30:00Z",
    isRead: true,
    isSystemNotice: true,
  },
  {
    id: "msg-04",
    conversationId: "conv-01",
    senderId: "usr-seller-01",
    senderName: "Sunil Sharma",
    senderRole: "seller",
    content: "Plant visit confirmed for this Thursday 11:30 AM at Chakan Phase II facility. Looking forward to our discussion.",
    timestamp: "2024-03-22T14:10:00Z",
    isRead: true,
  },
];

// ----------------------------------------------------------------------------
// SEED DEAL RECORDS & ATTRIBUTION PIPELINE
// ----------------------------------------------------------------------------
export const SEED_DEALS: DealRecord[] = [
  {
    id: "deal-01",
    listingId: "list-auto-pune",
    listingTitle: "Profitable Tier-1 Automotive Components Manufacturer",
    sellerId: "usr-seller-01",
    sellerName: "Sunil Sharma (Shree Ganesh Forgings)",
    buyerId: "usr-buyer-01",
    buyerName: "Vikram Patel (VP Capital)",
    currentStage: "due_diligence",
    firstContactDate: "2024-03-02T12:00:00Z",
    platformAttributionWindowEnds: "2024-08-29T12:00:00Z", // 180 days policy
    indicativeDealValue: 85000000, // ₹8.5 Cr
    commissionRatePct: 2.0, // 2% marketplace success commission
    expectedCommission: 1700000, // ₹17.0 Lakhs (+ 18% GST)
    commissionAgreementSigned: true,
    commissionAgreementVersion: "v2024-in",
    stageHistory: [
      {
        stage: "inquiry_received",
        timestamp: "2024-03-02T12:00:00Z",
        updatedBy: "System (Inquiry Submitted)",
        notes: "Inquiry generated through VyapaarSetu verified discovery engine.",
      },
      {
        stage: "buyer_qualified",
        timestamp: "2024-03-02T14:00:00Z",
        updatedBy: "Aarav Deshmukh (Admin)",
        notes: "Buyer KYC and capital reserves substantiated.",
      },
      {
        stage: "nda_step",
        timestamp: "2024-03-02T14:45:00Z",
        updatedBy: "Vikram Patel (Buyer)",
        notes: "Digital bilateral non-disclosure agreement executed with IP watermark.",
      },
      {
        stage: "information_shared",
        timestamp: "2024-03-03T09:00:00Z",
        updatedBy: "Sunil Sharma (Seller)",
        notes: "Granted access to full FY24 tax audit and machine schedules.",
      },
      {
        stage: "due_diligence",
        timestamp: "2024-03-15T09:30:00Z",
        updatedBy: "Vikram Patel (Buyer)",
        notes: "Engaged Big-4 legal and tax advisors for confirmatory diligence.",
      },
    ],
  },
];

// ----------------------------------------------------------------------------
// SEED PLATFORM FEE PLANS & COMMISSION CONFIGURATIONS
// ----------------------------------------------------------------------------
export const SEED_FEE_PLANS: PlatformFeePlan[] = [
  {
    id: "plan-launch-free",
    planName: "Launch Partner (Free Tier)",
    price: 0,
    period: "one_time",
    features: [
      "Standard marketplace listing placement",
      "Confidentiality & NDA management engine",
      "Direct buyer messaging & lead routing",
      "Standard document vault (up to 3 files)",
      "Standard 2% commission upon deal closing",
    ],
    recommended: false,
    isActive: true,
  },
  {
    id: "plan-verified-pro",
    planName: "Verified Institutional Listing",
    price: 14999, // ₹14,999
    period: "one_time",
    features: [
      "Chartered Accountant verified financial badge",
      "Priority placement on search results & homepage hero",
      "Full MCA / CIN & GST registration verification report",
      "Unlimited secure document storage with watermarking",
      "Dedicated acquisition deal coordinator",
      "Success commission: 1.75% upon closing",
    ],
    recommended: true,
    isActive: true,
  },
  {
    id: "plan-confidential-elite",
    planName: "Elite Confidential Mandate",
    price: 49999, // ₹49,999
    period: "one_time",
    features: [
      "Strictly blind teaser listing (zero identity leakage)",
      "Manual buyer pre-qualification before every NDA approval",
      "Custom Confidential Information Memorandum (CIM) creation",
      "Direct outreach to 100+ accredited family offices & funds",
      "Tailored escrow & closing coordination support",
      "Success commission: 1.5% upon closing",
    ],
    recommended: false,
    isActive: true,
  },
];

export const SEED_COMMISSION_CONFIG: CommissionConfig = {
  id: "cfg-main",
  category: "Standard Enterprise & SME Deals",
  commissionType: "percentage",
  percentageRate: 2.0, // 2%
  minFee: 100000, // ₹1.0 Lakh minimum
  maxFee: 5000000, // ₹50 Lakhs cap
  attributionWindowDays: 180, // 180 calendar days
  gstApplicablePct: 18.0, // 18% GST (CGST 9% + SGST 9% or IGST 18%)
  activeContractVersion: "v2024-in",
};

export const SEED_INVOICES: Invoice[] = [
  {
    id: "inv-2024-001",
    invoiceNumber: "VS/2024/03/INV-0104",
    dealRecordId: "deal-01",
    userId: "usr-seller-01",
    userName: "Sunil Sharma (Shree Ganesh Forgings)",
    amount: 14999,
    gstAmount: 2699.82,
    totalAmount: 17698.82,
    dueDate: "2024-03-10",
    status: "paid",
    issuedAt: "2024-02-12T10:00:00Z",
    paidAt: "2024-02-12T10:15:00Z",
    paymentReference: "pay_Razorpay_N9481kdpX",
  },
];

export const SEED_COMPLAINTS: ComplaintReport[] = [
  {
    id: "cmp-01",
    reporterId: "usr-buyer-02",
    reporterRole: "buyer",
    targetListingId: "list-logistics-delhi",
    targetTitle: "Temperature-Controlled Logistics & Reefer Fleet",
    reason: "misleading_financials",
    details: "Seller indicated 42 active trucks in operation, but VAHAN check indicates 6 vehicles have expired commercial fitness certificates.",
    evidenceNotes: "Attached VAHAN portal screenshot for fleet registration series DL-1L.",
    status: "investigating",
    createdAt: "2024-03-20T16:00:00Z",
  },
];

export const SEED_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "aud-01",
    action: "LISTING_APPROVED",
    actorId: "usr-admin-01",
    actorName: "Aarav Deshmukh (Admin)",
    actorRole: "admin",
    targetEntity: "listing",
    targetId: "list-auto-pune",
    details: "Approved listing after verifying Form 3CD audit report and MCA Director DIN matches seller identity.",
    ipAddress: "103.21.124.9 (Mumbai)",
    timestamp: "2024-03-01T10:00:00Z",
  },
  {
    id: "aud-02",
    action: "NDA_EXECUTED",
    actorId: "usr-buyer-01",
    actorName: "Vikram Patel (Buyer)",
    actorRole: "buyer",
    targetEntity: "nda",
    targetId: "nda-01",
    details: "Bilateral digital non-disclosure agreement digitally signed. IP address 49.207.182.41 logged.",
    ipAddress: "49.207.182.41 (Bengaluru)",
    timestamp: "2024-03-02T11:45:00Z",
  },
  {
    id: "aud-03",
    action: "DOCUMENT_VIEWED",
    actorId: "usr-buyer-01",
    actorName: "Vikram Patel (Buyer)",
    actorRole: "buyer",
    targetEntity: "document",
    targetId: "doc-auto-01",
    details: "Viewed encrypted PDF 'Audited_Financials_FY24_ShreeGaneshForging.pdf' with dynamic watermark.",
    ipAddress: "49.207.182.41 (Bengaluru)",
    timestamp: "2024-03-02T12:05:00Z",
  },
  {
    id: "aud-04",
    action: "DEAL_STAGE_ADVANCED",
    actorId: "usr-buyer-01",
    actorName: "Vikram Patel (Buyer)",
    actorRole: "buyer",
    targetEntity: "deal",
    targetId: "deal-01",
    details: "Deal advanced to Due Diligence stage. 180-day attribution clock active.",
    ipAddress: "49.207.182.41 (Bengaluru)",
    timestamp: "2024-03-15T09:30:00Z",
  },
];

// ----------------------------------------------------------------------------
// LOCAL STORAGE KEY & REACTIVE HELPERS
// ----------------------------------------------------------------------------
const STORAGE_PREFIX = "vyapaarsetu_";

export class MarketplaceStorage {
  private static isClient(): boolean {
    return typeof window !== "undefined";
  }

  private static get<T>(key: string, defaultValue: T): T {
    if (!this.isClient()) return defaultValue;
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static set<T>(key: string, value: T): void {
    if (!this.isClient()) return;
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      // Dispatch storage event so all tabs/components re-render
      window.dispatchEvent(new Event("vyapaarsetu_state_changed"));
    } catch (err) {
      console.error("Storage error:", err);
    }
  }

  // Current active logged in user for interactive testing
  static getCurrentUser(): User {
    return this.get<User>("current_user", SEED_USERS[2]); // Default as Vikram Patel (Buyer)
  }

  static setCurrentUser(user: User): void {
    this.set("current_user", user);
  }

  // Listings
  static getListings(): BusinessListing[] {
    return this.get<BusinessListing[]>("listings", SEED_LISTINGS);
  }

  static getListingById(id: string): BusinessListing | undefined {
    return this.getListings().find((l) => l.id === id);
  }

  static getListingBySlug(slugOrId: string): BusinessListing | undefined {
    return this.getListings().find((l) => l.slug === slugOrId || l.id === slugOrId);
  }

  static togglePauseListing(listingId: string): boolean {
    const list = this.getListings();
    const listing = list.find((l) => l.id === listingId);
    if (!listing) return false;
    listing.isPaused = !listing.isPaused;
    listing.updatedAt = new Date().toISOString();
    this.set("listings", list);
    this.logAudit(
      listing.isPaused ? "LISTING_PAUSED" : "LISTING_RESUMED",
      `Listing ${listing.displayTitle} was ${listing.isPaused ? "paused" : "resumed"}`,
      "listing",
      listing.id
    );
    return listing.isPaused;
  }

  static getBuyerProfile(): BuyerProfile {
    return this.get<BuyerProfile>("buyer_profile", SEED_BUYER_PROFILE);
  }

  static saveBuyerProfile(profile: BuyerProfile): void {
    this.set("buyer_profile", profile);
    this.logAudit("BUYER_PROFILE_UPDATED", `Acquisition preferences updated for ${profile.buyerType}`, "user", profile.userId);
  }

  static getMatchesForBuyer(): BusinessListing[] {
    const profile = this.getBuyerProfile();
    const listings = this.getListings().filter((l) => l.status === "published" && !l.isPaused);
    return listings.map((l) => {
      let score = 70;
      if (profile.preferredIndustries.includes(l.industry)) score += 15;
      if (profile.preferredLocations.some((loc) => l.state.includes(loc) || l.city.includes(loc))) score += 10;
      if (l.askingPrice >= profile.minBudget && l.askingPrice <= profile.maxBudget) score += 5;
      return { ...l, matchScore: Math.min(score, 98) };
    }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }

  static saveListing(listing: BusinessListing): void {
    const list = this.getListings();
    const index = list.findIndex((l) => l.id === listing.id);
    if (index >= 0) {
      list[index] = { ...listing, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({ ...listing, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.set("listings", list);
    this.logAudit("LISTING_SAVED", `Listing ${listing.displayTitle} saved with status ${listing.status}`, "listing", listing.id);
  }

  // Documents
  static getDocuments(): ListingDocument[] {
    return this.get<ListingDocument[]>("documents", SEED_DOCUMENTS);
  }

  static getDocumentsByListingId(listingId: string): ListingDocument[] {
    return this.getDocuments().filter((d) => d.listingId === listingId);
  }

  static addDocument(doc: ListingDocument): void {
    const docs = this.getDocuments();
    docs.unshift(doc);
    this.set("documents", docs);
    this.logAudit("DOCUMENT_UPLOADED", `Uploaded document ${doc.title} (${doc.category})`, "document", doc.id);
  }

  // NDAs
  static getNDAs(): ConfidentialityAgreement[] {
    return this.get<ConfidentialityAgreement[]>("ndas", SEED_NDAS);
  }

  static getNDAByListingAndBuyer(listingId: string, buyerId: string): ConfidentialityAgreement | undefined {
    return this.getNDAs().find((n) => n.listingId === listingId && n.buyerId === buyerId);
  }

  static signNDA(nda: ConfidentialityAgreement): void {
    const ndas = this.getNDAs();
    const existingIndex = ndas.findIndex((n) => n.listingId === nda.listingId && n.buyerId === nda.buyerId);
    if (existingIndex >= 0) {
      ndas[existingIndex] = nda;
    } else {
      ndas.unshift(nda);
    }
    this.set("ndas", ndas);
    this.logAudit("NDA_SIGNED", `NDA signed for listing ${nda.listingId} by ${nda.buyerName}`, "nda", nda.id);
  }

  // Inquiries
  static getInquiries(): Inquiry[] {
    return this.get<Inquiry[]>("inquiries", SEED_INQUIRIES);
  }

  static addInquiry(inquiry: Inquiry): void {
    const list = this.getInquiries();
    list.unshift(inquiry);
    this.set("inquiries", list);
    
    // Also create or link a conversation and a deal record automatically
    const deals = this.getDeals();
    const existingDeal = deals.find(d => d.listingId === inquiry.listingId && d.buyerId === inquiry.buyerId);
    if (!existingDeal) {
      const listing = this.getListingById(inquiry.listingId);
      const newDeal: DealRecord = {
        id: `deal-${Date.now()}`,
        listingId: inquiry.listingId,
        listingTitle: inquiry.listingTitle,
        sellerId: inquiry.sellerId,
        sellerName: "Seller Contact",
        buyerId: inquiry.buyerId,
        buyerName: inquiry.buyerName,
        currentStage: "inquiry_received",
        firstContactDate: new Date().toISOString(),
        platformAttributionWindowEnds: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        indicativeDealValue: inquiry.indicativeOfferBudget || (listing?.askingPrice || 5000000),
        commissionRatePct: 2.0,
        expectedCommission: ((inquiry.indicativeOfferBudget || (listing?.askingPrice || 5000000)) * 0.02),
        commissionAgreementSigned: true,
        commissionAgreementVersion: "v2024-in",
        stageHistory: [
          {
            stage: "inquiry_received",
            timestamp: new Date().toISOString(),
            updatedBy: inquiry.buyerName,
            notes: "Inquiry registered through marketplace.",
          },
        ],
      };
      deals.unshift(newDeal);
      this.set("deals", deals);
    }

    this.logAudit("INQUIRY_SUBMITTED", `Inquiry for ${inquiry.listingTitle} from ${inquiry.buyerName}`, "listing", inquiry.listingId);
  }

  // Deals
  static getDeals(): DealRecord[] {
    return this.get<DealRecord[]>("deals", SEED_DEALS);
  }

  static updateDealStage(dealId: string, stage: DealRecord["currentStage"], notes?: string): void {
    const deals = this.getDeals();
    const deal = deals.find((d) => d.id === dealId);
    if (deal) {
      deal.currentStage = stage;
      deal.stageHistory.push({
        stage,
        timestamp: new Date().toISOString(),
        updatedBy: this.getCurrentUser().fullName,
        notes,
      });
      this.set("deals", deals);
      this.logAudit("DEAL_STAGE_UPDATED", `Deal ${deal.listingTitle} moved to ${stage}`, "deal", deal.id);
    }
  }

  // Conversations & Messages
  static getConversations(): Conversation[] {
    return this.get<Conversation[]>("conversations", SEED_CONVERSATIONS);
  }

  static getMessages(): MessageItem[] {
    return this.get<MessageItem[]>("messages", SEED_MESSAGES);
  }

  static addMessage(msg: MessageItem): void {
    const messages = this.getMessages();
    messages.push(msg);
    this.set("messages", messages);

    // Update conversation last message
    const convs = this.getConversations();
    const conv = convs.find(c => c.id === msg.conversationId);
    if (conv) {
      conv.lastMessage = msg.content;
      conv.lastMessageTime = msg.timestamp;
      this.set("conversations", convs);
    }
  }

  // Saved Listings (Bookmarks)
  static getSavedListings(): string[] {
    return this.get<string[]>("saved_listings", ["list-auto-pune", "list-saas-blr"]);
  }

  static toggleSaveListing(listingId: string): boolean {
    const saved = this.getSavedListings();
    const idx = saved.indexOf(listingId);
    let isSaved = false;
    if (idx >= 0) {
      saved.splice(idx, 1);
      isSaved = false;
    } else {
      saved.push(listingId);
      isSaved = true;
    }
    this.set("saved_listings", saved);
    return isSaved;
  }

  // Fee Plans & Commission Config
  static getFeePlans(): PlatformFeePlan[] {
    return this.get<PlatformFeePlan[]>("fee_plans", SEED_FEE_PLANS);
  }

  static saveFeePlan(plan: PlatformFeePlan): void {
    const plans = this.getFeePlans();
    const idx = plans.findIndex(p => p.id === plan.id);
    if (idx >= 0) {
      plans[idx] = plan;
    } else {
      plans.push(plan);
    }
    this.set("fee_plans", plans);
  }

  static getCommissionConfig(): CommissionConfig {
    return this.get<CommissionConfig>("commission_config", SEED_COMMISSION_CONFIG);
  }

  static saveCommissionConfig(cfg: CommissionConfig): void {
    this.set("commission_config", cfg);
    this.logAudit("COMMISSION_CONFIG_UPDATED", `Updated commission rate to ${cfg.percentageRate}% with ${cfg.attributionWindowDays} days window`, "config", cfg.id);
  }

  // Invoices
  static getInvoices(): Invoice[] {
    return this.get<Invoice[]>("invoices", SEED_INVOICES);
  }

  static createInvoice(inv: Invoice): void {
    const invoices = this.getInvoices();
    invoices.unshift(inv);
    this.set("invoices", invoices);
    this.logAudit("INVOICE_GENERATED", `Invoice ${inv.invoiceNumber} issued for ${inv.totalAmount}`, "invoice", inv.id);
  }

  // Complaints & Grievances
  static getComplaints(): ComplaintReport[] {
    return this.get<ComplaintReport[]>("complaints", SEED_COMPLAINTS);
  }

  static addComplaint(cmp: ComplaintReport): void {
    const list = this.getComplaints();
    list.unshift(cmp);
    this.set("complaints", list);
    this.logAudit("COMPLAINT_FILED", `Complaint registered against ${cmp.targetTitle} for ${cmp.reason}`, "listing", cmp.targetListingId || "unknown");
  }

  // Audit Logs
  static getAuditLogs(): AuditLogItem[] {
    return this.get<AuditLogItem[]>("audit_logs", SEED_AUDIT_LOGS);
  }

  static logAudit(action: string, details: string, targetEntity: AuditLogItem["targetEntity"], targetId: string): void {
    const logs = this.getAuditLogs();
    const user = this.getCurrentUser();
    const item: AuditLogItem = {
      id: `aud-${Date.now()}`,
      action,
      actorId: user.id,
      actorName: user.fullName,
      actorRole: user.role,
      targetEntity,
      targetId,
      details,
      ipAddress: "103.48.196.22 (Verified Secure Session)",
      timestamp: new Date().toISOString(),
    };
    logs.unshift(item);
    this.set("audit_logs", logs);
  }

  // Reset to initial mock fixtures
  static resetToSeed(): void {
    if (!this.isClient()) return;
    localStorage.clear();
    window.dispatchEvent(new Event("vyapaarsetu_state_changed"));
  }
}
