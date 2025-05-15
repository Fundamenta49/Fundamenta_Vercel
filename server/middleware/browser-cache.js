/**
 * Browser Cache Middleware
 * Part of Bundle 5B: Performance & Quality Optimization
 * 
 * This middleware sets appropriate Cache-Control headers for static assets
 * to improve frontend loading performance by leveraging browser caching.
 */

/**
 * Creates middleware to set browser cache headers
 * @param {number} maxAgeSeconds - Maximum age in seconds for the browser cache
 * @returns {Function} Express middleware
 */
function setBrowserCache(maxAgeSeconds = 3600) {
  return (req, res, next) => {
    // Set Cache-Control header
    res.setHeader('Cache-Control', `public, max-age=${maxAgeSeconds}`);
    
    // Set Expires header (for older browsers)
    const expiresDate = new Date();
    expiresDate.setSeconds(expiresDate.getSeconds() + maxAgeSeconds);
    res.setHeader('Expires', expiresDate.toUTCString());
    
    // Continue processing the request
    next();
  };
}

module.exports = {
  setBrowserCache
};