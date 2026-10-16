import type { ApiResponse } from "@/services/types";

// ─── User ───────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// ─── Auth Payloads ──────────────────────────────────────────────────
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

// ─── Auth Response Data ─────────────────────────────────────────────

/** Shape of `data` returned by POST /auth/login */
export interface LoginResponseData {
  user: User;
  token: string;
}

/** Shape of `data` returned by POST /auth/register */
export interface RegisterResponseData {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

// ─── Full API Responses (typed aliases) ─────────────────────────────
export type LoginApiResponse = ApiResponse<LoginResponseData>;
export type RegisterApiResponse = ApiResponse<RegisterResponseData>;
