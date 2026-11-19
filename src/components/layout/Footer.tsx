"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/config/i18n";
import {
  ShieldCheck,
  Truck,
  RefreshCw,
  PhoneCall,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  MessageCircle,
} from "lucide-react";

export function Footer() {
  const { locale, themeMode } = useAppStore();
  const t = translations[locale];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 transition-colors">
      
      {/* 1. VALUE PROPOSITIONS */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-black dark:text-white border border-neutral-200 dark:border-neutral-800 flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  {locale === "ar" ? "قطن مصري 100% أصلي" : "100% Egyptian Combed Cotton"}
                </h4>
                <p className="text-[11px] text-neutral-500">
                  {locale === "ar" ? "خامات هيفي ويت 380 GSM غير قابلة للانكماش" : "380 GSM Heavy French Terry pre-shrunk"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-black dark:text-white border border-neutral-200 dark:border-neutral-800 flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  {locale === "ar" ? "شحن سريع لكافة المحافظات" : "Fast Nationwide Shipping"}
                </h4>
                <p className="text-[11px] text-neutral-500">
                  {locale === "ar" ? "توصيل خلال 24-48 ساعة داخل القاهرة والجيزة" : "24-48h express delivery in Cairo & Giza"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-black dark:text-white border border-neutral-200 dark:border-neutral-800 flex-shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  {locale === "ar" ? "استبدال مقاس خلال 14 يوم" : "14-Day Free Exchange"}
                </h4>
                <p className="text-[11px] text-neutral-500">
                  {locale === "ar" ? "تغيير المقاس بسهولة وبدون أي تعقيدات" : "Hassle-free size replacement service"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-black dark:text-white border border-neutral-200 dark:border-neutral-800 flex-shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  {locale === "ar" ? "دعم وخدمة عملاء VIP" : "Dedicated Support"}
                </h4>
                <p className="text-[11px] text-neutral-500">
                  {locale === "ar" ? "تواصل مباشر مع فريقنا عبر الواتساب" : "Instant chat & order assistance on WhatsApp"}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand Info & Socials */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src={
                    mounted && themeMode === "dark"
                      ? "/branding/FG_Logo_Transparent_White.png"
                      : "/branding/FG_Logo_Transparent_Black.png"
                  }
                  alt="FG Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-black tracking-tight uppercase font-sans">
                FG COLLECTIVE
              </span>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed font-sans">
              {locale === "ar"
                ? "براند أزياء ستريت وير مصري معاصر. نبتكر تصاميم تجمع بين الفخامة الهادئة وقوة أزياء الشارع، بخامات قطنية فائقة الجودة وتفاصيل مونوغرام حصرية."
                : "Contemporary luxury Egyptian streetwear brand. Elevating everyday silhouettes through dense fabrics, dropped-shoulder fits, and minimal branding."}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                aria-label="TikTok"
              >
                <span className="text-xs font-black">TT</span>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/201012345678"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-sm"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              {locale === "ar" ? "أقسام المتجر" : "Categories"}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/catalog?drop=new" className="hover:text-[#D4AF37] transition-colors">
                  {t.navigation.newDrops}
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=cat-hoodies" className="hover:text-[#D4AF37] transition-colors">
                  {t.navigation.hoodies}
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=cat-tees" className="hover:text-[#D4AF37] transition-colors">
                  {t.navigation.tshirts}
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=cat-pants" className="hover:text-[#D4AF37] transition-colors">
                  {t.navigation.pants}
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=cat-outerwear" className="hover:text-[#D4AF37] transition-colors">
                  {t.navigation.outerwear}
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=cat-accessories" className="hover:text-[#D4AF37] transition-colors">
                  {t.navigation.accessories}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              {locale === "ar" ? "خدمة العملاء" : "Customer Care"}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/orders" className="hover:underline">
                  {locale === "ar" ? "متابعة حالة الطلبات" : "Order Status"}
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:underline">
                  {locale === "ar" ? "دليل المقاسات والعناية" : "Size Guide & Fabric Care"}
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:underline">
                  {locale === "ar" ? "سياسة الاستبدال والاسترجاع" : "Exchange & Return Policy"}
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:underline">
                  {locale === "ar" ? "الشحن والتوصيل لكافة المحافظات" : "Shipping & Delivery"}
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:underline">
                  {locale === "ar" ? "الأسئلة الشائعة" : "FAQs"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Locations */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              {locale === "ar" ? "المقر والتواصل" : "Headquarters"}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-500">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                <span>{locale === "ar" ? "القاهرة الجديدة، التجمع الخامس، مصر" : "New Cairo, Egypt"}</span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                <span dir="ltr">+20 10 1234 5678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                <span>care@fgcollective.com</span>
              </li>
            </ul>

            <div className="pt-2">
              <span className="block text-[11px] text-neutral-400 font-mono mb-1">
                {locale === "ar" ? "طرق الدفع المدعومة:" : "Accepted Payments:"}
              </span>
              <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400">
                <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700">
                  VISA / MC
                </span>
                <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700">
                  VODAFONE CASH
                </span>
                <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700">
                  INSTAPAY
                </span>
                <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700">
                  COD
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* 3. COPYRIGHT */}
        <div className="pt-8 mt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 gap-3">
          <p>
            © {new Date().getFullYear()} FG Collective. All rights reserved. Designed & Crafted in Egypt.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:underline">
              {locale === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
            </Link>
            <Link href="/terms" className="hover:underline">
              {locale === "ar" ? "الشروط والأحكام" : "Terms & Conditions"}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
