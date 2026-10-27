export interface Category {
  id: number;
  name: string;
  slug: string;
  icon_url: string | null;
  created_at: string;
  product_count?: number;
}

export interface CategoryPayload {
  name: string;
  slug?: string;
  icon_url?: string | null;
}

export interface CategoryDeleteResponse {
  category: {
    id: number;
    name: string;
    slug: string;
    icon_url: string | null;
    created_at: string;
  };
  affected_products_count: number;
}
