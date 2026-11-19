import { NextRequest, NextResponse } from "next/server";
import { shippingService } from "@/server/shipping/ShippingService";
import { requireAdmin } from "@/server/middleware/auth";

export async function POST(req: NextRequest) {
  try {
    // Both internal order creation and admin manual shipment creation can use this
    const body = await req.json();
    const { orderId, orderNumber, providerKey, manualTrackingNumber, courierNotes } = body;

    const identifier = orderId || orderNumber;
    if (!identifier) {
      return NextResponse.json({ success: false, error: "orderId or orderNumber is required" }, { status: 400 });
    }

    const result = await shippingService.createShipment(identifier, {
      providerKey,
      manualTrackingNumber,
      courierNotes,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
