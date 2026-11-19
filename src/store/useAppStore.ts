"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Locale } from "@/types/locale";
import { ThemeMode, SeasonalThemeId } from "@/types/theme";

interface AppState {
  locale: "ar";
  themeMode: ThemeMode;
  seasonalTheme: SeasonalThemeId;
  isMaintenanceMode: boolean;
  isAdmin: boolean;
  setLocale: (locale: "ar") => void;
  setThemeMode: (mode: ThemeMode) => void;
  setSeasonalTheme: (theme: SeasonalThemeId) => void;
  setMaintenanceMode: (enabled: boolean) => void;
  toggleAdminPreview: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      locale: "ar",
      themeMode: "light",
      seasonalTheme: "default",
      isMaintenanceMode: false,
      isAdmin: false,
      setLocale: () => set({ locale: "ar" }),
      setThemeMode: (themeMode) => set({ themeMode }),
      setSeasonalTheme: (seasonalTheme) => set({ seasonalTheme }),
      setMaintenanceMode: (isMaintenanceMode) => set({ isMaintenanceMode }),
      toggleAdminPreview: () => set((state) => ({ isAdmin: !state.isAdmin })),
    }),
    {
      name: "sancta-maria-app-settings",
    }
  )
);
