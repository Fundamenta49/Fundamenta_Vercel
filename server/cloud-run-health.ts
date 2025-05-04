/**
 * CloudRun Health Check Handler Module
 * This module provides a specialized health check handler for CloudRun deployments.
 * 
 * CloudRun requires a 200 OK response at the root path (/) to consider the service healthy.
 * 
 * The health check handler in this module is optimized for production deployment:
 * - Minimal response payload ({"status":"ok"})
 * - No dependency on other modules
 * - Designed to be the first middleware in the chain
 * - Does not interfere with other middleware
 */

import { Request, Response, NextFunction, Express } from 'express';

// Simple health check response
const HEALTH_RESPONSE = { status: 'ok' };

/**
 * Specialized middleware for CloudRun health checks
 */
export function cloudRunHealthMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'GET' && req.path === '/') {
    // For health checks, return immediate success
    res.status(200).json(HEALTH_RESPONSE);
    return;
  }
  next();
}

/**
 * Configure an Express app with CloudRun health check handlers
 */
export function setupCloudRunHealth(app: Express) {
  // Register health check middleware first
  app.use(cloudRunHealthMiddleware);

  // Also add a direct route handler as backup
  app.get('/', (req, res, next) => {
    if (!req.headers.accept?.includes('text/html')) {
      res.status(200).json(HEALTH_RESPONSE);
      return;
    }
    next();
  });

  console.log('CloudRun health check handlers registered');
}