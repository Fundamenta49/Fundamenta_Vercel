/**
 * User Profile Hook
 * Provides access to the current user's profile data
 */

import { useQuery } from "@tanstack/react-query";

// Define the user profile interface
interface UserProfile {
  id: string;
  name: string;
  email: string;
  rank: number;
  points: number;
  createdAt: string;
  updatedAt: string;
}

export function useUserProfile() {
  const { data: userProfile, isLoading, error } = useQuery<UserProfile>({
    queryKey: ["/api/auth/me"],
    // If user is not logged in, this will return undefined without error
    retry: false,
    // Default to a rank 1 user for development if not authenticated
    placeholderData: {
      id: "dev-user",
      name: "Development User",
      email: "dev@example.com",
      rank: 1,
      points: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  });

  return {
    userProfile,
    isLoading,
    error,
    isAuthenticated: !!userProfile && userProfile.id !== "dev-user",
  };
}