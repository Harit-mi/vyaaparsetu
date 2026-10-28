"use client";

import React from "react";
import {
  Factory,
  Cpu,
  Truck,
  Activity,
  UtensilsCrossed,
  ShoppingBag,
  Building2,
} from "lucide-react";

interface CategoryPlaceholderProps {
  industry: string;
  subCategory?: string;
  className?: string;
}

export function CategoryPlaceholder({
  industry,
  subCategory,
  className = "w-full h-full",
}: CategoryPlaceholderProps) {
  const getIndustryTheme = (ind: string) => {
    const lower = ind.toLowerCase();
    if (lower.includes("manufactur") || lower.includes("industrial")) {
      return {
        bg: "bg-[#0c152b]",
        pattern: "rgba(197, 168, 128, 0.08)",
        icon: Factory,
        accent: "text-bronze-300",
        tag: "MANDATE CLASS: INDUSTRIAL ANCILLARY",
      };
    }
    if (lower.includes("saas") || lower.includes("tech") || lower.includes("cloud")) {
      return {
        bg: "bg-[#091428]",
        pattern: "rgba(94, 187, 170, 0.08)",
        icon: Cpu,
        accent: "text-teal-300",
        tag: "MANDATE CLASS: B2B SOFTWARE ENTERPRISE",
      };
    }
    if (lower.includes("logistic") || lower.includes("supply") || lower.includes("fleet")) {
      return {
        bg: "bg-[#0c182a]",
        pattern: "rgba(96, 130, 182, 0.08)",
        icon: Truck,
        accent: "text-sky-300",
        tag: "MANDATE CLASS: COLD-CHAIN & LOGISTICS",
      };
    }
    if (lower.includes("health") || lower.includes("pharma") || lower.includes("clinic")) {
      return {
        bg: "bg-[#061e1b]",
        pattern: "rgba(47, 160, 142, 0.08)",
        icon: Activity,
        accent: "text-teal-400",
        tag: "MANDATE CLASS: HEALTHCARE & DIAGNOSTICS",
      };
    }
    if (lower.includes("food") || lower.includes("restaurant") || lower.includes("kitchen")) {
      return {
        bg: "bg-[#181310]",
        pattern: "rgba(214, 198, 163, 0.08)",
        icon: UtensilsCrossed,
        accent: "text-amber-300",
        tag: "MANDATE CLASS: COMMERCIAL F&B ASSET",
      };
    }
    if (lower.includes("retail") || lower.includes("commerce") || lower.includes("brand")) {
      return {
        bg: "bg-[#1a121d]",
        pattern: "rgba(214, 163, 198, 0.08)",
        icon: ShoppingBag,
        accent: "text-rose-300",
        tag: "MANDATE CLASS: CONSUMER BRAND / D2C",
      };
    }
    return {
      bg: "bg-[#0c152b]",
      pattern: "rgba(226, 223, 214, 0.08)",
      icon: Building2,
      accent: "text-ivory-300",
      tag: "MANDATE CLASS: COMMERCIAL ENTERPRISE",
    };
  };

  const theme = getIndustryTheme(industry);
  const Icon = theme.icon;

  return (
    <div
      className={`relative ${theme.bg} flex flex-col justify-between p-5 select-none overflow-hidden ${className}`}
    >
      {/* Financial Blueprint Hairline Grid */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, ${theme.pattern} 1px, transparent 1px), linear-gradient(to bottom, ${theme.pattern} 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Top Ledger Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2">
        <span className="font-mono text-[9px] uppercase tracking-widest text-white/60">
          {theme.tag}
        </span>
        <div className="w-1.5 h-1.5 bg-teal-400 rounded-none" />
      </div>

      {/* Center Technical Schematic Emblem */}
      <div className="relative z-10 my-auto py-2 flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="font-display text-sm font-bold text-white tracking-tight">
            {industry}
          </p>
          {subCategory && (
            <p className="font-sans text-xs text-slate-400 font-normal">
              {subCategory}
            </p>
          )}
        </div>
        <div className="w-10 h-10 border border-white/20 bg-white/5 flex items-center justify-center">
          <Icon className={`w-5 h-5 ${theme.accent}`} />
        </div>
      </div>

      {/* Bottom Legal Disclaimer Stamp */}
      <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between font-mono text-[9px] text-white/40">
        <span>MANDATE DOSSIER</span>
        <span>CONFIDENTIAL FILING</span>
      </div>
    </div>
  );
}
