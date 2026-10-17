import apiClient from "@/services/apiClient";
import type { ApiResponse } from "@/services/types";
import type {
  Category,
  CategoryDeleteResponse,
  CategoryPayload,
} from "../types";

export const categoryService = {
  /**
   * Fetch all categories, optionally filtered by keyword.
   * Supports AbortSignal for request cancellation.
   */
  getCategories: async (
    search?: string,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<Category[]>> => {
    const params = search?.trim() ? { search: search.trim() } : undefined;
    const response = await apiClient.get<ApiResponse<Category[]>>(
      "/admin/categories",
      { params, signal: options?.signal },
    );
    return response.data;
  },

  /**
   * Fetch a single category by its ID.
   */
  getCategoryById: async (
    id: number | string,
  ): Promise<ApiResponse<Category>> => {
    const response = await apiClient.get<ApiResponse<Category>>(
      `/admin/categories/${id}`,
    );
    return response.data;
  },

  /**
   * Create a new category.
   */
  createCategory: async (
    payload: CategoryPayload,
  ): Promise<ApiResponse<Category>> => {
    const response = await apiClient.post<ApiResponse<Category>>(
      "/admin/categories",
      payload,
    );
    return response.data;
  },

  /**
   * Update an existing category by ID.
   */
  updateCategory: async (
    id: number | string,
    payload: CategoryPayload,
  ): Promise<ApiResponse<Category>> => {
    const response = await apiClient.put<ApiResponse<Category>>(
      `/admin/categories/${id}`,
      payload,
    );
    return response.data;
  },

  /**
   * Delete a category by ID.
   */
  deleteCategory: async (
    id: number | string,
  ): Promise<ApiResponse<CategoryDeleteResponse>> => {
    const response = await apiClient.delete<
      ApiResponse<CategoryDeleteResponse>
    >(`/admin/categories/${id}`);
    return response.data;
  },
};

export default categoryService;
