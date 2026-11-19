"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useSeasonalVisualStore, SeasonalVisualMode } from "@/store/seasonalVisualStore";
import { SEASONAL_THEMES } from "@/config/themes";
import { SeasonalThemeId } from "@/types/theme";
import {
  Palette,
  CheckCircle2,
  Sparkles,
  Sun,
  Moon,
  Clock,
  Eye,
  Check,
} from "lucide-react";

export default function AdminThemesPage() {
  const { locale, themeMode, toggleThemeMode, seasonalTheme, setSeasonalTheme } = useAppStore();
  const { setMode } = useSeasonalVisualStore();
  const [activeSuccess, setActiveSuccess] = useState<string | null>(null);

  const themeList = Object.values(SEASONAL_THEMES);

  const handleApplyTheme = (id: string) => {
    setSeasonalTheme(id);
    setMode(id as SeasonalVisualMode);
    setActiveSuccess(id);
    setTimeout(() => setActiveSuccess(null), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="border-b border-neutral-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
            THEME & VISUAL STUDIO
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white mt-1">
            {locale === "ar" ? "استوديو السمات والمواسم" : "Seasonal Themes Studio"}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            {locale === "ar"
              ? "التحكم في طابع وهوية المتجر البصرية، دروبات المواسم، واختبار الوضعين النهاري والليلي"
              : "Manage storefront color schemes, seasonal drop ambiance, and toggle Light/Dark previews"}
          </p>
        </div>

        {/* Global Light/Dark Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleThemeMode}
            className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-white text-xs font-bold flex items-center gap-2 transition-colors"
          >
            {themeMode === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            <span>{themeMode === "dark" ? "الوضع الليلي (مفعّل)" : "الوضع النهاري (مفعّل)"}</span>
          </button>
        </div>
      </div>

      {/* Active Theme Notice */}
      <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black border border-neutral-800 flex items-center justify-center text-[#D4AF37]">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 font-mono uppercase">CURRENT ACTIVE THEME</span>
            <h3 className="text-sm font-bold text-white">
              {SEASONAL_THEMES[seasonalTheme]?.name.ar || "FG Monochrome"}
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-950 text-emerald-400 border border-emerald-800">
          مطبق على المتجر حالياً
        </span>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themeList.map((theme) => {
          const isCurrent = seasonalTheme === theme.id;
          const currentColors = themeMode === "dark" ? theme.dark : theme.light;

          return (
            <div
              key={theme.id}
              className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-5 ${
                isCurrent
                  ? "bg-neutral-900 border-white ring-1 ring-white shadow-xl"
                  : "bg-[#141414] border-neutral-800 hover:border-neutral-700"
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-black text-white">
                      {locale === "ar" ? theme.name.ar : theme.name.en}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                      {locale === "ar" ? theme.description.ar : theme.description.en}
                    </p>
                  </div>
                  {isCurrent && (
                    <span className="p-1 rounded-full bg-white text-black">
                      <Check className="w-4 h-4" />
                    </span>
                  )}
                </div>

                {/* Color Palette Preview Swatches */}
                <div className="space-y-2 pt-2 border-t border-neutral-800">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                    COLOR PALETTE ({themeMode.toUpperCase()})
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-xl border border-neutral-700 shadow-sm"
                      style={{ backgroundColor: currentColors.primary }}
                      title={`Primary: ${currentColors.primary}`}
                    />
                    <div
                      className="w-7 h-7 rounded-xl border border-neutral-700 shadow-sm"
                      style={{ backgroundColor: currentColors.accent }}
                      title={`Accent: ${currentColors.accent}`}
                    />
                    <div
                      className="w-7 h-7 rounded-xl border border-neutral-700 shadow-sm"
                      style={{ backgroundColor: currentColors.gold }}
                      title={`Gold/Highlight: ${currentColors.gold}`}
                    />
                    <div
                      className="w-7 h-7 rounded-xl border border-neutral-700 shadow-sm"
                      style={{ backgroundColor: currentColors.bg }}
                      title={`Background: ${currentColors.bg}`}
                    />
                    <div
                      className="w-7 h-7 rounded-xl border border-neutral-700 shadow-sm"
                      style={{ backgroundColor: currentColors.surface }}
                      title={`Surface: ${currentColors.surface}`}
                    />
                  </div>
                </div>

                {/* Banner Message Preview */}
                {theme.bannerMessage && (
                  <div className="p-3 rounded-xl bg-black border border-neutral-800 text-[11px] text-neutral-300">
                    <span className="text-[9px] text-[#D4AF37] font-mono uppercase block mb-0.5">
                      ANNOUNCEMENT BAR BANNER:
                    </span>
                    {locale === "ar" ? theme.bannerMessage.ar : theme.bannerMessage.en}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => handleApplyTheme(theme.id)}
                  disabled={isCurrent}
                  className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                    isCurrent
                      ? "bg-white text-black opacity-100 cursor-default"
                      : "bg-neutral-800 hover:bg-neutral-700 text-white"
                  }`}
                >
                  {isCurrent ? "✓ السمة النشطة حالياً" : "تفعيل هذه السمة الآن"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {activeSuccess && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-2xl bg-white text-black font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>تم تطبيق وتفعيل السمة بنجاح على المتجر!</span>
        </div>
      )}

    </div>
  );
}
