"use client";

import React from "react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { Cross, Wrench, ShieldCheck, Mail, PhoneCall } from "lucide-react";

export default function MaintenancePage() {
  const { locale, isMaintenanceMode } = useAppStore();

  return (
    <div className="min-h-screen bg-theme-bg flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-theme-surface border border-theme-border rounded-3xl p-8 sm:p-12 shadow-sacred-lg text-center space-y-6">
        
        {/* Sacred Cross Icon */}
        <div className="w-16 h-16 mx-auto rounded-full bg-theme-primary flex items-center justify-center text-theme-gold border-2 border-theme-gold/40 shadow-sacred">
          <Cross className="w-8 h-8" />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
            <Wrench className="w-3.5 h-3.5" />
            <span>{locale === "ar" ? "وضع الصيانة والتحديث الدوري" : "Scheduled Maintenance Mode"}</span>
          </div>

          <h1 className="font-sacred text-2xl sm:text-3xl font-extrabold text-theme-text">
            {locale === "ar"
              ? "المتجر في طور التحديث والترقية الطقسية"
              : "Store is Undergoing Scheduled Sanctification"}
          </h1>

          <p className="text-xs sm:text-sm text-theme-text-muted leading-relaxed">
            {locale === "ar"
              ? "نعمل حالياً على تحديث المنصة وتجهيز مقتنيات روحانية جديدة لخدمتكم بشكل أفضل. سنعود للعمل بكامل طاقتنا في أقرب وقت بمشيئة الرب."
              : "We are currently enriching our sanctuary store with new sacred treasures and enhancements. We will be back online shortly."}
          </p>
        </div>

        {/* Contact Assistance during maintenance */}
        <div className="p-4 rounded-2xl bg-theme-surface-elevated border border-theme-border text-xs text-theme-text-muted space-y-2">
          <div className="font-semibold text-theme-text">
            {locale === "ar" ? "للطلبات العاجلة أو الاستفسارات الكنسية:" : "For Urgent Pastoral Inquiries:"}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-theme-gold font-medium">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              support@sanctamaria-store.com
            </span>
            <span className="flex items-center gap-1.5" dir="ltr">
              <PhoneCall className="w-3.5 h-3.5" />
              +20 120 000 0000
            </span>
          </div>
        </div>

        {/* Admin Bypass Link */}
        <div className="pt-2 border-t border-theme-border/60">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-theme-gold hover:underline font-semibold"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{locale === "ar" ? "دخول لوحة التحكم (للمشرفين والمسؤولين فقط)" : "Authorized Admin Login"}</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
