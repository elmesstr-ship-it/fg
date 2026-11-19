import { NextRequest, NextResponse } from "next/server";
import prisma from "@/server/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const inquiry = await prisma.supportMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : null,
        subject: subject ? subject.trim() : "استفسار عام",
        message: message.trim(),
        status: "open",
      },
    });

    // Also notify admins in notification center
    await prisma.notification.create({
      data: {
        type: "customer_support",
        priority: "medium",
        titleAr: `رسالة دعم فني جديدة من ${name}`,
        titleEn: `New Support Inquiry from ${name}`,
        messageAr: `${subject || "استفسار"}: ${message.slice(0, 100)}...`,
        messageEn: `${subject || "Inquiry"}: ${message.slice(0, 100)}...`,
        resourceId: inquiry.id,
        resourceType: "customer",
        actionUrl: "/admin/support",
        isRead: false,
      },
    });

    return NextResponse.json({
      success: true,
      data: inquiry,
      message: "تم إرسال رسالتكم لفريق خدمة عملاء سانكتا ماريا بنجاح",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const messages = await prisma.supportMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ success: true, data: messages });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
