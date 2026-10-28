# VyapaarSetu — India-First B2B Business Buying & Selling Marketplace

> Institutional digital marketplace for verified Indian business acquisitions, mergers, SME exits, and strategic asset transfers.

## Architecture Highlights
- **Framework**: Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide Icons.
- **Relational Schema**: 26-table comprehensive PostgreSQL schema (`src/lib/database-schema.sql`) covering users, buyer/seller profiles, listings, documents, digital NDAs, deals, attribution, commission agreements, and audit trails.
- **India-First Context**: INR denominations (₹ Lakhs and Crores), Indian commercial corridors (Mumbai, Pune, Bengaluru, Hyderabad, Delhi NCR, Ahmedabad), GST (18%) compliance, and Ministry of Corporate Affairs (MCA21) verification.
- **Role Simulation**: Instant header role-switcher allowing immediate testing as **Buyer** (*Vikram Patel*), **Seller** (*Sunil Sharma*), **Admin** (*Aarav Deshmukh*), or **Visitor**.
- **Data Vault**: Forensic dynamic watermark viewer preventing unauthorized leaks of audited Form 3CD tax schedules.
- **Deal Attribution Engine**: 180-day platform attribution countdown, 11-stage acquisition progress tracker, and 2.0% success commission billing.

## Getting Started
```bash
# Navigate to the workspace
cd /Users/haritmishra/.gemini/antigravity/scratch/vyapaar-setu

# Run the development server
npm run dev

# Or run the production build
npm run build && npm start
```
The application will run on `http://localhost:3000`.
