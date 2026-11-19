import { AnalyticsSummary, SalesMetricPoint, TopSellingItem } from "@/types/analytics";

export interface IAnalyticsService {
  getAnalyticsSummary(): Promise<AnalyticsSummary>;
  getSalesTrends(period: "week" | "month" | "year"): Promise<SalesMetricPoint[]>;
  getTopSellingProducts(limit?: number): Promise<TopSellingItem[]>;
}
