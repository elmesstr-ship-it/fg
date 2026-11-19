import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/server/payments/PaymentService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const providerKey = req.nextUrl.searchParams.get("provider") || "card_paymob";

    const provider = Array.from((paymentService as any).providers.values()).find(
      (p: any) => p.key === providerKey
    ) as any;

    if (!provider || !provider.handleWebhook) {
      return NextResponse.json({ success: false, error: "Webhook not supported for provider" }, { status: 400 });
    }

    const result = await provider.handleWebhook(body);

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    console.error("[Payment Webhook Error]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
