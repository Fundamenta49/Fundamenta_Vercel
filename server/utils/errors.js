/**
 * Custom error classes for explicit error handling
 * These are used throughout the application to provide more specific error types
 * and improve error handling, debugging, and user feedback.
 */

/**
 * ValidationError - Used when input data or parameters fail validation
 * For example, when user input is missing required fields or has incorrect formats
 */
export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}

/**
 * NotFoundError - Used when a requested resource cannot be found
 * For example, when a user, pathway, or other entity does not exist
 */
export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}

/**
 * AuthorizationError - Used when a user lacks permission to perform an action
 * For example, when a user tries to access another user's data
 */
export class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthorizationError';
    this.status = 403;
  }
}

/**
 * DatabaseError - Used for database-specific errors
 * For example, connection issues, timeout errors, or constraint violations
 */
export class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DatabaseError';
    this.status = 500;
  }
}

/**
 * ConflictError - Used when a requested operation cannot be performed due to a conflict
 * For example, when trying to create an entity that already exists
 */
export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.status = 409;
  }
}

/**
 * ServiceUnavailableError - Used when an external service is unavailable
 * For example, when an API call fails due to the service being down
 */
export class ServiceUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ServiceUnavailableError';
    this.status = 503;
  }
}

/**
 * RateLimitExceededError - Used when a client has made too many requests
 * For example, when a user is sending too many requests in a short time period
 */
export class RateLimitExceededError extends Error {
  constructor(message) {
    super(message || 'Rate limit exceeded, please try again later');
    this.name = 'RateLimitExceededError';
    this.status = 429;
  }
}

/**
 * Helper function to wrap async route handlers with error handling
 * This reduces redundant try/catch blocks in route handlers
 */
export function asyncHandler(fn) {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error('API Error:', {
        path: req.path,
        method: req.method,
        error: {
          name: error.name,
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      });
      
      // Handle known error types with appropriate status codes
      if (error instanceof ValidationError ||
          error instanceof NotFoundError ||
          error instanceof AuthorizationError ||
          error instanceof DatabaseError ||
          error instanceof ConflictError ||
          error instanceof ServiceUnavailableError ||
          error instanceof RateLimitExceededError) {
        return res.status(error.status).json({
          error: error.name,
          message: error.message,
          success: false
        });
      }
      
      // Handle Zod validation errors
      if (error.name === 'ZodError') {
        return res.status(400).json({
          error: 'ValidationError',
          message: 'Validation failed',
          details: error.errors,
          success: false
        });
      }
      
      // Handle JWT authentication errors
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(401).json({
          error: 'AuthenticationError',
          message: error.name === 'TokenExpiredError' 
            ? 'Your session has expired, please log in again' 
            : 'Authentication failed',
          success: false
        });
      }
      
      // Handle unknown errors
      const statusCode = error.status || error.statusCode || 500;
      return res.status(statusCode).json({
        error: error.name || 'ServerError',
        message: statusCode === 500 
          ? 'An unexpected error occurred' 
          : error.message || 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        success: false
      });
    }
  };
}