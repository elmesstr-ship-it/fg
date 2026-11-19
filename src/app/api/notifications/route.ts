import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { db } from "@/services";

export const GET = apiHandler(
  async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams;
    const type = (searchParams.get("type") as any) || undefined;
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const limit = searchParams.has("limit") ? Number(searchParams.get("limit")) : undefined;

    return await db.notifications.getNotifications({ type, unreadOnly, limit });
  },
  { contextName: "NotificationsAPI" }
);

export const POST = apiHandler(
  async (req: NextRequest) => {
    const body = await req.json();

    if (body.action === "mark_all_read") {
      const ok = await db.notifications.markAllAsRead();
      return { success: ok };
    }

    return await db.notifications.createNotification(body);
  },
  { contextName: "NotificationsAPI" }
);
