import apiClient, { tokenStorage } from "@/services/apiClient";
import type {
  LoginApiResponse,
  LoginPayload,
  RegisterApiResponse,
  RegisterPayload,
  User,
} from "../types";

const USER_STORAGE_KEY = "admin_user";

export const authService = {
  /**
   * Log in user / admin.
   *
   * Backend returns: { code, message, data: { user, token } }
   */
  async login(payload: LoginPayload): Promise<LoginApiResponse> {
    const response = await apiClient.post<LoginApiResponse>(
      "/auth/login",
      payload,
    );

    const { data } = response.data;

    if (data.token) {
      tokenStorage.set(data.token);
    }

    if (data.user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
    } else {
      // Fallback user object using login email
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
   * Register new user / admin.
   *
   * Backend returns: { code, message, data: { id, name, email, created_at } }
   */
  async register(payload: RegisterPayload): Promise<RegisterApiResponse> {
    const response = await apiClient.post<RegisterApiResponse>(
      "/auth/register",
      payload,
    );
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
