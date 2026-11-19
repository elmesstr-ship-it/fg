"use client";

import React, { useEffect, useState, useTransition } from "react";
import { productService } from "@/services/mock/productService.mock";
import { Product, Category } from "@/types/product";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/config/i18n";
import { ProductCard } from "@/components/product/ProductCard";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

export default function CatalogPage() {
  const { locale } = useAppStore();
  const t = translations[locale];

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc" | "rating">("newest");
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  useEffect(() => {
    async function loadCategories() {
      const cats = await productService.getCategories();
      setCategories(cats);
    }
    loadCategories();
  }, []);

  useEffect(() => {
    startTransition(async () => {
      setLoading(true);
      try {
        const data = await productService.getProducts({
          category: selectedCategory === "all" ? undefined : selectedCategory,
          search: searchQuery || undefined,
          sortBy,
        });
        setProducts(data);
      } finally {
        setLoading(false);
      }
    });
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title & Filter Controls Header */}
      <div className="border-b border-theme-border pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-sacred text-2xl sm:text-3xl font-bold text-theme-text">
            {t.navigation.catalog}
          </h1>
          <p className="text-xs text-theme-text-muted mt-1">
            {locale === "ar"
              ? `عرض ${products.length} من المقتنيات الكنسية المباركة`
              : `Displaying ${products.length} sacred offerings`}
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Quick Search in Catalog */}
          <div className="relative">
            <input
              type="text"
              placeholder={t.common.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs bg-theme-surface border border-theme-border rounded-xl focus:outline-none focus:ring-2 focus:ring-theme-gold text-theme-text w-56 sm:w-64"
            />
            <Search className="w-4 h-4 text-theme-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-theme-surface border border-theme-border px-3 py-2 rounded-xl text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-theme-gold" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-theme-text focus:outline-none text-xs"
            >
              <option value="newest">{locale === "ar" ? "الأحدث إضافة" : "Newest Arrivals"}</option>
              <option value="price_asc">{locale === "ar" ? "السعر: من الأقل للأعلى" : "Price: Low to High"}</option>
              <option value="price_desc">{locale === "ar" ? "السعر: من الأعلى للأقل" : "Price: High to Low"}</option>
              <option value="rating">{locale === "ar" ? "الأعلى تقييماً" : "Highest Rated"}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            selectedCategory === "all"
              ? "bg-theme-primary text-theme-primary-contrast shadow-sm"
              : "bg-theme-surface text-theme-text border border-theme-border hover:bg-theme-surface-elevated"
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>{locale === "ar" ? "جميع الأقسام" : "All Departments"}</span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? "bg-theme-primary text-theme-primary-contrast shadow-sm"
                : "bg-theme-surface text-theme-text border border-theme-border hover:bg-theme-surface-elevated"
            }`}
          >
            {cat.name[locale]}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-theme-surface-elevated animate-pulse border border-theme-border" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-theme-surface rounded-2xl border border-theme-border">
          <p className="text-sm text-theme-text-muted">
            {locale === "ar" ? "لم يتم العثور على أي منتجات مطابقة للبحث." : "No matching church products found."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
