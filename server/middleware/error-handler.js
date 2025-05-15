/**
 * Global Error Handling Middleware
 * This middleware catches errors that occur during request processing
 * and ensures a consistent error response format for the client.
 */

import { ValidationError, NotFoundError, AuthorizationError, 
  DatabaseError, ConflictError, ServiceUnavailableError } from '../utils/errors.js';

/**
 * Middleware to handle errors from async route handlers
 * Ensures consistent error responses across the API
 */
export const errorHandler = (err, req, res, next) => {
  console.error('API Error:', {
    path: req.path,
    method: req.method,
    error: {
      name: err.name,
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    },
    body: process.env.NODE_ENV === 'development' ? req.body : undefined
  });
  
  // ZodError handling for validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'ValidationError',
      message: 'Validation failed',
      details: err.errors,
      success: false
    });
  }
  
  // Handle custom error types
  if (err instanceof ValidationError ||
      err instanceof NotFoundError ||
      err instanceof AuthorizationError ||
      err instanceof DatabaseError ||
      err instanceof ConflictError ||
      err instanceof ServiceUnavailableError) {
    return res.status(err.status).json({
      error: err.name,
      message: err.message,
      success: false
    });
  }
  
  // Handle JWT authentication errors
  if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'AuthenticationError',
      message: 'Authentication failed or token expired',
      success: false
    });
  }
  
  // Handle unexpected errors
  const statusCode = err.status || err.statusCode || 500;
  const message = statusCode === 500 
    ? 'An unexpected error occurred' 
    : err.message || 'Unknown error';
    
  res.status(statusCode).json({
    error: err.name || 'ServerError',
    message: message,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    success: false
  });
};

/**
 * Middleware to handle 404 errors for endpoints that don't exist
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'NotFoundError',
    message: `Endpoint not found: ${req.method} ${req.path}`,
    success: false
  });
};

/**
 * Rate limit exceeded error handler
 */
export const rateLimitHandler = (req, res) => {
  res.status(429).json({
    error: 'RateLimitExceeded', 
    message: 'Too many requests, please try again later',
    success: false
  });
};