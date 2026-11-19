import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { validateRequest } from "@/server/validation/validator";
import { ForbiddenError, ConflictError, ValidationError } from "@/server/errors/AppError";
import { getAuthenticatedUser } from "@/server/middleware/auth";
import { hashPassword, validateEgyptianPhone } from "@/server/auth/security";
import { authStore, UserAccount } from "@/server/auth/authStore";

const MASTER_ADMIN_SECRET = process.env.ADMIN_MASTER_KEY || "FGCollectiveMasterKey#2026";

export const POST = apiHandler(
  async (req: NextRequest) => {
    // 1. Verify Administrative Privilege
    const authUser = getAuthenticatedUser(req);
    const masterSecretHeader = req.headers.get("x-admin-master-key");

    const isAuthorizedAdmin = authUser && authUser.role === "ADMIN";
    const hasMasterSecret = masterSecretHeader && masterSecretHeader === MASTER_ADMIN_SECRET;

    if (!isAuthorizedAdmin && !hasMasterSecret) {
      throw new ForbiddenError(
        "Administrative account creation is strictly protected. Valid ADMIN session or Master Key required."
      );
    }

    // 2. Validate input
    const body = await req.json();
    const validated = validateRequest(body, [
      { field: "fullName", required: true, type: "string", min: 3 },
      { field: "email", required: true, type: "string", email: true },
      { field: "phone", required: true, type: "string" },
      { field: "password", required: true, type: "string", min: 8 },
    ]);

    const phoneCheck = validateEgyptianPhone(validated.phone);
    if (!phoneCheck.isValid) {
      throw new ValidationError("Invalid Egyptian mobile number format.");
    }

    const existing = authStore.findByEmail(validated.email);
    if (existing) {
      throw new ConflictError("An account with this email already exists.");
    }

    const { hash, salt } = hashPassword(validated.password);

    const newAdmin: UserAccount = {
      id: "admin-" + Date.now(),
      fullName: validated.fullName.trim(),
      email: validated.email.toLowerCase().trim(),
      passwordHash: hash,
      salt: salt,
      phone: phoneCheck.normalizedPhone!,
      parishName: body.parishName || "إدارة المتجر المركزية",
      role: "ADMIN",
      isEmailVerified: true,
      isPhoneVerified: true,
      createdAt: new Date().toISOString(),
    };

    authStore.createUser(newAdmin);

    return {
      message: "Administrative account created successfully via secure protocol.",
      admin: {
        id: newAdmin.id,
        fullName: newAdmin.fullName,
        email: newAdmin.email,
        phone: newAdmin.phone,
        role: newAdmin.role,
      },
    };
  },
  { contextName: "AdminCreateAccountAPI" }
);
