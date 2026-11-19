"use client";

import React from "react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { Cross, Globe, Sun, Moon } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale, setLocale, themeMode, setThemeMode } = useAppStore();

  return (
    <div className="min-h-screen bg-theme-bg flex flex-col justify-between p-4 sm:p-6 transition-colors">
      
      {/* Top Navbar in Auth Layout */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full py-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-full bg-theme-primary flex items-center justify-center text-theme-gold border border-theme-gold/40 shadow-sacred group-hover:scale-105 transition-transform">
            <Cross className="w-5 h-5" />
          </div>
          <span className="font-sacred text-lg font-bold text-theme-text">
            {locale === "ar" ? "سانكتا ماريا" : "Sancta Maria"}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setThemeMode(themeMode === "light" ? "dark" : "light")}
            className="p-2 rounded-lg text-theme-text hover:bg-theme-surface-elevated"
          >
            {themeMode === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-theme-gold" />}
          </button>
        </div>
      </div>

      {/* Main Form Center */}
      <div className="flex items-center justify-center py-8">{children}</div>

      {/* Footer */}
      <div className="text-center text-[11px] text-theme-text-muted py-4">
        © {new Date().getFullYear()} {locale === "ar" ? "سانكتا ماريا - منصة المقتنيات الكنسية الفاخرة" : "Sancta Maria Church Supplies"}.
      </div>
    </div>
  );
}
