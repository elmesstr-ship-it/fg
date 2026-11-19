"use client";

import React from "react";
import Link from "next/link";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/config/i18n";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { Heart, ArrowLeft, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const { locale } = useAppStore();
  const { items } = useWishlistStore();
  const t = translations[locale];

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-theme-surface-elevated border border-theme-border flex items-center justify-center text-theme-text-muted">
          <Heart className="w-10 h-10 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h1 className="font-sacred text-2xl font-bold text-theme-text">
            {locale === "ar" ? "قائمة الرغبات فارغة حالياً" : "Your Wishlist is Empty"}
          </h1>
          <p className="text-xs text-theme-text-muted max-w-md mx-auto">
            {locale === "ar"
              ? "احفظ مقتنياتك المفضلة للرجوع إليها لاحقاً بالضغط على علامة القلب."
              : "Save your favorite icons and liturgical items to revisit them later."}
          </p>
        </div>
        <div>
          <Link href="/catalog">
            <Button variant="gold" size="lg" className="rounded-xl">
              <span>{locale === "ar" ? "استكشف المنتجات" : "Explore Products"}</span>
              {locale === "ar" ? <ArrowLeft className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-theme-border pb-4">
        <h1 className="font-sacred text-2xl font-bold text-theme-text">
          {t.common.wishlist}
        </h1>
        <p className="text-xs text-theme-text-muted mt-1">
          {locale === "ar" ? `${items.length} مقتنيات محفوظة` : `${items.length} saved treasures`}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </div>
  );
}
