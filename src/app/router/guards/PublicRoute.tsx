import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/features/auth";

interface PublicRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
}

/**
 * Route guard for routes accessible only when unauthenticated (e.g. login, register).
 * Redirects to `redirectPath` (defaults to `/`) if already authenticated.
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({
  redirectPath = "/",
  children,
}) => {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PublicRoute;
