"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/Button";
import {
  Mail,
  Lock,
  User,
  Phone,
  UserPlus,
  ArrowRight,
  ArrowLeft,
  Shield,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Church,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { locale } = useAppStore();
  const register = useAuthStore((state) => state.register);
  const verifyPhoneOtp = useAuthStore((state) => state.verifyPhoneOtp);
  const verifyEmail = useAuthStore((state) => state.verifyEmail);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "010",
    password: "",
    parishName: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // OTP Verification Step
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [receivedOtp, setReceivedOtp] = useState("");
  const [receivedEmailToken, setReceivedEmailToken] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        parishName: formData.parishName || undefined,
      });

      setReceivedOtp(res.phoneOtp);
      setReceivedEmailToken(res.emailToken);
      setShowOtpModal(true);
    } catch (err: any) {
      setErrorMessage(err.message || (locale === "ar" ? "تعذر إنشاء الحساب، يرجى مراجعة البيانات" : "Registration failed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpLoading(true);
    try {
      await verifyPhoneOtp(formData.email, enteredOtp);
      await verifyEmail(receivedEmailToken);
      setOtpSuccess(true);
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid OTP code");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-theme-surface border border-theme-border rounded-3xl p-8 sm:p-10 shadow-sacred-lg space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-full bg-theme-primary/10 text-theme-primary flex items-center justify-center">
          <UserPlus className="w-6 h-6" />
        </div>
        <h1 className="font-sacred text-2xl font-bold text-theme-text">
          {locale === "ar" ? "إنشاء حساب جديد" : "Create Account"}
        </h1>
        <p className="text-xs text-theme-text-muted">
          {locale === "ar"
            ? "انضم لعائلة متجر سانكتا ماريا للمقتنيات والمستلزمات الكنسية"
            : "Join Sancta Maria church supplies family"}
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-theme-text-muted mb-1.5">
            {locale === "ar" ? "الاسم الكامل *" : "Full Name *"}
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder={locale === "ar" ? "مثال: مينا رفيق جرجس" : "John Doe"}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-theme-border bg-theme-surface-elevated text-xs text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-gold"
            />
            <User className="w-4 h-4 text-theme-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-theme-text-muted mb-1.5">
            {locale === "ar" ? "البريد الإلكتروني *" : "Email Address *"}
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-theme-border bg-theme-surface-elevated text-xs text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-gold"
            />
            <Mail className="w-4 h-4 text-theme-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-theme-text-muted">
              {locale === "ar" ? "رقم الهاتف المحمول (مصر) *" : "Egyptian Mobile Number *"}
            </label>
            <span className="text-[10px] text-theme-gold font-mono">010 / 011 / 012 / 015</span>
          </div>
          <div className="relative">
            <input
              type="tel"
              required
              maxLength={11}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="010XXXXXXXX"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-theme-border bg-theme-surface-elevated text-xs text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-gold font-mono"
            />
            <Phone className="w-4 h-4 text-theme-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-theme-text-muted mb-1.5">
            {locale === "ar" ? "الكنيسة / الإيبارشية التابع لها (اختياري)" : "Parish / Church (Optional)"}
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.parishName}
              onChange={(e) => setFormData({ ...formData, parishName: e.target.value })}
              placeholder={locale === "ar" ? "مثال: كنيسة السيدة العذراء - المعادي" : "Parish name"}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-theme-border bg-theme-surface-elevated text-xs text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-gold"
            />
            <Church className="w-4 h-4 text-theme-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-theme-text-muted mb-1.5">
            {locale === "ar" ? "كلمة المرور (8 أحرف على الأقل) *" : "Password (Min. 8 chars) *"}
          </label>
          <div className="relative">
            <input
              type="password"
              required
              minLength={8}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-theme-border bg-theme-surface-elevated text-xs text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-gold"
            />
            <Lock className="w-4 h-4 text-theme-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <Button
          type="submit"
          variant="gold"
          size="lg"
          isLoading={isLoading}
          className="w-full rounded-xl mt-2"
        >
          <span>{locale === "ar" ? "إنشاء الحساب ومتابعة التحقق" : "Register & Verify"}</span>
          {locale === "ar" ? <ArrowLeft className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </form>

      {/* Role Notice */}
      <div className="p-3 rounded-xl bg-theme-surface-elevated border border-theme-border text-[11px] text-theme-text-muted flex items-center gap-2">
        <Shield className="w-4 h-4 text-theme-gold flex-shrink-0" />
        <span>
          {locale === "ar"
            ? "التسجيل العام يُنشئ حصرياً حساب عميل (USER Role). حسابات المشرفين تخضع لبروتوكول إداري مشفر ومحمي بالسيرفر."
            : "Public registration strictly provisions USER role accounts. ADMIN accounts require verified master credentials."}
        </span>
      </div>

      <div className="text-center text-xs text-theme-text-muted">
        {locale === "ar" ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
        <Link href="/login" className="text-theme-gold font-bold hover:underline">
          {locale === "ar" ? "تسجيل الدخول" : "Sign In"}
        </Link>
      </div>

      {/* Egyptian Phone OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-theme-surface text-theme-text rounded-3xl max-w-sm w-full p-6 shadow-sacred-lg border border-theme-border space-y-4">
            <div className="text-center space-y-1 border-b border-theme-border pb-3">
              <Smartphone className="w-8 h-8 text-theme-gold mx-auto" />
              <h3 className="font-sacred text-base font-bold">
                {locale === "ar" ? "تأكيد رقم الهاتف المحمول" : "Egyptian Mobile Verification"}
              </h3>
              <p className="text-xs text-theme-text-muted">
                {locale === "ar"
                  ? `أدخل رمز الـ OTP المكون من 6 أرقام المرسل للرقم ${formData.phone}`
                  : `Enter 6-digit OTP code sent to ${formData.phone}`}
              </p>
            </div>

            {/* Dev Helper Pill */}
            <div className="p-2.5 rounded-xl bg-theme-surface-elevated border border-theme-border text-center text-xs font-mono text-theme-gold font-bold">
              OTP Code: {receivedOtp}
            </div>

            {otpSuccess ? (
              <div className="text-center py-4 space-y-2 text-xs">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="font-bold text-theme-text">
                  {locale === "ar" ? "تم التحقق وتفعيل الحساب بنجاح!" : "Phone verified successfully!"}
                </p>
                <p className="text-theme-text-muted">{locale === "ar" ? "جاري تحويلك لحسابك..." : "Redirecting..."}</p>
              </div>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center tracking-widest text-lg font-mono font-bold py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none focus:ring-2 focus:ring-theme-gold"
                />
                <Button type="submit" variant="gold" size="md" isLoading={otpLoading} className="w-full rounded-xl">
                  {locale === "ar" ? "تأكيد الرمز والتفعيل" : "Verify & Activate Account"}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
