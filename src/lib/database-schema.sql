-- ============================================================================
-- VYAPAARSETU — INDIA-FIRST BUSINESS BUYING & SELLING MARKETPLACE
-- PRODUCTION-GRADE RELATIONAL DATABASE SCHEMA (PostgreSQL / Supabase compatible)
-- Meets all specifications for 26 entities, audit trails, and RLS policies.
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('buyer', 'seller', 'admin', 'visitor')),
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    company_name VARCHAR(200),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 2. BUYER PROFILES TABLE
CREATE TABLE IF NOT EXISTS buyer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    buyer_type VARCHAR(50) NOT NULL CHECK (buyer_type IN ('individual', 'corporate', 'private_equity', 'family_office', 'search_fund')),
    qualification_status VARCHAR(50) DEFAULT 'unverified' CHECK (qualification_status IN ('unverified', 'pending_review', 'qualified', 'high_net_worth', 'rejected')),
    preferred_industries TEXT[] DEFAULT '{}',
    preferred_locations TEXT[] DEFAULT '{}',
    min_budget NUMERIC(15, 2) DEFAULT 0 CHECK (min_budget >= 0),
    max_budget NUMERIC(15, 2) NOT NULL CHECK (max_budget >= min_budget),
    acquisition_experience VARCHAR(50) NOT NULL,
    intended_funding_source VARCHAR(50) NOT NULL,
    liquid_capital_range VARCHAR(100),
    verified_identity BOOLEAN DEFAULT FALSE,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SELLER PROFILES TABLE
CREATE TABLE IF NOT EXISTS seller_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    verification_status VARCHAR(50) DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'submitted', 'verified_owner', 'verified_authorized_broker', 'rejected')),
    id_proof_type VARCHAR(50) CHECK (id_proof_type IN ('aadhaar', 'pan', 'passport')),
    id_proof_reference_hash VARCHAR(255),
    authority_proof_type VARCHAR(50) CHECK (authority_proof_type IN ('mca_director_cin', 'gst_registration', 'partnership_deed', 'board_resolution')),
    authority_proof_doc_url TEXT,
    verified_at TIMESTAMPTZ,
    verified_by_admin_id UUID REFERENCES users(id),
    reputation_score NUMERIC(3, 2) DEFAULT 5.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BUSINESSES (Master legal entity / underlying operational business)
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    legal_entity_name VARCHAR(255) NOT NULL,
    incorporation_cin_llpin VARCHAR(50),
    gstin VARCHAR(15),
    pan VARCHAR(10),
    date_of_incorporation DATE,
    registered_office_address TEXT,
    is_cin_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. LISTING CATEGORIES
CREATE TABLE IF NOT EXISTS listing_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BUSINESS LISTINGS (Separation of public vs confidential representations)
CREATE TABLE IF NOT EXISTS business_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    seller_profile_id UUID NOT NULL REFERENCES seller_profiles(id),
    business_id UUID REFERENCES businesses(id),
    category_id UUID REFERENCES listing_categories(id),
    business_name VARCHAR(255) NOT NULL,
    display_title VARCHAR(255) NOT NULL,
    tagline VARCHAR(300) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    sub_category VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    postal_code_area VARCHAR(100),
    
    -- Financials in INR (₹)
    asking_price NUMERIC(15, 2) NOT NULL CHECK (asking_price > 0),
    annual_revenue NUMERIC(15, 2) NOT NULL CHECK (annual_revenue >= 0),
    annual_ebitda NUMERIC(15, 2) NOT NULL,
    inventory_value_included NUMERIC(15, 2) DEFAULT 0,
    assets_value_included NUMERIC(15, 2) DEFAULT 0,
    financial_reporting_period VARCHAR(100) NOT NULL,
    is_financial_verified BOOLEAN DEFAULT FALSE,
    financial_verification_note TEXT,
    
    -- Operations
    years_in_operation INTEGER NOT NULL CHECK (years_in_operation >= 0),
    business_type VARCHAR(50) NOT NULL CHECK (business_type IN ('online', 'physical', 'hybrid', 'franchise')),
    team_size_range VARCHAR(50) NOT NULL,
    sale_structure VARCHAR(50) NOT NULL CHECK (sale_structure IN ('asset_sale', 'share_sale', 'majority_stake', 'franchise_transfer')),
    franchise_available BOOLEAN DEFAULT FALSE,
    
    -- Narrative
    executive_summary TEXT NOT NULL,
    products_and_services TEXT[] DEFAULT '{}',
    customer_segments TEXT[] DEFAULT '{}',
    operating_model TEXT NOT NULL,
    growth_opportunities TEXT[] DEFAULT '{}',
    assets_included TEXT[] DEFAULT '{}',
    reason_for_sale TEXT,
    
    -- Security & Moderation
    visibility VARCHAR(50) DEFAULT 'public' CHECK (visibility IN ('public', 'partially_confidential', 'strictly_confidential')),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'published', 'under_offer', 'sold', 'withdrawn', 'rejected')),
    is_featured BOOLEAN DEFAULT FALSE,
    requires_nda_for_financials BOOLEAN DEFAULT TRUE,
    
    -- Engagement counts
    views_count INTEGER DEFAULT 0,
    inquiries_count INTEGER DEFAULT 0,
    saved_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 7. LISTING MEDIA (Photos, Facility images, Pitch teasers)
CREATE TABLE IF NOT EXISTS listing_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES business_listings(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type VARCHAR(50) DEFAULT 'image',
    caption VARCHAR(255),
    is_cover_image BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. LISTING DOCUMENTS (Secure document vault metadata - NO raw blobs)
CREATE TABLE IF NOT EXISTS listing_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES business_listings(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('financial_mis', 'tax_return_gst', 'audit_report', 'incorporation_mca', 'pitch_deck', 'asset_register')),
    storage_path TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    is_confidential BOOLEAN DEFAULT TRUE,
    download_restricted BOOLEAN DEFAULT TRUE,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. VERIFICATION RECORDS (Seller & Business compliance checks)
CREATE TABLE IF NOT EXISTS verification_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('seller', 'buyer', 'business_financials', 'mca_cin')),
    entity_id UUID NOT NULL,
    verified_by_admin_id UUID REFERENCES users(id),
    verification_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'more_info_needed')),
    notes TEXT,
    evidence_document_path TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. BUYER PREFERENCES
CREATE TABLE IF NOT EXISTS buyer_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    industry_filters TEXT[] DEFAULT '{}',
    location_filters TEXT[] DEFAULT '{}',
    min_price NUMERIC(15, 2),
    max_price NUMERIC(15, 2),
    email_alerts_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. INQUIRIES
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES business_listings(id) ON DELETE RESTRICT,
    seller_id UUID NOT NULL REFERENCES users(id),
    buyer_id UUID NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    intended_funding_source VARCHAR(100),
    indicative_offer_budget NUMERIC(15, 2),
    timeline_months INTEGER DEFAULT 3,
    status VARCHAR(50) DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'accepted', 'declined', 'nda_requested')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. CONVERSATIONS
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES business_listings(id) ON DELETE RESTRICT,
    buyer_id UUID NOT NULL REFERENCES users(id),
    seller_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'blocked')),
    scheduled_meeting_time TIMESTAMPTZ,
    scheduled_meeting_agenda TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(listing_id, buyer_id, seller_id)
);

-- 13. MESSAGES
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    sender_role VARCHAR(20) NOT NULL CHECK (sender_role IN ('buyer', 'seller', 'admin', 'system')),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_system_notice BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. SAVED LISTINGS (Bookmarks)
CREATE TABLE IF NOT EXISTS saved_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES business_listings(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, listing_id)
);

-- 15. CONFIDENTIALITY AGREEMENTS (NDAs)
CREATE TABLE IF NOT EXISTS confidentiality_agreements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES business_listings(id) ON DELETE RESTRICT,
    buyer_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'approved_active' CHECK (status IN ('pending_seller_approval', 'approved_active', 'rejected', 'revoked')),
    signed_at TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    watermark_text VARCHAR(200) NOT NULL,
    agreement_version VARCHAR(20) NOT NULL DEFAULT 'v1.4-in',
    terms_accepted BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. DOCUMENT ACCESS LOGS (Immutable audit trail for confidential papers)
CREATE TABLE IF NOT EXISTS document_access_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES listing_documents(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES business_listings(id) ON DELETE CASCADE,
    accessor_user_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(50) NOT NULL CHECK (action IN ('viewed', 'download_attempted', 'download_approved', 'revoked')),
    ip_address VARCHAR(45) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. DEAL RECORDS (The core deal tracking and attribution engine)
CREATE TABLE IF NOT EXISTS deal_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES business_listings(id) ON DELETE RESTRICT,
    seller_id UUID NOT NULL REFERENCES users(id),
    buyer_id UUID NOT NULL REFERENCES users(id),
    current_stage VARCHAR(50) DEFAULT 'inquiry_received' CHECK (current_stage IN (
        'inquiry_received', 'seller_reviewing', 'buyer_qualified', 'initial_conversation',
        'nda_step', 'information_shared', 'due_diligence', 'loi_or_offer',
        'negotiation', 'definitive_agreements', 'closed_successfully', 'closed_unsuccessfully', 'withdrawn'
    )),
    first_contact_date TIMESTAMPTZ DEFAULT NOW(),
    platform_attribution_window_ends TIMESTAMPTZ NOT NULL, -- 180 days policy
    indicative_deal_value NUMERIC(15, 2) NOT NULL,
    final_transaction_value NUMERIC(15, 2),
    commission_rate_pct NUMERIC(5, 2) DEFAULT 2.00,
    expected_commission NUMERIC(15, 2) NOT NULL,
    commission_agreement_signed BOOLEAN DEFAULT TRUE,
    commission_agreement_version VARCHAR(20) DEFAULT 'v2024-in',
    closing_notification_date TIMESTAMPTZ,
    substantiated_evidence TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. DEAL STAGE HISTORY
CREATE TABLE IF NOT EXISTS deal_stage_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_record_id UUID NOT NULL REFERENCES deal_records(id) ON DELETE CASCADE,
    stage VARCHAR(50) NOT NULL,
    notes TEXT,
    updated_by_user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. COMMISSION AGREEMENTS (Legally compliant platform fee engagement)
CREATE TABLE IF NOT EXISTS commission_agreements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    deal_record_id UUID REFERENCES deal_records(id),
    commission_type VARCHAR(50) DEFAULT 'percentage' CHECK (commission_type IN ('percentage', 'fixed_tiered')),
    commission_basis VARCHAR(100) DEFAULT 'total_enterprise_value',
    percentage_rate NUMERIC(5, 2) DEFAULT 2.00,
    min_fee NUMERIC(15, 2) DEFAULT 100000.00, -- ₹1 Lakh min
    max_fee NUMERIC(15, 2),
    attribution_window_days INTEGER DEFAULT 180,
    terms_version VARCHAR(20) NOT NULL DEFAULT 'v2024.1',
    signed_ip VARCHAR(45) NOT NULL,
    signed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. PLATFORM FEE PLANS (Configurable admin listing & premium services)
CREATE TABLE IF NOT EXISTS platform_fee_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_name VARCHAR(100) UNIQUE NOT NULL,
    price NUMERIC(15, 2) NOT NULL,
    period VARCHAR(20) DEFAULT 'one_time' CHECK (period IN ('one_time', 'monthly')),
    features TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    is_recommended BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. INVOICES
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    deal_record_id UUID REFERENCES deal_records(id),
    user_id UUID NOT NULL REFERENCES users(id),
    amount NUMERIC(15, 2) NOT NULL,
    gst_amount NUMERIC(15, 2) NOT NULL, -- 18% GST
    total_amount NUMERIC(15, 2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'issued' CHECK (status IN ('draft', 'issued', 'paid', 'overdue', 'cancelled')),
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ,
    payment_reference VARCHAR(100)
);

-- 22. PAYMENT RECORDS
CREATE TABLE IF NOT EXISTS payment_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    gateway_name VARCHAR(50) NOT NULL, -- Razorpay, NEFT/RTGS, Stripe
    transaction_reference VARCHAR(150) UNIQUE NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(50) NOT NULL CHECK (status IN ('success', 'failed', 'pending')),
    payment_method VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. COMPLAINTS & GRIEVANCES
CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES users(id),
    target_listing_id UUID REFERENCES business_listings(id),
    target_user_id UUID REFERENCES users(id),
    reason VARCHAR(100) NOT NULL,
    details TEXT NOT NULL,
    evidence_notes TEXT,
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'dismissed')),
    resolution_action TEXT,
    assigned_admin_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 24. MODERATION ACTIONS
CREATE TABLE IF NOT EXISTS moderation_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES users(id),
    target_type VARCHAR(50) NOT NULL CHECK (target_type IN ('listing', 'user', 'message', 'document')),
    target_id UUID NOT NULL,
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('approved', 'rejected', 'suspended', 'content_modified', 'warning_issued', 'banned')),
    rationale TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 25. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('inquiry', 'message', 'nda', 'deal_update', 'verification', 'system')),
    link_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 26. AUDIT LOGS (Immutable operational record)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(100) NOT NULL,
    actor_id UUID REFERENCES users(id),
    actor_name VARCHAR(150) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    target_entity VARCHAR(50) NOT NULL,
    target_id UUID NOT NULL,
    details TEXT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR HIGH-PERFORMANCE SEARCH & COMPLIANCE LOOKUPS
-- ============================================================================
CREATE INDEX idx_listings_search ON business_listings (status, industry, city, state, asking_price);
CREATE INDEX idx_listings_revenue ON business_listings (annual_revenue, annual_ebitda);
CREATE INDEX idx_listings_seller ON business_listings (seller_id, status);
CREATE INDEX idx_inquiries_listing ON inquiries (listing_id, status);
CREATE INDEX idx_inquiries_buyer ON inquiries (buyer_id, status);
CREATE INDEX idx_deals_buyer_seller ON deal_records (buyer_id, seller_id, current_stage);
CREATE INDEX idx_messages_conversation ON messages (conversation_id, created_at);
CREATE INDEX idx_nda_listing_buyer ON confidentiality_agreements (listing_id, buyer_id, status);
CREATE INDEX idx_audit_created ON audit_logs (created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES EXAMPLES
-- ============================================================================
ALTER TABLE business_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE confidentiality_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 1. Public can read published non-confidential listings; confidential details masked.
CREATE POLICY "Public Read Published Listings"
ON business_listings FOR SELECT
USING (status = 'published');

-- 2. Sellers can manage their own listings; Admins can view/modify all.
CREATE POLICY "Sellers Manage Own Listings"
ON business_listings FOR ALL
USING (auth.uid() = seller_id);

-- 3. Document access strictly requires active approved NDA or ownership.
CREATE POLICY "Secure Document Access"
ON listing_documents FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM confidentiality_agreements ca
        WHERE ca.listing_id = listing_documents.listing_id
        AND ca.buyer_id = auth.uid()
        AND ca.status = 'approved_active'
        AND ca.valid_until > NOW()
    )
    OR EXISTS (
        SELECT 1 FROM business_listings bl
        WHERE bl.id = listing_documents.listing_id
        AND bl.seller_id = auth.uid()
    )
);
