/**
 * Cache Utilities
 * 
 * This module provides caching utilities for use throughout the application
 * to improve performance by storing and retrieving frequently accessed data.
 * 
 * Features:
 * - In-memory caching with customizable expiration
 * - Cache prioritization for critical resources
 * - Automatic cleanup of expired items
 * - Priority-based eviction when cache size limits are reached
 * - Cache statistics tracking
 */

// Constants
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const LONG_CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
const PERMANENT_CACHE_DURATION = -1; // Never expires

// Cache priorities
export const CACHE_PRIORITY = {
  LOW: 0,    // Non-critical data that can be easily re-fetched
  NORMAL: 1, // Default priority for most cached items
  HIGH: 2,   // Important data that's expensive to re-fetch
  CRITICAL: 3 // Essential data that should never be evicted
};

// Maximum cache size - in number of items
const MAX_CACHE_SIZE = 1000;

// Memory cache implementation
const memoryCache = new Map();

// Cache metadata tracking
const cacheMetadata = {
  hits: 0,
  misses: 0,
  evictions: 0,
  lastCleanup: Date.now()
};

/**
 * Retrieves a value from the cache.
 *
 * @param {string} key - The cache key
 * @returns {any} The cached value or undefined if not found or expired
 */
export function getCachedValue(key) {
  const cached = memoryCache.get(key);
  
  if (!cached) {
    cacheMetadata.misses++;
    return undefined;
  }
  
  // Check if the value has expired
  if (cached.expiry > 0 && cached.expiry < Date.now()) {
    // Remove expired value
    memoryCache.delete(key);
    cacheMetadata.misses++;
    return undefined;
  }
  
  // Update access metadata for LRU eviction policy
  cached.lastAccessed = Date.now();
  cached.accessCount = (cached.accessCount || 0) + 1;
  
  cacheMetadata.hits++;
  return cached.value;
}

/**
 * Stores a value in the cache with an optional expiry time and priority.
 *
 * @param {string} key - The cache key
 * @param {any} value - The value to cache
 * @param {number} duration - Optional duration in milliseconds before the value expires
 * @param {number} priority - Optional priority level (default: NORMAL)
 * @returns {void}
 */
export function setCachedValue(key, value, duration = DEFAULT_CACHE_DURATION, priority = CACHE_PRIORITY.NORMAL) {
  // Check if we need to evict items due to cache size limit
  if (memoryCache.size >= MAX_CACHE_SIZE && !memoryCache.has(key)) {
    evictCacheItems();
  }
  
  const expiry = duration >= 0 ? Date.now() + duration : PERMANENT_CACHE_DURATION;
  
  memoryCache.set(key, {
    value,
    expiry,
    priority,
    createdAt: Date.now(),
    lastAccessed: Date.now(),
    accessCount: 0
  });
}

/**
 * Evicts items from the cache based on priority and access patterns.
 * Lower priority items are evicted first, followed by least recently used items.
 *
 * @private
 * @returns {number} Number of items evicted
 */
function evictCacheItems() {
  if (memoryCache.size < MAX_CACHE_SIZE) {
    return 0;
  }
  
  // First, clear any expired items
  const expiredCount = clearExpiredCache();
  if (memoryCache.size < MAX_CACHE_SIZE) {
    return expiredCount;
  }
  
  // Collect all items along with their keys
  const items = Array.from(memoryCache.entries()).map(([key, value]) => ({
    key,
    ...value
  }));
  
  // Sort by priority (ascending) and then by last accessed time (ascending)
  items.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return a.lastAccessed - b.lastAccessed;
  });
  
  // Calculate how many items to evict (20% of cache or at least 1)
  const evictCount = Math.max(1, Math.floor(MAX_CACHE_SIZE * 0.2));
  
  // Evict the items with lowest priority and least recently accessed
  let count = 0;
  for (let i = 0; i < evictCount && i < items.length; i++) {
    // Skip critical priority items
    if (items[i].priority === CACHE_PRIORITY.CRITICAL) {
      continue;
    }
    memoryCache.delete(items[i].key);
    count++;
  }
  
  cacheMetadata.evictions += count;
  return count;
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
 * Retrieves detailed statistics about the cache.
 *
 * @returns {Object} Statistics about the cache
 */
export function getCacheStats() {
  const now = Date.now();
  let expired = 0;
  let activeItems = 0;
  const priorityCount = {
    [CACHE_PRIORITY.LOW]: 0,
    [CACHE_PRIORITY.NORMAL]: 0,
    [CACHE_PRIORITY.HIGH]: 0,
    [CACHE_PRIORITY.CRITICAL]: 0
  };
  let avgAge = 0;
  let oldestItem = 0;
  let mostAccessed = 0;
  
  for (const cached of memoryCache.values()) {
    if (cached.expiry > 0 && cached.expiry < now) {
      expired++;
    } else {
      activeItems++;
      
      // Count by priority
      const priority = cached.priority !== undefined ? cached.priority : CACHE_PRIORITY.NORMAL;
      priorityCount[priority]++;
      
      // Track item age
      const age = now - cached.createdAt;
      avgAge += age;
      oldestItem = Math.max(oldestItem, age);
      
      // Track access count
      mostAccessed = Math.max(mostAccessed, cached.accessCount || 0);
    }
  }
  
  // Calculate average age of cache items
  avgAge = activeItems > 0 ? Math.floor(avgAge / activeItems) : 0;
  
  // Calculate cache hit rate
  const totalAccesses = cacheMetadata.hits + cacheMetadata.misses;
  const hitRate = totalAccesses > 0 ? (cacheMetadata.hits / totalAccesses) : 0;
  
  return {
    totalItems: memoryCache.size,
    activeItems,
    expiredItems: expired,
    cacheUsage: `${Math.round((memoryCache.size / MAX_CACHE_SIZE) * 100)}%`,
    hitRate: `${Math.round(hitRate * 100)}%`,
    hits: cacheMetadata.hits,
    misses: cacheMetadata.misses,
    evictions: cacheMetadata.evictions,
    avgAgeMs: avgAge,
    oldestItemMs: oldestItem,
    mostAccessed,
    byPriority: priorityCount,
    lastCleanup: new Date(cacheMetadata.lastCleanup).toISOString()
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

/**
 * Specialized image caching utility for optimizing image loading.
 * Preloads and caches images for faster display.
 *
 * @param {string} src - Image source URL
 * @param {Object} options - Cache options
 * @param {number} options.priority - Cache priority (default: NORMAL)
 * @param {number} options.duration - Cache duration (default: LONG_CACHE_DURATION)
 * @returns {Promise<string>} - Promise resolving to the cached image URL
 */
export function cacheImage(src, options = {}) {
  const {
    priority = CACHE_PRIORITY.NORMAL,
    duration = LONG_CACHE_DURATION
  } = options;
  
  const cacheKey = `image:${src}`;
  const cachedSrc = getCachedValue(cacheKey);
  
  if (cachedSrc) {
    return Promise.resolve(cachedSrc);
  }
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      setCachedValue(cacheKey, src, duration, priority);
      resolve(src);
    };
    
    img.onerror = (err) => {
      reject(new Error(`Failed to load image: ${src}`));
    };
    
    img.src = src;
  });
}

/**
 * Bulk preload multiple images to improve UI performance.
 * Useful for prefetching images that will be needed soon.
 *
 * @param {string[]} sources - Array of image URLs to preload
 * @param {Object} options - Cache options
 * @returns {Promise<string[]>} - Promise resolving when all images are cached
 */
export function preloadImages(sources, options = {}) {
  if (!Array.isArray(sources) || sources.length === 0) {
    return Promise.resolve([]);
  }
  
  const promises = sources.map(src => 
    cacheImage(src, options).catch(err => {
      console.warn(`Failed to preload image: ${src}`, err);
      return null;
    })
  );
  
  return Promise.all(promises);
}

/**
 * Reset cache metadata statistics.
 * Useful for performance testing and monitoring.
 */
export function resetCacheStats() {
  cacheMetadata.hits = 0;
  cacheMetadata.misses = 0;
  cacheMetadata.evictions = 0;
  cacheMetadata.lastCleanup = Date.now();
}

// Schedule regular cache maintenance
setInterval(() => {
  const count = clearExpiredCache();
  if (count > 0) {
    console.debug(`Cache maintenance: removed ${count} expired items`);
  }
  cacheMetadata.lastCleanup = Date.now();
}, 5 * 60 * 1000); // Every 5 minutes