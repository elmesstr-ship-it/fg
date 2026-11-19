import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { db } from "@/services";

export const PATCH = apiHandler(
  async (req: NextRequest, { params }) => {
    const { id } = await params!;
    const body = await req.json();

    if (body.isRead !== undefined) {
      const ok = await db.notifications.markAsRead(id);
      return { success: ok, id };
    }

    return { id };
  },
  { contextName: "NotificationItemAPI" }
);

export const DELETE = apiHandler(
  async (_req: NextRequest, { params }) => {
    const { id } = await params!;
    const ok = await db.notifications.deleteNotification(id);
    return { deleted: ok, id };
  },
  { contextName: "NotificationDeleteAPI" }
);
