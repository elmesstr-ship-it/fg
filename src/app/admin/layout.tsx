"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  RotateCcw,
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
  const [resetSuccess, setResetSuccess] = useState(false);

  const navigationSections = [
    {
      title: "نظرة عامة والتحليلات",
      items: [
        { href: "/admin", label: "لوحة المؤشرات والتحليلات", icon: LayoutDashboard },
        { href: "/admin/orders", label: "إدارة الطلبات والمبيعات", icon: ShoppingCart },
      ],
    },
    {
      title: "كتالوج الأزياء والمخزون",
      items: [
        { href: "/admin/products", label: "المنتجات ومصفوفة المقاسات", icon: Package },
        { href: "/admin/categories", label: "الأقسام والتصنيفات", icon: FolderTree },
        { href: "/admin/discounts", label: "كوبونات الخصم والعروض", icon: Tag },
      ],
    },
    {
      title: "السمات والمظهر",
      items: [
        { href: "/admin/themes", label: "استوديو السمات والمواسم", icon: Palette },
        { href: "/admin/notifications", label: "مركز الإشعارات والتنبيهات", icon: Bell },
      ],
    },
    {
      title: "الإدارة والأمان",
      items: [
        { href: "/admin/customers", label: "قاعدة بيانات العملاء", icon: Users },
        { href: "/admin/logs", label: "سجل العمليات والرقابة", icon: History },
        { href: "/admin/settings", label: "إعدادات المتجر والشحن", icon: Settings },
      ],
    },
  ];

  const handleResetDemoData = () => {
    try {
      localStorage.removeItem("fg-collective-cart");
      localStorage.removeItem("fg-collective-wishlist");
      localStorage.removeItem("fg-collective-app-settings");
      setResetSuccess(true);
      setTimeout(() => {
        setResetSuccess(false);
        window.location.reload();
      }, 1000);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] flex font-sans antialiased selection:bg-[#D4AF37]/30 selection:text-white" dir="rtl">
      
      {/* 1. SIDEBAR */}
      <aside
        className={`hidden lg:flex flex-col bg-[#111111] border-l border-neutral-800 transition-all duration-300 z-30 ${
          sidebarCollapsed ? "w-20" : "w-72"
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 border-b border-neutral-800 flex items-center justify-between">
          {!sidebarCollapsed && (
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="relative w-9 h-9 flex-shrink-0">
                <Image
                  src="/branding/FG_Logo_Transparent_White.png"
                  alt="FG Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-sm tracking-tight text-white uppercase font-sans">
                  FG COLLECTIVE
                </span>
                <span className="text-[9px] text-[#D4AF37] font-mono tracking-widest uppercase">
                  ADMIN DASHBOARD
                </span>
              </div>
            </Link>
          )}

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors mx-auto"
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
                <div className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest px-3 mb-2">
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
                        ? "bg-white text-black shadow-md font-black"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
                    }`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? "text-black" : "text-neutral-400 group-hover:text-white"
                      }`}
                    />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Reset Demo State & Storefront Link */}
        <div className="p-4 border-t border-neutral-800 bg-[#0C0C0C] space-y-3">
          {!sidebarCollapsed && (
            <button
              onClick={handleResetDemoData}
              className="w-full py-2 px-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-bold text-neutral-300 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>إعادة ضبط بيانات الديمو</span>
              </span>
              {resetSuccess && <span className="text-[10px] text-emerald-400 font-bold">✓ تم</span>}
            </button>
          )}

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white text-black text-xs font-black uppercase hover:opacity-90 transition-opacity"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {!sidebarCollapsed && <span>معاينة المتجر للعملاء</span>}
          </Link>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-20 bg-[#111111]/90 backdrop-blur-md border-b border-neutral-800 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <span className="text-xs font-mono font-bold text-neutral-400 hidden sm:inline-block">
              SYSTEM STATUS: <span className="text-emerald-400">OPERATIONAL (DEMO MODE)</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-xl border border-neutral-700 hover:border-white text-xs font-bold text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>المتجر الرئيسي</span>
            </Link>

            <div className="w-px h-6 bg-neutral-800 mx-1" />

            <div className="flex items-center gap-2 text-xs">
              <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-black">
                FG
              </div>
              <div className="hidden sm:block text-right">
                <span className="block font-bold text-white text-xs leading-none">إدارة إف جي</span>
                <span className="text-[10px] text-neutral-500 font-mono">admin@fgcollective.com</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
