"use client";

import React from "react";
import { Check, Calendar, ArrowRight, Truck } from "lucide-react";

interface CheckoutSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: { orderNumber: string; deliveryDate: string } | null;
}

export default function CheckoutSuccessModal({
  isOpen,
  onClose,
  orderDetails,
}: CheckoutSuccessModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const orderNumber = orderDetails?.orderNumber || "FS-000000";
  const formattedDelivery = orderDetails?.deliveryDate || "Calculating...";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Dialog Panel */}
      <div className="relative bg-white rounded-2xl max-w-md w-full p-8 overflow-hidden shadow-2xl transition-all transform animate-slide-up border border-stone-200 text-center">

        {/* Animated Check Ring */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 border-4 border-emerald-100 mb-6 scale-110">
          <Check size={28} className="text-emerald-500 stroke-[3]" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-serif font-semibold text-stone-900 tracking-tight">
          Order Placed Successfully!
        </h2>
        <p className="mt-2 text-sm text-stone-400 font-light">
          Thank you for your purchase. We are preparing your order.
        </p>

        {/* Receipt Container */}
        <div className="my-6 bg-stone-50 border border-stone-100 rounded-xl p-4 text-left divide-y divide-stone-200/50 space-y-3.5">
          {/* Order Details */}
          <div className="flex justify-between items-center text-xs">
            <span className="text-stone-400 uppercase tracking-wider">Order Number</span>
            <span className="font-semibold text-stone-850 tracking-wider">{orderNumber}</span>
          </div>

          {/* Delivery Estimate */}
          <div className="pt-3.5 flex gap-3 items-start">
            <Truck size={16} className="text-stone-gold mt-0.5 flex-shrink-0" />
            <div className="space-y-0.5">
              <span className="block text-[10px] text-stone-400 uppercase tracking-wider font-semibold">Estimated Delivery</span>
              <span className="block text-xs text-stone-700 font-medium">{formattedDelivery}</span>
            </div>
          </div>

          {/* Customer Notice */}
          <div className="pt-3.5 flex gap-3 items-start">
            <Calendar size={16} className="text-stone-gold mt-0.5 flex-shrink-0" />
            <div className="space-y-0.5">
              <span className="block text-[10px] text-stone-400 uppercase tracking-wider font-semibold">Status</span>
              <span className="block text-xs text-stone-700 font-medium">Processing & packing</span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-gold text-white text-xs font-bold tracking-widest uppercase py-4 rounded-full transition-all duration-300 shadow-md shadow-stone-900/10 hover:shadow-stone-gold/20 cursor-pointer"
        >
          <span>Continue Shopping</span>
          <ArrowRight size={14} />
        </button>

        <p className="mt-4 text-[10px] text-stone-400">
          A confirmation email has been sent to your email address.
        </p>
      </div>
    </div>
  );
}
