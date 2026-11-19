"use client";

import React, { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { SEASONAL_THEMES } from "@/config/themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { locale, themeMode, seasonalTheme, setSeasonalTheme } = useAppStore();
  const [dynamicThemes, setDynamicThemes] = useState<Record<string, any>>({});

  useEffect(() => {
    setMounted(true);
    // Fetch server themes and schedules
    fetch("/api/themes")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const map: Record<string, any> = {};
          for (const t of res.data) {
            map[t.key] = {
              id: t.key,
              name: t.name,
              light: t.lightColors,
              dark: t.darkColors,
            };
          }
          setDynamicThemes(map);
          if (res.activeThemeKey && res.activeThemeKey !== seasonalTheme) {
            setSeasonalTheme(res.activeThemeKey);
          }
        }
      })
      .catch(() => {});
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

    // Apply Seasonal Theme CSS Variables (checks dynamic database theme first, then static config)
    const currentTheme =
      dynamicThemes[seasonalTheme] ||
      SEASONAL_THEMES[seasonalTheme] ||
      dynamicThemes["default"] ||
      SEASONAL_THEMES.default;

    const colors = themeMode === "dark" ? currentTheme.dark : currentTheme.light;

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
  }, [mounted, locale, themeMode, seasonalTheme]);

  // Render children cleanly
  return <>{children}</>;
}
