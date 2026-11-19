"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Palette,
  Bell,
  History,
  Settings,
  ExternalLink,
  ShieldCheck,
  Sun,
  Moon,
  Menu,
  X,
  AlertTriangle,
  Tag,
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export default function ModernAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { themeMode, setThemeMode, isMaintenanceMode, setMaintenanceMode } = useAppStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationSections = [
    {
      title: "نظرة عامة",
      items: [
        { href: "/admin", label: "لوحة المؤشرات والتحليلات", icon: LayoutDashboard },
        { href: "/admin/orders", label: "إدارة الطلبات والمبيعات", icon: ShoppingCart },
      ],
    },
    {
      title: "كتالوج المقتنيات",
      items: [
        { href: "/admin/products", label: "المنتجات والمخزون", icon: Package },
        { href: "/admin/categories", label: "الأقسام الليتورجية", icon: FolderTree },
        { href: "/admin/discounts", label: "كوبونات الخصم", icon: Tag },
      ],
    },
    {
      title: "التخصيص والتجربة",
      items: [
        { href: "/admin/themes", label: "المظاهر والمناسبات الكنسية", icon: Palette },
        { href: "/admin/notifications", label: "مركز الإشعارات والتنبيهات", icon: Bell },
      ],
    },
    {
      title: "الإدارة والأمان",
      items: [
        { href: "/admin/customers", label: "حسابات الرعايا والعملاء", icon: Users },
        { href: "/admin/logs", label: "سجل العمليات والرقابة", icon: History },
        { href: "/admin/settings", label: "إعدادات المنصة والهوية", icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F1117] text-[#E2E8F0] flex font-sans antialiased selection:bg-[#C5A059]/30 selection:text-white" dir="rtl">
      
      {/* ---------------------------------------------------- */}
      {/* 1. MODERN SLICK SIDEBAR                              */}
      {/* ---------------------------------------------------- */}
      <aside
        className={`hidden lg:flex flex-col bg-[#161922] border-l border-[#232734] transition-all duration-300 z-30 ${
          sidebarCollapsed ? "w-20" : "w-72"
        }`}
      >
        {/* Brand & Collapse Header */}
        <div className="h-20 px-6 border-b border-[#232734] flex items-center justify-between">
          {!sidebarCollapsed && (
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#781D22] to-[#421014] flex items-center justify-center border border-[#C5A059]/40 shadow-lg shadow-red-950/40">
                <span className="font-serif font-black text-amber-200 text-lg">SM</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-wide text-white group-hover:text-amber-200 transition-colors">
                  سانكتا ماريا
                </span>
                <span className="text-[10px] text-amber-400/90 font-medium tracking-wider uppercase">
                  لوحة الإدارة التنفيذية
                </span>
              </div>
            </Link>
          )}

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-[#232734] transition-colors mx-auto"
            title={sidebarCollapsed ? "توسيع القائمة" : "طي القائمة"}
          >
            {sidebarCollapsed ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {navigationSections.map((sec, idx) => (
            <div key={idx} className="space-y-1.5">
              {!sidebarCollapsed && (
                <div className="text-[11px] font-bold text-stone-500 uppercase tracking-widest px-3 mb-2 font-display">
                  {sec.title}
                </div>
              )}
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? "bg-[#781D22] text-white shadow-md shadow-red-950/40 border border-[#C5A059]/40 font-bold"
                        : "text-stone-400 hover:text-stone-100 hover:bg-[#1E222D]"
                    }`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? "text-amber-200" : "text-stone-400 group-hover:text-amber-400"
                      }`}
                    />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Maintenance Mode & Public Store Link */}
        <div className="p-4 border-t border-[#232734] bg-[#12151C] space-y-3">
          {!sidebarCollapsed && (
            <div className="flex items-center justify-between px-2 text-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-3.5 h-3.5 ${isMaintenanceMode ? "text-amber-400" : "text-stone-500"}`} />
                <span className="text-stone-400 text-[11px]">وضع الصيانة</span>
              </div>
              <button
                onClick={() => setMaintenanceMode(!isMaintenanceMode)}
                className={`w-9 h-5 rounded-full transition-colors relative ${
                  isMaintenanceMode ? "bg-amber-500" : "bg-[#282D3D]"
                }`}
              >
                <span
                  className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                    isMaintenanceMode ? "-translate-x-4" : "-translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          )}

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 text-xs font-semibold rounded-xl bg-[#1E222D] hover:bg-[#282D3D] text-stone-200 border border-[#2B3142] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            {!sidebarCollapsed && <span>معاينة واجهة المتجر</span>}
          </Link>
        </div>
      </aside>

      {/* ---------------------------------------------------- */}
      {/* 2. MAIN ADMIN CONTENT CONTAINER                      */}
      {/* ---------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Floating App Bar */}
        <header className="h-20 bg-[#161922]/95 backdrop-blur-md border-b border-[#232734] px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-300 hover:bg-[#232734]"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-stone-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">نظام الإدارة التنفيذي — مصادقة الخادم المشددة (ADMIN Role)</span>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-4">
            {/* Theme mode switcher */}
            <button
              onClick={() => setThemeMode(themeMode === "light" ? "dark" : "light")}
              className="p-2.5 rounded-xl bg-[#1E222D] hover:bg-[#282D3D] border border-[#2B3142] text-stone-300 transition-colors"
              title="التبديل بين النهج الليلي والنهاري"
            >
              {themeMode === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Admin Avatar Profile */}
            <div className="flex items-center gap-3 pr-3 border-r border-[#2B3142]">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#781D22] to-amber-700 text-white flex items-center justify-center text-xs font-black shadow-md border border-amber-400/40">
                مشرف
              </div>
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-bold text-white">إدارة المتجر العامة</span>
                <span className="text-[10px] text-emerald-400 font-medium">جلسة آمنة نشطة</span>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#161922] border-b border-[#232734] p-5 space-y-4 animate-in slide-in-from-top-4 duration-200">
            {navigationSections.map((sec, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  {sec.title}
                </div>
                {sec.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-stone-300 hover:bg-[#1E222D] hover:text-white"
                  >
                    <item.icon className="w-4 h-4 text-amber-400" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Main Routed Content */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
