import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { validateRequest } from "@/server/validation/validator";
import { ValidationError } from "@/server/errors/AppError";
import { hashPassword } from "@/server/auth/security";
import { authStore } from "@/server/auth/authStore";

export const POST = apiHandler(
  async (req: NextRequest) => {
    const body = await req.json();

    const validated = validateRequest(body, [
      { field: "token", required: true, type: "string" },
      { field: "newPassword", required: true, type: "string", min: 8 },
    ]);

    const user = authStore.findByPasswordResetToken(validated.token);
    if (!user) {
      throw new ValidationError("Invalid or expired password reset token");
    }

    const { hash, salt } = hashPassword(validated.newPassword);
    user.passwordHash = hash;
    user.salt = salt;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    authStore.updateUser(user);

    return {
      message: "Password has been successfully reset. You may now sign in with your new credentials.",
      email: user.email,
    };
  },
  { contextName: "AuthResetPasswordAPI" }
);
