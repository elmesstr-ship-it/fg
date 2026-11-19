import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "FG Collective Luxury Fashion E-Commerce Platform",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    architecture: {
      separation: "Decoupled Next.js API & Services Layer",
      mockLayer: "Active (Realistic Fashion Mock Data)",
      databaseStatus: "SQLite / Prisma Seeded (Demo First)",
      telegramBot: "Ready for Telegram webhook",
      paymentGateway: "Modular (COD, Instapay, Cards)",
    },
  });
}
