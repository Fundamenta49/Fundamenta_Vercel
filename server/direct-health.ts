/**
 * Simplified and improved health check for CloudRun compatibility
 * This module adds a direct health check endpoint at the Express level
 */
import { Express } from 'express';

// Health check response that exactly matches CloudRun expectations
const HEALTH_RESPONSE = JSON.stringify({ status: 'ok' });

/**
 * Setup a reliable, first-priority health check for CloudRun compatibility
 * @param app Express application instance
 */
export function setupDirectHealthCheck(app: Express): void {
  // Add a direct route handler at the very beginning of the middleware stack
  app.use((req, res, next) => {
    // Only handle GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    // Consolidated health check detection logic
    const isHealthCheckPath = 
      req.path === '/_health' || 
      req.path === '/health' ||
      req.path === '/.well-known/health';
      
    const isHealthCheckRequest =
      req.query['health-check'] !== undefined ||
      req.query['health'] !== undefined ||
      req.headers['x-health-check'] === 'true';
      
    const isHealthCheckAgent = 
      req.headers['user-agent']?.includes('GoogleHC') || 
      req.headers['user-agent']?.includes('kube-probe') ||
      req.headers['user-agent']?.includes('LivenessProbe');
    
    const hasJsonAcceptHeader =
      req.path === '/' && 
      req.headers['accept']?.includes('application/json');
      
    // If any health check condition is met, respond immediately
    if (isHealthCheckPath || isHealthCheckRequest || isHealthCheckAgent || hasJsonAcceptHeader) {
      console.log(`Health check responding to: ${req.method} ${req.path} (${req.headers['user-agent']})`);
      
      // Send exact CloudRun expected response
      res.status(200)
        .set({
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store',
          'X-Health-Check': 'true'
        })
        .send(HEALTH_RESPONSE);
      
      return;
    }
    
    // Not a health check request, continue to next middleware
    next();
  });
  
  // Also add explicit routes for health checks
  app.get(['/_health', '/health', '/.well-known/health'], (req, res) => {
    res.status(200)
      .set({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store', 
        'X-Health-Check': 'true'
      })
      .send(HEALTH_RESPONSE);
  });
  
  console.log('Enhanced health check system registered for CloudRun compatibility');
}