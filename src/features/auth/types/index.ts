import type { ApiResponse } from "@/services/types";

// ─── Administrator User ─────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  phone_number?: string | null;
  role: string;
  created_at?: string;
}

// ─── Auth Payloads ──────────────────────────────────────────────────
export interface LoginPayload {
  email: string;
  password: string;
}

// ─── Auth Response Data ─────────────────────────────────────────────

/** Shape of `data` returned by POST /admin/auth/login */
export interface LoginResponseData {
  user: User;
  token: string;
}

// ─── Full API Responses (typed aliases) ─────────────────────────────
export type LoginApiResponse = ApiResponse<LoginResponseData>;
export type AdminProfileApiResponse = ApiResponse<User>;
