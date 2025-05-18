import React from 'react';
import { Redirect } from 'wouter';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  // For deployment, we're removing authentication requirements
  // This allows all pages to be accessible without login
  
  // Note: Admin-only functionality will still be restricted
  // but we don't currently have active admin users in deployment
  if (adminOnly) {
    return <Redirect to="/" />;
  }

  // Always allow access to protected routes after deployment
  return <>{children}</>;
}

export default ProtectedRoute;