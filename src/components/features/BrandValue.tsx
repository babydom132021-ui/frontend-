"use client";

import React from "react";
import { Truck, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";

export default function BrandValue() {
  return (
    <section className="bg-white border-y border-stone-200/50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-stone-50 rounded-xl text-stone-800">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800">Free Express Delivery</h4>
              <p className="text-[11px] text-stone-400 mt-0.5">Complementary shipping & packing</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-stone-50 rounded-xl text-stone-800">
              <RefreshCw size={20} />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800">Easy 30-Day Returns</h4>
              <p className="text-[11px] text-stone-400 mt-0.5">Hassle-free shipping labels</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-stone-50 rounded-xl text-stone-800">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800">Secure Payments</h4>
              <p className="text-[11px] text-stone-400 mt-0.5">Encrypted transaction portals</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-stone-50 rounded-xl text-stone-800">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800">Luxury Quality</h4>
              <p className="text-[11px] text-stone-400 mt-0.5">Finest fabrics & materials</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
