/**
 * Standalone Health Check Server using Express
 * 
 * This is a minimalist Express app that only handles health checks
 * for CloudRun deployments. It responds with {"status":"ok"} to the root path.
 */

const express = require('express');
const fs = require('fs');
const path = require('path');

// Create a new express app
const app = express();
const PORT = process.env.PORT || 8080;

// Health check response
const HEALTH_RESPONSE = { status: 'ok' };

// Create static health check files
fs.writeFileSync(path.join(__dirname, '_health'), JSON.stringify(HEALTH_RESPONSE));
fs.writeFileSync(path.join(__dirname, 'health'), JSON.stringify(HEALTH_RESPONSE));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Check if this is a health check request based on headers
  const isGoogleHealthCheck = req.headers['user-agent'] && 
                             (req.headers['user-agent'].includes('GoogleHC') || 
                              req.headers['user-agent'].includes('kube-probe'));
  
  if (isGoogleHealthCheck) {
    console.log('Detected GoogleHC health check request');
    return res.status(200).json(HEALTH_RESPONSE);
  }
  
  next();
});

// Handle root path for CloudRun health checks
app.get('/', (req, res) => {
  // Check for health check query parameter
  if (req.query['health-check'] === 'true' || req.query['health'] === 'true') {
    console.log('Responding to health check query parameter');
    return res.status(200).json(HEALTH_RESPONSE);
  }
  
  // Check for JSON Accept header
  if (req.headers['accept'] && req.headers['accept'].includes('application/json')) {
    console.log('Responding to JSON accept header');
    return res.status(200).json(HEALTH_RESPONSE);
  }
  
  // Default response for root path
  console.log('Sending health check response for root path');
  res.status(200).json(HEALTH_RESPONSE);
});

// Explicit health check path
app.get('/_health', (req, res) => {
  console.log('Responding to explicit /_health endpoint');
  res.status(200).json(HEALTH_RESPONSE);
});

// Alternative health check path
app.get('/health', (req, res) => {
  console.log('Responding to explicit /health endpoint');
  res.status(200).json(HEALTH_RESPONSE);
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Health check server listening on port ${PORT}`);
  console.log(`Server time: ${new Date().toISOString()}`);
  console.log('Ready to handle CloudRun health checks');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});