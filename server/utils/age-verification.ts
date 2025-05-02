/**
 * Age verification utilities for COPPA compliance
 * Ensures we properly track user ages and handle minors appropriately
 */

// Constants
const MINIMUM_AGE = 13; // Minimum age for COPPA compliance
const ADULT_AGE = 18;   // Age of adulthood

/**
 * Checks if a user is considered a minor based on birth year
 * @param birthYear The user's birth year
 * @returns True if the user is a minor, false otherwise
 */
export function isMinor(birthYear: number | null | undefined): boolean {
  if (!birthYear) return false; // If no birth year provided, default to false
  
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;
  
  return age < ADULT_AGE;
}

/**
 * Checks if a user meets the minimum age requirements for COPPA compliance
 * @param birthYear The user's birth year
 * @returns True if the user meets the minimum age, false otherwise
 */
export function meetsMinimumAge(birthYear: number | null | undefined): boolean {
  if (!birthYear) return true; // If no birth year provided, default to true
  
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;
  
  return age >= MINIMUM_AGE;
}

/**
 * Calculates a user's age from their birth year
 * @param birthYear The user's birth year
 * @returns The user's age or null if birth year is not provided
 */
export function calculateAge(birthYear: number | null | undefined): number | null {
  if (!birthYear) return null;
  
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
}

/**
 * Creates age verification data for a user based on their birth year
 * @param birthYear The user's birth year
 * @param hasParentalConsent Whether the user has parental consent
 * @returns Object with age verification data
 */
export function createAgeVerificationData(
  birthYear: number | null | undefined, 
  hasParentalConsent: boolean = false
) {
  if (!birthYear) {
    return {
      birthYear: null,
      ageVerified: false,
      isMinor: false,
      hasParentalConsent: false
    };
  }
  
  const minor = isMinor(birthYear);
  const meetsMinAge = meetsMinimumAge(birthYear);
  
  // If user doesn't meet minimum age and doesn't have parental consent,
  // we can't allow them to use the platform
  if (!meetsMinAge && !hasParentalConsent) {
    throw new Error("User does not meet minimum age requirements for COPPA compliance");
  }
  
  return {
    birthYear,
    ageVerified: true,
    isMinor: minor,
    hasParentalConsent: minor ? hasParentalConsent : false // Only relevant for minors
  };
}