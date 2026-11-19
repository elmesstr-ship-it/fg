"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Star, Eye, Check } from "lucide-react";
import { MockProduct } from "@/lib/mockData";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useSeasonalVisualStore } from "@/store/seasonalVisualStore";

interface SanctuaryProductCardProps {
  product: MockProduct;
  featuredLayout?: boolean;
}

export function SanctuaryProductCard({ product, featuredLayout }: SanctuaryProductCardProps) {
  const { addItem } = useCartStore();
  const { items: wishlistItems, addItem: addWishlist, removeItem: removeWishlist } = useWishlistStore();
  const { currentMode, christmasSubMode } = useSeasonalVisualStore();
  const [isAddedToast, setIsAddedToast] = useState(false);

  const isFavorited = wishlistItems.some((it) => it.id === product.id);

  const formattedProduct = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    shortDescription: product.tagline,
    fullDescription: product.description,
    categoryId: product.category.id,
    categoryName: { ar: product.category.nameAr, en: product.category.nameEn },
    price: product.price,
    originalPrice: product.originalPrice,
    stock: product.stock,
    sku: product.sku,
    images: product.images,
    isFeatured: Boolean(product.isFeatured),
    rating: product.rating,
    reviewCount: product.reviewCount,
    specifications: {},
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(formattedProduct as any, 1);

    setIsAddedToast(true);
    setTimeout(() => setIsAddedToast(false), 1800);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorited) {
      removeWishlist(product.id);
    } else {
      addWishlist(formattedProduct as any);
    }
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E8E2D2] hover:border-[#c5a059]/60 shadow-[0_4px_20px_-2px_rgba(28,25,23,0.05)] hover:shadow-[0_12px_32px_-4px_rgba(120,29,34,0.12)] transition-all duration-500">
      {/* Liturgical Arch Motif or Festive Ribbon */}
      {currentMode === "christmas" && christmasSubMode === "festive" && (
        <div className="absolute top-0 right-0 z-20 overflow-hidden w-24 h-24 pointer-events-none">
          <div className="absolute transform rotate-45 bg-[#8B0000] text-amber-200 text-[9px] font-bold py-1 right-[-35px] top-[18px] w-[120px] text-center shadow-md tracking-wider border-y border-[#D4AF37]/50 font-serif">
            ميلادي مبارك
          </div>
        </div>
      )}

      {/* Product Image Stage */}
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] bg-stone-100 overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name.ar}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Liturgical Badge */}
        {product.badge && (
          <div className="absolute top-3 right-3 z-10">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide shadow-sm border ${
                product.badge.type === "gold"
                  ? "bg-[#FCFBF7] text-[#947231] border-[#C5A059]/40"
                  : product.badge.type === "crimson"
                  ? "bg-[#781d22] text-white border-red-900"
                  : "bg-emerald-900 text-emerald-100 border-emerald-800"
              }`}
            >
              {product.badge.ar}
            </span>
          </div>
        )}

        {/* Quick Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label="Add to wishlist"
          className={`absolute top-3 left-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
            isFavorited
              ? "bg-[#781d22] text-white shadow-md scale-110"
              : "bg-white/80 backdrop-blur-md text-stone-700 hover:bg-white hover:text-[#781d22] shadow-sm"
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? "fill-white" : ""}`} />
        </button>

        {/* Hover Slide-up Action Deck */}
        <div className="absolute inset-x-3 bottom-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#781d22] hover:bg-[#5a1418] text-white text-xs font-semibold shadow-lg shadow-red-950/20 transition-colors"
          >
            {isAddedToast ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>تمت الإضافة للسلة</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-[#DFC285]" />
                <span>إضافة إلى السلة</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Editorial Content & Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 bg-white">
        {/* Category & Origin */}
        <div className="flex items-center justify-between text-xs text-stone-400 mb-1.5">
          <span className="font-medium hover:text-[#781d22] transition-colors">
            {product.category.nameAr}
          </span>
          <span className="text-[11px] text-amber-700/80">
            {product.liturgicalDetails.origin.split("/")[0]}
          </span>
        </div>

        {/* Title */}
        <Link href={`/product/${product.slug}`} className="block group-hover:text-[#781d22] transition-colors">
          <h3 className="font-sacred font-bold text-base sm:text-lg text-stone-900 line-clamp-1 leading-snug">
            {product.name.ar}
          </h3>
        </Link>

        {/* Tagline */}
        <p className="text-xs text-stone-500 line-clamp-2 mt-1.5 leading-relaxed font-sans flex-1">
          {product.tagline.ar}
        </p>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-stone-100">
          <div className="flex items-center text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-[11px] font-medium text-stone-400">
            ({product.reviewCount} تقييم مصلين)
          </span>
        </div>

        {/* Pricing Deck */}
        <div className="flex items-baseline justify-between mt-3">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-lg sm:text-xl text-[#781d22] font-serif">
              {product.price.toLocaleString("ar-EG")} ج.م
            </span>
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through">
                {product.originalPrice.toLocaleString("ar-EG")} ج.م
              </span>
            )}
          </div>

          <span
            className={`text-[11px] font-medium ${
              product.stock > 3 ? "text-emerald-700" : "text-amber-800 font-semibold"
            }`}
          >
            {product.stock > 3 ? "متوفر بالمخزن" : `متبقي ${product.stock} فقط`}
          </span>
        </div>
      </div>
    </div>
  );
}
