/**
 * CloudRun Health Check Web Server - IMPROVED VERSION
 * 
 * This file serves as the entry point for CloudRun deployments.
 * It handles health checks required by CloudRun and serves the full web application.
 */

const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');

// Create Express app
const app = express();

// Important constants
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';
const BASE_DIR = process.cwd();
const DIST_DIR = path.join(BASE_DIR, 'dist');
const CLIENT_DIR = path.join(DIST_DIR, 'client');
const PUBLIC_DIR = path.join(DIST_DIR, 'public');

console.log('==========================================');
console.log('FUNDAMENTA CLOUDRUN DEPLOYMENT SERVER');
console.log('==========================================');
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Port: ${PORT}`);
console.log(`Base directory: ${BASE_DIR}`);
console.log(`Dist directory: ${DIST_DIR}`);

// Enable CORS for all routes
app.use(cors());

// Enable JSON parsing for API requests
app.use(express.json());

// Try to list directories to help debug
try {
  console.log('Listing directories for debugging:');
  if (fs.existsSync(BASE_DIR)) {
    console.log('Base directory contents:', fs.readdirSync(BASE_DIR).slice(0, 10), '...');
  }
  if (fs.existsSync(DIST_DIR)) {
    console.log('Dist directory contents:', fs.readdirSync(DIST_DIR));
    
    if (fs.existsSync(path.join(DIST_DIR, 'client'))) {
      console.log('Client directory contents:', fs.readdirSync(path.join(DIST_DIR, 'client')));
    }
    
    if (fs.existsSync(path.join(DIST_DIR, 'assets'))) {
      console.log('Assets directory contents:', fs.readdirSync(path.join(DIST_DIR, 'assets')).slice(0, 10), '...');
    }
  }
} catch (err) {
  console.error('Error listing directories:', err);
}

// =============================================
// CRITICAL: Ultra-Direct Health Check Handler
// This must be registered first to handle CloudRun health checks
// =============================================
app.get('/', (req, res, next) => {
  // Check if this is a health check request from CloudRun
  if (req.headers['user-agent']?.includes('GoogleHC') || 
      req.query['health-check'] === 'true' || 
      req.headers['x-health-check'] === 'true') {
    console.log('Health check request detected');
    res.set('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify({ status: 'ok' }));
  }
  next();
});

// =============================================
// Static File Serving
// =============================================

// Find the actual client directory by checking multiple possible locations
const possibleClientDirs = [
  CLIENT_DIR,
  DIST_DIR,
  path.join(BASE_DIR, 'client', 'dist'),
  path.join(BASE_DIR, 'client', 'build'),
  path.join(BASE_DIR, 'build'),
];

let clientRoot = null;
for (const dir of possibleClientDirs) {
  if (fs.existsSync(dir) && 
      (fs.existsSync(path.join(dir, 'index.html')) || 
       fs.existsSync(path.join(dir, 'assets')))) {
    clientRoot = dir;
    console.log(`Found client root at: ${clientRoot}`);
    break;
  }
}

// Serve static files from the client build directory
if (clientRoot) {
  console.log(`Serving static files from ${clientRoot}`);
  app.use(express.static(clientRoot));
  
  // Also check for assets directory
  if (fs.existsSync(path.join(clientRoot, 'assets'))) {
    console.log(`Serving assets from ${path.join(clientRoot, 'assets')}`);
    app.use('/assets', express.static(path.join(clientRoot, 'assets')));
  }
} else {
  console.warn('No client directory found! Static files will not be served.');
}

// Also serve from public directory if it exists
if (fs.existsSync(PUBLIC_DIR)) {
  console.log(`Serving public files from ${PUBLIC_DIR}`);
  app.use(express.static(PUBLIC_DIR));
}

// =============================================
// API Routes 
// =============================================

// Health check API for internal use
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'production',
    time: new Date().toISOString(),
    server: 'Fundamenta CloudRun Deployment'
  });
});

// Authentication API fallbacks
app.get('/api/auth/me', (req, res) => {
  console.log('Auth API: /api/auth/me request received');
  res.json({
    guest: true,
    id: 'guest-user',
    username: 'Guest User',
    name: 'Guest User',
    authenticated: false,
    role: 'guest'
  });
});

// Handle login/logout/register fallbacks
app.all('/api/auth/:action', (req, res) => {
  const action = req.params.action;
  console.log(`Auth API fallback: ${action} requested`);
  
  if (action === 'login' || action === 'register') {
    return res.json({
      success: true,
      message: 'Guest login successful',
      user: {
        guest: true,
        id: 'guest-user',
        username: 'Guest User',
        role: 'guest'
      }
    });
  } else if (action === 'logout') {
    return res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } else if (action === 'refresh') {
    return res.json({
      accessToken: 'guest-token',
      refreshToken: 'guest-refresh-token',
      expiresIn: 3600
    });
  }
  
  res.json({
    success: true,
    message: `Auth ${action} endpoint stub`,
    guest: true
  });
});

// AI service fallbacks
app.all('/api/ai/*', (req, res) => {
  console.log(`AI service fallback for: ${req.path}`);
  res.json({
    success: true,
    message: 'This feature is available after login',
    status: 'ok',
    guest: true
  });
});

// =============================================
// Client-side routing support
// =============================================

// Serve a login page on /login route
app.get('/login', (req, res) => {
  console.log('Serving login page');
  
  // Try to find the real login page first
  const indexHtmlPath = path.join(clientRoot || DIST_DIR, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    return res.sendFile(indexHtmlPath);
  }
  
  // If we can't find the real page, serve a simple login page
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Fundamenta Life Skills - Log In</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          background-color: #FBF7F0;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          padding: 1rem;
          color: #333;
        }
        .login-container {
          background-color: white;
          border-radius: 1rem;
          padding: 2.5rem;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          width: 100%;
          max-width: 26rem;
        }
        .header {
          text-align: center;
          margin-bottom: 2rem;
        }
        h1 {
          color: #EB6440;
          font-size: 2.2rem;
          margin: 0.5rem 0;
        }
        h2 {
          font-weight: normal;
          font-size: 1.1rem;
          color: #666;
          margin: 0.5rem 0 1.5rem;
        }
        .button {
          display: block;
          width: 100%;
          padding: 1rem;
          background-color: #EB6440;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 1.1rem;
          font-weight: 600;
          text-align: center;
          cursor: pointer;
          text-decoration: none;
          transition: background-color 0.2s;
          margin-bottom: 1rem;
        }
        .button:hover {
          background-color: #E05A3A;
        }
        .button-guest {
          background-color: #f0f0f0;
          color: #333;
        }
        .button-guest:hover {
          background-color: #e6e6e6;
        }
        .button-login {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }
        .logo {
          width: 24px;
          height: 24px;
        }
        .message {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.9rem;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="login-container">
        <div class="header">
          <h1>Fundamenta</h1>
          <h2>Life skills mastery begins here</h2>
        </div>
        
        <a href="/" class="button button-login">Sign in with Email</a>
        <a href="/" class="button button-guest">Continue as Guest</a>
        
        <p class="message">
          Sign in to track your progress and access all features
        </p>
      </div>
    </body>
    </html>
  `);
});

// For all other requests, return index.html to support client-side routing
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  console.log(`Client route requested: ${req.path}`);
  
  // Try to send the index.html file
  const indexHtmlPath = clientRoot ? 
    path.join(clientRoot, 'index.html') : 
    path.join(DIST_DIR, 'index.html');
    
  if (fs.existsSync(indexHtmlPath)) {
    return res.sendFile(indexHtmlPath);
  }
  
  // If we can't find the index.html, serve a fallback
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Fundamenta Life Skills</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          line-height: 1.6;
          color: #333;
        }
        .logo {
          font-size: 2.5rem;
          font-weight: bold;
          color: #EB6440;
          margin-bottom: 0.5rem;
        }
        h1 { color: #EB6440; }
        .message {
          padding: 1.5rem;
          background: #f8f8f8;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
          border-left: 4px solid #EB6440;
        }
        .nav {
          display: flex;
          gap: 1rem;
          margin: 2rem 0;
        }
        .button {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background-color: #EB6440;
          color: white;
          border-radius: 0.5rem;
          text-decoration: none;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        .button:hover {
          background-color: #E05A3A;
        }
        .status {
          margin-top: 2rem;
          font-size: 0.9rem;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="logo">Fundamenta</div>
      <h1>Life Skills Platform</h1>
      <div class="message">
        <p>The Fundamenta deployment is active and the health check is passing successfully.</p>
        <p>This is a fallback page. Please try navigating to the home page or login.</p>
      </div>
      
      <div class="nav">
        <a href="/" class="button">Home</a>
        <a href="/login" class="button">Log In</a>
      </div>
      
      <div class="status">
        <p>Server Status: Online | Path: ${req.path}</p>
      </div>
    </body>
    </html>
  `);
});

// =============================================
// Start the server
// =============================================
const server = app.listen(PORT, HOST, () => {
  console.log(`✅ Fundamenta CloudRun Server running on ${HOST}:${PORT}`);
});