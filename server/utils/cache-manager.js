/**
 * Cache Manager
 * 
 * This module provides a centralized caching system for the application.
 * It uses NodeCache for in-memory caching with configurable TTL (time-to-live).
 */

import NodeCache from 'node-cache';

// Define cache namespaces for different parts of the application
export const CACHE_NAMESPACES = {
  API: 'api',
  USER: 'user',
  CONTENT: 'content',
  LEARNING: 'learning',
  ANALYTICS: 'analytics'
};

class CacheManager {
  constructor() {
    // Initialize with standard settings
    this.cache = new NodeCache({
      stdTTL: 300, // 5 minutes default
      checkperiod: 60, // Check for expired keys every 60 seconds
      useClones: false // For better performance and to avoid reference issues
    });
    
    this.stats = {
      hits: 0,
      misses: 0,
      keys: 0,
      flushCount: 0,
      lastFlush: null
    };
    
    // Setup cache statistics tracking
    this.setupStats();
    
    console.log('[Cache] Cache manager initialized');
  }
  
  // Generate a key using namespace for better organization
  generateKey(namespace, key) {
    return `${namespace}:${key}`;
  }
  
  // Get an item from the cache
  get(namespace, key) {
    const cacheKey = this.generateKey(namespace, key);
    const value = this.cache.get(cacheKey);
    
    if (value === undefined) {
      this.stats.misses++;
      return null;
    }
    
    this.stats.hits++;
    return value;
  }
  
  // Set an item in the cache with optional TTL
  set(namespace, key, value, ttl) {
    const cacheKey = this.generateKey(namespace, key);
    return this.cache.set(cacheKey, value, ttl);
  }
  
  // Check if a key exists in the cache
  has(namespace, key) {
    const cacheKey = this.generateKey(namespace, key);
    return this.cache.has(cacheKey);
  }
  
  // Delete an item from the cache
  delete(namespace, key) {
    const cacheKey = this.generateKey(namespace, key);
    return this.cache.del(cacheKey);
  }
  
  // Flush all items from a namespace
  flushNamespace(namespace) {
    const keys = this.cache.keys().filter(key => key.startsWith(`${namespace}:`));
    this.cache.del(keys);
    
    this.stats.flushCount++;
    this.stats.lastFlush = new Date().toISOString();
    
    return keys.length;
  }
  
  // Flush the entire cache
  flush() {
    this.cache.flushAll();
    
    this.stats.flushCount++;
    this.stats.lastFlush = new Date().toISOString();
    this.stats.hits = 0;
    this.stats.misses = 0;
    
    console.log('[Cache] Cache flushed');
    return true;
  }
  
  // Setup stats tracking
  setupStats() {
    // Track hit rate statistics
    this.cache.on('set', () => {
      this.stats.keys = this.cache.keys().length;
    });
    
    this.cache.on('del', () => {
      this.stats.keys = this.cache.keys().length;
    });
    
    this.cache.on('flush', () => {
      this.stats.keys = 0;
      this.stats.flushCount++;
      this.stats.lastFlush = new Date().toISOString();
    });
  }
  
  // Get cache statistics
  getStats() {
    const currStats = { ...this.stats };
    
    // Add calculated stats
    currStats.hitRate = currStats.hits + currStats.misses === 0 
      ? 0 
      : (currStats.hits / (currStats.hits + currStats.misses)).toFixed(2);
      
    currStats.keys = this.cache.keys().length;
    currStats.memoryUsage = this.getMemoryUsageEstimate();
    
    return currStats;
  }
  
  // Estimate memory usage of the cache (rough estimate)
  getMemoryUsageEstimate() {
    const keys = this.cache.keys();
    let totalSize = 0;
    
    keys.forEach(key => {
      const value = this.cache.get(key);
      if (value) {
        // Rough estimate based on key length and serialized value
        try {
          const serialized = JSON.stringify(value);
          totalSize += key.length + serialized.length;
        } catch (e) {
          // If value can't be serialized, make a rough estimate
          totalSize += key.length + 1000; // Default size for complex objects
        }
      }
    });
    
    // Convert to KB
    return Math.round(totalSize / 1024) + 'KB';
  }
}

// Create singleton instance
export const cacheManager = new CacheManager();

export default cacheManager;