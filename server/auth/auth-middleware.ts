/**
 * Authentication middleware for securing API routes
 * Enhanced for Bundle 5A security hardening
 */
import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import * as schema from '../../shared/schema.js';
import { db } from '../db.js';
import { eq } from 'drizzle-orm';
import { AuthorizationError } from '../utils/errors.js';

// Constants for token configuration
const TOKEN_EXPIRATION = 4 * 60 * 60;  // 4 hours in seconds
const REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60;  // 7 days in seconds
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as 'strict',
  maxAge: 4 * 60 * 60 * 1000  // 4 hours in milliseconds
};
const REFRESH_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days in milliseconds
};

// Extended Request interface with authenticated user
// Define a User type for our authentication context
type User = {
  id: number;
  role: string;
};

export interface AuthenticatedRequest extends Request {
  user?: User;
  userId?: number;
  userRole?: string;
}

/**
 * Create a new JWT token
 * @param userId User ID to encode in the token
 * @returns JWT token string
 */
export const createToken = (userId: number, expiresIn = TOKEN_EXPIRATION) => {
  const secret = process.env.JWT_SECRET || 'fundamenta-super-secure-jwt-secret';
  const payload = { userId };
  const options: SignOptions = { expiresIn };
  
  return jwt.sign(payload, secret, options);
};

/**
 * Set secure cookies for authentication
 * @param res Response object
 * @param userId User ID to encode in tokens
 */
export const setAuthCookies = (res: Response, userId: number) => {
  // Generate access and refresh tokens
  const token = createToken(userId);
  const refreshToken = createToken(userId, REFRESH_TOKEN_EXPIRATION);
  
  // Set secure HTTP-only cookies
  res.cookie('access_token', token, COOKIE_OPTIONS);
  res.cookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS);
  
  return { token, refreshToken };
};

/**
 * Clear authentication cookies
 * @param res Response object
 */
export const clearAuthCookies = (res: Response) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
};

/**
 * Middleware to authenticate JWT token
 * Uses secure HTTP-only cookies for authentication
 */
export const authenticateJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Get token from cookie or authorization header (for backward compatibility)
  const token = req.cookies?.access_token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      error: 'AuthenticationError', 
      message: 'Authentication required',
      success: false
    });
  }
  
  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'fundamenta-super-secure-jwt-secret'
    ) as { userId: number };
    
    // Set the user ID on the request
    req.userId = decoded.userId;
    
    // Fetch minimal user data (id and role only)
    const user = await db.select({
      id: schema.users.id,
      role: schema.users.role
    })
    .from(schema.users)
    .where(eq(schema.users.id, decoded.userId))
    .limit(1)
    .then(results => results[0]);
    
    if (!user) {
      return res.status(401).json({ 
        error: 'AuthenticationError', 
        message: 'User not found',
        success: false
      });
    }
    
    // Set user object and role on the request
    req.user = user as User;
    req.userRole = user.role;
    
    next();
  } catch (error: any) {
    // Token expired - try to refresh if refresh token is available
    if (error.name === 'TokenExpiredError' && req.cookies?.refresh_token) {
      try {
        // Verify refresh token
        const refreshDecoded = jwt.verify(
          req.cookies.refresh_token,
          process.env.JWT_SECRET || 'fundamenta-super-secure-jwt-secret'
        ) as { userId: number };
        
        // Issue new access token
        const newToken = createToken(refreshDecoded.userId);
        
        // Set new cookie
        res.cookie('access_token', newToken, COOKIE_OPTIONS);
        
        // Set the user ID on the request
        req.userId = refreshDecoded.userId;
        
        // Fetch minimal user data
        const user = await db.query.users.findFirst({
          where: eq(users.id, refreshDecoded.userId),
          columns: { id: true, role: true }
        });
        
        if (!user) {
          throw new Error('User not found');
        }
        
        // Set user object and role on the request
        req.user = user as User;
        req.userRole = user.role;
        
        next();
      } catch (refreshError: any) {
        clearAuthCookies(res);
        return res.status(401).json({ 
          error: 'AuthenticationError', 
          message: 'Session expired, please log in again',
          success: false
        });
      }
    } else {
      clearAuthCookies(res);
      return res.status(401).json({ 
        error: 'AuthenticationError', 
        message: 'Invalid or expired token',
        success: false
      });
    }
  }
};

/**
 * Helper middleware to ensure user is authenticated and exists
 */
export const requireUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || !req.userId) {
    return res.status(401).json({ 
      error: 'AuthenticationError', 
      message: 'Authentication required',
      success: false
    });
  }
  next();
};

/**
 * Role-based access control middleware
 * @param roles Array of allowed roles
 */
export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // First ensure the user is authenticated
    if (!req.user || !req.userId) {
      return res.status(401).json({ 
        error: 'AuthenticationError', 
        message: 'Authentication required',
        success: false
      });
    }
    
    // Then check if user has an allowed role
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({ 
        error: 'AuthorizationError', 
        message: `Access requires one of these roles: ${roles.join(', ')}`,
        success: false
      });
    }
    
    next();
  };
};

/**
 * Admin-only middleware
 */
export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // First ensure the user is authenticated
  if (!req.user || !req.userId) {
    return res.status(401).json({ 
      error: 'AuthenticationError', 
      message: 'Authentication required',
      success: false
    });
  }
  
  // Then check if user is an admin
  if (req.userRole !== 'admin') {
    return res.status(403).json({ 
      error: 'AuthorizationError', 
      message: 'Admin access required',
      success: false
    });
  }
  
  next();
};