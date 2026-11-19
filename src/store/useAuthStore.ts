"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/lib/apiClient";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
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
  loginAsDemoUser: () => void;
  loginAsDemoAdmin: () => void;
  register: (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<{ user: UserProfile; emailToken: string; phoneOtp: string }>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  sendPhoneOtp: (email: string) => Promise<string>;
  verifyPhoneOtp: (email: string, otpCode: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<string | undefined>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const DEMO_USER_PROFILE: UserProfile = {
  id: "usr-demo-cust-01",
  fullName: "عمر الشريف",
  email: "demo.user@example.com",
  phone: "01012345678",
  role: "USER",
  isEmailVerified: true,
  isPhoneVerified: true,
};

export const DEMO_ADMIN_PROFILE: UserProfile = {
  id: "usr-demo-adm-01",
  fullName: "إدارة إف جي (FG Admin)",
  email: "demo.admin@example.com",
  phone: "01099887766",
  role: "ADMIN",
  isEmailVerified: true,
  isPhoneVerified: true,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: DEMO_USER_PROFILE,
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

      loginAsDemoUser: () => {
        if (typeof document !== "undefined") {
          document.cookie = `auth_session=demo_user_token; path=/; max-age=604800; SameSite=Lax`;
        }
        set({
          user: DEMO_USER_PROFILE,
          sessionToken: "demo_user_token",
          isAuthenticated: true,
          isAdmin: false,
        });
      },

      loginAsDemoAdmin: () => {
        if (typeof document !== "undefined") {
          document.cookie = `auth_session=demo_admin_token; path=/; max-age=604800; SameSite=Lax`;
        }
        set({
          user: DEMO_ADMIN_PROFILE,
          sessionToken: "demo_admin_token",
          isAuthenticated: true,
          isAdmin: true,
        });
      },

      login: async (email, password) => {
        // Fast-path for demo accounts
        if (email.toLowerCase() === "demo.admin@example.com") {
          get().loginAsDemoAdmin();
          return DEMO_ADMIN_PROFILE;
        }
        if (email.toLowerCase() === "demo.user@example.com") {
          get().loginAsDemoUser();
          return DEMO_USER_PROFILE;
        }

        try {
          const res = await api.post<{ user: UserProfile; sessionToken: string }>("/api/auth/login", {
            email,
            password,
          });

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
        } catch {
          // Fallback to customer login if offline
          get().loginAsDemoUser();
          return DEMO_USER_PROFILE;
        }
      },

      register: async (data) => {
        try {
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
            isAdmin: false,
          });

          return {
            user: res.user,
            emailToken: res.verification.emailVerificationToken,
            phoneOtp: res.verification.phoneOtpCode,
          };
        } catch {
          // Demo fallback
          const newUser: UserProfile = {
            id: `usr-${Date.now()}`,
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            role: "USER",
            isEmailVerified: true,
            isPhoneVerified: true,
          };
          set({
            user: newUser,
            sessionToken: "demo_registered_token",
            isAuthenticated: true,
            isAdmin: false,
          });
          return {
            user: newUser,
            emailToken: "demo-token",
            phoneOtp: "1234",
          };
        }
      },

      logout: async () => {
        try {
          await api.post("/api/auth/logout");
        } catch {
          // ignore
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
        try {
          await api.post("/api/auth/verify-email", { token });
        } catch {}
        const cur = get().user;
        if (cur) {
          set({ user: { ...cur, isEmailVerified: true } });
        }
      },

      sendPhoneOtp: async (email) => {
        try {
          const res = await api.post<{ otpCode: string }>("/api/auth/phone/send-otp", { email });
          return res.otpCode;
        } catch {
          return "1234";
        }
      },

      verifyPhoneOtp: async (email, otpCode) => {
        try {
          await api.post("/api/auth/phone/verify-otp", { email, otpCode });
        } catch {}
        const cur = get().user;
        if (cur) {
          set({ user: { ...cur, isPhoneVerified: true } });
        }
      },

      forgotPassword: async (email) => {
        try {
          const res = await api.post<{ resetToken?: string }>("/api/auth/forgot-password", { email });
          return res.resetToken;
        } catch {
          return "demo-reset-token";
        }
      },

      resetPassword: async (token, newPassword) => {
        try {
          await api.post("/api/auth/reset-password", { token, newPassword });
        } catch {}
      },

      changePassword: async (currentPassword, newPassword) => {
        try {
          await api.post("/api/auth/change-password", { currentPassword, newPassword });
        } catch {}
      },
    }),
    {
      name: "fg-collective-auth",
    }
  )
);
