
import { Express, Request, Response, NextFunction } from 'express';

/**
 * CloudRun health check middleware
 */
export function cloudRunHealthMiddleware(req: Request, res: Response, next: NextFunction) {
  // Check if this is a health check request
  const isHealthCheck = req.path === '/' || 
                       req.path === '/_health' || 
                       req.headers['user-agent']?.includes('GoogleHC');

  if (isHealthCheck) {
    res.status(200).json({ status: 'ok' });
    return;
  }

  // Not a health check, continue to main app
  next();
}

/**
 * Setup health check endpoints for CloudRun
 */
export function setupCloudRunHealthChecks(app: Express) {
  app.use(cloudRunHealthMiddleware);
}
