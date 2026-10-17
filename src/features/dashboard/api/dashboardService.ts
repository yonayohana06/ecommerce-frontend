import apiClient from "@/services/apiClient";
import type { DashboardSummaryResponse, RecentOrdersResponse } from "../types";

export const dashboardService = {
  /**
   * Fetch order summary metrics for admin dashboard.
   * Endpoint: GET /admin/orders/summary
   */
  async getSummary(): Promise<DashboardSummaryResponse> {
    const response = await apiClient.get<DashboardSummaryResponse>(
      "/admin/orders/summary",
    );
    return response.data;
  },

  /**
   * Fetch recent orders list for dashboard table preview.
   * Endpoint: GET /admin/orders?page=1&limit=5
   */
  async getRecentOrders(limit = 5): Promise<RecentOrdersResponse> {
    const response = await apiClient.get<RecentOrdersResponse>("/admin/orders", {
      params: {
        page: 1,
        limit,
      },
    });
    return response.data;
  },
};

export default dashboardService;
