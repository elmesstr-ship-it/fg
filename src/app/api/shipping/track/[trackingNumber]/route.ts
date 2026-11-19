import { NextRequest, NextResponse } from "next/server";
import { shippingService } from "@/server/shipping/ShippingService";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ trackingNumber: string }> }
) {
  try {
    const { trackingNumber } = await params;
    const trackingInfo = await shippingService.getTracking(decodeURIComponent(trackingNumber));

    if (!trackingInfo) {
      return NextResponse.json(
        { success: false, error: "لم يتم العثور على شحنة مطابقة لرقم التتبع المدخل" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: trackingInfo });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
