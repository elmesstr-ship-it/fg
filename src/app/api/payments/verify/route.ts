import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/server/payments/PaymentService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transactionId, status, payload } = body;

    if (!transactionId) {
      return NextResponse.json(
        { success: false, error: "transactionId is required" },
        { status: 400 }
      );
    }

    const result = await paymentService.verifyPayment(transactionId, status, payload);

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
