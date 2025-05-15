/**
 * Cache Middleware
 * Part of Bundle 5B: Performance & Quality Optimization
 * 
 * This module provides various caching middleware functions for different types of API responses.
 * These middleware functions can be applied to specific routes to improve performance.
 */

const { cacheManager, CACHE_NAMESPACES } = require('../utils/cache-manager.js');

/**
 * Create a cache key based on the request
 * @param {Express.Request} req - Express request object
 * @returns {string} Cache key
 */
function createCacheKey(req) {
  // For GET requests, include query parameters
  if (req.method === 'GET') {
    const queryString = Object.keys(req.query)
      .sort() // Sort to ensure consistent keys regardless of param order
      .map(key => `${key}=${req.query[key]}`)
      .join('&');
      
    return `${req.method}:${req.originalUrl.split('?')[0]}${queryString ? '?' + queryString : ''}`;
  }
  
  // For other methods, include only the path
  return `${req.method}:${req.originalUrl.split('?')[0]}`;
}

/**
 * General API response caching middleware
 * @param {Object} options - Caching options
 * @returns {Function} Express middleware
 */
function cacheApiResponse(options = {}) {
  const { 
    ttl = 300,              // Default TTL: 5 minutes
    namespace = CACHE_NAMESPACES.DEFAULT, 
    bypassHeader = 'X-Bypass-Cache',
    methods = ['GET']       // Only cache GET by default
  } = options;
  
  return async (req, res, next) => {
    // Only cache specified methods
    if (!methods.includes(req.method)) {
      return next();
    }
    
    // Skip caching if bypass header is present
    if (req.headers[bypassHeader.toLowerCase()]) {
      return next();
    }
    
    // Create cache key from request details
    const cacheKey = createCacheKey(req);
    
    try {
      // Try to get from cache
      const cachedResponse = await cacheManager.get(namespace, cacheKey);
      
      if (cachedResponse) {
        // Set header to indicate this is a cached response
        res.set('X-Cache', 'HIT');
        return res.json(cachedResponse);
      }
      
      // Cache miss - store original json method
      const originalJson = res.json;
      
      // Override json method to cache the response
      res.json = function(data) {
        // Don't cache error responses
        if (res.statusCode >= 200 && res.statusCode < 400) {
          cacheManager.set(namespace, cacheKey, data, ttl);
        }
        
        // Set cache status header
        res.set('X-Cache', 'MISS');
        
        // Call the original json method
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
}

/**
 * User-specific API response caching middleware
 * Similar to cacheApiResponse but includes user ID in the cache key
 * @param {Object} options - Caching options
 * @returns {Function} Express middleware
 */
function cacheUserApiResponse(options = {}) {
  const { 
    ttl = 60,               // Default TTL: 1 minute for user content
    namespace = CACHE_NAMESPACES.USER, 
    bypassHeader = 'X-Bypass-Cache',
    methods = ['GET']       // Only cache GET by default
  } = options;
  
  return async (req, res, next) => {
    // Only cache specified methods
    if (!methods.includes(req.method)) {
      return next();
    }
    
    // Skip caching if bypass header is present
    if (req.headers[bypassHeader.toLowerCase()]) {
      return next();
    }
    
    // Skip if no user is authenticated
    if (!req.user?.id) {
      return next();
    }
    
    // Create cache key from request details + user ID
    const cacheKey = `user:${req.user.id}:${createCacheKey(req)}`;
    
    try {
      // Try to get from cache
      const cachedResponse = await cacheManager.get(namespace, cacheKey);
      
      if (cachedResponse) {
        // Set header to indicate this is a cached response
        res.set('X-Cache', 'HIT');
        return res.json(cachedResponse);
      }
      
      // Cache miss - store original json method
      const originalJson = res.json;
      
      // Override json method to cache the response
      res.json = function(data) {
        // Don't cache error responses
        if (res.statusCode >= 200 && res.statusCode < 400) {
          cacheManager.set(namespace, cacheKey, data, ttl);
        }
        
        // Set cache status header
        res.set('X-Cache', 'MISS');
        
        // Call the original json method
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error('User cache middleware error:', error);
      next();
    }
  };
}

/**
 * Specialized middleware for caching learning path responses
 * This uses a longer TTL and includes special cache invalidation logic
 * @param {Object} options - Caching options
 * @returns {Function} Express middleware
 */
function cacheLearningPathResponse(options = {}) {
  const { 
    ttl = 600,              // Default TTL: 10 minutes
    namespace = CACHE_NAMESPACES.CONTENT
  } = options;
  
  // Use the general API response caching with specific settings
  return cacheApiResponse({
    ttl,
    namespace,
    methods: ['GET']
  });
}

/**
 * Middleware to cache content from static sources
 * Uses a much longer TTL for content that rarely changes
 * @param {Object} options - Caching options
 * @returns {Function} Express middleware
 */
function cacheContentResponse(options = {}) {
  const { 
    ttl = 3600,             // Default TTL: 1 hour
    namespace = CACHE_NAMESPACES.CONTENT
  } = options;
  
  return cacheApiResponse({
    ttl,
    namespace,
    methods: ['GET']
  });
}

/**
 * Middleware to set browser cache headers
 * @param {number} maxAgeSeconds - Maximum age in seconds for the browser cache
 * @returns {Function} Express middleware
 */
function setBrowserCache(maxAgeSeconds = 3600) {
  return (req, res, next) => {
    // Set Cache-Control header
    res.setHeader('Cache-Control', `public, max-age=${maxAgeSeconds}`);
    
    // Set Expires header (for older browsers)
    const expiresDate = new Date();
    expiresDate.setSeconds(expiresDate.getSeconds() + maxAgeSeconds);
    res.setHeader('Expires', expiresDate.toUTCString());
    
    // Continue processing the request
    next();
  };
}

/**
 * Manually invalidate cache for a specific key
 * @param {string} namespace - Cache namespace
 * @param {string} key - Cache key to invalidate
 * @returns {boolean} Success status
 */
function invalidateCache(namespace, key) {
  try {
    return cacheManager.del(namespace, key);
  } catch (error) {
    console.error('Cache invalidation error:', error);
    return false;
  }
}

module.exports = {
  cacheApiResponse,
  cacheUserApiResponse,
  cacheLearningPathResponse,
  cacheContentResponse,
  setBrowserCache,
  invalidateCache
};