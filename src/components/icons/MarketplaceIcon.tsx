import React from "react";

/**
 * VyapaarSetu Curated Marketplace Iconography System
 * 
 * Sourced & styled according to Flaticon Business & M&A Line Pack
 * Visual language: 1.75px uniform stroke, rounded caps, geometric precision.
 * Author attribution: Curated from Flaticon Business Line collection by Freepik.
 */

export type MarketplaceIconName =
  | "office-building"
  | "briefcase"
  | "handshake"
  | "financial-chart"
  | "verified-document"
  | "wallet"
  | "location-pin"
  | "arrow-up-right"
  | "shield-check"
  | "lock"
  | "scale"
  | "search"
  | "filter"
  | "bookmark"
  | "inbox"
  | "user"
  | "clock"
  | "badge-check"
  | "plus"
  | "check"
  | "x";

export interface MarketplaceIconProps extends React.SVGProps<SVGSVGElement> {
  name: MarketplaceIconName;
  size?: number | "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  title?: string;
}

export function MarketplaceIcon({
  name,
  size = "md",
  className = "",
  title,
  ...props
}: MarketplaceIconProps) {
  // Map standard size tokens
  let pixelSize = 20;
  if (typeof size === "number") {
    pixelSize = size;
  } else {
    switch (size) {
      case "xs":
        pixelSize = 14;
        break;
      case "sm":
        pixelSize = 16;
        break;
      case "md":
        pixelSize = 20;
        break;
      case "lg":
        pixelSize = 24;
        break;
      case "xl":
        pixelSize = 32;
        break;
    }
  }

  const svgProps = {
    xmlns: "http://www.w3.org/2000/svg",
    width: pixelSize,
    height: pixelSize,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: `inline-block shrink-0 align-middle ${className}`,
    "aria-hidden": title ? undefined : true,
    role: title ? "img" : "presentation",
    ...props,
  };

  switch (name) {
    // 1. Office Building (Enterprise Headquarter & Industrial Facility)
    case "office-building":
      return (
        <svg {...svgProps}>
          {title && <title>{title}</title>}
          <path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
          <path d="M16 9h4a2 2 0 0 1 2 2v10" />
          <path d="M2 21h20" />
          <path d="M8 7h4" />
          <path d="M8 11h4" />
          <path d="M8 15h4" />
          <path d="M10 21v-3" />
        </svg>
      );

    // 2. Briefcase (Promoter Mandate & Advisory Portfolio)
    case "briefcase":
      return (
        <svg {...svgProps}>
          {title && <title>{title}</title>}
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          <path d="M12 12v1" />
          <path d="M2 13h20" />
        </svg>
      );

    // 3. Handshake (Private Acquisition Deal Closing & Bilateral Accord)
    case "handshake":
      return (
        <svg {...svgProps}>
          {title && <title>{title}</title>}
          <path d="M11 17l-4 4-5-5 5-5 4 4" />
          <path d="M13 7l4-4 5 5-5 5-4-4" />
          <path d="M8.5 8.5L12 12l3.5-3.5" />
          <path d="M7 13l2.5 2.5" />
          <path d="M14.5 15.5L17 13" />
        </svg>
      );

    // 4. Financial Chart (Valuation Multiples, EBITDA Margin & CAGR)
    case "financial-chart":
      return (
        <svg {...svgProps}>
          {title && <title>{title}</title>}
          <path d="M3 3v18h18" />
          <path d="M18 9l-5 5-4-4-5 5" />
          <path d="M14 9h4v4" />
          <path d="M7 19v-2" />
          <path d="M11 19v-5" />
          <path d="M15 19v-8" />
        </svg>
      );

    // 5. Verified Document (Audited CA Financials & Due Diligence Dossier)
    case "verified-document":
      return (
        <svg {...svgProps}>
          {title && <title>{title}</title>}
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M9 15l2 2 4-4" />
          <line x1="8" y1="11" x2="11" y2="11" />
        </svg>
      );

    // 6. Wallet (Transaction Consideration, Earnouts & Escrow Capital)
    case "wallet":
      return (
        <svg {...svgProps}>
          {title && <title>{title}</title>}
          <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3" />
          <path d="M16 11h5a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z" />
          <circle cx="18.5" cy="13" r="0.75" fill="currentColor" />
        </svg>
      );

    // 7. Location Pin (Industrial Corridor, MIDC Zone, District Precision)
    case "location-pin":
      return (
        <svg {...svgProps}>
          {title && <title>{title}</title>}
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );

    // 8. Arrow Up Right (Executive Outbound Link & Mandate Escalation)
    case "arrow-up-right":
      return (
        <svg {...svgProps}>
          {title && <title>{title}</title>}
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      );

    // 9. Shield Check (Institutional KYC & Regulatory Compliance)
    case "shield-check":
      return (
        <svg {...svgProps}>
          {title && <title>{title}</title>}
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      );

    // 10. Lock (Discreet Deal Room & Confidential Teaser)
    case "lock":
      return (
        <svg {...svgProps}>
          {title && <title>{title}</title>}
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );

    // 11. Scale (Section 79 IT Act Intermediary Balance)
    case "scale":
      return (
        <svg {...svgProps}>
          {title && <title>{title}</title>}
          <path d="M12 3v18" />
          <path d="M5 21h14" />
          <path d="M4 7h16" />
          <path d="M4 7l-2 5a3 3 0 0 0 6 0L6 7" />
          <path d="M18 7l-2 5a3 3 0 0 0 6 0l-2-5" />
        </svg>
      );

    // 12. Search (Mandate Screener Query)
    case "search":
      return (
        <svg {...svgProps}>
          {title && <title>{title}</title>}
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );

    // 13. Filter (Parameter Tuning)
    case "filter":
      return (
        <svg {...svgProps}>
          {title && <title>{title}</title>}
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
      );

    // 14. Bookmark (Saved Mandates List)
    case "bookmark":
      return (
        <svg {...svgProps}>
          {title && <title>{title}</title>}
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      );

    // 15. Inbox (Enquiries Registry)
    case "inbox":
      return (
        <svg {...svgProps}>
          {title && <title>{title}</title>}
          <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
          <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </svg>
      );

    // 16. User (Promoter / Acquirer Entity Credentials)
    case "user":
      return (
        <svg {...svgProps}>
          {title && <title>{title}</title>}
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );

    // 17. Clock (Due Diligence Calendar & Listing Freshness)
    case "clock":
      return (
        <svg {...svgProps}>
          {title && <title>{title}</title>}
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );

    // 18. Badge Check (CA Certified Stamp)
    case "badge-check":
      return (
        <svg {...svgProps}>
          {title && <title>{title}</title>}
          <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      );

    // 19. Plus
    case "plus":
      return (
        <svg {...svgProps}>
          {title && <title>{title}</title>}
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      );

    // 20. Check
    case "check":
      return (
        <svg {...svgProps}>
          {title && <title>{title}</title>}
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );

    // 21. X
    case "x":
      return (
        <svg {...svgProps}>
          {title && <title>{title}</title>}
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      );

    default:
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
}
