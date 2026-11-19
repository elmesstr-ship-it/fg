import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { validateRequest } from "@/server/validation/validator";
import { UnauthorizedError } from "@/server/errors/AppError";
import { verifyPassword } from "@/server/auth/security";
import { authStore } from "@/server/auth/authStore";

export const POST = apiHandler(
  async (req: NextRequest) => {
    const body = await req.json();

    const validated = validateRequest(body, [
      { field: "email", required: true, type: "string", email: true },
      { field: "password", required: true, type: "string" },
    ]);

    const user = authStore.findByEmail(validated.email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isMatch = verifyPassword(validated.password, user.passwordHash, user.salt);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const session = authStore.createSession(user);

    return {
      message: "Login successful",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        parishName: user.parishName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
      },
      sessionToken: session.token,
    };
  },
  { contextName: "AuthLoginAPI" }
);
