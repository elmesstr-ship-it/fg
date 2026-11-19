import { NextRequest, NextResponse } from "next/server";
import prisma from "@/server/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, path, metadata } = body;

    if (!event) {
      return NextResponse.json({ success: false, error: "Event name is required" }, { status: 400 });
    }

    // Record event in activity log
    await prisma.activityLog.create({
      data: {
        adminId: "analytics_tracker",
        adminName: "Customer Analytics",
        action: `EVENT_${event.toUpperCase()}`,
        resource: path || "web",
        detailsAr: `تسجيل حدث (${event}) في المسار: ${path || "/"}`,
        detailsEn: `Logged analytics event (${event}) on path: ${path || "/"}`,
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      },
    });

    return NextResponse.json({ success: true, event, recordedAt: new Date().toISOString() });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
