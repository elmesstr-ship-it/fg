import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { NotFoundError, ValidationError } from "@/server/errors/AppError";
import { requireAdmin } from "@/server/middleware/auth";
import { logActivity } from "@/server/audit/auditLogger";
import prisma from "@/server/db/prisma";
import { db } from "@/services";

export const GET = apiHandler(
  async (req: NextRequest, { params }) => {
    requireAdmin(req);
    const { id } = await params!;
    const customer = await db.customers.getCustomerById(id);
    if (!customer) throw new NotFoundError(`Customer '${id}'`);
    return customer;
  },
  { contextName: "CustomerDetailAPI" }
);

export const PATCH = apiHandler(
  async (req: NextRequest, { params }) => {
    const admin = requireAdmin(req);
    const { id } = await params!;
    const body = await req.json();

    const user = await prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundError(`Customer '${id}'`);
    }

    const updateData: any = {};
    if (body.role) {
      if (!["USER", "ADMIN"].includes(body.role)) {
        throw new ValidationError("Invalid role specified. Must be 'USER' or 'ADMIN'.");
      }
      updateData.role = body.role;
    }

    if (typeof body.isVerified === "boolean") {
      updateData.isEmailVerified = body.isVerified;
      updateData.isPhoneVerified = body.isVerified;
    }

    if (body.phone) {
      updateData.phone = body.phone;
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    });

    if (body.fullName || body.parishName) {
      await prisma.profile.upsert({
        where: { userId: id },
        update: {
          fullName: body.fullName,
          parishName: body.parishName,
        },
        create: {
          userId: id,
          fullName: body.fullName || user.email.split("@")[0],
          parishName: body.parishName,
        },
      });
    }

    if (body.role && body.role !== user.role) {
      await logActivity({
        adminId: admin.id,
        adminName: admin.fullName,
        action: "USER_ROLE_CHANGED",
        resource: `user/${user.email}`,
        detailsAr: `تم تعديل صلاحيات المستخدم (${user.email}) من [${user.role}] إلى [${body.role}]`,
        detailsEn: `Modified role for user (${user.email}) from [${user.role}] to [${body.role}]`,
      });
    }

    const updated = await db.customers.getCustomerById(id);
    return updated;
  },
  { contextName: "CustomerUpdateAPI" }
);
