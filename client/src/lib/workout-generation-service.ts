import axios from 'axios';
import { 
  ActivityProfile, 
  YogaProfile,
  RunningProfile,
  WeightliftingProfile,
  HIITProfile,
  StretchingProfile,
  MeditationProfile,
  FitnessProfile
} from '@/contexts/activity-profile-context';
import { ExerciseType } from '@/modules/active-you/context/module-context';

// Base workout interface
export interface BaseWorkout {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  equipmentNeeded: string[];
  tags: string[];
  createdAt: Date;
}

// Exercise interface
export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration?: number; // in seconds/minutes
  sets?: number;
  reps?: number;
  restBetween?: number; // in seconds
  technique?: string;
  targetMuscles?: string[];
  equipmentNeeded?: string[];
  imageUrl?: string;
  videoUrl?: string;
  tips?: string[];
  modifications?: {
    easier: string;
    harder: string;
  };
}

// Yoga workout
export interface YogaWorkout extends BaseWorkout {
  poses: Exercise[];
  focusAreas: string[];
  breathworkIncluded: boolean;
  meditationIncluded: boolean;
  flowType: string; // e.g., "Vinyasa", "Hatha", etc.
}

// Running workout
export interface RunningWorkout extends BaseWorkout {
  segments: {
    type: 'warmup' | 'interval' | 'steady' | 'cooldown';
    duration: number; // in minutes
    intensity: 'low' | 'moderate' | 'high';
    description: string;
  }[];
  totalDistance: number; // estimated in km
  terrainType: string[];
  weatherSuitability: string[];
}

// Weightlifting workout
export interface WeightliftingWorkout extends BaseWorkout {
  exercises: (Exercise & {
    sets: number;
    reps: number;
    restBetween: number;
    weight?: string; // "bodyweight", "light", "moderate", "heavy", or specific weight
  })[];
  supersets: {
    exerciseIds: string[];
    restAfter: number;
  }[];
  targetMuscleGroups: string[];
  splitType: string; // e.g., "full-body", "upper/lower", "push/pull/legs"
}

// HIIT workout
export interface HIITWorkout extends BaseWorkout {
  rounds: number;
  workInterval: number; // in seconds
  restInterval: number; // in seconds
  exercises: (Exercise & {
    duration?: number; // if time-based
    reps?: number; // if rep-based
  })[];
  totalIntervals: number;
  warmup: string;
  cooldown: string;
}

// Stretching workout
export interface StretchingWorkout extends BaseWorkout {
  stretches: (Exercise & {
    duration: number; // in seconds
    repetitions?: number;
    holdTime?: number; // in seconds
  })[];
  targetAreas: string[];
  techniqueTypes: string[]; // e.g., "static", "dynamic", "PNF"
}

// Meditation workout
export interface MeditationWorkout extends BaseWorkout {
  phases: {
    name: string;
    duration: number; // in minutes
    description: string;
    technique?: string;
  }[];
  focusType: string; // e.g., "breath", "body scan", "visualization"
  guidanceLevel: 'minimal' | 'moderate' | 'detailed';
  musicRecommended: boolean;
}

// Union of all workout types
export type Workout = 
  | YogaWorkout 
  | RunningWorkout 
  | WeightliftingWorkout 
  | HIITWorkout 
  | StretchingWorkout 
  | MeditationWorkout;

// API response for workout generation
interface WorkoutResponse {
  success: boolean;
  message?: string;
  workout?: Workout;
  recommendations?: Workout[];
}

// Function to generate a new workout
export async function generateWorkout(params: {
  activityType: ExerciseType;
  activityProfile: ActivityProfile;
  fitnessProfile?: FitnessProfile;
}): Promise<WorkoutResponse> {
  try {
    const { activityType, activityProfile, fitnessProfile } = params;
    
    const response = await axios.post<WorkoutResponse>('/api/workout/generate', {
      activityType,
      activityProfile,
      fitnessProfile
    });
    
    if (response.data.workout) {
      // Convert date strings to Date objects
      response.data.workout.createdAt = new Date(response.data.workout.createdAt);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error generating workout:', error);
    return {
      success: false,
      message: 'Failed to generate workout. Please try again later.'
    };
  }
}

// Function to get recommended workouts
export async function getRecommendedWorkouts(
  activityType: ExerciseType,
  activityProfile: ActivityProfile,
  fitnessProfile: FitnessProfile | null,
  count: number = 3
): Promise<Workout[]> {
  try {
    const response = await axios.post<WorkoutResponse>('/api/workout/recommendations', {
      activityType,
      activityProfile,
      fitnessProfile,
      count
    });
    
    if (response.data.recommendations) {
      // Convert date strings to Date objects
      response.data.recommendations.forEach(workout => {
        workout.createdAt = new Date(workout.createdAt);
      });
      
      return response.data.recommendations;
    }
    
    return [];
  } catch (error) {
    console.error('Error getting workout recommendations:', error);
    return [];
  }
}

// Function to save a workout to favorites
export async function saveWorkout(workout: Workout): Promise<{ success: boolean, message?: string }> {
  try {
    const response = await axios.post('/api/workout/save', { workout });
    return response.data;
  } catch (error) {
    console.error('Error saving workout:', error);
    return {
      success: false,
      message: 'Failed to save workout. Please try again later.'
    };
  }
}

// Function to get saved workouts
export async function getSavedWorkouts(activityType?: ExerciseType): Promise<Workout[]> {
  try {
    const params = activityType ? { activityType } : {};
    const response = await axios.get<{ workouts: Workout[] }>('/api/workout/saved', { params });
    
    // Convert date strings to Date objects
    response.data.workouts.forEach(workout => {
      workout.createdAt = new Date(workout.createdAt);
    });
    
    return response.data.workouts;
  } catch (error) {
    console.error('Error getting saved workouts:', error);
    return [];
  }
}

// Function to delete a saved workout
export async function deleteSavedWorkout(workoutId: string): Promise<{ success: boolean, message?: string }> {
  try {
    const response = await axios.delete(`/api/workout/saved/${workoutId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting saved workout:', error);
    return {
      success: false,
      message: 'Failed to delete workout. Please try again later.'
    };
  }
}

// Default export
export default {
  generateWorkout,
  getRecommendedWorkouts,
  saveWorkout,
  getSavedWorkouts,
  deleteSavedWorkout
};