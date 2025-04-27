import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './jwt-utils';
import { db } from '../db';
import { users, User } from '@shared/schema';
import { eq } from 'drizzle-orm';

// User type matching the UserType in mentorship-routes
export interface UserType {
  id: number;
  username: string;
  email?: string;
  role?: string;
  name?: string;
}

// Extended Request type to include authenticated user
export interface AuthenticatedRequest extends Request {
  user?: UserType;
}

/**
 * Middleware to authenticate API requests using JWT
 * This extracts the token from Authorization header or cookies
 */
export async function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    // Get token from Authorization header or cookie
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7) // Remove 'Bearer ' prefix
      : req.cookies?.access_token;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify the token
    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Get user from database
    const [user] = await db.select().from(users).where(eq(users.id, payload.userId));
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user to request with type matching UserType interface
    req.user = {
      id: user.id,
      username: user.name, // Use name as username
      email: user.email,
      role: user.role || undefined,
      name: user.name
    };
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Authentication failed' });
  }
}

/**
 * Middleware to check if a request has a valid user (optional authentication)
 * This does not block the request if authentication fails
 */
export async function optionalAuthenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    // Get token from Authorization header or cookie
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : req.cookies?.access_token;

    // If no token, continue without authentication
    if (!token) {
      return next();
    }

    // Verify the token
    const payload = verifyToken(token);
    if (!payload) {
      return next(); // Continue without authentication
    }

    // Get user from database
    const [user] = await db.select().from(users).where(eq(users.id, payload.userId));
    if (user) {
      // Attach user to request with type matching UserType interface
      req.user = {
        id: user.id,
        username: user.name, // Use name as username
        email: user.email,
        role: user.role || undefined,
        name: user.name
      };
    }
    
    next();
  } catch (error) {
    // Continue without authentication in case of error
    next();
  }
}