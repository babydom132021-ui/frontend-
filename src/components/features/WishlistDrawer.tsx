"use client";

import React from "react";
import Image from "next/image";
import { X, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Product } from "../../data/products";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemoveItem: (id: string) => void;
  onAddToCart: (product: Product) => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onAddToCart,
}: WishlistDrawerProps) {
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full justify-end">
        {/* Drawer Panel */}
        <div className="pointer-events-auto w-full max-w-[calc(100vw-2.5rem)] sm:max-w-md transform bg-white shadow-2xl transition-transform animate-drawer-in flex flex-col h-full border-l border-stone-200">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-100 px-6 py-5">
            <div className="flex items-center gap-2.5">
              <Heart size={20} className="text-red-500 fill-red-500" />
              <h2 className="text-lg font-medium text-stone-900 font-sans tracking-wide">
                My Wishlist ({items.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-50 transition-all duration-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center py-12">
                <div className="rounded-full bg-stone-50 p-6 mb-4">
                  <Heart size={40} className="text-stone-300" />
                </div>
                <h3 className="text-base font-medium text-stone-800">Your wishlist is empty</h3>
                <p className="mt-1 text-sm text-stone-400 max-w-xs">
                  Save your favorite items here to view or purchase them later.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 bg-stone-950 hover:bg-stone-gold text-white text-xs font-semibold tracking-widest uppercase px-6 py-3 rounded-full transition-colors duration-300"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {items.map((product) => (
                  <div key={product.id} className="flex py-5 gap-4">
                    {/* Item Image */}
                    <div className="relative h-24 w-18 flex-shrink-0 overflow-hidden rounded bg-stone-50 border border-stone-100">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover object-top"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between text-sm font-medium text-stone-800">
                          <h3 className="truncate pr-4" title={product.name}>
                            {product.name}
                          </h3>
                          <div className="flex-shrink-0 flex flex-col items-end">
                            <span className="font-semibold text-stone-950">${product.price}.00</span>
                            {product.oldPrice && (
                              <span className="text-[10px] text-stone-400 line-through">${product.oldPrice}.00</span>
                            )}
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-stone-400 uppercase tracking-wider">
                          {product.category}
                        </p>
                      </div>

                      {/* Quick Add to Cart & Remove */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => onAddToCart(product)}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-stone-900 hover:bg-stone-gold text-white text-[10px] font-bold tracking-wider uppercase py-2 rounded transition-colors duration-350"
                        >
                          <ShoppingBag size={12} />
                          <span>Add to Bag</span>
                        </button>

                        <button
                          onClick={() => onRemoveItem(product.id)}
                          className="border border-stone-200 text-stone-400 hover:text-red-500 hover:border-red-200 p-2 rounded transition-colors"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
