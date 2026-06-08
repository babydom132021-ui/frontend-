"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Product } from "../../data/products";
import { useLanguage } from "../../context/LanguageContext";

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onAddToCart: () => void;
  onQuickView: () => void;
}

export default function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
}: ProductCardProps) {
  const router = useRouter();
  const { t } = useLanguage();

  // Calculate discount percentage if old price exists
  const discountPercent = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  return (
    <div className="group bg-white rounded-lg border-0 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 flex flex-col h-full overflow-hidden">

      {/* Product Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 cursor-pointer" onClick={() => router.push(`/product/${product.id}`)} >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Wishlist Button (Heart) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist();
          }}
          className={`absolute top-3 right-3 p-2 rounded-full glass border border-white/20 shadow-sm transition-all duration-300 hover:scale-110 ${isWishlisted
            ? "text-red-500 bg-white"
            : "text-stone-700 hover:text-red-500"
            }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} className="transition-transform duration-300 active:scale-75" />
        </button>

        {/* Badges Stack */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {discountPercent && (
            <span className="bg-stone-900/80 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shadow-md">
              -{discountPercent}% OFF
            </span>
          )}
          {product.free_delivery && (
            <span className="bg-white/90 backdrop-blur-sm text-emerald-700 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              Free Delivery
            </span>
          )}
        </div>

        {/* Hover Quick View Button Overlay */}
        <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView();
            }}
            className="pointer-events-auto flex items-center gap-2 bg-white text-stone-900 text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-full shadow-md hover:bg-stone-900 hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
          >
            <Eye size={14} />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content Container */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-2.5 sm:gap-3 bg-white">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-stone-400 uppercase tracking-widest mb-1.5">
            <span>{product.category}</span>
            <span>★ {product.rating}</span>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => router.push(`/product/${product.id}`)}
            className="text-sm font-medium text-stone-800 hover:text-stone-gold transition-colors duration-200 truncate cursor-pointer font-sans"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-sm font-semibold text-stone-gold">
              ${product.price}.00
            </span>
            {product.oldPrice && (
              <span className="text-xs text-stone-400 line-through">
                ${product.oldPrice}.00
              </span>
            )}
          </div>

          {/* Color swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mt-3">
              {product.colors.map((color, idx) => (
                <span
                  key={idx}
                  className="w-2.5 h-2.5 rounded-full border border-stone-200 ring-offset-1 group-hover:ring-1 ring-stone-300"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          className="w-full flex items-center justify-center gap-1.5 bg-stone-50 hover:bg-stone-900 text-stone-900 hover:text-white border border-stone-200 hover:border-stone-900 text-[10px] sm:text-xs font-semibold tracking-wider uppercase py-2 sm:py-2.5 px-2 rounded transition-all duration-300 mt-1 cursor-pointer"
        >
          <ShoppingBag size={13} />
          <span>{t("add_to_bag")}</span>
        </button>
      </div>

    </div>
  );
}
