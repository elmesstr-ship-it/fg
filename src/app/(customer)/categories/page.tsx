"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MOCK_CATEGORIES } from "@/lib/fashionMockData";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/config/i18n";
import { ArrowLeft, ArrowRight, Layers, Flame } from "lucide-react";

export default function CategoriesPage() {
  const { locale } = useAppStore();
  const t = translations[locale];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Title & Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-wider font-mono">
          <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{locale === "ar" ? "أقسام وتصنيفات FG" : "FG Fashion Departments"}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950 dark:text-white">
          {t.navigation.categories}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-sans">
          {locale === "ar"
            ? "تصفح تشكيلة أزياء الستريت وير المصنفة بعناية: هوديز ثقيلة 380 GSM، تيشرتات بوكسي، بناطيل كارجو تكتيكية، وإكسسوارات حصرية."
            : "Explore our contemporary streetwear collections: 380 GSM heavyweight hoodies, boxy tees, tactical cargos, and everyday luxury accessories."}
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/catalog?category=${cat.id}`}
            className="group relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-md hover:shadow-2xl transition-all aspect-[4/3] flex flex-col justify-end p-6"
          >
            <Image
              src={cat.heroImage}
              alt={locale === "ar" ? cat.name.ar : cat.name.en}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-75 group-hover:opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

            <div className="relative z-10 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-[#D4AF37] tracking-widest block">
                {cat.itemCount} {locale === "ar" ? "قطع متوفرة" : "Pieces Available"}
              </span>
              <h2 className="text-xl font-black text-white group-hover:text-[#D4AF37] transition-colors">
                {locale === "ar" ? cat.name.ar : cat.name.en}
              </h2>
              <p className="text-xs text-neutral-300 line-clamp-2">
                {locale === "ar" ? cat.tagline.ar : cat.tagline.en}
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-white group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                <span>{locale === "ar" ? "استكشف التشكيلة" : "Explore Collection"}</span>
                {locale === "ar" ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
