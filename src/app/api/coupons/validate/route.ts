import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { validateRequest } from "@/server/validation/validator";
import { db } from "@/services";

export const POST = apiHandler(
  async (req: NextRequest) => {
    const body = await req.json();

    const validated = validateRequest(body, [
      { field: "code", required: true, type: "string" },
      { field: "cartTotal", required: true, type: "number", min: 0 },
    ]);

    return await db.coupons.validateCoupon(validated.code, validated.cartTotal);
  },
  { contextName: "CouponValidationAPI" }
);
