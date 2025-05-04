/**
 * CloudRun Health Check Module
 * Specialized middleware and setup for CloudRun deployment health checks
 */
import { Express, Request, Response, NextFunction } from 'express';
import { Router } from 'express';

// Health check response for CloudRun
const HEALTH_RESPONSE = { status: 'ok' };

/**
 * CloudRun health check middleware
 * Immediately responds to health check requests without further processing
 */
export function cloudRunHealthMiddleware(req: Request, res: Response, next: NextFunction) {
  // Check for health check paths
  const isHealthCheck = req.path === '/' || 
                        req.path === '/_health' || 
                        req.path === '/health';
  
  // Check for health check query parameters
  const hasHealthParam = req.query['health'] === 'true' || 
                         req.query['health-check'] === 'true';
  
  // Check for GoogleHC user agent
  const isGoogleHealthCheck = req.headers['user-agent']?.includes('GoogleHC') || 
                             req.headers['user-agent']?.includes('kube-probe');
  
  // If this is a health check request, respond immediately
  if (isHealthCheck || hasHealthParam || isGoogleHealthCheck) {
    console.log(`CloudRun health check: ${req.method} ${req.path}`);
    return res.status(200).json(HEALTH_RESPONSE);
  }
  
  // Not a health check request, continue to next middleware
  next();
}

/**
 * Setup health check endpoints for CloudRun
 * @param app Express application
 */
export function setupCloudRunHealthChecks(app: Express) {
  // Add middleware as early as possible in the stack
  app.use(cloudRunHealthMiddleware);
  
  // Also add explicit routes for health checks
  app.get('/', (req, res, next) => {
    // Only handle health checks at root, pass through to the app otherwise
    const isHealthCheck = 
      req.query['health'] === 'true' || 
      req.query['health-check'] === 'true' ||
      req.headers['user-agent']?.includes('GoogleHC') ||
      req.headers['user-agent']?.includes('kube-probe') ||
      req.headers['accept']?.includes('application/json');
      
    if (isHealthCheck) {
      return res.status(200).json(HEALTH_RESPONSE);
    }
    
    next();
  });
  
  // Create a dedicated router for health check endpoints
  const healthRouter = Router();
  
  // Handle health check endpoints
  healthRouter.get('/_health', (req, res) => {
    res.status(200).json(HEALTH_RESPONSE);
  });
  
  healthRouter.get('/health', (req, res) => {
    res.status(200).json(HEALTH_RESPONSE);
  });
  
  // Mount the health router
  app.use(healthRouter);
  
  console.log('CloudRun health check endpoints configured');
}