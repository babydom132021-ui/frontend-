"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Plus, Minus, Trash2, ShoppingBag, MapPin, Truck, User, Phone, Mail, Home, ArrowLeft, ChevronRight } from "lucide-react";
import { Product } from "../../data/products";
import { useLanguage } from "../../context/LanguageContext";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, size: string, color: string, delta: number) => void;
  onRemoveItem: (id: string, size: string, color: string) => void;
  onCheckout: (deliveryLocation: string, deliveryOption: string, customerName: string, phone: string, email: string) => void;
}

const CAMBODIA_LOCATIONS: Record<string, string[]> = {
  "Phnom Penh": [
    "Chamkar Mon", "Doun Penh", "Prampir Meakkara", "Tuol Kouk",
    "Sen Sok", "Chroy Changvar", "Boeng Keng Kang", "Meanchey", "Kamboul"
  ],
  "Siem Reap": ["Siem Reap Town", "Prasat Bakong", "Banteay Srei", "Sotnikum", "Chi Kraeng", "Puok"],
  "Sihanoukville": ["Preah Sihanouk Town", "Prey Nob", "Stueng Hav", "Kampong Seila"],
  "Battambang": ["Battambang Town", "Sangkae", "Thma Koul", "Moung Ruessei", "Banan"],
  "Kampot": ["Kampot Town", "Tuek Chhou", "Kampong Trach", "Chhouk", "Angkor Chey"],
  "Kandal": ["Kandal Stung", "Mukh Kampul", "Lvea Em", "Koh Thom", "Ponhea Leu"],
  "Takeo": ["Daun Keo", "Kirivong", "Bati", "Treang", "Samraong"],
  "Kratie": ["Kratie Town", "Chhlong", "Sambor", "Snuol"],
  "Preah Vihear": ["Tbeng Meanchey", "Choam Ksan", "Kulen", "Rovieng"],
  "Banteay Meanchey": ["Serei Sophon", "Thma Puok", "Mongkol Borei", "Preah Netr Preah"],
};

interface DeliveryForm {
  fullName: string;
  phone: string;
  email: string;
  street: string;
  province: string;
  district: string;
  notes: string;
  partner: string;
}

const EMPTY_FORM: DeliveryForm = {
  fullName: "", phone: "", email: "", street: "",
  province: "", district: "", notes: "", partner: "J&T",
};

export default function CartDrawer({
  isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onCheckout,
}: CartDrawerProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState<"cart" | "delivery">("cart");
  const [form, setForm] = useState<DeliveryForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<DeliveryForm>>({});
  const [deliverySettings, setDeliverySettings] = useState({ standardPrice: 0, expressPrice: 0 });

  React.useEffect(() => {
    const fetchDeliverySettings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/delivery-settings`);
        if (res.ok) {
          const data = await res.json();
          setDeliverySettings(data);
        }
      } catch (err) {
        console.error("Failed to fetch delivery settings:", err);
      }
    };
    fetchDeliverySettings();
  }, []);

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

  const hasFreeDelivery = items.some(item => item.product.free_delivery);
  const subtotal = items.reduce((t, i) => t + i.product.price * i.quantity, 0);
  const shippingCost = hasFreeDelivery
    ? 0
    : (form.partner === "Virak Buntham" ? deliverySettings.expressPrice : deliverySettings.standardPrice);
  const total = subtotal + (step === "delivery" ? shippingCost : 0);

  const setField = (key: keyof DeliveryForm, val: string) => {
    setForm((f) => ({ ...f, [key]: val, ...(key === "province" ? { district: "" } : {}) }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = (): boolean => {
    const e: Partial<DeliveryForm> = {};
    if (!form.fullName.trim()) e.fullName = t("validation_name");
    if (!form.phone.trim()) e.phone = t("validation_phone");
    else if (!/^[0-9+\s\-()]{7,15}$/.test(form.phone.trim())) e.phone = t("validation_phone_invalid");
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = t("validation_email_invalid");
    if (!form.province) e.province = t("validation_province");
    if (!form.district) e.district = t("validation_district");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirm = () => {
    if (!validate()) return;
    const location = [form.street, form.district, form.province].filter(Boolean).join(", ");
    onCheckout(location, form.partner, form.fullName, form.phone, form.email);
  };

  const inputClass = (field: keyof DeliveryForm) =>
    `w-full bg-white border rounded-lg px-3 py-2 text-xs text-stone-800 placeholder-stone-400 focus:outline-none transition-colors ${errors[field] ? "border-red-400 focus:border-red-500" : "border-stone-200 focus:border-stone-700"
    }`;

  const selectClass = (field: keyof DeliveryForm) =>
    `w-full bg-white border rounded-lg px-3 py-2 text-xs text-stone-800 focus:outline-none transition-colors cursor-pointer ${errors[field] ? "border-red-400 focus:border-red-500" : "border-stone-200 focus:border-stone-700"
    }`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full justify-end">
        {/* Drawer Panel */}
        <div className="pointer-events-auto w-full max-w-[calc(100vw-2.5rem)] sm:max-w-md transform bg-white shadow-2xl transition-transform animate-drawer-in flex flex-col h-full border-l border-stone-200">

          {/* ── HEADER ── */}
          <div className="flex items-center justify-between border-b border-stone-100 px-6 py-5 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              {step === "delivery" ? (
                <button
                  onClick={() => { setStep("cart"); setErrors({}); }}
                  className="flex items-center gap-1.5 text-stone-500 hover:text-stone-900 transition-colors text-sm font-medium"
                >
                  <ArrowLeft size={16} />
                  {t("back")}
                </button>
              ) : (
                <>
                  <ShoppingBag size={20} className="text-stone-800" />
                  <h2 className="text-lg font-medium text-stone-900 tracking-wide">
                    {t("shopping_bag")} ({items.reduce((acc, c) => acc + c.quantity, 0)})
                  </h2>
                </>
              )}
            </div>
            {step === "delivery" && (
              <h2 className="text-sm font-semibold text-stone-900 uppercase tracking-widest">
                {t("delivery_details")}
              </h2>
            )}
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-50 transition-all duration-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* ── STEP 1: CART ── */}
          {step === "cart" && (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
                {items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center py-12">
                    <div className="rounded-full bg-stone-50 p-6 mb-4">
                      <ShoppingBag size={40} className="text-stone-300" />
                    </div>
                    <h3 className="text-base font-medium text-stone-800">{t("bag_empty")}</h3>
                    <p className="mt-1 text-sm text-stone-400 max-w-xs">
                      {t("bag_empty_desc")}
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-6 bg-stone-900 hover:bg-stone-700 text-white text-xs font-semibold tracking-widest uppercase px-6 py-3 rounded-full transition-colors duration-300"
                    >
                      {t("continue_shopping")}
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100">
                    {items.map((item, idx) => (
                      <div key={idx} className="flex py-5 gap-4">
                        <div className="relative h-24 w-18 flex-shrink-0 overflow-hidden rounded bg-stone-50 border border-stone-100">
                          <Image src={item.product.image} alt={item.product.name} fill className="object-cover object-top" />
                        </div>
                        <div className="flex flex-1 flex-col justify-between min-w-0">
                          <div>
                            <div className="flex justify-between text-sm font-medium text-stone-800">
                              <h3 className="truncate pr-4" title={item.product.name}>{item.product.name}</h3>
                              <p className="flex-shrink-0 font-semibold text-stone-950">${item.product.price * item.quantity}.00</p>
                            </div>
                            <p className="mt-1 text-xs text-stone-400 flex items-center gap-2">
                              <span>{t("size")}: <strong className="text-stone-600 uppercase">{item.selectedSize}</strong></span>
                              <span className="w-1 h-1 rounded-full bg-stone-200" />
                              <span>{t("color")}: <strong className="text-stone-600">{item.selectedColor}</strong></span>
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-stone-200 rounded bg-stone-50">
                              <button onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.selectedColor, -1)} className="p-1 px-2 text-stone-500 hover:text-stone-950 transition-colors"><Minus size={12} /></button>
                              <span className="px-2 text-xs font-semibold text-stone-800">{item.quantity}</span>
                              <button onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.selectedColor, 1)} className="p-1 px-2 text-stone-500 hover:text-stone-950 transition-colors"><Plus size={12} /></button>
                            </div>
                            <button onClick={() => onRemoveItem(item.product.id, item.selectedSize, item.selectedColor)} className="text-stone-400 hover:text-red-500 p-1 transition-colors" aria-label="Remove item">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-stone-100 bg-stone-50 px-6 py-5 flex-shrink-0 space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm text-stone-500">
                      <span>{t("subtotal")}</span>
                      <span className="font-medium text-stone-800">${subtotal}.00</span>
                    </div>
                    <div className="flex justify-between text-sm text-stone-500">
                      <span>{t("shipping")}</span>
                      <span className="text-emerald-600 font-medium">{t("free")}</span>
                    </div>
                    <div className="border-t border-stone-200/60 my-1 pt-2 flex justify-between text-base font-semibold text-stone-900">
                      <span>{t("total")}</span>
                      <span>${subtotal}.00</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep("delivery")}
                    className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-700 text-white text-xs font-bold tracking-widest uppercase py-4 rounded-full transition-all duration-300 shadow-md cursor-pointer"
                  >
                    {t("proceed_to_checkout")}
                    <ChevronRight size={14} />
                  </button>
                  <p className="text-center text-[10px] text-stone-400">{t("tax_disclaimer")}</p>
                </div>
              )}
            </>
          )}

          {/* ── STEP 2: DELIVERY FORM ── */}
          {step === "delivery" && (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-5 no-scrollbar space-y-5">

                {/* Order summary strip */}
                <div className="bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 flex justify-between items-center">
                  <div className="text-xs text-stone-500">
                    <span>{items.reduce((a, i) => a + i.quantity, 0)} {items.reduce((a, i) => a + i.quantity, 0) > 1 ? t("item_count_plural") : t("item_count")}</span>
                    <span className="mx-1.5 text-stone-300">·</span>
                    <span className="text-emerald-600 font-medium">{shippingCost === 0 ? t("free_shipping") : `+$${shippingCost} Shipping`}</span>
                  </div>
                  <span className="text-sm font-bold text-stone-900">${total}.00</span>
                </div>

                {/* ─ Contact Info ─ */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <User size={13} className="text-stone-400" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">{t("contact_info")}</span>
                  </div>
                  <div className="space-y-2.5">
                    <div>
                      <input
                        type="text"
                        placeholder={t("full_name")}
                        value={form.fullName}
                        onChange={(e) => setField("fullName", e.target.value)}
                        className={inputClass("fullName")}
                      />
                      {errors.fullName && <p className="text-[10px] text-red-500 mt-1 ml-0.5">{errors.fullName}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <div className="relative">
                          <Phone size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                          <input
                            type="tel"
                            placeholder={t("phone")}
                            value={form.phone}
                            onChange={(e) => setField("phone", e.target.value)}
                            className={`${inputClass("phone")} pl-7`}
                          />
                        </div>
                        {errors.phone && <p className="text-[10px] text-red-500 mt-1 ml-0.5">{errors.phone}</p>}
                      </div>
                      <div>
                        <div className="relative">
                          <Mail size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                          <input
                            type="email"
                            placeholder={t("email")}
                            value={form.email}
                            onChange={(e) => setField("email", e.target.value)}
                            className={`${inputClass("email")} pl-7`}
                          />
                        </div>
                        {errors.email && <p className="text-[10px] text-red-500 mt-1 ml-0.5">{errors.email}</p>}
                      </div>
                    </div>
                  </div>
                </section>

                {/* ─ Delivery Address ─ */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={13} className="text-stone-400" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">{t("delivery_address")}</span>
                  </div>
                  <div className="space-y-2.5">
                    <div>
                      <div className="relative">
                        <Home size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          type="text"
                          placeholder={t("street")}
                          value={form.street}
                          onChange={(e) => setField("street", e.target.value)}
                          className={`${inputClass("street")} pl-7`}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <select
                          value={form.province}
                          onChange={(e) => setField("province", e.target.value)}
                          className={selectClass("province")}
                        >
                          <option value="">{t("province_city")}</option>
                          {Object.keys(CAMBODIA_LOCATIONS).map((p) => (
                            <option key={p} value={p}>{t(p)}</option>
                          ))}
                        </select>
                        {errors.province && <p className="text-[10px] text-red-500 mt-1 ml-0.5">{errors.province}</p>}
                      </div>
                      <div>
                        <select
                          value={form.district}
                          onChange={(e) => setField("district", e.target.value)}
                          disabled={!form.province}
                          className={`${selectClass("district")} disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed`}
                        >
                          <option value="">{t("district_khan")}</option>
                          {form.province && CAMBODIA_LOCATIONS[form.province].map((d) => (
                            <option key={d} value={d}>{t(d)}</option>
                          ))}
                        </select>
                        {errors.district && <p className="text-[10px] text-red-500 mt-1 ml-0.5">{errors.district}</p>}
                      </div>
                    </div>
                    <textarea
                      placeholder={t("order_notes")}
                      value={form.notes}
                      onChange={(e) => setField("notes", e.target.value)}
                      rows={2}
                      className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-700 transition-colors resize-none"
                    />
                  </div>
                </section>

                {/* ─ Delivery Partner ─ */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Truck size={13} className="text-stone-400" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">{t("delivery_partner")}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: "J&T", label: "J&T Express", sub: t("business_days"), badge: t("standard"), price: hasFreeDelivery ? 0 : deliverySettings.standardPrice },
                      { id: "Virak Buntham", label: "Virak Buntham", sub: t("same_next_day"), badge: t("express"), price: hasFreeDelivery ? 0 : deliverySettings.expressPrice },
                    ].map((partner) => (
                      <button
                        key={partner.id}
                        type="button"
                        onClick={() => setField("partner", partner.id)}
                        className={`flex flex-col items-start p-3 border rounded-xl text-left cursor-pointer transition-all ${form.partner === partner.id
                            ? "border-stone-900 bg-stone-50 ring-1 ring-stone-900"
                            : "border-stone-200 hover:border-stone-400 bg-white"
                          }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-xs font-bold text-stone-900">{partner.label}</span>
                          <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full ${partner.id === "Virak Buntham" ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-500"
                            }`}>{partner.badge}</span>
                        </div>
                        <span className="text-[10px] text-stone-400">{partner.sub}</span>
                        <span className={`text-[10px] font-semibold mt-0.5 ${partner.price === 0 ? "text-emerald-600" : "text-stone-900"}`}>
                          {partner.price === 0 ? t("free") : `$${partner.price.toFixed(2)}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>

              </div>

              {/* ─ Footer ─ */}
              <div className="border-t border-stone-100 bg-stone-50 px-6 py-5 flex-shrink-0 space-y-3">
                <div className="flex justify-between text-sm font-bold text-stone-900">
                  <span>{t("total")}</span>
                  <span>${total}.00</span>
                </div>
                <button
                  onClick={handleConfirm}
                  className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-700 text-white text-xs font-bold tracking-widest uppercase py-4 rounded-full transition-all duration-300 shadow-md cursor-pointer"
                >
                  {t("confirm_place_order")}
                </button>
                <p className="text-center text-[10px] text-stone-400">{t("secure_info")}</p>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
