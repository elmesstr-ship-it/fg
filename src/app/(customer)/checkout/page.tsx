"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { EGYPT_GOVERNORATES } from "@/config/egyptLocations";
import { translations } from "@/config/i18n";
import { PaymentMethod } from "@/types/order";
import { db } from "@/services";
import {
  Banknote,
  CreditCard,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Truck,
  Tag,
  AlertTriangle,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { locale } = useAppStore();
  const { user } = useAuthStore();
  const { items, getSubtotal, clearCart } = useCartStore();
  const t = translations[locale];

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash_on_delivery");
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "عمر الشريف",
    phone: user?.phone || "01012345678",
    email: user?.email || "demo.user@example.com",
    governorate: "القاهرة",
    city: "التجمع الخامس",
    streetAddress: "شارع التسعين الجنوبي، كمبوند ماونتن فيو، عمارة 12",
    notes: "يرجى الاتصال قبل الوصول للتسليم",
  });

  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState("");

  const subtotal = getSubtotal();
  const freeShippingThreshold = 1500;
  const shippingFee = subtotal >= freeShippingThreshold ? 0 : 65;
  const grandTotal = Math.max(0, subtotal + shippingFee - appliedDiscount);

  const selectedGov = EGYPT_GOVERNORATES.find((g) => g.name === formData.governorate);
  const availableCities = selectedGov ? selectedGov.cities : [];

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === "FG10") {
      const disc = Math.round(subtotal * 0.1);
      setAppliedDiscount(disc);
      setCouponMessage({
        text: locale === "ar" ? `تم تطبيق خصم 10% (-${disc} ج.م)` : `10% Discount applied (-${disc} EGP)`,
        isError: false,
      });
    } else if (code === "VIP20") {
      const disc = Math.round(subtotal * 0.2);
      setAppliedDiscount(disc);
      setCouponMessage({
        text: locale === "ar" ? `تم تطبيق خصم VIP 20% (-${disc} ج.م)` : `20% VIP Discount applied (-${disc} EGP)`,
        isError: false,
      });
    } else {
      setAppliedDiscount(0);
      setCouponMessage({
        text: locale === "ar" ? "كود الخصم غير صحيح" : "Invalid coupon code",
        isError: true,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedNumber = `FG-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      await db.orders.createOrder({
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          governorate: formData.governorate,
          city: formData.city,
          streetAddress: formData.streetAddress,
          notes: formData.notes,
        },
        items: items.map((it) => ({
          productId: it.product.id,
          productName: it.product.name,
          productImage: it.product.images[0],
          price: it.product.price,
          quantity: it.quantity,
          variantId: it.variantId,
          variantName: it.selectedSize ? `${it.selectedSize} / ${it.selectedColor || ""}` : it.variantName,
        })),
        paymentMethod,
        couponCode: appliedDiscount > 0 ? couponCode : undefined,
      });
    } catch {
      // Fallback for standalone demo mode
    }

    setCreatedOrderNumber(generatedNumber);
    clearCart();
    setIsSubmitting(false);
    setOrderCompleted(true);
  };

  if (orderCompleted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center justify-center shadow-lg">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#D4AF37]">
            {locale === "ar" ? "تم تأكيد طلبك بنجاح" : "Order Confirmed Successfully"}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-neutral-900 dark:text-white">
            {locale === "ar" ? "شكراً لاختيارك FG Collective" : "Thank You For Your Order"}
          </h1>
          <p className="text-sm text-neutral-500">
            {locale === "ar" ? "رقم الطلب الخاص بك:" : "Your Order Number:"}{" "}
            <span className="font-mono font-black text-black dark:text-white text-base">{createdOrderNumber}</span>
          </p>
          <p className="text-xs text-neutral-400">
            {locale === "ar"
              ? "سيتم شحن وتجهيز طلبك فوراً والتسليم خلال 24-48 ساعة."
              : "Your garment is being prepared and will be delivered within 24-48 hours."}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-xs text-start space-y-3">
          <div className="flex justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <span className="text-neutral-500">{locale === "ar" ? "طريقة الدفع:" : "Payment Mode:"}</span>
            <span className="font-bold">
              {paymentMethod === "cash_on_delivery"
                ? locale === "ar" ? "الدفع عند الاستلام (COD)" : "Cash on Delivery"
                : paymentMethod === "vodafone_cash"
                ? "Vodafone Cash / Instapay"
                : "Credit / Debit Card"}
            </span>
          </div>
          <div className="flex justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <span className="text-neutral-500">{locale === "ar" ? "المستلم:" : "Recipient:"}</span>
            <span className="font-bold">{formData.fullName} ({formData.phone})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">{locale === "ar" ? "عنوان الشحن:" : "Shipping Address:"}</span>
            <span className="font-semibold">{formData.governorate} • {formData.city} • {formData.streetAddress}</span>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/orders"
            className="px-6 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 font-bold text-xs uppercase hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            {locale === "ar" ? "عرض سجل الطلبات" : "View My Orders"}
          </Link>
          <Link
            href="/catalog"
            className="px-8 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-black text-xs uppercase hover:opacity-90 transition-opacity"
          >
            {locale === "ar" ? "متابعة التسوق" : "Continue Shopping"}
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="text-2xl font-black uppercase text-neutral-900 dark:text-white">
          {locale === "ar" ? "حقيبة التسوق فارغة" : "Shopping Bag Is Empty"}
        </h1>
        <Link
          href="/catalog"
          className="inline-block px-6 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase"
        >
          {t.navigation.catalog}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black uppercase text-neutral-900 dark:text-white">
          {locale === "ar" ? "إتمام الشراء والشحن" : "Checkout & Delivery"}
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          {locale === "ar"
            ? "تأكيد العنوان في مصر واختيار وسيلة الدفع المناسبة"
            : "Confirm your delivery destination in Egypt and choose payment method"}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left / Main: Address & Payment Methods */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Recipient & Shipping Address */}
            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-5 shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 dark:text-white pb-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#D4AF37]" />
                <span>{locale === "ar" ? "بيانات المستلم وعنوان التوصيل" : "Delivery Details"}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">
                    {locale === "ar" ? "الاسم بالكامل" : "Full Name"} *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium focus:outline-none focus:border-black dark:focus:border-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">
                    {locale === "ar" ? "رقم الهاتف المحمول (مصر)" : "Phone Number (Egypt)"} *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="010XXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium focus:outline-none focus:border-black dark:focus:border-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">
                  {locale === "ar" ? "البريد الإلكتروني للإشعارات" : "Email Address"} *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium focus:outline-none focus:border-black dark:focus:border-white font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">
                    {locale === "ar" ? "المحافظة" : "Governorate"} *
                  </label>
                  <select
                    value={formData.governorate}
                    onChange={(e) => {
                      const newGov = e.target.value;
                      const g = EGYPT_GOVERNORATES.find((item) => item.name === newGov);
                      setFormData({
                        ...formData,
                        governorate: newGov,
                        city: g?.cities[0] || "",
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium focus:outline-none focus:border-black dark:focus:border-white"
                    required
                  >
                    {EGYPT_GOVERNORATES.map((g) => (
                      <option key={g.name} value={g.name}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">
                    {locale === "ar" ? "المدينة / الحي" : "City / District"} *
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium focus:outline-none focus:border-black dark:focus:border-white"
                    required
                  >
                    {availableCities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">
                  {locale === "ar" ? "العنوان بالتفصيل (اسم الشارع، رقم العمارة، الشقة)" : "Detailed Street Address"} *
                </label>
                <input
                  type="text"
                  value={formData.streetAddress}
                  onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                  placeholder="شارع التسعين الجنوبي، عمارة 12، الدور الثاني"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium focus:outline-none focus:border-black dark:focus:border-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">
                  {locale === "ar" ? "ملاحظات التوصيل (اختياري)" : "Delivery Notes (Optional)"}
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>
            </div>

            {/* 2. Payment Method Selection */}
            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 dark:text-white pb-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                <span>{locale === "ar" ? "طريقة الدفع" : "Payment Method"}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash_on_delivery")}
                  className={`p-4 rounded-2xl border text-right transition-all ${
                    paymentMethod === "cash_on_delivery"
                      ? "border-black dark:border-white bg-neutral-100 dark:bg-neutral-800 ring-2 ring-black dark:ring-white"
                      : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                  }`}
                >
                  <Banknote className="w-5 h-5 text-neutral-700 dark:text-neutral-300 mb-2" />
                  <span className="block text-xs font-bold">
                    {locale === "ar" ? "الدفع عند الاستلام" : "Cash on Delivery"}
                  </span>
                  <span className="block text-[10px] text-neutral-400 mt-0.5">
                    {locale === "ar" ? "ادفع نقداً عند استلام الشحنة" : "Pay cash at your doorstep"}
                  </span>
                </button>

                {/* Credit Card (Demo) */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("credit_card")}
                  className={`p-4 rounded-2xl border text-right transition-all ${
                    paymentMethod === "credit_card"
                      ? "border-black dark:border-white bg-neutral-100 dark:bg-neutral-800 ring-2 ring-black dark:ring-white"
                      : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#D4AF37] mb-2" />
                  <span className="block text-xs font-bold">
                    {locale === "ar" ? "بطاقة بنكية (Visa / MC)" : "Credit / Debit Card"}
                  </span>
                  <span className="block text-[10px] text-neutral-400 mt-0.5">
                    {locale === "ar" ? "دفع آمن بالبطاقة (Demo)" : "Secure demo payment"}
                  </span>
                </button>

                {/* Mobile Wallet (Vodafone Cash / Instapay) */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("vodafone_cash")}
                  className={`p-4 rounded-2xl border text-right transition-all ${
                    paymentMethod === "vodafone_cash"
                      ? "border-black dark:border-white bg-neutral-100 dark:bg-neutral-800 ring-2 ring-black dark:ring-white"
                      : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-red-500 mb-2" />
                  <span className="block text-xs font-bold">
                    {locale === "ar" ? "فودافون كاش / إنستاباي" : "Instapay / Wallet"}
                  </span>
                  <span className="block text-[10px] text-neutral-400 mt-0.5">
                    {locale === "ar" ? "تحويل محفظة إلكترونية فورية" : "Instant mobile wallet"}
                  </span>
                </button>
              </div>
            </div>

          </div>

          {/* Right: Order Review & Total Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-5">
              <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 dark:text-white pb-3 border-b border-neutral-200 dark:border-neutral-800">
                {locale === "ar" ? "عناصر الطلب" : "Order Items"} ({items.length})
              </h2>

              {/* Items List Preview */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((it) => (
                  <div key={`${it.product.id}-${it.selectedSize}`} className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold block line-clamp-1">
                        {it.product.name[locale] || it.product.name.ar}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {it.selectedSize || "M"} • الكمية: {it.quantity}
                      </span>
                    </div>
                    <span className="font-mono font-bold">
                      {(it.product.price * it.quantity).toLocaleString()} ج.م
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Calculation */}
              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>{locale === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
                  <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
                    {subtotal.toLocaleString()} ج.م
                  </span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>{locale === "ar" ? "الخصم المطبق" : "Discount"}</span>
                    <span className="font-mono">-{appliedDiscount.toLocaleString()} ج.م</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-500">
                  <span>{locale === "ar" ? "رسوم الشحن" : "Shipping Fee"}</span>
                  <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
                    {shippingFee === 0 ? (locale === "ar" ? "مجاني" : "FREE") : `${shippingFee} ج.م`}
                  </span>
                </div>

                <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-between text-sm font-black text-neutral-950 dark:text-white">
                  <span>{locale === "ar" ? "المبلغ الإجمالي" : "Total Amount"}</span>
                  <span className="text-lg font-mono text-[#D4AF37]">
                    {grandTotal.toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
                  </span>
                </div>
              </div>

              {/* Submit Checkout Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-wider shadow-lg hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {isSubmitting
                  ? locale === "ar" ? "جاري تأكيد الطلب..." : "Confirming Order..."
                  : locale === "ar" ? "تأكيد وإتمام الطلب الآن" : "Confirm Order Now"}
              </button>

              <div className="text-[11px] text-neutral-400 text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>{locale === "ar" ? "ضمان استبدال واسترجاع لمدة 14 يوماً" : "14-Day Free Exchange Guarantee"}</span>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
