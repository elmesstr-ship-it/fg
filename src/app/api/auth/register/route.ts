import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { validateRequest } from "@/server/validation/validator";
import { ConflictError, ValidationError } from "@/server/errors/AppError";
import { hashPassword, generateSecureToken, generateOtpCode, validateEgyptianPhone } from "@/server/auth/security";
import { authStore, UserAccount } from "@/server/auth/authStore";
import { telegramService } from "@/server/telegram/TelegramService";

export const POST = apiHandler(
  async (req: NextRequest) => {
    const body = await req.json();

    // 1. Validation
    const validated = validateRequest(body, [
      { field: "fullName", required: true, type: "string", min: 3 },
      { field: "email", required: true, type: "string", email: true },
      { field: "phone", required: true, type: "string" },
      { field: "password", required: true, type: "string", min: 8 },
    ]);

    // 2. Validate Egyptian Phone Format
    const phoneCheck = validateEgyptianPhone(validated.phone);
    if (!phoneCheck.isValid) {
      throw new ValidationError(
        "Invalid Egyptian mobile number. Must start with 010, 011, 012, or 015 followed by 8 digits."
      );
    }

    // 3. Check for existing email
    const existing = authStore.findByEmail(validated.email);
    if (existing) {
      throw new ConflictError("An account with this email address already exists.");
    }

    // 4. Hash password with PBKDF2 + salt
    const { hash, salt } = hashPassword(validated.password);

    // 5. Verification tokens
    const emailToken = generateSecureToken(24);
    const phoneOtp = generateOtpCode();

    // 6. Security Rule: ALWAYS assign USER role
    const newUser: UserAccount = {
      id: "usr-" + Date.now(),
      fullName: validated.fullName.trim(),
      email: validated.email.toLowerCase().trim(),
      passwordHash: hash,
      salt: salt,
      phone: phoneCheck.normalizedPhone!,
      parishName: body.parishName ? String(body.parishName).trim() : undefined,
      role: "USER", // STRICTLY SERVER ENFORCED
      isEmailVerified: false,
      emailVerificationToken: emailToken,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      isPhoneVerified: false,
      phoneOtpCode: phoneOtp,
      phoneOtpExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
      createdAt: new Date().toISOString(),
    };

    authStore.createUser(newUser);

    // Notify Telegram Admins & Owner of new registration
    telegramService.notifyNewUser(newUser, { fullName: newUser.fullName, parishName: newUser.parishName }).catch((err) => {
      console.warn("[Telegram] Failed to broadcast new user:", err.message);
    });

    // 7. Create Session
    const session = authStore.createSession(newUser);

    return {
      message: "User registered successfully",
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        parishName: newUser.parishName,
        role: newUser.role,
        isEmailVerified: newUser.isEmailVerified,
        isPhoneVerified: newUser.isPhoneVerified,
      },
      verification: {
        emailVerificationToken: emailToken, // Returned for dev testing
        phoneOtpCode: phoneOtp, // Returned for dev testing
      },
      sessionToken: session.token,
    };
  },
  { contextName: "AuthRegisterAPI" }
);
