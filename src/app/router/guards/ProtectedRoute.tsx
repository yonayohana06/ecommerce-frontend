import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/features/auth";

interface ProtectedRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
}

/**
 * Route guard that requires authentication.
 * Redirects to `redirectPath` (defaults to `/signin`) if not authenticated.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = "/signin",
  children,
}) => {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
