"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/lib/apiClient";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  parishName?: string;
  role: "USER" | "ADMIN";
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

interface AuthState {
  user: UserProfile | null;
  sessionToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setUser: (user: UserProfile | null, token?: string) => void;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    parishName?: string;
  }) => Promise<{ user: UserProfile; emailToken: string; phoneOtp: string }>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  sendPhoneOtp: (email: string) => Promise<string>;
  verifyPhoneOtp: (email: string, otpCode: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<string | undefined>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: {
        id: "usr-cust-01",
        fullName: "مينا رفيق جرجس",
        email: "mina.girgis@example.com",
        phone: "01201234567",
        parishName: "كنيسة السيدة العذراء مريم - المعادي",
        role: "USER",
        isEmailVerified: true,
        isPhoneVerified: true,
      },
      sessionToken: "demo_active_session_token",
      isAuthenticated: true,
      isAdmin: false,

      setUser: (user, token) => {
        set({
          user,
          sessionToken: token || get().sessionToken,
          isAuthenticated: !!user,
          isAdmin: user?.role === "ADMIN",
        });
      },

      login: async (email, password) => {
        const res = await api.post<{ user: UserProfile; sessionToken: string }>("/api/auth/login", {
          email,
          password,
        });

        // Set session token in localStorage / cookies
        if (typeof document !== "undefined") {
          document.cookie = `auth_session=${res.sessionToken}; path=/; max-age=604800; SameSite=Lax`;
        }

        set({
          user: res.user,
          sessionToken: res.sessionToken,
          isAuthenticated: true,
          isAdmin: res.user.role === "ADMIN",
        });

        return res.user;
      },

      register: async (data) => {
        const res = await api.post<{
          user: UserProfile;
          sessionToken: string;
          verification: { emailVerificationToken: string; phoneOtpCode: string };
        }>("/api/auth/register", data);

        if (typeof document !== "undefined") {
          document.cookie = `auth_session=${res.sessionToken}; path=/; max-age=604800; SameSite=Lax`;
        }

        set({
          user: res.user,
          sessionToken: res.sessionToken,
          isAuthenticated: true,
          isAdmin: false, // NEW REGISTRATIONS ARE ALWAYS USER
        });

        return {
          user: res.user,
          emailToken: res.verification.emailVerificationToken,
          phoneOtp: res.verification.phoneOtpCode,
        };
      },

      logout: async () => {
        try {
          await api.post("/api/auth/logout");
        } catch {
          // ignore error on network drop
        }

        if (typeof document !== "undefined") {
          document.cookie = "auth_session=; path=/; max-age=0";
        }

        set({
          user: null,
          sessionToken: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },

      verifyEmail: async (token) => {
        await api.post("/api/auth/verify-email", { token });
        const cur = get().user;
        if (cur) {
          set({ user: { ...cur, isEmailVerified: true } });
        }
      },

      sendPhoneOtp: async (email) => {
        const res = await api.post<{ otpCode: string }>("/api/auth/phone/send-otp", { email });
        return res.otpCode;
      },

      verifyPhoneOtp: async (email, otpCode) => {
        await api.post("/api/auth/phone/verify-otp", { email, otpCode });
        const cur = get().user;
        if (cur) {
          set({ user: { ...cur, isPhoneVerified: true } });
        }
      },

      forgotPassword: async (email) => {
        const res = await api.post<{ resetToken?: string }>("/api/auth/forgot-password", { email });
        return res.resetToken;
      },

      resetPassword: async (token, newPassword) => {
        await api.post("/api/auth/reset-password", { token, newPassword });
      },

      changePassword: async (currentPassword, newPassword) => {
        await api.post("/api/auth/change-password", { currentPassword, newPassword });
      },
    }),
    {
      name: "sancta-maria-auth",
    }
  )
);
