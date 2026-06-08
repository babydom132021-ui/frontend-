"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import ProductCard from "../../../components/features/ProductCard";
import CartDrawer, { CartItem } from "../../../components/features/CartDrawer";
import WishlistDrawer from "../../../components/features/WishlistDrawer";
import QuickViewModal from "../../../components/features/QuickViewModal";
import Toast, { ToastMessage } from "../../../components/ui/Toast";
import CheckoutSuccessModal from "../../../components/ui/CheckoutSuccessModal";
import AddToCartModal from "../../../components/ui/AddToCartModal";
import { Product } from "../../../data/products";
import { Heart, ShoppingBag, ArrowLeft, Star, Shield, RotateCcw, Truck, Loader2 } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";

export default function ProductDetailPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  // State
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // E-commerce state synced with localStorage
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Customization choices
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImageUrl, setActiveImageUrl] = useState("");

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCheckoutSuccessOpen, setIsCheckoutSuccessOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState<{ orderNumber: string; deliveryDate: string } | null>(null);
  const [isAddToCartOpen, setIsAddToCartOpen] = useState(false);
  const [addedItem, setAddedItem] = useState<{
    product: Product;
    quantity: number;
    selectedSize: string;
    selectedColor: string;
  } | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const triggerToast = (text: string, type: "success" | "info" = "success") => {
    setToast({
      id: Math.random().toString(),
      text,
      type,
    });
  };

  // 1. Fetch products & sync state on mount
  useEffect(() => {
    // Sync Cart & Wishlist from localStorage
    try {
      const savedCart = localStorage.getItem("fashion_store_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem("fashion_store_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {
      console.warn("Could not load checkout states from storage:", e);
    }

    // Load Catalog
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)
      .then((res) => {
        if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) {
          throw new Error(`HTTP error ${res.status} or non-JSON response`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setAllProducts(data);
          const found = data.find((p) => p.id === id);
          if (found) {
            setProduct(found);
            setSelectedSize(found.sizes[0] || "");
            setSelectedColor(found.colors[0]?.name || "");
          }
        }
      })
      .catch((err) => {
        console.warn("Backend down. Falling back to local static catalog.", err);
        import("../../../data/products").then((mod) => {
          setAllProducts(mod.products);
          const found = mod.products.find((p) => p.id === id);
          if (found) {
            setProduct(found);
            setSelectedSize(found.sizes[0] || "");
            setSelectedColor(found.colors[0]?.name || "");
          }
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Synchronize colorImages and activeImageUrl when color selection changes
  const colorImages = useMemo(() => {
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

  // 2. Persist Cart & Wishlist on state change
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem("fashion_store_cart", JSON.stringify(newCart));
    } catch (e) {
      console.error(e);
    }
  };

  const saveWishlist = (newWishlist: string[]) => {
    setWishlist(newWishlist);
    try {
      localStorage.setItem("fashion_store_wishlist", JSON.stringify(newWishlist));
    } catch (e) {
      console.error(e);
    }
  };

  // E-commerce handlers
  const handleAddToCart = (itemProduct: Product, size?: string, color?: string) => {
    const finalSize = size || itemProduct.sizes[0] || "One Size";
    const finalColor = color || itemProduct.colors?.[0]?.name || "Default";

    const updated = [...cart];
    const existingIdx = updated.findIndex(
      (item) =>
        item.product.id === itemProduct.id &&
        item.selectedSize === finalSize &&
        item.selectedColor === finalColor
    );

    if (existingIdx > -1) {
      updated[existingIdx].quantity += 1;
    } else {
      updated.push({
        product: itemProduct,
        quantity: 1,
        selectedSize: finalSize,
        selectedColor: finalColor,
      });
    }

    saveCart(updated);
    setAddedItem({
      product: itemProduct,
      quantity: 1,
      selectedSize: finalSize,
      selectedColor: finalColor,
    });
    setIsAddToCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, size: string, color: string, delta: number) => {
    const updated = cart.map((item) => {
      if (item.product.id === productId && item.selectedSize === size && item.selectedColor === color) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[];

    saveCart(updated);
  };

  const handleRemoveFromCart = (productId: string, size: string, color: string) => {
    const updated = cart.filter(
      (item) => !(item.product.id === productId && item.selectedSize === size && item.selectedColor === color)
    );
    saveCart(updated);
    triggerToast("Item removed from your bag.", "info");
  };

  const handleToggleWishlist = (productId: string) => {
    const updated = [...wishlist];
    const isWish = updated.includes(productId);
    const targetProd = allProducts.find((p) => p.id === productId);

    if (isWish) {
      const filtered = updated.filter((item) => item !== productId);
      saveWishlist(filtered);
      if (targetProd) triggerToast(`Removed ${targetProd.name} from wishlist.`, "info");
    } else {
      updated.push(productId);
      saveWishlist(updated);
      if (targetProd) triggerToast(`Saved ${targetProd.name} to wishlist.`);
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
          saveCart([]);
        } else {
          throw new Error("Checkout failed");
        }
      })
      .catch((err) => {
        console.warn("Checkout API failed, running local simulation.", err);
        const orderNumber = `FS-${Math.floor(100000 + Math.random() * 900000)}`;
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3);
        const formattedDelivery = deliveryDate.toLocaleDateString("en-US", {
          weekday: "long", year: "numeric", month: "long", day: "numeric",
        });

        setOrderDetails({ orderNumber, deliveryDate: formattedDelivery });
        setIsCheckoutSuccessOpen(true);
        saveCart([]);
      });
  };

  // Memoized filters
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts.filter((p) => p.id !== product.id);
  }, [allProducts, product]);

  const wishlistProducts = useMemo(() => {
    return allProducts.filter((p) => wishlist.includes(p.id));
  }, [allProducts, wishlist]);

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-stone-gold mb-4" size={32} />
        <p className="text-stone-500 text-sm font-medium">Loading editorial collection...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-serif text-stone-900 mb-2">Item Not Found</h2>
        <p className="text-stone-500 text-sm mb-6">The apparel item details you are looking for are unavailable.</p>
        <Link href="/" className="bg-stone-900 hover:bg-stone-gold text-white text-xs font-semibold tracking-widest uppercase px-6 py-3 rounded-full transition-colors">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const discountPercent = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  return (
    <div className="min-h-screen bg-stone-50 font-sans antialiased text-stone-900 flex flex-col">
      {/* Header */}
      <Header
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
        searchQuery=""
        onSearchChange={() => { }}
        scrollToProducts={() => router.push("/")}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">

        {/* Back Link */}
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-stone-500 hover:text-stone-900 uppercase transition-colors">
            <ArrowLeft size={14} />
            <span>Back to Collection</span>
          </Link>
        </div>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* Left Column: Image Display & Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-white border border-stone-100 shadow-xs group">
              <img
                src={activeImageUrl || product.image}
                alt={product.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {discountPercent && (
                <span className="absolute top-4 left-4 bg-stone-gold text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded">
                  -{discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails Gallery */}
            {colorImages.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto py-1">
                {colorImages.map((imgUrl, thumbIdx) => (
                  <button
                    key={thumbIdx}
                    onClick={() => setActiveImageUrl(imgUrl)}
                    className={`relative w-16 h-20 rounded-xl overflow-hidden bg-white border-2 flex-shrink-0 transition-all cursor-pointer ${activeImageUrl === imgUrl
                      ? "border-stone-900 scale-105 shadow-xs"
                      : "border-stone-200/60 opacity-80 hover:opacity-100 hover:border-stone-400"
                      }`}
                  >
                    <img src={imgUrl} className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information Panel */}
          <div className="flex flex-col justify-between space-y-8 lg:py-4">

            {/* Title / Rating / Price */}
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between text-xs text-stone-400 uppercase tracking-widest">
                <span>{product.category}</span>
                <div className="flex items-center gap-1">
                  <Star size={14} className="fill-amber-400 stroke-amber-450 text-amber-400" />
                  <span className="font-semibold text-stone-700">{product.rating}</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-light text-stone-900 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-2xl font-semibold text-stone-gold">${product.price}.00</span>
                {product.oldPrice && (
                  <span className="text-sm text-stone-400 line-through">${product.oldPrice}.00</span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-stone-500 font-light leading-relaxed text-left">
              {product.description}
            </p>

            {/* Colors Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2.5 text-left">
                <span className="block text-[10px] font-bold text-stone-450 uppercase tracking-wider">
                  {t("color")}: <span className="text-stone-800">{selectedColor}</span>
                </span>
                <div className="flex items-center gap-3">
                  {product.colors.map((color, idx) => {
                    const isSelected = selectedColor === color.name;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-6 h-6 rounded-full border ring-offset-2 transition-all cursor-pointer ${isSelected ? "ring-2 ring-stone-900 border-transparent" : "border-stone-200"
                          }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sizes Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2.5 text-left">
                <span className="block text-[10px] font-bold text-stone-450 uppercase tracking-wider">
                  {t("select_size")}
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[42px] h-10 px-3 flex items-center justify-center text-xs font-semibold uppercase border transition-all cursor-pointer rounded-lg ${isSelected
                          ? "bg-stone-900 border-stone-900 text-white"
                          : "bg-white border-stone-200 text-stone-700 hover:border-stone-400"
                          }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => handleAddToCart(product, selectedSize, selectedColor)}
                className="flex-1 flex items-center justify-center gap-2.5 bg-stone-900 hover:bg-stone-gold text-white text-xs font-bold tracking-widest uppercase py-4 rounded-xl transition-all duration-300 shadow-md shadow-stone-900/10 cursor-pointer"
              >
                <ShoppingBag size={16} />
                <span>{t("add_to_bag")}</span>
              </button>

              <button
                onClick={() => handleToggleWishlist(product.id)}
                className={`px-6 py-4 flex items-center justify-center border rounded-xl transition-all duration-300 cursor-pointer ${wishlist.includes(product.id)
                  ? "border-red-200 bg-red-50 text-red-500"
                  : "border-stone-200 bg-white text-stone-700 hover:border-stone-400 hover:text-stone-900"
                  }`}
                aria-label="Wishlist toggle"
              >
                <Heart size={18} fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Quality Seals */}
            <div className="grid grid-cols-3 gap-4 border-t border-stone-200/60 pt-6 text-[10px] text-stone-450 uppercase font-semibold tracking-wider">
              <div className="flex items-center gap-2">
                <Truck size={15} className="text-stone-gold" />
                <span>{t("free_shipping")}</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={15} className="text-stone-gold" />
                <span>{t("thirty_day_returns")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={15} className="text-stone-gold" />
                <span>{t("secure_checkout")}</span>
              </div>
            </div>

          </div>
        </div>

        {/* RELATED PRODUCTS SECTION ("display all cards below") */}
        <div className="border-t border-stone-200 pt-16 space-y-8">
          <div className="text-left">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Recommendations</span>
            <h2 className="text-2xl font-serif font-light text-stone-900 mt-1">You May Also Like</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-12">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                isWishlisted={wishlist.includes(p.id)}
                onToggleWishlist={() => handleToggleWishlist(p.id)}
                onAddToCart={() => handleAddToCart(p)}
                onQuickView={() => setQuickViewProduct(p)}
              />
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
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
        onAddToCart={(p) => {
          handleAddToCart(p);
          handleToggleWishlist(p.id);
        }}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
        isWishlisted={quickViewProduct ? wishlist.includes(quickViewProduct.id) : false}
        onToggleWishlist={() => quickViewProduct && handleToggleWishlist(quickViewProduct.id)}
        onAddToCart={(p, size, color) => {
          handleAddToCart(p, size, color);
          setQuickViewProduct(null);
        }}
      />

      {/* Add To Cart Success Modal */}
      <AddToCartModal
        isOpen={isAddToCartOpen}
        onClose={() => setIsAddToCartOpen(false)}
        onViewCart={() => setIsCartOpen(true)}
        item={addedItem}
      />

      {/* Checkout Success Modal */}
      <CheckoutSuccessModal
        isOpen={isCheckoutSuccessOpen}
        onClose={() => setIsCheckoutSuccessOpen(false)}
        orderDetails={orderDetails}
      />

      {/* Toast notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
