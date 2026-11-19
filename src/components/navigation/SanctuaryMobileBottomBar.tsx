"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, ShoppingBag, Heart, User } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";

export function SanctuaryMobileBottomBar() {
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const { items: wishlistItems } = useWishlistStore();

  const navItems = [
    { label: "الرئيسية", href: "/", icon: Home },
    { label: "الأقسام", href: "/catalog", icon: Layers },
    {
      label: "السلة",
      href: "/cart",
      icon: ShoppingBag,
      badge: totalItems > 0 ? totalItems : undefined,
    },
    {
      label: "المفضلة",
      href: "/wishlist",
      icon: Heart,
      badge: wishlistItems.length > 0 ? wishlistItems.length : undefined,
    },
    { label: "حسابي", href: "/profile", icon: User },
  ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-[#FCFBF7]/90 backdrop-blur-lg border-t border-[#E8E2D2] pb-[env(safe-area-inset-bottom)] lg:hidden shadow-lg transition-colors duration-500"
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
                isActive ? "text-[#781d22] font-bold" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "scale-110 text-[#781d22]" : ""}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#781d22] text-white text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 font-sans">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-[#c5a059]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
