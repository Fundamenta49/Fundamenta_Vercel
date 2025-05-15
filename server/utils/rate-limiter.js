/**
 * Rate Limiting Middleware
 * Part of Bundle 5A security hardening
 * 
 * This utility provides configurable rate limiting for API endpoints
 * to prevent abuse and enhance security.
 */

import { RateLimitExceededError } from './errors.js';
import NodeCache from 'node-cache';

// In-memory cache for rate limiting
// Uses standard TTL (time-to-live) mechanism
const rateCache = new NodeCache({ 
  stdTTL: 60, // Default expiration in seconds
  checkperiod: 30, // Check for expired keys every 30 seconds
  useClones: false // For better performance
});

/**
 * IP-based rate limiter (uses the request IP address)
 * @param {number} maxRequests - Maximum requests per minute
 * @param {string[]} excludePaths - Array of paths to exclude from rate limiting
 * @returns {Function} Express middleware
 */
export const ipRateLimiter = (maxRequests = 60, excludePaths = []) => {
  return (req, res, next) => {
    // Skip rate limiting for excluded paths
    if (excludePaths.some(path => req.path.startsWith(path))) {
      return next();
    }

    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const key = `ip:${ip}:${req.path}`;
    
    try {
      const requests = rateCache.get(key) || 0;
      
      if (requests >= maxRequests) {
        throw new RateLimitExceededError(`Rate limit exceeded for ${req.ip}`);
      }
      
      // Increment request count
      rateCache.set(key, requests + 1);
      
      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - (requests + 1));
      
      next();
    } catch (error) {
      if (error instanceof RateLimitExceededError) {
        return res.status(429).json({
          error: 'RateLimitExceededError',
          message: 'Too many requests, please try again later',
          success: false
        });
      }
      next(error);
    }
  };
};

/**
 * User-based rate limiter (uses the authenticated user ID)
 * @param {number} maxRequests - Maximum requests per minute
 * @param {string[]} excludePaths - Array of paths to exclude from rate limiting
 * @returns {Function} Express middleware
 */
export const userRateLimiter = (maxRequests = 120, excludePaths = []) => {
  return (req, res, next) => {
    // Skip rate limiting for excluded paths
    if (excludePaths.some(path => req.path.startsWith(path))) {
      return next();
    }

    // Use user ID if available, otherwise fall back to IP
    const userId = req.user?.id || req.userId;
    if (!userId) {
      return next();
    }
    
    const key = `user:${userId}:${req.path}`;
    
    try {
      const requests = rateCache.get(key) || 0;
      
      if (requests >= maxRequests) {
        throw new RateLimitExceededError(`Rate limit exceeded for user ID ${userId}`);
      }
      
      // Increment request count
      rateCache.set(key, requests + 1);
      
      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - (requests + 1));
      
      next();
    } catch (error) {
      if (error instanceof RateLimitExceededError) {
        return res.status(429).json({
          error: 'RateLimitExceededError',
          message: 'Too many requests, please try again later',
          success: false
        });
      }
      next(error);
    }
  };
};

/**
 * Stricter rate limiter for sensitive endpoints (login, registration)
 * @param {number} maxRequests - Maximum requests per minute
 * @returns {Function} Express middleware
 */
export const strictRateLimiter = (maxRequests = 10) => {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const key = `strict:${ip}:${req.path}`;
    
    try {
      const requests = rateCache.get(key) || 0;
      
      if (requests >= maxRequests) {
        // Add exponential backoff for repeated attempts
        const penaltyFactor = Math.min(Math.floor(requests / maxRequests), 5);
        const penaltyTime = penaltyFactor * 60; // Additional penalty time in seconds
        
        rateCache.ttl(key, 60 + penaltyTime); // Extend the TTL with penalty
        
        throw new RateLimitExceededError(`Rate limit exceeded for ${req.ip}`);
      }
      
      // Increment request count
      rateCache.set(key, requests + 1);
      
      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - (requests + 1));
      
      next();
    } catch (error) {
      if (error instanceof RateLimitExceededError) {
        return res.status(429).json({
          error: 'RateLimitExceededError',
          message: 'Too many requests, please try again later',
          success: false,
          retryAfter: 60 // Seconds until next allowed request
        });
      }
      next(error);
    }
  };
};