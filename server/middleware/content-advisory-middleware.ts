/**
 * Content Advisory Middleware
 * 
 * This middleware analyzes content to determine if it requires advisory notices
 * and attaches appropriate disclaimers based on content categories.
 */

import { Request, Response, NextFunction } from 'express';
import { 
  createContentAdvisory, 
  needsContentAdvisory, 
  type ContentAdvisory 
} from '../utils/content-advisory';

/**
 * Middleware to analyze content and attach appropriate advisories
 * 
 * @param opts Options for the middleware
 * @returns Express middleware function
 */
export function contentAdvisoryMiddleware(opts: {
  // Content threshold length before advisories are considered (default 50 chars)
  contentThreshold?: number;
  // Whether to ignore content advisories for authorized users (default false)
  skipForAuthorizedUsers?: boolean;
}) {
  const contentThreshold = opts.contentThreshold || 50;
  const skipForAuthorizedUsers = opts.skipForAuthorizedUsers || false;
  
  return (req: Request, res: Response, next: NextFunction) => {
    // Original send method
    const originalSend = res.send;
    
    // Override send to analyze content
    res.send = function(body): Response {
      // Skip for non-string/non-JSON responses or short content
      if (!body || 
          (typeof body !== 'string' && typeof body !== 'object') || 
          (typeof body === 'string' && body.length < contentThreshold)) {
        return originalSend.apply(res, [body]);
      }
      
      // Skip for authorized users if configured
      if (skipForAuthorizedUsers && req.user) {
        return originalSend.apply(res, [body]);
      }
      
      try {
        let content: string;
        let modifiedBody: any = body;
        
        // Extract content from string or object
        if (typeof body === 'string') {
          content = body;
          
          // Check if advisory is needed
          if (needsContentAdvisory(content)) {
            const advisory = createContentAdvisory(content);
            
            // For API routes, try to parse JSON and include advisory
            if (req.path.startsWith('/api/')) {
              try {
                const jsonBody = JSON.parse(content);
                jsonBody._contentAdvisory = advisory;
                modifiedBody = JSON.stringify(jsonBody);
              } catch (e) {
                // Not JSON, leave as is
                modifiedBody = content;
              }
            }
          }
        } else {
          // For JSON responses, stringify to analyze and include advisory if needed
          content = JSON.stringify(body);
          
          if (needsContentAdvisory(content)) {
            const advisory = createContentAdvisory(content);
            modifiedBody._contentAdvisory = advisory;
          }
        }
        
        // Call the original send with modified body
        return originalSend.apply(res, [modifiedBody]);
      } catch (error) {
        console.error('Error in content advisory middleware:', error);
        // Fall back to original content if there's an error
        return originalSend.apply(res, [body]);
      }
    };
    
    next();
  };
}

/**
 * Helper function to extract content advisory from response
 * 
 * @param body Response body
 * @returns Content advisory if found, undefined otherwise
 */
export function extractContentAdvisory(body: any): ContentAdvisory | undefined {
  if (!body) return undefined;
  
  if (typeof body === 'object' && body._contentAdvisory) {
    return body._contentAdvisory;
  }
  
  if (typeof body === 'string') {
    try {
      const jsonBody = JSON.parse(body);
      return jsonBody._contentAdvisory;
    } catch (e) {
      // Not JSON
      return undefined;
    }
  }
  
  return undefined;
}