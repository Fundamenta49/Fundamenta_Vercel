/**
 * Request Timeout Middleware
 * 
 * This middleware adds a timeout to HTTP requests to prevent them from hanging indefinitely.
 * When a request exceeds the defined timeout, it will respond with a 408 Request Timeout error.
 */

/**
 * Creates a timeout middleware with the specified timeout duration
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Function} Express middleware function
 */
function timeoutMiddleware(timeoutMs = 10000) {
  return (req, res, next) => {
    // Skip for health check endpoints
    if (req.path.includes('/health') || req.path.includes('/_ah/')) {
      return next();
    }

    // Set a timeout for the request
    const timeoutId = setTimeout(() => {
      // Only respond if headers haven't been sent yet
      if (!res.headersSent) {
        console.error(`[Timeout] Request to ${req.method} ${req.originalUrl} timed out after ${timeoutMs}ms`);
        
        // Clean up any response events
        res.removeAllListeners();
        
        // Send a timeout response
        res.status(408).json({
          error: true,
          message: 'Request timed out. Please try again later.',
          code: 'REQUEST_TIMEOUT',
          path: req.originalUrl
        });
      }
    }, timeoutMs);

    // Clear the timeout when the response finishes
    res.on('finish', () => {
      clearTimeout(timeoutId);
    });

    // Clear the timeout if there's an error
    res.on('close', () => {
      clearTimeout(timeoutId);
    });

    next();
  };
}

// Export with default timeout of 10 seconds
module.exports = {
  timeoutMiddleware
};