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
 * Helper function to wrap async route handlers with error handling
 * This reduces redundant try/catch blocks in route handlers
 */
export function asyncHandler(fn) {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error('API Error:', error);
      
      // Handle known error types with appropriate status codes
      if (error instanceof ValidationError ||
          error instanceof NotFoundError ||
          error instanceof AuthorizationError ||
          error instanceof DatabaseError ||
          error instanceof ConflictError ||
          error instanceof ServiceUnavailableError) {
        return res.status(error.status).json({
          error: error.name,
          message: error.message
        });
      }
      
      // Handle unknown errors
      return res.status(500).json({
        error: 'ServerError',
        message: 'An unexpected error occurred'
      });
    }
  };
}