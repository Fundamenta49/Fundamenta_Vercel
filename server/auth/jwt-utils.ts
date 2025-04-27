import jwt from 'jsonwebtoken';
import { User } from '@shared/schema';

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'fundamenta-super-secure-jwt-secret';
const JWT_EXPIRES_IN = '30m'; // 30 minutes for access token
const JWT_REFRESH_EXPIRES_IN = '7d'; // 7 days for refresh token

// Type for JWT payload
interface JwtPayload {
  userId: number;
  email: string;
  role?: string;
}

// Type for tokens response
export interface TokensResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

/**
 * Generate JWT access token for a user
 * @param user User information to include in the token
 * @returns Access token string
 */
export function generateAccessToken(user: Pick<User, 'id' | 'email'>): string {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Generate JWT refresh token for a user
 * @param user User information to include in the token
 * @returns Refresh token string
 */
export function generateRefreshToken(user: Pick<User, 'id' | 'email'>): string {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
}

/**
 * Generate both access and refresh tokens for a user
 * @param user User information to include in the tokens
 * @returns Object containing both tokens and expiry information
 */
export function generateTokens(user: Pick<User, 'id' | 'email'>): TokensResponse {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
    expiresIn: 30 * 60, // 30 minutes in seconds
  };
}

/**
 * Verify a JWT token
 * @param token The token to verify
 * @returns Decoded token payload or null if invalid
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Calculate token expiration time in seconds
 * @param token JWT token
 * @returns Seconds until token expires, or 0 if invalid/expired
 */
export function getTokenExpiryTime(token: string): number {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) return 0;
    
    const expiryTime = decoded.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    
    return Math.max(0, Math.floor((expiryTime - currentTime) / 1000));
  } catch (error) {
    return 0;
  }
}