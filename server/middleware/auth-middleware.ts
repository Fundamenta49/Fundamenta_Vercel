import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}

/**
 * Middleware to verify JWT authentication
 */
export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // For development purposes, simulating an authenticated admin user
  // In production, this would verify a JWT token from the request headers
  req.user = {
    id: '1',
    role: 'admin'
  };
  
  next();
};

/**
 * Middleware to require admin role
 */
export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized - authentication required' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden - admin access required' });
  }
  
  next();
};

/**
 * Middleware to require any authenticated user
 */
export const requireUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized - authentication required' });
  }
  
  next();
};

export default {
  authenticateJWT,
  requireAdmin,
  requireUser
};