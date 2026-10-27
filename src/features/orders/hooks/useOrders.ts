import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import orderService from "../api/orderService";
import type {
  OrderDetail,
  OrderFilterParams,
  UpdateOrderStatusPayload,
} from "../types";

export const ORDER_QUERY_KEYS = {
  all: ["orders"] as const,
  lists: () => [...ORDER_QUERY_KEYS.all, "list"] as const,
  list: (params: OrderFilterParams) =>
    [...ORDER_QUERY_KEYS.lists(), params] as const,
  details: () => [...ORDER_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string | number) =>
    [...ORDER_QUERY_KEYS.details(), String(id)] as const,
  summary: () => [...ORDER_QUERY_KEYS.all, "summary"] as const,
};

/**
 * Hook to fetch paginated & filtered orders with TanStack Query caching.
 */
export function useOrders(params: OrderFilterParams) {
  return useQuery({
    queryKey: ORDER_QUERY_KEYS.list(params),
    queryFn: ({ signal }) => orderService.getOrders(params, { signal }),
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook to fetch complete order detail including items and payment proof.
 */
export function useOrderDetail(orderId: string | number | undefined) {
  return useQuery({
    queryKey: orderId
      ? ORDER_QUERY_KEYS.detail(orderId)
      : (["orders", "detail", "empty"] as const),
    queryFn: ({ signal }) => orderService.getOrderById(orderId!, { signal }),
    enabled: Boolean(orderId),
  });
}

/**
 * Hook to fetch order status summary statistics.
 */
export function useOrderSummary() {
  return useQuery({
    queryKey: ORDER_QUERY_KEYS.summary(),
    queryFn: ({ signal }) => orderService.getOrderSummary({ signal }),
  });
}

/**
 * Mutation hook to update order status and automatically invalidate all order queries.
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: string | number;
      payload: UpdateOrderStatusPayload;
    }) => orderService.updateOrderStatus(orderId, payload),
    onSuccess: (_res, variables) => {
      // Invalidate both the list and the specific detail query
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.all });
      queryClient.setQueryData(
        ORDER_QUERY_KEYS.detail(variables.orderId),
        (old: { data: OrderDetail } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              status: variables.payload.status,
            },
          };
        },
      );
    },
  });
}
