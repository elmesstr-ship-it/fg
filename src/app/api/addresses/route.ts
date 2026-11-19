import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { getAuthenticatedUser } from "@/server/middleware/auth";
import { validateRequest } from "@/server/validation/validator";
import { ValidationError } from "@/server/errors/AppError";
import prisma from "@/server/db/prisma";

export const GET = apiHandler(
  async (req: NextRequest) => {
    const user = getAuthenticatedUser(req);
    const userId = user?.id || (await prisma.user.findFirst({ where: { role: "USER" } }))?.id;

    if (!userId) return [];

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return addresses.map((a) => ({
      id: a.id,
      title: a.title,
      fullName: a.fullName,
      phone: a.phone,
      governorate: a.governorate,
      city: a.city,
      streetAddress: a.streetAddress,
      notes: a.notes || undefined,
      isDefault: a.isDefault,
    }));
  },
  { contextName: "AddressesAPI" }
);

export const POST = apiHandler(
  async (req: NextRequest) => {
    const user = getAuthenticatedUser(req);
    const userId = user?.id || (await prisma.user.findFirst({ where: { role: "USER" } }))?.id;

    if (!userId) throw new ValidationError("Customer account required");

    const body = await req.json();
    const validated = validateRequest(body, [
      { field: "fullName", required: true, type: "string", min: 3 },
      { field: "phone", required: true, type: "string", min: 10 },
      { field: "governorate", required: true, type: "string" },
      { field: "city", required: true, type: "string" },
      { field: "streetAddress", required: true, type: "string", min: 5 },
    ]);

    if (body.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const created = await prisma.address.create({
      data: {
        userId,
        title: body.title || "المنزل",
        fullName: validated.fullName,
        phone: validated.phone,
        governorate: validated.governorate,
        city: validated.city,
        streetAddress: validated.streetAddress,
        notes: body.notes,
        isDefault: body.isDefault !== undefined ? body.isDefault : false,
      },
    });

    return created;
  },
  { contextName: "AddressesAPI" }
);
