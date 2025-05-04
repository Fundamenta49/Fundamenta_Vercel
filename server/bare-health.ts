/**
 * Bare-bones health check module
 * This is the simplest possible implementation 
 * with no dependencies on any middleware or framework
 */

import http from 'http';

/**
 * Install a bare-bones health check that operates at the lowest level
 * This should be incredibly reliable for CloudRun
 */
export function installBareHealthCheck() {
  // Save the original createServer function
  const originalCreateServer = http.createServer;
  
  // Replace with our version that intercepts health checks
  http.createServer = function(
    optionsOrListener?: http.ServerOptions<typeof http.IncomingMessage, typeof http.ServerResponse> | http.RequestListener,
    listener?: http.RequestListener
  ) {
    // Create the server as normal
    const server = originalCreateServer.call(this, optionsOrListener as any, listener as any);
    
    // Get the original request listeners
    const originalListeners = server.listeners('request');
    
    // Remove all existing listeners
    server.removeAllListeners('request');
    
    // Add our own listener that handles the health check first
    server.on('request', (req: http.IncomingMessage, res: http.ServerResponse) => {
      // Check if this is the root path (health check)
      if (req.method === 'GET' && (req.url === '/' || req.url === '/?')) {
        // Try to detect if this is a health check
        const isHealthCheck = 
          !req.headers['accept']?.includes('text/html') || 
          req.headers['accept']?.includes('application/json') ||
          req.headers['user-agent']?.includes('GoogleHC') ||
          req.headers['user-agent']?.includes('kube-probe');
        
        // If it seems like a health check, respond directly
        if (isHealthCheck) {
          // Send a 200 OK response with the expected format
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'X-Health-Check': 'true'
          });
          res.end(JSON.stringify({ status: 'ok' }));
          
          console.log('Bare-bones health check responded to request');
          return;
        }
      }
      
      // Pass through to the original listeners for normal requests
      for (const listener of originalListeners) {
        listener.call(server, req, res);
      }
    });
    
    return server;
  };
  
  console.log('Bare-bones health check installed (intercepts at HTTP level)');
}