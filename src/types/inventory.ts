export type InventoryStockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface InventoryItem {
  id: string;
  productId: string;
  sku: string;
  productName: {
    ar: string;
    en: string;
  };
  categoryName: {
    ar: string;
    en: string;
  };
  currentStock: number;
  lowStockThreshold: number;
  safetyStock: number;
  unitCost: number;
  sellingPrice: number;
  status: InventoryStockStatus;
  lastRestockedAt: string;
  lastUpdatedSource: "admin_dashboard" | "telegram_bot" | "order_placement";
}

export interface InventoryStockAdjustment {
  productId: string;
  delta: number;
  reason: string;
  performedBy: string; // admin user or telegram user
  source: "admin_dashboard" | "telegram_bot";
}
