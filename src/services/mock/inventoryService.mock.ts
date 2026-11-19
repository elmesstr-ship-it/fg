import { IInventoryService } from "../interfaces/IInventoryService";
import { InventoryItem, InventoryStockAdjustment } from "@/types/inventory";
import { MOCK_INVENTORY } from "./mockData";
import { productService } from "./productService.mock";
import { notificationService } from "./notificationService.mock";

export class MockInventoryService implements IInventoryService {
  private inventory: InventoryItem[] = [...MOCK_INVENTORY];

  async getInventoryItems(params?: {
    search?: string;
    status?: "in_stock" | "low_stock" | "out_of_stock";
    lowStockOnly?: boolean;
  }): Promise<InventoryItem[]> {
    let result = [...this.inventory];

    if (params?.lowStockOnly) {
      result = result.filter(
        (it) => it.currentStock <= it.lowStockThreshold || it.status === "low_stock"
      );
    }

    if (params?.status) {
      result = result.filter((it) => it.status === params.status);
    }

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (it) =>
          it.sku.toLowerCase().includes(q) ||
          it.productName.ar.toLowerCase().includes(q) ||
          it.productName.en.toLowerCase().includes(q)
      );
    }

    return result;
  }

  async getItemBySku(sku: string): Promise<InventoryItem | null> {
    const found = this.inventory.find(
      (it) => it.sku.toLowerCase() === sku.toLowerCase()
    );
    return found ? { ...found } : null;
  }

  async adjustStock(adjustment: InventoryStockAdjustment): Promise<InventoryItem> {
    const idx = this.inventory.findIndex((it) => it.productId === adjustment.productId);
    if (idx === -1) throw new Error("Inventory item not found");

    const item = this.inventory[idx];
    const newStock = Math.max(0, item.currentStock + adjustment.delta);
    item.currentStock = newStock;
    item.lastUpdatedSource = adjustment.source;
    item.lastRestockedAt = new Date().toISOString();

    if (newStock === 0) {
      item.status = "out_of_stock";
    } else if (newStock <= item.lowStockThreshold) {
      item.status = "low_stock";
    } else {
      item.status = "in_stock";
    }

    // Update Product Service as well
    await productService.updateProductStock(adjustment.productId, adjustment.delta, adjustment.source);

    // If low stock reached, trigger alert
    if (item.status === "low_stock" || item.status === "out_of_stock") {
      await notificationService.createNotification({
        type: item.status,
        priority: "urgent",
        title: {
          ar: `تنبيه مخزون: ${item.sku}`,
          en: `Inventory Alert: ${item.sku}`,
        },
        message: {
          ar: `المتبقي من ${item.productName.ar} هو ${newStock} فقط (${adjustment.reason}).`,
          en: `Stock for ${item.productName.en} dropped to ${newStock} (${adjustment.reason}).`,
        },
        resourceId: item.productId,
        resourceType: "product",
        actionUrl: "/admin/products",
      });
    }

    return { ...item };
  }

  async getLowStockAlerts(): Promise<InventoryItem[]> {
    return this.inventory.filter((it) => it.currentStock <= it.lowStockThreshold);
  }
}

export const inventoryService = new MockInventoryService();
