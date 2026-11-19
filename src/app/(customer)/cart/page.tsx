"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/config/i18n";
import { Button } from "@/components/ui/Button";
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { locale } = useAppStore();
  const { items, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore();
  const t = translations[locale];

  const subtotal = getSubtotal();
  const shippingFee = subtotal > 0 ? (subtotal >= 2000 ? 0 : 75) : 0;
  const grandTotal = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-theme-surface-elevated border border-theme-border flex items-center justify-center text-theme-text-muted">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h1 className="font-sacred text-2xl font-bold text-theme-text">
            {locale === "ar" ? "سلة المشتريات فارغة حالياً" : "Your cart is currently empty"}
          </h1>
          <p className="text-xs text-theme-text-muted max-w-md mx-auto">
            {locale === "ar"
              ? "استكشف مقتنياتنا الكنسية المباركة وأضف ما تحتاجه إلى سلة التسوق."
              : "Discover sacred icons, incense, and liturgical supplies in our catalog."}
          </p>
        </div>
        <div>
          <Link href="/catalog">
            <Button variant="gold" size="lg" className="rounded-xl">
              <span>{locale === "ar" ? "تصفح الكتالوج الآن" : "Browse Catalog Now"}</span>
              {locale === "ar" ? <ArrowLeft className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-theme-border pb-4">
        <h1 className="font-sacred text-2xl font-bold text-theme-text">
          {t.common.cart}
        </h1>
        <button
          onClick={clearCart}
          className="text-xs text-red-500 hover:underline flex items-center gap-1 font-medium"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{locale === "ar" ? "تفريغ السلة بالكامل" : "Clear Entire Cart"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity, variantId, variantName }) => (
            <div
              key={`${product.id}-${variantId || "default"}`}
              className="p-4 rounded-2xl bg-theme-surface border border-theme-border flex gap-4 items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-theme-surface-elevated flex-shrink-0 border border-theme-border">
                  <Image
                    src={product.images[0]}
                    alt={product.name[locale]}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <Link
                    href={`/product/${product.slug}`}
                    className="font-sacred text-sm font-bold text-theme-text hover:text-theme-primary transition-colors line-clamp-1"
                  >
                    {product.name[locale]}
                  </Link>
                  {variantName && (
                    <span className="text-[11px] text-theme-text-muted block">
                      {variantName}
                    </span>
                  )}
                  <div className="text-xs font-semibold text-theme-gold mt-1">
                    {product.price.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} {t.common.priceEGP}
                  </div>
                </div>
              </div>

              {/* Quantity Controls & Delete */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-theme-border rounded-xl bg-theme-surface-elevated">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1, variantId)}
                    className="p-1.5 hover:bg-theme-border/50 text-theme-text rounded-l-xl rtl:rounded-l-none rtl:rounded-r-xl transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-theme-text">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1, variantId)}
                    className="p-1.5 hover:bg-theme-border/50 text-theme-text rounded-r-xl rtl:rounded-r-none rtl:rounded-l-xl transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(product.id, variantId)}
                  className="p-2 text-theme-text-muted hover:text-red-500 transition-colors"
                  title={locale === "ar" ? "حذف" : "Remove"}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Panel */}
        <div className="p-6 rounded-2xl bg-theme-surface border border-theme-border shadow-sacred space-y-6">
          <h3 className="font-sacred text-base font-bold text-theme-text border-b border-theme-border pb-3">
            {locale === "ar" ? "ملخص الطلب" : "Order Summary"}
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-theme-text-muted">
              <span>{locale === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
              <span className="font-semibold text-theme-text">
                {subtotal.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} {t.common.priceEGP}
              </span>
            </div>

            <div className="flex justify-between text-theme-text-muted">
              <span>{locale === "ar" ? "تكلفة الشحن (مؤمّن)" : "Insured Shipping"}</span>
              <span className="font-semibold text-theme-text">
                {shippingFee === 0
                  ? locale === "ar" ? "مجاني (للطلبات فوق 2000 ج.م)" : "Free (Orders > 2000 EGP)"
                  : `${shippingFee} ${t.common.priceEGP}`}
              </span>
            </div>

            <div className="pt-3 border-t border-theme-border flex justify-between text-sm font-bold text-theme-text">
              <span>{locale === "ar" ? "الإجمالي الكلي" : "Total"}</span>
              <span className="text-theme-primary text-base">
                {grandTotal.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} {t.common.priceEGP}
              </span>
            </div>
          </div>

          <Link href="/checkout" className="block">
            <Button variant="gold" size="lg" className="w-full rounded-xl">
              <span>{locale === "ar" ? "متابعة الشراء والدفع" : "Proceed to Checkout"}</span>
              {locale === "ar" ? <ArrowLeft className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
