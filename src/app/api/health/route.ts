import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "Sancta Maria Church Products E-Commerce Platform",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    architecture: {
      separation: "Decoupled Next.js API & Services Layer",
      mockLayer: "Active (Realistic Mock Data Repository)",
      databaseStatus: "Prepared for PostgreSQL & Prisma (Phase 5)",
      telegramBot: "Ready for Telegram webhook (Phase 7)",
      paymentGateway: "Modular (COD, Vodafone Cash, Cards - Phase 6)",
    },
  });
}
