export interface Product {
  id: string;
  name: string;
  price: string | number;
  stock: number;
  is_active?: boolean;
  image_url: string | null;
  category_id?: number;
  category_name: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProductPayload {
  name: string;
  category_id: number;
  price: number;
  stock: number;
  description?: string;
  image_url?: string;
}

export interface ProductFilterParams {
  search?: string;
  category_id?: number | string;
  page?: number;
  limit?: number;
}

export interface ProductDeleteResponse {
  id: string;
  delete_type: "hard_deleted" | "soft_deleted";
}
