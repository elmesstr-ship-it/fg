"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { useAppStore } from "@/store/useAppStore";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { translations } from "@/config/i18n";
import { ShoppingBag, Heart, Star, Sparkles } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { locale } = useAppStore();
  const addItemToCart = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const t = translations[locale];

  const inWishlist = isInWishlist(product.id);

  return (
    <div className="group relative bg-theme-surface rounded-2xl border border-theme-border overflow-hidden hover:border-theme-gold/60 transition-all duration-300 hover:shadow-sacred flex flex-col justify-between">
      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-theme-surface-elevated">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name[locale]}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product)}
          className={`absolute top-3 right-3 rtl:right-auto rtl:left-3 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
            inWishlist
              ? "bg-red-50 text-red-600"
              : "bg-white/80 dark:bg-black/40 text-theme-text hover:text-red-500"
          }`}
          title={t.common.wishlist}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
        </button>

        {/* Discount or Highlight Tag */}
        {product.discountPercentage && (
          <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 px-2 py-1 rounded-md text-[10px] font-bold bg-theme-primary text-white shadow-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-theme-gold-light" />
            <span>-{product.discountPercentage}%</span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="text-[11px] font-semibold text-theme-gold uppercase tracking-wider mb-1">
            {product.categoryName[locale]}
          </div>

          <Link href={`/product/${product.slug}`}>
            <h3 className="font-sacred text-sm font-bold text-theme-text group-hover:text-theme-primary transition-colors line-clamp-1 mb-1">
              {product.name[locale]}
            </h3>
          </Link>

          <p className="text-xs text-theme-text-muted line-clamp-2 mb-3">
            {product.shortDescription[locale]}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3 text-xs text-theme-text-muted">
            <div className="flex text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-semibold text-theme-text">{product.rating}</span>
            <span>({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-3 border-t border-theme-border flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-theme-text">
                {product.price.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}
              </span>
              <span className="text-[11px] text-theme-text-muted">{t.common.priceEGP}</span>
            </div>
            {product.originalPrice && (
              <span className="text-[11px] line-through text-theme-text-muted">
                {product.originalPrice.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} {t.common.priceEGP}
              </span>
            )}
          </div>

          <button
            onClick={() => addItemToCart(product)}
            className="p-2.5 rounded-xl bg-theme-surface-elevated border border-theme-border hover:bg-theme-primary hover:text-white hover:border-transparent text-theme-primary transition-all duration-200 group/btn shadow-sm"
            title={t.common.addToCart}
          >
            <ShoppingBag className="w-4 h-4 text-current" />
          </button>
        </div>
      </div>
    </div>
  );
}
