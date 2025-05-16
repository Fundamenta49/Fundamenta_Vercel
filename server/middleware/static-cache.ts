import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { createHash } from 'crypto';

// Types of content that can be cached
const CACHEABLE_CONTENT_TYPES = [
  'text/css',
  'application/javascript',
  'image/svg+xml',
  'image/png',
  'image/jpeg',
  'image/gif',
  'font/woff',
  'font/woff2'
];

// Default cache duration (in seconds)
const DEFAULT_CACHE_DURATION = 86400; // 24 hours

// Max age by content type (in seconds)
const MAX_AGE_BY_TYPE: Record<string, number> = {
  'text/css': 604800, // 7 days
  'application/javascript': 604800, // 7 days
  'image/svg+xml': 2592000, // 30 days
  'image/png': 2592000, // 30 days
  'image/jpeg': 2592000, // 30 days
  'image/gif': 2592000, // 30 days
  'font/woff': 31536000, // 1 year
  'font/woff2': 31536000 // 1 year
};

/**
 * Middleware to add cache control headers for static files
 */
export function staticCacheMiddleware(req: Request, res: Response, next: NextFunction) {
  // Only apply to GET and HEAD requests
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return next();
  }

  // Store the original send function
  const originalSend = res.send;

  // Override the send function
  res.send = function(body?: any): Response {
    const contentType = res.getHeader('Content-Type')?.toString() || '';
    const baseContentType = contentType.split(';')[0];
    
    // Add cache headers if the content type is cacheable
    if (CACHEABLE_CONTENT_TYPES.includes(baseContentType)) {
      const maxAge = MAX_AGE_BY_TYPE[baseContentType] || DEFAULT_CACHE_DURATION;
      
      // Set cache control headers
      res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
      
      // Add ETag support
      if (typeof body === 'string') {
        const etag = createHash('md5').update(body).digest('hex');
        res.setHeader('ETag', `"${etag}"`);
        
        // Check if the client already has this version
        const ifNoneMatch = req.headers['if-none-match'];
        if (ifNoneMatch === `"${etag}"`) {
          // Client already has this version
          res.status(304).send();
          return res;
        }
      }
    }
    
    // Call the original send function
    return originalSend.call(this, body);
  };
  
  next();
}

/**
 * Generate a unique version identifier for a file
 * This can be added to URLs to force cache invalidation 
 */
export function generateCacheVersion(filePath: string): string {
  try {
    const stats = fs.statSync(filePath);
    const modifiedTime = stats.mtimeMs;
    return createHash('md5').update(`${filePath}${modifiedTime}`).digest('hex').substring(0, 8);
  } catch (error) {
    // If there's an error reading the file, return a timestamp to ensure uniqueness
    return Date.now().toString(36);
  }
}

/**
 * Helper function to append a cache version to a URL
 */
export function appendCacheVersion(url: string, filePath: string): string {
  const version = generateCacheVersion(filePath);
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${version}`;
}

/**
 * Add caching headers for a specific route
 */
export function cacheRoute(duration: number = DEFAULT_CACHE_DURATION) {
  return (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', `public, max-age=${duration}`);
    next();
  };
}

export default staticCacheMiddleware;