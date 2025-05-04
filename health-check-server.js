/**
 * Standalone Health Check Server for CloudRun
 * 
 * This is an extremely simplified health check server with absolutely minimal dependencies
 * It will only respond to GET / with a {"status":"ok"} response and status 200
 */

// Use raw Node.js HTTP with no frameworks
const http = require('http');

// Define the response that CloudRun expects
const HEALTH_RESPONSE = JSON.stringify({ status: 'ok' });

// Create a server that only responds to health checks
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && (req.url === '/' || req.url === '/?')) {
    // This is the health check response required by CloudRun
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Content-Length': HEALTH_RESPONSE.length
    });
    res.end(HEALTH_RESPONSE);
    console.log(`Handled health check at ${new Date().toISOString()}`);
  } else {
    // For any other requests, pass to the main application
    res.writeHead(404);
    res.end('Not found');
  }
});

// Listen on the port provided by CloudRun
const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Ultra-minimal health check server running on port ${PORT}`);
});

// Log any errors
server.on('error', (error) => {
  console.error('Server error:', error);
});

console.log('CloudRun health check server started');