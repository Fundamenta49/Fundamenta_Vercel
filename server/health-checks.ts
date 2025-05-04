import { Request, Response, NextFunction, Router } from 'express';
import { log } from './vite';

// Create a dedicated router for health checks
export const healthCheckRouter = Router();

// Record start time for uptime calculation
const startTime = Date.now();

/**
 * Root Health Check Handler - Must be used as middleware BEFORE static file handling
 * This is specifically designed for CloudRun deployment health checks
 * 
 * @param req Express request
 * @param res Express response
 * @param next Express next function
 */
export function rootHealthCheckMiddleware(req: Request, res: Response, next: NextFunction) {
  // Only handle GET requests to the root path
  if (req.method === 'GET' && req.path === '/') {
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
healthCheckRouter.get('/', (_req: Request, res: Response) => {
  // Always return 200 OK with minimal payload
  res.status(200).json({ status: "ok" });
});