import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { validateRequest } from "@/server/validation/validator";
import { requireAuth } from "@/server/middleware/auth";
import { UnauthorizedError } from "@/server/errors/AppError";
import { verifyPassword, hashPassword } from "@/server/auth/security";
import { authStore } from "@/server/auth/authStore";

export const POST = apiHandler(
  async (req: NextRequest) => {
    const authUser = requireAuth(req);
    const body = await req.json();

    const validated = validateRequest(body, [
      { field: "currentPassword", required: true, type: "string" },
      { field: "newPassword", required: true, type: "string", min: 8 },
    ]);

    const user = authStore.findById(authUser.id);
    if (!user) {
      throw new UnauthorizedError("User account not found");
    }

    const isMatch = verifyPassword(validated.currentPassword, user.passwordHash, user.salt);
    if (!isMatch) {
      throw new UnauthorizedError("Current password entered is incorrect");
    }

    const { hash, salt } = hashPassword(validated.newPassword);
    user.passwordHash = hash;
    user.salt = salt;
    authStore.updateUser(user);

    return {
      message: "Password changed successfully",
    };
  },
  { contextName: "AuthChangePasswordAPI" }
);
