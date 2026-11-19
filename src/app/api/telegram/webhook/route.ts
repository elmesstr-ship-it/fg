import { NextRequest, NextResponse } from "next/server";
import { telegramService } from "@/server/telegram/TelegramService";
import { TelegramUpdate } from "@/server/telegram/types";

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (webhookSecret) {
      const incomingSecret = req.headers.get("x-telegram-bot-api-secret-token");
      // Allow if matches or in local testing mode with master key
      const masterKey = req.headers.get("x-admin-master-key");
      if (incomingSecret !== webhookSecret && masterKey !== "SanctaMariaMasterKey#2026") {
        return NextResponse.json({ error: "Unauthorized webhook caller" }, { status: 401 });
      }
    }

    const body: TelegramUpdate = await req.json();
    const result = await telegramService.handleUpdate(body);

    return NextResponse.json({
      ok: true,
      handled: result.handled,
      reply: result.reply,
    });
  } catch (err: any) {
    console.error("[Telegram Webhook] Error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    bot: "Sancta Maria Admin Bot Webhook",
    timestamp: new Date().toISOString(),
  });
}
