import { IAnalyticsService } from "../interfaces/IAnalyticsService";
import { AnalyticsSummary, SalesMetricPoint, TopSellingItem } from "@/types/analytics";
import { api } from "@/lib/apiClient";

export class ApiAnalyticsService implements IAnalyticsService {
  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    return api.get<AnalyticsSummary>("/api/analytics");
  }

  async getSalesTrends(period: "week" | "month" | "year"): Promise<SalesMetricPoint[]> {
    const summary = await this.getAnalyticsSummary();
    return summary.salesByPeriod;
  }

  async getTopSellingProducts(limit = 5): Promise<TopSellingItem[]> {
    const summary = await this.getAnalyticsSummary();
    return summary.topProducts.slice(0, limit);
  }
}

export const analyticsApiService = new ApiAnalyticsService();
