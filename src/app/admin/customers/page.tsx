"use client";

import React, { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/config/i18n";
import { Customer } from "@/types/customer";
import { Button } from "@/components/ui/Button";
import { adminFetch } from "@/lib/adminApi";
import {
  Users,
  Search,
  Shield,
  FileSpreadsheet,
  Mail,
  Phone,
  Church,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  UserCheck,
} from "lucide-react";

export default function AdminCustomersPage() {
  const { locale } = useAppStore();
  const t = translations[locale];

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const loadCustomers = async () => {
    setLoading(true);
    const res = await adminFetch<Customer[]>("/api/customers");
    if (res.success && res.data) {
      setCustomers(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const showFeedback = (message: string, type: "success" | "error" = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleToggleRole = async (customer: Customer) => {
    const newRole = customer.role === "ADMIN" ? "USER" : "ADMIN";
    if (
      !confirm(
        locale === "ar"
          ? `هل أنت متأكد من تغيير صلاحية الحساب (${customer.email}) إلى [${newRole}]؟`
          : `Change role for (${customer.email}) to [${newRole}]?`
      )
    ) {
      return;
    }

    setActionLoading(true);
    const res = await adminFetch<Customer>(`/api/customers/${customer.id}`, {
      method: "PATCH",
      body: JSON.stringify({ role: newRole }),
    });
    setActionLoading(false);

    if (res.success && res.data) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === customer.id ? { ...c, role: res.data!.role } : c))
      );
      showFeedback(
        locale === "ar"
          ? `تم تحديث صلاحية الحساب إلى [${newRole}] بنجاح في قاعدة البيانات`
          : `Account permission updated to [${newRole}] in database`
      );
    } else {
      showFeedback(res.error || "Failed to update role", "error");
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.parishName && c.parishName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-theme-border pb-4">
        <div>
          <h1 className="font-sacred text-2xl font-bold text-theme-text flex items-center gap-2">
            <Users className="w-6 h-6 text-theme-gold" />
            <span>{t.admin.customers} & {locale === "ar" ? "صلاحيات المستخدمين" : "User Permissions"}</span>
          </h1>
          <p className="text-xs text-theme-text-muted mt-1">
            {locale === "ar"
              ? "دليل العملاء المسجلين، التحكم في صلاحيات الإدارة والأدوار، وسجل الإنفاق المالي في قاعدة البيانات"
              : "Registered user accounts, server-side role enforcement (USER/ADMIN), and lifetime spend"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadCustomers} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1.5 rtl:mr-0 rtl:ml-1.5 ${loading ? "animate-spin" : ""}`} />
            <span>{locale === "ar" ? "تحديث" : "Refresh"}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() => showFeedback(locale === "ar" ? "تم تصدير العملاء (Customers.xlsx)" : "Exported Customers.xlsx")}
          >
            <FileSpreadsheet className="w-4 h-4 mr-1.5 rtl:mr-0 rtl:ml-1.5 text-emerald-600" />
            <span>{locale === "ar" ? "تصدير العملاء" : "Export Customers"}</span>
          </Button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in ${
            feedback.type === "success"
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
              : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-800"
          }`}
        >
          {feedback.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative w-full sm:w-80">
        <input
          type="text"
          placeholder={locale === "ar" ? "ابحث بالاسم أو البريد أو اسم الكنيسة..." : "Search name, email, or parish..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs bg-theme-surface border border-theme-border rounded-xl text-theme-text outline-none focus:ring-2 focus:ring-theme-gold"
        />
        <Search className="w-4 h-4 text-theme-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Customers Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-theme-surface-elevated animate-pulse border border-theme-border" />
          ))}
        </div>
      ) : customers.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-theme-surface border border-theme-border">
          <p className="text-sm text-theme-text-muted">
            {locale === "ar" ? "لا يوجد عملاء مسجلين بقاعدة البيانات." : "No registered customers found in database."}
          </p>
        </div>
      ) : (
        <div className="bg-theme-surface rounded-2xl border border-theme-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="bg-theme-surface-elevated/60 text-theme-text-muted border-b border-theme-border">
                  <th className="py-3 px-4 text-start font-semibold">{locale === "ar" ? "العميل" : "Customer"}</th>
                  <th className="py-3 px-4 text-start font-semibold">{locale === "ar" ? "الكنيسة / الإيبارشية" : "Parish"}</th>
                  <th className="py-3 px-4 text-start font-semibold">{locale === "ar" ? "الطلبات والإنفاق" : "Orders & Spend"}</th>
                  <th className="py-3 px-4 text-start font-semibold">{locale === "ar" ? "الدور والصلاحية" : "Role & Permissions"}</th>
                  <th className="py-3 px-4 text-end font-semibold">{locale === "ar" ? "إجراءات الصلاحية" : "Role Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border/40">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-theme-surface-elevated/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-theme-surface-elevated border border-theme-gold/30 flex items-center justify-center font-bold text-theme-gold">
                          {c.fullName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-theme-text block">{c.fullName}</span>
                          <span className="text-[10px] text-theme-text-muted block">{c.email}</span>
                          <span className="text-[10px] text-theme-text-muted font-mono">{c.phone}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {c.parishName ? (
                        <div className="flex items-center gap-1.5 text-theme-text-muted">
                          <Church className="w-3.5 h-3.5 text-theme-gold flex-shrink-0" />
                          <span>{c.parishName}</span>
                        </div>
                      ) : (
                        <span className="text-theme-text-muted">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-theme-text block">
                        {c.totalOrdersCount} {locale === "ar" ? "طلبات" : "orders"}
                      </span>
                      <span className="text-[10px] text-theme-gold block">
                        {c.totalSpent.toLocaleString()} {t.common.priceEGP}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          c.role === "ADMIN"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300 dark:border-purple-800"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300 dark:border-blue-800"
                        }`}
                      >
                        <Shield className="w-3 h-3" />
                        <span>{c.role}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 text-end">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={actionLoading}
                        onClick={() => handleToggleRole(c)}
                        className="text-[11px] rounded-lg py-1 px-2"
                      >
                        <UserCheck className="w-3.5 h-3.5 mr-1 rtl:mr-0 rtl:ml-1" />
                        <span>
                          {c.role === "ADMIN"
                            ? locale === "ar" ? "تحويل لمستخدم عادي" : "Demote to USER"
                            : locale === "ar" ? "ترقية إلى مدير (ADMIN)" : "Promote to ADMIN"}
                        </span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
