/**
 * Request Timeout Middleware
 * 
 * This middleware adds a timeout to all API requests to prevent long-running
 * requests from blocking the server and consuming resources.
 */

import { setTimeout } from 'timers/promises';

// Configuration
const DEFAULT_TIMEOUT = 30000; // 30 seconds default timeout
const LONG_RUNNING_ROUTES = [
  '/api/analyze', // AI analysis endpoints may take longer
  '/api/generate', 
  '/api/chat',
  '/api/export', // Data export processes
  '/api/import',
  '/api/backup'
];

/**
 * Determine if a route should have an extended timeout
 */
function isLongRunningRoute(url) {
  return LONG_RUNNING_ROUTES.some(route => url.startsWith(route));
}

/**
 * Get the appropriate timeout for a route
 */
function getTimeoutForRoute(url) {
  return isLongRunningRoute(url) ? DEFAULT_TIMEOUT * 2 : DEFAULT_TIMEOUT;
}

/**
 * Request timeout middleware
 * Adds a timeout to all API requests
 */
export default function timeoutMiddleware(req, res, next) {
  // Only apply timeout to API routes
  if (!req.url.startsWith('/api/')) {
    return next();
  }
  
  // Get timeout for this route
  const timeout = getTimeoutForRoute(req.url);
  
  // Setup timeout handling
  const timeoutPromise = setTimeout(timeout).then(() => {
    // Handle the timeout
    const routeType = isLongRunningRoute(req.url) ? 'long-running' : 'standard';
    console.warn(`Request timeout (${timeout}ms) for ${routeType} route: ${req.method} ${req.url}`);
    
    // Only send response if one hasn't been sent already
    if (!res.headersSent) {
      // Send timeout response
      res.status(408).json({
        error: 'Request Timeout',
        message: 'The request took too long to process and has timed out.',
        route: req.url,
        timeout: timeout
      });
    }
  });
  
  // Store the original end method
  const originalEnd = res.end;
  
  // Override the end method to clear the timeout when the response is sent
  res.end = function(...args) {
    // Cancel the timeout
    timeoutPromise.catch(() => {});
    
    // Call the original end method
    return originalEnd.apply(this, args);
  };
  
  next();
}