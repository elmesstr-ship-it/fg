"use client";

import React from "react";
import { useAppStore } from "@/store/useAppStore";
import { SEASONAL_THEMES } from "@/config/themes";
import { Sparkles } from "lucide-react";

export function SeasonalBanner() {
  const { seasonalTheme, locale } = useAppStore();
  const theme = SEASONAL_THEMES[seasonalTheme];

  if (!theme?.bannerMessage) {
    return null;
  }

  const message = theme.bannerMessage[locale] || theme.bannerMessage.ar;

  return (
    <div className="bg-gradient-to-r from-theme-primary via-theme-gold to-theme-primary text-white py-2 px-4 text-center text-xs md:text-sm font-medium transition-all shadow-inner flex items-center justify-center gap-2">
      <Sparkles className="w-4 h-4 text-theme-gold-light animate-pulse" />
      <span>{message}</span>
      <Sparkles className="w-4 h-4 text-theme-gold-light animate-pulse" />
    </div>
  );
}
