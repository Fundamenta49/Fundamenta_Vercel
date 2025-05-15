/**
 * API Response Caching Middleware
 * 
 * This middleware caches API responses to improve performance for frequently accessed endpoints.
 * It can be selectively applied to specific routes based on their caching needs.
 */

import { cacheManager, CACHE_NAMESPACES } from '../utils/cache-manager.js';

// Default cache duration
const DEFAULT_CACHE_SECONDS = 5 * 60; // 5 minutes

/**
 * Middleware to cache API responses
 * @param {Object} options - Cache options
 * @param {string} options.namespace - Cache namespace (default: 'system')
 * @param {number} options.ttl - Time to live in seconds
 * @param {Function} options.keyGenerator - Custom function to generate cache key
 * @returns {Function} Express middleware
 */
export const cacheApiResponse = (options = {}) => {
  const {
    namespace = CACHE_NAMESPACES.SYSTEM,
    ttl = DEFAULT_CACHE_SECONDS,
    keyGenerator
  } = options;
  
  return (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    // Generate a cache key based on the request
    const cacheKey = keyGenerator 
      ? keyGenerator(req)
      : `${req.originalUrl || req.url}`;
    
    // Try to get from cache
    const cachedResponse = cacheManager.get(namespace, cacheKey);
    
    if (cachedResponse) {
      // Add cache indicator header
      res.set('X-Cache', 'HIT');
      return res.json(cachedResponse);
    }
    
    // Cache miss - continue with request but capture the response
    res.set('X-Cache', 'MISS');
    
    // Store the original json method
    const originalJson = res.json;
    
    // Override the json method to cache the response
    res.json = function(data) {
      // Don't cache error responses
      if (res.statusCode < 400) {
        cacheManager.set(namespace, cacheKey, data, ttl);
      }
      
      // Call the original json method
      return originalJson.call(this, data);
    };
    
    next();
  };
};

/**
 * Middleware to cache user-specific API responses
 * This version includes the user ID in the cache key
 * @param {Object} options - Cache options
 * @returns {Function} Express middleware
 */
export const cacheUserApiResponse = (options = {}) => {
  return (req, res, next) => {
    // Skip caching for non-GET requests or unauthenticated requests
    if (req.method !== 'GET' || !req.userId) {
      return next();
    }
    
    const userOptions = {
      namespace: CACHE_NAMESPACES.USER,
      ttl: options.ttl || DEFAULT_CACHE_SECONDS,
      keyGenerator: (req) => `${req.userId}:${req.originalUrl || req.url}`
    };
    
    return cacheApiResponse(userOptions)(req, res, next);
  };
};

/**
 * Middleware to cache learning path responses
 * @param {Object} options - Cache options
 * @returns {Function} Express middleware
 */
export const cacheLearningPathResponse = (options = {}) => {
  return cacheApiResponse({
    namespace: CACHE_NAMESPACES.LEARNING_PATH,
    ttl: options.ttl || 10 * 60, // 10 minutes default for learning paths
    ...options
  });
};

/**
 * Middleware to cache content responses
 * @param {Object} options - Cache options
 * @returns {Function} Express middleware
 */
export const cacheContentResponse = (options = {}) => {
  return cacheApiResponse({
    namespace: CACHE_NAMESPACES.CONTENT,
    ttl: options.ttl || 30 * 60, // 30 minutes default for content
    ...options
  });
};

/**
 * Middleware to skip caching for specific requests
 * @returns {Function} Express middleware
 */
export const noCache = () => {
  return (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
  };
};

/**
 * Middleware to set browser cache headers
 * @param {number} maxAge - Max age in seconds
 * @returns {Function} Express middleware
 */
export const setBrowserCache = (maxAge = 3600) => {
  return (req, res, next) => {
    res.set('Cache-Control', `public, max-age=${maxAge}`);
    next();
  };
};