/**
 * Cache Middleware
 * 
 * Provides middleware functions for caching API responses and improving 
 * response times for frequently accessed routes.
 */

import { cacheManager, CACHE_NAMESPACES } from '../utils/cache-manager.js';

/**
 * Generic API response caching middleware
 * This middleware caches API responses for a specified TTL
 * 
 * @param {Object} options - Caching options
 * @param {string} options.namespace - Cache namespace
 * @param {number} options.ttl - Time to live in seconds
 * @returns {Function} Express middleware
 */
export function cacheApiResponse(options = {}) {
  const namespace = options.namespace || CACHE_NAMESPACES.API;
  const ttl = options.ttl || 300; // Default 5 minutes
  
  return (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    // Generate a cache key from the request URL
    const key = req.originalUrl || req.url;
    
    // Try to get cached response
    const cachedResponse = cacheManager.get(namespace, key);
    if (cachedResponse) {
      // Set cache header to indicate cache hit
      res.set('X-Cache', 'HIT');
      return res.json(cachedResponse);
    }
    
    // Cache miss, continue with request
    res.set('X-Cache', 'MISS');
    
    // Store original res.json method
    const originalJson = res.json;
    
    // Override res.json method to cache the response
    res.json = function(data) {
      // Cache the response data
      cacheManager.set(namespace, key, data, ttl);
      
      // Call the original json method
      return originalJson.call(this, data);
    };
    
    next();
  };
}

/**
 * User-specific caching middleware
 * This middleware caches API responses per user
 * 
 * @param {Object} options - Caching options
 * @param {number} options.ttl - Time to live in seconds
 * @returns {Function} Express middleware
 */
export function cacheUserApiResponse(options = {}) {
  const namespace = CACHE_NAMESPACES.USER;
  const ttl = options.ttl || 60; // Default 1 minute for user-specific data
  
  return (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    // Get user ID from the request (from JWT or session)
    const userId = req.user?.id || req.session?.userId || 'anonymous';
    
    // Generate a cache key that includes the user ID
    const key = `${userId}:${req.originalUrl || req.url}`;
    
    // Try to get cached response
    const cachedResponse = cacheManager.get(namespace, key);
    if (cachedResponse) {
      res.set('X-Cache', 'HIT');
      return res.json(cachedResponse);
    }
    
    // Cache miss, continue with request
    res.set('X-Cache', 'MISS');
    
    // Store original res.json method
    const originalJson = res.json;
    
    // Override res.json method to cache the response
    res.json = function(data) {
      // Don't cache error responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheManager.set(namespace, key, data, ttl);
      }
      
      // Call the original json method
      return originalJson.call(this, data);
    };
    
    next();
  };
}

/**
 * Learning path caching middleware
 * This middleware is specifically optimized for learning path data
 * 
 * @param {Object} options - Caching options
 * @param {number} options.ttl - Time to live in seconds
 * @returns {Function} Express middleware
 */
export function cacheLearningPathResponse(options = {}) {
  const namespace = CACHE_NAMESPACES.LEARNING;
  const ttl = options.ttl || 1800; // Default 30 minutes for learning content
  
  return (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    // For learning paths, we want to cache per path ID if available
    let key = req.originalUrl || req.url;
    const pathId = req.params.pathId || req.params.id;
    
    if (pathId) {
      key = `path:${pathId}:${key}`;
    }
    
    // Try to get cached response
    const cachedResponse = cacheManager.get(namespace, key);
    if (cachedResponse) {
      // Add cache control headers for browser caching
      res.set('Cache-Control', 'public, max-age=600'); // 10 minutes browser cache
      res.set('X-Cache', 'HIT');
      return res.json(cachedResponse);
    }
    
    // Cache miss, continue with request
    res.set('X-Cache', 'MISS');
    
    // Store original res.json method
    const originalJson = res.json;
    
    // Override res.json method to cache the response
    res.json = function(data) {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheManager.set(namespace, key, data, ttl);
        
        // Add cache control headers for browser caching
        res.set('Cache-Control', 'public, max-age=600'); // 10 minutes browser cache
      }
      
      // Call the original json method
      return originalJson.call(this, data);
    };
    
    next();
  };
}

/**
 * Clear cache entries for a specified namespace
 * 
 * @param {string} namespace - Cache namespace to clear
 * @returns {Function} Express middleware
 */
export function clearNamespaceCache(namespace) {
  return (_req, res, next) => {
    const count = cacheManager.flushNamespace(namespace);
    console.log(`[Cache] Cleared ${count} entries from ${namespace} namespace`);
    next();
  };
}

// Add all cache middleware functions as named exports
export default {
  cacheApiResponse,
  cacheUserApiResponse,
  cacheLearningPathResponse,
  clearNamespaceCache
};