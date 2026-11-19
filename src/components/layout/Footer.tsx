"use client";

import React from "react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/config/i18n";
import { Cross, ShieldCheck, Truck, RefreshCw, PhoneCall, Mail, MapPin } from "lucide-react";

export function Footer() {
  const { locale } = useAppStore();
  const t = translations[locale];

  return (
    <footer className="bg-theme-surface border-t border-theme-border mt-20 text-theme-text transition-colors">
      
      {/* Value Proposition Highlights */}
      <div className="border-b border-theme-border/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-theme-primary/10 flex items-center justify-center text-theme-primary">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-theme-text">
                  {locale === "ar" ? "أصالة طقسية معتمدة" : "Authentic Craftsmanship"}
                </h4>
                <p className="text-[11px] text-theme-text-muted">
                  {locale === "ar" ? "منتجات ومصنوعات كنسية بأعلى درجات الإتقان" : "Venerable monastic tradition & highest quality"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-theme-gold/10 flex items-center justify-center text-theme-gold">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-theme-text">
                  {locale === "ar" ? "شحن آمن ومؤمّن" : "Insured Safe Shipping"}
                </h4>
                <p className="text-[11px] text-theme-text-muted">
                  {locale === "ar" ? "تغليف مصفح خاص للمقتنيات المقدسة والشموع" : "Special protective packaging for sacred items"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-theme-primary/10 flex items-center justify-center text-theme-primary">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-theme-text">
                  {locale === "ar" ? "دفع آمن ومتعدد" : "Flexible Payments"}
                </h4>
                <p className="text-[11px] text-theme-text-muted">
                  {locale === "ar" ? "دفع عند الاستلام، كروت بنكية، وفودافون كاش" : "Cash on delivery, cards, and mobile wallets"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-theme-gold/10 flex items-center justify-center text-theme-gold">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-theme-text">
                  {locale === "ar" ? "خدمة العملاء والرعاية" : "Dedicated Support"}
                </h4>
                <p className="text-[11px] text-theme-text-muted">
                  {locale === "ar" ? "دعم مباشر لطلبيات الإيبارشيات والكنائس" : "Direct assistance for parish & custom orders"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-theme-primary flex items-center justify-center text-theme-gold border border-theme-gold/50 shadow-sacred">
                <Cross className="w-5 h-5" />
              </div>
              <span className="font-sacred text-lg font-bold text-theme-text">
                {t.common.storeName}
              </span>
            </div>
            <p className="text-xs text-theme-text-muted leading-relaxed">
              {locale === "ar"
                ? "منصة متخصصة لتوفير أسمى المقتنيات الكنسية من أيقونات طقسية مذهبة، ملابس كهنوتية، وبخور ديري أصيل يُصنع بوقار ورعاية بالغة."
                : "Dedicated sanctuary store providing the finest liturgical supplies, hand-painted 24k icons, priestly vestments, and monastic incense."}
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com/sanctamaria.egypt"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                className="w-8 h-8 rounded-full border border-theme-border flex items-center justify-center text-theme-text-muted hover:text-blue-600 hover:border-blue-600/40 transition-colors"
              >
                <span className="font-bold text-xs">f</span>
              </a>
              <a
                href="https://instagram.com/sanctamaria_store"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="w-8 h-8 rounded-full border border-theme-border flex items-center justify-center text-theme-text-muted hover:text-pink-600 hover:border-pink-600/40 transition-colors"
              >
                <span className="font-bold text-xs">ig</span>
              </a>
              <a
                href="https://wa.me/201000000001"
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp"
                className="w-8 h-8 rounded-full border border-theme-border flex items-center justify-center text-theme-text-muted hover:text-emerald-500 hover:border-emerald-500/40 transition-colors"
              >
                <span className="font-bold text-xs">wa</span>
              </a>
              <a
                href="https://t.me/sancta_maria_store"
                target="_blank"
                rel="noopener noreferrer"
                title="Telegram"
                className="w-8 h-8 rounded-full border border-theme-border flex items-center justify-center text-theme-text-muted hover:text-sky-500 hover:border-sky-500/40 transition-colors"
              >
                <span className="font-bold text-xs">tg</span>
              </a>
              <a
                href="https://youtube.com/@sanctamaria_store"
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube"
                className="w-8 h-8 rounded-full border border-theme-border flex items-center justify-center text-theme-text-muted hover:text-red-600 hover:border-red-600/40 transition-colors"
              >
                <span className="font-bold text-xs">yt</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-theme-gold mb-3 font-sacred">
              {t.navigation.categories}
            </h4>
            <ul className="space-y-2 text-xs text-theme-text-muted">
              <li>
                <Link href="/catalog?cat=sacred-icons" className="hover:text-theme-primary transition-colors">
                  {t.navigation.icons}
                </Link>
              </li>
              <li>
                <Link href="/catalog?cat=altar-vessels-censers" className="hover:text-theme-primary transition-colors">
                  {t.navigation.altarSupplies}
                </Link>
              </li>
              <li>
                <Link href="/catalog?cat=liturgical-vestments" className="hover:text-theme-primary transition-colors">
                  {t.navigation.vestments}
                </Link>
              </li>
              <li>
                <Link href="/catalog?cat=pure-incense-candles" className="hover:text-theme-primary transition-colors">
                  {t.navigation.candles}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-theme-gold mb-3 font-sacred">
              {locale === "ar" ? "خدمة العملاء" : "Customer Care"}
            </h4>
            <ul className="space-y-2 text-xs text-theme-text-muted">
              <li>
                <Link href="/tracking" className="hover:text-theme-primary transition-colors">
                  {locale === "ar" ? "تتبع حالة الشحنة والطلب" : "Track Shipment"}
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-theme-primary transition-colors">
                  {locale === "ar" ? "خدمة العملاء والدعم الفني" : "Customer Support"}
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-theme-primary transition-colors">
                  {locale === "ar" ? "سياسة الشحن والتوصيل" : "Shipping Policy"}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-theme-primary transition-colors">
                  {locale === "ar" ? "الشروط والأحكام" : "Terms & Privacy"}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-theme-gold hover:underline transition-colors flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {t.common.adminDashboard}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-theme-gold mb-3 font-sacred">
              {t.navigation.contact}
            </h4>
            <ul className="space-y-2 text-xs text-theme-text-muted">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-theme-gold" />
                <span>{locale === "ar" ? "القاهرة - جمهورية مصر العربية" : "Cairo, Egypt"}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-theme-gold" />
                <span>support@sanctamaria-store.com</span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-theme-gold" />
                <span dir="ltr">+20 120 000 0000</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-theme-border/60 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-theme-text-muted gap-4">
          <div>
            © {new Date().getFullYear()} {t.common.storeName}. {locale === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </div>
          <div className="flex items-center gap-4">
            <span className="font-sacred text-theme-gold">{locale === "ar" ? "صُنعت بوقار ومحبة" : "Crafted with reverence"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
