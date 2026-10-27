import type { ApiResponse, PaginatedApiResponse } from "@/services/types";

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "PAID"
  | "SHIPPED"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED";

export interface OrdersByStatus {
  PENDING: number;
  PROCESSING: number;
  PAID: number;
  SHIPPED: number;
  COMPLETED: number;
  CANCELLED: number;
  FAILED: number;
}

export interface DashboardSummaryData {
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: OrdersByStatus;
}

export type DashboardSummaryResponse = ApiResponse<DashboardSummaryData>;

export interface RecentOrderItem {
  order_id: string;
  user_id: string;
  email: string;
  user_name: string;
  total_amount: string | number;
  status: OrderStatus;
  shipping_address: string;
  payment_proof_url: string | null;
  payment_submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export type RecentOrdersResponse = PaginatedApiResponse<RecentOrderItem>;
