import { NextRequest, NextResponse } from "next/server";
import prisma from "@/server/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, email, phone } = body;

    if (!productId || !email) {
      return NextResponse.json(
        { success: false, error: "productId and email are required" },
        { status: 400 }
      );
    }

    const alert = await prisma.productAlert.create({
      data: {
        productId,
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: alert,
      message: "تم تسجيل طلب التنبيه. سنرسل إليك إشعاراً فور توفر المنتج بالمخزون.",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
