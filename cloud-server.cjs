// CloudRun health check server with main application proxy
const http = require('http');
const https = require('https');
const os = require('os');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Pre-compute the health response
const HEALTH_RESPONSE = JSON.stringify({ status: 'ok' });
const HEALTH_BUFFER = Buffer.from(HEALTH_RESPONSE);

// Application settings
const MAIN_APP_PORT = process.env.MAIN_APP_PORT || 8081;
const MAIN_APP_HOST = process.env.MAIN_APP_HOST || 'localhost';
let mainAppReady = false;
let mainAppProcess = null;

// Log startup information
console.log('===== FUNDAMENTA CLOUDRUN SERVER =====');
console.log(`Starting at: ${new Date().toISOString()}`);
console.log(`Hostname: ${os.hostname()}`);
console.log(`Platform: ${os.platform()} ${os.release()}`);
console.log(`Node version: ${process.version}`);
console.log(`Memory: ${Math.round(os.totalmem() / 1024 / 1024)}MB total, ${Math.round(os.freemem() / 1024 / 1024)}MB free`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log('======================================');

// Create a server that handles health checks and proxies other requests
const server = http.createServer((req, res) => {
  const isRootPath = req.url === '/' || req.url === '';
  const isHealthCheck = 
    (isRootPath && (
      req.headers['user-agent']?.includes('GoogleHC') ||
      req.headers['user-agent']?.includes('kube-probe') ||
      req.headers['x-health-check'] === 'true' ||
      req.query?.health === 'true'
    )) || 
    req.url === '/_health' || 
    req.url === '/health' ||
    req.url.includes('health-check=true');
  
  // Log all requests for debugging
  if (isHealthCheck) {
    console.log(`[HEALTH] ${new Date().toISOString()} - ${req.method} ${req.url}`);
  } else if (req.url.startsWith('/api/')) {
    console.log(`[API] ${new Date().toISOString()} - ${req.method} ${req.url}`);
  }
  
  // Respond to health checks immediately
  if (isHealthCheck) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Health-Check', 'true');
    res.statusCode = 200;
    res.end(HEALTH_BUFFER);
    return;
  }
  
  // If main app is not ready yet, show a loading page
  if (!mainAppReady) {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'no-cache');
    res.statusCode = 503;
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
  
  // Proxy the request to the main application
  const options = {
    hostname: MAIN_APP_HOST,
    port: MAIN_APP_PORT,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };
  
  try {
    const proxy = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });
    
    proxy.on('error', (error) => {
      console.error('Proxy error:', error);
      
      res.statusCode = 502;
      res.setHeader('Content-Type', 'text/html');
      res.end(`
        <html>
          <head>
            <title>Fundamenta - Service Error</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
              h1 { color: #333; }
              .error { color: #e74c3c; }
            </style>
          </head>
          <body>
            <h1>Fundamenta</h1>
            <p class="error">The application encountered an error. Please try again in a few moments.</p>
          </body>
        </html>
      `);
    });
    
    req.pipe(proxy, { end: true });
  } catch (error) {
    console.error('Request handling error:', error);
    
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Internal Server Error');
  }
});

// Start the main application
function startMainApplication() {
  console.log('[MAIN] Starting main application...');
  
  const env = { 
    ...process.env, 
    PORT: MAIN_APP_PORT,
    // Make it clear to the app that it's running behind a proxy
    BEHIND_PROXY: 'true',
    // Ensure the app knows it's in production
    NODE_ENV: 'production'
  };
  
  try {
    // Find the best entry point for the application
    let command = 'node';
    let args = [];
    
    if (fs.existsSync('./build.sh')) {
      console.log('[MAIN] Running build script...');
      const buildProcess = spawn('bash', ['./build.sh'], { stdio: 'inherit', env });
      
      buildProcess.on('close', (code) => {
        console.log(`[MAIN] Build process exited with code ${code}`);
        launchMainApp(env);
      });
    } else {
      launchMainApp(env);
    }
  } catch (error) {
    console.error('[MAIN] Failed to start main application:', error);
  }
}

function launchMainApp(env) {
  // Try to find the best entry point
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
    console.log('[MAIN] Could not find main application entry point, trying package.json start script');
    if (fs.existsSync('./package.json')) {
      try {
        const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
        if (pkg.scripts && pkg.scripts.start) {
          command = 'npm';
          args = ['run', 'start'];
        }
      } catch (error) {
        console.error('[MAIN] Error reading package.json:', error);
      }
    }
  }
  
  console.log(`[MAIN] Launching with: ${command} ${args.join(' ')}`);
  
  mainAppProcess = spawn(command, args, { 
    stdio: 'inherit',
    env
  });
  
  mainAppProcess.on('error', (err) => {
    console.error('[MAIN] Process error:', err);
  });
  
  mainAppProcess.on('close', (code) => {
    console.log(`[MAIN] Process exited with code ${code}`);
    mainAppReady = false;
    
    // Restart the main app after a short delay
    setTimeout(() => {
      console.log('[MAIN] Restarting application...');
      startMainApplication();
    }, 5000);
  });
  
  // Mark the app as ready after a startup delay
  setTimeout(() => {
    console.log(`[MAIN] Application ready at http://${MAIN_APP_HOST}:${MAIN_APP_PORT}`);
    mainAppReady = true;
  }, 10000);
}

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  }
});

// Set up graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  
  if (mainAppProcess) {
    console.log('Stopping main application process...');
    mainAppProcess.kill('SIGTERM');
  }
  
  server.close(() => {
    console.log('All services stopped');
    process.exit(0);
  });
  
  // Force exit if graceful shutdown takes too long
  setTimeout(() => {
    console.log('Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Health check server running on http://0.0.0.0:${PORT}/`);
  console.log('Starting main application...');
  
  // Start the main application
  startMainApplication();
});