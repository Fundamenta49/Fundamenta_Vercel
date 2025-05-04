/**
 * Ultra-direct health check for CloudRun compatibility
 * This module adds a direct health check endpoint at the Express level
 */
import { Express } from 'express';

// Health check response that exactly matches CloudRun expectations
const HEALTH_RESPONSE = JSON.stringify({ status: 'ok' });

/**
 * Setup an ultra-direct, first-priority health check for CloudRun compatibility
 * @param app Express application instance
 */
export function setupDirectHealthCheck(app: Express): void {
  // Add a direct route handler at the very beginning of the middleware stack
  app.use((req, res, next) => {
    // Only handle GET requests to specific health check paths
    if (req.method !== 'GET') {
      return next();
    }
    
    // Check if this is a health check request
    const isHealthCheck = 
      req.path === '/' ||
      req.path === '/_health' || 
      req.path === '/health' ||
      req.originalUrl?.includes('health-check=true') ||
      req.originalUrl?.includes('?health=true');
      
    // Check for health check user agent
    const isHealthAgent = 
      req.headers['user-agent']?.includes('GoogleHC') || 
      req.headers['user-agent']?.includes('kube-probe');
      
    if (isHealthCheck || isHealthAgent) {
      console.log(`Ultra-direct health check handling request: ${req.method} ${req.path}`);
      
      // Send exact CloudRun expected response
      res.status(200)
        .set({
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Health-Check': 'true'
        })
        .send(HEALTH_RESPONSE);
      
      return;
    }
    
    // Not a health check request, continue to next middleware
    next();
  });
  
  console.log('Ultra-direct health check registered for CloudRun compatibility');
}