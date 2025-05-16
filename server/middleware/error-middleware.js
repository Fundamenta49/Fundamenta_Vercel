/**
 * Error Handling Middleware
 * 
 * This middleware provides centralized error handling for Express routes.
 * It catches errors thrown in routes and middlewares, logs them, and
 * returns a standardized JSON error response.
 */

/**
 * Global error handler middleware
 */
function errorHandlerMiddleware(err, req, res, next) {
  // Log the error with request context
  console.error(`[Error] ${req.method} ${req.originalUrl} - Error:`, {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    status: err.status || 500
  });

  // Handle different types of errors
  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errorCode = err.code || 'SERVER_ERROR';

  // Special handling for validation errors
  if (err.name === 'ValidationError' || err.name === 'ZodError') {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
  }

  // Send error response
  res.status(statusCode).json({
    error: true,
    message,
    code: errorCode,
    path: req.originalUrl,
    details: process.env.NODE_ENV === 'development' ? err.details || undefined : undefined
  });
}

/**
 * Wraps an async route handler with error catching
 * @param {Function} fn - Async route handler
 * @returns {Function} Express route handler with error catching
 */
function asyncErrorHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Not found handler middleware
 */
function notFoundMiddleware(req, res) {
  res.status(404).json({
    error: true,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    code: 'NOT_FOUND',
    path: req.originalUrl
  });
}

module.exports = {
  errorHandlerMiddleware,
  asyncErrorHandler,
  notFoundMiddleware
};