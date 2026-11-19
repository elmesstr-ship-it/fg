import { NextRequest } from "next/server";
import { UnauthorizedError, ForbiddenError } from "../errors/AppError";
import { authStore, UserAccount } from "../auth/authStore";

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  role: "USER" | "ADMIN";
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  parishName?: string;
}

export function getAuthenticatedUser(req: NextRequest): AuthenticatedUser | null {
  // 1. Try to read from Authorization: Bearer <token>
  const authHeader = req.headers.get("authorization");
  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  }

  // 2. Try to read from auth_session cookie
  if (!token) {
    const cookieToken = req.cookies.get("auth_session")?.value;
    if (cookieToken) {
      token = cookieToken;
    }
  }

  if (!token) {
    return null;
  }

  const session = authStore.getSession(token);
  if (!session) {
    return null;
  }

  const user = authStore.findById(session.userId);
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    isPhoneVerified: user.isPhoneVerified,
    parishName: user.parishName,
  };
}

export function requireAuth(req: NextRequest): AuthenticatedUser {
  const user = getAuthenticatedUser(req);
  if (!user) {
    throw new UnauthorizedError("Active authentication session required");
  }
  return user;
}

const MASTER_ADMIN_SECRET = process.env.ADMIN_MASTER_KEY || "SanctaMariaMasterKey#2026";

export function requireAdmin(req: NextRequest): AuthenticatedUser {
  // 1. Check Master Key Header
  const masterKey = req.headers.get("x-admin-master-key");
  if (masterKey && masterKey === MASTER_ADMIN_SECRET) {
    return {
      id: "admin-master-sys",
      email: "admin@sanctamaria-store.com",
      fullName: "مشرف النظام الإداري (رئيسي)",
      role: "ADMIN",
      isEmailVerified: true,
      isPhoneVerified: true,
      parishName: "المقر الإداري - سانكتا ماريا",
    };
  }

  // 2. Check Active Session
  const user = requireAuth(req);
  if (user.role !== "ADMIN") {
    throw new ForbiddenError("Access denied. Administrative role is strictly server-enforced.");
  }
  return user;
}
