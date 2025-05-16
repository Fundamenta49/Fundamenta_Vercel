/**
 * API Client with Timeout Handling
 * 
 * This module provides a robust API client with timeout handling, retries,
 * and error management to improve reliability of network requests.
 */

import { toast } from "@/components/ui/use-toast";

// Default configuration
const DEFAULT_TIMEOUT = 15000; // 15 seconds
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

// API request options
export interface ApiRequestOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  cache?: RequestCache;
  showErrorToast?: boolean;
}

// API response type
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  status: number;
  statusText: string;
  headers: Headers;
  isTimeout: boolean;
  isOffline: boolean;
}

/**
 * Creates an AbortController with timeout
 */
function createTimeoutController(timeout: number): { controller: AbortController; timeoutId: number } {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(new Error('Request timeout')), timeout);
  return { controller, timeoutId };
}

/**
 * Check if error is a timeout error
 */
function isTimeoutError(error: any): boolean {
  return error.name === 'AbortError' || 
         error.name === 'TimeoutError' || 
         error.message === 'Request timeout' ||
         error.message.includes('timeout');
}

/**
 * Check if error is due to network being offline
 */
function isOfflineError(error: any): boolean {
  return !navigator.onLine || 
         error.message.includes('network') ||
         error.message.includes('offline') ||
         error.message.includes('connection');
}

/**
 * Make a request with timeout and retry capabilities
 */
export async function fetchWithTimeout<T>(
  url: string, 
  options: RequestInit & ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    timeout = DEFAULT_TIMEOUT,
    retries = MAX_RETRIES,
    retryDelay = RETRY_DELAY,
    showErrorToast = true,
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;
  let attempt = 0;
  
  // Setup default response
  const defaultResponse: ApiResponse<T> = {
    data: null,
    error: null,
    status: 0,
    statusText: '',
    headers: new Headers(),
    isTimeout: false,
    isOffline: false
  };

  while (attempt <= retries) {
    attempt++;
    
    try {
      // Create a timeout controller for this attempt
      const { controller, timeoutId } = createTimeoutController(timeout);
      
      // If the user provided a signal, we need to handle both abort sources
      const userSignal = options.signal;
      if (userSignal) {
        // If user signal is already aborted, propagate it
        if (userSignal.aborted) {
          controller.abort(userSignal.reason);
        }
        
        // Add listener to user signal
        userSignal.addEventListener('abort', () => {
          controller.abort(userSignal.reason);
        });
      }
      
      // Make the request with timeout control
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });
      
      // Clear the timeout
      clearTimeout(timeoutId);
      
      // Parse the response
      let data: T | null = null;
      
      if (response.status !== 204) { // No Content
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          // For non-JSON responses, get the text
          const text = await response.text();
          // Try to parse it as JSON anyway
          try {
            data = JSON.parse(text) as T;
          } catch {
            // Not valid JSON, just store as is if T is string
            data = text as unknown as T;
          }
        }
      }
      
      return {
        data,
        error: null,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        isTimeout: false,
        isOffline: false,
      };
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a timeout or offline error
      const isTimeout = isTimeoutError(error);
      const isOffline = isOfflineError(error);
      
      // For timeout or offline errors, consider retrying
      if ((isTimeout || isOffline) && attempt <= retries) {
        console.warn(`API request to ${url} ${isTimeout ? 'timed out' : 'failed due to offline'}, retrying (${attempt}/${retries+1})...`);
        
        // Wait before retry with exponential backoff
        const delay = retryDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // If it's the last retry or not a retry-able error, return the error
      if (showErrorToast) {
        const errorMessage = isTimeout 
          ? 'Request timed out. Please try again later.'
          : isOffline 
            ? 'You appear to be offline. Please check your connection.'
            : 'An error occurred while fetching data.';
            
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      return {
        ...defaultResponse,
        error: lastError,
        isTimeout,
        isOffline,
      };
    }
  }
  
  // This should never happen, but TypeScript requires a return
  return {
    ...defaultResponse,
    error: lastError,
    isTimeout: isTimeoutError(lastError as Error),
    isOffline: isOfflineError(lastError as Error),
  };
}

/**
 * GET request with timeout handling
 */
export async function apiGet<T>(
  url: string, 
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  return fetchWithTimeout<T>(url, {
    method: 'GET',
    ...options,
  });
}

/**
 * POST request with timeout handling
 */
export async function apiPost<T>(
  url: string, 
  data: any,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  return fetchWithTimeout<T>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * PUT request with timeout handling
 */
export async function apiPut<T>(
  url: string, 
  data: any,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  return fetchWithTimeout<T>(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * PATCH request with timeout handling
 */
export async function apiPatch<T>(
  url: string, 
  data: any,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  return fetchWithTimeout<T>(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * DELETE request with timeout handling
 */
export async function apiDelete<T>(
  url: string, 
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  return fetchWithTimeout<T>(url, {
    method: 'DELETE',
    ...options,
  });
}