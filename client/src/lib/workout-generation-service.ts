import axios from 'axios';
import { 
  ActivityProfile, 
  YogaProfile,
  RunningProfile,
  WeightliftingProfile,
  HIITProfile,
  StretchingProfile,
  MeditationProfile
} from '@/contexts/activity-profile-context';
import { ExerciseType } from '@/modules/active-you/context/module-context';
import { FitnessProfile } from '@/components/fitness-profile';

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
  distance: number; // in kilometers
  segments: {
    type: 'warmup' | 'interval' | 'steady' | 'cooldown';
    duration: number; // in minutes
    intensity: 'low' | 'medium' | 'high';
    description: string;
  }[];
  terrain: string;
  targetPace?: number; // in minutes per km
  totalElevationGain?: number; // in meters
}

// Weightlifting workout
export interface WeightliftingWorkout extends BaseWorkout {
  exercises: (Exercise & {
    weight?: number | string; // number or formula like "70% of 1RM"
    tempo?: string; // e.g., "3-1-2-0" (eccentric-bottom-concentric-top)
  })[];
  muscleGroups: string[];
  splitType: string; // e.g., "Full Body", "Upper/Lower", "Push/Pull/Legs"
  progressionStrategy?: string;
}

// HIIT workout
export interface HIITWorkout extends BaseWorkout {
  rounds: number;
  exercises: (Exercise & {
    workDuration: number; // in seconds
    restDuration: number; // in seconds
  })[];
  totalWorkTime: number; // in seconds
  totalRestTime: number; // in seconds
  intervalType: string; // e.g., "Tabata", "EMOM", "AMRAP"
}

// Stretching workout
export interface StretchingWorkout extends BaseWorkout {
  stretches: (Exercise & {
    holdTime: number; // in seconds
    repetitions: number;
    technique: string; // e.g., "static", "dynamic", "PNF"
  })[];
  targetAreas: string[];
  recommendedFrequency: string; // e.g., "daily", "post-workout"
}

// Meditation workout
export interface MeditationWorkout extends BaseWorkout {
  guidedScript: string;
  focusArea: string; // e.g., "mindfulness", "relaxation", "stress reduction"
  technique: string; // e.g., "body scan", "breath awareness", "visualization"
  backgroundMusic?: string;
  recommendedFrequency: string;
}

// Union type for all workout types
export type Workout = 
  | YogaWorkout
  | RunningWorkout
  | WeightliftingWorkout
  | HIITWorkout
  | StretchingWorkout
  | MeditationWorkout;

// Request interface for workout generation
export interface WorkoutGenerationRequest {
  activityType: ExerciseType;
  activityProfile: ActivityProfile;
  fitnessProfile: FitnessProfile;
  preferences?: {
    duration?: number;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    focus?: string[];
    equipment?: string[];
  };
}

// Response interface for generated workouts
export interface WorkoutGenerationResponse {
  workout: Workout;
  success: boolean;
  message?: string;
}

/**
 * Generate a personalized workout based on user profiles and preferences
 */
export const generateWorkout = async (
  request: WorkoutGenerationRequest
): Promise<WorkoutGenerationResponse> => {
  try {
    // Send request to backend
    const response = await axios.post('/api/workout/generate', request);
    return response.data;
  } catch (error: any) {
    console.error('Error generating workout:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Failed to generate workout. Please try again.',
      workout: {} as Workout // Empty workout as placeholder
    };
  }
};

/**
 * Get a list of recommended workouts based on user profile
 */
export const getRecommendedWorkouts = async (
  activityType: ExerciseType,
  activityProfile: ActivityProfile,
  fitnessProfile: FitnessProfile | null,
  count: number = 3
): Promise<Workout[]> => {
  try {
    const response = await axios.post('/api/workout/recommendations', {
      activityType,
      activityProfile,
      fitnessProfile,
      count
    });
    return response.data.workouts;
  } catch (error) {
    console.error('Error getting workout recommendations:', error);
    return [];
  }
};

/**
 * Save a workout to the user's saved workouts
 */
export const saveWorkout = async (workout: Workout): Promise<boolean> => {
  try {
    const response = await axios.post('/api/workout/save', { workout });
    return response.data.success;
  } catch (error) {
    console.error('Error saving workout:', error);
    return false;
  }
};

/**
 * Get user's saved workouts
 */
export const getSavedWorkouts = async (activityType?: ExerciseType): Promise<Workout[]> => {
  try {
    const url = activityType ? `/api/workout/saved?type=${activityType}` : '/api/workout/saved';
    const response = await axios.get(url);
    return response.data.workouts;
  } catch (error) {
    console.error('Error getting saved workouts:', error);
    return [];
  }
};

/**
 * Mock the workout generation for development without a backend
 * This will be replaced by the actual API calls in production
 */
export const mockGenerateWorkout = (request: WorkoutGenerationRequest): Promise<WorkoutGenerationResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generic workout properties
      const baseWorkout: BaseWorkout = {
        id: 'workout_' + Date.now(),
        title: `Custom ${capitalize(request.activityType)} Workout`,
        description: `A personalized ${request.activityType} workout based on your profile and preferences.`,
        duration: request.preferences?.duration || 30,
        difficultyLevel: request.preferences?.difficulty || request.activityProfile.experience,
        equipmentNeeded: [],
        tags: [],
        createdAt: new Date()
      };

      let workout: Workout;

      // Generate different workout types based on activityType
      switch (request.activityType) {
        case 'yoga':
          const yogaProfile = request.activityProfile as YogaProfile;
          
          workout = {
            ...baseWorkout,
            poses: generateYogaPoses(yogaProfile, baseWorkout.difficultyLevel),
            focusAreas: yogaProfile.focusAreas,
            breathworkIncluded: true,
            meditationIncluded: yogaProfile.focusAreas.includes('Mindfulness'),
            flowType: yogaProfile.preferredStyles[0] || 'Vinyasa'
          } as YogaWorkout;
          break;

        case 'running':
          const runningProfile = request.activityProfile as RunningProfile;
          
          workout = {
            ...baseWorkout,
            distance: runningProfile.typicalDistance,
            segments: generateRunningSegments(runningProfile, baseWorkout.duration),
            terrain: runningProfile.preferredTerrain[0] || 'Road',
            targetPace: runningProfile.typicalPace
          } as RunningWorkout;
          break;

        case 'weightlifting':
          const liftingProfile = request.activityProfile as WeightliftingProfile;
          
          workout = {
            ...baseWorkout,
            exercises: generateWeightliftingExercises(liftingProfile, baseWorkout.difficultyLevel),
            muscleGroups: liftingProfile.focusMuscleGroups,
            splitType: 'Full Body'
          } as WeightliftingWorkout;
          break;

        // Add more cases for other activity types as needed
        default:
          workout = baseWorkout as Workout;
      }

      resolve({
        workout,
        success: true
      });
    }, 1500); // Simulate network delay
  });
};

// Helper functions for mock data generation
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const generateYogaPoses = (profile: YogaProfile, difficulty: string): Exercise[] => {
  // In a real implementation, this would create a meaningful sequence of yoga poses
  // based on the profile and difficulty
  return [
    {
      id: 'pose_1',
      name: 'Mountain Pose (Tadasana)',
      description: 'Stand tall with feet together, shoulders relaxed, weight evenly distributed through your feet.',
      duration: 60,
      targetMuscles: ['Core', 'Legs'],
      tips: ['Keep your shoulders relaxed', 'Engage your core']
    },
    {
      id: 'pose_2',
      name: 'Downward Facing Dog (Adho Mukha Svanasana)',
      description: 'Form an inverted V with your body, hands and feet on the ground.',
      duration: 90,
      targetMuscles: ['Shoulders', 'Hamstrings', 'Calves'],
      tips: ['Press firmly through your hands', 'Keep your heels reaching toward the floor'],
      modifications: {
        easier: 'Bend your knees slightly',
        harder: 'Lift one leg high toward the ceiling'
      }
    },
    // More poses would be included in a real implementation
  ];
};

const generateRunningSegments = (profile: RunningProfile, duration: number): any[] => {
  // In a real implementation, this would create a structured running workout
  // with warm-up, main segments, and cool-down based on profile
  return [
    {
      type: 'warmup',
      duration: Math.round(duration * 0.2),
      intensity: 'low',
      description: 'Start with a gentle jog to warm up your muscles'
    },
    {
      type: 'interval',
      duration: Math.round(duration * 0.6),
      intensity: 'medium',
      description: 'Alternate between moderate pace running and light jogging'
    },
    {
      type: 'cooldown',
      duration: Math.round(duration * 0.2),
      intensity: 'low',
      description: 'Slow down to a walk to gradually reduce your heart rate'
    }
  ];
};

const generateWeightliftingExercises = (profile: WeightliftingProfile, difficulty: string): any[] => {
  // In a real implementation, this would create a set of exercises
  // targeting the user's focus muscle groups based on their profile
  return [
    {
      id: 'exercise_1',
      name: 'Squats',
      description: 'A compound exercise that targets primarily the muscles of the thighs, hips and buttocks, quadriceps, and hamstrings.',
      sets: 3,
      reps: 10,
      restBetween: 90,
      targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
      tips: ['Keep your back straight', 'Push through your heels']
    },
    {
      id: 'exercise_2',
      name: 'Bench Press',
      description: 'A compound exercise that targets the pectoralis major of the chest, anterior deltoids of the shoulder, and triceps brachii of the upper arm.',
      sets: 3,
      reps: 8,
      weight: '70% of 1RM',
      restBetween: 120,
      targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
      tips: ['Keep your feet on the ground', 'Engage your core']
    },
    // More exercises would be included in a real implementation
  ];
};