"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { productService } from "@/services/mock/productService.mock";
import { Category } from "@/types/product";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/config/i18n";
import { ArrowLeft, ArrowRight, Sparkles, FolderTree } from "lucide-react";

export default function CategoriesPage() {
  const { locale } = useAppStore();
  const t = translations[locale];
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const cats = await productService.getCategories();
        setCategories(cats);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Title & Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-gold/15 text-theme-gold text-xs font-bold border border-theme-gold/30">
          <FolderTree className="w-3.5 h-3.5" />
          <span>{locale === "ar" ? "الأقسام والمقتنيات الكنسية" : "Ecclesiastical Departments"}</span>
        </div>
        <h1 className="font-sacred text-3xl sm:text-4xl font-extrabold text-theme-text">
          {t.navigation.categories}
        </h1>
        <p className="text-xs sm:text-sm text-theme-text-muted leading-relaxed">
          {locale === "ar"
            ? "تصفح تشكيلتنا المتخصصة والمصنفة بعناية فائقة لتلبية كافة احتياجات الهيكل، المذبح، الصلوات الطقسية، والمنازل المباركة."
            : "Explore our liturgical departments carefully arranged for parishes, clergy, and sacred homes."}
        </p>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-theme-surface-elevated animate-pulse border border-theme-border" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group relative bg-theme-surface rounded-3xl border border-theme-border overflow-hidden shadow-sm hover:shadow-sacred-lg hover:border-theme-gold transition-all duration-300 flex flex-col sm:flex-row"
            >
              {/* Category Image */}
              <div className="relative w-full sm:w-2/5 aspect-[4/3] sm:aspect-auto overflow-hidden bg-theme-surface-elevated">
                <Image
                  src={cat.image}
                  alt={cat.name[locale]}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent sm:hidden" />
              </div>

              {/* Category Details */}
              <div className="p-6 sm:w-3/5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-theme-gold mb-1">
                    <span className="uppercase tracking-wider">
                      {cat.itemCount} {locale === "ar" ? "صنف كنسي متوفر" : "Liturgical Items"}
                    </span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>

                  <h3 className="font-sacred text-lg font-bold text-theme-text group-hover:text-theme-primary transition-colors">
                    {cat.name[locale]}
                  </h3>

                  <p className="text-xs text-theme-text-muted leading-relaxed mt-2">
                    {cat.description[locale]}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/catalog?cat=${cat.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-theme-gold hover:text-theme-primary transition-colors group/link"
                  >
                    <span>{locale === "ar" ? "تصفح معروضات القسم" : "Browse Department"}</span>
                    {locale === "ar" ? (
                      <ArrowLeft className="w-4 h-4 group-hover/link:-translate-x-1 transition-transform" />
                    ) : (
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    )}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
