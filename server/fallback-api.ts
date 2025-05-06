/**
 * Fallback API Configuration
 * 
 * This file provides fallback responses for API endpoints that might fail in production
 * when the full application stack is not available. It helps the frontend continue to
 * function in a degraded mode.
 */

import { Request, Response, NextFunction } from 'express';

// Auth fallback middleware
export function authFallbackMiddleware(req: Request, res: Response, next: NextFunction) {
  // Check if this is an auth endpoint
  if (req.path.startsWith('/api/auth/')) {
    if (req.path === '/api/auth/me') {
      return res.json({
        guest: true,
        id: 'guest-user',
        username: 'Guest User',
        authenticated: false,
        message: 'Using guest mode until authentication is fully configured'
      });
    } else {
      return res.json({
        success: true,
        guest: true,
        message: 'Authentication endpoint stub'
      });
    }
  }
  next();
}

// AI service fallback middleware
export function aiFallbackMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.path.startsWith('/api/ai/')) {
    return res.json({
      success: true,
      message: 'AI service endpoint fallback',
      status: 'ok',
      fallback: true
    });
  }
  next();
}

// Generic API fallback middleware
export function apiFallbackMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.path === '/api/fallback-status') {
    return res.json({ enabled: true, reason: 'Deployment mode' });
  }
  
  if (req.path.startsWith('/api/notifications/')) {
    return res.json({ notifications: [], unread: 0 });
  }
  
  if (req.path === '/api/user/settings') {
    return res.json({
      theme: 'system',
      notifications: false,
      tourCompleted: false
    });
  }
  
  // Continue to the next middleware if not handled
  next();
}

// Fallback catch-all for unhandled API requests
export function apiFallbackCatchAll(req: Request, res: Response) {
  console.log(`Fallback catch-all for unhandled API: ${req.path}`);
  res.json({
    success: false,
    fallback: true,
    error: 'API endpoint not implemented in fallback mode',
    path: req.path
  });
}

// Setup all fallback middlewares
export function setupFallbackApis(app: any) {
  app.use('/api', authFallbackMiddleware);
  app.use('/api', aiFallbackMiddleware);
  app.use('/api', apiFallbackMiddleware);
  
  // This should be registered after all other API routes
  app.all('/api/*', apiFallbackCatchAll);
}