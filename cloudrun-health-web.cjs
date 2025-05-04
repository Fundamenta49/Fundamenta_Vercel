/**
 * Ultra-Minimal CloudRun Health Check Server
 * This server is optimized specifically for passing CloudRun health checks.
 * It responds to all paths with {"status":"ok"} and nothing else.
 */

// Import required Node.js HTTP module
const http = require('http');

// Path for health check requests
const HEALTH_CHECK_PATHS = ['/', '/_health', '/health'];

// Pre-compute the health check response to avoid JSON.stringify overhead
const HEALTH_RESPONSE = JSON.stringify({ status: 'ok' });

// Create HTTP server
const server = http.createServer((req, res) => {
  // Log the request for debugging
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - User-Agent: ${req.headers['user-agent'] || 'none'}`);
  
  // Always respond with health check, regardless of path or method
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(HEALTH_RESPONSE), 
    'Cache-Control': 'no-cache'
  });
  
  // Send response
  res.end(HEALTH_RESPONSE);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  
  if (error.code === 'EADDRINUSE') {
    console.error('Address already in use - exiting');
    process.exit(1);
  }
});

// Handle shutdown signals
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received - shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received - shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Use PORT environment variable or fallback to 8080
const PORT = process.env.PORT || 8080;

// Start the server on all interfaces (0.0.0.0)
server.listen(PORT, '0.0.0.0', () => {
  console.log(`CloudRun health check server running on port ${PORT}`);
  console.log(`Health check response: ${HEALTH_RESPONSE}`);
});