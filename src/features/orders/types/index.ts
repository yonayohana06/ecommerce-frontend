import type { OrderStatus } from "@/features/dashboard/types";

export type { OrderStatus };

export interface OrderItem {
  order_item_id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price_at_purchase: number | string;
  subtotal: number | string;
}

export interface OrderListItem {
  order_id: string;
  user_id: string;
  email: string;
  user_name: string;
  total_amount: string | number;
  status: OrderStatus;
  shipping_address: string | null;
  payment_proof_url: string | null;
  payment_submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderDetail {
  id: string;
  user_id: string;
  email: string;
  user_name: string;
  phone_number?: string | null;
  total_amount: number | string;
  status: OrderStatus;
  shipping_address: string | null;
  payment_proof_url: string | null;
  payment_submitted_at: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus | "ALL" | "";
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}
