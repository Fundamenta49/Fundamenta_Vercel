import { Request, Response, NextFunction } from 'express';
import { log } from './vite';

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
    const health = {
      status: "ok",
      uptime: Date.now() - startTime,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    };
    
    log(`Root health check requested, responding with: ${JSON.stringify(health)}`);
    
    // Set explicit headers and status code for more reliable response
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(health));
    
    // Don't call next() as we've handled the request
    return;
  }
  
  // Pass request to next middleware if it's not a root health check
  next();
}