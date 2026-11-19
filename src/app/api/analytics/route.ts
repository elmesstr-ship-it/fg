import { apiHandler } from "@/server/apiHandler";
import { db } from "@/services";

export const GET = apiHandler(
  async () => {
    return await db.analytics.getAnalyticsSummary();
  },
  { contextName: "AnalyticsAPI" }
);
