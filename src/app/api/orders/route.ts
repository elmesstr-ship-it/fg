import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { validateRequest } from "@/server/validation/validator";
import { CreateOrderDTO } from "@/services/interfaces/IOrderService";
import { db } from "@/services";

export const GET = apiHandler(
  async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams;
    const status = (searchParams.get("status") as any) || undefined;
    const customerEmail = searchParams.get("customerEmail") || undefined;
    const search = searchParams.get("search") || undefined;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;
    const paymentMethod = searchParams.get("paymentMethod") || undefined;

    return await db.orders.getOrders({
      status,
      customerEmail,
      search,
      startDate,
      endDate,
      paymentMethod,
    });
  },
  { contextName: "OrdersAPI" }
);

export const POST = apiHandler(
  async (req: NextRequest) => {
    const body = await req.json();

    const validated = validateRequest<CreateOrderDTO>(body, [
      { field: "customerName", required: true, type: "string", min: 3 },
      { field: "customerEmail", required: true, type: "string", email: true },
      { field: "customerPhone", required: true, type: "string", min: 10 },
      { field: "shippingAddress", required: true, type: "object" },
      { field: "items", required: true, type: "array" },
      { field: "paymentMethod", required: true, type: "string" },
    ]);

    if (validated.items.length === 0) {
      throw new Error("Order must contain at least 1 item");
    }

    return await db.orders.createOrder(validated);
  },
  { contextName: "OrdersAPI" }
);
