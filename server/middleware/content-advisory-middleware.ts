import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../auth/auth-middleware';
import { getContentAdvisory } from '../utils/content-advisory';

/**
 * Middleware to check content for advisories and attach them to the response
 * This middleware should be used on routes that return user-facing content
 */
export function checkContentAdvisory(req: Request, res: Response, next: NextFunction) {
  // Store the original json method to intercept it
  const originalJson = res.json;
  
  // Override the json method to analyze content before sending
  res.json = function(body: any) {
    try {
      // Only check if there's a response body with content
      if (body && (typeof body === 'object')) {
        // Extract content to analyze if it exists in common response formats
        let contentToAnalyze: string | null = null;
        
        if (body.content && typeof body.content === 'string') {
          contentToAnalyze = body.content;
        } else if (body.message && typeof body.message === 'string') {
          contentToAnalyze = body.message;
        } else if (body.text && typeof body.text === 'string') {
          contentToAnalyze = body.text;
        } else if (body.data && typeof body.data === 'string') {
          contentToAnalyze = body.data;
        }
        
        // If we have content to analyze and a user to check against
        if (contentToAnalyze) {
          // Determine if user is a minor
          const isMinor = !!(req as AuthenticatedRequest).user?.isMinor;
          
          // Get advisory if needed
          const advisory = getContentAdvisory(contentToAnalyze, isMinor);
          
          // If there's an advisory, attach it to the response
          if (advisory) {
            body.advisory = advisory;
          }
        }
      }
    } catch (error) {
      console.error('Error in content advisory middleware:', error);
      // Continue with the original response even if advisory check fails
    }
    
    // Call the original json method with the potentially modified body
    return originalJson.call(this, body);
  };
  
  next();
}

/**
 * Middleware to check content in request body for advisories
 * Returns a 403 response if the content is restricted for the user
 */
export function validateContentAdvisory(req: Request, res: Response, next: NextFunction) {
  try {
    // Only check if there's a request body
    if (!req.body) {
      return next();
    }
    
    // Extract content to analyze
    let contentToAnalyze: string | null = null;
    
    if (typeof req.body === 'string') {
      contentToAnalyze = req.body;
    } else if (req.body.content && typeof req.body.content === 'string') {
      contentToAnalyze = req.body.content;
    } else if (req.body.message && typeof req.body.message === 'string') {
      contentToAnalyze = req.body.message;
    } else if (req.body.text && typeof req.body.text === 'string') {
      contentToAnalyze = req.body.text;
    } else if (req.body.query && typeof req.body.query === 'string') {
      contentToAnalyze = req.body.query;
    }
    
    // If we have content to analyze and a user to check against
    if (contentToAnalyze) {
      // Determine if user is a minor
      const isMinor = !!(req as AuthenticatedRequest).user?.isMinor;
      
      // Get advisory if needed
      const advisory = getContentAdvisory(contentToAnalyze, isMinor);
      
      // If there's a "restricted" advisory for a minor, block the request
      if (advisory && advisory.level === 'restrict' && isMinor) {
        return res.status(403).json({
          error: 'Content restricted',
          advisory,
          message: 'This content is not suitable for minors'
        });
      }
    }
    
    next();
  } catch (error) {
    console.error('Error in content validation middleware:', error);
    // Continue anyway so the application doesn't break
    next();
  }
}