"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/config/i18n";
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag, ShieldCheck, Tag, Check } from "lucide-react";

export default function CartPage() {
  const { locale } = useAppStore();
  const { items, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore();
  const t = translations[locale];

  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const freeShippingThreshold = 1500;
  const shippingFee = subtotal > 0 ? (subtotal >= freeShippingThreshold ? 0 : 65) : 0;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === "FG10") {
      setDiscountPercent(10);
      setCouponSuccess(locale === "ar" ? "تم تطبيق خصم 10% بنجاح!" : "10% Discount applied!");
      setCouponError(null);
    } else if (code === "VIP20") {
      setDiscountPercent(20);
      setCouponSuccess(locale === "ar" ? "تم تطبيق خصم VIP 20% بنجاح!" : "20% VIP Discount applied!");
      setCouponError(null);
    } else {
      setCouponError(locale === "ar" ? "كود الخصم غير صالح" : "Invalid coupon code");
      setCouponSuccess(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-400">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black uppercase text-neutral-900 dark:text-white">
            {locale === "ar" ? "حقيبة التسوق فارغة حالياً" : "Your Shopping Bag Is Empty"}
          </h1>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            {locale === "ar"
              ? "استكشف أحدث إصدارات دروب 01 وتصاميم الهوديز والتيشرتات الأوفرسايز وأضف ما يناسبك."
              : "Explore our latest Drop 01 releases, heavyweight hoodies, and oversized tees."}
          </p>
        </div>
        <div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider shadow-lg hover:opacity-90 transition-all"
          >
            <span>{locale === "ar" ? "تسوق الإصدارات الآن" : "Shop New Drops"}</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-neutral-900 dark:text-white">
            {t.common.cart} ({items.length})
          </h1>
          <span className="text-xs text-neutral-400 font-mono">FG COLLECTIVE BAG</span>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-500 hover:underline flex items-center gap-1 font-semibold"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{locale === "ar" ? "تفريغ الحقيبة بالكامل" : "Clear All"}</span>
        </button>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span>
            {remainingForFreeShipping > 0
              ? locale === "ar"
                ? `أضف ${remainingForFreeShipping.toLocaleString()} ج.م إضافية للحصول على شحن مجاني لكافة محافظات مصر!`
                : `Add ${remainingForFreeShipping.toLocaleString()} EGP more for FREE shipping across Egypt!`
              : locale === "ar"
              ? "🎉 مبروك! طلبيتك مؤهلة للشحن المجاني السريع."
              : "🎉 Congratulations! You unlocked FREE express shipping."}
          </span>
          <span className="font-mono text-[#D4AF37]">{freeShippingProgress}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
          <div
            className="h-full bg-black dark:bg-[#D4AF37] transition-all duration-500"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity, variantId, variantName, selectedSize, selectedColor }) => (
            <div
              key={`${product.id}-${selectedSize || "nosize"}-${selectedColor || "nocolor"}`}
              className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex gap-4 items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 border border-neutral-200 dark:border-neutral-800">
                  <Image
                    src={product.images[0] || "/branding/hero-banner.jpg"}
                    alt={product.name[locale] || product.name.ar}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <Link
                    href={`/product/${product.slug}`}
                    className="text-sm font-bold text-neutral-900 dark:text-white hover:underline line-clamp-1"
                  >
                    {product.name[locale] || product.name.ar}
                  </Link>

                  <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                    {selectedSize && (
                      <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono font-bold text-neutral-800 dark:text-neutral-200">
                        {selectedSize}
                      </span>
                    )}
                    {selectedColor && (
                      <span className="text-[11px] text-neutral-400">
                        • {selectedColor}
                      </span>
                    )}
                  </div>

                  <div className="text-sm font-black text-neutral-950 dark:text-white mt-1.5">
                    {product.price.toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
                  </div>
                </div>
              </div>

              {/* Quantity Controls & Delete */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-950 px-2 py-1">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1, variantId, selectedSize, selectedColor)}
                    className="p-1 text-neutral-500 hover:text-black dark:hover:text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2.5 text-xs font-mono font-bold">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1, variantId, selectedSize, selectedColor)}
                    className="p-1 text-neutral-500 hover:text-black dark:hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(product.id, variantId, selectedSize, selectedColor)}
                  className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-5">
          <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 dark:text-white pb-3 border-b border-neutral-200 dark:border-neutral-800">
            {locale === "ar" ? "ملخص الطلب" : "Order Summary"}
          </h2>

          {/* Coupon Input Form */}
          <form onSubmit={handleApplyCoupon} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={locale === "ar" ? "كود الخصم (جرب FG10)" : "Coupon (e.g. FG10)"}
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black uppercase font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold hover:opacity-90"
              >
                {locale === "ar" ? "تطبيق" : "Apply"}
              </button>
            </div>
            {couponSuccess && (
              <p className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> {couponSuccess}
              </p>
            )}
            {couponError && (
              <p className="text-[11px] text-red-500 font-bold">
                {couponError}
              </p>
            )}
          </form>

          {/* Financial Breakdown */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-neutral-500">
              <span>{locale === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
              <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
                {subtotal.toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
              </span>
            </div>

            {discountAmount > 0 && (
              <div className="flex items-center justify-between text-emerald-600 font-bold">
                <span>{locale === "ar" ? `خصم الكود (${discountPercent}%)` : `Discount (${discountPercent}%)`}</span>
                <span className="font-mono">
                  -{discountAmount.toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-neutral-500">
              <span>{locale === "ar" ? "رسوم الشحن (مصر)" : "Shipping (Egypt)"}</span>
              <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
                {shippingFee === 0
                  ? locale === "ar"
                    ? "مجاني (Free)"
                    : "FREE"
                  : `${shippingFee} ${locale === "ar" ? "ج.م" : "EGP"}`}
              </span>
            </div>

            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-sm font-black text-neutral-950 dark:text-white">
              <span>{locale === "ar" ? "الإجمالي الكلي" : "Total Due"}</span>
              <span className="text-lg font-mono text-[#D4AF37]">
                {grandTotal.toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
              </span>
            </div>
          </div>

          {/* Checkout CTA */}
          <Link
            href="/checkout"
            className="block w-full py-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-wider text-center shadow-lg hover:opacity-90 transition-all"
          >
            {locale === "ar" ? "متابعة الشراء وإنهاء الطلب" : "Proceed to Checkout"}
          </Link>

          <div className="text-[11px] text-neutral-400 text-center flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>{locale === "ar" ? "دفع آمن ومضمون 100% مع خيار الدفع عند الاستلام" : "100% Secure Checkout with Cash on Delivery"}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
