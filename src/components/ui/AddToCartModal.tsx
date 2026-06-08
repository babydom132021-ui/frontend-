"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { Product } from "../../data/products";
import { useLanguage } from "../../context/LanguageContext";

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewCart: () => void;
  item: {
    product: Product;
    quantity: number;
    selectedSize: string;
    selectedColor: string;
  } | null;
}

export default function AddToCartModal({
  isOpen,
  onClose,
  onViewCart,
  item,
}: AddToCartModalProps) {
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const { product, quantity, selectedSize, selectedColor } = item;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Dialog Panel */}
      <div className="relative bg-white rounded-2xl max-w-md w-full p-6 overflow-hidden shadow-2xl transition-all transform animate-slide-up border border-stone-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {/* Animated Check Ring */}
        <div className="flex items-center gap-3 mb-5 text-left">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100 flex-shrink-0">
            <Check size={18} className="text-emerald-500 stroke-[3]" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-stone-900 tracking-tight leading-none">
              {t("added_to_bag_title")}
            </h2>
            <p className="text-xs text-stone-400 font-light mt-1">
              {t("added_to_bag_desc")}
            </p>
          </div>
        </div>

        {/* Product Card Container */}
        <div className="bg-stone-50 border border-stone-100 rounded-xl p-4 flex gap-4 items-center mb-6">
          <div className="relative h-20 w-16 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0 border border-stone-200/40">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover object-top"
            />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <h3 className="text-sm font-semibold text-stone-850 truncate">
              {product.name}
            </h3>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] text-stone-455 mt-1 font-medium">
              <span>{t("size")}: <span className="text-stone-700 font-semibold">{selectedSize}</span></span>
              <span className="text-stone-300">·</span>
              <span>{t("color")}: <span className="text-stone-700 font-semibold">{selectedColor}</span></span>
              <span className="text-stone-300">·</span>
              <span>{t("item_count")}: <span className="text-stone-700 font-semibold">{quantity}</span></span>
            </div>
            <div className="text-sm font-bold text-stone-gold mt-2">
              ${product.price}.00
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => {
              onClose();
              onViewCart();
            }}
            className="w-full flex items-center justify-center bg-stone-900 hover:bg-stone-700 text-white text-xs font-bold tracking-wider uppercase py-3.5 rounded-full transition-all duration-300 shadow-md shadow-stone-900/10 cursor-pointer"
          >
            {t("view_bag_checkout")}
          </button>
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs font-bold tracking-wider uppercase py-3.5 rounded-full transition-all duration-300 cursor-pointer"
          >
            {t("continue_shopping")}
          </button>
        </div>
      </div>
    </div>
  );
}
