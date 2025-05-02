/**
 * Age Verification Utilities
 * 
 * This module provides utility functions for verifying and checking age-related
 * fields for users, ensuring COPPA compliance (13+ years) and tracking 
 * minor status (under 18).
 */

// Minimum age for COPPA compliance
export const MINIMUM_AGE = 13;

// Age threshold for minor status
export const ADULT_AGE = 18;

/**
 * Calculates age from birth year
 * 
 * @param birthYear The user's birth year
 * @returns The calculated age or null if birthYear is invalid
 */
export function calculateAge(birthYear: number | null | undefined): number | null {
  if (birthYear === null || birthYear === undefined) {
    return null;
  }
  
  // Handle invalid birth years
  if (birthYear <= 1900 || birthYear > new Date().getFullYear()) {
    return null;
  }
  
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
}

/**
 * Checks if a user meets the minimum age requirement for COPPA compliance
 * 
 * @param birthYear The user's birth year
 * @returns True if the user is at least MINIMUM_AGE, false otherwise
 */
export function isOldEnoughForCoppa(birthYear: number | null | undefined): boolean {
  const age = calculateAge(birthYear);
  
  if (age === null) {
    return false;
  }
  
  return age >= MINIMUM_AGE;
}

/**
 * Checks if a user is a minor (under 18)
 * 
 * @param birthYear The user's birth year
 * @returns True if the user is under 18, false otherwise or if age can't be determined
 */
export function isMinor(birthYear: number | null | undefined): boolean {
  const age = calculateAge(birthYear);
  
  if (age === null) {
    return false; // Default to false if we can't determine
  }
  
  return age < ADULT_AGE;
}

/**
 * Determines if a user can access the platform based on age and consent
 * 
 * @param birthYear The user's birth year
 * @param hasParentalConsent Whether the user has parental consent (for minors)
 * @returns True if the user can access the platform, false otherwise
 */
export function canAccessPlatform(
  birthYear: number | null | undefined, 
  hasParentalConsent: boolean | null | undefined
): boolean {
  const age = calculateAge(birthYear);
  
  // If age can't be determined, block access
  if (age === null) {
    return false;
  }
  
  // Always allow adults
  if (age >= ADULT_AGE) {
    return true;
  }
  
  // For 13-17, require parental consent
  if (age >= MINIMUM_AGE && age < ADULT_AGE) {
    return hasParentalConsent === true;
  }
  
  // Block anyone under minimum age
  return false;
}

/**
 * Checks if a user's age has been verified (has valid birthYear)
 * 
 * @param birthYear The user's birth year
 * @returns True if the user's age has been verified, false otherwise
 */
export function isAgeVerified(birthYear: number | null | undefined): boolean {
  return calculateAge(birthYear) !== null;
}

/**
 * Processes all age-related fields based on birth year
 * 
 * @param birthYear The user's birth year
 * @param hasParentalConsent Whether the user has parental consent
 * @returns Object with calculated age-related fields
 */
export function processAgeFields(
  birthYear: number | null | undefined,
  hasParentalConsent: boolean | null | undefined = false
): {
  birthYear: number | null;
  ageVerified: boolean;
  isMinor: boolean;
  hasParentalConsent: boolean;
} {
  const calculatedAge = calculateAge(birthYear);
  const verifiedBirthYear = calculatedAge !== null ? birthYear as number : null;
  
  return {
    birthYear: verifiedBirthYear,
    ageVerified: calculatedAge !== null,
    isMinor: calculatedAge !== null ? calculatedAge < ADULT_AGE : false,
    hasParentalConsent: hasParentalConsent === true
  };
}