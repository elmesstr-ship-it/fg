export interface SalesMetricPoint {
  date: string; // e.g. "2026-10-01" or "يناير"
  revenue: number;
  ordersCount: number;
}

export interface CategorySalesDistribution {
  categoryId: string;
  categoryName: {
    ar: string;
    en: string;
  };
  revenue: number;
  percentage: number;
  itemsSold: number;
}

export interface TopSellingItem {
  productId: string;
  name: {
    ar: string;
    en: string;
  };
  sku: string;
  categoryName: {
    ar: string;
    en: string;
  };
  unitsSold: number;
  totalRevenue: number;
  stockLeft: number;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  revenueGrowthPercentage: number;
  totalOrders: number;
  ordersGrowthPercentage: number;
  averageOrderValue: number;
  activeCustomersCount: number;
  lowStockItemsCount: number;
  salesByPeriod: SalesMetricPoint[];
  categoryDistribution: CategorySalesDistribution[];
  topProducts: TopSellingItem[];
  ordersByGovernorate: Record<string, number>;
}
