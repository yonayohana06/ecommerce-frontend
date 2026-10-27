import { useQuery, keepPreviousData } from "@tanstack/react-query";
import productService from "../api/productService";
import type { ProductFilterParams } from "../types";

export const PRODUCT_QUERY_KEYS = {
  all: ["products"] as const,
  lists: () => [...PRODUCT_QUERY_KEYS.all, "list"] as const,
  list: (params: ProductFilterParams) =>
    [...PRODUCT_QUERY_KEYS.lists(), params] as const,
  details: () => [...PRODUCT_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string | number) =>
    [...PRODUCT_QUERY_KEYS.details(), String(id)] as const,
};

/**
 * Hook to fetch paginated and filtered product lists with TanStack Query caching.
 * Uses keepPreviousData to ensure seamless pagination transitions without layout shifts.
 */
export function useProducts(params: ProductFilterParams) {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.list(params),
    queryFn: ({ signal }) => productService.getProducts(params, { signal }),
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook to fetch a single product's detailed data by ID with TanStack Query caching.
 */
export function useProduct(id: string | number | undefined) {
  return useQuery({
    queryKey: id
      ? PRODUCT_QUERY_KEYS.detail(id)
      : (["products", "detail", "empty"] as const),
    queryFn: () => productService.getProductById(id!),
    enabled: Boolean(id),
  });
}
