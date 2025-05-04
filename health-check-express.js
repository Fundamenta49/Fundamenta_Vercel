/**
 * Standalone Health Check Server using Express
 * 
 * This is a minimalist Express app that only handles health checks
 * for CloudRun deployments. It responds with {"status":"ok"} to the root path.
 */

const express = require('express');
const app = express();

// Health check middleware for CloudRun - multiple paths for maximum compatibility
const HEALTH_RESPONSE = JSON.stringify({ status: 'ok' });

// Handle root path
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
  console.log(`Health check responded at root path at ${new Date().toISOString()}`);
});

// Handle /_health path
app.get('/_health', (req, res) => {
  res.status(200).json({ status: 'ok' });
  console.log(`Health check responded at /_health path at ${new Date().toISOString()}`);
});

// Handle /health path
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
  console.log(`Health check responded at /health path at ${new Date().toISOString()}`);
});

// Handle query parameter health check - domain.com/?health=true
app.get('/', (req, res, next) => {
  if (req.query.health === 'true' || req.query['health-check'] === 'true') {
    res.status(200).json({ status: 'ok' });
    console.log(`Health check responded to query parameter at ${new Date().toISOString()}`);
  } else {
    next();
  }
});

// Fallback route for any other URL
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Express health check server running on port ${PORT}`);
  console.log('Server responds only to GET / with {"status":"ok"}');
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  process.exit(0);
});