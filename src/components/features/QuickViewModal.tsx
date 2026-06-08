"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Star, ShoppingBag, Heart } from "lucide-react";
import { Product } from "../../data/products";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImageUrl, setActiveImageUrl] = useState("");

  const colorImages = React.useMemo(() => {
    if (!product) return [];
    const colorObj = product.colors?.find(c => c.name === selectedColor);
    return colorObj && Array.isArray(colorObj.images) && colorObj.images.length > 0
      ? colorObj.images
      : [product.image];
  }, [product, selectedColor]);

  useEffect(() => {
    if (colorImages.length > 0) {
      setActiveImageUrl(colorImages[0]);
    }
  }, [colorImages]);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || "One Size");
      setSelectedColor(product.colors?.[0]?.name || "Default");
    }
  }, [product]);

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

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content Box */}
      <div className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl transition-all transform animate-slide-up flex flex-col md:flex-row border border-stone-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full p-2 bg-white/80 backdrop-blur-sm text-stone-400 hover:text-stone-900 hover:scale-110 shadow-sm border border-stone-100 transition-all"
        >
          <X size={18} />
        </button>

        {/* Left: Product Image & thumbnails */}
        <div className="relative md:w-1/2 aspect-[3/4] bg-stone-50 flex flex-col justify-between">
          <div className="relative w-full flex-1">
            <Image
              src={activeImageUrl || product.image}
              alt={product.name}
              fill
              className="object-cover object-top"
            />
          </div>
          {colorImages.length > 1 && (
            <div className="absolute bottom-3 left-3 right-3 flex gap-2 overflow-x-auto py-1 bg-white/70 backdrop-blur-xs rounded-xl p-1.5 shadow-sm border border-white/40">
              {colorImages.map((imgUrl, thumbIdx) => (
                <button
                  key={thumbIdx}
                  type="button"
                  onClick={() => setActiveImageUrl(imgUrl)}
                  className={`relative w-8 h-10 rounded-lg overflow-hidden bg-white border flex-shrink-0 transition-all cursor-pointer ${
                    activeImageUrl === imgUrl
                      ? "border-stone-900 scale-105"
                      : "border-stone-200/50 opacity-80 hover:opacity-100"
                  }`}
                >
                  <img src={imgUrl} className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Customization & Details */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between gap-6 overflow-y-auto max-h-[500px] md:max-h-none">
          <div className="space-y-4">
            {/* Category & Stars */}
            <div className="flex items-center justify-between text-xs text-stone-400 uppercase tracking-widest">
              <span>{product.category}</span>
              <div className="flex items-center gap-1 text-stone-gold">
                <Star size={14} fill="currentColor" />
                <span className="font-semibold">{product.rating}</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-serif font-medium text-stone-900 leading-tight">
              {product.name}
            </h2>

            {/* Pricing */}
            <div className="flex items-baseline gap-3">
              <span className="text-lg sm:text-xl font-bold text-stone-gold">
                ${product.price}.00
              </span>
              {product.oldPrice && (
                <span className="text-sm text-stone-400 line-through">
                  ${product.oldPrice}.00
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed font-light">
              {product.description}
            </p>

            <div className="border-t border-stone-100 my-4" />

            {/* Colors Swatch Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-stone-700 tracking-wider uppercase">
                  Color: <span className="font-normal text-stone-500">{selectedColor}</span>
                </span>
                <div className="flex items-center gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-6 h-6 rounded-full border ring-offset-2 transition-all ${
                        selectedColor === color.name
                          ? "ring-2 ring-stone-900 scale-110"
                          : "border-stone-200"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes Box Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-stone-700 tracking-wider uppercase">
                  Size: <span className="font-normal text-stone-500 uppercase">{selectedSize}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`border text-xs font-medium uppercase px-3.5 py-2 transition-all ${
                        selectedSize === size
                          ? "bg-stone-900 text-white border-stone-900 scale-105"
                          : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex gap-3 pt-4 border-t border-stone-100">
            {/* Wishlist Button */}
            <button
              onClick={onToggleWishlist}
              className={`p-3 rounded-full border flex items-center justify-center transition-all duration-350 ${
                isWishlisted
                  ? "bg-red-50 text-red-500 border-red-200 hover:scale-105"
                  : "bg-white text-stone-600 border-stone-200 hover:text-stone-900 hover:border-stone-400 hover:scale-105"
              }`}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
            </button>

            {/* Add to Cart CTA */}
            <button
              onClick={() => onAddToCart(product, selectedSize, selectedColor)}
              className="flex-1 flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-gold text-white text-xs font-bold tracking-widest uppercase py-3.5 px-6 rounded-full transition-all duration-300 shadow-md shadow-stone-900/10 hover:shadow-stone-gold/20"
            >
              <ShoppingBag size={16} />
              <span>Add To Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
