// Absolute minimum health check server for CloudRun
// No dependencies, extremely simple implementation

const http = require('http');

// Create server
const server = http.createServer((req, res) => {
  // Log all requests
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  // Set content type for all responses
  res.setHeader('Content-Type', 'application/json');
  
  // Exactly match CloudRun expectations - just {"status":"ok"}
  const responseBody = '{"status":"ok"}';
  
  // For any path, return the health check response with 200
  res.writeHead(200);
  res.end(responseBody);
});

// Listen on CloudRun's expected port
const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Bare health server running at http://0.0.0.0:${PORT}/`);
  console.log(`Server time: ${new Date().toISOString()}`);
  console.log('This server responds to ALL paths with {"status":"ok"}');
});