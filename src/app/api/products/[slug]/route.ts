import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { NotFoundError } from "@/server/errors/AppError";
import { requireAdmin } from "@/server/middleware/auth";
import { logActivity } from "@/server/audit/auditLogger";
import { db } from "@/services";

export const GET = apiHandler(
  async (_req: NextRequest, { params }) => {
    const { slug } = await params!;
    const product = await db.products.getProductBySlug(slug) || await db.products.getProductById(slug);
    if (!product) {
      throw new NotFoundError(`Product '${slug}'`);
    }
    return product;
  },
  { contextName: "ProductDetailAPI" }
);

export const PATCH = apiHandler(
  async (req: NextRequest, { params }) => {
    const admin = requireAdmin(req);
    const { slug } = await params!;
    const body = await req.json();

    const product = await db.products.getProductBySlug(slug) || await db.products.getProductById(slug);
    if (!product) {
      throw new NotFoundError(`Product '${slug}'`);
    }

    let updated;
    // Handle stock delta adjustment if provided
    if (typeof body.stockDelta === "number") {
      updated = await db.products.updateProductStock(product.id, body.stockDelta, body.source || "admin_dashboard");
      await logActivity({
        adminId: admin.id,
        adminName: admin.fullName,
        action: "STOCK_ADJUSTED",
        resource: `product/${product.sku}`,
        detailsAr: `تم تعديل مخزون ${product.name.ar} بمقدار (${body.stockDelta > 0 ? "+" : ""}${body.stockDelta}). الرصيد الجديد: ${updated.stock}`,
        detailsEn: `Adjusted stock for ${product.name.en} by (${body.stockDelta > 0 ? "+" : ""}${body.stockDelta}). New stock: ${updated.stock}`,
      });
      return updated;
    }

    updated = await db.products.updateProduct(product.id, body);
    await logActivity({
      adminId: admin.id,
      adminName: admin.fullName,
      action: "PRODUCT_UPDATED",
      resource: `product/${product.sku}`,
      detailsAr: `تم تحديث بيانات الصنف: ${product.name.ar}`,
      detailsEn: `Updated details for product: ${product.name.en}`,
    });
    return updated;
  },
  { contextName: "ProductUpdateAPI" }
);

export const DELETE = apiHandler(
  async (req: NextRequest, { params }) => {
    const admin = requireAdmin(req);
    const { slug } = await params!;
    const product = await db.products.getProductBySlug(slug) || await db.products.getProductById(slug);
    if (!product) {
      throw new NotFoundError(`Product '${slug}'`);
    }

    const success = await db.products.deleteProduct(product.id);
    await logActivity({
      adminId: admin.id,
      adminName: admin.fullName,
      action: "PRODUCT_DELETED",
      resource: `product/${product.sku}`,
      detailsAr: `تم حذف الصنف من المخزون: ${product.name.ar} (${product.sku})`,
      detailsEn: `Deleted product from inventory: ${product.name.en} (${product.sku})`,
    });

    return { deleted: success, id: product.id };
  },
  { contextName: "ProductDeleteAPI" }
);
