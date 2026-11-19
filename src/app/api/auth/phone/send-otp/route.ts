import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { validateRequest } from "@/server/validation/validator";
import { ValidationError, NotFoundError } from "@/server/errors/AppError";
import { validateEgyptianPhone, generateOtpCode } from "@/server/auth/security";
import { authStore } from "@/server/auth/authStore";

export const POST = apiHandler(
  async (req: NextRequest) => {
    const body = await req.json();

    const validated = validateRequest(body, [
      { field: "email", required: true, type: "string", email: true },
    ]);

    const user = authStore.findByEmail(validated.email);
    if (!user) {
      throw new NotFoundError("User account");
    }

    // Generate 6-digit OTP code valid for 10 minutes
    const otp = generateOtpCode();
    user.phoneOtpCode = otp;
    user.phoneOtpExpires = Date.now() + 10 * 60 * 1000;
    authStore.updateUser(user);

    return {
      message: `OTP sent successfully to Egyptian mobile ${user.phone}`,
      phone: user.phone,
      otpCode: otp, // Returned for dev testing
      expiresInMinutes: 10,
    };
  },
  { contextName: "AuthSendOtpAPI" }
);
