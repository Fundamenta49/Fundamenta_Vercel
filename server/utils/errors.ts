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
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * NotFoundError - Used when a requested resource cannot be found
 * For example, when a user, pathway, or other entity does not exist
 */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

/**
 * AuthorizationError - Used when a user lacks permission to perform an action
 * For example, when a user tries to access another user's data
 */
export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

/**
 * DatabaseError - Used for database-specific errors
 * For example, connection issues, timeout errors, or constraint violations
 */
export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

/**
 * ConflictError - Used when a requested operation cannot be performed due to a conflict
 * For example, when trying to create an entity that already exists
 */
export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

/**
 * ServiceUnavailableError - Used when an external service is unavailable
 * For example, when an API call fails due to the service being down
 */
export class ServiceUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServiceUnavailableError';
  }
}

/**
 * Helper function to wrap async route handlers with error handling
 * This reduces redundant try/catch blocks in route handlers
 */
export function asyncHandler(fn: Function) {
  return async (req: any, res: any, next: any) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}