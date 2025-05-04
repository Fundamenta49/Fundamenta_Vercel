/**
 * Standalone Health Check Server using Express
 * 
 * This is a minimalist Express app that only handles health checks
 * for CloudRun deployments. It responds with {"status":"ok"} to the root path.
 */

const express = require('express');
const app = express();

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - User-Agent: ${req.headers['user-agent'] || 'none'}`);
  next();
});

// Respond to all GET requests with health check response
app.get('*', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Also handle POST requests with health check response
app.post('*', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Express health check server running on port ${PORT}`);
});