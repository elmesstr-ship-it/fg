"use client";

import React, { useState } from "react";
import { MessageSquare, Mail, Phone, MapPin, Send, CheckCircle2, Clock, MessageCircle } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export default function SupportPage() {
  const { locale } = useAppStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    // Simulate instant support ticket submission
    setTimeout(() => {
      setSending(false);
      setSuccessMsg(
        locale === "ar"
          ? "شكراً لتواصلك مع FG Collective. تم استلام رسالتك وسيتواصل معك فريق خدمة العملاء خلال ساعات."
          : "Thank you for reaching out to FG Collective. Our customer care team will respond shortly."
      );
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
          CUSTOMER CARE & CONCIERGE
        </span>
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-neutral-900 dark:text-white">
          {locale === "ar" ? "خدمة العملاء والاستفسارات" : "Customer Support & Inquiries"}
        </h1>
        <p className="text-xs text-neutral-500 max-w-md mx-auto">
          {locale === "ar"
            ? "نحن هنا لمساعدتك في استفسارات المقاسات، تتبع الشحنات، واستبدال القطع."
            : "We are here to assist you with sizing recommendations, orders, and exchanges."}
        </p>
      </div>

      {/* Direct Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a
          href="https://wa.me/201012345678"
          target="_blank"
          rel="noopener noreferrer"
          className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-all text-center space-y-2 group"
        >
          <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold uppercase">واتساب مباشر (WhatsApp)</h3>
          <p className="text-[11px] text-neutral-500 font-mono">+20 10 1234 5678</p>
        </a>

        <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center space-y-2">
          <div className="w-10 h-10 mx-auto rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold uppercase">البريد الإلكتروني</h3>
          <p className="text-[11px] text-neutral-500 font-mono">care@fgcollective.com</p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center space-y-2">
          <div className="w-10 h-10 mx-auto rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold uppercase">المقر الرئيسي</h3>
          <p className="text-[11px] text-neutral-500">المنصورة، محافظة الدقهلية، مصر</p>
        </div>
      </div>

      {/* Support Message Form */}
      <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
        <h2 className="text-base font-black uppercase tracking-tight">
          {locale === "ar" ? "أرسل رسالة إلى فريقنا" : "Send Us A Message"}
        </h2>

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-500 mb-1 font-bold uppercase">الاسم الكامل *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-500 mb-1 font-bold uppercase">البريد الإلكتروني *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-500 mb-1 font-bold uppercase">رقم الهاتف</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 font-mono"
              />
            </div>
            <div>
              <label className="block text-neutral-500 mb-1 font-bold uppercase">موضوع الاستفسار *</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950"
                required
              >
                <option value="">اختر الموضوع...</option>
                <option value="sizing">استشارة مقاسات (Size Consultation)</option>
                <option value="order">متابعة شحنة أو طلب</option>
                <option value="exchange">طلب استبدال أو استرجاع</option>
                <option value="other">استفسار عام</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-neutral-500 mb-1 font-bold uppercase">تفاصيل الرسالة *</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950"
              required
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="px-6 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-wider hover:opacity-90 disabled:opacity-50"
          >
            {sending ? "جاري الإرسال..." : "إرسال الرسالة"}
          </button>
        </form>
      </div>

    </div>
  );
}
