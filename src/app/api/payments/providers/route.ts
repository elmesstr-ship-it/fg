import { NextResponse } from "next/server";
import { paymentService } from "@/server/payments/PaymentService";

export async function GET() {
  try {
    const providers = await paymentService.getAvailableProviders();
    return NextResponse.json({ success: true, data: providers });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
