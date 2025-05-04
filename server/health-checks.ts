import { Request, Response, NextFunction, Router } from 'express';
import { log } from './vite';

// Create a dedicated router for health checks
export const healthCheckRouter = Router();

// Record start time for uptime calculation
const startTime = Date.now();

/**
 * Helper function to detect if a request is a health check
 * @param req Express request
 * @returns boolean - true if the request is a health check
 */
function isHealthCheckRequest(req: Request): boolean {
  return (
    // Check for explicit health check parameter
    req.query['health-check'] !== undefined || 
    // Check for Google Health Check user agent
    (req.headers['user-agent'] && req.headers['user-agent'].includes('GoogleHC')) ||
    // For direct health check testing with curl
    req.headers['x-health-check'] === 'true'
  );
}

/**
 * Root Health Check Handler - Must be used as middleware BEFORE static file handling
 * This is specifically designed for CloudRun deployment health checks
 * 
 * @param req Express request
 * @param res Express response
 * @param next Express next function
 */
export function rootHealthCheckMiddleware(req: Request, res: Response, next: NextFunction) {
  // Only handle GET requests to the root path that are identified as health checks
  if (req.method === 'GET' && req.path === '/' && isHealthCheckRequest(req)) {
    try {
      // Simple status object - CloudRun simply needs a 200 status code
      // Note: For CloudRun health checks, the response format doesn't matter as long as
      // the status code is 200. We're keeping it minimal here.
      const health = {
        status: "ok"
      };
      
      // Log the health check request but don't include full details in production
      if (process.env.NODE_ENV !== 'production') {
        const fullHealth = {
          ...health,
          uptime: Date.now() - startTime,
          environment: process.env.NODE_ENV,
          timestamp: new Date().toISOString()
        };
        log(`Root health check requested, responding with: ${JSON.stringify(fullHealth)}`);
      } else {
        log(`Production health check requested at ${new Date().toISOString()}`);
      }
      
      // Set explicit headers and status code for more reliable response
      res.status(200);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(health));
      
      // Don't call next() as we've handled the request
      return;
    } catch (error) {
      // If anything goes wrong, log it but still return 200 for health checks
      console.error('Health check error:', error);
      res.status(200).json({ status: "ok" });
      return;
    }
  }
  
  // Pass request to next middleware if it's not a root health check
  next();
}

// Add a direct route handler for the root health check
healthCheckRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  // Only respond to actual health check requests
  if (isHealthCheckRequest(req)) {
    // Return 200 OK with minimal payload
    res.status(200).json({ status: "ok" });
  } else {
    // Pass through normal application traffic
    next();
  }
});