import React, { createContext, useEffect, useState } from "react";
import authService from "../api/authService";
import type { LoginApiResponse, LoginPayload, RegisterApiResponse, RegisterPayload, User } from "../types";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<LoginApiResponse>;
  register: (payload: RegisterPayload) => Promise<RegisterApiResponse>;
  logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    // Initialize auth state from storage once on mount
    try {
      const storedToken = authService.getToken();
      const storedUser = authService.getStoredUser();

      if (storedToken) {
        setToken(storedToken);
        setUser(storedUser);
      }
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const login = async (payload: LoginPayload): Promise<LoginApiResponse> => {
    const response = await authService.login(payload);
    const storedToken = authService.getToken();
    const storedUser = authService.getStoredUser();

    setToken(storedToken);
    setUser(storedUser);
    return response;
  };

  const register = async (payload: RegisterPayload): Promise<RegisterApiResponse> => {
    return await authService.register(payload);
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
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
