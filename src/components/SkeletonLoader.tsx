import React from "react";

export function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-[2px] border border-slate-200 shadow-xs overflow-hidden animate-pulse">
      <div className="h-48 bg-slate-200" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="h-4 w-28 bg-slate-200 rounded-md" />
          <div className="h-4 w-20 bg-slate-100 rounded-md" />
        </div>
        <div className="h-6 w-3/4 bg-slate-200 rounded-md" />
        <div className="h-4 w-full bg-slate-100 rounded-md" />
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="h-10 bg-slate-100 rounded-lg" />
          <div className="h-10 bg-slate-100 rounded-lg" />
          <div className="h-10 bg-slate-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="p-4 flex items-center justify-between gap-4 animate-pulse border-b border-slate-100">
      <div className="space-y-2 flex-1">
        <div className="h-4 w-1/3 bg-slate-200 rounded-md" />
        <div className="h-3 w-1/2 bg-slate-100 rounded-md" />
      </div>
      <div className="h-8 w-24 bg-slate-200 rounded-lg" />
    </div>
  );
}
