/**
 * Cache Manager
 * 
 * Provides a flexible caching system with multiple strategies:
 * 1. In-memory cache for quick access (default)
 * 2. Redis-compatible cache for distributed environments (optional)
 * 3. Supports time-based and manual cache invalidation
 */

import NodeCache from 'node-cache';

// Default cache TTL in seconds
const DEFAULT_TTL = 5 * 60; // 5 minutes

// Cache namespaces for better organization and selective clearing
const CACHE_NAMESPACES = {
  USER: 'user',
  LEARNING_PATH: 'learning_path',
  CONTENT: 'content',
  COACHING: 'coaching',
  ANALYTICS: 'analytics',
  SYSTEM: 'system'
};

class CacheManager {
  constructor() {
    // Create cache with reasonable defaults
    this.cache = new NodeCache({
      stdTTL: DEFAULT_TTL,
      checkperiod: 120, // Check for expired keys every 2 minutes
      useClones: false, // Store by reference for better performance
      maxKeys: 1000 // Limit total keys to prevent memory issues
    });
    
    // Keep track of namespace keys for efficient bulk operations
    this.namespaceKeys = {};
    for (const namespace of Object.values(CACHE_NAMESPACES)) {
      this.namespaceKeys[namespace] = new Set();
    }
    
    // Performance metrics
    this.metrics = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0
    };
    
    console.log('Cache manager initialized');
  }
  
  /**
   * Create a cache key with namespace for better organization
   * @param {string} namespace - The cache namespace
   * @param {string} key - The specific cache key
   * @returns {string} - The combined cache key
   */
  createKey(namespace, key) {
    return `${namespace}:${key}`;
  }
  
  /**
   * Get a value from cache
   * @param {string} namespace - The cache namespace
   * @param {string} key - The cache key
   * @returns {any} - The cached value or undefined
   */
  get(namespace, key) {
    const cacheKey = this.createKey(namespace, key);
    const value = this.cache.get(cacheKey);
    
    if (value !== undefined) {
      this.metrics.hits++;
      return value;
    }
    
    this.metrics.misses++;
    return undefined;
  }
  
  /**
   * Set a value in cache
   * @param {string} namespace - The cache namespace
   * @param {string} key - The cache key
   * @param {any} value - The value to cache
   * @param {number} ttl - Time to live in seconds (optional)
   * @returns {boolean} - Success
   */
  set(namespace, key, value, ttl = DEFAULT_TTL) {
    const cacheKey = this.createKey(namespace, key);
    const success = this.cache.set(cacheKey, value, ttl);
    
    if (success) {
      this.metrics.sets++;
      // Track key in namespace for bulk operations
      if (this.namespaceKeys[namespace]) {
        this.namespaceKeys[namespace].add(key);
      }
    }
    
    return success;
  }
  
  /**
   * Delete a specific cache entry
   * @param {string} namespace - The cache namespace
   * @param {string} key - The cache key
   * @returns {boolean} - Success
   */
  delete(namespace, key) {
    const cacheKey = this.createKey(namespace, key);
    const success = this.cache.del(cacheKey);
    
    if (success) {
      this.metrics.deletes++;
      // Remove from namespace tracking
      if (this.namespaceKeys[namespace]) {
        this.namespaceKeys[namespace].delete(key);
      }
    }
    
    return success;
  }
  
  /**
   * Clear all entries in a namespace
   * @param {string} namespace - The cache namespace to clear
   * @returns {number} - Number of deleted entries
   */
  clearNamespace(namespace) {
    if (!this.namespaceKeys[namespace]) {
      return 0;
    }
    
    let count = 0;
    for (const key of this.namespaceKeys[namespace]) {
      const cacheKey = this.createKey(namespace, key);
      if (this.cache.del(cacheKey)) {
        count++;
      }
    }
    
    // Reset namespace tracking
    this.namespaceKeys[namespace] = new Set();
    this.metrics.deletes += count;
    
    return count;
  }
  
  /**
   * Flush the entire cache
   * @returns {void}
   */
  flush() {
    this.cache.flushAll();
    
    // Reset all namespace tracking
    for (const namespace of Object.values(CACHE_NAMESPACES)) {
      this.namespaceKeys[namespace] = new Set();
    }
    
    console.log('Cache flushed completely');
  }
  
  /**
   * Get cache statistics
   * @returns {Object} - Cache statistics
   */
  getStats() {
    const cacheStats = this.cache.getStats();
    
    return {
      ...this.metrics,
      keys: this.cache.keys().length,
      memoryUsage: process.memoryUsage().heapUsed,
      hitRate: this.metrics.hits / (this.metrics.hits + this.metrics.misses) || 0,
      ...cacheStats
    };
  }
  
  /**
   * Helper to cache the result of an async function
   * @param {string} namespace - The cache namespace
   * @param {string} key - The cache key
   * @param {Function} fn - The async function to execute and cache
   * @param {number} ttl - Time to live in seconds
   * @returns {Promise<any>} - The function result (from cache or fresh)
   */
  async cached(namespace, key, fn, ttl = DEFAULT_TTL) {
    // Check cache first
    const cachedValue = this.get(namespace, key);
    if (cachedValue !== undefined) {
      return cachedValue;
    }
    
    // Execute function and cache result
    try {
      const result = await fn();
      this.set(namespace, key, result, ttl);
      return result;
    } catch (error) {
      console.error(`Cache error for ${namespace}:${key}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
const cacheManager = new CacheManager();
export { cacheManager, CACHE_NAMESPACES };

// Export some convenience methods for common cache operations
export const getUserCache = (userId) => cacheManager.get(CACHE_NAMESPACES.USER, userId.toString());
export const setUserCache = (userId, data, ttl) => cacheManager.set(CACHE_NAMESPACES.USER, userId.toString(), data, ttl);
export const clearUserCache = (userId) => cacheManager.delete(CACHE_NAMESPACES.USER, userId.toString());
export const clearAllUserCache = () => cacheManager.clearNamespace(CACHE_NAMESPACES.USER);

export const getPathCache = (pathId) => cacheManager.get(CACHE_NAMESPACES.LEARNING_PATH, pathId);
export const setPathCache = (pathId, data, ttl) => cacheManager.set(CACHE_NAMESPACES.LEARNING_PATH, pathId, data, ttl);
export const clearPathCache = (pathId) => cacheManager.delete(CACHE_NAMESPACES.LEARNING_PATH, pathId);
export const clearAllPathCache = () => cacheManager.clearNamespace(CACHE_NAMESPACES.LEARNING_PATH);

export const getContentCache = (contentId) => cacheManager.get(CACHE_NAMESPACES.CONTENT, contentId);
export const setContentCache = (contentId, data, ttl) => cacheManager.set(CACHE_NAMESPACES.CONTENT, contentId, data, ttl);
export const clearContentCache = (contentId) => cacheManager.delete(CACHE_NAMESPACES.CONTENT, contentId);
export const clearAllContentCache = () => cacheManager.clearNamespace(CACHE_NAMESPACES.CONTENT);