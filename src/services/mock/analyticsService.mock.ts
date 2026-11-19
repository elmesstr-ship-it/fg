import { IAnalyticsService } from "../interfaces/IAnalyticsService";
import { AnalyticsSummary, SalesMetricPoint, TopSellingItem } from "@/types/analytics";
import { MOCK_ANALYTICS } from "./mockData";

export class MockAnalyticsService implements IAnalyticsService {
  private analytics: AnalyticsSummary = { ...MOCK_ANALYTICS };

  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    return { ...this.analytics };
  }

  async getSalesTrends(_period: "week" | "month" | "year"): Promise<SalesMetricPoint[]> {
    return [...this.analytics.salesByPeriod];
  }

  async getTopSellingProducts(limit = 5): Promise<TopSellingItem[]> {
    return this.analytics.topProducts.slice(0, limit);
  }
}

export const analyticsService = new MockAnalyticsService();
