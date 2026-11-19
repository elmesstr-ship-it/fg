"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppStore } from "@/store/useAppStore";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { translations } from "@/config/i18n";
import { SEASONAL_THEMES } from "@/config/themes";
import { SeasonalThemeId } from "@/types/theme";
import { db } from "@/services";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/Button";
import {
  ShoppingBag,
  Heart,
  Sun,
  Moon,
  Globe,
  Palette,
  ShieldCheck,
  Search,
  Menu,
  X,
  Cross,
  User,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Bell,
  CheckCircle2,
} from "lucide-react";

export function Header() {
  const { locale, setLocale, themeMode, setThemeMode, seasonalTheme, setSeasonalTheme } =
    useAppStore();
  const { items: cartItems, getTotalItems, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const wishlistItemsCount = useWishlistStore((state) => state.items.length);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Notification Center Dropdown State
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadNotifyCount, setUnreadNotifyCount] = useState(0);

  const t = translations[locale];
  const cartItemsCount = getTotalItems();
  const subtotal = getSubtotal();

  const loadNotifications = async () => {
    try {
      const res = await fetch("/api/notifications?limit=5");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setNotifications(json.data);
        setUnreadNotifyCount(json.data.filter((n: any) => !n.isRead).length);
      }
    } catch {}
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Instant Autocomplete Search Effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results = await db.products.getProducts({ search: searchQuery });
      setSearchResults(results.slice(0, 5));
      setIsSearching(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-theme-surface/95 backdrop-blur-md border-b border-theme-border transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Logo & Store Identity */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="w-11 h-11 rounded-full bg-theme-primary flex items-center justify-center text-theme-gold border-2 border-theme-gold/40 shadow-sacred group-hover:scale-105 transition-transform">
                <Cross className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="font-sacred text-xl sm:text-2xl font-bold tracking-wide text-theme-text group-hover:text-theme-primary transition-colors">
                  {t.common.storeName}
                </span>
                <span className="text-[11px] text-theme-text-muted hidden sm:inline-block">
                  {t.common.tagline}
                </span>
              </div>
            </Link>

            {/* Quick Search with Autocomplete */}
            <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder={t.common.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-theme-surface-elevated border border-theme-border rounded-full focus:outline-none focus:ring-2 focus:ring-theme-gold focus:border-transparent text-theme-text placeholder-theme-text-muted transition-all"
                />
                <Search className="w-4 h-4 text-theme-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-theme-text-muted hover:text-theme-text text-xs"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Instant Search Results Dropdown */}
              {searchQuery.trim() !== "" && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-theme-surface border border-theme-border rounded-2xl shadow-sacred-lg overflow-hidden z-50">
                  <div className="p-3 border-b border-theme-border text-xs font-semibold text-theme-text-muted flex justify-between items-center">
                    <span>{locale === "ar" ? "نتائج البحث الفورية" : "Quick Search Results"}</span>
                    {isSearching && <span className="animate-pulse">{locale === "ar" ? "جاري البحث..." : "Searching..."}</span>}
                  </div>

                  {searchResults.length === 0 && !isSearching ? (
                    <div className="p-4 text-center text-xs text-theme-text-muted">
                      {locale === "ar" ? "لا توجد نتائج مطابقة" : "No products found"}
                    </div>
                  ) : (
                    <div className="divide-y divide-theme-border">
                      {searchResults.map((prod) => (
                        <Link
                          key={prod.id}
                          href={`/product/${prod.slug}`}
                          onClick={() => setSearchQuery("")}
                          className="p-3 flex items-center gap-3 hover:bg-theme-surface-elevated transition-colors"
                        >
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-theme-surface-elevated flex-shrink-0 border border-theme-border">
                            <Image src={prod.images[0]} alt={prod.name[locale]} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold text-theme-text block truncate">
                              {prod.name[locale]}
                            </span>
                            <span className="text-[10px] text-theme-gold font-bold font-mono">
                              {prod.price.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} {t.common.priceEGP}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  <Link
                    href={`/catalog?search=${encodeURIComponent(searchQuery)}`}
                    onClick={() => setSearchQuery("")}
                    className="p-2.5 bg-theme-surface-elevated block text-center text-xs font-bold text-theme-primary hover:bg-theme-border/50 transition-colors"
                  >
                    {locale === "ar" ? "عرض جميع النتائج بالكتالوج ←" : "View all results in Catalog →"}
                  </Link>
                </div>
              )}
            </div>

            {/* Controls & Nav Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Seasonal Theme Selector */}
              <div className="relative group">
                <button
                  className="p-2 rounded-lg text-theme-text hover:bg-theme-surface-elevated transition-colors flex items-center gap-1.5 text-xs font-medium border border-transparent hover:border-theme-border"
                  title={t.common.seasonalThemes}
                >
                  <Palette className="w-4 h-4 text-theme-gold" />
                  <span className="hidden xl:inline text-theme-text-muted">
                    {SEASONAL_THEMES[seasonalTheme]?.name[locale] || seasonalTheme}
                  </span>
                </button>
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-56 p-2 bg-theme-surface rounded-xl shadow-sacred-lg border border-theme-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="text-[11px] font-semibold text-theme-text-muted px-2 py-1 mb-1 border-b border-theme-border">
                    {t.common.seasonalThemes}
                  </div>
                  {Object.values(SEASONAL_THEMES).map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSeasonalTheme(theme.id as SeasonalThemeId)}
                      className={`w-full text-start px-2 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                        seasonalTheme === theme.id
                          ? "bg-theme-primary text-theme-primary-contrast font-medium"
                          : "text-theme-text hover:bg-theme-surface-elevated"
                      }`}
                    >
                      <span>{theme.name[locale]}</span>
                      {seasonalTheme === theme.id && (
                        <span className="w-2 h-2 rounded-full bg-theme-gold" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Light / Dark Mode Toggle */}
              <button
                onClick={() => setThemeMode(themeMode === "light" ? "dark" : "light")}
                className="p-2 rounded-lg text-theme-text hover:bg-theme-surface-elevated transition-colors"
                title={themeMode === "light" ? t.common.darkMode : t.common.lightMode}
              >
                {themeMode === "light" ? (
                  <Moon className="w-4 h-4 text-theme-text-muted" />
                ) : (
                  <Sun className="w-4 h-4 text-theme-gold" />
                )}
              </button>

              {/* Account / Profile Link */}
              <Link
                href="/profile"
                className="p-2 rounded-lg text-theme-text hover:bg-theme-surface-elevated transition-colors"
                title={t.common.account}
              >
                <User className="w-5 h-5 text-theme-text" />
              </Link>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="relative p-2 rounded-lg text-theme-text hover:bg-theme-surface-elevated transition-colors"
                title={t.common.wishlist}
              >
                <Heart className="w-5 h-5 text-theme-text" />
                {wishlistItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-theme-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlistItemsCount}
                  </span>
                )}
              </Link>

              {/* Notification Center Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotifyOpen(!notifyOpen);
                    loadNotifications();
                  }}
                  className="relative p-2 rounded-lg text-theme-text hover:bg-theme-surface-elevated transition-colors"
                  title={locale === "ar" ? "مركز الإشعارات" : "Notifications"}
                >
                  <Bell className="w-5 h-5 text-theme-text" />
                  {unreadNotifyCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
                      {unreadNotifyCount}
                    </span>
                  )}
                </button>

                {notifyOpen && (
                  <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-80 p-3 bg-theme-surface rounded-2xl shadow-sacred-lg border border-theme-border z-50 space-y-2 animate-fade-in text-start">
                    <div className="flex items-center justify-between pb-2 border-b border-theme-border">
                      <span className="font-sacred text-xs font-bold text-theme-text">
                        {locale === "ar" ? "مركز الإشعارات والتنبيهات" : "Notifications Center"}
                      </span>
                      <button
                        onClick={async () => {
                          await fetch("/api/notifications", { method: "PATCH" });
                          loadNotifications();
                        }}
                        className="text-[10px] text-theme-gold hover:underline"
                      >
                        {locale === "ar" ? "تحديد الكل كمقروء" : "Mark all read"}
                      </button>
                    </div>

                    <div className="max-h-64 overflow-y-auto divide-y divide-theme-border/50 text-xs">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-theme-text-muted text-[11px]">
                          {locale === "ar" ? "لا توجد إشعارات جديدة حالياً" : "No new notifications"}
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-2 rounded-xl transition-colors ${
                              !n.isRead ? "bg-theme-surface-elevated font-semibold" : "opacity-80"
                            }`}
                          >
                            <div className="text-[11px] font-bold text-theme-gold">
                              {n.title[locale] || n.title.ar}
                            </div>
                            <div className="text-[10px] text-theme-text-muted mt-0.5">
                              {n.message[locale] || n.message.ar}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Shopping Cart Button (Opens Slide-over Drawer) */}
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative p-2.5 rounded-xl bg-theme-primary text-theme-primary-contrast hover:bg-theme-primary-hover shadow-sacred transition-all flex items-center gap-2"
                title={t.common.cart}
              >
                <ShoppingBag className="w-5 h-5 text-theme-gold" />
                <span className="text-xs font-bold hidden sm:inline">
                  {cartItemsCount}
                </span>
              </button>

              {/* Admin Dashboard Quick Link */}
              <Link
                href="/admin"
                className="hidden lg:flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border border-theme-gold/40 text-theme-gold hover:bg-theme-gold/10 transition-colors"
                title={t.common.adminDashboard}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t.common.adminDashboard}</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg md:hidden text-theme-text hover:bg-theme-surface-elevated"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Secondary Navigation Row */}
          <nav className="hidden md:flex items-center justify-center space-x-8 rtl:space-x-reverse py-2.5 border-t border-theme-border/60 text-xs font-medium text-theme-text-muted">
            <Link href="/" className="hover:text-theme-primary transition-colors">
              {t.navigation.home}
            </Link>
            <Link href="/catalog" className="hover:text-theme-primary transition-colors">
              {t.navigation.catalog}
            </Link>
            <Link href="/categories" className="hover:text-theme-primary transition-colors">
              {t.navigation.categories}
            </Link>
            <Link href="/catalog?drop=new" className="hover:text-theme-primary transition-colors">
              {t.navigation.newDrops}
            </Link>
            <Link href="/catalog?category=hoodies-sweats" className="hover:text-theme-primary transition-colors">
              هوديز
            </Link>
            <Link href="/catalog?category=oversized-tshirts" className="hover:text-theme-primary transition-colors">
              تيشرتات
            </Link>
            <Link href="/catalog?category=streetwear-pants" className="hover:text-theme-primary transition-colors">
              بناطيل
            </Link>
            <Link href="/catalog?category=outerwear-jackets" className="hover:text-theme-primary transition-colors">
              جاكيتات
            </Link>
          </nav>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-theme-border bg-theme-surface p-4 space-y-3">
            <div className="flex flex-col space-y-2 text-sm font-medium">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="py-1 text-theme-text">
                {t.navigation.home}
              </Link>
              <Link href="/catalog" onClick={() => setMobileMenuOpen(false)} className="py-1 text-theme-text">
                {t.navigation.catalog}
              </Link>
              <Link href="/categories" onClick={() => setMobileMenuOpen(false)} className="py-1 text-theme-text">
                {t.navigation.categories}
              </Link>
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="py-1 text-theme-text">
                {t.common.account}
              </Link>
              <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="py-1 text-theme-text">
                {locale === "ar" ? "سجل طلباتي" : "My Orders"}
              </Link>
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="py-1 text-theme-gold font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                {t.common.adminDashboard}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Cart Slide-Over Drawer */}
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setCartDrawerOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-md bg-theme-surface text-theme-text h-full shadow-2xl flex flex-col justify-between border-l rtl:border-l-0 rtl:border-r border-theme-border z-10 animate-slide-in">
            {/* Drawer Header */}
            <div className="p-5 border-b border-theme-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-theme-gold" />
                <h3 className="font-sacred font-bold text-base">{t.common.cart}</h3>
                <span className="text-xs text-theme-text-muted">({cartItemsCount})</span>
              </div>
              <button
                onClick={() => setCartDrawerOpen(false)}
                className="p-1.5 rounded-lg text-theme-text-muted hover:bg-theme-surface-elevated"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Items */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-theme-surface-elevated flex items-center justify-center text-theme-text-muted">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="text-xs text-theme-text-muted">
                    {locale === "ar" ? "السلة فارغة حالياً" : "Your cart is empty"}
                  </p>
                </div>
              ) : (
                cartItems.map(({ product, quantity, variantId, variantName }) => (
                  <div
                    key={`${product.id}-${variantId || "default"}`}
                    className="p-3 rounded-2xl bg-theme-surface-elevated/50 border border-theme-border flex gap-3 items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-theme-surface border border-theme-border flex-shrink-0">
                        <Image src={product.images[0]} alt={product.name[locale]} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-sacred font-bold text-xs text-theme-text line-clamp-1">
                          {product.name[locale]}
                        </h4>
                        <div className="text-xs font-bold text-theme-gold mt-0.5">
                          {product.price.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} {t.common.priceEGP}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-theme-border rounded-lg bg-theme-surface text-xs">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1, variantId)}
                          className="px-2 py-1 hover:bg-theme-surface-elevated"
                        >
                          -
                        </button>
                        <span className="px-2 font-bold">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1, variantId)}
                          className="px-2 py-1 hover:bg-theme-surface-elevated"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(product.id, variantId)}
                        className="p-1 text-theme-text-muted hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-theme-border bg-theme-surface space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-theme-text-muted">
                    <span>{locale === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
                    <span className="font-bold text-theme-text">
                      {subtotal.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} {t.common.priceEGP}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-theme-text-muted">
                    <span>{locale === "ar" ? "الشحن المؤمّن" : "Shipping"}</span>
                    <span className="font-bold text-emerald-600">
                      {subtotal >= 2000 ? (locale === "ar" ? "مجاني" : "Free") : `75 ${t.common.priceEGP}`}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href="/cart" onClick={() => setCartDrawerOpen(false)} className="flex-1">
                    <Button variant="outline" size="md" className="w-full rounded-xl text-xs">
                      {locale === "ar" ? "عرض السلة" : "View Cart"}
                    </Button>
                  </Link>
                  <Link href="/checkout" onClick={() => setCartDrawerOpen(false)} className="flex-1">
                    <Button variant="gold" size="md" className="w-full rounded-xl text-xs">
                      {locale === "ar" ? "إتمام الشراء" : "Checkout"}
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
