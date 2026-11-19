"use client";

import React, { useState } from "react";
import { MessageSquare, Mail, Phone, MapPin, Send, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }).then((r) => r.json());

      setSending(false);

      if (res.success) {
        setSuccessMsg(
          locale === "ar"
            ? "نشكركم على تواصلكم. تم استلام رسالتكم وسيقوم فريق الدعم بالرد خلال 24 ساعة."
            : "Thank you. Your message has been received and our team will respond within 24 hours."
        );
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setErrorMsg(res.error || "Failed to submit message");
      }
    } catch (err: any) {
      setSending(false);
      setErrorMsg(err.message || "Network error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="font-sacred text-3xl font-extrabold text-theme-text">
          {locale === "ar" ? "خدمة العملاء والدعم الفني" : "Customer Support & Inquiries"}
        </h1>
        <p className="text-xs text-theme-text-muted max-w-md mx-auto">
          {locale === "ar"
            ? "نحن هنا لخدمتكم والإجابة على كافة استفساراتكم بشأن المقتنيات الطقسية وطلبات الإيبارشيات."
            : "We are honored to assist you with any inquiries regarding liturgical church supplies."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Column */}
        <div className="p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-sm space-y-6">
          <h2 className="font-sacred text-sm font-bold text-theme-gold">
            {locale === "ar" ? "قنوات التواصل المباشرة:" : "Direct Channels:"}
          </h2>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-theme-gold flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-theme-text block">{locale === "ar" ? "الهاتف وواتساب:" : "Phone & WhatsApp:"}</span>
                <span className="text-theme-text-muted font-mono">01000000001</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-theme-gold flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-theme-text block">{locale === "ar" ? "البريد الإلكتروني:" : "Email:"}</span>
                <span className="text-theme-text-muted">support@sanctamaria-store.com</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-theme-gold flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-theme-text block">{locale === "ar" ? "مواعيد الخدمة:" : "Working Hours:"}</span>
                <span className="text-theme-text-muted">يومياً من 9 صباحاً إلى 10 مساءً</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-sm">
          {successMsg ? (
            <div className="p-8 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-sm text-theme-text">{successMsg}</h3>
              <Button variant="outline" size="sm" onClick={() => setSuccessMsg(null)}>
                {locale === "ar" ? "إرسال رسالة أخرى" : "Send Another Message"}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500 font-bold">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-theme-text-muted mb-1 font-bold">
                    {locale === "ar" ? "الاسم الكريم *" : "Full Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none focus:ring-1 focus:ring-theme-gold"
                  />
                </div>

                <div>
                  <label className="block text-theme-text-muted mb-1 font-bold">
                    {locale === "ar" ? "البريد الإلكتروني *" : "Email Address *"}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none focus:ring-1 focus:ring-theme-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-theme-text-muted mb-1 font-bold">
                    {locale === "ar" ? "رقم الهاتف / واتساب:" : "Phone / WhatsApp:"}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text font-mono outline-none focus:ring-1 focus:ring-theme-gold"
                  />
                </div>

                <div>
                  <label className="block text-theme-text-muted mb-1 font-bold">
                    {locale === "ar" ? "موضوع الرسالة:" : "Subject:"}
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none focus:ring-1 focus:ring-theme-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-theme-text-muted mb-1 font-bold">
                  {locale === "ar" ? "نص الرسالة أو الاستفسار *" : "Message *"}
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none focus:ring-1 focus:ring-theme-gold"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="gold" size="md" type="submit" disabled={sending} className="rounded-xl px-6">
                  <Send className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  <span>{sending ? (locale === "ar" ? "جار الإرسال..." : "Sending...") : (locale === "ar" ? "إرسال الرسالة" : "Send Inquiry")}</span>
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
