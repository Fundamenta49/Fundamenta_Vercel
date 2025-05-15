/**
 * Lazy Loading Components
 * 
 * This module provides utilities for lazy loading React components
 * with automatic code splitting and loading states.
 */

import React, { Suspense, lazy } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Loading spinner component for fallback
 */
export function LoadingSpinner({ size = 'md', className, text = 'Loading...' }) {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <svg
        className={`animate-spin ${sizeMap[size] || sizeMap.md} text-primary ${className || ''}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {text && <p className="mt-2 text-sm text-gray-500">{text}</p>}
    </div>
  );
}

/**
 * Content skeleton for fallback
 */
export function ContentSkeleton({ type = 'card', count = 1 }) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="space-y-2 rounded-md border p-4">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        );
      case 'list-item':
        return (
          <div className="flex gap-2 items-center">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        );
      case 'text':
        return (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-3">
            <div className="flex justify-center">
              <Skeleton className="h-24 w-24 rounded-full" />
            </div>
            <Skeleton className="h-5 w-1/3 mx-auto" />
            <Skeleton className="h-4 w-5/6 mx-auto" />
            <div className="flex gap-2 justify-center pt-2">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
          </div>
        );
      default:
        return <Skeleton className="h-40 w-full" />;
    }
  };
  
  return (
    <>
      {Array(count)
        .fill(null)
        .map((_, index) => (
          <div key={index}>{renderSkeleton()}</div>
        ))}
    </>
  );
}

/**
 * Enhanced lazy loading for components with better error handling
 * @param {Function} importFunc - Import function, e.g. () => import('./MyComponent')
 * @param {Object} options - Configuration options
 * @returns {React.LazyExoticComponent} - Lazy loaded component
 */
export function lazyLoad(importFunc, options = {}) {
  const {
    fallback = <LoadingSpinner />,
    onError,
    errorComponent
  } = options;
  
  const LazyComponent = lazy(() => {
    return importFunc().catch(error => {
      console.error('Failed to load component:', error);
      if (onError) onError(error);
      
      // Return a minimal component that renders the error state
      return {
        default: props => (
          errorComponent || (
            <div className="p-4 border border-red-200 bg-red-50 text-red-800 rounded-md">
              <h3 className="font-semibold">Component failed to load</h3>
              <p className="text-sm">Please refresh the page and try again.</p>
            </div>
          )
        )
      };
    });
  });
  
  // Return the lazy component wrapped in a Suspense
  return props => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Wrapper for lazily loading a page component
 */
export function LazyPage({ component: Component, fallback, ...props }) {
  return (
    <Suspense fallback={fallback || <ContentSkeleton count={3} />}>
      <Component {...props} />
    </Suspense>
  );
}

/**
 * Lazily load all routes to reduce initial bundle size
 */
export const lazyRoutes = {
  // Main dashboard
  Dashboard: lazyLoad(() => import('@/pages/dashboard')),
  
  // Learning paths
  LearningPaths: lazyLoad(() => import('@/pages/learning-paths'), {
    fallback: <ContentSkeleton count={3} />
  }),
  
  // Module details
  ModuleDetails: lazyLoad(() => import('@/pages/module-details'), {
    fallback: <ContentSkeleton type="text" count={3} />
  }),
  
  // Profile pages
  Profile: lazyLoad(() => import('@/pages/profile'), {
    fallback: <ContentSkeleton type="profile" />
  }),
  
  // Settings page
  Settings: lazyLoad(() => import('@/pages/settings')),
  
  // Authentication pages
  Login: lazyLoad(() => import('@/pages/login')),
  Register: lazyLoad(() => import('@/pages/register')),
};