"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { SEASONAL_THEMES } from "@/config/themes";
import { SeasonalThemeId } from "@/types/theme";
import { adminFetch } from "@/lib/adminApi";
import { AnalyticsSummary } from "@/types/analytics";
import { Order } from "@/types/order";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  AlertTriangle,
  Palette,
  FileSpreadsheet,
  FileText,
  Clock,
  ArrowUpRight,
  Sparkles,
  Layers,
  Activity,
  CheckCircle2,
} from "lucide-react";

export default function ModernAdminDashboardPage() {
  const { seasonalTheme } = useAppStore();
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    const [analyticsRes, ordersRes] = await Promise.all([
      adminFetch<AnalyticsSummary>("/api/analytics"),
      adminFetch<Order[]>("/api/orders"),
    ]);

    if (analyticsRes.success && analyticsRes.data) {
      setAnalytics(analyticsRes.data);
    }
    if (ordersRes.success && ordersRes.data) {
      setRecentOrders(ordersRes.data.slice(0, 6));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const totalRevenue = analytics?.totalRevenue || 0;
  const totalOrders = analytics?.totalOrders || 0;
  const lowStockCount = analytics?.lowStockItemsCount || 0;

  const kpis = [
    {
      title: "إجمالي إيرادات المبيعات",
      value: `${totalRevenue.toLocaleString("ar-EG")} ج.م`,
      change: "+18.4% نمو شهري",
      subtext: "محصلة من طلبات الدفع والتحويل",
      icon: TrendingUp,
      accent: "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30",
    },
    {
      title: "إجمالي الطلبات المسجلة",
      value: totalOrders.toString(),
      change: "مزامنة فورية بقاعدة البيانات",
      subtext: "طلبات مؤكدة وقيد التجهيز",
      icon: ShoppingCart,
      accent: "from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/30",
    },
    {
      title: "تنبيهات المخزون الحرج",
      value: `${lowStockCount} قطع`,
      change: lowStockCount === 0 ? "المخزون مستقر" : "تتطلب إعادة توريد ديري",
      subtext: "أصناف بلغت الحد الأدنى (أقل من 3)",
      icon: AlertTriangle,
      accent: lowStockCount === 0
        ? "from-stone-500/20 to-stone-500/5 text-stone-400 border-stone-500/30"
        : "from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30",
    },
    {
      title: "المظهر والمناسبة الكنسية",
      value: SEASONAL_THEMES[seasonalTheme]?.name.ar || "المظهر الملكي المعتمد",
      change: "تطبيق فوري لجميع الزوار",
      subtext: "مجدول ومفعّل عبر محرك المظاهر",
      icon: Palette,
      accent: "from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/30",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* ---------------------------------------------------- */}
      {/* 1. HERO EXECUTIVE SUMMARY BAR                        */}
      {/* ---------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#1A1E29] to-[#141720] border border-[#262B3A] shadow-xl">
        <div className="space-y-1 text-right">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-display">
              لوحة التحكم والمؤشرات التنفيذية
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif">
            مرحباً بك في مركز إدارة سانكتا ماريا
          </h1>
          <p className="text-xs text-stone-400">
            مراقبة لحظية لحركة المبيعات، الطلبات الواردة، والمخزون الكنسي الليتورجي
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="px-4 py-2.5 rounded-xl bg-[#781D22] hover:bg-[#5A1418] text-white text-xs font-bold shadow-lg shadow-red-950/40 border border-amber-400/30 flex items-center gap-2 transition-all"
          >
            <ShoppingCart className="w-4 h-4 text-amber-300" />
            <span>عرض الطلبات الجديدة</span>
          </Link>
          <Link
            href="/admin/products"
            className="px-4 py-2.5 rounded-xl bg-[#202534] hover:bg-[#2B3246] text-stone-200 text-xs font-bold border border-[#32394E] flex items-center gap-2 transition-all"
          >
            <Package className="w-4 h-4 text-amber-400" />
            <span>إضافة تحفة جديدة</span>
          </Link>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. STATS & KPIS CARDS GRID                           */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#161922] border border-[#232734] hover:border-[#384055] transition-all relative overflow-hidden group shadow-lg"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-stone-400">{kpi.title}</span>
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.accent} border flex items-center justify-center`}
              >
                <kpi.icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4">
              <span className="text-2xl font-extrabold text-white font-mono tracking-tight">
                {kpi.value}
              </span>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[11px] font-bold text-emerald-400">{kpi.change}</span>
                <span className="text-[10px] text-stone-500">• {kpi.subtext}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. RECENT ORDERS & REAL-TIME ACTIVITY                */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Orders Table (Col-8) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-[#161922] border border-[#232734] shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-[#232734] pb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white">أحدث طلبات الشراء الواردة</h2>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>عرض كافة الطلبات</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 rounded-2xl bg-[#1F2330] animate-pulse" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-xs">
              لا توجد طلبات مسجلة في الوقت الراهن
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="text-stone-400 border-b border-[#232734]">
                    <th className="pb-3 font-semibold">رقم الطلب</th>
                    <th className="pb-3 font-semibold">العميل / الرعية</th>
                    <th className="pb-3 font-semibold">المحافظة</th>
                    <th className="pb-3 font-semibold">الإجمالي</th>
                    <th className="pb-3 font-semibold">الحالة</th>
                    <th className="pb-3 font-semibold text-left">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#232734]/60">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#1E222D]/60 transition-colors">
                      <td className="py-3.5 font-bold font-mono text-amber-300">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3.5 text-stone-200 font-medium">
                        {ord.customerName}
                      </td>
                      <td className="py-3.5 text-stone-400">
                        {ord.shippingAddress?.governorate || "القاهرة"}
                      </td>
                      <td className="py-3.5 font-bold text-white font-mono">
                        {ord.total.toLocaleString("ar-EG")} ج.م
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            ord.orderStatus === "delivered"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                              : ord.orderStatus === "shipped"
                              ? "bg-blue-950 text-blue-300 border border-blue-800"
                              : ord.orderStatus === "cancelled"
                              ? "bg-red-950 text-red-300 border border-red-800"
                              : "bg-amber-950 text-amber-300 border border-amber-800"
                          }`}
                        >
                          {ord.orderStatus === "pending"
                            ? "قيد المراجعة"
                            : ord.orderStatus === "confirmed"
                            ? "مؤكد"
                            : ord.orderStatus === "processing"
                            ? "تجهيز"
                            : ord.orderStatus === "shipped"
                            ? "مشحون"
                            : ord.orderStatus === "delivered"
                            ? "مسلّم"
                            : ord.orderStatus === "cancelled"
                            ? "ملغي"
                            : ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3.5 text-left text-stone-500 font-mono text-[11px]">
                        {new Date(ord.createdAt).toLocaleDateString("ar-EG")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Management Shortcuts (Col-4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-[#161922] border border-[#232734] shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>إجراءات إدارية سريعة</span>
            </h3>

            <div className="space-y-2.5">
              <Link
                href="/admin/themes"
                className="flex items-center justify-between p-3 rounded-2xl bg-[#1E222D] hover:bg-[#262B3A] border border-[#2B3142] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Palette className="w-4 h-4 text-purple-400" />
                  <div>
                    <span className="text-xs font-bold text-stone-200 block">جدولة مظهر كنسي</span>
                    <span className="text-[10px] text-stone-500">عيد الميلاد، القيامة، أو مناسبة خاصة</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400" />
              </Link>

              <Link
                href="/admin/products"
                className="flex items-center justify-between p-3 rounded-2xl bg-[#1E222D] hover:bg-[#262B3A] border border-[#2B3142] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-blue-400" />
                  <div>
                    <span className="text-xs font-bold text-stone-200 block">تحديث أسعار ومخزون</span>
                    <span className="text-[10px] text-stone-500">تعديل كميات الأيقونات والبخور</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400" />
              </Link>

              <Link
                href="/admin/discounts"
                className="flex items-center justify-between p-3 rounded-2xl bg-[#1E222D] hover:bg-[#262B3A] border border-[#2B3142] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="text-xs font-bold text-stone-200 block">إنشاء كوبون خصم</span>
                    <span className="text-[10px] text-stone-500">حملات الأعياد والمناسبات الكنسية</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
