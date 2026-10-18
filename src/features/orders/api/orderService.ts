import apiClient from "@/services/apiClient";
import type { ApiResponse, PaginatedApiResponse } from "@/services/types";
import type { DashboardSummaryData } from "@/features/dashboard/types";
import type {
  OrderDetail,
  OrderFilterParams,
  OrderListItem,
  UpdateOrderStatusPayload,
} from "../types";

export const orderService = {
  /**
   * Fetch paginated list of admin orders with optional search and status filter.
   */
  getOrders: async (
    params?: OrderFilterParams,
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedApiResponse<OrderListItem>> => {
    const queryParams: Record<string, string | number> = {};

    if (params?.search && params.search.trim()) {
      queryParams.search = params.search.trim();
    }
    if (params?.status && params.status !== "ALL") {
      queryParams.status = params.status;
    }
    if (params?.page) {
      queryParams.page = params.page;
    }
    if (params?.limit) {
      queryParams.limit = params.limit;
    }

    const response = await apiClient.get<PaginatedApiResponse<OrderListItem>>(
      "/admin/orders",
      {
        params: queryParams,
        signal: options?.signal,
      },
    );
    return response.data;
  },

  /**
   * Fetch single order detail by order ID.
   */
  getOrderById: async (
    orderId: string | number,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<OrderDetail>> => {
    const response = await apiClient.get<ApiResponse<OrderDetail>>(
      `/admin/orders/${orderId}`,
      {
        signal: options?.signal,
      },
    );
    return response.data;
  },

  /**
   * Update the status of an order (e.g. to PAID, SHIPPED, CANCELLED).
   */
  updateOrderStatus: async (
    orderId: string | number,
    payload: UpdateOrderStatusPayload,
  ): Promise<ApiResponse<OrderDetail>> => {
    const response = await apiClient.patch<ApiResponse<OrderDetail>>(
      `/admin/orders/${orderId}/status`,
      payload,
    );
    return response.data;
  },

  /**
   * Fetch order statistics summary (orders count by status and total revenue).
   */
  getOrderSummary: async (options?: {
    signal?: AbortSignal;
  }): Promise<ApiResponse<DashboardSummaryData>> => {
    const response = await apiClient.get<ApiResponse<DashboardSummaryData>>(
      "/admin/orders/summary",
      {
        signal: options?.signal,
      },
    );
    return response.data;
  },
};

export default orderService;
