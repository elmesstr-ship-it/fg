import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { authStore } from "@/server/auth/authStore";

export const POST = apiHandler(
  async (req: NextRequest) => {
    let token = req.cookies.get("auth_session")?.value;
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }

    if (token) {
      authStore.deleteSession(token);
    }

    return { message: "Logged out successfully" };
  },
  { contextName: "AuthLogoutAPI" }
);
