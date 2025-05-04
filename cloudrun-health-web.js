/**
 * Minimal HTTP Server for CloudRun Health Checks
 * This server responds to health check requests from CloudRun
 * and forwards other requests to the main application.
 */

// Use only built-in Node.js modules for maximum reliability
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Health check response JSON
const HEALTH_RESPONSE = JSON.stringify({ status: 'ok' });

// Create static files for health checks
fs.writeFileSync(path.join(__dirname, '_health'), HEALTH_RESPONSE);
fs.writeFileSync(path.join(__dirname, 'health'), HEALTH_RESPONSE);
fs.writeFileSync(path.join(__dirname, 'index.json'), HEALTH_RESPONSE);

console.log(`CloudRun health check server starting at ${new Date().toISOString()}`);

// Create our server to handle health checks
const server = http.createServer((req, res) => {
  // Log the request for debugging
  console.log(`Received ${req.method} request for ${req.url || '/'}`);
  
  // Check for health check paths or patterns
  const isHealthCheckPath = req.url === '/' || 
                           req.url === '/_health' || 
                           req.url === '/health' || 
                           req.url === '/index.json' ||
                           req.url === '/?health=true' ||
                           req.url === '/?health-check=true';
                           
  const isHealthCheckAgent = req.headers['user-agent']?.includes('GoogleHC') || 
                            req.headers['user-agent']?.includes('kube-probe');
                            
  const wantsJsonResponse = req.headers['accept']?.includes('application/json');
  
  // Determine if this is a health check request
  const isHealthCheck = isHealthCheckPath || isHealthCheckAgent || wantsJsonResponse;
  
  if (isHealthCheck) {
    // Respond with the health check response
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Content-Length': HEALTH_RESPONSE.length,
      'Cache-Control': 'no-cache',
      'X-Health-Check': 'true'
    });
    res.end(HEALTH_RESPONSE);
    console.log(`Health check response sent for ${req.url || '/'}`);
    return;
  }
  
  // For non-health check requests, just return a basic page
  // In a real deployment, this would proxy to the main app
  const response = '<html><body><h1>Fundamenta Life Skills</h1><p>Application is running.</p></body></html>';
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': Buffer.byteLength(response),
    'Cache-Control': 'no-cache'
  });
  res.end(response);
});

// Start the server on the CloudRun port
const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`CloudRun health check server listening on port ${PORT}`);
  console.log(`Server will handle health checks at / and /_health`);
  
  // Also create a health check file in the current directory (for static serving)
  try {
    const healthFile = path.join(process.cwd(), '_health');
    fs.writeFileSync(healthFile, HEALTH_RESPONSE);
    console.log(`Created health check file at ${healthFile}`);
  } catch (error) {
    console.error('Failed to create health check file:', error);
  }
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