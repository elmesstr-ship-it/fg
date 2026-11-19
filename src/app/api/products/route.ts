import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { validateRequest } from "@/server/validation/validator";
import { requireAdmin } from "@/server/middleware/auth";
import { logActivity } from "@/server/audit/auditLogger";
import { db } from "@/services";

// GET /api/products
export const GET = apiHandler(
  async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const isFeatured = searchParams.has("isFeatured") ? searchParams.get("isFeatured") === "true" : undefined;
    const minPrice = searchParams.has("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.has("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const sortBy = (searchParams.get("sortBy") as any) || undefined;

    return await db.products.getProducts({
      category,
      search,
      isFeatured,
      minPrice,
      maxPrice,
      sortBy,
    });
  },
  { contextName: "ProductsAPI" }
);

// POST /api/products (Admin create product)
export const POST = apiHandler(
  async (req: NextRequest) => {
    const admin = requireAdmin(req);
    const body = await req.json();

    // Request Validation
    const validated = validateRequest(body, [
      { field: "name", required: true, type: "object" },
      { field: "price", required: true, type: "number", min: 1 },
      { field: "categoryId", required: true, type: "string" },
      { field: "sku", required: true, type: "string", min: 3 },
      { field: "images", required: true, type: "array" },
      { field: "stock", required: true, type: "number", min: 0 },
    ]);

    const baseSlug = (validated.name.en || "item")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const created = await db.products.createProduct({
      name: validated.name,
      slug: validated.slug || uniqueSlug,
      shortDescription: validated.shortDescription || { ar: "قطعة ستريت وير حصرية", en: "Exclusive Streetwear Piece" },
      fullDescription: validated.fullDescription || { ar: "قطعة ستريت وير حصرية مصنعة من أجود الخامات", en: "Exclusive Streetwear Piece crafted from premium materials" },
      categoryId: validated.categoryId,
      categoryName: validated.categoryName || { ar: "قسم عام", en: "General" },
      price: validated.price,
      originalPrice: validated.originalPrice,
      discountPercentage: validated.discountPercentage,
      stock: validated.stock,
      sku: validated.sku,
      images: validated.images,
      specifications: validated.specifications || {},
    });

    await logActivity({
      adminId: admin.id,
      adminName: admin.fullName,
      action: "PRODUCT_CREATED",
      resource: `product/${created.sku}`,
      detailsAr: `تمت إضافة صنف جديد للمخزون: ${created.name.ar} برصيد ${created.stock} قطعة`,
      detailsEn: `Created new catalog product: ${created.name.en} with initial stock of ${created.stock}`,
    });

    return created;
  },
  { contextName: "ProductsAPI" }
);
