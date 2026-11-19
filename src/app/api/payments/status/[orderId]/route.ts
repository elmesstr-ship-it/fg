import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/server/payments/PaymentService";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const statusData = await paymentService.getPaymentStatus(orderId);
    return NextResponse.json({ success: true, data: statusData });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 404 });
  }
}
