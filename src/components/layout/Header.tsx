"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import AuthModal from "../features/AuthModal";

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onCartClick: () => void;
  onWishlistClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  scrollToProducts: () => void;
}

export default function Header({
  cartCount,
  wishlistCount,
  onCartClick,
  onWishlistClick,
  searchQuery,
  onSearchChange,
  scrollToProducts,
}: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-stone-200/50"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Mobile Menu Icon */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-stone-700 hover:text-stone-900 transition-colors p-2 -ml-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-1 md:flex-initial flex justify-center md:justify-start">
            <Link
              href="/"
              className="inline-flex items-center text-lg sm:text-2xl font-serif font-semibold tracking-[0.15em] sm:tracking-[0.25em] text-stone-900 transition-opacity hover:opacity-80"
            >
              DOM STORE
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex space-x-8 lg:space-x-12">
            {[
              { id: "Home", label: t("home") },
              { id: "Shop", label: t("shop") },
              { id: "Categories", label: t("categories") },
              { id: "Deals", label: t("deals") }
            ].map((item) => (
              <a
                key={item.id}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (item.id === "Shop" || item.id === "Categories" || item.id === "Deals") {
                    scrollToProducts();
                  }
                }}
                className="text-sm font-medium tracking-wider uppercase text-stone-600 hover:text-stone-950 transition-colors relative py-2 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-stone-800 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Search Input Box */}
            <div className="relative flex items-center">
              <div
                className={`flex items-center overflow-hidden transition-all duration-300 ease-out border-stone-200 bg-stone-50 rounded-full ${
                  isSearchExpanded ? "w-40 sm:w-60 px-3 py-1 border" : "w-0 border-none"
                }`}
              >
                <input
                  type="text"
                  placeholder={t("search_placeholder")}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full text-xs bg-transparent border-none outline-none text-stone-800 placeholder-stone-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange("")}
                    className="text-stone-400 hover:text-stone-600 p-0.5 text-[10px]"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setIsSearchExpanded(!isSearchExpanded);
                  if (isSearchExpanded) {
                    onSearchChange("");
                  }
                }}
                className="p-2 text-stone-700 hover:text-stone-900 transition-colors"
                aria-label="Toggle search bar"
              >
                <Search size={20} />
              </button>
            </div>

            {/* Language Switcher */}
            <div className="hidden sm:flex items-center gap-0.5 border border-stone-200 rounded-full p-0.5 bg-stone-50 mr-1">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-2 py-0.5 text-[9px] font-bold rounded-full transition-all cursor-pointer ${
                  language === "en"
                    ? "bg-stone-900 text-white shadow-xs"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage("kh")}
                className={`px-2 py-0.5 text-[9px] font-bold rounded-full transition-all cursor-pointer ${
                  language === "kh"
                    ? "bg-stone-900 text-white shadow-xs"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                KH
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                className="p-2 text-stone-700 hover:text-stone-900 transition-colors hidden sm:block cursor-pointer"
                aria-label="Profile"
                onClick={() => {
                  if (user) {
                    setIsProfileOpen(!isProfileOpen);
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
              >
                <div className="flex items-center gap-1">
                  <User size={20} />
                  {user && (
                    <span className="text-[10px] font-bold tracking-wider uppercase text-stone-600 max-w-[80px] truncate">
                      {user.name.split(" ")[0]}
                    </span>
                  )}
                </div>
              </button>
              
              {isProfileOpen && user && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-stone-200 rounded-xl shadow-xl py-2.5 z-50 animate-slide-up text-left">
                  <div className="px-4 py-2 border-b border-stone-100 mb-1 flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5 justify-between">
                      <p className="text-xs font-semibold text-stone-900 truncate max-w-[100px]">{user.name}</p>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full tracking-wider uppercase ${
                        user.role === "admin" ? "bg-amber-100 text-amber-800" : "bg-stone-100 text-stone-650"
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    <p className="text-[9px] text-stone-400 truncate">{user.email}</p>
                  </div>
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 text-[11px] text-stone-750 hover:bg-stone-50 hover:text-stone-950 transition-colors uppercase tracking-wider font-bold"
                    >
                      {t("admin_dashboard")}
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-[11px] text-red-600 hover:bg-red-50 transition-colors uppercase tracking-wider font-bold cursor-pointer"
                  >
                    {t("logout")}
                  </button>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={onWishlistClick}
              className="p-2 text-stone-700 hover:text-stone-900 transition-colors relative cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-stone-800 text-[9px] font-bold text-white leading-none scale-90">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="p-2 text-stone-700 hover:text-stone-900 transition-colors relative cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-stone-gold text-[9px] font-bold text-white leading-none scale-90">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-stone-200 py-6 px-6 shadow-lg animate-slide-down">
          <nav className="flex flex-col space-y-4">
            {[
              { id: "Home", label: t("home") },
              { id: "Shop", label: t("shop") },
              { id: "Categories", label: t("categories") },
              { id: "Deals", label: t("deals") }
            ].map((item) => (
              <a
                key={item.id}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  scrollToProducts();
                }}
                className="text-base font-medium text-stone-700 hover:text-stone-900 py-2 border-b border-stone-100"
              >
                {item.label}
              </a>
            ))}
            
            {/* Mobile Profile option */}
            <div className="flex flex-col space-y-3 pt-3 border-t border-stone-100">
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Language / ភាសា</span>
                <div className="flex items-center gap-0.5 border border-stone-200 rounded-full p-0.5 bg-stone-50">
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage("en");
                    }}
                    className={`px-2 py-0.5 text-[9px] font-bold rounded-full transition-all cursor-pointer ${
                      language === "en"
                        ? "bg-stone-900 text-white shadow-xs"
                        : "text-stone-500"
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage("kh");
                    }}
                    className={`px-2 py-0.5 text-[9px] font-bold rounded-full transition-all cursor-pointer ${
                      language === "kh"
                        ? "bg-stone-900 text-white shadow-xs"
                        : "text-stone-500"
                    }`}
                  >
                    KH
                  </button>
                </div>
              </div>
              {user ? (
                <>
                  <div className="flex items-center px-1 justify-between">
                    <div className="flex items-center">
                      <User size={18} className="mr-2 text-stone-400" />
                      <div>
                        <span className="block text-sm font-semibold text-stone-900">{user.name}</span>
                        <span className="block text-[10px] text-stone-400">{user.email}</span>
                      </div>
                    </div>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full tracking-wider uppercase ${
                      user.role === "admin" ? "bg-amber-100 text-amber-800" : "bg-stone-100 text-stone-650"
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center text-xs bg-stone-900 hover:bg-stone-gold text-white font-bold tracking-widest uppercase py-3.5 rounded-full transition-colors duration-300 cursor-pointer"
                    >
                      Admin Control Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-center text-xs bg-red-50 hover:bg-red-100 text-red-655 font-bold tracking-widest uppercase py-3.5 rounded-full transition-colors duration-300 cursor-pointer border border-red-200"
                  >
                    {t("logout")}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="block w-full text-center text-xs bg-stone-900 hover:bg-stone-gold text-white font-bold tracking-widest uppercase py-3.5 rounded-full transition-colors duration-300 cursor-pointer"
                >
                  {t("login")} / {t("register")}
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
}
