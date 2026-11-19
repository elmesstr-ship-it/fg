"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Check, Flame, Sparkles } from "lucide-react";
import { MockProduct } from "@/lib/fashionMockData";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAppStore } from "@/store/useAppStore";

interface SanctuaryProductCardProps {
  product: MockProduct;
  featuredLayout?: boolean;
}

export function SanctuaryProductCard({ product }: SanctuaryProductCardProps) {
  const { locale } = useAppStore();
  const { addItem } = useCartStore();
  const { items: wishlistItems, addItem: addWishlist, removeItem: removeWishlist } = useWishlistStore();

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || "M");
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [isAddedToast, setIsAddedToast] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isFavorited = wishlistItems.some((it) => it.id === product.id);

  // Map to Product interface for cart & wishlist stores
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
    discountPercentage: product.discountPercentage,
    stock: product.stock,
    sku: product.sku,
    images: product.images,
    isFeatured: Boolean(product.isFeatured),
    rating: product.rating,
    reviewCount: product.reviewCount,
    specifications: {},
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const selectedColorName = product.colors?.[selectedColorIndex]?.name?.[locale] || "Black";
    addItem(formattedProduct as any, 1, undefined, undefined, selectedSize, selectedColorName);

    setIsAddedToast(true);
    setTimeout(() => setIsAddedToast(false), 1600);
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

  const currentDisplayImage =
    isHovered && product.images.length > 1 ? product.images[1] : product.images[0];

  return (
    <div
      className="group relative flex flex-col bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-neutral-600 transition-all duration-300 shadow-sm hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. PRODUCT BADGES */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1 pointer-events-none">
        {product.badge && (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black dark:bg-white text-white dark:text-black shadow-md">
            {locale === "ar" ? product.badge.ar : product.badge.en}
          </span>
        )}
        {product.discountPercentage && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37] text-black">
            -{product.discountPercentage}%
          </span>
        )}
      </div>

      {/* 2. WISHLIST BUTTON */}
      <button
        onClick={handleToggleWishlist}
        aria-label="Toggle Wishlist"
        className={`absolute top-3 left-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isFavorited
            ? "bg-red-500 text-white shadow-md scale-105"
            : "bg-white/80 dark:bg-black/60 text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-black hover:scale-110 backdrop-blur-sm"
        }`}
      >
        <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
      </button>

      {/* 3. PRODUCT IMAGE STAGE */}
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
        <Image
          src={currentDisplayImage}
          alt={locale === "ar" ? product.name.ar : product.name.en}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority={false}
        />

        {/* Quick Size Selection Overlay on Hover */}
        <div className="absolute inset-x-2 bottom-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="p-2 rounded-xl bg-white/95 dark:bg-black/90 backdrop-blur-md shadow-lg border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                {locale === "ar" ? "المقاس السريع" : "Select Size"}
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                {product.fashionDetails?.gsm?.split(" ")[0]} GSM
              </span>
            </div>
            <div className="flex items-center justify-between gap-1">
              {product.sizes?.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`flex-1 py-1 text-[11px] font-bold rounded transition-colors ${
                    selectedSize === size
                      ? "bg-black dark:bg-white text-white dark:text-black"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Link>

      {/* 4. PRODUCT CARD BODY */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Category & Color Swatches */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              {locale === "ar" ? product.category.nameAr : product.category.nameEn}
            </span>

            {/* Colors Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-1">
                {product.colors.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedColorIndex(idx);
                    }}
                    title={locale === "ar" ? c.name.ar : c.name.en}
                    className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                      selectedColorIndex === idx
                        ? "ring-2 ring-black dark:ring-white scale-110"
                        : "border-neutral-300 dark:border-neutral-700"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`} className="block group-hover:text-[#D4AF37] transition-colors">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-1 leading-snug">
              {locale === "ar" ? product.name.ar : product.name.en}
            </h3>
          </Link>

          {/* Tagline / Subtitle */}
          <p className="text-[12px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
            {locale === "ar" ? product.tagline.ar : product.tagline.en}
          </p>
        </div>

        {/* Price & Action Button */}
        <div className="pt-3 mt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-neutral-950 dark:text-white">
              {product.price.toLocaleString()}{" "}
              <span className="text-xs font-bold text-neutral-500">{locale === "ar" ? "ج.م" : "EGP"}</span>
            </span>
            {product.originalPrice && (
              <span className="text-xs line-through text-neutral-400 font-sans">
                {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Add to Bag Action */}
          <button
            onClick={handleQuickAdd}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              isAddedToast
                ? "bg-emerald-600 text-white"
                : "bg-neutral-100 dark:bg-neutral-800 hover:bg-black dark:hover:bg-white text-neutral-900 dark:text-white hover:text-white dark:hover:text-black"
            }`}
          >
            {isAddedToast ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{locale === "ar" ? "تمت الإضافة" : "Added"}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{locale === "ar" ? "أضف" : "Add"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
