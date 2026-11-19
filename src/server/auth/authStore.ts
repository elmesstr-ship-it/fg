import { hashPassword, generateSecureToken } from "./security";
import prisma from "../db/prisma";

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  salt: string;
  phone: string;
  parishName?: string;
  role: "USER" | "ADMIN";
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: number;
  isPhoneVerified: boolean;
  phoneOtpCode?: string;
  phoneOtpExpires?: number;
  passwordResetToken?: string;
  passwordResetExpires?: number;
  createdAt: string;
  lastLoginAt?: string;
}

export interface UserSession {
  token: string;
  userId: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: number;
  expiresAt: number;
}

class AuthStore {
  private users: Map<string, UserAccount> = new Map();
  private sessions: Map<string, UserSession> = new Map();

  constructor() {
    this.seedInitialUsers();
  }

  private seedInitialUsers() {
    // 1. Initial Verified Customer
    const custHash = hashPassword("Customer@1234");
    const custUser: UserAccount = {
      id: "usr-cust-01",
      fullName: "مينا رفيق جرجس",
      email: "mina.girgis@example.com",
      passwordHash: custHash.hash,
      salt: custHash.salt,
      phone: "01201234567",
      parishName: "كنيسة السيدة العذراء مريم - المعادي",
      role: "USER",
      isEmailVerified: true,
      isPhoneVerified: true,
      createdAt: "2025-11-10T08:00:00Z",
    };
    this.users.set(custUser.email.toLowerCase(), custUser);

    // 2. Initial Protected Admin Account
    const adminHash = hashPassword("Admin@Holy2026");
    const adminUser: UserAccount = {
      id: "usr-admin-01",
      fullName: "مشرف النظام الإداري (رئيسي)",
      email: "admin@sanctamaria-store.com",
      passwordHash: adminHash.hash,
      salt: adminHash.salt,
      phone: "01000000001",
      parishName: "المقر الإداري - سانكتا ماريا",
      role: "ADMIN",
      isEmailVerified: true,
      isPhoneVerified: true,
      createdAt: "2025-01-01T00:00:00Z",
    };
    this.users.set(adminUser.email.toLowerCase(), adminUser);
  }

  public findByEmail(email: string): UserAccount | null {
    return this.users.get(email.toLowerCase().trim()) || null;
  }

  public findById(id: string): UserAccount | null {
    for (const user of this.users.values()) {
      if (user.id === id) return user;
    }
    return null;
  }

  public findByEmailVerificationToken(token: string): UserAccount | null {
    for (const user of this.users.values()) {
      if (
        user.emailVerificationToken === token &&
        user.emailVerificationExpires &&
        user.emailVerificationExpires > Date.now()
      ) {
        return user;
      }
    }
    return null;
  }

  public findByPasswordResetToken(token: string): UserAccount | null {
    for (const user of this.users.values()) {
      if (
        user.passwordResetToken === token &&
        user.passwordResetExpires &&
        user.passwordResetExpires > Date.now()
      ) {
        return user;
      }
    }
    return null;
  }

  public createUser(user: UserAccount): UserAccount {
    this.users.set(user.email.toLowerCase().trim(), user);

    // Asynchronously synchronize to persistent Prisma database
    prisma.user.upsert({
      where: { email: user.email.toLowerCase().trim() },
      update: {
        passwordHash: user.passwordHash,
        salt: user.salt,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
      },
      create: {
        email: user.email.toLowerCase().trim(),
        passwordHash: user.passwordHash,
        salt: user.salt,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        profile: {
          create: {
            fullName: user.fullName,
            parishName: user.parishName,
          },
        },
      },
    }).catch((err) => {
      console.error("[AuthStore] Failed to persist user to Prisma:", err);
    });

    return user;
  }

  public updateUser(user: UserAccount): UserAccount {
    this.users.set(user.email.toLowerCase().trim(), user);

    // Asynchronously synchronize to persistent Prisma database
    prisma.user.updateMany({
      where: { email: user.email.toLowerCase().trim() },
      data: {
        passwordHash: user.passwordHash,
        salt: user.salt,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
      },
    }).catch((err) => {
      console.error("[AuthStore] Failed to update user in Prisma:", err);
    });

    return user;
  }

  // Session Management
  public createSession(user: UserAccount, durationHours = 24 * 7): UserSession {
    const token = generateSecureToken(32);
    const now = Date.now();
    const expiresAt = now + durationHours * 60 * 60 * 1000;

    const session: UserSession = {
      token,
      userId: user.id,
      email: user.email,
      role: user.role,
      createdAt: now,
      expiresAt,
    };

    this.sessions.set(token, session);
    user.lastLoginAt = new Date().toISOString();
    return session;
  }

  public getSession(token: string): UserSession | null {
    const session = this.sessions.get(token);
    if (!session) return null;

    if (session.expiresAt < Date.now()) {
      this.sessions.delete(token);
      return null;
    }

    return session;
  }

  public deleteSession(token: string): boolean {
    return this.sessions.delete(token);
  }
}

export const authStore = new AuthStore();
