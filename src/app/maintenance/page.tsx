"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppStore } from "@/store/useAppStore";
import { Wrench, Mail, PhoneCall } from "lucide-react";

export default function MaintenancePage() {
  const { locale } = useAppStore();

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6">
        
        {/* Brand Emblem */}
        <div className="relative w-16 h-16 mx-auto">
          <Image
            src="/branding/FG_Logo_Transparent_White.png"
            alt="FG Collective Logo"
            fill
            className="object-contain"
          />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
            <Wrench className="w-3.5 h-3.5" />
            <span>{locale === "ar" ? "وضع الصيانة وتحضير الدروب الجديد" : "Drop Preparation Maintenance"}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
            {locale === "ar"
              ? "الموقع قيد التحديث لتحضير الدروب القادم"
              : "Store Is Being Prepared For Next Drop"}
          </h1>

          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
            {locale === "ar"
              ? "نقوم حالياً بتجهيز مخزون الدروب الجديد وتحديث المنصة لمنحكم تجربة تسوق استثنائية. سنعود للعمل في غضون لحظات."
              : "We are currently staging upcoming drop inventory and optimizing performance. We will be back online shortly."}
          </p>
        </div>

        {/* Contact Assistance during maintenance */}
        <div className="p-4 rounded-2xl bg-black border border-neutral-800 text-xs text-neutral-400 space-y-2">
          <div className="font-bold text-white">
            {locale === "ar" ? "للاستفسارات العاجلة أو خدمة العملاء:" : "Customer Care Support:"}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-[#D4AF37] font-mono">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              care@fgcollective.com
            </span>
            <span className="flex items-center gap-1.5" dir="ltr">
              <PhoneCall className="w-3.5 h-3.5" />
              +20 10 1234 5678
            </span>
          </div>
        </div>

        {/* Admin Bypass Link */}
        <div className="pt-2 border-t border-neutral-800">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] hover:underline font-bold"
          >
            <span>{locale === "ar" ? "تسجيل دخول مسؤولي النظام" : "Admin Panel Login"}</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
