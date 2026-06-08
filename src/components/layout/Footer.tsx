"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-400 py-16 border-t border-stone-900 font-light">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 pb-12 border-b border-stone-900 text-left">
        {/* Logo & Description */}
        <div className="space-y-4">
          <h3 className="text-white text-sm font-serif font-bold tracking-[0.25em] uppercase">DOM STORE</h3>
          <p className="text-xs leading-relaxed text-stone-500">
            Modern wardrobe essentials crafted from high-end fabrics, prioritizing design excellence and sustainable origins.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="text-white text-xs font-semibold tracking-wider uppercase">Collections</h4>
          <ul className="space-y-2.5 text-xs">
            <li><a href="#" className="hover:text-white transition-colors">Trench Coats & Outerwear</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Silk Shirts & Tops</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Linen Trousers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Cashmere Sweaters</a></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div className="space-y-4">
          <h4 className="text-white text-xs font-semibold tracking-wider uppercase">Services</h4>
          <ul className="space-y-2.5 text-xs">
            <li><a href="#" className="hover:text-white transition-colors">Shipping & Delivery</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Care Instructions</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Private Booking</a></li>
          </ul>
        </div>

        {/* Contact details */}
        <div className="space-y-4">
          <h4 className="text-white text-xs font-semibold tracking-wider uppercase">Contact</h4>
          <ul className="space-y-2.5 text-xs">
            <li className="text-stone-550">showroom@domstore.com</li>
            <li className="text-stone-550">+1 (800) 555-0199</li>
            <li className="text-stone-550">120 Mercer St, New York, NY</li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-600 gap-4">
        <p>© {new Date().getFullYear()} DOM Store, Inc. All rights reserved.</p>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-stone-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-stone-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-stone-400 transition-colors">Accessibility</a>
        </div>
      </div>
    </footer>
  );
}
