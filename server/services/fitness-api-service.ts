import axios from 'axios';

// Interfaces for typechecking the response data
export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  imageUrl?: string;
  videoUrl?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  exercises: {
    exerciseId: string;
    sets: number;
    reps: number | string;
    restTime: number; // in seconds
  }[];
}

export interface WorkoutCategory {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

// Using environment variables for API keys
const API_KEY = process.env.FITNESS_API_KEY || '';
const API_HOST = process.env.FITNESS_API_HOST || 'exercisedb.p.rapidapi.com';

// Base configuration for API requests
const apiClient = axios.create({
  baseURL: `https://${API_HOST}`,
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': API_HOST,
  },
});

// Fallback data for when API is not available
const fallbackCategories: WorkoutCategory[] = [
  {
    id: 'hiit',
    name: 'HIIT Workouts',
    description: 'High-Intensity Interval Training for maximum calorie burn and cardiovascular benefits',
  },
  {
    id: 'plyometrics',
    name: 'Plyometric Training',
    description: 'Explosive movement exercises to build power and athletic performance',
  },
  {
    id: 'stretching',
    name: 'Flexibility & Stretching',
    description: 'Improve range of motion and prevent injuries with targeted stretching routines',
  },
  {
    id: 'calisthenics',
    name: 'Calisthenics',
    description: 'Build functional strength using bodyweight exercises and minimal equipment',
  },
];

// Check if the API is configured
const isApiConfigured = !!API_KEY;

// Service methods
export const fitnessApiService = {
  /**
   * Get a list of exercises based on filters
   */
  async getExercises(options: {
    muscleGroup?: string;
    equipment?: string;
    difficulty?: string;
    limit?: number;
  }): Promise<Exercise[]> {
    try {
      if (!isApiConfigured) {
        console.warn('Fitness API key not configured, returning limited sample data');
        return [];
      }

      const { muscleGroup, equipment, difficulty, limit = 20 } = options;
      const params: Record<string, any> = {};
      
      if (muscleGroup) params.muscle = muscleGroup;
      if (equipment) params.equipment = equipment;
      if (difficulty) params.difficulty = difficulty;
      
      const response = await apiClient.get('/exercises', { params });
      
      // Transform the API response to match our Exercise interface
      const exercises: Exercise[] = response.data.slice(0, limit).map((item: any) => ({
        id: item.id || String(item.uuid) || String(Math.random()),
        name: item.name,
        description: item.description || item.instructions || '',
        muscleGroups: item.muscle?.split(',') || item.muscleGroups || [item.muscle || 'full body'],
        equipment: [item.equipment || 'body weight'],
        difficulty: item.difficulty || 'beginner',
        instructions: item.instructions ? [item.instructions] : ['Perform the exercise with proper form.'],
        imageUrl: item.gifUrl || item.imageUrl,
        videoUrl: item.videoUrl,
      }));
      
      return exercises;
    } catch (error) {
      console.error('Error fetching exercises from API:', error);
      return [];
    }
  },

  /**
   * Get workout categories (types of workouts)
   */
  async getWorkoutCategories(): Promise<WorkoutCategory[]> {
    try {
      if (!isApiConfigured) {
        console.warn('Fitness API key not configured, returning fallback categories');
        return fallbackCategories;
      }

      const response = await apiClient.get('/workoutCategories');
      return response.data || fallbackCategories;
    } catch (error) {
      console.error('Error fetching workout categories:', error);
      return fallbackCategories;
    }
  },
  
  /**
   * Get workout plans for a specific category
   */
  async getWorkoutPlans(category: string, level?: string): Promise<WorkoutPlan[]> {
    try {
      if (!isApiConfigured) {
        console.warn('Fitness API key not configured, returning empty workout plans');
        return [];
      }

      const params: Record<string, any> = { category };
      if (level) params.level = level;
      
      const response = await apiClient.get('/workoutPlans', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching workout plans:', error);
      return [];
    }
  },
  
  /**
   * Get details for a specific exercise by ID
   */
  async getExerciseDetails(exerciseId: string): Promise<Exercise | null> {
    try {
      if (!isApiConfigured) {
        console.warn('Fitness API key not configured, returning null for exercise details');
        return null;
      }

      const response = await apiClient.get(`/exercises/${exerciseId}`);
      const exercise = response.data;
      
      return {
        id: exercise.id,
        name: exercise.name,
        description: exercise.description || '',
        muscleGroups: Array.isArray(exercise.muscleGroups) 
          ? exercise.muscleGroups 
          : exercise.muscle?.split(',') || ['full body'],
        equipment: Array.isArray(exercise.equipment) 
          ? exercise.equipment 
          : [exercise.equipment || 'body weight'],
        difficulty: exercise.difficulty || 'beginner',
        instructions: Array.isArray(exercise.instructions) 
          ? exercise.instructions 
          : [exercise.instructions || 'Perform the exercise with proper form.'],
        imageUrl: exercise.gifUrl || exercise.imageUrl,
        videoUrl: exercise.videoUrl,
      };
    } catch (error) {
      console.error('Error fetching exercise details:', error);
      return null;
    }
  }
};

export default fitnessApiService;