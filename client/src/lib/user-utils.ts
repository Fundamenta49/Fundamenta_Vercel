/**
 * User utility functions to handle user information
 */

import { useAuth } from '@/lib/auth-context';

/**
 * Get the user's first name from auth context
 * Falls back to a friendly term if no name is available
 */
export const getRandomUserFirstName = (): string | null => {
  try {
    // Attempt to get current user info
    const storedUser = localStorage.getItem('fundamenta_user');
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // Extract first name from full name (take first word)
      if (user?.name) {
        return user.name.split(' ')[0];
      }
    }
    
    // Fallback to null so the calling function can decide what to do
    return null;
  } catch (error) {
    console.error("Error getting user's first name:", error);
    return null;
  }
};

/**
 * Hook to get current user's first name
 */
export const useUserFirstName = (): string => {
  const { user } = useAuth();
  
  if (user?.name) {
    return user.name.split(' ')[0];
  }
  
  // Fallback to friendly terms
  return "friend";
};