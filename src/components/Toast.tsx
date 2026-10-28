"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: ToastType;
}

interface ToastContextValue {
  showToast: (title: string, message?: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((title: string, message?: string, type: ToastType = "success") => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((toast) => {
          const isError = toast.type === "error";
          const isInfo = toast.type === "info";
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-[2px] shadow-xl border flex items-start gap-3 transition-all animate-in slide-in-from-bottom-2 duration-200 ${
                isError
                  ? "bg-red-950 text-white border-red-800"
                  : isInfo
                  ? "bg-navy-900 text-white border-navy-700"
                  : "bg-slate-900 text-white border-slate-700"
              }`}
              role="alert"
            >
              <div className="flex-shrink-0 mt-0.5">
                {isError ? (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                ) : isInfo ? (
                  <Info className="w-5 h-5 text-sky-400" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                )}
              </div>
              <div className="flex-1 text-xs">
                <p className="font-bold text-sm text-white">{toast.title}</p>
                {toast.message && <p className="text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-sm"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
