"use client";

import React, { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/config/i18n";
import { db } from "@/services";
import { Coupon } from "@/types/coupon";
import { MOCK_COUPONS } from "@/services/mock/mockData";
import { Button } from "@/components/ui/Button";
import {
  Tag,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Calendar,
  X,
  Percent,
} from "lucide-react";

export default function AdminDiscountsPage() {
  const { locale } = useAppStore();
  const t = translations[locale];

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "percentage" as "percentage" | "fixed_amount",
    discountValue: 10,
    minOrderAmount: 500,
    descAr: "",
    descEn: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await db.coupons.getCoupons();
        if (data && data.length > 0) {
          setCoupons(data);
        } else {
          setCoupons(MOCK_COUPONS);
        }
      } catch {
        setCoupons(MOCK_COUPONS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleToggleStatus = async (id: string) => {
    const updated = await db.coupons.toggleCouponStatus(id);
    setCoupons((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  const handleDelete = async (id: string) => {
    if (confirm(locale === "ar" ? "هل أنت متأكد من حذف هذا الكوبون؟" : "Delete coupon?")) {
      await db.coupons.deleteCoupon(id);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await db.coupons.createCoupon({
      code: newCoupon.code.toUpperCase().trim(),
      discountType: newCoupon.discountType,
      discountValue: Number(newCoupon.discountValue),
      minOrderAmount: Number(newCoupon.minOrderAmount),
      startDate: new Date().toISOString(),
      endDate: "2027-12-31T23:59:59Z",
      isActive: true,
      description: {
        ar: newCoupon.descAr || "خصم ترويجي على إصدارات FG",
        en: newCoupon.descEn || "FG Promotional discount",
      },
    });

    setCoupons([created, ...coupons]);
    setIsModalOpen(false);
    setNewCoupon({
      code: "",
      discountType: "percentage",
      discountValue: 10,
      minOrderAmount: 500,
      descAr: "",
      descEn: "",
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-theme-border pb-4">
        <div>
          <h1 className="font-sacred text-2xl font-bold text-theme-text flex items-center gap-2">
            <Tag className="w-6 h-6 text-theme-gold" />
            <span>{t.admin.discounts}</span>
          </h1>
          <p className="text-xs text-theme-text-muted mt-1">
            {locale === "ar"
              ? "إنشاء وإدارة كوبونات الخصم، العروض الترويجية، وخصومات دروبات الستريت وير"
              : "Manage promotional vouchers, drop discounts, and VIP promo codes"}
          </p>
        </div>

        <Button variant="gold" size="sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
          <span>{locale === "ar" ? "إنشاء كود خصم جديد" : "Create Promo Code"}</span>
        </Button>
      </div>

      {/* Coupons Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-theme-surface-elevated animate-pulse border border-theme-border" />
          ))}
        </div>
      ) : (
        <div className="bg-theme-surface rounded-2xl border border-theme-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="bg-theme-surface-elevated/60 text-theme-text-muted border-b border-theme-border">
                  <th className="py-3 px-4 text-start font-semibold">{locale === "ar" ? "الكود والوصف" : "Code & Details"}</th>
                  <th className="py-3 px-4 text-start font-semibold">{locale === "ar" ? "قيمة الخصم" : "Discount Value"}</th>
                  <th className="py-3 px-4 text-start font-semibold">{locale === "ar" ? "الحد الأدنى للطلب" : "Min Spend"}</th>
                  <th className="py-3 px-4 text-start font-semibold">{locale === "ar" ? "مرات الاستخدام" : "Used Times"}</th>
                  <th className="py-3 px-4 text-start font-semibold">{locale === "ar" ? "الحالة" : "Status"}</th>
                  <th className="py-3 px-4 text-end font-semibold">{locale === "ar" ? "إجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border/40">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-theme-surface-elevated/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-extrabold text-sm text-theme-primary block tracking-wide">
                        {c.code}
                      </span>
                      <span className="text-[11px] text-theme-text-muted block">
                        {c.description[locale]}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-theme-gold">
                      {c.discountType === "percentage" ? `${c.discountValue}%` : `${c.discountValue} ${t.common.priceEGP}`}
                    </td>

                    <td className="py-3.5 px-4 text-theme-text-muted">
                      {c.minOrderAmount ? `${c.minOrderAmount} ${t.common.priceEGP}` : "بلا حد أدنى"}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-theme-text">
                      {c.usageCount} {locale === "ar" ? "مرة" : "times"}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(c.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                          c.isActive
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {c.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{c.isActive ? (locale === "ar" ? "نشط" : "Active") : (locale === "ar" ? "معطل" : "Inactive")}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-end">
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-theme-text-muted hover:text-red-500 rounded-lg transition-colors"
                        title={locale === "ar" ? "حذف" : "Delete"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-theme-surface text-theme-text rounded-3xl max-w-md w-full p-6 shadow-sacred-lg border border-theme-border space-y-4">
            <div className="flex items-center justify-between border-b border-theme-border pb-3">
              <h3 className="font-sacred text-base font-bold flex items-center gap-2">
                <Tag className="w-4 h-4 text-theme-gold" />
                <span>{locale === "ar" ? "إضافة كود خصم جديد" : "Create New Coupon"}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-theme-text-muted hover:bg-theme-surface-elevated rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block text-theme-text-muted mb-1 font-medium">الكود (Code) *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: EASTER2026"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text uppercase font-mono outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-theme-text-muted mb-1 font-medium">نوع الخصم</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none"
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed_amount">مبلغ ثابت (ج.م)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-theme-text-muted mb-1 font-medium">القيمة *</label>
                  <input
                    type="number"
                    required
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-theme-text-muted mb-1 font-medium">الحد الأدنى للطلب (ج.م)</label>
                <input
                  type="number"
                  value={newCoupon.minOrderAmount}
                  onChange={(e) => setNewCoupon({ ...newCoupon, minOrderAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-theme-text-muted mb-1 font-medium">الوصف بالعربية</label>
                <input
                  type="text"
                  placeholder="مثال: خصم خاص بمناسبة عيد القيامة"
                  value={newCoupon.descAr}
                  onChange={(e) => setNewCoupon({ ...newCoupon, descAr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-theme-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  {locale === "ar" ? "إلغاء" : "Cancel"}
                </Button>
                <Button type="submit" variant="gold" size="sm">
                  {locale === "ar" ? "حفظ الكوبون" : "Save Coupon"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
