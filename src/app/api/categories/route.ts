import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { validateRequest } from "@/server/validation/validator";
import { requireAdmin } from "@/server/middleware/auth";
import { logActivity } from "@/server/audit/auditLogger";
import { db } from "@/services";

export const GET = apiHandler(
  async () => {
    return await db.products.getCategories();
  },
  { contextName: "CategoriesAPI" }
);

export const POST = apiHandler(
  async (req: NextRequest) => {
    const admin = requireAdmin(req);
    const body = await req.json();

    const validated = validateRequest(body, [
      { field: "name", required: true, type: "object" },
      { field: "description", required: true, type: "object" },
      { field: "image", required: true, type: "string" },
    ]);

    const slug = validated.slug || validated.name.en?.toLowerCase().replace(/[^a-z0-9]/g, "-") || `cat-${Date.now()}`;
    const newCat = await (db.products as any).createCategory({
      slug,
      name: validated.name,
      description: validated.description,
      image: validated.image,
    });

    await logActivity({
      adminId: admin.id,
      adminName: admin.fullName,
      action: "CATEGORY_CREATED",
      resource: `category/${newCat.slug}`,
      detailsAr: `تم إنشاء قسم كنسي جديد: ${newCat.name.ar}`,
      detailsEn: `Created new ecclesiastical category: ${newCat.name.en}`,
    });

    return newCat;
  },
  { contextName: "CategoriesAPI" }
);
