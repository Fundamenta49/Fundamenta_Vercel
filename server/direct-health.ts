/**
 * Ultra-minimal direct health check middleware
 * Designed for maximum compatibility with CloudRun
 * 
 * This handles only the root path with NO detection logic at all
 */

import { Request, Response, NextFunction, Express } from 'express';

// Absolute minimum health check response
const MINIMAL_RESPONSE = JSON.stringify({ status: 'ok' });

/**
 * The simplest possible health check middleware for CloudRun
 * This will ALWAYS respond to GET / with 200 OK {"status":"ok"}
 */
export function setupDirectHealthCheck(app: Express) {
  // Add a direct route handler at the very top of our app
  app.get('/', (req: Request, res: Response, next: NextFunction) => {
    // If this is a health check, respond immediately
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      // Health checks often have Accept: application/json
      res.status(200);
      res.setHeader('Content-Type', 'application/json');
      res.end(MINIMAL_RESPONSE);
      return;
    }
    
    // If it's not clearly a health check, check the User-Agent
    if (req.headers['user-agent'] && 
        (req.headers['user-agent'].includes('GoogleHC') || 
         req.headers['user-agent'].includes('kube-probe'))) {
      res.status(200);
      res.setHeader('Content-Type', 'application/json');
      res.end(MINIMAL_RESPONSE);
      return;
    }
    
    // Also add a hard-coded path for explicit health checks
    if (req.path === '/_health' || req.query.health === 'true' || req.query['health-check'] === 'true') {
      res.status(200);
      res.setHeader('Content-Type', 'application/json');
      res.end(MINIMAL_RESPONSE);
      return;
    }
    
    // Not a health check, continue to the next middleware
    next();
  });
  
  // Also add a super-direct middleware as an absolute fallback
  // This captures *any* GET request to / and responds with 200
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET' && req.path === '/' && !req.headers.accept?.includes('text/html')) {
      // If it's not specifically requesting HTML, treat as a health check
      res.status(200);
      res.setHeader('Content-Type', 'application/json');
      res.end(MINIMAL_RESPONSE);
      return;
    }
    next();
  });
  
  console.log('Ultra-direct health check registered for CloudRun compatibility');
}