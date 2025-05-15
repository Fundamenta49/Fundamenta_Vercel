/**
 * Authentication and Authorization Middleware
 */

import { ValidationError, AuthorizationError } from '../utils/errors.js';

/**
 * Middleware to ensure the request is authenticated
 * This checks for a valid session and user
 */
export const authenticated = (req, res, next) => {
  // Check if user is authenticated through session
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ 
      error: 'AuthenticationError',
      message: 'Authentication required' 
    });
  }
  
  // Store user ID for convenience
  req.user = { id: req.session.userId };
  
  next();
};

/**
 * Middleware to verify user has required role
 * @param {string[]} roles - Array of allowed roles
 */
export const hasRole = (roles) => {
  return async (req, res, next) => {
    try {
      // This middleware must be used after authenticated middleware
      if (!req.user || !req.user.id) {
        throw new ValidationError('User not authenticated');
      }
      
      // Get user from database with role information
      const user = await req.app.locals.storage.getUser(req.user.id);
      
      if (!user) {
        throw new ValidationError('User not found');
      }
      
      // Add full user object to request
      req.user = user;
      
      // Check if user has required role
      if (!roles.includes(user.role)) {
        throw new AuthorizationError(`Requires one of these roles: ${roles.join(', ')}`);
      }
      
      next();
    } catch (error) {
      console.error('Role authorization error:', error);
      
      if (error instanceof ValidationError || error instanceof AuthorizationError) {
        return res.status(error.status).json({
          error: error.name,
          message: error.message
        });
      }
      
      return res.status(500).json({
        error: 'ServerError',
        message: 'An error occurred while checking permissions'
      });
    }
  };
};

/**
 * Middleware to verify user is accessing own data or has admin privileges
 */
export const isSelfOrAdmin = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      throw new ValidationError('Invalid user ID format');
    }
    
    // This middleware must be used after authenticated middleware
    if (!req.user || !req.user.id) {
      throw new ValidationError('User not authenticated');
    }
    
    // If user is accessing their own data, allow it
    if (req.user.id === userId) {
      return next();
    }
    
    // If not self, check if user has admin role
    const user = await req.app.locals.storage.getUser(req.user.id);
    
    if (!user) {
      throw new ValidationError('User not found');
    }
    
    // Add full user object to request
    req.user = user;
    
    // Check if user has admin role
    if (user.role !== 'admin') {
      throw new AuthorizationError('You can only access your own data');
    }
    
    next();
  } catch (error) {
    console.error('Self/Admin authorization error:', error);
    
    if (error instanceof ValidationError || error instanceof AuthorizationError) {
      return res.status(error.status).json({
        error: error.name,
        message: error.message
      });
    }
    
    return res.status(500).json({
      error: 'ServerError',
      message: 'An error occurred while checking permissions'
    });
  }
};