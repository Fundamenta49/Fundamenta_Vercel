/**
 * Standalone Health Check Server
 * 
 * This is a completely standalone Node.js HTTP server specifically for health checks
 * It will respond to GET / with {status: "ok"} and doesn't require any other modules
 * or middleware, making it extremely reliable.
 * 
 * This can be deployed separately on port 8080 for CloudRun health checks.
 * 
 * To use: node server/standalone-health.js
 */

// Simple HTTP server with no dependencies
const http = require('http');

// Create the server
const server = http.createServer((req, res) => {
  // Only handle GET requests to the root path
  if (req.method === 'GET' && (req.url === '/' || req.url === '/?')) {
    // Set headers
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'X-Health-Check': 'true'
    });
    
    // Send response
    res.end(JSON.stringify({ status: 'ok' }));
    
    console.log(`Health check request received and handled at ${new Date().toISOString()}`);
    return;
  }
  
  // For any other path, return 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

// Start the server
const PORT = process.env.HEALTH_PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Standalone health check server running on port ${PORT}`);
  console.log('This server ONLY responds to GET / with {"status":"ok"}');
});

// Handle errors
server.on('error', (error) => {
  console.error('Standalone health check server error:', error);
});