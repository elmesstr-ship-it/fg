import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/server/payments/PaymentService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, orderNumber, paymentMethod, metadata } = body;

    const identifier = orderId || orderNumber;
    if (!identifier) {
      return NextResponse.json(
        { success: false, error: "orderId or orderNumber is required" },
        { status: 400 }
      );
    }

    const result = await paymentService.initiatePayment(identifier, paymentMethod, metadata);

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
