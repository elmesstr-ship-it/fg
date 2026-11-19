"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  TreePine,
  Moon,
  ChevronDown,
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  Bell,
  User,
} from "lucide-react";
import { useSeasonalVisualStore, SeasonalVisualMode } from "@/store/seasonalVisualStore";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { MOCK_CATEGORIES } from "@/lib/mockData";

export function SanctuaryNavbar() {
  const { currentMode, christmasSubMode, setMode, setChristmasSubMode } = useSeasonalVisualStore();
  const cartItems = useCartStore((state) => state.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const { items: wishlistItems } = useWishlistStore();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Liturgical Announcement Banner */}
      <div className="relative z-50 bg-[#1E2229] text-[#FFFBF0] text-xs py-2 px-4 border-b border-[#F5A623]/30 transition-colors duration-500 overflow-hidden">
        {/* Subtle festive background illumination */}
        {currentMode === "christmas" && (
          <div className="absolute inset-0 bg-gradient-to-r from-red-950 via-emerald-950 to-red-950 opacity-90 animate-pulse pointer-events-none" />
        )}
        {currentMode === "halloween" && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950 via-orange-950 to-purple-950 opacity-90 pointer-events-none" />
        )}

        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] animate-ping" />
            <p className="font-sacred text-[13px] tracking-wide text-amber-200">
              {currentMode === "christmas"
                ? "✨ المجد لله في الأعالي وعلى الأرض السلام — عروض أسبوع الميلاد المجيد متاحة الآن"
                : currentMode === "halloween"
                ? "🕯️ موسم الخريف والشموع — خصومات كبرى على الأواني المذبحية والبخور الديري"
                : "🕊️ متجر الكنيسة (Church Shop): تأسس منذ 35 عاماً لصنع الأواني المذبحية بأعلى جودة وأقل سعر • توصيل داخل وخارج مصر"}
            </p>
          </div>

          {/* Seasonal Experience Mode Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 hover:bg-black/60 border border-[#F5A623]/40 text-[#F5A623] transition-all text-[11px] font-sans font-medium"
            >
              {currentMode === "christmas" ? (
                <>
                  <TreePine className="w-3.5 h-3.5 text-emerald-400" />
                  <span>عيد الميلاد ({christmasSubMode === "festive" ? "احتفالي" : "هادئ"})</span>
                </>
              ) : currentMode === "halloween" ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-orange-400" />
                  <span>أمسية الخريف</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#F5A623]" />
                  <span>المظهر الذهبي الملكي</span>
                </>
              )}
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            {/* Dropdown Menu */}
            {isThemeMenuOpen && (
              <div className="absolute left-0 mt-2 w-64 rounded-xl bg-white shadow-2xl border border-stone-200 text-stone-800 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-3 py-1.5 border-b border-stone-100">
                  اختيار الطابع الموسمي التفاعلي
                </div>
                <button
                  onClick={() => {
                    setMode("default");
                    setIsThemeMenuOpen(false);
                  }}
                  className={`w-full text-right px-3 py-2 text-xs rounded-lg flex items-center justify-between hover:bg-amber-50/80 transition-colors ${
                    currentMode === "default" ? "bg-amber-50 text-[#D98E18] font-bold" : ""
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F5A623]" />
                    المظهر الذهبي الأصيل (Church Shop Gold)
                  </span>
                  {currentMode === "default" && <span className="text-[10px] text-[#F5A623]">نشط</span>}
                </button>

                <div className="mt-1 pt-1 border-t border-stone-100">
                  <button
                    onClick={() => {
                      setMode("christmas");
                      setChristmasSubMode("subtle");
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full text-right px-3 py-2 text-xs rounded-lg flex items-center justify-between hover:bg-emerald-50/80 transition-colors ${
                      currentMode === "christmas" && christmasSubMode === "subtle"
                        ? "bg-emerald-50 text-emerald-800 font-bold"
                        : ""
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                      عيد الميلاد — وضع هادئ (ثلوج خفيفة)
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setMode("christmas");
                      setChristmasSubMode("festive");
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full text-right px-3 py-2 text-xs rounded-lg flex items-center justify-between hover:bg-red-50/80 transition-colors ${
                      currentMode === "christmas" && christmasSubMode === "festive"
                        ? "bg-red-50 text-red-800 font-bold"
                        : ""
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                      عيد الميلاد — وضع احتفالي كامل
                    </span>
                  </button>
                </div>

                <div className="mt-1 pt-1 border-t border-stone-100">
                  <button
                    onClick={() => {
                      setMode("halloween");
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full text-right px-3 py-2 text-xs rounded-lg flex items-center justify-between hover:bg-orange-50/80 transition-colors ${
                      currentMode === "halloween" ? "bg-purple-50 text-purple-900 font-bold" : ""
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
                      أمسية الخريف والشموع (Autumn Vigil)
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Luxury Header */}
      <header className="sticky top-0 z-40 bg-[#FCFBF7]/95 backdrop-blur-md border-b border-[#E8E2D2] transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-stone-700 hover:text-[#781d22] transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo & Editorial Typography */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#F5A623]/30 bg-white shadow-sm flex items-center justify-center p-0.5">
                <Image
                  src="/logo.png"
                  alt="Church Shop Logo"
                  width={48}
                  height={48}
                  className="object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-sacred text-2xl font-black tracking-wide text-[#1E2229] group-hover:text-[#F5A623] transition-colors leading-tight">
                  CHURCH SHOP
                </span>
                <span className="text-[11px] font-bold text-[#E59819] -mt-0.5">
                  متجر الكنيسة • خبرة 35 عاماً في صياغة الأواني
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                href="/"
                className="text-sm font-medium text-stone-800 hover:text-[#781d22] transition-colors relative py-2"
              >
                الرئيسية
              </Link>

              {/* Department Megamenu Trigger */}
              <div
                className="relative"
                onMouseEnter={() => setIsCategoryMenuOpen(true)}
                onMouseLeave={() => setIsCategoryMenuOpen(false)}
              >
                <button className="flex items-center gap-1.5 text-sm font-medium text-stone-800 hover:text-[#781d22] transition-colors py-2">
                  <span>الأقسام الكنسية</span>
                  <ChevronDown className="w-4 h-4 opacity-60" />
                </button>

                {/* Dropdown Panel */}
                {isCategoryMenuOpen && (
                  <div className="absolute top-full -right-20 w-[640px] bg-white/98 backdrop-blur-lg rounded-2xl shadow-2xl border border-stone-200/80 p-6 z-50 animate-in fade-in duration-200 grid grid-cols-2 gap-4">
                    {MOCK_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/catalog?category=${cat.slug}`}
                        className="flex items-start gap-4 p-3 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-all group"
                      >
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-stone-200">
                          <Image
                            src={cat.heroImage}
                            alt={cat.name.ar}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-stone-900 group-hover:text-[#781d22] transition-colors font-sacred">
                            {cat.name.ar}
                          </h4>
                          <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                            {cat.tagline.ar}
                          </p>
                          <span className="inline-block text-[10px] text-[#c5a059] font-medium mt-1">
                            {cat.itemCount} تحفة متوفرة
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/catalog"
                className="text-sm font-medium text-stone-800 hover:text-[#781d22] transition-colors relative py-2"
              >
                المعرض الكامل
              </Link>
              <Link
                href="/support"
                className="text-sm font-medium text-stone-800 hover:text-[#781d22] transition-colors relative py-2"
              >
                خدمة الرعايا
              </Link>
            </nav>

            {/* Desktop Quick Actions */}
            <div className="flex items-center gap-4 sm:gap-6">
              <Link
                href="/catalog"
                className="p-2 text-stone-600 hover:text-[#781d22] transition-colors"
                title="البحث في الكتالوج"
              >
                <Search className="w-5 h-5" />
              </Link>

              <Link
                href="/wishlist"
                className="p-2 text-stone-600 hover:text-[#781d22] transition-colors relative"
                title="قائمة الأمنيات والمباركات"
              >
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#781d22] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="p-2 text-stone-600 hover:text-[#781d22] transition-colors relative group"
                title="سلة المشتريات"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100/80 group-hover:bg-[#781d22]/10 transition-colors border border-stone-200">
                  <ShoppingBag className="w-5 h-5 text-[#781d22]" />
                  <span className="text-xs font-bold text-stone-800 group-hover:text-[#781d22]">
                    {totalItems > 0 ? `${totalItems} قطع` : "فارغة"}
                  </span>
                </div>
              </Link>

              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-stone-700 hover:text-[#781d22] p-2"
              >
                <User className="w-4 h-4" />
                <span>تسجيل الدخول</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-[#FCFBF7] p-4 space-y-3 animate-in slide-in-from-top-4 duration-300">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-stone-800 p-2 rounded-lg hover:bg-stone-100"
            >
              الرئيسية
            </Link>
            <Link
              href="/catalog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-stone-800 p-2 rounded-lg hover:bg-stone-100"
            >
              المعرض الشامل للتحف والأيقونات
            </Link>
            <div className="py-2 border-y border-stone-200">
              <span className="text-xs font-bold text-stone-400 block px-2 mb-2">الأقسام الكنسية</span>
              <div className="grid grid-cols-2 gap-2">
                {MOCK_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/catalog?category=${cat.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xs text-stone-700 p-2 rounded-lg hover:bg-stone-100 line-clamp-1"
                  >
                    {cat.name.ar}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href="/support"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-stone-800 p-2 rounded-lg hover:bg-stone-100"
            >
              خدمة الرعايا والاستفسارات
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
