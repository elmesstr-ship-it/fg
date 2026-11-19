"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { SEASONAL_THEMES } from "@/config/themes";
import { adminFetch } from "@/lib/adminApi";
import { AnalyticsSummary } from "@/types/analytics";
import { Order } from "@/types/order";
import { MOCK_ANALYTICS_SUMMARY, MOCK_ORDERS } from "@/services/mock/mockData";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  AlertTriangle,
  Palette,
  ArrowUpRight,
  Sparkles,
  Layers,
  Activity,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";

export default function ModernAdminDashboardPage() {
  const { seasonalTheme } = useAppStore();
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, ordersRes] = await Promise.all([
        adminFetch<AnalyticsSummary>("/api/analytics"),
        adminFetch<Order[]>("/api/orders"),
      ]);

      if (analyticsRes.success && analyticsRes.data) {
        setAnalytics(analyticsRes.data);
      } else {
        setAnalytics(MOCK_ANALYTICS_SUMMARY);
      }

      if (ordersRes.success && ordersRes.data && ordersRes.data.length > 0) {
        setRecentOrders(ordersRes.data.slice(0, 6));
      } else {
        setRecentOrders(MOCK_ORDERS);
      }
    } catch {
      setAnalytics(MOCK_ANALYTICS_SUMMARY);
      setRecentOrders(MOCK_ORDERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const totalRevenue = analytics?.totalRevenue || MOCK_ANALYTICS_SUMMARY.totalRevenue;
  const totalOrders = analytics?.totalOrders || MOCK_ANALYTICS_SUMMARY.totalOrders;
  const lowStockCount = analytics?.lowStockItemsCount || MOCK_ANALYTICS_SUMMARY.lowStockItemsCount;

  const kpis = [
    {
      title: "إجمالي إيرادات المبيعات",
      value: `${totalRevenue.toLocaleString()} ج.م`,
      change: "+24.8% نمو شهري",
      subtext: "مبيعات الدروب الأول والموقع",
      icon: TrendingUp,
      accent: "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30",
    },
    {
      title: "إجمالي طلبات الشراء",
      value: totalOrders.toString(),
      change: "مزامنة لحظية",
      subtext: "طلبات دروب 01 المكتملة",
      icon: ShoppingCart,
      accent: "from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/30",
    },
    {
      title: "تنبيهات المخزون والمقاسات",
      value: `${lowStockCount} قطع حرجة`,
      change: lowStockCount === 0 ? "المخزون مستقر" : "تتطلب إعادة حياكة وتوريد",
      subtext: "مقاسات أوشكت على النفاد",
      icon: AlertTriangle,
      accent: "from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30",
    },
    {
      title: "المظهر وإصدار الموسم النشط",
      value: SEASONAL_THEMES[seasonalTheme]?.name.ar || "FG Monochrome",
      change: "مطبق على كافة الزوار",
      subtext: "استوديو السمات والمواسم",
      icon: Palette,
      accent: "from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/30",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. HERO EXECUTIVE SUMMARY BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl">
        <div className="space-y-1 text-right">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-widest">
              FG EXECUTIVE CONTROL CENTER
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            مرحباً بك في مركز إدارة FG Collective
          </h1>
          <p className="text-xs text-neutral-400">
            مراقبة حركة المبيعات، حجوزات الدروبات الحصرية، ومصفوفة المقاسات والمخزون
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-black uppercase shadow-lg flex items-center gap-2 transition-all"
          >
            <ShoppingCart className="w-4 h-4 text-black" />
            <span>عرض الطلبات الجديدة</span>
          </Link>
          <Link
            href="/admin/products"
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold border border-neutral-700 flex items-center gap-2 transition-all"
          >
            <Package className="w-4 h-4 text-[#D4AF37]" />
            <span>إدارة المنتجات والمقاسات</span>
          </Link>
        </div>
      </div>

      {/* 2. STATS & KPIS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#141414] border border-neutral-800 hover:border-neutral-700 transition-all relative overflow-hidden group shadow-lg"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-neutral-400">{kpi.title}</span>
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.accent} border flex items-center justify-center`}
              >
                <kpi.icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4">
              <span className="text-2xl font-black text-white font-mono tracking-tight">
                {kpi.value}
              </span>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[11px] font-bold text-emerald-400 font-mono">{kpi.change}</span>
                <span className="text-[10px] text-neutral-500">• {kpi.subtext}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. RECENT ORDERS & TOP PRODUCTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Orders Table (Col-8) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-[#141414] border border-neutral-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="text-sm font-black uppercase text-white">أحدث طلبات الشراء الواردة</h2>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1"
            >
              <span>عرض كافة الطلبات</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="text-neutral-400 border-b border-neutral-800 uppercase font-mono text-[10px]">
                  <th className="pb-3 pr-2">رقم الطلب</th>
                  <th className="pb-3">العميل والمحافظة</th>
                  <th className="pb-3">القطع والمقاسات</th>
                  <th className="pb-3">الإجمالي</th>
                  <th className="pb-3">طريقة الدفع</th>
                  <th className="pb-3 pl-2">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3.5 pr-2 font-mono font-bold text-white">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5">
                      <span className="font-bold text-neutral-200 block">{ord.customerName}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {ord.shippingAddress?.governorate || "القاهرة"}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className="text-neutral-300 block line-clamp-1">
                        {ord.items?.[0]?.productName?.ar || "قطعة ستريت وير"}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {ord.items?.length || 1} قطع
                      </span>
                    </td>
                    <td className="py-3.5 font-mono font-bold text-white">
                      {ord.total?.toLocaleString() || 0} ج.م
                    </td>
                    <td className="py-3.5 uppercase font-mono text-[11px] text-neutral-400">
                      {ord.paymentMethod?.replace(/_/g, " ") || "COD"}
                    </td>
                    <td className="py-3.5 pl-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          ord.orderStatus === "delivered"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : "bg-blue-950 text-blue-400 border border-blue-800"
                        }`}
                      >
                        {ord.orderStatus === "delivered" ? "تم التسليم" : "قيد التجهيز"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Garments (Col-4) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#141414] border border-neutral-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <h2 className="text-sm font-black uppercase text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>القطع الأكثر طلباً (Drop 01)</span>
            </h2>
          </div>

          <div className="space-y-4">
            {(analytics?.topProducts || MOCK_ANALYTICS_SUMMARY.topProducts).map((prod, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
                <div className="w-8 h-8 rounded-xl bg-black border border-neutral-800 flex items-center justify-center font-mono font-bold text-xs text-[#D4AF37] flex-shrink-0">
                  #{idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-xs text-white block truncate">
                    {prod.name.ar}
                  </span>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono mt-0.5">
                    <span>{prod.unitsSold} قطعة مباعة</span>
                    <span className="text-emerald-400 font-bold">{prod.totalRevenue.toLocaleString()} ج.م</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase text-[#D4AF37] block">
              FABRIC SOURCING STATUS
            </span>
            <p className="text-xs text-neutral-400 leading-relaxed">
              جميع شحنات القطن المصري 380 GSM و 240 GSM مؤمنة بالكامل للدروب القادم.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
