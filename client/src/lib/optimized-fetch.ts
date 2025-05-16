import { getCachedValue, setCachedValue, CACHE_PRIORITY } from './cache-utils.js';

// Default timeout duration
const DEFAULT_TIMEOUT = 30000; // 30 seconds

// Default cache duration
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Error class for fetch timeouts
 */
export class FetchTimeoutError extends Error {
  constructor(url: string, timeout: number) {
    super(`Request to ${url} timed out after ${timeout}ms`);
    this.name = 'FetchTimeoutError';
  }
}

interface OptimizedFetchOptions extends RequestInit {
  timeout?: number;
  retry?: number;
  retryDelay?: number;
  cache?: boolean;
  cacheDuration?: number;
  cachePriority?: keyof typeof CACHE_PRIORITY;
  cacheKey?: string;
  fallbackData?: any;
}

/**
 * Enhanced fetch function with timeout, retry, and caching capabilities
 * 
 * @param url The URL to fetch
 * @param options Enhanced fetch options including timeout, retry, and caching
 * @returns Promise with the fetch result
 */
export async function optimizedFetch<T = any>(
  url: string,
  options: OptimizedFetchOptions = {}
): Promise<T> {
  const {
    timeout = DEFAULT_TIMEOUT,
    retry = 2,
    retryDelay = 1000,
    cache = false,
    cacheDuration = DEFAULT_CACHE_DURATION,
    cachePriority = 'NORMAL',
    cacheKey = url,
    fallbackData = null,
    ...fetchOptions
  } = options;

  // Check the cache first if caching is enabled
  if (cache) {
    const cachedData = getCachedValue(cacheKey);
    if (cachedData !== undefined) {
      return cachedData as T;
    }
  }

  // Function to perform a single fetch attempt with timeout
  const attemptFetch = async (attemptsLeft: number): Promise<T> => {
    // Create a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new FetchTimeoutError(url, timeout));
      }, timeout);
    });

    try {
      // Race the fetch against the timeout
      const response = await Promise.race([
        fetch(url, fetchOptions),
        timeoutPromise
      ]);

      // Check if the response was successful
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      // Parse the response
      const data = await response.json();

      // Cache the successful response if caching is enabled
      if (cache) {
        setCachedValue(cacheKey, data, cacheDuration, CACHE_PRIORITY[cachePriority]);
      }

      return data as T;
    } catch (error) {
      // If we have attempts left, retry after delay
      if (attemptsLeft > 0) {
        console.warn(`Request to ${url} failed, retrying... (${attemptsLeft} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return attemptFetch(attemptsLeft - 1);
      }

      // If we have fallback data, use it as a last resort
      if (fallbackData !== null) {
        console.warn(`All fetch attempts failed for ${url}, using fallback data`);
        return fallbackData as T;
      }

      // Otherwise, propagate the error
      throw error;
    }
  };

  // Start the fetch process with the specified number of retries
  return attemptFetch(retry);
}

/**
 * Create a cached API client for specific endpoints
 * 
 * @param baseUrl The base URL for all API calls
 * @param defaultOptions Default options to apply to all requests
 * @returns An API client with caching capabilities
 */
export function createCachedApiClient(
  baseUrl: string,
  defaultOptions: OptimizedFetchOptions = {}
) {
  return {
    /**
     * GET request with automatic caching
     */
    get: <T = any>(
      path: string,
      options: OptimizedFetchOptions = {}
    ): Promise<T> => {
      const url = `${baseUrl}${path}`;
      return optimizedFetch<T>(url, {
        method: 'GET',
        cache: true,
        ...defaultOptions,
        ...options
      });
    },

    /**
     * POST request (typically not cached)
     */
    post: <T = any>(
      path: string,
      data: any,
      options: OptimizedFetchOptions = {}
    ): Promise<T> => {
      const url = `${baseUrl}${path}`;
      return optimizedFetch<T>(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...defaultOptions.headers,
          ...options.headers
        },
        body: JSON.stringify(data),
        cache: false,
        ...defaultOptions,
        ...options
      });
    },

    /**
     * PUT request (typically not cached)
     */
    put: <T = any>(
      path: string,
      data: any,
      options: OptimizedFetchOptions = {}
    ): Promise<T> => {
      const url = `${baseUrl}${path}`;
      return optimizedFetch<T>(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...defaultOptions.headers,
          ...options.headers
        },
        body: JSON.stringify(data),
        cache: false,
        ...defaultOptions,
        ...options
      });
    },

    /**
     * DELETE request (typically not cached)
     */
    delete: <T = any>(
      path: string,
      options: OptimizedFetchOptions = {}
    ): Promise<T> => {
      const url = `${baseUrl}${path}`;
      return optimizedFetch<T>(url, {
        method: 'DELETE',
        cache: false,
        ...defaultOptions,
        ...options
      });
    },

    /**
     * Preload data into the cache
     */
    preload: <T = any>(
      path: string,
      options: OptimizedFetchOptions = {}
    ): Promise<T> => {
      const url = `${baseUrl}${path}`;
      return optimizedFetch<T>(url, {
        method: 'GET',
        cache: true,
        ...defaultOptions,
        ...options
      });
    },

    /**
     * Invalidate a cached endpoint
     */
    invalidate: (path: string, cacheKey?: string): boolean => {
      const key = cacheKey || `${baseUrl}${path}`;
      return getCachedValue(key) !== undefined;
    }
  };
}