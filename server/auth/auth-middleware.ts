import { Request, Response, NextFunction } from "express";
import { verifyToken } from './jwt-utils';

// Define authenticated request interface
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
    role?: string;
    emailVerified?: boolean;
    privacyConsent?: boolean;
    birthYear?: number;
    ageVerified?: boolean;
    isMinor?: boolean;
    hasParentalConsent?: boolean;
  };
}

// Define express request + user interface
declare global {
  namespace Express {
    interface User {
      id: number;
      name: string;
      email: string;
      role?: string;
      emailVerified?: boolean;
      privacyConsent?: boolean;
      birthYear?: number;
      ageVerified?: boolean;
      isMinor?: boolean;
      hasParentalConsent?: boolean;
    }
    
    interface Request {
      user?: User;
    }
  }
}

// Middleware to authenticate JWT tokens
export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  try {
    // Get token from Authorization header or cookie
    const token = req.cookies?.access_token || extractBearerToken(req);
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Add user data to request
    (req as AuthenticatedRequest).user = {
      id: payload.userId,
      name: payload.name || '',
      email: payload.email,
      role: payload.role || 'user',
      emailVerified: payload.emailVerified || false,
      privacyConsent: payload.privacyConsent || false,
      birthYear: payload.birthYear,
      ageVerified: payload.ageVerified || false,
      isMinor: payload.isMinor || false,
      hasParentalConsent: payload.hasParentalConsent || false,
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
}

// Helper function to extract bearer token from Authorization header
function extractBearerToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

// Middleware to check if user is authenticated (alias for compatibility)
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  return authenticateJWT(req, res, next);
}

// Middleware to check if user has specific role
export function hasRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (!roles.includes(req.user.role || "")) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }
    
    next();
  };
}