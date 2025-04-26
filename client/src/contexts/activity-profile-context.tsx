import React, { createContext, useState, useContext, useEffect } from 'react';
import { ExerciseType } from "../modules/active-you/context/module-context";
import { FitnessProfile } from "../components/fitness-profile";

// Base profile interface for all activity types
export interface BaseActivityProfile {
  lastUpdated: Date;
  experience: 'beginner' | 'intermediate' | 'advanced';
}

// Yoga specific profile
export interface YogaProfile extends BaseActivityProfile {
  focusAreas: string[]; // E.g., "flexibility", "strength", "balance", "mindfulness"
  preferredStyles: string[]; // E.g., "hatha", "vinyasa", "yin", "power"
  practiceFrequency: string; // E.g., "daily", "2-3 times per week", "weekly"
  injuryConsiderations: string[]; // Any areas to be careful with
  favoriteAsanas: string[]; // Favorite poses
  timeAvailable: number; // Minutes
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
  timeAvailable: number; // Minutes
}

// Weightlifting specific profile
export interface WeightliftingProfile extends BaseActivityProfile {
  strengthGoals: string[]; // E.g., "muscle gain", "strength", "endurance", "power"
  focusMuscleGroups: string[]; // E.g., "chest", "back", "legs", "arms", "shoulders"
  preferredEquipment: string[]; // E.g., "free weights", "machines", "bodyweight", "resistance bands"
  maxLifts: Record<string, number>; // E.g., {"bench": 100, "squat": 150, "deadlift": 200}
  trainingFrequency: string; // E.g., "3-4 times per week"
  injuryConsiderations: string[]; // Any injuries to consider
  timeAvailable: number; // Minutes
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
  timeAvailable: number; // Minutes
}

// Stretching specific profile
export interface StretchingProfile extends BaseActivityProfile {
  flexibilityGoals: string[]; // E.g., "touch toes", "splits", "shoulder mobility"
  tightAreas: string[]; // E.g., "hamstrings", "back", "shoulders", "hips"
  preferredTechniques: string[]; // E.g., "static", "dynamic", "PNF", "ballistic"
  stretchingFrequency: string; // E.g., "daily", "after workouts"
  injuryConsiderations: string[]; // Any injuries to consider
  timeAvailable: number; // Minutes
}

// Meditation specific profile
export interface MeditationProfile extends BaseActivityProfile {
  meditationGoals: string[]; // E.g., "stress reduction", "focus", "sleep", "mindfulness"
  preferredStyles: string[]; // E.g., "guided", "breathing", "body scan", "mindfulness"
  practiceFrequency: string; // E.g., "daily", "morning and evening"
  challengingAspects: string[]; // E.g., "staying focused", "finding time", "posture"
  timeAvailable: number; // Minutes
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
  setActivityProfile: (type: ExerciseType, profile: ActivityProfile) => void;
  getProfileByType: (type: ExerciseType) => ActivityProfile | undefined;
  setFitnessProfile: (profile: FitnessProfile) => void;
  isProfileComplete: (type: ExerciseType) => boolean;
}

// Default values for context
const defaultContextValue: ActivityProfileContextType = {
  profiles: {},
  fitnessProfile: null,
  setActivityProfile: () => {},
  getProfileByType: () => undefined,
  setFitnessProfile: () => {},
  isProfileComplete: () => false,
};

// Create context
const ActivityProfileContext = createContext<ActivityProfileContextType>(defaultContextValue);

// Provider component
export const ActivityProfileProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [profiles, setProfiles] = useState<ActivityProfileMap>({});
  const [fitnessProfile, setFitnessProfileState] = useState<FitnessProfile | null>(null);

  // Load profiles from localStorage on first render
  useEffect(() => {
    try {
      const savedProfiles = localStorage.getItem('activityProfiles');
      if (savedProfiles) {
        // Parse the JSON but need to convert strings back to Date objects
        const parsedProfiles = JSON.parse(savedProfiles, (key, value) => {
          if (key === 'lastUpdated') {
            return new Date(value);
          }
          return value;
        });
        setProfiles(parsedProfiles);
      }

      const savedFitnessProfile = localStorage.getItem('fitnessProfile');
      if (savedFitnessProfile) {
        setFitnessProfileState(JSON.parse(savedFitnessProfile));
      }
    } catch (error) {
      console.error('Error loading activity profiles from localStorage:', error);
    }
  }, []);

  // Save profiles to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('activityProfiles', JSON.stringify(profiles));
    } catch (error) {
      console.error('Error saving activity profiles to localStorage:', error);
    }
  }, [profiles]);

  // Function to set an activity profile
  const setActivityProfile = (type: ExerciseType, profile: ActivityProfile) => {
    setProfiles(prev => ({
      ...prev,
      [type]: {
        ...profile,
        lastUpdated: new Date(),
      }
    }));
  };

  // Function to get a profile by activity type
  const getProfileByType = (type: ExerciseType): ActivityProfile | undefined => {
    return profiles[type];
  };

  // Function to set the general fitness profile
  const setFitnessProfile = (profile: FitnessProfile) => {
    setFitnessProfileState(profile);
    localStorage.setItem('fitnessProfile', JSON.stringify(profile));
  };

  // Function to check if a profile is complete for a specific activity type
  const isProfileComplete = (type: ExerciseType): boolean => {
    const profile = profiles[type];
    return profile !== undefined;
  };

  // Context value
  const value = {
    profiles,
    fitnessProfile,
    setActivityProfile,
    getProfileByType,
    setFitnessProfile,
    isProfileComplete,
  };

  return (
    <ActivityProfileContext.Provider value={value}>
      {children}
    </ActivityProfileContext.Provider>
  );
};

// Hook to use the context
export const useActivityProfile = () => useContext(ActivityProfileContext);