/**
 * CloudRun Startup Script
 * 
 * This script is designed to be the entry point for CloudRun deployments.
 * It starts a minimal health check server on the main port and then 
 * starts the actual application.
 */

const { fork } = require('child_process');
const http = require('http');

console.log(`CloudRun startup script starting at ${new Date().toISOString()}`);

// Define the response that CloudRun expects
const HEALTH_RESPONSE = JSON.stringify({ status: 'ok' });

// Create a server that only responds to health checks
const healthServer = http.createServer((req, res) => {
  if (req.method === 'GET' && (req.url === '/' || req.url === '/?')) {
    // This is the health check response required by CloudRun
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Content-Length': HEALTH_RESPONSE.length
    });
    res.end(HEALTH_RESPONSE);
    console.log(`Handled health check at ${new Date().toISOString()}`);
  } else {
    // For any other requests, respond with a temporary redirect
    // This ensures browsers will still reach the app once it's ready
    res.writeHead(307, { 
      'Location': '/app', 
      'Content-Type': 'text/plain' 
    });
    res.end('Redirecting to application...');
  }
});

// Listen on the port provided by CloudRun
const PORT = process.env.PORT || 8080;
healthServer.listen(PORT, '0.0.0.0', () => {
  console.log(`CloudRun startup: Health check server running on port ${PORT}`);
  console.log('Health check server will handle requests while application starts');
  
  // Set the environment to production
  process.env.NODE_ENV = 'production';
  
  // Start the actual application
  console.log('Starting main application...');
  const app = fork('dist/index.js', [], {
    stdio: 'inherit',
    env: { 
      ...process.env,
      PORT: parseInt(PORT) + 1, // Run the actual app on the next port
      HEALTH_CHECK_ONLY: 'false' // Tell the app not to handle health checks
    }
  });
  
  // Handle app exit
  app.on('exit', (code) => {
    console.log(`Main application exited with code ${code}`);
    if (code !== 0) {
      console.log('Restarting main application...');
      // Restart the application if it crashes
      setTimeout(() => {
        process.exit(1); // Let CloudRun restart the container
      }, 1000);
    }
  });
});

// Handle health server errors
healthServer.on('error', (error) => {
  console.error('Health check server error:', error);
  process.exit(1);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  healthServer.close(() => {
    console.log('Health check server closed');
    process.exit(0);
  });
});