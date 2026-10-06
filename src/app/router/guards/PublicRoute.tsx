import React from "react";
import { Navigate, Outlet } from "react-router";

interface PublicRouteProps {
  isAuthenticated?: boolean;
  redirectPath?: string;
  children?: React.ReactNode;
}

/**
 * Route guard for routes accessible only when unauthenticated (e.g. login, register).
 * Redirects to `redirectPath` (defaults to `/`) if already authenticated.
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({
  isAuthenticated = false,
  redirectPath = "/",
  children,
}) => {
  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PublicRoute;
