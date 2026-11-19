import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { validateRequest } from "@/server/validation/validator";
import { db } from "@/services";

export const GET = apiHandler(
  async () => {
    return await db.coupons.getCoupons();
  },
  { contextName: "CouponsAPI" }
);

export const POST = apiHandler(
  async (req: NextRequest) => {
    const body = await req.json();

    const validated = validateRequest(body, [
      { field: "code", required: true, type: "string", min: 3 },
      { field: "discountType", required: true, type: "string" },
      { field: "discountValue", required: true, type: "number", min: 1 },
    ]);

    return await db.coupons.createCoupon({
      code: validated.code.toUpperCase(),
      discountType: validated.discountType,
      discountValue: validated.discountValue,
      minOrderAmount: validated.minOrderAmount,
      maxDiscountAmount: validated.maxDiscountAmount,
      startDate: validated.startDate || new Date().toISOString(),
      endDate: validated.endDate || "2027-12-31T23:59:59Z",
      isActive: true,
      description: validated.description || { ar: "خصم ترويجي مبارك", en: "Promotional discount" },
    });
  },
  { contextName: "CouponsAPI" }
);
