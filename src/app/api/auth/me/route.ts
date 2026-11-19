import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { requireAuth } from "@/server/middleware/auth";

export const GET = apiHandler(
  async (req: NextRequest) => {
    const user = requireAuth(req);
    return {
      authenticated: true,
      user,
    };
  },
  { contextName: "AuthMeAPI" }
);
