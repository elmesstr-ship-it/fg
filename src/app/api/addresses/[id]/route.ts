import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { getAuthenticatedUser } from "@/server/middleware/auth";
import prisma from "@/server/db/prisma";

export const PATCH = apiHandler(
  async (req: NextRequest, { params }) => {
    const user = getAuthenticatedUser(req);
    const userId = user?.id || (await prisma.user.findFirst({ where: { role: "USER" } }))?.id;
    const { id } = await params!;
    const body = await req.json();

    if (body.isDefault && userId) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.address.update({
      where: { id },
      data: {
        isDefault: body.isDefault,
        title: body.title,
        notes: body.notes,
      },
    });

    return updated;
  },
  { contextName: "AddressUpdateAPI" }
);

export const DELETE = apiHandler(
  async (_req: NextRequest, { params }) => {
    const { id } = await params!;
    await prisma.address.delete({ where: { id } });
    return { success: true, id };
  },
  { contextName: "AddressDeleteAPI" }
);
