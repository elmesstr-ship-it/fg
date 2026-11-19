"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MockProduct } from "@/lib/fashionMockData";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/config/i18n";
import { SanctuaryProductCard } from "@/components/products/SanctuaryProductCard";
import { Search, SlidersHorizontal, Flame, Sparkles, X } from "lucide-react";

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlCategory = searchParams.get("category") || "all";
  const urlSearch = searchParams.get("search") || "";
  const urlDrop = searchParams.get("drop");

  const { locale } = useAppStore();
  const t = translations[locale];

  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [activeDrop, setActiveDrop] = useState<string | null>(urlDrop);
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc" | "rating">("newest");
  const [products, setProducts] = useState<MockProduct[]>(MOCK_PRODUCTS);

  // Sync state whenever the URL search params change (e.g. from top navbar clicks)
  useEffect(() => {
    setSelectedCategory(urlCategory);
    setSearchQuery(urlSearch);
    setActiveDrop(urlDrop);
  }, [urlCategory, urlSearch, urlDrop]);

  // Filter and sort products
  useEffect(() => {
    let result = [...MOCK_PRODUCTS];

    if (activeDrop === "new") {
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
          p.sku.toLowerCase().includes(q) ||
          p.fashionDetails.gsm.toLowerCase().includes(q)
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
  }, [selectedCategory, searchQuery, sortBy, activeDrop]);

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    const params = new URLSearchParams(searchParams.toString());
    if (catId === "all") {
      params.delete("category");
    } else {
      params.set("category", catId);
    }
    // Remove drop filter when specifically clicking a category to avoid empty results
    if (activeDrop && catId !== "all") {
      params.delete("drop");
      setActiveDrop(null);
    }
    router.push(`/catalog?${params.toString()}`, { scroll: false });
  };

  const handleDropToggle = (drop: string | null) => {
    setActiveDrop(drop);
    const params = new URLSearchParams(searchParams.toString());
    if (!drop) {
      params.delete("drop");
    } else {
      params.set("drop", drop);
    }
    router.push(`/catalog?${params.toString()}`, { scroll: false });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    } else {
      params.delete("search");
    }
    router.push(`/catalog?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setActiveDrop(null);
    router.push("/catalog", { scroll: false });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Filter Controls Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
              FG ARCHIVE • MANSOURA
            </span>
            {activeDrop === "new" && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#D4AF37] text-black">
                NEW DROPS 🔥
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-neutral-900 dark:text-white mt-1">
            {t.navigation.catalog}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            {locale === "ar"
              ? `عرض ${products.length} من أحدث تصاميم وقطع أزياء الستريت وير الفاخرة`
              : `Displaying ${products.length} contemporary luxury streetwear pieces`}
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder={t.common.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-8 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl focus:outline-none focus:border-black dark:focus:border-white text-neutral-900 dark:text-white w-56 sm:w-64"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("search");
                  router.push(`/catalog?${params.toString()}`, { scroll: false });
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-neutral-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-3 py-2 rounded-xl text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-neutral-900 dark:text-white focus:outline-none text-xs"
            >
              <option value="newest" className="dark:bg-neutral-900">
                {locale === "ar" ? "الأحدث إضافة" : "Newest Arrivals"}
              </option>
              <option value="price_asc" className="dark:bg-neutral-900">
                {locale === "ar" ? "السعر: من الأقل للأعلى" : "Price: Low to High"}
              </option>
              <option value="price_desc" className="dark:bg-neutral-900">
                {locale === "ar" ? "السعر: من الأعلى للأقل" : "Price: High to Low"}
              </option>
              <option value="rating" className="dark:bg-neutral-900">
                {locale === "ar" ? "الأعلى تقييماً" : "Highest Rated"}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Category & Drop Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {/* Drop Quick Filter */}
        <button
          onClick={() => handleDropToggle(activeDrop === "new" ? null : "new")}
          className={`px-4 py-2 rounded-full text-xs font-black uppercase whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeDrop === "new"
              ? "bg-[#D4AF37] text-black shadow-md scale-105"
              : "bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>{locale === "ar" ? "أحدث الدروبات 🔥" : "New Drops 🔥"}</span>
        </button>

        <button
          onClick={() => handleCategorySelect("all")}
          className={`px-4 py-2 rounded-full text-xs font-bold uppercase whitespace-nowrap transition-all ${
            selectedCategory === "all" && !activeDrop
              ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
              : "bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
          }`}
        >
          {locale === "ar" ? "جميع الإصدارات" : "All Drops"}
        </button>

        {MOCK_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
                : "bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
            }`}
          >
            {locale === "ar" ? cat.name.ar : cat.name.en}
          </button>
        ))}
      </div>

      {/* Active Filter Indicators */}
      {(selectedCategory !== "all" || searchQuery || activeDrop) && (
        <div className="flex items-center gap-2 flex-wrap text-xs text-neutral-500">
          <span>{locale === "ar" ? "التصفيات النشطة:" : "Active Filters:"}</span>
          {activeDrop && (
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold flex items-center gap-1">
              {locale === "ar" ? "الدروبات الجديدة" : "New Drops"}
              <button onClick={() => handleDropToggle(null)}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCategory !== "all" && (
            <span className="px-2.5 py-1 rounded-full bg-black/10 dark:bg-white/10 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 font-bold flex items-center gap-1">
              {MOCK_CATEGORIES.find((c) => c.id === selectedCategory)?.name[locale] || selectedCategory}
              <button onClick={() => handleCategorySelect("all")}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="px-2.5 py-1 rounded-full bg-black/10 dark:bg-white/10 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 font-bold flex items-center gap-1">
              "{searchQuery}"
              <button
                onClick={() => {
                  setSearchQuery("");
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("search");
                  router.push(`/catalog?${params.toString()}`, { scroll: false });
                }}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs text-red-500 hover:underline font-bold mr-2 rtl:mr-0 rtl:ml-2"
          >
            {locale === "ar" ? "إلغاء الكل" : "Clear All"}
          </button>
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <p className="text-sm font-bold text-neutral-500">
            {locale === "ar"
              ? "لا توجد قطع مطابقة لمعايير البحث الحالية."
              : "No garments match your filter criteria."}
          </p>
          <button
            onClick={clearAllFilters}
            className="text-xs text-black dark:text-white underline font-bold"
          >
            {locale === "ar" ? "إعادة ضبط التصفية وعرض الكل" : "Reset Filters & Show All"}
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
