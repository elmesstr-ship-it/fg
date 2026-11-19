import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { validateRequest } from "@/server/validation/validator";
import { ValidationError, NotFoundError } from "@/server/errors/AppError";
import { authStore } from "@/server/auth/authStore";

export const POST = apiHandler(
  async (req: NextRequest) => {
    const body = await req.json();

    const validated = validateRequest(body, [
      { field: "token", required: true, type: "string" },
    ]);

    const user = authStore.findByEmailVerificationToken(validated.token);
    if (!user) {
      throw new ValidationError("Invalid or expired email verification token");
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    authStore.updateUser(user);

    return {
      message: "Email address verified successfully",
      email: user.email,
      isEmailVerified: true,
    };
  },
  { contextName: "AuthVerifyEmailAPI" }
);
