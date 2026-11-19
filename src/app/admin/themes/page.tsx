"use client";

import React, { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/config/i18n";
import { SeasonalThemeId } from "@/types/theme";
import { Button } from "@/components/ui/Button";
import { adminFetch } from "@/lib/adminApi";
import {
  Palette,
  CheckCircle2,
  Calendar,
  Sparkles,
  Sun,
  Moon,
  Clock,
  RefreshCw,
  Eye,
  Plus,
  Trash2,
  Edit2,
  Sliders,
  Shield,
  Send,
} from "lucide-react";

export default function AdminThemesPage() {
  const { locale, themeMode, setThemeMode, seasonalTheme, setSeasonalTheme } = useAppStore();
  const t = translations[locale];

  const [dbThemes, setDbThemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Scheduling State
  const [scheduleTargetKey, setScheduleTargetKey] = useState<string>("christmas");
  const [scheduledDates, setScheduledDates] = useState({
    startDate: "2026-11-20",
    endDate: "2027-01-08",
    autoRevert: true,
  });

  // Simulated Date Tester
  const [simulatedDate, setSimulatedDate] = useState<string>("2026-12-25");
  const [simResult, setSimResult] = useState<any>(null);

  // New/Edit Theme Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingThemeKey, setEditingThemeKey] = useState<string | null>(null);
  const [themeForm, setThemeForm] = useState({
    key: "",
    nameAr: "",
    nameEn: "",
    descAr: "",
    descEn: "",
    priority: 25,
    bannerMessageAr: "",
    bannerMessageEn: "",
    lightPrimary: "#781d22",
    lightGold: "#c5a059",
    darkPrimary: "#99262c",
    darkGold: "#dfc285",
  });

  const loadThemes = async () => {
    setLoading(true);
    const res = await adminFetch<any>("/api/themes");
    if (res.success && res.data) {
      setDbThemes(res.data);
      const active = res.data.find((t: any) => t.isActive);
      if (active && active.key !== seasonalTheme) {
        setSeasonalTheme(active.key as SeasonalThemeId);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadThemes();
  }, []);

  const showFeedback = (message: string, type: "success" | "error" = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleActivateTheme = async (key: SeasonalThemeId) => {
    setActionLoading(true);
    const res = await adminFetch("/api/themes", {
      method: "POST",
      body: JSON.stringify({ action: "activate", themeKey: key }),
    });
    setActionLoading(false);

    if (res.success) {
      setSeasonalTheme(key);
      setDbThemes((prev) => prev.map((t) => ({ ...t, isActive: t.key === key })));
      showFeedback(
        locale === "ar"
          ? "تم حفظ وتفعيل السمة الطقسية في قاعدة البيانات وتحديث المتجر فورياً!"
          : "Theme activated in database and updated instantly across the platform!"
      );
    } else {
      showFeedback(res.error || "Failed to activate theme", "error");
    }
  };

  const handleSaveTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    const isEdit = Boolean(editingThemeKey);
    const payload = isEdit
      ? {
          action: "update",
          themeKey: editingThemeKey,
          updates: {
            nameAr: themeForm.nameAr,
            nameEn: themeForm.nameEn,
            descAr: themeForm.descAr,
            descEn: themeForm.descEn,
            priority: Number(themeForm.priority),
            bannerMessageAr: themeForm.bannerMessageAr,
            bannerMessageEn: themeForm.bannerMessageEn,
            lightColors: { primary: themeForm.lightPrimary, gold: themeForm.lightGold },
            darkColors: { primary: themeForm.darkPrimary, gold: themeForm.darkGold },
          },
        }
      : {
          action: "create",
          theme: {
            key: themeForm.key,
            nameAr: themeForm.nameAr,
            nameEn: themeForm.nameEn,
            descAr: themeForm.descAr,
            descEn: themeForm.descEn,
            priority: Number(themeForm.priority),
            bannerMessageAr: themeForm.bannerMessageAr,
            bannerMessageEn: themeForm.bannerMessageEn,
            lightColors: { primary: themeForm.lightPrimary, gold: themeForm.lightGold },
            darkColors: { primary: themeForm.darkPrimary, gold: themeForm.darkGold },
          },
        };

    const res = await adminFetch("/api/themes", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setActionLoading(false);

    if (res.success) {
      setShowModal(false);
      setEditingThemeKey(null);
      loadThemes();
      showFeedback(
        locale === "ar"
          ? `تم ${isEdit ? "تحديث" : "إنشاء"} المظهر الطقسي بنجاح في قاعدة البيانات!`
          : `Theme ${isEdit ? "updated" : "created"} successfully in database!`
      );
    } else {
      showFeedback(res.error || "Failed to save theme", "error");
    }
  };

  const handleDeleteTheme = async (themeKey: string) => {
    if (!confirm(locale === "ar" ? "هل أنت متأكد من حذف هذا المظهر المخصص؟" : "Delete this custom theme?")) return;
    setActionLoading(true);
    const res = await adminFetch(`/api/themes?themeKey=${themeKey}`, { method: "DELETE" });
    setActionLoading(false);
    if (res.success) {
      loadThemes();
      showFeedback(locale === "ar" ? "تم حذف المظهر المخصص بنجاح" : "Custom theme deleted");
    } else {
      showFeedback(res.error || "Failed to delete theme", "error");
    }
  };

  const handleScheduleTheme = async () => {
    setActionLoading(true);
    const res = await adminFetch("/api/themes", {
      method: "POST",
      body: JSON.stringify({
        action: "schedule",
        themeKey: scheduleTargetKey,
        startDate: scheduledDates.startDate,
        endDate: scheduledDates.endDate,
        autoRevert: scheduledDates.autoRevert,
      }),
    });
    setActionLoading(false);

    if (res.success) {
      loadThemes();
      showFeedback(
        locale === "ar"
          ? "تمت جدولة المظهر الطقسي بنجاح مع تفعيل وتطبيق الأولويات التلقائية!"
          : "Theme scheduled successfully with automatic priority resolution!"
      );
    } else {
      showFeedback(res.error || "Failed to schedule theme", "error");
    }
  };

  const handleSimulateDate = async () => {
    setActionLoading(true);
    const res = await adminFetch("/api/themes", {
      method: "POST",
      body: JSON.stringify({
        action: "evaluate",
        simulatedDate: simulatedDate,
      }),
    });
    setActionLoading(false);

    if (res.success) {
      setSimResult(res.data);
      if (res.data?.activeThemeKey) {
        setSeasonalTheme(res.data.activeThemeKey);
      }
      loadThemes();
    }
  };

  const openCreateModal = () => {
    setEditingThemeKey(null);
    setThemeForm({
      key: `custom-${Date.now().toString().slice(-4)}`,
      nameAr: "مظهر قبطي مخصص جديد",
      nameEn: "New Custom Liturgical Theme",
      descAr: "سمة كنسية خاصة بمناسبة أو عيد ليتورجي محدد",
      descEn: "Custom ecclesiastical seasonal design",
      priority: 25,
      bannerMessageAr: "بركة ومحبة لجميع زوار سانكتا ماريا",
      bannerMessageEn: "Blessings to all Sancta Maria visitors",
      lightPrimary: "#4A0E4E",
      lightGold: "#D4AF37",
      darkPrimary: "#6A1B9A",
      darkGold: "#FFD54F",
    });
    setShowModal(true);
  };

  const openEditModal = (t: any) => {
    setEditingThemeKey(t.key);
    setThemeForm({
      key: t.key,
      nameAr: t.name.ar,
      nameEn: t.name.en,
      descAr: t.description.ar,
      descEn: t.description.en,
      priority: t.priority ?? 20,
      bannerMessageAr: t.bannerMessage?.ar || "",
      bannerMessageEn: t.bannerMessage?.en || "",
      lightPrimary: t.lightColors.primary || "#781d22",
      lightGold: t.lightColors.gold || "#c5a059",
      darkPrimary: t.darkColors.primary || "#99262c",
      darkGold: t.darkColors.gold || "#dfc285",
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-theme-border pb-4">
        <div>
          <h1 className="font-sacred text-2xl font-bold text-theme-text flex items-center gap-2">
            <Palette className="w-6 h-6 text-theme-gold" />
            <span>{t.admin.themes}</span>
          </h1>
          <p className="text-xs text-theme-text-muted mt-1">
            {locale === "ar"
              ? "إدارة السمات الطقسية (افتراضي، كريسماس، قيامة، هالوين، ومخصص) مع الجدولة والأولويات التلقائية"
              : "Manage liturgical themes (Default, Christmas, Easter, Autumn, & Custom) with priorities and scheduling"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="gold" size="sm" onClick={openCreateModal} className="rounded-xl text-xs">
            <Plus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
            <span>{locale === "ar" ? "إنشاء مظهر جديد" : "Create New Theme"}</span>
          </Button>

          <Button variant="outline" size="sm" onClick={loadThemes} disabled={loading}>
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 rtl:mr-0 rtl:ml-1.5 ${loading ? "animate-spin" : ""}`} />
            <span>{locale === "ar" ? "تحديث" : "Refresh"}</span>
          </Button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold animate-fade-in ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-500/10 border border-rose-500/20 text-rose-500"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Mode Preview Switcher */}
      <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <Eye className="w-4 h-4 text-theme-gold" />
          <span className="font-bold text-theme-text">
            {locale === "ar" ? "معاينة الوضع البصري الفوري:" : "Live Visual Mode Preview:"}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-theme-surface-elevated p-1 rounded-xl border border-theme-border">
          <button
            onClick={() => setThemeMode("light")}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              themeMode === "light" ? "bg-white text-stone-900 shadow-sm" : "text-theme-text-muted hover:text-theme-text"
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>{locale === "ar" ? "فاتح (Light)" : "Light"}</span>
          </button>
          <button
            onClick={() => setThemeMode("dark")}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              themeMode === "dark" ? "bg-stone-900 text-white shadow-sm" : "text-theme-text-muted hover:text-theme-text"
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-theme-gold" />
            <span>{locale === "ar" ? "داكن (Dark)" : "Dark"}</span>
          </button>
        </div>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dbThemes.map((theme) => {
          const isCurrentlyActive = theme.isActive;
          const colors = themeMode === "dark" ? theme.darkColors : theme.lightColors;

          return (
            <div
              key={theme.id}
              className={`p-6 rounded-3xl bg-theme-surface border transition-all space-y-5 relative overflow-hidden ${
                isCurrentlyActive
                  ? "border-theme-gold ring-2 ring-theme-gold/30 shadow-sacred"
                  : "border-theme-border hover:border-theme-border/80"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-sacred text-base font-bold text-theme-text">
                      {theme.name[locale] || theme.name.ar}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-theme-surface-elevated text-theme-text-muted border border-theme-border">
                      P:{theme.priority ?? 0}
                    </span>
                    {theme.isCustom && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500 font-bold border border-purple-500/20">
                        {locale === "ar" ? "مخصص" : "Custom"}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-theme-text-muted leading-relaxed">
                    {theme.description[locale] || theme.description.ar}
                  </p>
                </div>

                {isCurrentlyActive ? (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{locale === "ar" ? "مفعّل" : "Active"}</span>
                  </span>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={actionLoading}
                    onClick={() => handleActivateTheme(theme.key)}
                    className="rounded-xl text-xs"
                  >
                    <span>{locale === "ar" ? "تفعيل الآن" : "Activate"}</span>
                  </Button>
                )}
              </div>

              {/* Color Swatches Preview */}
              <div className="p-3.5 rounded-2xl bg-theme-surface-elevated border border-theme-border space-y-2">
                <div className="text-[11px] font-bold text-theme-text-muted flex items-center justify-between">
                  <span>لوحة الألوان ({themeMode === "dark" ? "الوضع الليلي" : "الوضع النهاري"}):</span>
                  <span className="font-mono text-[10px]">{colors.primary}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="p-2 rounded-xl text-center space-y-1" style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}>
                    <div className="w-4 h-4 rounded-full mx-auto" style={{ backgroundColor: colors.primary }}></div>
                    <span className="text-[9px] font-mono block" style={{ color: colors.text }}>Primary</span>
                  </div>
                  <div className="p-2 rounded-xl text-center space-y-1" style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}>
                    <div className="w-4 h-4 rounded-full mx-auto" style={{ backgroundColor: colors.gold }}></div>
                    <span className="text-[9px] font-mono block" style={{ color: colors.text }}>Gold</span>
                  </div>
                  <div className="p-2 rounded-xl text-center space-y-1" style={{ backgroundColor: colors.surfaceElevated, border: `1px solid ${colors.border}` }}>
                    <div className="w-4 h-4 rounded-full mx-auto" style={{ backgroundColor: colors.accent }}></div>
                    <span className="text-[9px] font-mono block" style={{ color: colors.text }}>Accent</span>
                  </div>
                  <div className="p-2 rounded-xl text-center space-y-1" style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}>
                    <div className="w-4 h-4 rounded-full mx-auto border border-theme-border" style={{ backgroundColor: colors.bg }}></div>
                    <span className="text-[9px] font-mono block" style={{ color: colors.text }}>Background</span>
                  </div>
                </div>
              </div>

              {/* Banner Message */}
              {theme.bannerMessage && (
                <div className="text-[11px] p-2.5 rounded-xl bg-theme-gold/10 border border-theme-gold/20 text-theme-gold">
                  <span className="font-bold block mb-0.5">شريط التهنئة الليتورجي:</span>
                  <span>{theme.bannerMessage[locale] || theme.bannerMessage.ar}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-theme-border text-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(theme)}
                    className="p-1.5 rounded-lg border border-theme-border hover:bg-theme-surface-elevated text-theme-text-muted hover:text-theme-text flex items-center gap-1 text-[11px]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>{locale === "ar" ? "تعديل" : "Edit"}</span>
                  </button>

                  {theme.isCustom && (
                    <button
                      onClick={() => handleDeleteTheme(theme.key)}
                      className="p-1.5 rounded-lg border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 flex items-center gap-1 text-[11px]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{locale === "ar" ? "حذف" : "Delete"}</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    setScheduleTargetKey(theme.key);
                    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                  }}
                  className="text-theme-gold hover:underline flex items-center gap-1 text-[11px] font-bold"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{locale === "ar" ? "جدولة هذا المظهر" : "Schedule"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scheduling & Simulation Workbench */}
      <div className="p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-theme-border pb-3">
          <Clock className="w-5 h-5 text-theme-gold" />
          <h3 className="font-sacred text-base font-bold text-theme-text">
            {locale === "ar" ? "جدولة المظاهر الموسميّة وحل تعارض الأولويات تلقائياً" : "Seasonal Scheduling & Date Simulator"}
          </h3>
        </div>

        {/* Schedule Creation Section */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs items-end">
          <div>
            <label className="block text-theme-text-muted mb-1 font-bold">المظهر المراد جدولته:</label>
            <select
              value={scheduleTargetKey}
              onChange={(e) => setScheduleTargetKey(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none font-bold"
            >
              {dbThemes.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.name.ar} (أولوية: {t.priority ?? 0})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-theme-text-muted mb-1 font-bold">تاريخ البداية:</label>
            <input
              type="date"
              value={scheduledDates.startDate}
              onChange={(e) => setScheduledDates({ ...scheduledDates, startDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-theme-text-muted mb-1 font-bold">تاريخ الانتهاء:</label>
            <input
              type="date"
              value={scheduledDates.endDate}
              onChange={(e) => setScheduledDates({ ...scheduledDates, endDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none font-mono"
            />
          </div>

          <Button
            variant="gold"
            size="md"
            disabled={actionLoading}
            onClick={handleScheduleTheme}
            className="rounded-xl text-xs"
          >
            <Calendar className="w-4 h-4 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
            <span>حفظ الجدولة في قاعدة البيانات</span>
          </Button>
        </div>

        {/* Date Simulator Section */}
        <div className="p-4 rounded-2xl bg-theme-surface-elevated border border-theme-border space-y-3">
          <div className="text-xs font-bold text-theme-text flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-theme-gold" />
            <span>محاكي التبديل التلقائي عبر التواريخ الافتراضية (Simulated Date Testing):</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 text-xs">
            <input
              type="date"
              value={simulatedDate}
              onChange={(e) => setSimulatedDate(e.target.value)}
              className="px-3 py-2 rounded-xl border border-theme-border bg-theme-surface text-theme-text font-mono outline-none"
            />
            <Button
              variant="outline"
              size="sm"
              disabled={actionLoading}
              onClick={handleSimulateDate}
              className="rounded-xl text-xs"
            >
              <span>اختبار التفعيل التلقائي في هذا التاريخ</span>
            </Button>
          </div>

          {simResult && (
            <div className="p-3 rounded-xl bg-theme-gold/10 border border-theme-gold/30 text-xs font-bold text-theme-text space-y-1">
              <div>
                المظهر المفعل تلقائياً في تاريخ ({simulatedDate}):{" "}
                <span className="font-mono text-theme-gold text-sm">{simResult.activeThemeKey?.toUpperCase()}</span>
              </div>
              <div className="text-[11px] text-theme-text-muted font-normal">{simResult.reason}</div>
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Theme Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-sacred-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-theme-border pb-3">
              <h3 className="font-sacred text-base font-bold text-theme-text">
                {editingThemeKey ? (locale === "ar" ? "تعديل المظهر الطقسي" : "Edit Theme") : (locale === "ar" ? "إنشاء مظهر طقسي مخصص جديد" : "Create Custom Theme")}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-theme-text-muted hover:text-theme-text">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTheme} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-theme-text-muted mb-1 font-bold">المعرف (Slug Key):</label>
                  <input
                    type="text"
                    required
                    disabled={Boolean(editingThemeKey)}
                    value={themeForm.key}
                    onChange={(e) => setThemeForm({ ...themeForm, key: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-theme-text-muted mb-1 font-bold">الأولوية (Priority):</label>
                  <input
                    type="number"
                    required
                    value={themeForm.priority}
                    onChange={(e) => setThemeForm({ ...themeForm, priority: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-theme-text-muted mb-1 font-bold">الاسم بالعربية:</label>
                  <input
                    type="text"
                    required
                    value={themeForm.nameAr}
                    onChange={(e) => setThemeForm({ ...themeForm, nameAr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none"
                  />
                </div>
                <div>
                  <label className="block text-theme-text-muted mb-1 font-bold">الاسم بالإنجليزية:</label>
                  <input
                    type="text"
                    required
                    value={themeForm.nameEn}
                    onChange={(e) => setThemeForm({ ...themeForm, nameEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-theme-text-muted mb-1 font-bold">الوصف الطقسي بالعربية:</label>
                  <input
                    type="text"
                    value={themeForm.descAr}
                    onChange={(e) => setThemeForm({ ...themeForm, descAr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none"
                  />
                </div>
                <div>
                  <label className="block text-theme-text-muted mb-1 font-bold">الوصف بالإنجليزية:</label>
                  <input
                    type="text"
                    value={themeForm.descEn}
                    onChange={(e) => setThemeForm({ ...themeForm, descEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-theme-text-muted mb-1 font-bold">نص شريط التهنئة بالواجهة:</label>
                <input
                  type="text"
                  value={themeForm.bannerMessageAr}
                  onChange={(e) => setThemeForm({ ...themeForm, bannerMessageAr: e.target.value })}
                  placeholder="مثال: كل عام وأنتم بخير بمناسبة صوم السيدة العذراء"
                  className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none"
                />
              </div>

              {/* Color Customizer */}
              <div className="p-3.5 rounded-2xl bg-theme-surface-elevated border border-theme-border space-y-3">
                <span className="font-bold text-theme-text block">تخصيص الألوان الأساسية:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                  <div>
                    <label className="block text-theme-text-muted mb-1 font-bold">Primary (نهاري):</label>
                    <input
                      type="color"
                      value={themeForm.lightPrimary}
                      onChange={(e) => setThemeForm({ ...themeForm, lightPrimary: e.target.value })}
                      className="w-full h-8 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-theme-text-muted mb-1 font-bold">Gold (نهاري):</label>
                    <input
                      type="color"
                      value={themeForm.lightGold}
                      onChange={(e) => setThemeForm({ ...themeForm, lightGold: e.target.value })}
                      className="w-full h-8 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-theme-text-muted mb-1 font-bold">Primary (ليلي):</label>
                    <input
                      type="color"
                      value={themeForm.darkPrimary}
                      onChange={(e) => setThemeForm({ ...themeForm, darkPrimary: e.target.value })}
                      className="w-full h-8 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-theme-text-muted mb-1 font-bold">Gold (ليلي):</label>
                    <input
                      type="color"
                      value={themeForm.darkGold}
                      onChange={(e) => setThemeForm({ ...themeForm, darkGold: e.target.value })}
                      className="w-full h-8 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-theme-border">
                <Button variant="outline" size="sm" type="button" onClick={() => setShowModal(false)}>
                  إلغاء
                </Button>
                <Button variant="gold" size="sm" type="submit" disabled={actionLoading}>
                  {editingThemeKey ? "حفظ التعديلات في قاعدة البيانات" : "إنشاء وحفظ المظهر"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
