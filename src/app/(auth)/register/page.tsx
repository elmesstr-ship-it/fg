"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Mail,
  Lock,
  User,
  Phone,
  UserPlus,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { locale } = useAppStore();
  const register = useAuthStore((state) => state.register);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "010",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      router.push("/profile");
    } catch (err: any) {
      setErrorMessage(err.message || (locale === "ar" ? "فشل إنشاء الحساب، يرجى التحقق من البيانات" : "Registration failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white flex items-center justify-center">
          <UserPlus className="w-6 h-6" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-900 dark:text-white">
          {locale === "ar" ? "إنشاء حساب جديد" : "Create Account"}
        </h1>
        <p className="text-xs text-neutral-500">
          {locale === "ar" ? "انضم لمجتمع FG Collective واحصل على خصم ترحيبي 10%" : "Join FG Collective & get 10% off your first drop"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-xs text-red-600 dark:text-red-400 font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">
            {locale === "ar" ? "الاسم بالكامل" : "Full Name"} *
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder={locale === "ar" ? "مثال: عمر الشريف" : "e.g. Omar El-Sherif"}
              className="w-full px-4 py-2.5 pl-10 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium focus:outline-none focus:border-black dark:focus:border-white"
              required
            />
            <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">
            {locale === "ar" ? "البريد الإلكتروني" : "Email Address"} *
          </label>
          <div className="relative">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@example.com"
              className="w-full px-4 py-2.5 pl-10 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono font-medium focus:outline-none focus:border-black dark:focus:border-white"
              required
            />
            <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">
            {locale === "ar" ? "رقم الهاتف المحمول (مصر)" : "Phone Number (Egypt)"} *
          </label>
          <div className="relative">
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="010XXXXXXXX"
              className="w-full px-4 py-2.5 pl-10 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono font-medium focus:outline-none focus:border-black dark:focus:border-white"
              required
            />
            <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">
            {locale === "ar" ? "كلمة المرور" : "Password"} *
          </label>
          <div className="relative">
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
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
          <span>{isLoading ? "جاري إنشاء الحساب..." : locale === "ar" ? "تسجيل الحساب الآن" : "Create Account"}</span>
          <ArrowLeft className="w-4 h-4 rtl:block hidden" />
          <ArrowRight className="w-4 h-4 rtl:hidden block" />
        </button>
      </form>

      <div className="text-center pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500">
        <span>{locale === "ar" ? "لديك حساب بالفعل؟" : "Already have an account?"} </span>
        <Link href="/login" className="font-bold text-black dark:text-white underline underline-offset-4">
          {locale === "ar" ? "تسجيل الدخول" : "Sign In"}
        </Link>
      </div>

    </div>
  );
}
