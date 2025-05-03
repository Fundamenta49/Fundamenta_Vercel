import { Router, Request, Response } from 'express';
import { db } from '../db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, comparePasswords } from './password-utils';
import { generateTokens, verifyToken } from './jwt-utils';
import { 
  setAuthCookies, 
  clearAuthCookies, 
  setConsentCookie, 
  hasConsentCookie,
  clearConsentCookie
} from './cookie-utils';
import { AuthenticatedRequest, authenticateJWT } from './auth-middleware';
import { z } from 'zod';
import { 
  verifyAge,
  calculateAge,
  MIN_AGE_WITHOUT_CONSENT
} from '../utils/age-verification';

// Create a router for auth endpoints
const router = Router();

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  birthYear: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  hasParentalConsent: z.boolean().optional()
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().optional()
});

/**
 * Register a new user
 * POST /api/auth/register
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = registerSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed', 
        details: validationResult.error.errors
      });
    }

    const { name, email, password, birthYear, hasParentalConsent } = validationResult.data;
    
    // Convert email to lowercase for case-insensitive comparison
    const emailLower = email.toLowerCase();

    // Check if user already exists
    const existingUser = await db.select({
      id: users.id,
      email: users.email,
    }).from(users)
      .where(eq(users.email, emailLower));

    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    
    // Age verification check
    if (birthYear) {
      try {
        // Verify age using the enhanced age verification utility
        const verificationResult = verifyAge(birthYear, !!hasParentalConsent);
        
        // If verification fails, return appropriate error
        if (!verificationResult.isValid) {
          return res.status(403).json({ 
            error: 'Age restriction', 
            message: verificationResult.error?.message || 'Age verification failed',
            code: verificationResult.error?.type
          });
        }
      } catch (error) {
        return res.status(400).json({ 
          error: 'Age verification failed',
          message: error instanceof Error ? error.message : 'Invalid age data'
        });
      }
    }
    
    // Process age verification data
    const ageData = birthYear ? {
      birthYear,
      ageVerified: true,
      isMinor: calculateAge(birthYear) < 18,
      hasParentalConsent: !!hasParentalConsent
    } : {};

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create user in database
    const [newUser] = await db.insert(users).values({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      ...ageData
    }).returning();

    // Generate tokens
    const tokens = generateTokens({
      id: newUser.id,
      email: newUser.email,
    });

    // Set auth cookies
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    // Return user info (excluding password)
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      user: userWithoutPassword,
      tokens,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * Login a user
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationResult.error.errors 
      });
    }

    const { email, password } = validationResult.data;
    
    // Convert email to lowercase for case-insensitive comparison
    const emailLower = email.toLowerCase();

    // Find user by email (case-insensitive)
    const [user] = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      password: users.password,
      role: users.role,
      emailVerified: users.emailVerified,
      privacyConsent: users.privacyConsent,
      birthYear: users.birthYear,
      ageVerified: users.ageVerified,
      isMinor: users.isMinor,
      hasParentalConsent: users.hasParentalConsent
    }).from(users)
      .where(eq(users.email, emailLower));

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const passwordValid = await comparePasswords(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const tokens = generateTokens({
      id: user.id,
      email: user.email,
    });

    // Set auth cookies
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    // Return user info (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      user: userWithoutPassword,
      tokens,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * Logout a user
 * POST /api/auth/logout
 */
router.post('/logout', (req: Request, res: Response) => {
  // Clear auth cookies
  clearAuthCookies(res);
  
  res.status(200).json({ message: 'Logged out successfully' });
});

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    // Validate request
    const validationResult = refreshTokenSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationResult.error.errors 
      });
    }

    // Get refresh token from cookie or request body
    const refreshToken = req.cookies?.refresh_token || validationResult.data.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Verify the refresh token
    const payload = verifyToken(refreshToken);
    if (!payload) {
      // Clear cookies if token is invalid
      clearAuthCookies(res);
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Get user from database
    const [user] = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      emailVerified: users.emailVerified,
      privacyConsent: users.privacyConsent,
    }).from(users).where(eq(users.id, payload.userId));
    if (!user) {
      clearAuthCookies(res);
      return res.status(401).json({ error: 'User not found' });
    }

    // Generate new tokens
    const tokens = generateTokens({
      id: user.id,
      email: user.email,
    });

    // Set new auth cookies
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    // Return new tokens
    res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

/**
 * Get current user information
 * GET /api/auth/me
 */
router.get('/me', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  // authenticateJWT middleware adds the user to the request
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    // Fetch complete user data from database
    const [user] = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      emailVerified: users.emailVerified,
      privacyConsent: users.privacyConsent,
      birthYear: users.birthYear,
      ageVerified: users.ageVerified,
      isMinor: users.isMinor,
      hasParentalConsent: users.hasParentalConsent,
      tosAccepted: users.tosAccepted,
      tosVersion: users.tosVersion,
      tosAcceptedAt: users.tosAcceptedAt
    }).from(users)
      .where(eq(users.id, req.user.id));

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user info
    res.json({ user });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Set privacy consent
 * POST /api/auth/consent
 */
router.post('/consent', (req: Request, res: Response) => {
  // Set consent cookie
  setConsentCookie(res);
  
  res.status(200).json({ message: 'Consent recorded successfully' });
});

/**
 * Check privacy consent status
 * GET /api/auth/consent
 */
router.get('/consent', (req: Request, res: Response) => {
  const hasConsent = hasConsentCookie(req);
  
  res.json({ hasConsent });
});

/**
 * Withdraw privacy consent
 * DELETE /api/auth/consent
 */
router.delete('/consent', (req: Request, res: Response) => {
  // Clear the consent cookie
  clearConsentCookie(res);
  
  res.status(200).json({ message: 'Privacy consent withdrawn successfully' });
});

export default router;