"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Lock, Eye, Building2 } from "lucide-react";
import { CategoryPlaceholder } from "./CategoryPlaceholder";

interface PhotoGalleryProps {
  images: string[];
  title: string;
  isConfidential?: boolean;
  industry?: string;
  subCategory?: string;
}

export function PhotoGallery({
  images,
  title,
  isConfidential,
  industry = "Enterprise",
  subCategory,
}: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  if (!images || images.length === 0) {
    return null;
  }

  const markFailed = (index: number) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Main Image Frame */}
      <div className="relative h-72 sm:h-96 w-full rounded-[2px] overflow-hidden bg-slate-900 border border-slate-200 shadow-xs group">
        <CategoryPlaceholder
          industry={industry}
          subCategory={subCategory}
          className="absolute inset-0 w-full h-full"
        />

        {!failedImages[selectedIndex] && images[selectedIndex] && (
          <Image
            src={images[selectedIndex]}
            alt={`${title} - Photo ${selectedIndex + 1}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover transition-transform duration-300"
            onError={() => markFailed(selectedIndex)}
            unoptimized
          />
        )}

        {/* Gradient shadow for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />

        {/* Confidentiality Watermark Overlay if confidential */}
        {isConfidential && (
          <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Facility Representation • Anonymized</span>
          </div>
        )}

        {/* Image Counter Badge */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-mono text-white/90">
          {selectedIndex + 1} / {images.length}
        </div>

        {/* Left/Right Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all opacity-80 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all opacity-80 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Bar */}
      {images.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all bg-slate-900 ${
                selectedIndex === idx
                  ? "border-emerald-600 ring-2 ring-emerald-200"
                  : "border-slate-200 opacity-70 hover:opacity-100"
              }`}
            >
              {failedImages[idx] ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-[10px] text-slate-300 font-medium">
                  <Building2 className="w-4 h-4 text-emerald-400 mb-0.5" />
                  <span>#{idx + 1}</span>
                </div>
              ) : (
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                  onError={() => markFailed(idx)}
                  unoptimized
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
