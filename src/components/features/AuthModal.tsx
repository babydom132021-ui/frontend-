"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { X, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { createPortal } from "react-dom";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (activeTab === "login") {
        const res = await login(email, password);
        if (res.success) {
          onClose();
          resetForm();
        } else {
          setError(res.error || "Failed to log in.");
        }
      } else {
        if (!name) {
          setError("Name is required.");
          setIsSubmitting(false);
          return;
        }
        const res = await register(name, email, password);
        if (res.success) {
          onClose();
          resetForm();
        } else {
          setError(res.error || "Failed to register.");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white border border-stone-200/80 rounded-2xl shadow-2xl overflow-hidden z-10 animate-slide-up">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 transition-colors p-1 cursor-pointer rounded-full hover:bg-stone-50"
        >
          <X size={20} />
        </button>

        <div className="px-8 pt-10 pb-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-serif tracking-wider text-stone-900 font-semibold mb-1">
              {activeTab === "login" ? t("welcome_back") : t("create_account")}
            </h2>
            <p className="text-xs text-stone-400">
              {activeTab === "login" ? "Access your premium wardrobe" : "Join Fluzen luxury community"}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-stone-100 mb-6">
            <button
              onClick={() => {
                setActiveTab("login");
                setError("");
              }}
              className={`flex-1 pb-3 text-xs uppercase tracking-widest font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "login"
                  ? "border-stone-900 text-stone-950"
                  : "border-transparent text-stone-400 hover:text-stone-700"
              }`}
            >
              {t("login")}
            </button>
            <button
              onClick={() => {
                setActiveTab("register");
                setError("");
              }}
              className={`flex-1 pb-3 text-xs uppercase tracking-widest font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "register"
                  ? "border-stone-900 text-stone-950"
                  : "border-transparent text-stone-400 hover:text-stone-700"
              }`}
            >
              {t("register")}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-655 text-xs rounded-xl flex items-center gap-2">
                <span className="font-semibold">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Name (Register Only) */}
            {activeTab === "register" && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  {t("name")}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-stone-900 focus:bg-white transition-all text-stone-800 placeholder-stone-400"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                {t("email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-stone-900 focus:bg-white transition-all text-stone-800 placeholder-stone-400"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                {t("password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-stone-900 focus:bg-white transition-all text-stone-800 placeholder-stone-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-stone-900 hover:bg-stone-gold text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl shadow-md transition-all duration-300 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>{isSubmitting ? (activeTab === "login" ? t("signing_in") : t("signing_up")) : ""}</span>
                </>
              ) : (
                <span>{activeTab === "login" ? t("login") : t("register")}</span>
              )}
            </button>
          </form>

          {/* Footer Toggle Link */}
          <div className="text-center mt-6">
            <button
              onClick={() => {
                setActiveTab(activeTab === "login" ? "register" : "login");
                setError("");
              }}
              className="text-[11px] text-stone-500 hover:text-stone-900 hover:underline cursor-pointer"
            >
              {activeTab === "login" ? t("dont_have_account") : t("already_have_account")}{" "}
              <span className="font-bold underline text-stone-900 ml-1">
                {activeTab === "login" ? t("register") : t("login")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
