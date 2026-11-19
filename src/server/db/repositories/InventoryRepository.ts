import { IInventoryService } from "@/services/interfaces/IInventoryService";
import { InventoryItem, InventoryStockAdjustment, InventoryStockStatus } from "@/types/inventory";
import prisma from "../prisma";
import { productPrismaRepository } from "./ProductRepository";

export class PrismaInventoryRepository implements IInventoryService {
  private formatInventory(inv: any): InventoryItem {
    return {
      id: inv.id,
      productId: inv.productId,
      sku: inv.sku,
      productName: {
        ar: inv.product?.nameAr || "",
        en: inv.product?.nameEn || "",
      },
      categoryName: {
        ar: inv.product?.category?.nameAr || "قسم عام",
        en: inv.product?.category?.nameEn || "General",
      },
      currentStock: inv.currentStock,
      lowStockThreshold: inv.lowStockThreshold,
      safetyStock: inv.safetyStock,
      unitCost: inv.unitCost,
      sellingPrice: inv.sellingPrice,
      status: inv.status as InventoryStockStatus,
      lastRestockedAt: inv.lastRestockedAt.toISOString(),
      lastUpdatedSource: inv.lastUpdatedSource as any,
    };
  }

  async getInventoryItems(params?: {
    search?: string;
    status?: "in_stock" | "low_stock" | "out_of_stock";
    lowStockOnly?: boolean;
  }): Promise<InventoryItem[]> {
    const where: any = {};

    if (params?.status) {
      where.status = params.status;
    }

    if (params?.lowStockOnly) {
      where.OR = [
        { status: "low_stock" },
        { status: "out_of_stock" },
      ];
    }

    if (params?.search) {
      const q = params.search.trim();
      where.OR = [
        { sku: { contains: q } },
        { product: { nameAr: { contains: q } } },
        { product: { nameEn: { contains: q } } },
      ];
    }

    const raw = await prisma.inventory.findMany({
      where,
      include: {
        product: {
          include: { category: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return raw.map((inv) => this.formatInventory(inv));
  }

  async getItemBySku(sku: string): Promise<InventoryItem | null> {
    const raw = await prisma.inventory.findUnique({
      where: { sku },
      include: {
        product: {
          include: { category: true },
        },
      },
    });
    return raw ? this.formatInventory(raw) : null;
  }

  async adjustStock(adjustment: InventoryStockAdjustment): Promise<InventoryItem> {
    const inv = await prisma.inventory.findUnique({
      where: { productId: adjustment.productId },
      include: { product: { include: { category: true } } },
    });

    if (!inv) throw new Error("Inventory item not found");

    const newStock = Math.max(0, inv.currentStock + adjustment.delta);
    let newStatus: InventoryStockStatus = "in_stock";
    if (newStock === 0) {
      newStatus = "out_of_stock";
    } else if (newStock <= inv.lowStockThreshold) {
      newStatus = "low_stock";
    }

    // Atomic update of both Product and Inventory
    const [updatedInv] = await prisma.$transaction([
      prisma.inventory.update({
        where: { productId: adjustment.productId },
        data: {
          currentStock: newStock,
          status: newStatus,
          lastUpdatedSource: adjustment.source,
          lastRestockedAt: adjustment.delta > 0 ? new Date() : undefined,
        },
        include: {
          product: {
            include: { category: true },
          },
        },
      }),
      prisma.product.update({
        where: { id: adjustment.productId },
        data: { stock: newStock },
      }),
    ]);

    // If reached low stock or out of stock, push alert notification
    if (newStatus === "low_stock" || newStatus === "out_of_stock") {
      try {
        await prisma.notification.create({
          data: {
            type: newStatus,
            priority: "urgent",
            titleAr: `تنبيه مخزون: ${inv.sku}`,
            titleEn: `Inventory Alert: ${inv.sku}`,
            messageAr: `المتبقي من ${inv.product.nameAr} هو ${newStock} فقط (${adjustment.reason}).`,
            messageEn: `Stock for ${inv.product.nameEn} dropped to ${newStock} (${adjustment.reason}).`,
            resourceId: inv.productId,
            resourceType: "product",
            actionUrl: "/admin/products",
            isRead: false,
          },
        });
      } catch (err) {
        console.error("Failed to create inventory alert notification:", err);
      }
    }

    return this.formatInventory(updatedInv);
  }

  async getLowStockAlerts(): Promise<InventoryItem[]> {
    return this.getInventoryItems({ lowStockOnly: true });
  }
}

export const inventoryPrismaRepository = new PrismaInventoryRepository();
