// CloudRun health check server with application launcher
// This server handles health checks while also starting the main application

const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Find the main application file
const serverScriptPath = path.resolve(__dirname, 'server/index.js');
const serverScriptExists = fs.existsSync(serverScriptPath);

console.log(`[CloudRun] Checking for main application at: ${serverScriptPath}`);
console.log(`[CloudRun] Main application ${serverScriptExists ? 'found' : 'not found'}`);

// Track if the main application is ready
let mainAppReady = false;
let mainAppProcess = null;
let startupTimeout = null;

// Create health check server
const healthServer = http.createServer((req, res) => {
  // Log health check requests (but not too often)
  if (req.url === '/' || req.url.includes('health')) {
    console.log(`[${new Date().toISOString()}] Health check: ${req.method} ${req.url}`);
  }
  
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
  
  // Health check response - always return 200 for CloudRun
  if (req.url === '/' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end('{"status":"ok"}');
    return;
  }
  
  // If this is a health request, handle it
  if (req.url.includes('health') || req.headers['user-agent']?.includes('GoogleHC')) {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end('{"status":"ok"}');
    return;
  }
  
  // For all other requests, if main app is ready, proxy to the main app
  // Otherwise, return a startup message
  if (!mainAppReady) {
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(503);
    res.end(`
      <html>
        <head>
          <title>Fundamenta - Starting Up</title>
          <meta http-equiv="refresh" content="5">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            h1 { color: #333; }
            .loader { border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 2s linear infinite; margin: 20px auto; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <h1>Fundamenta</h1>
          <p>Application is starting up, please wait...</p>
          <div class="loader"></div>
          <p>This page will refresh automatically every 5 seconds.</p>
        </body>
      </html>
    `);
    return;
  }
  
  // If we get here, main app should be handling this request
  // But as a fallback, return a redirect to the main app
  res.setHeader('Content-Type', 'text/html');
  res.writeHead(307, { 'Location': '/' });
  res.end();
});

// Start the main application
function startMainApplication() {
  console.log('[CloudRun] Starting main application...');
  
  const env = { ...process.env, PORT: process.env.MAIN_APP_PORT || 8081 };
  const mainPort = env.PORT;
  
  try {
    // If building is needed before running
    if (fs.existsSync('./build.sh')) {
      console.log('[CloudRun] Running build script...');
      const buildProcess = spawn('/bin/bash', ['./build.sh'], { 
        stdio: 'inherit',
        env
      });
      
      buildProcess.on('close', (code) => {
        console.log(`[CloudRun] Build process exited with code ${code}`);
        if (code !== 0) {
          console.error('[CloudRun] Build failed, starting application anyway...');
        }
        launchApp(env, mainPort);
      });
    } else {
      launchApp(env, mainPort);
    }
  } catch (error) {
    console.error('[CloudRun] Failed to start main application:', error);
  }
}

function launchApp(env, mainPort) {
  try {
    // Try to find the right entry point
    let command = 'node';
    let args = [];
    
    if (fs.existsSync('./server/index.js')) {
      args = ['./server/index.js'];
    } else if (fs.existsSync('./dist/server.js')) {
      args = ['./dist/server.js'];
    } else if (fs.existsSync('./server.js')) {
      args = ['./server.js'];
    } else if (fs.existsSync('./app.js')) {
      args = ['./app.js'];
    } else {
      console.warn('[CloudRun] Could not find main application entry point, trying package.json script');
      if (fs.existsSync('./package.json')) {
        const pkg = require('./package.json');
        if (pkg.scripts && pkg.scripts.start) {
          command = 'npm';
          args = ['run', 'start'];
        }
      }
    }
    
    console.log(`[CloudRun] Launching application with: ${command} ${args.join(' ')}`);
    
    mainAppProcess = spawn(command, args, { 
      stdio: 'inherit',
      env
    });
    
    mainAppProcess.on('error', (err) => {
      console.error('[CloudRun] Failed to start main application process:', err);
    });
    
    mainAppProcess.on('close', (code) => {
      console.log(`[CloudRun] Main application process exited with code ${code}`);
      mainAppReady = false;
      
      // Restart the main app if it crashes
      setTimeout(() => {
        console.log('[CloudRun] Restarting main application process...');
        startMainApplication();
      }, 5000);
    });
    
    // Mark the app as ready after a short delay
    startupTimeout = setTimeout(() => {
      console.log(`[CloudRun] Main application assumed ready at http://localhost:${mainPort}`);
      mainAppReady = true;
    }, 10000);
  } catch (error) {
    console.error('[CloudRun] Error launching app:', error);
  }
}

// Listen on CloudRun's expected port
const PORT = process.env.PORT || 8080;
healthServer.listen(PORT, '0.0.0.0', () => {
  console.log(`[CloudRun] Health check server running at http://0.0.0.0:${PORT}/`);
  console.log(`[CloudRun] Server time: ${new Date().toISOString()}`);
  console.log('[CloudRun] Health server is handling root path for health checks');
  
  // Start the main application after the health server is running
  startMainApplication();
});