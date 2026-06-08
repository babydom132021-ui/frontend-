"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  onShopNowClick: () => void;
}

export default function Hero({ onShopNowClick }: HeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-[#f4f2ee]">
      {/* Visual layout: Two-column grid on desktop, full background overlay on mobile */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Block */}
          <div className="md:col-span-5 flex flex-col justify-center text-left z-10 space-y-6 md:space-y-8 animate-slide-up">
            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-stone-500 uppercase">
                Spring / Summer 2026 Collection
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-stone-900 tracking-tight leading-[1.1]">
                New Fashion <br />
                <span className="font-semibold italic">Collection</span>
              </h1>
            </div>
            
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-md font-light">
              Discover effortless silhouettes, fluid tailoring, and elevated essentials. Handcrafted from sustainably-sourced premium materials, designed to last a lifetime.
            </p>
            
            <div>
              <button
                onClick={onShopNowClick}
                className="group inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-gold text-white text-xs sm:text-sm font-semibold tracking-widest uppercase px-6 sm:px-8 py-3.5 sm:py-4 transition-all duration-300 rounded-full shadow-lg shadow-stone-900/10 hover:shadow-stone-gold/20"
              >
                <span>Shop Now</span>
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Micro details */}
            <div className="grid grid-cols-3 gap-4 pt-4 sm:pt-8 border-t border-stone-200">
              <div>
                <span className="block text-lg sm:text-xl font-serif font-semibold text-stone-900">01</span>
                <span className="text-[10px] sm:text-xs text-stone-500 tracking-wider uppercase">Premium Wool</span>
              </div>
              <div>
                <span className="block text-lg sm:text-xl font-serif font-semibold text-stone-900">100%</span>
                <span className="text-[10px] sm:text-xs text-stone-500 tracking-wider uppercase">Organic Cotton</span>
              </div>
              <div>
                <span className="block text-lg sm:text-xl font-serif font-semibold text-stone-900">Handmade</span>
                <span className="text-[10px] sm:text-xs text-stone-500 tracking-wider uppercase">Craftsmanship</span>
              </div>
            </div>
          </div>

          {/* Right Image Block */}
          <div className="md:col-span-7 relative w-full h-[320px] sm:h-[450px] md:h-[500px] lg:h-[580px] rounded-2xl overflow-hidden shadow-2xl shadow-stone-950/5 group">
            <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop"
              alt="Luxury fashion lookbook collection"
              fill
              priority
              className="object-cover object-top transition-transform duration-[4000ms] ease-out group-hover:scale-105"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 via-transparent to-transparent pointer-events-none" />
          </div>
          
        </div>
      </div>
    </section>
  );
}
