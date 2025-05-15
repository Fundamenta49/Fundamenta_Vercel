/**
 * Cache Manager
 * Part of Bundle 5B: Performance & Quality Optimization
 * 
 * This module provides a centralized cache management system for the application.
 * It supports different cache namespaces and TTL values for different types of content.
 */

const NodeCache = require('node-cache');

// Define cache namespaces for different types of data
const CACHE_NAMESPACES = {
  DEFAULT: 'default',     // Default cache namespace
  USER: 'user',           // User-specific data
  CONTENT: 'content',     // Content data (learning paths, etc.)
  API: 'api',             // External API responses
  SYSTEM: 'system'        // System-level caching
};

// Create separate cache instances for each namespace
// This allows for different TTL and checking periods per namespace
const cacheInstances = {
  [CACHE_NAMESPACES.DEFAULT]: new NodeCache({ 
    stdTTL: 300,           // 5 minutes default TTL
    checkperiod: 60        // Check for expired keys every 60 seconds
  }),
  [CACHE_NAMESPACES.USER]: new NodeCache({ 
    stdTTL: 60,            // 1 minute default TTL for user data
    checkperiod: 30        // Check more frequently
  }),
  [CACHE_NAMESPACES.CONTENT]: new NodeCache({ 
    stdTTL: 3600,          // 1 hour default TTL for content
    checkperiod: 300       // Check every 5 minutes
  }),
  [CACHE_NAMESPACES.API]: new NodeCache({ 
    stdTTL: 600,           // 10 minutes default TTL for API responses
    checkperiod: 120       // Check every 2 minutes
  }),
  [CACHE_NAMESPACES.SYSTEM]: new NodeCache({ 
    stdTTL: 86400,         // 24 hours default TTL for system data
    checkperiod: 3600      // Check every hour
  })
};

// Cache statistics
let cacheStats = {
  hits: 0,
  misses: 0,
  sets: 0,
  dels: 0
};

// Cleanup interval reference for graceful shutdown
let cleanupInterval = null;

/**
 * Initialize the cache manager
 */
function initCacheManager() {
  // Setup cache statistics collection
  cleanupInterval = setInterval(() => {
    // Log cache statistics every hour
    const totalOps = cacheStats.hits + cacheStats.misses;
    if (totalOps > 0) {
      const hitRate = (cacheStats.hits / totalOps * 100).toFixed(2);
      console.log(`[Cache] Statistics: ${cacheStats.hits} hits, ${cacheStats.misses} misses, hit rate: ${hitRate}%`);
      
      // Reset stats for next period
      cacheStats = {
        hits: 0,
        misses: 0,
        sets: 0,
        dels: 0
      };
    }
  }, 60 * 60 * 1000); // Every hour
  
  return true;
}

/**
 * Shutdown cache manager and cleanup resources
 */
function shutdownCacheManager() {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
  
  // Flush all caches
  Object.values(cacheInstances).forEach(cache => cache.flushAll());
  
  return true;
}

/**
 * Get an item from the cache
 * @param {string} namespace - Cache namespace
 * @param {string} key - Cache key
 * @returns {any} Cached item or undefined if not found
 */
async function get(namespace, key) {
  const cache = cacheInstances[namespace] || cacheInstances[CACHE_NAMESPACES.DEFAULT];
  
  try {
    const value = cache.get(key);
    
    if (value !== undefined) {
      cacheStats.hits++;
      return value;
    }
    
    cacheStats.misses++;
    return undefined;
  } catch (error) {
    console.error(`Cache get error for ${namespace}:${key}:`, error);
    cacheStats.misses++;
    return undefined;
  }
}

/**
 * Set an item in the cache
 * @param {string} namespace - Cache namespace
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} ttl - Time to live in seconds (optional, uses namespace default if not provided)
 * @returns {boolean} Success status
 */
function set(namespace, key, value, ttl) {
  const cache = cacheInstances[namespace] || cacheInstances[CACHE_NAMESPACES.DEFAULT];
  
  try {
    const success = cache.set(key, value, ttl);
    if (success) {
      cacheStats.sets++;
    }
    return success;
  } catch (error) {
    console.error(`Cache set error for ${namespace}:${key}:`, error);
    return false;
  }
}

/**
 * Delete an item from the cache
 * @param {string} namespace - Cache namespace
 * @param {string} key - Cache key
 * @returns {boolean} Success status
 */
function del(namespace, key) {
  const cache = cacheInstances[namespace] || cacheInstances[CACHE_NAMESPACES.DEFAULT];
  
  try {
    const success = cache.del(key);
    if (success) {
      cacheStats.dels++;
    }
    return success;
  } catch (error) {
    console.error(`Cache delete error for ${namespace}:${key}:`, error);
    return false;
  }
}

/**
 * Flush a specific namespace or all caches
 * @param {string} namespace - Cache namespace (optional, flushes all if not provided)
 * @returns {boolean} Success status
 */
function flush(namespace) {
  try {
    if (namespace && cacheInstances[namespace]) {
      // Flush specific namespace
      cacheInstances[namespace].flushAll();
      return true;
    }
    
    // Flush all namespaces
    Object.values(cacheInstances).forEach(cache => cache.flushAll());
    return true;
  } catch (error) {
    console.error(`Cache flush error:`, error);
    return false;
  }
}

/**
 * Get cache statistics
 * @returns {Object} Cache statistics
 */
function getStats() {
  const namespaceStats = {};
  
  Object.entries(cacheInstances).forEach(([namespace, cache]) => {
    namespaceStats[namespace] = {
      keys: cache.keys().length,
      stats: cache.getStats()
    };
  });
  
  return {
    operations: { ...cacheStats },
    namespaces: namespaceStats
  };
}

// Initialize cache on module load
initCacheManager();

// Export the cache manager
const cacheManager = {
  get,
  set,
  del,
  flush,
  getStats
};

module.exports = {
  cacheManager,
  CACHE_NAMESPACES,
  initCacheManager,
  shutdownCacheManager
};