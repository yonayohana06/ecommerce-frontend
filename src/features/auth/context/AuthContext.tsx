import React, { createContext, useEffect, useState } from "react";
import authService from "../api/authService";
import type { LoginApiResponse, LoginPayload, User } from "../types";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<LoginApiResponse>;
  logout: () => void;
  refreshProfile: () => Promise<User | null>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const refreshProfile = async (): Promise<User | null> => {
    try {
      const res = await authService.getMe();
      if (res.data) {
        setUser(res.data);
        return res.data;
      }
      return null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    // Initialize auth state from storage once on mount
    const initAuth = async () => {
      try {
        const storedToken = authService.getToken();
        const storedUser = authService.getStoredUser();

        if (storedToken) {
          setToken(storedToken);
          if (storedUser) {
            setUser(storedUser);
          }

          // Refresh profile in background
          try {
            const meRes = await authService.getMe();
            if (meRes.data) {
              setUser(meRes.data);
            }
          } catch {
            // Handled by apiClient interceptor if 401/403
          }
        }
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();
  }, []);

  const login = async (payload: LoginPayload): Promise<LoginApiResponse> => {
    const response = await authService.login(payload);
    const storedToken = authService.getToken();
    const storedUser = authService.getStoredUser();

    setToken(storedToken);
    setUser(storedUser);
    return response;
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isInitialized,
        isLoading: !isInitialized,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
