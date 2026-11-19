"use client";

import React, { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useSeasonalVisualStore, SeasonalVisualMode } from "@/store/seasonalVisualStore";
import { SEASONAL_THEMES } from "@/config/themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { locale, themeMode, seasonalTheme } = useAppStore();
  const { setMode } = useSeasonalVisualStore();

  useEffect(() => {
    setMounted(true);
    if (seasonalTheme) {
      setMode(seasonalTheme as SeasonalVisualMode);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    // Apply RTL / LTR direction and lang attribute
    root.setAttribute("lang", locale);
    root.setAttribute("dir", locale === "ar" ? "rtl" : "ltr");

    // Apply Light/Dark Class
    if (themeMode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Resolve current theme palette
    const themeDef = SEASONAL_THEMES[seasonalTheme] || SEASONAL_THEMES.default;
    const colors = themeMode === "dark" ? themeDef.dark : themeDef.light;

    // Set CSS variables on :root
    root.style.setProperty("--theme-primary", colors.primary);
    root.style.setProperty("--theme-primary-hover", colors.primaryHover);
    root.style.setProperty("--theme-primary-contrast", colors.primaryContrast);
    root.style.setProperty("--theme-accent", colors.accent);
    root.style.setProperty("--theme-gold", colors.gold);
    root.style.setProperty("--theme-gold-light", colors.goldLight);
    root.style.setProperty("--theme-gold-dark", colors.goldDark);
    root.style.setProperty("--theme-bg", colors.bg);
    root.style.setProperty("--theme-surface", colors.surface);
    root.style.setProperty("--theme-surface-elevated", colors.surfaceElevated);
    root.style.setProperty("--theme-border", colors.border);
    root.style.setProperty("--theme-text", colors.text);
    root.style.setProperty("--theme-text-muted", colors.textMuted);
    root.style.setProperty("--theme-danger", "#D32F2F");
    root.style.setProperty("--theme-success", "#2E7D32");

    // Set HTML data attributes for CSS targeting
    root.setAttribute("data-seasonal-theme", seasonalTheme);
    root.setAttribute("data-theme-mode", themeMode);

    // Apply smooth background & text color transitions to body
    if (document.body) {
      document.body.style.backgroundColor = colors.bg;
      document.body.style.color = colors.text;
    }

    // Always keep visual particle canvas in sync
    setMode(seasonalTheme as SeasonalVisualMode);
  }, [mounted, locale, themeMode, seasonalTheme]);

  return <>{children}</>;
}
