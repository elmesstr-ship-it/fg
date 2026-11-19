import { NextRequest, NextResponse } from "next/server";
import { shippingService } from "@/server/shipping/ShippingService";
import { requireAdmin } from "@/server/middleware/auth";

export async function PATCH(req: NextRequest) {
  try {
    requireAdmin(req);
    const body = await req.json();
    const { trackingNumber, status, location, notes } = body;

    if (!trackingNumber || !status) {
      return NextResponse.json(
        { success: false, error: "trackingNumber and status are required" },
        { status: 400 }
      );
    }

    const updated = await shippingService.updateShipmentStatus(
      trackingNumber,
      status,
      location,
      notes
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
