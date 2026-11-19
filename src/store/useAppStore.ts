"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Locale } from "@/types/locale";
import { ThemeMode, SeasonalThemeId } from "@/types/theme";

interface AppState {
  locale: Locale;
  themeMode: ThemeMode;
  seasonalTheme: SeasonalThemeId;
  isMaintenanceMode: boolean;
  isAdmin: boolean;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
  setSeasonalTheme: (theme: SeasonalThemeId) => void;
  setMaintenanceMode: (enabled: boolean) => void;
  toggleAdminPreview: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      locale: "ar",
      themeMode: "light",
      seasonalTheme: "default",
      isMaintenanceMode: false,
      isAdmin: false,
      setLocale: (locale) => set({ locale }),
      toggleLocale: () => {
        const next = get().locale === "ar" ? "en" : "ar";
        set({ locale: next });
      },
      setThemeMode: (themeMode) => set({ themeMode }),
      toggleThemeMode: () => {
        const next = get().themeMode === "light" ? "dark" : "light";
        set({ themeMode: next });
      },
      setSeasonalTheme: (seasonalTheme) => set({ seasonalTheme }),
      setMaintenanceMode: (isMaintenanceMode) => set({ isMaintenanceMode }),
      toggleAdminPreview: () => set((state) => ({ isAdmin: !state.isAdmin })),
    }),
    {
      name: "fg-collective-app-settings",
    }
  )
);
