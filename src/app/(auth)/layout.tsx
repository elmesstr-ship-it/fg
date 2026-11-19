"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppStore } from "@/store/useAppStore";
import { Sun, Moon } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale, toggleLocale, themeMode, toggleThemeMode } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0A0A0A] flex flex-col justify-between p-4 sm:p-6 transition-colors">
      
      {/* Top Navbar in Auth Layout */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full py-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 flex-shrink-0 group-hover:scale-105 transition-transform">
            <Image
              src={
                mounted && themeMode === "dark"
                  ? "/branding/FG_Logo_Transparent_White.png"
                  : "/branding/FG_Logo_Transparent_Black.png"
              }
              alt="FG Collective Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-black uppercase tracking-tight text-neutral-900 dark:text-white">
            FG COLLECTIVE
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLocale}
            className="px-2 py-1 rounded text-xs font-mono font-bold bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
          >
            {locale === "ar" ? "EN" : "العربية"}
          </button>
          <button
            onClick={toggleThemeMode}
            className="p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800"
          >
            {mounted && themeMode === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Form Center */}
      <div className="flex items-center justify-center py-8">{children}</div>

      {/* Footer */}
      <div className="text-center text-[11px] text-neutral-400 py-4 font-mono">
        © {new Date().getFullYear()} FG Collective Mansoura. Contemporary Luxury Streetwear.
      </div>
    </div>
  );
}
