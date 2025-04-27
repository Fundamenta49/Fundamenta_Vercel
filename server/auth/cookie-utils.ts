import { Request, Response } from 'express';

// Cookie configuration
const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Only use secure in production
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  path: '/',
};

// Names for cookies
export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  CONSENT: 'privacy_consent',
};

/**
 * Set JWT access token cookie
 * @param res Express Response object
 * @param token JWT access token
 */
export function setAccessTokenCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAMES.ACCESS_TOKEN, token, {
    ...COOKIE_CONFIG,
    maxAge: 30 * 60 * 1000, // 30 minutes in milliseconds
  });
}

/**
 * Set JWT refresh token cookie
 * @param res Express Response object
 * @param token JWT refresh token
 */
export function setRefreshTokenCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAMES.REFRESH_TOKEN, token, COOKIE_CONFIG);
}

/**
 * Set both access and refresh token cookies
 * @param res Express Response object
 * @param accessToken JWT access token
 * @param refreshToken JWT refresh token
 */
export function setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);
}

/**
 * Clear auth cookies
 * @param res Express Response object
 */
export function clearAuthCookies(res: Response): void {
  res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN, { path: '/' });
  res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, { path: '/' });
}

/**
 * Set privacy consent cookie
 * @param res Express Response object
 */
export function setConsentCookie(res: Response): void {
  const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
  res.cookie(COOKIE_NAMES.CONSENT, 'granted', {
    ...COOKIE_CONFIG,
    maxAge: ONE_YEAR_MS,
  });
}

/**
 * Check if user has granted privacy consent
 * @param req Express Request object
 * @returns Boolean indicating if consent has been granted
 */
export function hasConsentCookie(req: Request): boolean {
  return req.cookies[COOKIE_NAMES.CONSENT] === 'granted';
}

/**
 * Clear privacy consent cookie
 * @param res Express Response object
 */
export function clearConsentCookie(res: Response): void {
  res.clearCookie(COOKIE_NAMES.CONSENT, { path: '/' });
}