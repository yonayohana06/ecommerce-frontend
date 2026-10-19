import apiClient, { tokenStorage } from "@/services/apiClient";
import type {
  AdminProfileApiResponse,
  LoginApiResponse,
  LoginPayload,
  User,
} from "../types";

const USER_STORAGE_KEY = "admin_user";

export const authService = {
  /**
   * Log in administrator.
   *
   * Endpoint: POST /admin/auth/login
   * Backend returns: { code, message, data: { user, token } }
   * Returns 403 if account does not have administrator privileges.
   */
  async login(payload: LoginPayload): Promise<LoginApiResponse> {
    const response = await apiClient.post<LoginApiResponse>(
      "/admin/auth/login",
      payload,
    );

    const { data } = response.data;

    if (data.token) {
      tokenStorage.set(data.token);
    }

    if (data.user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
    } else {
      const fallbackUser: User = {
        id: "",
        name: payload.email.split("@")[0] || "Admin",
        email: payload.email,
        role: "admin",
      };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(fallbackUser));
    }

    return response.data;
  },

  /**
   * Fetch current authenticated administrator profile.
   *
   * Endpoint: GET /admin/auth/me
   * Headers: Authorization: Bearer <token>
   */
  async getMe(): Promise<AdminProfileApiResponse> {
    const response = await apiClient.get<AdminProfileApiResponse>(
      "/admin/auth/me",
    );

    if (response.data.data) {
      localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(response.data.data),
      );
    }

    return response.data;
  },

  /**
   * Log out and clear persisted session.
   */
  logout(): void {
    tokenStorage.remove();
    localStorage.removeItem(USER_STORAGE_KEY);
    if (typeof window !== "undefined") {
      window.location.href = "/signin";
    }
  },

  /**
   * Get currently stored user info.
   */
  getStoredUser(): User | null {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  /**
   * Check if token is present in localStorage.
   */
  isAuthenticated(): boolean {
    return Boolean(tokenStorage.get());
  },

  /**
   * Get JWT token.
   */
  getToken(): string | null {
    return tokenStorage.get();
  },
};

export default authService;
