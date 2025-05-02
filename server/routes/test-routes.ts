/**
 * Test routes for verifying feature functionality
 * 
 * These routes are used to test and verify the functionality of our legal safeguards:
 * 1. Content Advisory System - Detects potentially sensitive content and adds appropriate disclaimers
 * 2. Age Verification System - Ensures COPPA compliance and proper parental consent for minors
 */

import express, { Router } from 'express';
import { createContentAdvisory, needsContentAdvisory, ContentCategoryEnum } from '../utils/content-advisory';
import { verifyAge, calculateAge, MIN_AGE_WITHOUT_CONSENT, AgeVerificationResult } from '../utils/age-verification';

const router: Router = express.Router();

/**
 * Test endpoint for content advisory
 * This endpoint allows testing content advisory detection
 */
router.post('/content-advisory', (req, res) => {
  const { content } = req.body;
  
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }
  
  // Check if content needs advisory
  if (needsContentAdvisory(content)) {
    const advisory = createContentAdvisory(content);
    return res.json({ 
      content,
      _contentAdvisory: advisory
    });
  }
  
  // Return content without advisory
  return res.json({ content });
});

/**
 * Test endpoint for age verification
 * This endpoint validates age verification input using our utility
 */
router.post('/age-verification', (req, res) => {
  const { birthYear, hasParentalConsent } = req.body;
  
  if (!birthYear) {
    return res.status(400).json({ error: 'Birth year is required' });
  }
  
  try {
    // Use the comprehensive age verification utility
    const verificationResult = verifyAge(birthYear, !!hasParentalConsent);
    
    if (!verificationResult.isValid) {
      // Return the verification error with detailed information
      return res.status(403).json({
        error: 'Age verification failed',
        message: verificationResult.error?.message,
        code: verificationResult.error?.type,
        isMinor: verificationResult.isMinor,
        age: verificationResult.age,
        requiresParentalConsent: verificationResult.requiresParentalConsent
      });
    }
    
    // Return successful verification result
    return res.json({
      ageVerified: true,
      isMinor: verificationResult.isMinor,
      age: verificationResult.age,
      requiresParentalConsent: verificationResult.requiresParentalConsent,
      hasParentalConsent: !!hasParentalConsent
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Invalid age verification data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Test endpoint for legal compliance summary
 * Returns information about the current implementation of legal safeguards
 */
router.get('/legal-compliance', (req, res) => {
  const coppaMinimumAge = MIN_AGE_WITHOUT_CONSENT;
  
  // Return summary of implemented safeguards
  return res.json({
    safeguards: {
      ageVerification: {
        minimumAge: coppaMinimumAge,
        requiresParentalConsent: `Users under ${coppaMinimumAge} require parental consent`,
        minorConsent: "Users under 18 but over COPPA minimum require parental consent",
        implemented: true
      },
      contentAdvisory: {
        categories: Object.values(ContentCategoryEnum),
        autoDetection: true,
        disclaimers: {
          available: true,
          severityLevels: ["low", "medium", "high"]
        },
        implemented: true
      },
      privacyConsent: {
        cookieBased: true,
        withdrawable: true,
        implemented: true
      }
    },
    lastUpdated: new Date().toISOString()
  });
});

export default router;