/**
 * Error Handling Middleware
 * Part of Bundle 5A security hardening
 * 
 * This middleware provides centralized error handling for the Express application.
 * It contains handlers for various error scenarios and ensures consistent error responses.
 */

import { RateLimitExceededError } from '../utils/errors.js';

/**
 * 404 Not Found handler for undefined routes
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: 'NotFoundError',
    message: `Path not found: ${req.path}`,
    success: false
  });
};

/**
 * Rate limit handler for rate-limited routes
 * This is triggered when a rate limit is exceeded
 */
export const rateLimitHandler = (req, res) => {
  throw new RateLimitExceededError(`Rate limit exceeded for ${req.ip}`);
};

/**
 * Global error handler middleware
 * This should be registered last in the middleware chain
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Global Error Handler:', {
    path: req.path,
    method: req.method,
    error: {
      name: err.name,
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });

  // Determine the status code
  const statusCode = err.status || err.statusCode || 500;
  
  // Send a consistent error response
  return res.status(statusCode).json({
    error: err.name || 'ServerError',
    message: statusCode === 500 
      ? 'An unexpected error occurred' 
      : err.message || 'Unknown error',
    success: false,
    // Only include details in development mode
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};