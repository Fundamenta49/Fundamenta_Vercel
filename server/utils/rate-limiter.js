/**
 * Rate Limiting Middleware
 * Part of Bundle 5A security hardening
 * 
 * This utility provides configurable rate limiting for API endpoints
 * to prevent abuse and enhance security.
 */

import { RateLimitExceededError } from './errors.js';

// Simple in-memory store for rate limiting
// In production, use Redis or another persistent store for multi-node support
const ipRequests = new Map();
const userRequests = new Map();

// Clean old requests periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  
  // Clean IP-based entries
  for (const [ip, requests] of ipRequests.entries()) {
    const filtered = requests.filter(timestamp => now - timestamp < 60000);
    if (filtered.length === 0) {
      ipRequests.delete(ip);
    } else {
      ipRequests.set(ip, filtered);
    }
  }
  
  // Clean user-based entries
  for (const [userId, requests] of userRequests.entries()) {
    const filtered = requests.filter(timestamp => now - timestamp < 60000);
    if (filtered.length === 0) {
      userRequests.delete(userId);
    } else {
      userRequests.set(userId, filtered);
    }
  }
}, 60000); // Run every minute

/**
 * IP-based rate limiter
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
    
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Initialize tracking array if it's a new IP
    if (!ipRequests.has(ip)) {
      ipRequests.set(ip, []);
    }
    
    // Get existing requests and clean old ones
    const requests = ipRequests.get(ip);
    const recentRequests = requests.filter(timestamp => now - timestamp < 60000);
    
    // Check if the IP has exceeded the limit
    if (recentRequests.length >= maxRequests) {
      return next(new RateLimitExceededError('Too many requests, please try again later'));
    }
    
    // Add current request timestamp
    recentRequests.push(now);
    ipRequests.set(ip, recentRequests);
    
    // Add headers to help clients manage their request rate
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - recentRequests.length));
    res.setHeader('X-RateLimit-Reset', Math.ceil((now + 60000) / 1000));
    
    next();
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
    
    // If no authenticated user, skip this middleware
    if (!req.user || !req.user.id) {
      return next();
    }
    
    const userId = req.user.id;
    const now = Date.now();
    
    // Initialize tracking array if it's a new user
    if (!userRequests.has(userId)) {
      userRequests.set(userId, []);
    }
    
    // Get existing requests and clean old ones
    const requests = userRequests.get(userId);
    const recentRequests = requests.filter(timestamp => now - timestamp < 60000);
    
    // Check if the user has exceeded the limit
    if (recentRequests.length >= maxRequests) {
      return next(new RateLimitExceededError('Too many requests, please try again later'));
    }
    
    // Add current request timestamp
    recentRequests.push(now);
    userRequests.set(userId, recentRequests);
    
    // Add headers to help clients manage their request rate
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - recentRequests.length));
    res.setHeader('X-RateLimit-Reset', Math.ceil((now + 60000) / 1000));
    
    next();
  };
};

/**
 * Stricter rate limiter for sensitive endpoints (login, registration)
 * @param {number} maxRequests - Maximum requests per minute
 * @returns {Function} Express middleware
 */
export const strictRateLimiter = (maxRequests = 10) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Initialize tracking array if it's a new IP
    if (!ipRequests.has(ip)) {
      ipRequests.set(ip, []);
    }
    
    // Get existing requests and clean old ones
    const requests = ipRequests.get(ip);
    const recentRequests = requests.filter(timestamp => now - timestamp < 60000);
    
    // Check if the IP has exceeded the limit
    if (recentRequests.length >= maxRequests) {
      return next(new RateLimitExceededError('Too many authentication attempts, please try again later'));
    }
    
    // Add current request timestamp
    recentRequests.push(now);
    ipRequests.set(ip, recentRequests);
    
    // Add headers to help clients manage their request rate
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - recentRequests.length));
    res.setHeader('X-RateLimit-Reset', Math.ceil((now + 60000) / 1000));
    
    next();
  };
};