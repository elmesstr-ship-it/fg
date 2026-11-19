"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Flame,
  ShieldCheck,
  Truck,
  RefreshCw,
  Clock,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/fashionMockData";
import { SanctuaryProductCard } from "@/components/products/SanctuaryProductCard";
import { useSeasonalVisualStore } from "@/store/seasonalVisualStore";
import { useAppStore } from "@/store/useAppStore";
import { Footer } from "@/components/layout/Footer";

export function SanctuaryHomePage() {
  const { currentMode } = useSeasonalVisualStore();
  const { locale } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [emailInput, setEmailInput] = useState("");
  const [subscribedToast, setSubscribedToast] = useState(false);

  // Live countdown timer state for next drop
  const [timeLeft, setTimeLeft] = useState({ days: 4, hours: 18, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredProducts =
    selectedCategory === "all"
      ? MOCK_PRODUCTS
      : MOCK_PRODUCTS.filter((p) => p.category.id === selectedCategory);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubscribedToast(true);
    setEmailInput("");
    setTimeout(() => setSubscribedToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#FAFAFA] transition-colors duration-300 overflow-x-clip pb-12">
      {/* ---------------------------------------------------- */}
      {/* 1. HERO STREETWEAR EDITORIAL SECTION                */}
      {/* ---------------------------------------------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-100 via-neutral-50 to-white dark:from-neutral-950 dark:via-black dark:to-[#0A0A0A] pt-6 pb-16 lg:pt-14 lg:pb-24 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Editorial Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-right">
              {/* Drop Status Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black dark:bg-white text-white dark:text-black shadow-md">
                <Flame className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-xs font-black tracking-widest uppercase font-mono">
                  {locale === "ar" ? "دروب 01 متاح الآن • كميات محدودة" : "DROP 01 LIVE • LIMITED EDITION"}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-950 dark:text-white tracking-tighter leading-[1.1] uppercase font-sans">
                {locale === "ar" ? (
                  <>
                    أزياء ستريت وير معاصرة <br />
                    <span className="text-[#D4AF37] relative inline-block">
                      بخامات قطن مصري 380 GSM
                    </span>
                  </>
                ) : (
                  <>
                    CONTEMPORARY LUXURY <br />
                    <span className="text-[#D4AF37] relative inline-block">
                      380 GSM HEAVYWEIGHT FITS
                    </span>
                  </>
                )}
              </h1>

              {/* Sub-headline */}
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
                {locale === "ar"
                  ? "علامة إف جي كوليكتيف (FG) تعيد صياغة أزياء الشارع المصرية بمقاييس عالمية: قطن مصري 100% طويل التيلة، قصات أوفرسايز مدروسة، وتفاصيل مونوغرام تكتيكية تدوم طويلاً."
                  : "FG Collective redefines Egyptian streetwear through elevated minimalism: 100% long-staple combed cotton, structured boxy silhouettes, and bespoke branded hardware."}
              </p>

              {/* Live Countdown to Next Drop */}
              <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 max-w-md mx-auto lg:mx-0">
                <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-neutral-500 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {locale === "ar" ? "موعد إطلاق دروب 02 (Summer Heatwave)" : "DROP 02 COUNTDOWN"}
                  </span>
                  <span className="text-[#D4AF37]">LIVE TIMER</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800">
                    <span className="block text-xl font-black font-mono">{String(timeLeft.days).padStart(2, "0")}</span>
                    <span className="text-[10px] text-neutral-400">{locale === "ar" ? "أيام" : "DAYS"}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800">
                    <span className="block text-xl font-black font-mono">{String(timeLeft.hours).padStart(2, "0")}</span>
                    <span className="text-[10px] text-neutral-400">{locale === "ar" ? "ساعات" : "HRS"}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800">
                    <span className="block text-xl font-black font-mono">{String(timeLeft.minutes).padStart(2, "0")}</span>
                    <span className="text-[10px] text-neutral-400">{locale === "ar" ? "دقائق" : "MIN"}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800">
                    <span className="block text-xl font-black font-mono text-[#D4AF37]">{String(timeLeft.seconds).padStart(2, "0")}</span>
                    <span className="text-[10px] text-neutral-400">{locale === "ar" ? "ثواني" : "SEC"}</span>
                  </div>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/catalog"
                  className="px-8 py-3.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-bold shadow-lg hover:opacity-90 flex items-center gap-2.5 transition-all group"
                >
                  <span>{locale === "ar" ? "تسوق أحدث الإصدارات" : "Shop All Drops"}</span>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/catalog?category=cat-hoodies"
                  className="px-6 py-3.5 rounded-xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm font-bold border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white shadow-sm transition-all"
                >
                  <span>{locale === "ar" ? "تشكيلة الهوديز 380 GSM" : "Heavyweight Hoodies"}</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800 max-w-lg mx-auto lg:mx-0">
                <div className="text-right">
                  <span className="block text-lg font-black text-neutral-950 dark:text-white font-mono">100% COTTON</span>
                  <span className="text-[11px] text-neutral-500">{locale === "ar" ? "قطن مصري طويل التيلة" : "Egyptian Combed"}</span>
                </div>
                <div className="text-right border-r border-neutral-200 dark:border-neutral-800 pr-3">
                  <span className="block text-lg font-black text-[#D4AF37] font-mono">380 GSM</span>
                  <span className="text-[11px] text-neutral-500">{locale === "ar" ? "فرنش تيري ثقيل" : "Heavyweight Terry"}</span>
                </div>
                <div className="text-right border-r border-neutral-200 dark:border-neutral-800 pr-3">
                  <span className="block text-lg font-black text-neutral-950 dark:text-white font-mono">FAST EGY</span>
                  <span className="text-[11px] text-neutral-500">{locale === "ar" ? "توصيل خلال 24-48 ساعة" : "Express Shipping"}</span>
                </div>
              </div>
            </div>

            {/* Editorial Showcase Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 group">
                <Image
                  src="/branding/hero-banner.jpg"
                  alt="FG Collective Editorial Lookbook"
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                
                {/* Floating Circular FG Monogram Badge */}
                <div className="absolute top-4 left-4 w-16 h-16 rounded-full overflow-hidden shadow-2xl border-2 border-white/80 dark:border-black/80 bg-black backdrop-blur-md">
                  <Image
                    src="/branding/03_Sticker_Circular_FG_Collective.png"
                    alt="FG Circular Emblem"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Bottom Overlay Label */}
                <div className="absolute inset-x-4 bottom-4 p-4 rounded-2xl bg-black/80 backdrop-blur-md text-white border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-mono font-bold text-[#D4AF37] uppercase">
                      COLLECTION 01
                    </span>
                    <span className="text-sm font-bold">
                      {locale === "ar" ? "هودي إف جي الثقيل 380 GSM" : "FG Heavyweight Hoodie 380 GSM"}
                    </span>
                  </div>
                  <Link
                    href="/catalog"
                    className="px-3 py-1.5 rounded-lg bg-white text-black text-xs font-black uppercase tracking-wider hover:bg-neutral-200 transition-colors"
                  >
                    {locale === "ar" ? "استكشف" : "View"}
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 2. CATEGORIES SHOWCASE GRID                          */}
      {/* ---------------------------------------------------- */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] font-mono">
              CURATED ESSENTIALS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white uppercase tracking-tight">
              {locale === "ar" ? "تسوق حسب التصنيف" : "Shop By Category"}
            </h2>
          </div>
          <Link
            href="/catalog"
            className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white flex items-center gap-1.5"
          >
            <span>{locale === "ar" ? "عرض جميع الأقسام" : "View All Categories"}</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {MOCK_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog?category=${cat.id}`}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all"
            >
              <Image
                src={cat.heroImage}
                alt={locale === "ar" ? cat.name.ar : cat.name.en}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute inset-x-3 bottom-3 text-right">
                <span className="text-[10px] font-mono uppercase text-[#D4AF37] tracking-wider block">
                  {cat.itemCount} {locale === "ar" ? "قطعة" : "Pieces"}
                </span>
                <h3 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                  {locale === "ar" ? cat.name.ar : cat.name.en}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 3. FEATURED PRODUCTS & DROPS GRID                    */}
      {/* ---------------------------------------------------- */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] font-mono">
              THE COLLECTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white uppercase tracking-tight">
              {locale === "ar" ? "أحدث إصدارات دروب 01" : "Featured Drop Arrivals"}
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                selectedCategory === "all"
                  ? "bg-black dark:bg-white text-white dark:text-black"
                  : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800"
              }`}
            >
              {locale === "ar" ? "جميع الإصدارات" : "All Drops"}
            </button>
            {MOCK_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedCategory === cat.id
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                }`}
              >
                {locale === "ar" ? cat.name.ar : cat.name.en}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <SanctuaryProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 4. THE FG QUALITY MANIFESTO                         */}
      {/* ---------------------------------------------------- */}
      <section className="py-16 bg-neutral-950 text-white mt-12 border-y border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-xs font-mono uppercase text-[#D4AF37] tracking-widest">
              UNCOMPROMISING STANDARDS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
              {locale === "ar" ? "معايير الجودة الاستثنائية لـ FG" : "The FG Craftsmanship Guarantee"}
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed font-sans">
              {locale === "ar"
                ? "لا نقبل بالحلول الوسط. كل قطعة من تصاميمنا تبدأ من خيوط القطن المصري الخام طويل التيلة، وتمر بعمليات نسج خاصة لضمان أعلى كثافة وأطول عمر ممكن."
                : "No compromises. Each garment begins with raw long-staple Egyptian cotton fibers, precision tailored with high-density knitting for unmatched longevity."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] font-bold">
                01
              </div>
              <h3 className="text-lg font-bold">
                {locale === "ar" ? "قطن مصري 100% طويل التيلة" : "100% Egyptian Combed Cotton"}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {locale === "ar"
                  ? "ألياف قطنية فائقة النعومة معالجة ضد الانكماش والتوبير لتمنحك ملمساً فاخراً يدوم مع كل غسيل."
                  : "Ultra-soft combed long-staple fibers treated against pilling and pre-shrunk for maximum durability."}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] font-bold">
                02
              </div>
              <h3 className="text-lg font-bold">
                {locale === "ar" ? "أوزان ثقيلة 380+ GSM" : "380+ GSM Heavyweight Density"}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {locale === "ar"
                  ? "وزن القماش يضمن وقوف الياقة وانسياب القصة الأوفرسايز بشكل متناسق يخطف الأنظار."
                  : "Structured weight ensuring hoodies and tees hold their boxy drape permanently without sagging."}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] font-bold">
                03
              </div>
              <h3 className="text-lg font-bold">
                {locale === "ar" ? "إكسسوارات وسحابات معدنية مخصصة" : "Bespoke Metal Hardware"}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {locale === "ar"
                  ? "سحابات FG وأزرار معدنية صلبة مطلية بالأسود المطفي ومختومة بشعار المونوغرام الفاخر."
                  : "Custom branded matte black heavy metal pullers, eyelets, and debossed rubber aglets."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 5. VERIFIED REVIEWS SECTION                          */}
      {/* ---------------------------------------------------- */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono uppercase text-[#D4AF37] tracking-widest">
            COMMUNITY FEEDBACK
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-neutral-950 dark:text-white">
            {locale === "ar" ? "آراء عملاء مجتمع FG" : "Verified Customer Reviews"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-sm">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              "خامة الهودي تفوق الوصف بجد! الـ 380 GSM ثقيل ومتقن جداً، والياقة واقفة مظبوطة بدون أربطة. فخور إن ده براند مصري بالجودة دي."
            </p>
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
              <span className="font-bold">عمر الشريف</span>
              <span className="text-neutral-400 text-[10px]">مشتري مؤكد • القاهرة</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-sm">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              "التيشرت الأسيد ووش خيالي، الغسيل واللون الفنتج متقن جداً والياقة سميكة محترمة مش هتوسع بعد أول غسلة."
            </p>
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
              <span className="font-bold">كريم حسام</span>
              <span className="text-neutral-400 text-[10px]">مشتري مؤكد • الشيخ زايد</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-sm">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              "الكارجو بجد تفاصيله تحفة، الجيوب وسحاباتها ممتازة واستلمت في خلال 24 ساعة في الإسكندرية."
            </p>
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
              <span className="font-bold">ياسين المنشاوي</span>
              <span className="text-neutral-400 text-[10px]">مشتري مؤكد • الإسكندرية</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 6. VIP DROP ACCESS NEWSLETTER                        */}
      {/* ---------------------------------------------------- */}
      <section className="py-14 bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-4">
          <span className="text-xs font-mono uppercase text-[#D4AF37] tracking-widest">
            EARLY DROP ACCESS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-neutral-950 dark:text-white">
            {locale === "ar" ? "انضم إلى قائمة VIP لتصلك الدروبات أولاً" : "Get Early Access to Drop 02"}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
            {locale === "ar"
              ? "اشترك ليصلك إشعار خاص قبل 30 دقيقة من إطلاق أي كولكشن جديد مع كود خصم حصري."
              : "Subscribe to receive private early access links 30 minutes before public drop launch."}
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder={locale === "ar" ? "أدخل بريدك الإلكتروني..." : "Enter your email..."}
              className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-black border border-neutral-300 dark:border-neutral-700 text-sm focus:outline-none focus:border-black dark:focus:border-white"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-sm hover:opacity-90 transition-opacity"
            >
              {locale === "ar" ? "اشتراك VIP" : "Subscribe"}
            </button>
          </form>

          {subscribedToast && (
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
              {locale === "ar" ? "✓ تم اشتراكك بنجاح! تفقد بريدك للحصول على كود الترحيب." : "✓ Subscribed successfully! Check your inbox."}
            </p>
          )}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 7. FOOTER                                            */}
      {/* ---------------------------------------------------- */}
      <Footer />
    </div>
  );
}
