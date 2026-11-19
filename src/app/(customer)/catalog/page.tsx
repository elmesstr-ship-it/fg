"use client";

import React, { useEffect, useState, useTransition, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MockProduct } from "@/lib/fashionMockData";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/config/i18n";
import { SanctuaryProductCard } from "@/components/products/SanctuaryProductCard";
import { Search, SlidersHorizontal, Flame, Sparkles } from "lucide-react";

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";
  const initialDrop = searchParams.get("drop");

  const { locale } = useAppStore();
  const t = translations[locale];

  const [products, setProducts] = useState<MockProduct[]>(MOCK_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc" | "rating">("newest");

  useEffect(() => {
    let result = [...MOCK_PRODUCTS];

    if (initialDrop === "new") {
      result = result.filter((p) => p.isNewDrop || p.dropStatus === "available");
    }

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category.id === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.ar.toLowerCase().includes(q) ||
          p.name.en.toLowerCase().includes(q) ||
          p.description.ar.toLowerCase().includes(q) ||
          p.description.en.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    setProducts(result);
  }, [selectedCategory, searchQuery, sortBy, initialDrop]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title & Filter Controls Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
              FG ARCHIVE
            </span>
            {initialDrop === "new" && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37] text-black">
                NEW DROPS 🔥
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-neutral-900 dark:text-white mt-1">
            {t.navigation.catalog}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            {locale === "ar"
              ? `عرض ${products.length} من أحدث تصاميم وقطع الستريت وير`
              : `Displaying ${products.length} contemporary streetwear pieces`}
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Search */}
          <div className="relative">
            <input
              type="text"
              placeholder={t.common.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl focus:outline-none focus:border-black dark:focus:border-white text-neutral-900 dark:text-white w-56 sm:w-64"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-3 py-2 rounded-xl text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-neutral-900 dark:text-white focus:outline-none text-xs"
            >
              <option value="newest" className="dark:bg-neutral-900">{locale === "ar" ? "الأحدث إضافة" : "Newest Arrivals"}</option>
              <option value="price_asc" className="dark:bg-neutral-900">{locale === "ar" ? "السعر: من الأقل للأعلى" : "Price: Low to High"}</option>
              <option value="price_desc" className="dark:bg-neutral-900">{locale === "ar" ? "السعر: من الأعلى للأقل" : "Price: High to Low"}</option>
              <option value="rating" className="dark:bg-neutral-900">{locale === "ar" ? "الأعلى تقييماً" : "Highest Rated"}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full text-xs font-bold uppercase whitespace-nowrap transition-colors ${
            selectedCategory === "all"
              ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
              : "bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
          }`}
        >
          {locale === "ar" ? "جميع الإصدارات" : "All Drops"}
        </button>
        {MOCK_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
                : "bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
            }`}
          >
            {locale === "ar" ? cat.name.ar : cat.name.en}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <p className="text-sm font-bold text-neutral-500">
            {locale === "ar" ? "لا توجد قطع مطابقة لبحثك حالياً." : "No garments match your filter criteria."}
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="text-xs text-black dark:text-white underline font-bold"
          >
            {locale === "ar" ? "إعادة ضبط التصفية" : "Reset Filters"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <SanctuaryProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading FG Catalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
