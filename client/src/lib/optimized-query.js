/**
 * Optimized Query Hooks
 * 
 * Enhanced React Query hooks with built-in:
 * - Smart stale time configuration
 * - Deduplication of identical requests
 * - Prefetching for anticipated user actions
 * - Error handling and retry logic
 */

import { queryClient } from '@/lib/queryClient';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

// Default configuration
const defaultConfig = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  retry: 1,
  retryDelay: 1000,
  errorHandler: (error) => {
    console.error('Query error:', error);
    toast({
      title: 'Error',
      description: error.message || 'Failed to load data. Please try again.',
      variant: 'destructive',
    });
  }
};

// Resource categories with appropriate stale times
const resourceCategories = {
  // User data changes frequently
  user: {
    staleTime: 30 * 1000, // 30 seconds
  },
  // Learning paths change infrequently
  learningPath: {
    staleTime: 30 * 60 * 1000, // 30 minutes
  },
  // Static content rarely changes
  content: {
    staleTime: 60 * 60 * 1000, // 1 hour
  },
  // Conversations update frequently
  conversations: {
    staleTime: 10 * 1000, // 10 seconds
  }
};

/**
 * Determine resource category from query key
 * @param {Array|string} queryKey - Query key
 * @returns {string} - Resource category or 'default'
 */
function getResourceCategory(queryKey) {
  const keyString = Array.isArray(queryKey) ? queryKey[0] : queryKey;
  
  if (keyString.includes('/user') || keyString.includes('/profile')) {
    return 'user';
  }
  if (keyString.includes('/learning') || keyString.includes('/pathway')) {
    return 'learningPath';
  }
  if (keyString.includes('/content') || keyString.includes('/module')) {
    return 'content';
  }
  if (keyString.includes('/conversations') || keyString.includes('/messages')) {
    return 'conversations';
  }
  
  return 'default';
}

/**
 * Get optimized query configuration based on resource type
 * @param {Array|string} queryKey - Query key
 * @param {Object} userConfig - User configuration
 * @returns {Object} - Optimized configuration
 */
function getOptimizedConfig(queryKey, userConfig = {}) {
  const category = getResourceCategory(queryKey);
  const categoryConfig = resourceCategories[category] || {};
  
  return {
    ...defaultConfig,
    ...categoryConfig,
    ...userConfig,
  };
}

/**
 * Optimized useQuery hook with smart defaults
 * @param {Object} options - Query options
 * @returns {Object} - Query result
 */
export function useOptimizedQuery(options) {
  const { queryKey, ...restOptions } = options;
  const optimizedConfig = getOptimizedConfig(queryKey, restOptions);
  
  return useQuery({
    queryKey,
    ...optimizedConfig,
    onError: (error) => {
      if (optimizedConfig.onError) {
        optimizedConfig.onError(error);
      } else {
        optimizedConfig.errorHandler(error);
      }
    }
  });
}

/**
 * Optimized useMutation hook with better defaults
 * @param {Object} options - Mutation options
 * @returns {Object} - Mutation result
 */
export function useOptimizedMutation(options) {
  const { mutationFn, onSuccess, ...restOptions } = options;
  
  return useMutation({
    mutationFn,
    ...restOptions,
    onSuccess: (data, variables, context) => {
      // Invalidate affected queries after successful mutation
      if (options.invalidateQueries) {
        const queriesToInvalidate = Array.isArray(options.invalidateQueries)
          ? options.invalidateQueries
          : [options.invalidateQueries];
          
        queriesToInvalidate.forEach(key => {
          queryClient.invalidateQueries(key);
        });
      }
      
      // Call the original onSuccess
      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      // Default error handling
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      
      // Call the original onError
      if (options.onError) {
        options.onError(error, variables, context);
      }
    }
  });
}

/**
 * Prefetch a query for anticipated user actions
 * @param {Array|string} queryKey - Query key to prefetch
 * @param {Function} queryFn - Query function
 * @param {Object} options - Prefetch options
 */
export function prefetchQuery(queryKey, queryFn, options = {}) {
  const optimizedConfig = getOptimizedConfig(queryKey, options);
  
  queryClient.prefetchQuery({
    queryKey,
    queryFn,
    ...optimizedConfig
  });
}

/**
 * Prefetch multiple related queries at once
 * @param {Array} queries - Array of query definitions
 */
export function prefetchQueries(queries) {
  queries.forEach(query => {
    prefetchQuery(query.queryKey, query.queryFn, query.options);
  });
}

/**
 * Set query data manually (useful for optimistic updates)
 * @param {Array|string} queryKey - Query key
 * @param {*} data - Data to set
 */
export function setQueryData(queryKey, data) {
  queryClient.setQueryData(queryKey, data);
}

/**
 * Create an optimistic mutation with automatic rollback on error
 * @param {Object} options - Mutation options
 * @returns {Object} - Mutation result
 */
export function useOptimisticMutation(options) {
  const { 
    mutationFn, 
    queryKey, 
    getOptimisticData,
    onError,
    ...restOptions 
  } = options;
  
  return useMutation({
    mutationFn,
    ...restOptions,
    onMutate: async (variables) => {
      // Cancel outgoing fetches
      await queryClient.cancelQueries(queryKey);
      
      // Get current data
      const previousData = queryClient.getQueryData(queryKey);
      
      // Apply optimistic update
      if (getOptimisticData) {
        const optimisticData = getOptimisticData(previousData, variables);
        queryClient.setQueryData(queryKey, optimisticData);
      }
      
      // Return context for rollback
      return { previousData };
    },
    onError: (error, variables, context) => {
      // Rollback to previous data
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      
      // Default error handling
      toast({
        title: 'Error',
        description: error.message || 'Operation failed. Please try again.',
        variant: 'destructive',
      });
      
      // Call the original onError
      if (onError) {
        onError(error, variables, context);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(queryKey);
    }
  });
}

/**
 * Invalidate multiple queries at once
 * @param {Array} queryKeys - Array of query keys to invalidate
 */
export function invalidateQueries(queryKeys) {
  queryKeys.forEach(key => {
    queryClient.invalidateQueries(key);
  });
}