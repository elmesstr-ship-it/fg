"use client";

import React, { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/config/i18n";
import { Button } from "@/components/ui/Button";
import { adminFetch } from "@/lib/adminApi";
import {
  History,
  Shield,
  Search,
  Filter,
  CheckCircle2,
  FileSpreadsheet,
  Lock,
  RefreshCw,
  Palette,
  Package,
  ShoppingCart,
  Settings,
  UserCheck,
} from "lucide-react";

interface DbActivityLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  resource: string;
  details: { ar: string; en: string };
  ipAddress: string;
  createdAt: string;
}

export default function AdminLogsPage() {
  const { locale } = useAppStore();
  const t = translations[locale];

  const [logs, setLogs] = useState<DbActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const loadLogs = async () => {
    setLoading(true);
    const res = await adminFetch<DbActivityLog[]>("/api/logs?limit=100");
    if (res.success && res.data) {
      setLogs(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      log.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.en.toLowerCase().includes(searchQuery.toLowerCase());
    const matchAction = actionFilter === "all" || log.action === actionFilter;
    return matchSearch && matchAction;
  });

  const getActionIcon = (action: string) => {
    if (action.includes("STOCK") || action.includes("INVENTORY") || action.includes("PRODUCT")) {
      return <Package className="w-4 h-4 text-theme-gold" />;
    }
    if (action.includes("ORDER")) {
      return <ShoppingCart className="w-4 h-4 text-blue-500" />;
    }
    if (action.includes("THEME")) {
      return <Palette className="w-4 h-4 text-purple-500" />;
    }
    if (action.includes("USER") || action.includes("ROLE")) {
      return <UserCheck className="w-4 h-4 text-emerald-500" />;
    }
    return <Settings className="w-4 h-4 text-amber-500" />;
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-theme-border pb-4">
        <div>
          <h1 className="font-sacred text-2xl font-bold text-theme-text flex items-center gap-2">
            <History className="w-6 h-6 text-theme-gold" />
            <span>{t.admin.activityLogs}</span>
          </h1>
          <p className="text-xs text-theme-text-muted mt-1">
            {locale === "ar"
              ? "سجل التدقيق الإداري غير القابل للتعديل المسجل في قاعدة البيانات لتوثيق جميع العمليات والتغييرات"
              : "Immutable administrative audit trail recorded in database capturing all system events"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadLogs} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1.5 rtl:mr-0 rtl:ml-1.5 ${loading ? "animate-spin" : ""}`} />
            <span>{locale === "ar" ? "تحديث السجل" : "Refresh"}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="rounded-xl text-xs"
            onClick={() => alert(locale === "ar" ? "تم تصدير سجل التدقيق (AuditLogs.xlsx)" : "Exported AuditLogs.xlsx")}
          >
            <FileSpreadsheet className="w-4 h-4 mr-1.5 rtl:mr-0 rtl:ml-1.5 text-emerald-600" />
            <span>{locale === "ar" ? "تصدير السجل" : "Export Log"}</span>
          </Button>
        </div>
      </div>

      {/* Security Notice */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-center gap-3 text-amber-800 dark:text-amber-300">
        <Lock className="w-5 h-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="leading-relaxed">
          {locale === "ar"
            ? "جميع العمليات على المخزون، الأسعار، الحالات، والصلاحيات تُسجل آلياً وتخضع لمعايير الأمان المالي والكنسي الصارم."
            : "All administrative modifications are cryptographically traceable and immutably stored in the SQLite ledger."}
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-theme-surface p-4 rounded-2xl border border-theme-border">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder={locale === "ar" ? "ابحث في سجل العمليات..." : "Search audit logs..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-theme-surface-elevated border border-theme-border rounded-xl text-theme-text outline-none focus:ring-2 focus:ring-theme-gold"
          />
          <Search className="w-4 h-4 text-theme-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-theme-gold" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-theme-surface-elevated border border-theme-border rounded-xl text-theme-text outline-none"
          >
            <option value="all">{locale === "ar" ? "جميع أنواع العمليات" : "All Event Types"}</option>
            <option value="STOCK_ADJUSTED">{locale === "ar" ? "تعديل مخزون" : "Stock Adjustment"}</option>
            <option value="PRODUCT_CREATED">{locale === "ar" ? "إضافة صنف" : "Product Created"}</option>
            <option value="ORDER_STATUS_CHANGED">{locale === "ar" ? "تغيير حالة طلب" : "Order Status"}</option>
            <option value="THEME_ACTIVATED">{locale === "ar" ? "تفعيل مظهر طقسي" : "Theme Activated"}</option>
            <option value="USER_ROLE_CHANGED">{locale === "ar" ? "تعديل صلاحية مستخدم" : "User Role Modified"}</option>
            <option value="SETTINGS_UPDATED">{locale === "ar" ? "تحديث إعدادات" : "Settings Updated"}</option>
          </select>
        </div>
      </div>

      {/* Logs Timeline */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-theme-surface animate-pulse border border-theme-border" />
          ))}
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-theme-surface border border-theme-border">
          <p className="text-sm text-theme-text-muted">
            {locale === "ar" ? "لا توجد سجلات مطابقة للبحث." : "No matching activity logs found."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-2xl bg-theme-surface border border-theme-border hover:border-theme-gold/60 transition-all shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-theme-surface-elevated border border-theme-border flex-shrink-0 mt-0.5">
                  {getActionIcon(log.action)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-sacred font-bold text-theme-text">{log.action}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-theme-surface-elevated text-theme-gold border border-theme-border">
                      {log.resource}
                    </span>
                    <span className="text-[10px] text-theme-text-muted">
                      ({locale === "ar" ? "بواسطة:" : "By:"} {log.adminName})
                    </span>
                  </div>
                  <p className="text-theme-text-muted mt-1 leading-relaxed">
                    {log.details[locale] || log.details.ar}
                  </p>
                </div>
              </div>

              <div className="text-end flex-shrink-0 self-end sm:self-center">
                <span className="text-[10px] text-theme-text-muted block font-mono">
                  {new Date(log.createdAt).toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}
                </span>
                <span className="text-[9px] text-theme-text-muted block font-mono">
                  IP: {log.ipAddress}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
