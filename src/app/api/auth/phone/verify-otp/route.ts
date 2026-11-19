import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { validateRequest } from "@/server/validation/validator";
import { ValidationError, NotFoundError } from "@/server/errors/AppError";
import { authStore } from "@/server/auth/authStore";

export const POST = apiHandler(
  async (req: NextRequest) => {
    const body = await req.json();

    const validated = validateRequest(body, [
      { field: "email", required: true, type: "string", email: true },
      { field: "otpCode", required: true, type: "string", min: 6, max: 6 },
    ]);

    const user = authStore.findByEmail(validated.email);
    if (!user) {
      throw new NotFoundError("User account");
    }

    if (
      !user.phoneOtpCode ||
      user.phoneOtpCode !== validated.otpCode ||
      !user.phoneOtpExpires ||
      user.phoneOtpExpires < Date.now()
    ) {
      throw new ValidationError("Invalid or expired 6-digit OTP code");
    }

    user.isPhoneVerified = true;
    user.phoneOtpCode = undefined;
    user.phoneOtpExpires = undefined;
    authStore.updateUser(user);

    return {
      message: "Egyptian mobile number verified successfully",
      phone: user.phone,
      isPhoneVerified: true,
    };
  },
  { contextName: "AuthVerifyOtpAPI" }
);
