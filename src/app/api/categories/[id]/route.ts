import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { NotFoundError } from "@/server/errors/AppError";
import { requireAdmin } from "@/server/middleware/auth";
import { logActivity } from "@/server/audit/auditLogger";
import prisma from "@/server/db/prisma";

export const DELETE = apiHandler(
  async (req: NextRequest, { params }) => {
    const admin = requireAdmin(req);
    const { id } = await params!;

    const cat = await prisma.category.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!cat) {
      throw new NotFoundError(`Category '${id}'`);
    }

    await prisma.category.delete({ where: { id: cat.id } });

    await logActivity({
      adminId: admin.id,
      adminName: admin.fullName,
      action: "CATEGORY_DELETED",
      resource: `category/${cat.slug}`,
      detailsAr: `تم حذف القسم: ${cat.nameAr}`,
      detailsEn: `Deleted category: ${cat.nameEn}`,
    });

    return { success: true, id: cat.id };
  },
  { contextName: "CategoryDeleteAPI" }
);

export const PATCH = apiHandler(
  async (req: NextRequest, { params }) => {
    const admin = requireAdmin(req);
    const { id } = await params!;
    const body = await req.json();

    const cat = await prisma.category.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!cat) {
      throw new NotFoundError(`Category '${id}'`);
    }

    const updated = await prisma.category.update({
      where: { id: cat.id },
      data: {
        nameAr: body.name?.ar,
        nameEn: body.name?.en,
        descAr: body.description?.ar,
        descEn: body.description?.en,
        image: body.image,
      },
    });

    await logActivity({
      adminId: admin.id,
      adminName: admin.fullName,
      action: "CATEGORY_UPDATED",
      resource: `category/${cat.slug}`,
      detailsAr: `تم تحديث بيانات القسم: ${updated.nameAr}`,
      detailsEn: `Updated category details: ${updated.nameEn}`,
    });

    return {
      id: updated.id,
      slug: updated.slug,
      name: { ar: updated.nameAr, en: updated.nameEn },
      description: { ar: updated.descAr, en: updated.descEn },
      image: updated.image,
      itemCount: updated.itemCount,
    };
  },
  { contextName: "CategoryUpdateAPI" }
);
