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
        bg: "from-slate-900 via-slate-800 to-indigo-950",
        icon: Factory,
        accent: "text-blue-400",
        label: "Industrial & Manufacturing",
      };
    }
    if (lower.includes("saas") || lower.includes("tech") || lower.includes("cloud")) {
      return {
        bg: "from-slate-900 via-blue-950 to-slate-900",
        icon: Cpu,
        accent: "text-cyan-400",
        label: "B2B Software & Tech",
      };
    }
    if (lower.includes("logistic") || lower.includes("supply") || lower.includes("fleet")) {
      return {
        bg: "from-slate-900 via-slate-800 to-blue-900",
        icon: Truck,
        accent: "text-sky-400",
        label: "Logistics & Supply Chain",
      };
    }
    if (lower.includes("health") || lower.includes("pharma") || lower.includes("clinic")) {
      return {
        bg: "from-slate-900 via-emerald-950 to-slate-900",
        icon: Activity,
        accent: "text-emerald-400",
        label: "Healthcare & Pharma",
      };
    }
    if (lower.includes("food") || lower.includes("restaurant") || lower.includes("kitchen")) {
      return {
        bg: "from-slate-900 via-amber-950 to-slate-900",
        icon: UtensilsCrossed,
        accent: "text-amber-400",
        label: "Commercial F&B",
      };
    }
    if (lower.includes("retail") || lower.includes("commerce") || lower.includes("brand")) {
      return {
        bg: "from-slate-900 via-rose-950 to-slate-900",
        icon: ShoppingBag,
        accent: "text-rose-400",
        label: "Consumer Brands & Retail",
      };
    }
    return {
      bg: "from-slate-900 via-slate-850 to-slate-900",
      icon: Building2,
      accent: "text-blue-400",
      label: "Commercial Enterprise",
    };
  };

  const theme = getIndustryTheme(industry);
  const Icon = theme.icon;

  return (
    <div
      className={`relative bg-gradient-to-br ${theme.bg} flex flex-col justify-between p-5 select-none overflow-hidden ${className}`}
    >
      {/* Subtle modern mesh overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06),transparent_60%)] pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-300">
          {theme.label}
        </span>
        <div className="w-2 h-2 rounded-full bg-emerald-400" />
      </div>

      {/* Center Icon & Info */}
      <div className="relative z-10 my-auto py-2 flex items-center justify-between">
        <div className="space-y-1">
          <p className="font-display text-base font-bold text-white tracking-tight">
            {industry}
          </p>
          {subCategory && (
            <p className="text-xs text-slate-300 font-normal">
              {subCategory}
            </p>
          )}
        </div>
        <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-center justify-center shadow-xs">
          <Icon className={`w-5 h-5 ${theme.accent}`} />
        </div>
      </div>

      {/* Bottom Subtitle */}
      <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
        <span>Confidential Opportunity</span>
        <span>Verified Mandate</span>
      </div>
    </div>
  );
}
