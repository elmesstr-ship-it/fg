"use client";

import React from "react";
import Link from "next/link";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/config/i18n";
import { SanctuaryProductCard } from "@/components/products/SanctuaryProductCard";
import { MOCK_PRODUCTS } from "@/lib/fashionMockData";
import { Heart, ArrowLeft, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const { locale } = useAppStore();
  const { items } = useWishlistStore();
  const t = translations[locale];

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-400">
          <Heart className="w-10 h-10 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black uppercase text-neutral-900 dark:text-white">
            {locale === "ar" ? "قائمة الرغبات فارغة حالياً" : "Your Wishlist is Empty"}
          </h1>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            {locale === "ar"
              ? "احفظ تصاميمك المفضلة من الهوديز والتيشرتات للرجوع إليها والطلب السريع بالضغط على علامة القلب."
              : "Save your favorite streetwear pieces and drops to revisit and order anytime."}
          </p>
        </div>
        <div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase shadow-lg hover:opacity-90 transition-all"
          >
            <span>{locale === "ar" ? "استكشف الكتالوج" : "Explore Drops"}</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900 dark:text-white">
          {t.common.wishlist}
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          {locale === "ar" ? `${items.length} قطع محفوظة في قائمتك` : `${items.length} saved garments`}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((prod) => {
          // Find matching fashion mock data or wrap
          const fashionMock = MOCK_PRODUCTS.find((p) => p.id === prod.id) || {
            ...prod,
            tagline: prod.shortDescription,
            description: prod.fullDescription,
            fashionDetails: { gsm: "380 GSM", fabric: "100% Cotton", fit: "Oversized", care: "Cold Wash", origin: "Egypt" },
            category: { id: prod.categoryId, slug: "cat", nameAr: prod.categoryName.ar, nameEn: prod.categoryName.en },
            sizes: ["S", "M", "L", "XL", "XXL"],
            colors: [{ name: { ar: "أسود", en: "Black" }, hex: "#0A0A0A" }],
            collectionSlug: "core",
            dropStatus: "available" as const,
            variants: [],
          };
          return <SanctuaryProductCard key={prod.id} product={fashionMock as any} />;
        })}
      </div>
    </div>
  );
}
