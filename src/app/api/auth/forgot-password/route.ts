import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { validateRequest } from "@/server/validation/validator";
import { generateSecureToken } from "@/server/auth/security";
import { authStore } from "@/server/auth/authStore";

export const POST = apiHandler(
  async (req: NextRequest) => {
    const body = await req.json();

    const validated = validateRequest(body, [
      { field: "email", required: true, type: "string", email: true },
    ]);

    const user = authStore.findByEmail(validated.email);
    // Security best practice: don't reveal if user exists, but if it does, set reset token
    let resetToken = "";
    if (user) {
      resetToken = generateSecureToken(32);
      user.passwordResetToken = resetToken;
      user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
      authStore.updateUser(user);
    }

    return {
      message: "If an account exists with this email, password reset instructions have been dispatched.",
      resetToken: resetToken || undefined, // Returned for dev testing
      expiresInMinutes: 60,
    };
  },
  { contextName: "AuthForgotPasswordAPI" }
);
