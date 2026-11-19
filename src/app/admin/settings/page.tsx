"use client";

import React, { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/config/i18n";
import { Button } from "@/components/ui/Button";
import { adminFetch } from "@/lib/adminApi";
import {
  Settings,
  AlertTriangle,
  Globe,
  Truck,
  Share2,
  CheckCircle2,
  Shield,
  Save,
  RefreshCw,
  Send,
  Users,
  Plus,
  Trash2,
  Bell,
  Package,
  UserCheck,
} from "lucide-react";

interface TelegramUserItem {
  id: string;
  telegramId: string;
  firstName: string | null;
  username: string | null;
  role: "OWNER" | "ADMIN" | "VIEWER";
  isActive: boolean;
  createdAt: string;
}

export default function AdminSettingsPage() {
  const { locale, isMaintenanceMode, setMaintenanceMode } = useAppStore();
  const t = translations[locale];

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  // Telegram States
  const [tgUsers, setTgUsers] = useState<TelegramUserItem[]>([]);
  const [tgLoading, setTgLoading] = useState(false);
  const [newTgId, setNewTgId] = useState("");
  const [newTgName, setNewTgName] = useState("");
  const [newTgRole, setNewTgRole] = useState<"ADMIN" | "VIEWER">("VIEWER");
  const [testSending, setTestSending] = useState(false);
  const [testFeedback, setTestFeedback] = useState<string | null>(null);

  const [settings, setSettings] = useState({
    storeNameAr: "إف جي كوليكتيف (FG Collective)",
    storeNameEn: "FG Collective Contemporary Streetwear",
    supportPhone: "01012345678",
    supportEmail: "care@fgcollective.com",
    freeShippingThreshold: 1500,
    defaultShippingFee: 65,
    taxPercentage: 14,
    telegramNotificationsEnabled: true,
    telegramChannelId: "@fg_collective_orders",
    maintenanceMessage:
      "الموقع قيد التحديث لتحضير الدروب الجديد. سنعاود العمل قريباً جداً.",
  });

  const loadSettings = async () => {
    setLoading(true);
    const res = await adminFetch("/api/settings");
    if (res.success && res.data) {
      setSettings((prev) => ({ ...prev, ...res.data }));
      if (res.data.maintenanceMode !== undefined) {
        setMaintenanceMode(res.data.maintenanceMode);
      }
    }
    setLoading(false);
  };

  const loadTelegramUsers = async () => {
    setTgLoading(true);
    const res = await adminFetch("/api/telegram/users");
    if (res.success && Array.isArray(res.data)) {
      setTgUsers(res.data);
    }
    setTgLoading(false);
  };

  useEffect(() => {
    loadSettings();
    loadTelegramUsers();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...settings,
      maintenanceMode: isMaintenanceMode,
    };

    const res = await adminFetch("/api/settings", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    setSaving(false);

    if (res.success) {
      setSavedFeedback(
        locale === "ar"
          ? "تم حفظ الإعدادات وتحديث قاعدة البيانات وسجل التدقيق الإداري بنجاح!"
          : "Settings saved to database and logged in audit trail successfully!"
      );
      setTimeout(() => setSavedFeedback(null), 3500);
    }
  };

  const handleAddTelegramUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTgId) return;

    const res = await adminFetch("/api/telegram/users", {
      method: "POST",
      body: JSON.stringify({
        telegramId: newTgId.trim(),
        firstName: newTgName.trim() || undefined,
        role: newTgRole,
      }),
    });

    if (res.success) {
      setNewTgId("");
      setNewTgName("");
      loadTelegramUsers();
      setTestFeedback(
        locale === "ar"
          ? `تم تفويض حساب تيليجرام بنجاح برتبة [${newTgRole}]`
          : `Telegram ID authorized successfully with role [${newTgRole}]`
      );
      setTimeout(() => setTestFeedback(null), 3500);
    }
  };

  const handleRemoveTelegramUser = async (telegramId: string) => {
    const res = await adminFetch(`/api/telegram/users?telegramId=${telegramId}`, {
      method: "DELETE",
    });
    if (res.success) {
      loadTelegramUsers();
      setTestFeedback(locale === "ar" ? "تم إلغاء تفعيل حساب تيليجرام" : "Telegram account deactivated");
      setTimeout(() => setTestFeedback(null), 3500);
    }
  };

  const triggerTestNotification = async (action: string) => {
    setTestSending(true);
    const res = await adminFetch("/api/telegram/test", {
      method: "POST",
      body: JSON.stringify({ action }),
    });
    setTestSending(false);

    if (res.success) {
      setTestFeedback(
        locale === "ar"
          ? `تم إرسال إشعار تيليجرام التجريبي بنجاح! (${action})`
          : `Test notification sent to Telegram successfully! (${action})`
      );
      setTimeout(() => setTestFeedback(null), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-theme-border pb-4">
        <div>
          <h1 className="font-sacred text-2xl font-bold text-theme-text flex items-center gap-2">
            <Settings className="w-6 h-6 text-theme-gold" />
            <span>{t.admin.settings}</span>
          </h1>
          <p className="text-xs text-theme-text-muted mt-1">
            {locale === "ar"
              ? "إعدادات المتجر العامة، وضع الصيانة، تسعير الشحن، وإدارة بوت تيليجرام والمصرح لهم"
              : "General platform configuration, maintenance toggle, delivery fees, and Telegram bot allowlist"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => { loadSettings(); loadTelegramUsers(); }} disabled={loading}>
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 rtl:mr-0 rtl:ml-1.5 ${loading ? "animate-spin" : ""}`} />
            <span>{locale === "ar" ? "تحديث" : "Refresh"}</span>
          </Button>
        </div>
      </div>

      {/* Feedback Alert */}
      {savedFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-3 animate-fade-in text-sm font-bold">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{savedFeedback}</span>
        </div>
      )}

      {testFeedback && (
        <div className="p-4 rounded-2xl bg-theme-gold/10 border border-theme-gold/30 text-theme-gold flex items-center gap-3 animate-fade-in text-sm font-bold">
          <Send className="w-5 h-5 flex-shrink-0" />
          <span>{testFeedback}</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Maintenance Mode Card */}
        <div className="p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="font-sacred text-sm font-bold text-theme-text">
                {locale === "ar" ? "وضع الصيانة الطقسي (Maintenance Mode)" : "Maintenance Mode"}
              </h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isMaintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-theme-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:peer-checked:after:-translate-x-full after:bg-white after:border-theme-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-theme-gold"></div>
            </label>
          </div>

          <p className="text-xs text-theme-text-muted">
            {locale === "ar"
              ? "عند تفعيل وضع الصيانة، يتم إظهار شاشة توقف للمستخدمين مع إمكانية وصول المشرفين فقط."
              : "When active, customers see an exclusive drop maintenance message while admins retain access."}
          </p>

          {isMaintenanceMode && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-theme-text">
                {locale === "ar" ? "رسالة الصيانة المعروضة للزوار:" : "Maintenance Banner Text:"}
              </label>
              <textarea
                value={settings.maintenanceMessage}
                onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 text-xs rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none focus:ring-2 focus:ring-theme-gold"
              />
            </div>
          )}
        </div>

        {/* General Identity */}
        <div className="p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-theme-border pb-3">
            <Globe className="w-4 h-4 text-theme-gold" />
            <h3 className="font-sacred text-sm font-bold text-theme-text">
              {locale === "ar" ? "بيانات وهوية المتجر الرسمية" : "Store Profile & Identity"}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-theme-text-muted mb-1 font-bold">
                {locale === "ar" ? "اسم المتجر بالعربية:" : "Store Name (Arabic):"}
              </label>
              <input
                type="text"
                value={settings.storeNameAr}
                onChange={(e) => setSettings({ ...settings, storeNameAr: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none focus:ring-2 focus:ring-theme-gold"
              />
            </div>

            <div>
              <label className="block text-theme-text-muted mb-1 font-bold">
                {locale === "ar" ? "اسم المتجر بالإنجليزية:" : "Store Name (English):"}
              </label>
              <input
                type="text"
                value={settings.storeNameEn}
                onChange={(e) => setSettings({ ...settings, storeNameEn: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none focus:ring-2 focus:ring-theme-gold"
              />
            </div>

            <div>
              <label className="block text-theme-text-muted mb-1 font-bold">
                {locale === "ar" ? "هاتف خدمة العملاء والدعم:" : "Support Phone:"}
              </label>
              <input
                type="text"
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text font-mono outline-none focus:ring-2 focus:ring-theme-gold"
              />
            </div>

            <div>
              <label className="block text-theme-text-muted mb-1 font-bold">
                {locale === "ar" ? "بريد الدعم الفني:" : "Support Email:"}
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none focus:ring-2 focus:ring-theme-gold"
              />
            </div>
          </div>
        </div>

        {/* Shipping Rates */}
        <div className="p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-theme-border pb-3">
            <Truck className="w-4 h-4 text-theme-gold" />
            <h3 className="font-sacred text-sm font-bold text-theme-text">
              {locale === "ar" ? "إعدادات الشحن الخارجي (Shipping Rates)" : "External Shipping Configuration"}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-theme-text-muted mb-1 font-bold">
                {locale === "ar" ? "تكلفة الشحن الثابتة (ج.م.)" : "Standard Shipping Fee"}
              </label>
              <input
                type="number"
                value={settings.defaultShippingFee}
                onChange={(e) => setSettings({ ...settings, defaultShippingFee: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none focus:ring-2 focus:ring-theme-gold"
              />
            </div>

            <div>
              <label className="block text-theme-text-muted mb-1 font-bold">
                {locale === "ar" ? "الحد الأدنى للشحن المجاني (ج.م.)" : "Free Shipping Threshold"}
              </label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none focus:ring-2 focus:ring-theme-gold"
              />
            </div>

            <div>
              <label className="block text-theme-text-muted mb-1 font-bold">
                {locale === "ar" ? "ضريبة القيمة المضافة (%)" : "VAT Percentage"}
              </label>
              <input
                type="number"
                value={settings.taxPercentage}
                onChange={(e) => setSettings({ ...settings, taxPercentage: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none focus:ring-2 focus:ring-theme-gold"
              />
            </div>
          </div>
        </div>

        {/* Telegram Integration */}
        <div className="p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-theme-border pb-3">
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5 text-theme-gold" />
              <h3 className="font-sacred text-sm font-bold text-theme-text">
                {locale === "ar" ? "إعدادات وتكامل بوت تيليجرام الإداري (Telegram Admin Bot)" : "Telegram Admin Bot Integration"}
              </h3>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
              {locale === "ar" ? "متصل وجاهز" : "Connected & Active"}
            </span>
          </div>

          {/* Quick Test Triggers */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-theme-text">
              {locale === "ar" ? "فحص وتجربة إرسال الإشعارات المباشرة:" : "Test Real-time Notifications:"}
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={testSending}
                onClick={() => triggerTestNotification("test_order")}
                className="rounded-xl text-xs"
              >
                <Package className="w-3.5 h-3.5 mr-1 rtl:mr-0 rtl:ml-1 text-theme-gold" />
                <span>{locale === "ar" ? "تجربة إشعار طلب جديد" : "Test New Order Alert"}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={testSending}
                onClick={() => triggerTestNotification("test_stock")}
                className="rounded-xl text-xs"
              >
                <AlertTriangle className="w-3.5 h-3.5 mr-1 rtl:mr-0 rtl:ml-1 text-amber-500" />
                <span>{locale === "ar" ? "تجربة تنبيه مخزون حرج" : "Test Stock Alert"}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={testSending}
                onClick={() => triggerTestNotification("test_user")}
                className="rounded-xl text-xs"
              >
                <UserCheck className="w-3.5 h-3.5 mr-1 rtl:mr-0 rtl:ml-1 text-blue-500" />
                <span>{locale === "ar" ? "تجربة تسجيل مستخدم جديد" : "Test New User Alert"}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={testSending}
                onClick={() => triggerTestNotification("test_owner")}
                className="rounded-xl text-xs"
              >
                <Shield className="w-3.5 h-3.5 mr-1 rtl:mr-0 rtl:ml-1 text-purple-500" />
                <span>{locale === "ar" ? "تجربة إشعار المالك الأمني" : "Test Owner Alert"}</span>
              </Button>
            </div>
          </div>

          {/* Authorized Telegram Users (Allowlist & RBAC) */}
          <div className="space-y-3 pt-3 border-t border-theme-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-theme-gold" />
                <h4 className="text-xs font-bold text-theme-text">
                  {locale === "ar" ? "قائمة معرّفات تيليجرام المصرح لها (Allowlist & Permissions):" : "Authorized Telegram IDs (RBAC):"}
                </h4>
              </div>
              <span className="text-[11px] text-theme-text-muted">
                {tgUsers.length} {locale === "ar" ? "مستخدمين مصرح لهم" : "authorized users"}
              </span>
            </div>

            {/* Add User Form */}
            <div className="p-3 rounded-2xl bg-theme-surface-elevated border border-theme-border space-y-2">
              <div className="text-[11px] font-bold text-theme-text-muted">
                {locale === "ar" ? "إضافة معرّف تيليجرام جديد للقائمة المصرح بها:" : "Authorize New Telegram ID:"}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Telegram ID (e.g. 123456789)"
                  value={newTgId}
                  onChange={(e) => setNewTgId(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-theme-border bg-theme-surface text-theme-text font-mono text-xs outline-none focus:ring-1 focus:ring-theme-gold"
                />
                <input
                  type="text"
                  placeholder={locale === "ar" ? "اسم المسؤول / الجهة" : "Staff Name"}
                  value={newTgName}
                  onChange={(e) => setNewTgName(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-theme-border bg-theme-surface text-theme-text text-xs outline-none focus:ring-1 focus:ring-theme-gold"
                />
                <select
                  value={newTgRole}
                  onChange={(e: any) => setNewTgRole(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-theme-border bg-theme-surface text-theme-text text-xs outline-none focus:ring-1 focus:ring-theme-gold"
                >
                  <option value="VIEWER">{locale === "ar" ? "VIEWER (مشاهد فقط)" : "VIEWER (Read Only)"}</option>
                  <option value="ADMIN">{locale === "ar" ? "ADMIN (مشرف كامل)" : "ADMIN (Full Control)"}</option>
                </select>
                <Button
                  variant="gold"
                  size="sm"
                  type="button"
                  onClick={handleAddTelegramUser}
                  disabled={!newTgId}
                  className="rounded-xl text-xs py-1.5"
                >
                  <Plus className="w-3.5 h-3.5 mr-1 rtl:mr-0 rtl:ml-1" />
                  <span>{locale === "ar" ? "إضافة وتفويض" : "Authorize"}</span>
                </Button>
              </div>
            </div>

            {/* Allowlist Table */}
            <div className="overflow-x-auto rounded-2xl border border-theme-border">
              <table className="w-full text-left rtl:text-right text-xs">
                <thead className="bg-theme-surface-elevated text-theme-text-muted border-b border-theme-border font-bold">
                  <tr>
                    <th className="p-3">{locale === "ar" ? "معرّف تيليجرام" : "Telegram ID"}</th>
                    <th className="p-3">{locale === "ar" ? "الاسم" : "Name"}</th>
                    <th className="p-3">{locale === "ar" ? "الرتبة والصلاحية" : "Role"}</th>
                    <th className="p-3">{locale === "ar" ? "الحالة" : "Status"}</th>
                    <th className="p-3 text-center">{locale === "ar" ? "إجراء" : "Action"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-border">
                  {tgUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-theme-text-muted">
                        {locale === "ar" ? "لا توجد معرّفات مضافة حالياً" : "No authorized users"}
                      </td>
                    </tr>
                  ) : (
                    tgUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-theme-surface-elevated/40">
                        <td className="p-3 font-mono font-bold text-theme-text">{u.telegramId}</td>
                        <td className="p-3 text-theme-text">{u.firstName || u.username || "—"}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.role === "OWNER"
                                ? "bg-purple-500/10 text-purple-500 border border-purple-500/20"
                                : u.role === "ADMIN"
                                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold ${u.isActive ? "text-emerald-500" : "text-rose-500"}`}>
                            {u.isActive ? (locale === "ar" ? "نشط" : "Active") : (locale === "ar" ? "معطل" : "Disabled")}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {u.role !== "OWNER" && (
                            <button
                              type="button"
                              onClick={() => handleRemoveTelegramUser(u.telegramId)}
                              className="p-1 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-colors"
                              title={locale === "ar" ? "إلغاء التفعيل" : "Deactivate"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-theme-border">
          <Button variant="gold" size="md" type="submit" disabled={saving} className="rounded-xl px-8 shadow-sacred">
            <Save className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
            <span>
              {saving
                ? locale === "ar" ? "جار الحفظ في قاعدة البيانات..." : "Saving..."
                : locale === "ar" ? "حفظ كافة الإعدادات بقاعدة البيانات" : "Save All Settings"}
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
}
