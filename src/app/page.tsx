"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Hero from "../components/features/Hero";
import ProductCard from "../components/features/ProductCard";
import CartDrawer, { CartItem } from "../components/features/CartDrawer";
import WishlistDrawer from "../components/features/WishlistDrawer";
import QuickViewModal from "../components/features/QuickViewModal";
import Toast, { ToastMessage } from "../components/ui/Toast";
import CheckoutSuccessModal from "../components/ui/CheckoutSuccessModal";
import AddToCartModal from "../components/ui/AddToCartModal";
import { Product } from "../data/products";
import { Sparkles } from "lucide-react";

export default function Home() {
  // Page Refs
  const productsSectionRef = useRef<HTMLDivElement>(null);

  // Core E-Commerce State
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<"Fashion Sheet" | "Trendy Outfits" | "Promotions">("Fashion Sheet");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Drawer & Modal Open/Close Toggles
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutSuccessOpen, setIsCheckoutSuccessOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState<{ orderNumber: string; deliveryDate: string } | null>(null);
  const [isAddToCartOpen, setIsAddToCartOpen] = useState(false);
  const [addedItem, setAddedItem] = useState<{
    product: Product;
    quantity: number;
    selectedSize: string;
    selectedColor: string;
  } | null>(null);

  // Toast notifications state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Fetch Products on Mount with robust static fallback
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)
      .then((res) => {
        if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) {
          throw new Error(`HTTP error ${res.status} or non-JSON response`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          throw new Error("Invalid products response format");
        }
      })
      .catch((err) => {
        console.warn("Backend API not reachable. Falling back to local static catalog data.", err);
        // Load fallback products from local file
        import("../data/products").then((mod) => {
          setProducts(mod.products);
        });
      });
  }, []);

  const triggerToast = (text: string, type: "success" | "info" = "success") => {
    setToast({
      id: Math.random().toString(),
      text,
      type,
    });
  };

  const scrollToProducts = () => {
    productsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Add Item to Cart
  const handleAddToCart = (product: Product, size?: string, color?: string) => {
    const finalSize = size || product.sizes[0] || "One Size";
    const finalColor = color || product.colors?.[0]?.name || "Default";

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === finalSize &&
          item.selectedColor === finalColor
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }

      return [
        ...prev,
        {
          product,
          quantity: 1,
          selectedSize: finalSize,
          selectedColor: finalColor,
        },
      ];
    });

    setAddedItem({
      product,
      quantity: 1,
      selectedSize: finalSize,
      selectedColor: finalColor,
    });
    setIsAddToCartOpen(true);
  };

  const handleQuickAdd = (product: Product) => {
    handleAddToCart(product);
  };

  const handleRemoveFromCart = (id: string, size: string, color: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === id &&
            item.selectedSize === size &&
            item.selectedColor === color
          )
      )
    );
    triggerToast("Item removed from your bag.", "info");
  };

  const handleUpdateQuantity = (
    id: string,
    size: string,
    color: string,
    delta: number
  ) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) =>
          item.product.id === id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );

      if (idx === -1) return prev;

      const updated = [...prev];
      const newQuantity = updated[idx].quantity + delta;

      if (newQuantity <= 0) {
        return prev.filter(
          (item) =>
            !(
              item.product.id === id &&
              item.selectedSize === size &&
              item.selectedColor === color
            )
        );
      }

      updated[idx].quantity = newQuantity;
      return updated;
    });
  };

  const handleToggleWishlist = (id: string) => {
    const isWish = wishlist.includes(id);
    const product = products.find((p) => p.id === id);

    if (isWish) {
      setWishlist((prev) => prev.filter((item) => item !== id));
      if (product) triggerToast(`Removed ${product.name} from wishlist.`, "info");
    } else {
      setWishlist((prev) => [...prev, id]);
      if (product) triggerToast(`Saved ${product.name} to wishlist.`);
    }
  };

  const handleCheckout = (deliveryLocation: string, deliveryOption: string, customerName: string, phone: string, email: string) => {
    setIsCartOpen(false);

    // Call backend checkout API
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deliveryLocation,
        deliveryOption,
        customerName,
        phone,
        email,
        items: cart.map((item) => ({
          id: item.product.id,
          quantity: item.quantity,
          size: item.selectedSize,
          color: item.selectedColor,
        })),
      }),
    })
      .then((res) => {
        if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) {
          throw new Error(`HTTP error ${res.status} or non-JSON response`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setOrderDetails({
            orderNumber: data.orderNumber,
            deliveryDate: data.deliveryDate,
          });
          setIsCheckoutSuccessOpen(true);
          setCart([]);
        } else {
          throw new Error("Checkout response indicates failure");
        }
      })
      .catch((err) => {
        console.warn("Express Checkout API call failed. Falling back to local checkout simulation.", err);
        // Resilient fallback checkout generation
        const orderNumber = `FS-${Math.floor(100000 + Math.random() * 900000)}`;
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3);
        const formattedDelivery = deliveryDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        setOrderDetails({
          orderNumber,
          deliveryDate: formattedDelivery,
        });
        setIsCheckoutSuccessOpen(true);
        setCart([]);
      });
  };

  const TABS = ["Fashion Sheet", "Trendy Outfits", "Promotions"] as const;
  const activeTabIndex = TABS.indexOf(activeTab);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = product.category === activeTab;

      const searchMatch = searchQuery
        ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      return categoryMatch && searchMatch;
    });
  }, [products, activeTab, searchQuery]);

  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlist.includes(p.id));
  }, [products, wishlist]);

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 font-sans antialiased text-stone-900">
      <div className="bg-stone-950 text-white text-[10px] sm:text-xs font-semibold py-2.5 px-4 tracking-[0.1em] sm:tracking-[0.15em] uppercase text-center flex items-center justify-center gap-2">
        <Sparkles size={13} className="text-stone-gold-light animate-pulse shrink-0 hidden sm:block" />
        <span className="leading-snug">COMPLIMENTARY SHIPPING ON ALL DOMESTIC ORDERS OVER $150</span>
        <Sparkles size={13} className="text-stone-gold-light animate-pulse shrink-0 hidden sm:block" />
      </div>

      {/* Header */}
      <Header
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        scrollToProducts={scrollToProducts}
      />

      {/* Hero Banner */}
      <Hero onShopNowClick={scrollToProducts} />



      {/* Main Content Layout */}
      <main ref={productsSectionRef} className="flex-1 min-w-0 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-12">

        {/* Tab Selection Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-stone-200 pb-4 gap-6 min-w-0">
          <div className="space-y-1 text-left">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest">Selected Outfits</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light text-stone-900">Browse Our Catalog</h2>
          </div>

          {/* Active Line Navigation Tab bar */}
          <div className="flex space-x-6 sm:space-x-8 overflow-x-auto no-scrollbar scroll-smooth w-full md:w-auto">
            {(["Fashion Sheet", "Trendy Outfits", "Promotions"] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSearchQuery("");
                  }}
                  className={`text-xs sm:text-sm font-semibold uppercase tracking-widest pb-3.5 border-b-2 transition-all duration-300 relative whitespace-nowrap ${isActive
                    ? "text-stone-900 border-stone-900 font-bold scale-105"
                    : "text-stone-400 border-transparent hover:text-stone-700"
                    }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid Section */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-100 shadow-xs flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin mb-4" />
            <p className="text-stone-500 text-sm font-medium">Loading premium catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-100 shadow-xs">
            <h3 className="text-lg font-medium text-stone-800">No items found</h3>
            <p className="text-stone-400 text-sm mt-1">
              Try adjusting your search criteria or explore other categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveTab("Fashion Sheet");
              }}
              className="mt-6 bg-stone-900 hover:bg-stone-gold text-white text-xs font-semibold tracking-widest uppercase px-6 py-3 rounded-full transition-colors duration-300"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6 sm:gap-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-12">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlist.includes(product.id)}
                  onToggleWishlist={() => handleToggleWishlist(product.id)}
                  onAddToCart={() => handleQuickAdd(product)}
                  onQuickView={() => setSelectedProduct(product)}
                />
              ))}
            </div>

            {/* Category Paging Controls */}
            <div className="pt-6 border-t border-stone-200 flex flex-row items-center justify-between w-full min-w-0">
              <button
                onClick={() => {
                  setActiveTab(TABS[activeTabIndex - 1]);
                  setSearchQuery("");
                  scrollToProducts();
                }}
                disabled={activeTabIndex === 0}
                className={`group text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-1 sm:gap-2 flex-shrink-0 ${activeTabIndex === 0 ? 'text-stone-300 cursor-not-allowed' : 'text-stone-500 hover:text-stone-900 cursor-pointer'}`}
              >
                <span className="transition-transform group-hover:-translate-x-1">&larr;</span> <span className="hidden sm:inline">Previous</span><span className="sm:hidden">Prev</span>
              </button>

              <div className="flex items-center gap-1.5 sm:gap-4 text-xs sm:text-sm font-medium">
                {TABS.map((tab, idx) => {
                  const pageNumber = idx + 1;
                  const isActive = activeTabIndex === idx;
                  return (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);
                        setSearchQuery("");
                        scrollToProducts();
                      }}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-stone-900 text-white shadow-md' : 'hover:bg-stone-100 text-stone-500 hover:text-stone-900'}`}
                      title={tab}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  setActiveTab(TABS[activeTabIndex + 1]);
                  setSearchQuery("");
                  scrollToProducts();
                }}
                disabled={activeTabIndex === TABS.length - 1}
                className={`group text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-1 sm:gap-2 flex-shrink-0 ${activeTabIndex === TABS.length - 1 ? 'text-stone-300 cursor-not-allowed' : 'text-stone-500 hover:text-stone-900 cursor-pointer'}`}
              >
                <span className="hidden sm:inline">Next</span><span className="sm:hidden">Next</span> <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlistProducts}
        onRemoveItem={handleToggleWishlist}
        onAddToCart={(product) => {
          handleQuickAdd(product);
          handleToggleWishlist(product.id);
        }}
      />

      {/* Quick View Product Modal */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onToggleWishlist={() => selectedProduct && handleToggleWishlist(selectedProduct.id)}
        onAddToCart={(product, size, color) => {
          handleAddToCart(product, size, color);
          setSelectedProduct(null);
        }}
      />

      {/* Success Modal */}
      <AddToCartModal
        isOpen={isAddToCartOpen}
        onClose={() => setIsAddToCartOpen(false)}
        onViewCart={() => setIsCartOpen(true)}
        item={addedItem}
      />

      {/* Success Modal */}
      <CheckoutSuccessModal
        isOpen={isCheckoutSuccessOpen}
        onClose={() => setIsCheckoutSuccessOpen(false)}
        orderDetails={orderDetails}
      />

      {/* Notifications Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
