"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import {
  User,
  MapPin,
  Package,
  Heart,
  Lock,
  CheckCircle2,
  Phone,
  Mail,
  Shield,
  LogOut,
  X,
  Sparkles,
} from "lucide-react";

export default function CustomerProfilePage() {
  const router = useRouter();
  const { locale } = useAppStore();
  const { user, logout, changePassword, loginAsDemoUser, loginAsDemoAdmin } = useAuthStore();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [profile, setProfile] = useState({
    fullName: user?.fullName || "عمر الشريف",
    email: user?.email || "demo.user@example.com",
    phone: user?.phone || "01012345678",
    governorate: "القاهرة",
    city: "التجمع الخامس",
    streetAddress: "شارع التسعين الجنوبي، كمبوند ماونتن فيو، عمارة 12",
  });

  // Change Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError("");
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => {
        setPasswordSuccess(false);
        setShowPasswordModal(false);
      }, 2000);
    } catch (err: any) {
      setPasswordError(err.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div className="flex items-center gap-4 text-center sm:text-start">
          <div className="w-16 h-16 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-sans text-2xl font-black shadow-md">
            {profile.fullName.slice(0, 2)}
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase text-neutral-900 dark:text-white">{profile.fullName}</h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 mt-1">
              <span className="flex items-center gap-1 font-mono">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                {profile.email}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                {profile.phone}
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-[10px]">
                {user?.role === "ADMIN" ? "👑 مسؤول النظام" : "عميل VIP"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/orders"
            className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 font-bold text-xs uppercase flex items-center gap-1.5 hover:border-black dark:hover:border-white transition-colors"
          >
            <Package className="w-4 h-4 text-[#D4AF37]" />
            <span>{locale === "ar" ? "سجل طلباتي" : "My Orders"}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>{locale === "ar" ? "تسجيل الخروج" : "Logout"}</span>
          </button>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Personal & Address Info */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-[#D4AF37]" />
                <span>{locale === "ar" ? "البيانات الشخصية وعنوان الشحن" : "Personal Profile & Shipping"}</span>
              </h2>
              {savedSuccess && (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {locale === "ar" ? "تم الحفظ بنجاح" : "Saved Successfully"}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-neutral-500 mb-1 font-bold uppercase">
                  {locale === "ar" ? "الاسم الكامل" : "Full Name"}
                </label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 font-medium focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1 font-bold uppercase">
                  {locale === "ar" ? "رقم الهاتف" : "Phone Number"}
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 font-mono font-medium focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-neutral-500 mb-1 font-bold uppercase">
                  {locale === "ar" ? "المحافظة" : "Governorate"}
                </label>
                <input
                  type="text"
                  value={profile.governorate}
                  onChange={(e) => setProfile({ ...profile, governorate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 font-medium focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1 font-bold uppercase">
                  {locale === "ar" ? "المدينة / الحي" : "City / District"}
                </label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 font-medium focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-500 mb-1 font-bold uppercase text-xs">
                {locale === "ar" ? "العنوان بالتفصيل" : "Street Address"}
              </label>
              <input
                type="text"
                value={profile.streetAddress}
                onChange={(e) => setProfile({ ...profile, streetAddress: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium focus:outline-none focus:border-black dark:focus:border-white"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase hover:opacity-90 transition-opacity"
            >
              {locale === "ar" ? "حفظ التعديلات" : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Right Column: Security & Fast Demo Account Switching */}
        <div className="space-y-6">
          {/* Quick Demo Switcher Card */}
          <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D4AF37] block">
              DEMO MODE SWITCHER
            </span>
            <h3 className="text-xs font-black uppercase">
              {locale === "ar" ? "التبديل بين الحسابات التجريبية" : "Switch Demo Roles"}
            </h3>
            <p className="text-[11px] text-neutral-500">
              {locale === "ar"
                ? "يمكنك الانتقال الفوري بين حساب العميل وحساب مدير النظام لتجربة جميع صلاحيات المنصة."
                : "Instantly switch between Customer and Admin roles to preview features."}
            </p>

            <div className="space-y-2">
              <button
                onClick={loginAsDemoUser}
                className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-black border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-start flex items-center justify-between hover:border-black dark:hover:border-white transition-colors"
              >
                <span>⚡ حساب عميل (Demo User)</span>
                <span className="text-[10px] text-neutral-400 font-mono">عمر الشريف</span>
              </button>
              <button
                onClick={loginAsDemoAdmin}
                className="w-full py-2.5 px-3 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold text-start flex items-center justify-between hover:opacity-90 transition-opacity"
              >
                <span>⚡ حساب مدير (Demo Admin)</span>
                <span className="text-[10px] opacity-75 font-mono">لوحة التحكم</span>
              </button>
            </div>
          </div>

          {/* Security & Password Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <h3 className="text-xs font-black uppercase text-neutral-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#D4AF37]" />
              <span>{locale === "ar" ? "الأمان وكلمة المرور" : "Security & Password"}</span>
            </h3>
            <p className="text-xs text-neutral-500">
              {locale === "ar"
                ? "يُنصح بتحديث كلمة المرور بانتظام لحماية حسابك وعناوين الشحن الخاصة بك."
                : "Regularly update your password to maintain account security."}
            </p>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 font-bold text-xs uppercase hover:border-black dark:hover:border-white transition-colors"
            >
              {locale === "ar" ? "تغيير كلمة المرور" : "Change Password"}
            </button>
          </div>
        </div>

      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-950 rounded-3xl max-w-md w-full p-6 border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-black uppercase">
                {locale === "ar" ? "تحديث كلمة المرور" : "Change Password"}
              </h3>
              <button onClick={() => setShowPasswordModal(false)} className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-500 mb-1 font-bold">كلمة المرور الحالية</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1 font-bold">كلمة المرور الجديدة</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                  required
                />
              </div>

              {passwordError && <p className="text-xs text-red-500 font-bold">{passwordError}</p>}
              {passwordSuccess && <p className="text-xs text-emerald-500 font-bold">✓ تم تحديث كلمة المرور بنجاح!</p>}

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase hover:opacity-90"
              >
                {passwordLoading ? "جاري التحديث..." : "تأكيد كلمة المرور"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
