"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Mail, Lock, LogIn, ArrowLeft, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { locale } = useAppStore();
  const login = useAuthStore((state) => state.login);
  const loginAsDemoUser = useAuthStore((state) => state.loginAsDemoUser);
  const loginAsDemoAdmin = useAuthStore((state) => state.loginAsDemoAdmin);

  const [email, setEmail] = useState("demo.user@example.com");
  const [password, setPassword] = useState("DemoUser123!");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleFastDemoUser = () => {
    loginAsDemoUser();
    router.push("/profile");
  };

  const handleFastDemoAdmin = () => {
    loginAsDemoAdmin();
    router.push("/admin");
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white flex items-center justify-center">
          <LogIn className="w-6 h-6" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-900 dark:text-white">
          {locale === "ar" ? "تسجيل الدخول" : "Sign In"}
        </h1>
        <p className="text-xs text-neutral-500">
          {locale === "ar" ? "مرحباً بك مجدداً في مجتمع FG Collective" : "Welcome back to FG Collective"}
        </p>
      </div>

      {/* 1-Click Fast Demo Login Buttons */}
      <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2.5">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D4AF37] block text-center">
          ⚡ DEMO MODE — 1-CLICK INSTANT ACCESS
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleFastDemoUser}
            className="py-2.5 px-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-center hover:border-black dark:hover:border-white transition-colors"
          >
            <span>عميل (Customer)</span>
            <span className="block text-[10px] text-neutral-400 font-mono">عمر الشريف</span>
          </button>
          <button
            type="button"
            onClick={handleFastDemoAdmin}
            className="py-2.5 px-3 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold text-center hover:opacity-90 transition-opacity"
          >
            <span>مسؤول (Admin)</span>
            <span className="block text-[10px] opacity-75 font-mono">لوحة التحكم</span>
          </button>
        </div>
      </div>

      {/* Normal Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-xs text-red-600 dark:text-red-400 font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">
            {locale === "ar" ? "البريد الإلكتروني" : "Email Address"}
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono font-medium focus:outline-none focus:border-black dark:focus:border-white"
              required
            />
            <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">
            {locale === "ar" ? "كلمة المرور" : "Password"}
          </label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono font-medium focus:outline-none focus:border-black dark:focus:border-white"
              required
            />
            <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-wider shadow-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          <span>{isLoading ? "جاري الدخول..." : locale === "ar" ? "تسجيل الدخول" : "Sign In"}</span>
          <ArrowLeft className="w-4 h-4 rtl:block hidden" />
          <ArrowRight className="w-4 h-4 rtl:hidden block" />
        </button>
      </form>

      {/* Switch to Register */}
      <div className="text-center pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500">
        <span>{locale === "ar" ? "ليس لديك حساب بعد؟" : "Don't have an account?"} </span>
        <Link href="/register" className="font-bold text-black dark:text-white underline underline-offset-4">
          {locale === "ar" ? "إنشاء حساب جديد" : "Create Account"}
        </Link>
      </div>

    </div>
  );
}
