// Ultra-minimal HTTP server for CloudRun with extensive logging
const http = require('http');
const os = require('os');

// Pre-compute the response to avoid any JSON.stringify overhead during request processing
const HEALTH_RESPONSE = JSON.stringify({ status: 'ok' });
const RESPONSE_BUFFER = Buffer.from(HEALTH_RESPONSE);

// Log startup information
console.log('===== CLOUDRUN MINIMAL HEALTH CHECK SERVER =====');
console.log(`Starting at: ${new Date().toISOString()}`);
console.log(`Hostname: ${os.hostname()}`);
console.log(`Platform: ${os.platform()} ${os.release()}`);
console.log(`Node version: ${process.version}`);
console.log(`Memory: ${Math.round(os.totalmem() / 1024 / 1024)}MB total, ${Math.round(os.freemem() / 1024 / 1024)}MB free`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log('=============================================');

// Create a server that responds to all requests with health check response
const server = http.createServer((req, res) => {
  // Log all requests with detailed information
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - User-Agent: ${req.headers['user-agent'] || 'none'}`);
  
  // Set response headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Health-Check', 'true');
  
  // Always respond with status:ok for any path
  res.statusCode = 200;
  res.end(RESPONSE_BUFFER);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  }
});

// Set up graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}/`);
  console.log(`Health check response: ${HEALTH_RESPONSE}`);
  console.log('Ready for CloudRun health checks');
});