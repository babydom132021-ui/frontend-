"use client";

import React, { useEffect } from "react";
import { CheckCircle2, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  text: string;
  type?: "success" | "info";
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="glass px-5 py-4 rounded-xl border border-stone-200/50 shadow-xl flex items-center gap-3 max-w-sm">
        {toast.type === "success" ? (
          <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
        ) : (
          <Info size={18} className="text-stone-gold flex-shrink-0" />
        )}
        
        <p className="text-xs sm:text-sm font-medium text-stone-800 pr-2">
          {toast.text}
        </p>

        <button
          onClick={onClose}
          className="text-stone-400 hover:text-stone-900 transition-colors p-0.5"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
