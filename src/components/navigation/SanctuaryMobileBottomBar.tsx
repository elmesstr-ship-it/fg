"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, ShoppingBag, Heart, User } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAppStore } from "@/store/useAppStore";

export function SanctuaryMobileBottomBar() {
  const pathname = usePathname();
  const { locale } = useAppStore();
  const cartItems = useCartStore((state) => state.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const { items: wishlistItems } = useWishlistStore();

  const navItems = [
    { label: locale === "ar" ? "الرئيسية" : "Home", href: "/", icon: Home },
    { label: locale === "ar" ? "الإصدارات" : "Drops", href: "/catalog", icon: Layers },
    {
      label: locale === "ar" ? "الحقيبة" : "Bag",
      href: "/cart",
      icon: ShoppingBag,
      badge: totalItems > 0 ? totalItems : undefined,
    },
    {
      label: locale === "ar" ? "المفضلة" : "Wishlist",
      href: "/wishlist",
      icon: Heart,
      badge: wishlistItems.length > 0 ? wishlistItems.length : undefined,
    },
    { label: locale === "ar" ? "حسابي" : "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 pb-[env(safe-area-inset-bottom)] lg:hidden shadow-lg transition-colors duration-300"
      aria-label="Mobile Navigation Bar"
    >
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center h-full relative transition-all duration-200 ${
                isActive
                  ? "text-black dark:text-white font-black"
                  : "text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#D4AF37] text-black text-[10px] font-black flex items-center justify-center shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-sans">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-black dark:bg-white" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
