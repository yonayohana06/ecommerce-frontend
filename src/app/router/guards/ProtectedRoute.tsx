import React from "react";
import { Navigate, Outlet } from "react-router";

interface ProtectedRouteProps {
  isAuthenticated?: boolean;
  redirectPath?: string;
  children?: React.ReactNode;
}

/**
 * Route guard that requires authentication.
 * Redirects to `redirectPath` (defaults to `/signin`) if not authenticated.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated = true,
  redirectPath = "/signin",
  children,
}) => {
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
