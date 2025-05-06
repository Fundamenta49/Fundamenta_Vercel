/**
 * CloudRun Health Check Web Server
 * 
 * This file serves as the entry point for CloudRun deployments.
 * It handles health checks and also serves the full web application.
 */

const fs = require('fs');
const path = require('path');
const express = require('express');
const { createServer } = require('http');

// Create Express app
const app = express();

// Important constants
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';
const DIST_DIR = path.join(__dirname, 'dist');
const CLIENT_DIR = path.join(DIST_DIR, 'client');
const PUBLIC_DIR = path.join(DIST_DIR, 'public');

console.log('Starting CloudRun Health Check Web Server');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`PORT: ${PORT}`);
console.log(`Current directory: ${process.cwd()}`);
console.log(`DIST_DIR: ${DIST_DIR}`);
console.log(`CLIENT_DIR: ${CLIENT_DIR}`);
console.log(`PUBLIC_DIR: ${PUBLIC_DIR}`);

// Try to list directories to help debug
try {
  console.log('Current directory contents:', fs.readdirSync('.'));
  if (fs.existsSync(DIST_DIR)) {
    console.log('Dist directory contents:', fs.readdirSync(DIST_DIR));
  }
  if (fs.existsSync(CLIENT_DIR)) {
    console.log('Client directory contents:', fs.readdirSync(CLIENT_DIR));
  }
} catch (err) {
  console.error('Error listing directories:', err);
}

// Health check middleware
app.use((req, res, next) => {
  // Handle health checks
  if (req.path === '/' && 
      (req.headers['user-agent']?.includes('GoogleHC') || 
       req.query['health-check'] === 'true' || 
       req.headers['x-health-check'] === 'true')) {
    console.log(`Health check request: ${req.method} ${req.path}`);
    return res.status(200).json({ status: 'ok' });
  }
  next();
});

// Handle authentication errors gracefully
app.use((req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(body) {
    // Intercept 401 errors for /api/auth endpoints
    if (req.path.startsWith('/api/auth') && res.statusCode === 401) {
      console.log(`Auth request handled with fallback: ${req.path}`);
      if (req.path === '/api/auth/me') {
        return originalSend.call(this, JSON.stringify({ 
          guest: true, 
          message: "User not authenticated - using guest mode" 
        }));
      }
    }
    
    return originalSend.call(this, body);
  };
  
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message 
  });
});

// Serve static files from client build
if (fs.existsSync(CLIENT_DIR)) {
  console.log(`Serving static files from ${CLIENT_DIR}`);
  app.use(express.static(CLIENT_DIR));
}

// Serve static files from public directory
if (fs.existsSync(PUBLIC_DIR)) {
  console.log(`Serving public files from ${PUBLIC_DIR}`);
  app.use(express.static(PUBLIC_DIR));
}

// API routes for the full server
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    time: new Date().toISOString()
  });
});

// Add mock authentication API for deployment
app.get('/api/auth/me', (req, res) => {
  // In production, we'll use a guest account until the full server is running
  console.log('Returning guest user for /api/auth/me');
  res.json({
    guest: true,
    id: 'guest-user',
    username: 'Guest User',
    authenticated: false,
    message: 'Using guest mode until authentication is fully configured'
  });
});

// Add simple login page for deployment
app.get('/login', (req, res) => {
  console.log('Serving simplified login page');
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Fundamenta - Log In</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          background-color: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          padding: 1rem;
          color: #1f2937;
        }
        .login-container {
          background-color: white;
          border-radius: 0.5rem;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          width: 100%;
          max-width: 24rem;
        }
        h1 {
          margin-top: 0;
          font-size: 1.5rem;
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .button {
          display: block;
          width: 100%;
          padding: 0.75rem 1rem;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-size: 1rem;
          font-weight: 500;
          text-align: center;
          cursor: pointer;
          text-decoration: none;
          transition: background-color 0.15s;
        }
        .button:hover {
          background-color: #1d4ed8;
        }
        .button-guest {
          margin-top: 0.75rem;
          background-color: #6b7280;
        }
        .button-guest:hover {
          background-color: #4b5563;
        }
        .button-replit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .logo {
          width: 24px;
          height: 24px;
        }
        .message {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="login-container">
        <h1>Log in to Fundamenta</h1>
        <a href="/api/login" class="button">Log in with Replit</a>
        <a href="/" class="button button-guest">Continue as Guest</a>
        <p class="message">
          Log in to save your progress and access all features.
        </p>
      </div>
    </body>
    </html>
  `);
});

// Add fallback endpoints for Replit auth
app.get('/api/login', (req, res) => {
  console.log('Login attempt - redirecting to login page');
  res.redirect('/login');
});

app.get('/api/callback', (req, res) => {
  console.log('Auth callback received - redirecting to home with guest mode');
  // In a real implementation, this would process the callback and create a session
  res.redirect('/?guest=true');
});

app.get('/api/logout', (req, res) => {
  console.log('Logout attempt - redirecting to home');
  res.redirect('/');
});

// Add a fallback for other auth endpoints
app.all('/api/auth/*', (req, res) => {
  if (req.path !== '/api/auth/me') {
    console.log(`Fallback auth response for: ${req.path}`);
    res.json({
      success: true,
      guest: true,
      message: 'Authentication endpoint stub'
    });
  }
});

// Add fallback for AI service endpoints
app.all('/api/ai/*', (req, res) => {
  console.log(`AI service fallback for: ${req.path}`);
  res.json({
    success: true,
    message: 'AI service endpoint fallback',
    status: 'ok',
    fallback: true
  });
});

// Add fallback for other APIs
app.get('/api/fallback-status', (req, res) => {
  res.json({ enabled: true, reason: 'Deployment mode' });
});

// Add fallback for notification APIs
app.get('/api/notifications/*', (req, res) => {
  res.json({ notifications: [], unread: 0 });
});

// Add fallback for user settings
app.get('/api/user/settings', (req, res) => {
  res.json({
    theme: 'system',
    notifications: false,
    tourCompleted: false
  });
});

// For client-side routing, send index.html for all non-API routes
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // Try to send the index.html file
  const indexPath = path.join(CLIENT_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  
  // If no index.html, serve a generic HTML page with navigation options
  res.send(`
    <html>
      <head>
        <title>Fundamenta Life Skills</title>
        <style>
          body { 
            font-family: system-ui, -apple-system, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 2rem;
            line-height: 1.6;
          }
          h1 { color: #4B5563; }
          .message { 
            padding: 1rem; 
            background: #f3f4f6; 
            border-radius: 0.5rem;
            margin: 1rem 0;
          }
          .nav {
            display: flex;
            gap: 1rem;
            margin: 1.5rem 0;
          }
          .button {
            display: inline-block;
            padding: 0.5rem 1rem;
            background-color: #2563eb;
            color: white;
            border-radius: 0.25rem;
            text-decoration: none;
            font-weight: 500;
          }
          .button:hover {
            background-color: #1d4ed8;
          }
        </style>
      </head>
      <body>
        <h1>Fundamenta Life Skills</h1>
        <div class="message">
          <p>Welcome to Fundamenta! The application is deployed and the health check is successful.</p>
          <p>The full application should be visible. If you only see this page, please try navigating to the home page or login.</p>
        </div>
        
        <div class="nav">
          <a href="/" class="button">Home</a>
          <a href="/login" class="button">Login</a>
        </div>
      </body>
    </html>
  `);
});

// Start the server
const server = app.listen(PORT, HOST, () => {
  console.log(`CloudRun Health Check Web Server listening on port ${PORT}`);
});

// Start building the full application in the background
console.log('Starting build process in the background...');
const { execSync, spawn } = require('child_process');

// Function to run a command and return its output
function runCommand(command) {
  try {
    console.log(`Running command: ${command}`);
    const output = execSync(command, { encoding: 'utf8' });
    console.log(`Command output: ${output}`);
    return { success: true, output };
  } catch (error) {
    console.error(`Command failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Build the application
try {
  console.log('Building application...');
  
  // First build the frontend with Vite
  console.log('Building frontend with Vite...');
  runCommand('npm run build');
  
  // Verify the build output
  if (fs.existsSync('./dist')) {
    console.log('Dist directory exists, checking contents...');
    console.log('Dist directory contents:', fs.readdirSync('./dist'));
    
    // Copy client files to make them accessible
    if (fs.existsSync('./dist/client')) {
      console.log('Client directory exists, copying to root of dist...');
      try {
        // Copy all files from dist/client to ROOT/dist
        const clientFiles = fs.readdirSync('./dist/client');
        for (const file of clientFiles) {
          const sourcePath = path.join('./dist/client', file);
          const destPath = path.join('./dist', file);
          if (fs.lstatSync(sourcePath).isDirectory()) {
            // Create the directory if it doesn't exist
            if (!fs.existsSync(destPath)) {
              fs.mkdirSync(destPath, { recursive: true });
            }
            // Use cp -r for directories
            execSync(`cp -r ${sourcePath}/* ${destPath}/`);
          } else {
            // Use fs.copyFileSync for files
            fs.copyFileSync(sourcePath, destPath);
          }
          console.log(`Copied ${sourcePath} to ${destPath}`);
        }
        console.log('Successfully copied client files to dist root');
      } catch (err) {
        console.error('Error copying client files:', err);
      }
    } else {
      console.warn('Client directory does not exist in dist/');
    }
  } else {
    console.warn('Dist directory does not exist after build!');
  }
  
  // Serve static files from the current directory as a fallback
  if (fs.existsSync('./client/dist')) {
    console.log('Client dist directory exists directly, serving from there as well...');
    app.use(express.static('./client/dist'));
  }
  
  // Also serve files from any subdirectory that might have assets
  const potentialAssetDirs = [
    './client/dist/assets',
    './dist/assets',
    './dist/client/assets',
    './public',
    './dist/public',
    './client/public'
  ];
  
  for (const dir of potentialAssetDirs) {
    if (fs.existsSync(dir)) {
      console.log(`Found asset directory: ${dir}, serving static files from there...`);
      app.use('/assets', express.static(dir));
    }
  }
  
  console.log('Build and copy operations completed');
} catch (error) {
  console.error('Error during build process:', error);
}