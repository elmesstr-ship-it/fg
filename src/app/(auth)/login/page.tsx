"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/Button";
import { Mail, Lock, LogIn, ArrowRight, ArrowLeft, Shield, AlertCircle, CheckCircle2, KeyRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { locale } = useAppStore();
  const login = useAuthStore((state) => state.login);
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const resetPassword = useAuthStore((state) => state.resetPassword);

  const [email, setEmail] = useState("mina.girgis@example.com");
  const [password, setPassword] = useState("Customer@1234");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetTokenReceived, setResetTokenReceived] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotStep, setForgotStep] = useState<"request" | "reset" | "done">("request");
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const user = await login(email, password);
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/profile");
      }
    } catch (err: any) {
      setErrorMessage(err.message || (locale === "ar" ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" : "Invalid email or password"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      const token = await forgotPassword(forgotEmail);
      if (token) {
        setResetTokenReceived(token);
        setForgotStep("reset");
      }
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      await resetPassword(resetTokenReceived, newPassword);
      setForgotStep("done");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-theme-surface border border-theme-border rounded-3xl p-8 sm:p-10 shadow-sacred-lg space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-full bg-theme-primary/10 text-theme-primary flex items-center justify-center">
          <LogIn className="w-6 h-6" />
        </div>
        <h1 className="font-sacred text-2xl font-bold text-theme-text">
          {locale === "ar" ? "تسجيل الدخول" : "Sign In"}
        </h1>
        <p className="text-xs text-theme-text-muted">
          {locale === "ar"
            ? "مرحباً بكم، سجّل الدخول لمتابعة مشترياتك وسجل طلباتك الكنسية"
            : "Welcome back, sign in to track your sacred orders"}
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
            {locale === "ar" ? "البريد الإلكتروني" : "Email Address"}
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-theme-border bg-theme-surface-elevated text-xs text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-gold"
            />
            <Mail className="w-4 h-4 text-theme-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-theme-text-muted">
              {locale === "ar" ? "كلمة المرور" : "Password"}
            </label>
            <button
              type="button"
              onClick={() => {
                setForgotEmail(email);
                setShowForgotModal(true);
              }}
              className="text-[11px] text-theme-gold hover:underline font-semibold"
            >
              {locale === "ar" ? "نسيت كلمة المرور؟" : "Forgot Password?"}
            </button>
          </div>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          <span>{locale === "ar" ? "تسجيل الدخول" : "Sign In"}</span>
          {locale === "ar" ? <ArrowLeft className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </form>

      {/* Demo Quick Logins */}
      <div className="p-3 rounded-2xl bg-theme-surface-elevated border border-theme-border text-xs space-y-2">
        <span className="text-[11px] font-bold text-theme-text block">
          {locale === "ar" ? "حسابات تجريبية سريعة (Demo Credentials):" : "Quick Demo Credentials:"}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setEmail("mina.girgis@example.com");
              setPassword("Customer@1234");
            }}
            className="flex-1 py-1 px-2 rounded-lg border border-theme-border text-[10px] text-theme-text-muted hover:bg-theme-surface hover:text-theme-text"
          >
            👤 عميل (USER)
          </button>
          <button
            type="button"
            onClick={() => {
              setEmail("admin@sanctamaria-store.com");
              setPassword("Admin@Holy2026");
            }}
            className="flex-1 py-1 px-2 rounded-lg border border-theme-gold/40 text-[10px] text-theme-gold hover:bg-theme-gold/10 font-bold"
          >
            🛡️ مشرف (ADMIN)
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-theme-text-muted">
        {locale === "ar" ? "ليس لديك حساب بعد؟" : "Don't have an account yet?"}{" "}
        <Link href="/register" className="text-theme-gold font-bold hover:underline">
          {locale === "ar" ? "إنشاء حساب جديد" : "Create Account"}
        </Link>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-theme-surface text-theme-text rounded-3xl max-w-sm w-full p-6 shadow-sacred-lg border border-theme-border space-y-4">
            <div className="flex items-center gap-2 border-b border-theme-border pb-3">
              <KeyRound className="w-5 h-5 text-theme-gold" />
              <h3 className="font-sacred text-base font-bold">
                {locale === "ar" ? "استعادة كلمة المرور" : "Reset Password"}
              </h3>
            </div>

            {forgotStep === "request" && (
              <form onSubmit={handleForgotPassword} className="space-y-3 text-xs">
                <p className="text-theme-text-muted">
                  {locale === "ar"
                    ? "أدخل بريدك الإلكتروني وسنقوم بإرسال رمز استعادة الحساب المشفر:"
                    : "Enter your registered email to receive secure reset credentials:"}
                </p>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowForgotModal(false)}>
                    {locale === "ar" ? "إلغاء" : "Cancel"}
                  </Button>
                  <Button type="submit" variant="gold" size="sm" isLoading={forgotLoading}>
                    {locale === "ar" ? "إرسال الرابط" : "Send Reset"}
                  </Button>
                </div>
              </form>
            )}

            {forgotStep === "reset" && (
              <form onSubmit={handleResetPassword} className="space-y-3 text-xs">
                <div className="p-2.5 rounded-xl bg-theme-surface-elevated border border-theme-border font-mono text-[11px] text-theme-gold">
                  Token: {resetTokenReceived.substring(0, 16)}...
                </div>
                <div>
                  <label className="block text-theme-text-muted mb-1 font-medium">كلمة المرور الجديدة *</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="submit" variant="gold" size="sm" isLoading={forgotLoading}>
                    {locale === "ar" ? "تأكيد كلمة المرور الجديدة" : "Save New Password"}
                  </Button>
                </div>
              </form>
            )}

            {forgotStep === "done" && (
              <div className="text-center py-4 space-y-3 text-xs">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="font-bold text-theme-text">
                  {locale === "ar" ? "تم تغيير كلمة المرور بنجاح!" : "Password successfully updated!"}
                </p>
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotStep("request");
                  }}
                  className="rounded-xl w-full"
                >
                  {locale === "ar" ? "تسجيل الدخول الآن" : "Sign In Now"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
