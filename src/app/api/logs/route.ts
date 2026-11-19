import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { requireAdmin } from "@/server/middleware/auth";
import prisma from "@/server/db/prisma";

export const GET = apiHandler(
  async (req: NextRequest) => {
    requireAdmin(req);
    const searchParams = req.nextUrl.searchParams;
    const action = searchParams.get("action") || undefined;
    const limit = searchParams.has("limit") ? Number(searchParams.get("limit")) : 50;

    const where: any = {};
    if (action) where.action = action;

    const logs = await prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return logs.map((l) => ({
      id: l.id,
      adminId: l.adminId,
      adminName: l.adminName,
      action: l.action,
      resource: l.resource,
      details: {
        ar: l.detailsAr,
        en: l.detailsEn,
      },
      ipAddress: l.ipAddress,
      createdAt: l.createdAt.toISOString(),
    }));
  },
  { contextName: "ActivityLogsAPI" }
);
