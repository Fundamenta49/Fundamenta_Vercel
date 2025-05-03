/**
 * Authentication middleware for securing API routes
 */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '@shared/schema';

// Extended Request interface with authenticated user
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Middleware to authenticate JWT token
export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Get token from cookie or authorization header
  const token = req.cookies?.access_token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key') as { userId: number };
    
    // At this point we've verified the token, but not fetched the user
    // This just marks the request as authenticated with a userId
    // The actual user object will be fetched in the route handler if needed
    req.user = { id: decoded.userId } as User;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token' });
  }
};

// Helper middleware to ensure user is authenticated and exists
export const requireUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
  }
  next();
};