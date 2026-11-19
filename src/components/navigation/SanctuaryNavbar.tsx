"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Sun,
  Moon,
  ChevronDown,
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  User,
  ShieldAlert,
  ArrowRight,
  Check,
} from "lucide-react";
import { useSeasonalVisualStore, SeasonalVisualMode } from "@/store/seasonalVisualStore";
import { useAppStore } from "@/store/useAppStore";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuthStore } from "@/store/useAuthStore";
import { translations } from "@/config/i18n";
import { SEASONAL_THEMES } from "@/config/themes";

export function SanctuaryNavbar() {
  const { currentMode, setMode } = useSeasonalVisualStore();
  const { locale, toggleLocale, themeMode, toggleThemeMode, seasonalTheme, setSeasonalTheme } = useAppStore();
  const t = translations[locale];

  const cartItems = useCartStore((state) => state.items);
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistItems = useWishlistStore((state) => state.items);
  const { user, isAuthenticated, isAdmin, loginAsDemoUser, loginAsDemoAdmin, logout } = useAuthStore();

  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectSeasonalTheme = (key: SeasonalVisualMode) => {
    setMode(key);
    setSeasonalTheme(key);
    setIsThemeMenuOpen(false);
  };

  const navLinks = [
    { label: t.navigation.newDrops, href: "/catalog?drop=new", highlight: true },
    { label: t.navigation.hoodies, href: "/catalog?category=cat-hoodies" },
    { label: t.navigation.tshirts, href: "/catalog?category=cat-tees" },
    { label: t.navigation.pants, href: "/catalog?category=cat-pants" },
    { label: t.navigation.outerwear, href: "/catalog?category=cat-outerwear" },
    { label: t.navigation.accessories, href: "/catalog?category=cat-accessories" },
  ];

  const seasonalOptions: { id: SeasonalVisualMode; labelAr: string; labelEn: string; color: string }[] = [
    { id: "default", labelAr: "المظهر الفاخر (Monochrome)", labelEn: "FG Monochrome", color: "#0A0A0A" },
    { id: "summer", labelAr: "إصدار الصيف (Summer Drop)", labelEn: "Summer Drop", color: "#0284C7" },
    { id: "winter", labelAr: "إصدار الشتاء (Winter Heavyweight)", labelEn: "Winter Drop", color: "#1E293B" },
    { id: "ramadan", labelAr: "رمضان المبارك (Ramadan Edition)", labelEn: "Ramadan Edition", color: "#064E3B" },
    { id: "eid_fitr", labelAr: "عيد الفطر السعيد", labelEn: "Eid Al-Fitr", color: "#15803D" },
    { id: "eid_adha", labelAr: "عيد الأضحى التراثي", labelEn: "Eid Al-Adha", color: "#991B1B" },
    { id: "christmas", labelAr: "إصدار رأس السنة والميلاد", labelEn: "Holiday Drop", color: "#881337" },
  ];

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="relative z-50 bg-[#0A0A0A] text-[#FAFAFA] text-[12px] py-2 px-4 border-b border-neutral-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Announcement Message */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
            <p className="font-sans font-medium tracking-wide text-neutral-300">
              {locale === "ar"
                ? "شحن مجاني لكافة محافظات مصر للطلبات فوق 1500 ج.م • كود خصم FG10"
                : "Free Shipping across Egypt on orders over 1500 EGP • Use code FG10"}
            </p>
          </div>

          {/* Quick Utility Switchers (Language & Seasonal Mood) */}
          <div className="flex items-center gap-3">
            {/* Seasonal Mood Selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 transition-all text-[11px]"
              >
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>
                  {seasonalOptions.find((o) => o.id === currentMode)?.[
                    locale === "ar" ? "labelAr" : "labelEn"
                  ] || "FG Monochrome"}
                </span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {isThemeMenuOpen && (
                <div className="absolute left-0 mt-2 w-60 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-3 py-1.5 border-b border-neutral-800">
                    {locale === "ar" ? "اختر الطابع الموسمي" : "Select Seasonal Drop"}
                  </div>
                  {seasonalOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectSeasonalTheme(opt.id)}
                      className={`w-full text-right px-3 py-2 text-xs rounded-lg flex items-center justify-between hover:bg-neutral-900 transition-colors ${
                        currentMode === opt.id ? "bg-neutral-900 text-[#D4AF37] font-bold" : ""
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: opt.color }} />
                        {locale === "ar" ? opt.labelAr : opt.labelEn}
                      </span>
                      {currentMode === opt.id && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Switcher Toggle */}
            <button
              onClick={toggleLocale}
              className="px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 transition-colors"
              title="Toggle Language"
            >
              {locale === "ar" ? "EN" : "العربية"}
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 lg:h-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo & Name */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 transition-transform group-hover:scale-105">
                <Image
                  src={
                    mounted && themeMode === "dark"
                      ? "/branding/FG_Logo_Transparent_White.png"
                      : "/branding/FG_Logo_Transparent_Black.png"
                  }
                  alt="FG Collective Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tighter uppercase text-neutral-950 dark:text-white font-sans">
                  FG COLLECTIVE
                </span>
                <span className="text-[9px] tracking-widest text-neutral-500 uppercase -mt-1 font-mono">
                  CAIRO • EST. 2026
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs uppercase font-bold tracking-wider transition-colors relative py-1 group ${
                    link.highlight
                      ? "text-[#D4AF37] font-black"
                      : "text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {link.label}
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-black dark:bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
                </Link>
              ))}
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Theme Mode Toggle (Light/Dark) */}
              <button
                onClick={toggleThemeMode}
                className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
                aria-label="Toggle Light/Dark Theme"
              >
                {mounted && themeMode === "dark" ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-neutral-700" />
                )}
              </button>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white relative transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute 1 top-1 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#0A0A0A] dark:bg-white text-white dark:text-black text-[10px] font-bold flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart Bag Link */}
              <Link
                href="/cart"
                className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white relative transition-colors"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute top-1 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#D4AF37] text-black text-[10px] font-black flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </Link>

              {/* User Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-black dark:hover:border-white transition-colors"
                  aria-label="User Account"
                >
                  <User className="w-4 h-4" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute left-0 sm:left-auto sm:right-0 mt-3 w-64 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-100 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {isAuthenticated && user ? (
                      <div className="space-y-2">
                        <div className="pb-2 border-b border-neutral-200 dark:border-neutral-800">
                          <p className="text-xs font-bold text-neutral-900 dark:text-white">{user.fullName}</p>
                          <p className="text-[11px] text-neutral-500 font-mono">{user.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                            {user.role === "ADMIN" ? "👑 مسؤول النظام" : "عميل VIP"}
                          </span>
                        </div>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="w-full text-right px-3 py-2 text-xs rounded-lg flex items-center justify-between bg-[#0A0A0A] dark:bg-white text-white dark:text-black font-bold hover:opacity-90"
                          >
                            <span>لوحة تحكم المسؤول</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        )}

                        <Link
                          href="/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="w-full text-right px-3 py-1.5 text-xs rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-between"
                        >
                          <span>طلباتي السابقة</span>
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="w-full text-right px-3 py-1.5 text-xs rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-between"
                        >
                          <span>الملف الشخصي والعناوين</span>
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-right px-3 py-1.5 text-xs rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 font-semibold"
                        >
                          تسجيل الخروج
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider pb-1 border-b border-neutral-100 dark:border-neutral-800">
                          تسجيل الدخول السريع (Demo Mode)
                        </div>
                        <button
                          onClick={() => {
                            loginAsDemoUser();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full py-2 px-3 text-xs rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-semibold text-right flex items-center justify-between transition-colors"
                        >
                          <span>⚡ دخول كعميل (Demo User)</span>
                          <span className="text-[10px] text-neutral-500">عمر الشريف</span>
                        </button>
                        <button
                          onClick={() => {
                            loginAsDemoAdmin();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full py-2 px-3 text-xs rounded-lg bg-black dark:bg-white text-white dark:text-black hover:opacity-90 font-bold text-right flex items-center justify-between transition-opacity"
                        >
                          <span>⚡ دخول كمسؤول (Demo Admin)</span>
                          <span className="text-[10px] opacity-75">إدارة FG</span>
                        </button>
                        <div className="pt-1 border-t border-neutral-100 dark:border-neutral-800">
                          <Link
                            href="/login"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="block text-center text-xs text-neutral-600 dark:text-neutral-400 hover:underline py-1"
                          >
                            صفحة تسجيل الدخول العادية
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Dropdown / Bar */}
          {isSearchOpen && (
            <div className="py-3 border-t border-neutral-200 dark:border-neutral-800 animate-in fade-in slide-in-from-top-1 duration-150">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/catalog?search=${encodeURIComponent(searchQuery)}`;
                  }
                }}
                className="relative"
              >
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.common.searchPlaceholder}
                  className="w-full pr-10 pl-4 py-2 text-sm rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  autoFocus
                />
              </form>
            </div>
          )}
        </div>

        {/* 3. MOBILE SLIDE-OUT MENU */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-18 bg-black/60 z-50 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-neutral-950 w-4/5 max-w-sm h-full p-6 space-y-6 shadow-2xl border-l border-neutral-200 dark:border-neutral-800 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-lg font-black uppercase tracking-wider">FG Navigation</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm uppercase font-bold tracking-wider py-1.5 border-b border-neutral-100 dark:border-neutral-900 text-neutral-800 dark:text-neutral-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500">اللغة / Language</span>
                  <button
                    onClick={toggleLocale}
                    className="px-3 py-1 rounded bg-neutral-100 dark:bg-neutral-900 font-mono text-xs font-bold"
                  >
                    {locale === "ar" ? "English" : "العربية"}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500">المظهر / Theme</span>
                  <button
                    onClick={toggleThemeMode}
                    className="px-3 py-1 rounded bg-neutral-100 dark:bg-neutral-900 text-xs font-bold flex items-center gap-1.5"
                  >
                    {mounted && themeMode === "dark" ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
                    <span>{themeMode === "dark" ? "الوضع الليلي" : "الوضع النهاري"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
