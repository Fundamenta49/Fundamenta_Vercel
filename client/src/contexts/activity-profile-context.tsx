import React, { createContext, useState, useContext, useEffect } from 'react';
import { ExerciseType } from "../modules/active-you/context/module-context";

// Base profile interface for all activity types
export interface BaseActivityProfile {
  lastUpdated: Date;
  experience: 'beginner' | 'intermediate' | 'advanced';
  timeAvailable: number; // Minutes
}

// Yoga specific profile
export interface YogaProfile extends BaseActivityProfile {
  focusAreas: string[]; // E.g., "flexibility", "strength", "balance", "mindfulness"
  preferredStyles: string[]; // E.g., "hatha", "vinyasa", "yin", "power"
  practiceFrequency: string; // E.g., "daily", "2-3 times per week", "weekly"
  injuryConsiderations: string[]; // Any areas to be careful with
  favoriteAsanas: string[]; // Favorite poses
}

// Running specific profile
export interface RunningProfile extends BaseActivityProfile {
  runningGoals: string[]; // E.g., "5K", "10K", "half marathon", "improve pace", "weight loss"
  typicalDistance: number; // in kilometers
  typicalPace: number; // in min/km
  preferredTerrain: string[]; // E.g., "road", "trail", "track", "treadmill"
  runningFrequency: string; // E.g., "daily", "3 times per week"
  injuryConsiderations: string[]; // Any injuries to consider
  preferredWeather: string[]; // E.g., "rain", "sunshine", "any"
}

// Weightlifting specific profile
export interface WeightliftingProfile extends BaseActivityProfile {
  strengthGoals: string[]; // E.g., "muscle gain", "strength", "endurance", "power"
  focusMuscleGroups: string[]; // E.g., "chest", "back", "legs", "arms", "shoulders"
  preferredEquipment: string[]; // E.g., "free weights", "machines", "bodyweight", "resistance bands"
  maxLifts: Record<string, number>; // E.g., {"bench": 100, "squat": 150, "deadlift": 200}
  trainingFrequency: string; // E.g., "3-4 times per week"
  injuryConsiderations: string[]; // Any injuries to consider
}

// HIIT specific profile
export interface HIITProfile extends BaseActivityProfile {
  intensityPreference: 'low' | 'medium' | 'high';
  restPreference: 'short' | 'medium' | 'long';
  focusAreas: string[]; // E.g., "cardio", "strength", "agility", "endurance"
  preferredEquipment: string[]; // E.g., "bodyweight", "kettlebell", "dumbbells"
  preferredExercises: string[]; // Favorite exercises
  trainingFrequency: string; // E.g., "2-3 times per week"
  injuryConsiderations: string[]; // Any injuries to consider
}

// Stretching specific profile
export interface StretchingProfile extends BaseActivityProfile {
  flexibilityGoals: string[]; // E.g., "touch toes", "splits", "shoulder mobility"
  tightAreas: string[]; // E.g., "hamstrings", "back", "shoulders", "hips"
  preferredTechniques: string[]; // E.g., "static", "dynamic", "PNF", "ballistic"
  stretchingFrequency: string; // E.g., "daily", "after workouts"
  injuryConsiderations: string[]; // Any injuries to consider
}

// Meditation specific profile
export interface MeditationProfile extends BaseActivityProfile {
  meditationGoals: string[]; // E.g., "stress reduction", "focus", "sleep", "mindfulness"
  preferredStyles: string[]; // E.g., "guided", "breathing", "body scan", "mindfulness"
  practiceFrequency: string; // E.g., "daily", "morning and evening"
  challengingAspects: string[]; // E.g., "staying focused", "finding time", "posture"
}

// General fitness profile
export interface FitnessProfile {
  name?: string;
  age?: number;
  gender?: string;
  weight?: number; // in kg
  height?: number; // in cm
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
  healthConditions?: string[];
  fitnessGoals?: string[];
  preferredActivities?: string[];
  dietaryPreferences?: string[];
  sleepHours?: number;
  stressLevel?: 'low' | 'moderate' | 'high';
}

// Union type of all activity profiles
export type ActivityProfile = 
  | YogaProfile 
  | RunningProfile 
  | WeightliftingProfile 
  | HIITProfile 
  | StretchingProfile 
  | MeditationProfile;

// Map of activity type to corresponding profile
export type ActivityProfileMap = {
  [key in ExerciseType]?: ActivityProfile;
};

// Context interface
interface ActivityProfileContextType {
  profiles: ActivityProfileMap;
  fitnessProfile: FitnessProfile | null;
  updateProfile: (activityType: ExerciseType, profile: ActivityProfile) => void;
  updateFitnessProfile: (profile: FitnessProfile) => void;
  getProfileByType: (activityType: ExerciseType) => ActivityProfile | null;
  isProfileComplete: (activityType: ExerciseType) => boolean;
  resetProfiles: () => void;
}

// Local storage keys
const PROFILES_STORAGE_KEY = 'fundamenta-activity-profiles';
const FITNESS_PROFILE_STORAGE_KEY = 'fundamenta-fitness-profile';

// Create the context
const ActivityProfileContext = createContext<ActivityProfileContextType>({
  profiles: {},
  fitnessProfile: null,
  updateProfile: () => {},
  updateFitnessProfile: () => {},
  getProfileByType: () => null,
  isProfileComplete: () => false,
  resetProfiles: () => {},
});

// Provider component
export const ActivityProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<ActivityProfileMap>({});
  const [fitnessProfile, setFitnessProfile] = useState<FitnessProfile | null>(null);
  
  // Load profiles from local storage on component mount
  useEffect(() => {
    try {
      const storedProfiles = localStorage.getItem(PROFILES_STORAGE_KEY);
      if (storedProfiles) {
        const parsedProfiles = JSON.parse(storedProfiles);
        
        // Convert string dates back to Date objects
        Object.keys(parsedProfiles).forEach(key => {
          if (parsedProfiles[key]?.lastUpdated) {
            parsedProfiles[key].lastUpdated = new Date(parsedProfiles[key].lastUpdated);
          }
        });
        
        setProfiles(parsedProfiles);
      }
      
      const storedFitnessProfile = localStorage.getItem(FITNESS_PROFILE_STORAGE_KEY);
      if (storedFitnessProfile) {
        setFitnessProfile(JSON.parse(storedFitnessProfile));
      }
    } catch (error) {
      console.error('Error loading profiles from local storage:', error);
    }
  }, []);
  
  // Save profiles to local storage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
    } catch (error) {
      console.error('Error saving profiles to local storage:', error);
    }
  }, [profiles]);
  
  // Save fitness profile to local storage whenever it changes
  useEffect(() => {
    if (fitnessProfile) {
      try {
        localStorage.setItem(FITNESS_PROFILE_STORAGE_KEY, JSON.stringify(fitnessProfile));
      } catch (error) {
        console.error('Error saving fitness profile to local storage:', error);
      }
    }
  }, [fitnessProfile]);
  
  // Update a specific activity profile
  const updateProfile = (activityType: ExerciseType, profile: ActivityProfile) => {
    setProfiles(prev => ({
      ...prev,
      [activityType]: profile
    }));
  };
  
  // Update the general fitness profile
  const updateFitnessProfile = (profile: FitnessProfile) => {
    setFitnessProfile(profile);
  };
  
  // Get a profile by activity type
  const getProfileByType = (activityType: ExerciseType): ActivityProfile | null => {
    return profiles[activityType] || null;
  };
  
  // Check if a profile is complete
  const isProfileComplete = (activityType: ExerciseType): boolean => {
    const profile = profiles[activityType];
    if (!profile) return false;
    
    // Basic check - profile exists and has been updated in the last 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    return profile.lastUpdated > ninetyDaysAgo;
  };
  
  // Reset all profiles
  const resetProfiles = () => {
    setProfiles({});
    localStorage.removeItem(PROFILES_STORAGE_KEY);
  };
  
  return (
    <ActivityProfileContext.Provider
      value={{
        profiles,
        fitnessProfile,
        updateProfile,
        updateFitnessProfile,
        getProfileByType,
        isProfileComplete,
        resetProfiles
      }}
    >
      {children}
    </ActivityProfileContext.Provider>
  );
};

// Custom hook to use the context
export const useActivityProfile = () => {
  const context = useContext(ActivityProfileContext);
  if (context === undefined) {
    throw new Error('useActivityProfile must be used within an ActivityProfileProvider');
  }
  return context;
};

export default ActivityProfileContext;