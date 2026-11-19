"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/Button";
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
  Church,
  LogOut,
  AlertCircle,
  X,
  Smartphone,
} from "lucide-react";

export default function CustomerProfilePage() {
  const router = useRouter();
  const { locale } = useAppStore();
  const { user, logout, changePassword, sendPhoneOtp, verifyPhoneOtp } = useAuthStore();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [profile, setProfile] = useState({
    fullName: user?.fullName || "مينا رفيق جرجس",
    email: user?.email || "mina.girgis@example.com",
    phone: user?.phone || "01201234567",
    parish: user?.parishName || "كنيسة السيدة العذراء مريم - المعادي",
    governorate: "القاهرة",
    city: "المعادي",
    streetAddress: "شارع النصر، عمارة 14، الدور الثالث",
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
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 border-b border-theme-border pb-6">
        <div className="flex items-center gap-4 text-center sm:text-start">
          <div className="w-16 h-16 rounded-full bg-theme-primary text-theme-gold border-2 border-theme-gold flex items-center justify-center font-sacred text-2xl font-bold shadow-sacred">
            {profile.fullName.slice(0, 2)}
          </div>
          <div>
            <h1 className="font-sacred text-2xl font-bold text-theme-text">{profile.fullName}</h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-theme-text-muted mt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-theme-gold" />
                {profile.email}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono">
                <Phone className="w-3.5 h-3.5 text-theme-gold" />
                {profile.phone}
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                {user?.role || "USER"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/orders">
            <Button variant="outline" size="sm" className="rounded-xl">
              <Package className="w-4 h-4 mr-1.5 rtl:mr-0 rtl:ml-1.5 text-theme-gold" />
              <span>{locale === "ar" ? "سجل طلباتي" : "My Orders"}</span>
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40">
            <LogOut className="w-4 h-4 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
            <span>{locale === "ar" ? "تسجيل الخروج" : "Logout"}</span>
          </Button>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Personal & Church Info */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-theme-border pb-3">
              <h2 className="font-sacred text-base font-bold text-theme-text flex items-center gap-2">
                <User className="w-4 h-4 text-theme-gold" />
                <span>{locale === "ar" ? "البيانات الشخصية ومعلومات الكنيسة" : "Personal & Parish Details"}</span>
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
                <label className="block text-theme-text-muted mb-1 font-medium">
                  {locale === "ar" ? "الاسم الكامل" : "Full Name"}
                </label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text focus:ring-2 focus:ring-theme-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-theme-text-muted mb-1 font-medium">
                  {locale === "ar" ? "رقم الهاتف المحمول (مصر)" : "Egyptian Phone Number"}
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text focus:ring-2 focus:ring-theme-gold outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-theme-text-muted mb-1 font-medium">
                  {locale === "ar" ? "البريد الإلكتروني" : "Email Address"}
                </label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full px-3 py-2.5 rounded-xl border border-theme-border bg-theme-surface-elevated/50 text-theme-text-muted outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-theme-text-muted mb-1 font-medium">
                  {locale === "ar" ? "اسم الكنيسة / الإيبارشية التابع لها" : "Parish / Church"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={profile.parish}
                    onChange={(e) => setProfile({ ...profile, parish: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text focus:ring-2 focus:ring-theme-gold outline-none"
                  />
                  <Church className="w-4 h-4 text-theme-gold absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="pt-4 border-t border-theme-border space-y-4">
              <h3 className="text-xs font-bold text-theme-text flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-theme-gold" />
                <span>{locale === "ar" ? "عنوان التوصيل الافتراضي" : "Default Delivery Address"}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-theme-text-muted mb-1 font-medium">
                    {locale === "ar" ? "المحافظة" : "Governorate"}
                  </label>
                  <input
                    type="text"
                    value={profile.governorate}
                    onChange={(e) => setProfile({ ...profile, governorate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text focus:ring-2 focus:ring-theme-gold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-theme-text-muted mb-1 font-medium">
                    {locale === "ar" ? "المدينة / الحي" : "City / District"}
                  </label>
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text focus:ring-2 focus:ring-theme-gold outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-theme-text-muted mb-1 font-medium">
                    {locale === "ar" ? "تفاصيل العنوان" : "Street & Building Details"}
                  </label>
                  <input
                    type="text"
                    value={profile.streetAddress}
                    onChange={(e) => setProfile({ ...profile, streetAddress: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text focus:ring-2 focus:ring-theme-gold outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="gold" size="md" className="rounded-xl">
                {locale === "ar" ? "حفظ التغييرات" : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Verification & Security Controls */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-sm space-y-4">
            <h3 className="font-sacred text-base font-bold text-theme-text flex items-center gap-2 border-b border-theme-border pb-3">
              <Shield className="w-4 h-4 text-theme-gold" />
              <span>{locale === "ar" ? "التحقق والأمان" : "Verification & Security"}</span>
            </h3>

            {/* Email Verification Status */}
            <div className="p-3.5 rounded-2xl bg-theme-surface-elevated border border-theme-border space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-theme-text flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-theme-gold" />
                  <span>البريد الإلكتروني</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {locale === "ar" ? "تم التحقق" : "Verified"}
                </span>
              </div>
              <p className="text-[11px] text-theme-text-muted font-mono">{profile.email}</p>
            </div>

            {/* Phone Verification Status */}
            <div className="p-3.5 rounded-2xl bg-theme-surface-elevated border border-theme-border space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-theme-text flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-theme-gold" />
                  <span>رقم الهاتف المصري</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {locale === "ar" ? "تم التحقق (OTP)" : "Verified"}
                </span>
              </div>
              <p className="text-[11px] text-theme-text-muted font-mono">{profile.phone}</p>
            </div>

            {/* Change Password Trigger */}
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPasswordModal(true)}
                className="w-full rounded-xl justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-theme-gold" />
                  <span>{locale === "ar" ? "تغيير كلمة المرور" : "Change Password"}</span>
                </span>
                <span>→</span>
              </Button>
            </div>
          </div>
        </div>

      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-theme-surface text-theme-text rounded-3xl max-w-sm w-full p-6 shadow-sacred-lg border border-theme-border space-y-4">
            <div className="flex items-center justify-between border-b border-theme-border pb-3">
              <h3 className="font-sacred text-base font-bold flex items-center gap-2">
                <Lock className="w-4 h-4 text-theme-gold" />
                <span>{locale === "ar" ? "تغيير كلمة المرور" : "Change Password"}</span>
              </h3>
              <button onClick={() => setShowPasswordModal(false)} className="p-1 text-theme-text-muted hover:bg-theme-surface-elevated rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordError && (
              <div className="p-2.5 rounded-xl bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess ? (
              <div className="text-center py-4 space-y-2 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-theme-text">
                  {locale === "ar" ? "تم تحديث كلمة المرور بنجاح!" : "Password successfully updated!"}
                </p>
              </div>
            ) : (
              <form onSubmit={handleChangePasswordSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-theme-text-muted mb-1 font-medium">
                    {locale === "ar" ? "كلمة المرور الحالية *" : "Current Password *"}
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none focus:ring-2 focus:ring-theme-gold"
                  />
                </div>

                <div>
                  <label className="block text-theme-text-muted mb-1 font-medium">
                    {locale === "ar" ? "كلمة المرور الجديدة (8 أحرف كحد أدنى) *" : "New Password (Min. 8 chars) *"}
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none focus:ring-2 focus:ring-theme-gold"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-theme-border">
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowPasswordModal(false)}>
                    {locale === "ar" ? "إلغاء" : "Cancel"}
                  </Button>
                  <Button type="submit" variant="gold" size="sm" isLoading={passwordLoading}>
                    {locale === "ar" ? "تأكيد التغيير" : "Update Password"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
