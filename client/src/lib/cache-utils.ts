/**
 * Cache Utilities
 * 
 * This module provides utilities for client-side caching to improve performance
 * and reduce server load by caching frequently accessed data.
 */

interface CacheOptions {
  /** Time-to-live in milliseconds */
  ttl?: number;
  /** Unique namespace to avoid collisions */
  namespace?: string;
}

interface CacheVersionInfo {
  version: string;
  timestamp: number;
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const DEFAULT_NAMESPACE = 'app-cache';
const VERSION = '1.0.0'; // Increment this when cache structure changes

/**
 * Initialize the cache system and check version compatibility
 */
export function initCache(namespace: string = DEFAULT_NAMESPACE): void {
  const versionKey = `${namespace}:version`;
  const currentVersion: CacheVersionInfo = {
    version: VERSION,
    timestamp: Date.now()
  };
  
  // Check if cache version exists and is current
  const storedVersionJson = localStorage.getItem(versionKey);
  if (!storedVersionJson) {
    // First time initialization
    localStorage.setItem(versionKey, JSON.stringify(currentVersion));
    return;
  }
  
  try {
    const storedVersion: CacheVersionInfo = JSON.parse(storedVersionJson);
    
    // If version changes, clear cache
    if (storedVersion.version !== currentVersion.version) {
      clearCacheByNamespace(namespace);
      localStorage.setItem(versionKey, JSON.stringify(currentVersion));
      console.log(`Cache version updated from ${storedVersion.version} to ${currentVersion.version}`);
    }
  } catch (error) {
    // If we can't parse the version, reset everything
    clearCacheByNamespace(namespace);
    localStorage.setItem(versionKey, JSON.stringify(currentVersion));
    console.error('Error parsing cache version, cache reset:', error);
  }
}

/**
 * Get cached data if valid, or return null if expired/missing
 */
export function getCachedData<T>(key: string, options: CacheOptions = {}): T | null {
  const { namespace = DEFAULT_NAMESPACE } = options;
  const cacheKey = `${namespace}:${key}`;
  
  try {
    const cachedItemJson = localStorage.getItem(cacheKey);
    if (!cachedItemJson) return null;
    
    const cachedItem = JSON.parse(cachedItemJson);
    const now = Date.now();
    
    // Check if cache has expired
    if (cachedItem.expiry && cachedItem.expiry < now) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return cachedItem.data;
  } catch (error) {
    console.error('Error retrieving cached data:', error);
    return null;
  }
}

/**
 * Cache data with a specified time-to-live
 */
export function setCachedData<T>(key: string, data: T, options: CacheOptions = {}): void {
  const { ttl = DEFAULT_TTL, namespace = DEFAULT_NAMESPACE } = options;
  const cacheKey = `${namespace}:${key}`;
  
  const now = Date.now();
  const expiry = ttl > 0 ? now + ttl : undefined;
  
  const cacheItem = {
    data,
    timestamp: now,
    expiry
  };
  
  try {
    localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
  } catch (error) {
    // Handle localStorage errors (e.g., quota exceeded)
    console.error('Error caching data:', error);
    
    // If we can't write, try to clear old entries
    try {
      clearExpiredCache(namespace);
    } catch (clearError) {
      console.error('Error clearing expired cache:', clearError);
    }
  }
}

/**
 * Remove a specific item from cache
 */
export function removeCachedItem(key: string, namespace: string = DEFAULT_NAMESPACE): void {
  const cacheKey = `${namespace}:${key}`;
  localStorage.removeItem(cacheKey);
}

/**
 * Clear all cached data for a namespace
 */
export function clearCacheByNamespace(namespace: string = DEFAULT_NAMESPACE): void {
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(`${namespace}:`)) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
  console.log(`Cleared ${keysToRemove.length} items from namespace: ${namespace}`);
}

/**
 * Clear expired cache entries to free up space
 */
export function clearExpiredCache(namespace: string = DEFAULT_NAMESPACE): void {
  const now = Date.now();
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(`${namespace}:`)) {
      try {
        const cachedItemJson = localStorage.getItem(key);
        if (!cachedItemJson) continue;
        
        const cachedItem = JSON.parse(cachedItemJson);
        if (cachedItem.expiry && cachedItem.expiry < now) {
          keysToRemove.push(key);
        }
      } catch (error) {
        // If we can't parse it, remove it
        keysToRemove.push(key);
      }
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
  console.log(`Cleared ${keysToRemove.length} expired items from namespace: ${namespace}`);
}

/**
 * Create a preloaded cache for faster app startup
 * 
 * @param data Object with key-value pairs to precache
 * @param options Cache options
 */
export function precacheData(
  data: Record<string, any>,
  options: CacheOptions = {}
): void {
  const { namespace = DEFAULT_NAMESPACE } = options;
  
  Object.entries(data).forEach(([key, value]) => {
    setCachedData(key, value, { ...options, namespace });
  });
  
  console.log(`Precached ${Object.keys(data).length} items in namespace: ${namespace}`);
}

/**
 * Apply cache to a function (memoization)
 */
export function withCache<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  keyGenerator: (...args: Args) => string,
  options: CacheOptions = {}
): (...args: Args) => Promise<T> {
  return async (...args: Args): Promise<T> => {
    const cacheKey = keyGenerator(...args);
    const cachedData = getCachedData<T>(cacheKey, options);
    
    if (cachedData !== null) {
      return cachedData;
    }
    
    try {
      const result = await fn(...args);
      setCachedData(cacheKey, result, options);
      return result;
    } catch (error) {
      throw error;
    }
  };
}