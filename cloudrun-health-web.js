const http = require('http');

// Health check response JSON
const HEALTH_RESPONSE = JSON.stringify({ status: 'ok' });
const PORT = process.env.PORT || 8080;

// Create the health check server
const server = http.createServer((req, res) => {
  // Basic health check response for root path and health check paths
  if (req.url === '/' || req.url === '/_health' || req.url === '/health') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Content-Length': HEALTH_RESPONSE.length,
      'Cache-Control': 'no-cache'
    });
    res.end(HEALTH_RESPONSE);
    return;
  }

  // For non-health-check requests, provide a basic response
  const response = '<html><body><h1>Application is running</h1></body></html>';
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': Buffer.byteLength(response)
  });
  res.end(response);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Health check server listening on port ${PORT}`);
});

// Handle errors
server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});