/**
 * Bare Health Check for CloudRun
 * 
 * This module adds a direct, high-priority health check handler for CloudRun
 * It intercepts requests before they reach the Express middleware stack.
 */

import * as http from 'http';

// Health check response that exactly matches CloudRun expectations
const HEALTH_RESPONSE = JSON.stringify({ status: 'ok' });

/**
 * Installs a bare-bones health check interceptor at the HTTP server level
 * This runs before Express middleware and handles health checks directly
 */
export function installBareHealthCheck(server: http.Server) {
  const originalListeners = server.listeners('request');
  
  // Remove all existing listeners
  for (const listener of originalListeners) {
    server.removeListener('request', listener as (...args: any[]) => void);
  }
  
  // Add our interceptor first
  server.on('request', (req: http.IncomingMessage, res: http.ServerResponse) => {
    const isHealthCheck = req.url === '/' || 
                          req.url === '/_health' ||
                          req.url === '/health' ||
                          req.url?.includes('health-check=true') ||
                          req.url?.includes('?health=true');
    
    const isGoogleHealthCheck = req.headers['user-agent'] && 
                               (req.headers['user-agent'].includes('GoogleHC') || 
                                req.headers['user-agent'].includes('kube-probe'));
                               
    // If it's a health check request, respond immediately
    if (isHealthCheck || isGoogleHealthCheck) {
      console.log(`Bare-bones health check handling request: ${req.method} ${req.url}`);
      
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(HEALTH_RESPONSE),
        'Cache-Control': 'no-cache',
        'X-Health-Check': 'true'
      });
      
      res.end(HEALTH_RESPONSE);
      return;
    }
    
    // Otherwise, call all the original listeners in order
    let handled = false;
    for (const listener of originalListeners) {
      if (!handled) {
        listener(req, res);
        handled = true;
      }
    }
  });
  
  console.log('Bare-bones health check installed (intercepts at HTTP level)');
  
  return server;
}