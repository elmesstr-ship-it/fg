import { NextRequest, NextResponse } from "next/server";
import { shippingService } from "@/server/shipping/ShippingService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const governorate = searchParams.get("governorate") || "القاهرة";
    const subtotal = Number(searchParams.get("subtotal") || 0);

    const fee = await shippingService.calculateShippingFee(governorate, subtotal);

    return NextResponse.json({
      success: true,
      governorate,
      subtotal,
      fee,
      isFree: fee === 0,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
