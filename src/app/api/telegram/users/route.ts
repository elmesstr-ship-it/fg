import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/server/middleware/auth";
import prisma from "@/server/db/prisma";

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);

    const users = await prisma.telegramUser.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: users });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    requireAdmin(req);
    const body = await req.json();
    const { telegramId, role, firstName, username } = body;

    if (!telegramId || !role) {
      return NextResponse.json({ success: false, error: "telegramId and role are required" }, { status: 400 });
    }

    const updated = await prisma.telegramUser.upsert({
      where: { telegramId: String(telegramId) },
      update: {
        role,
        firstName: firstName || undefined,
        username: username || undefined,
        isActive: true,
      },
      create: {
        telegramId: String(telegramId),
        role,
        firstName: firstName || "Authorized Staff",
        username: username || null,
        isActive: true,
        addedBy: "admin_dashboard",
      },
    });

    // Audit log
    await prisma.activityLog.create({
      data: {
        adminId: "admin_dashboard",
        adminName: "Admin Dashboard",
        action: "ADD_TELEGRAM_USER_WEB",
        resource: telegramId,
        detailsAr: `تم تفويض حساب تيليجرام (${telegramId}) برتبة [${role}] من لوحة الإدارة`,
        detailsEn: `Authorized Telegram user (${telegramId}) with role [${role}] via web`,
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const telegramId = searchParams.get("telegramId");

    if (!telegramId) {
      return NextResponse.json({ success: false, error: "telegramId is required" }, { status: 400 });
    }

    const ownerId = process.env.TELEGRAM_OWNER_ID || "9988776655";
    if (telegramId === ownerId) {
      return NextResponse.json({ success: false, error: "Cannot remove primary owner" }, { status: 400 });
    }

    await prisma.telegramUser.update({
      where: { telegramId },
      data: { isActive: false },
    });

    await prisma.activityLog.create({
      data: {
        adminId: "admin_dashboard",
        adminName: "Admin Dashboard",
        action: "DEACTIVATE_TELEGRAM_USER_WEB",
        resource: telegramId,
        detailsAr: `تم إلغاء تفعيل حساب تيليجرام (${telegramId}) من لوحة الإدارة`,
        detailsEn: `Deactivated Telegram user (${telegramId}) via web`,
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      },
    });

    return NextResponse.json({ success: true, message: "User deactivated" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
