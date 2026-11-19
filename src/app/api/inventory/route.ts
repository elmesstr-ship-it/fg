import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { validateRequest } from "@/server/validation/validator";
import { requireAdmin } from "@/server/middleware/auth";
import { logActivity } from "@/server/audit/auditLogger";
import { db } from "@/services";

export const GET = apiHandler(
  async (req: NextRequest) => {
    requireAdmin(req);
    const searchParams = req.nextUrl.searchParams;
    const status = (searchParams.get("status") as any) || undefined;
    const lowStockOnly = searchParams.get("lowStockOnly") === "true";
    const search = searchParams.get("search") || undefined;

    return await db.inventory.getInventoryItems({ status, lowStockOnly, search });
  },
  { contextName: "InventoryAPI" }
);

export const PATCH = apiHandler(
  async (req: NextRequest) => {
    const admin = requireAdmin(req);
    const body = await req.json();

    const validated = validateRequest(body, [
      { field: "productId", required: true, type: "string" },
      { field: "delta", required: true, type: "number" },
      { field: "reason", required: true, type: "string" },
    ]);

    const item = await db.inventory.adjustStock({
      productId: validated.productId,
      delta: validated.delta,
      reason: validated.reason,
      performedBy: admin.fullName,
      source: body.source || "admin_dashboard",
    });

    await logActivity({
      adminId: admin.id,
      adminName: admin.fullName,
      action: "INVENTORY_ADJUSTED",
      resource: `inventory/${item.sku}`,
      detailsAr: `تم تعديل مخزون الصنف ${item.productName.ar} (${validated.delta > 0 ? "+" : ""}${validated.delta}) لسبب: ${validated.reason}. الرصيد: ${item.currentStock}`,
      detailsEn: `Adjusted inventory for ${item.productName.en} (${validated.delta > 0 ? "+" : ""}${validated.delta}) Reason: ${validated.reason}. Current stock: ${item.currentStock}`,
    });

    return item;
  },
  { contextName: "InventoryAPI" }
);
