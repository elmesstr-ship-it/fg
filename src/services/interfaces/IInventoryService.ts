import { InventoryItem, InventoryStockAdjustment } from "@/types/inventory";

export interface IInventoryService {
  getInventoryItems(params?: {
    search?: string;
    status?: "in_stock" | "low_stock" | "out_of_stock";
    lowStockOnly?: boolean;
  }): Promise<InventoryItem[]>;

  getItemBySku(sku: string): Promise<InventoryItem | null>;
  adjustStock(adjustment: InventoryStockAdjustment): Promise<InventoryItem>;
  getLowStockAlerts(): Promise<InventoryItem[]>;
}
