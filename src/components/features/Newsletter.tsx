"use client";

import React from "react";

interface NewsletterProps {
  onSubscribe: (message: string) => void;
}

export default function Newsletter({ onSubscribe }: NewsletterProps) {
  return (
    <section className="bg-[#f5f5f4] py-16 sm:py-24 border-t border-stone-200">
      <div className="mx-auto max-w-4xl px-4 text-center space-y-6">
        <span className="text-[11px] font-semibold text-stone-400 tracking-[0.2em] uppercase">Newsletter</span>
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-stone-900 tracking-tight">
          Join the Fashion Club
        </h2>
        <p className="text-stone-500 text-sm sm:text-base leading-relaxed max-w-md mx-auto font-light">
          Subscribe to receive private updates, priority shipping access, and lookbook notifications.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubscribe("Subscription request submitted successfully!");
          }}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4"
        >
          <input
            type="email"
            required
            placeholder="Your email address"
            className="flex-1 bg-white border border-stone-200 px-5 py-3.5 text-sm outline-none focus:border-stone-500 transition-colors"
          />
          <button
            type="submit"
            className="bg-stone-900 hover:bg-stone-gold text-white text-xs font-bold tracking-widest uppercase px-8 py-3.5 sm:py-0 transition-colors duration-300 cursor-pointer"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
