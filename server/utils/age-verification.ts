/**
 * Age Verification Utilities
 * 
 * This module provides functions for verifying user age and determining
 * appropriate restrictions or requirements based on age.
 */

// Minimum age for account creation without parental consent (COPPA)
export const MIN_AGE_WITHOUT_CONSENT = 13;

// Age cutoff for considering a user a minor
export const MINOR_AGE_CUTOFF = 18;

// Types of age verification errors
export enum AgeVerificationErrorType {
  UNDER_MINIMUM_AGE = 'UNDER_MINIMUM_AGE',
  MINOR_WITHOUT_CONSENT = 'MINOR_WITHOUT_CONSENT',
  INVALID_BIRTH_YEAR = 'INVALID_BIRTH_YEAR',
  FUTURE_BIRTH_YEAR = 'FUTURE_BIRTH_YEAR'
}

// Age verification error
export interface AgeVerificationError {
  type: AgeVerificationErrorType;
  message: string;
}

// Age verification result
export interface AgeVerificationResult {
  isValid: boolean;
  isMinor: boolean;
  age: number;
  error?: AgeVerificationError;
  requiresParentalConsent: boolean;
}

/**
 * Calculates current age based on birth year
 * 
 * @param birthYear The year of birth
 * @returns Current age
 */
export function calculateAge(birthYear: number): number {
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
}

/**
 * Verifies user's age based on birth year and parental consent
 * 
 * @param birthYear User's birth year
 * @param hasParentalConsent Boolean indicating if user has parental consent
 * @returns Age verification result
 */
export function verifyAge(birthYear: number, hasParentalConsent: boolean = false): AgeVerificationResult {
  // Validate birth year
  const currentYear = new Date().getFullYear();
  
  if (!birthYear || isNaN(birthYear) || birthYear < 1900) {
    return {
      isValid: false,
      isMinor: false,
      age: 0,
      error: {
        type: AgeVerificationErrorType.INVALID_BIRTH_YEAR,
        message: 'Please provide a valid birth year.'
      },
      requiresParentalConsent: false
    };
  }
  
  if (birthYear > currentYear) {
    return {
      isValid: false,
      isMinor: false,
      age: 0,
      error: {
        type: AgeVerificationErrorType.FUTURE_BIRTH_YEAR,
        message: 'Birth year cannot be in the future.'
      },
      requiresParentalConsent: false
    };
  }
  
  // Calculate age
  const age = calculateAge(birthYear);
  
  // Check if user meets minimum age requirement (COPPA compliance)
  if (age < MIN_AGE_WITHOUT_CONSENT) {
    return {
      isValid: false,
      isMinor: true,
      age,
      error: {
        type: AgeVerificationErrorType.UNDER_MINIMUM_AGE,
        message: `Users must be at least ${MIN_AGE_WITHOUT_CONSENT} years old to create an account.`
      },
      requiresParentalConsent: true
    };
  }
  
  // Check if user is a minor and requires parental consent
  const isMinor = age < MINOR_AGE_CUTOFF;
  const requiresParentalConsent = isMinor;
  
  // If user is a minor and doesn't have parental consent
  if (isMinor && requiresParentalConsent && !hasParentalConsent) {
    return {
      isValid: false,
      isMinor,
      age,
      error: {
        type: AgeVerificationErrorType.MINOR_WITHOUT_CONSENT,
        message: 'Parental consent is required for users under 18 years old.'
      },
      requiresParentalConsent
    };
  }
  
  // User meets age requirements
  return {
    isValid: true,
    isMinor,
    age,
    requiresParentalConsent
  };
}

/**
 * Validates birth year format
 * 
 * @param birthYear Birth year to validate
 * @returns Boolean indicating if format is valid
 */
export function isValidBirthYearFormat(birthYear: number | string): boolean {
  const birthYearNum = Number(birthYear);
  
  // Check if it's a number and has 4 digits
  if (isNaN(birthYearNum) || birthYearNum.toString().length !== 4) {
    return false;
  }
  
  const currentYear = new Date().getFullYear();
  
  // Check if birth year is in a reasonable range
  return birthYearNum >= 1900 && birthYearNum <= currentYear;
}

/**
 * Gets appropriate content restriction level based on user's age
 * 
 * @param age User's age
 * @returns Content restriction level (none, mild, moderate, strict)
 */
export function getContentRestrictionLevel(age: number): 'none' | 'mild' | 'moderate' | 'strict' {
  if (age >= 18) {
    return 'none';
  }
  
  if (age >= 16) {
    return 'mild';
  }
  
  if (age >= 13) {
    return 'moderate';
  }
  
  return 'strict';
}