/**
 * Standard API response envelope used by all backend endpoints.
 *
 * Every response follows this shape:
 * { code: number, message: string, data: T }
 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

/**
 * Pagination metadata returned by list endpoints.
 */
export interface PaginationMeta {
  currentPage: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/**
 * Standard paginated API response envelope.
 *
 * Used by endpoints that return a list with pagination:
 * { code, message, data: T[], pagination: PaginationMeta }
 */
export interface PaginatedApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T[];
  pagination: PaginationMeta;
}
