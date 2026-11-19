import { NextRequest, NextResponse } from "next/server";
import { shippingService } from "@/server/shipping/ShippingService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const bosta = (shippingService as any).bostaProvider;

    const parsed = await bosta.handleWebhook(body);
    if (!parsed.trackingNumber) {
      return NextResponse.json({ success: false, error: "Missing trackingNumber in webhook" }, { status: 400 });
    }

    const updated = await shippingService.updateShipmentStatus(
      parsed.trackingNumber,
      parsed.newStatus,
      parsed.location,
      parsed.notes
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    console.error("[Shipping Webhook Error]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
