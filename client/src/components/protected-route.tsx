import React from 'react';
import { Redirect } from 'wouter';
import { useAuth } from '@/lib/auth-context';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading spinner while authentication state is being determined
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Redirect to="/auth" />;
  }

  // If admin-only route but user is not an admin
  if (adminOnly && user?.role !== 'admin') {
    return <Redirect to="/" />;
  }

  // If authenticated, render the children components
  return <>{children}</>;
}

export default ProtectedRoute;