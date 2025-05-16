/**
 * Cache Utilities
 * 
 * This module provides caching utilities for use throughout the application
 * to improve performance by storing and retrieving frequently accessed data.
 */

// Constants
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const LONG_CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Memory cache implementation
const memoryCache = new Map();

/**
 * Retrieves a value from the cache.
 *
 * @param {string} key - The cache key
 * @returns {any} The cached value or undefined if not found or expired
 */
export function getCachedValue(key) {
  const cached = memoryCache.get(key);
  
  if (!cached) {
    return undefined;
  }
  
  // Check if the value has expired
  if (cached.expiry && cached.expiry < Date.now()) {
    // Remove expired value
    memoryCache.delete(key);
    return undefined;
  }
  
  return cached.value;
}

/**
 * Stores a value in the cache with an optional expiry time.
 *
 * @param {string} key - The cache key
 * @param {any} value - The value to cache
 * @param {number} duration - Optional duration in milliseconds before the value expires
 * @returns {void}
 */
export function setCachedValue(key, value, duration = DEFAULT_CACHE_DURATION) {
  const expiry = duration > 0 ? Date.now() + duration : null;
  
  memoryCache.set(key, {
    value,
    expiry,
    createdAt: Date.now()
  });
}

/**
 * Removes a value from the cache.
 *
 * @param {string} key - The cache key
 * @returns {boolean} True if the value was removed, false if it didn't exist
 */
export function removeCachedValue(key) {
  return memoryCache.delete(key);
}

/**
 * Clears all values from the cache.
 *
 * @returns {void}
 */
export function clearCache() {
  memoryCache.clear();
}

/**
 * Clears all expired values from the cache.
 *
 * @returns {number} The number of expired values that were removed
 */
export function clearExpiredCache() {
  const now = Date.now();
  let count = 0;
  
  for (const [key, cached] of memoryCache.entries()) {
    if (cached.expiry && cached.expiry < now) {
      memoryCache.delete(key);
      count++;
    }
  }
  
  return count;
}

/**
 * Retrieves statistics about the cache.
 *
 * @returns {Object} Statistics about the cache
 */
export function getCacheStats() {
  const now = Date.now();
  let expired = 0;
  let activeItems = 0;
  
  for (const cached of memoryCache.values()) {
    if (cached.expiry && cached.expiry < now) {
      expired++;
    } else {
      activeItems++;
    }
  }
  
  return {
    totalItems: memoryCache.size,
    activeItems,
    expiredItems: expired
  };
}

/**
 * A function decorator that caches the result of the decorated function.
 *
 * @param {Function} fn - The function to cache
 * @param {number} duration - Optional duration in milliseconds before the cache expires
 * @param {Function} keyGenerator - Optional function to generate a cache key
 * @returns {Function} A new function that uses the cache
 */
export function withCache(fn, duration = DEFAULT_CACHE_DURATION, keyGenerator) {
  return function(...args) {
    const key = keyGenerator ? 
      keyGenerator(...args) : 
      `${fn.name}:${JSON.stringify(args)}`;
    
    const cachedResult = getCachedValue(key);
    
    if (cachedResult !== undefined) {
      return cachedResult;
    }
    
    const result = fn.apply(this, args);
    
    // Handle promises
    if (result instanceof Promise) {
      return result.then(value => {
        setCachedValue(key, value, duration);
        return value;
      });
    }
    
    setCachedValue(key, result, duration);
    return result;
  };
}

// Set an interval to clean up expired cache items
setInterval(clearExpiredCache, 5 * 60 * 1000); // Every 5 minutes