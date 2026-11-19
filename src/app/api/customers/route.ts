import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { requireAdmin } from "@/server/middleware/auth";
import { db } from "@/services";

export const GET = apiHandler(
  async (req: NextRequest) => {
    requireAdmin(req);
    return await db.customers.getCustomers();
  },
  { contextName: "CustomersListAPI" }
);
