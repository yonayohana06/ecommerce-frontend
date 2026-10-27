import apiClient from "@/services/apiClient";
import type { ApiResponse, PaginatedApiResponse } from "@/services/types";
import type {
  Product,
  ProductDeleteResponse,
  ProductFilterParams,
  ProductPayload,
} from "../types";

export const productService = {
  /**
   * Fetch paginated list of products with optional search, category filter, and pagination.
   * Supports AbortSignal for request cancellation.
   */
  getProducts: async (
    params?: ProductFilterParams,
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedApiResponse<Product>> => {
    const queryParams: Record<string, string | number> = {};

    if (params?.search && params.search.trim()) {
      queryParams.search = params.search.trim();
    }
    if (params?.category_id !== undefined && params.category_id !== "" && params.category_id !== "all") {
      queryParams.category_id = params.category_id;
    }
    if (params?.page) {
      queryParams.page = params.page;
    }
    if (params?.limit) {
      queryParams.limit = params.limit;
    }

    const response = await apiClient.get<PaginatedApiResponse<Product>>(
      "/admin/products",
      {
        params: queryParams,
        signal: options?.signal,
      },
    );
    return response.data;
  },

  /**
   * Fetch a single product by its ID.
   */
  getProductById: async (
    id: string | number,
  ): Promise<ApiResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<Product>>(
      `/admin/products/${id}`,
    );
    return response.data;
  },

  /**
   * Create a new product.
   */
  createProduct: async (
    payload: ProductPayload,
  ): Promise<ApiResponse<Product>> => {
    const response = await apiClient.post<ApiResponse<Product>>(
      "/admin/products",
      payload,
    );
    return response.data;
  },

  /**
   * Update an existing product by ID.
   */
  updateProduct: async (
    id: string | number,
    payload: ProductPayload,
  ): Promise<ApiResponse<Product>> => {
    const response = await apiClient.put<ApiResponse<Product>>(
      `/admin/products/${id}`,
      payload,
    );
    return response.data;
  },

  /**
   * Delete a product by ID.
   */
  deleteProduct: async (
    id: string | number,
  ): Promise<ApiResponse<ProductDeleteResponse>> => {
    const response = await apiClient.delete<ApiResponse<ProductDeleteResponse>>(
      `/admin/products/${id}`,
    );
    return response.data;
  },
};

export default productService;
