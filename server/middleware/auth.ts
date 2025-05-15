/**
 * Authentication middleware for securing API routes
 * Ensures users are authenticated before accessing protected routes
 */

import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage.js';
import { AuthorizationError } from '../utils/errors.js';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware to check if user is authenticated
 * Adds user object to request if authenticated
 */
export function authenticated(req: Request, res: Response, next: NextFunction) {
  // If no user in session, return 401 Unauthorized
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'You must be logged in to access this resource'
    });
  }

  // Add user to request for use in route handlers
  storage.getUser(req.session.userId)
    .then(user => {
      if (!user) {
        return res.status(401).json({ 
          error: 'Invalid user session',
          message: 'User not found for the current session'
        });
      }
      
      // Add user to request object
      req.user = user;
      next();
    })
    .catch(error => {
      console.error('Authentication error:', error);
      return res.status(500).json({ 
        error: 'Authentication error',
        message: 'An error occurred while authenticating your request'
      });
    });
}

/**
 * Middleware to check if user has required role(s)
 * Must be used after authenticated middleware
 */
export function hasRole(roles: string | string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'You must be logged in to access this resource'
      });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (allowedRoles.includes(userRole) || userRole === 'admin') {
      return next();
    }

    return res.status(403).json({
      error: 'Insufficient permissions',
      message: 'You do not have permission to access this resource'
    });
  };
}

/**
 * Middleware to check if user is requesting their own data or is an admin
 * Useful for routes that should only allow users to access their own data
 */
export function isSelfOrAdmin(req: Request, res: Response, next: NextFunction) {
  const requestedUserId = parseInt(req.params.id);
  
  if (isNaN(requestedUserId)) {
    return res.status(400).json({
      error: 'Invalid user ID',
      message: 'The provided user ID is invalid'
    });
  }

  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'You must be logged in to access this resource'
    });
  }

  // Allow if user is requesting their own data or is an admin
  if (req.user.id === requestedUserId || req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({
    error: 'Insufficient permissions',
    message: 'You can only access your own data'
  });
}