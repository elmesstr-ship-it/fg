import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/server/middleware/auth";
import { telegramService } from "@/server/telegram/TelegramService";

export async function POST(req: NextRequest) {
  try {
    requireAdmin(req);
    const body = await req.json().catch(() => ({}));
    const { action, payload } = body;

    let result: any = null;

    if (action === "test_order") {
      const mockOrder = {
        id: "test-order-id-123",
        orderNumber: "SM-261030-9999",
        customerName: "شريف موريس (اختبار إشعارات)",
        customerPhone: "01234567890",
        shippingAddress: { governorate: "الإسكندرية" },
        paymentMethod: "cash_on_delivery",
        total: 1250,
        items: [
          {
            productName: "صليب خشب زيتون مقدّس",
            quantity: 2,
            price: 500,
          },
          {
            productName: "شمعة كنسية معطرة بالبخور",
            quantity: 1,
            price: 250,
          },
        ],
      };
      await telegramService.notifyNewOrder(mockOrder);
      result = { message: "Test order notification dispatched" };
    } else if (action === "test_user") {
      const mockUser = {
        email: "demo.user@example.com",
        phone: "01201234567",
      };
      const mockProfile = {
        fullName: "عمر الشريف",
        parishName: "FG VIP Member",
      };
      await telegramService.notifyNewUser(mockUser, mockProfile);
      result = { message: "Test new user notification dispatched" };
    } else if (action === "test_stock") {
      const mockProd = {
        name: { ar: "هودي إف جي الثقيل 380 GSM", en: "FG Core Heavyweight Hoodie" },
        sku: "FG-HD-380-BLK",
      };
      await telegramService.notifyStockAlert(mockProd, 2);
      result = { message: "Test stock alert dispatched" };
    } else if (action === "test_owner") {
      await telegramService.notifyOwner(
        "تنبيه أمان أصحاب المتجر",
        "تم تسجيل دخول جديد بصلاحيات إدارة عليا من عنوان IP: 192.168.1.100"
      );
      result = { message: "Owner notification dispatched" };
    } else {
      // General test broadcast
      await telegramService.broadcast(
        "🔔 <b>رسالة اختبار تجريبية من لوحة تحكم إف جي كوليكتيف!</b>\nالبوت متصل بنجاح وجاهز لاستقبال الإشعارات والأوامر.",
        "VIEWER",
        { parse_mode: "HTML" }
      );
      result = { message: "General broadcast sent" };
    }

    return NextResponse.json({
      success: true,
      data: result,
      sentCount: telegramService.sentMessagesLog.length,
      latestLog: telegramService.sentMessagesLog[telegramService.sentMessagesLog.length - 1],
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    return NextResponse.json({
      success: true,
      botConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN),
      ownerId: process.env.TELEGRAM_OWNER_ID || "9988776655",
      recentMessagesCount: telegramService.sentMessagesLog.length,
      recentMessages: telegramService.sentMessagesLog.slice(-5),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 401 });
  }
}
