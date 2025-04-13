import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// External dataset interface from yuhonas/free-exercise-db
interface ExternalExercise {
  name: string;
  force?: string;
  level: string;
  mechanic?: string;
  equipment: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: string[];
  id?: string;
}

// Load exercises from local JSON file
let localExercises: ExternalExercise[] = [];
try {
  const exercisesPath = path.join(__dirname, '../data/exercises.json');
  const exercisesData = fs.readFileSync(exercisesPath, 'utf8');
  localExercises = JSON.parse(exercisesData);
  console.log(`Loaded ${localExercises.length} exercises from local database`);
} catch (error) {
  console.error('Error loading local exercise database:', error);
  // Will fall back to sample exercises if local file can't be loaded
}

// Using environment variables for API keys (keeping for potential future use)
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

// Sample exercise data to use when API is not available
const sampleExercises: Exercise[] = [
  // Strength training exercises
  {
    id: 'ex-001',
    name: 'Barbell Bench Press',
    description: 'A compound exercise that targets the chest, shoulders, and triceps.',
    muscleGroups: ['chest', 'shoulders', 'arms'],
    equipment: ['barbell', 'bench'],
    difficulty: 'intermediate',
    instructions: [
      'Lie on a flat bench with your feet flat on the floor.',
      'Grip the barbell slightly wider than shoulder-width apart.',
      'Lower the bar to your mid-chest, keeping elbows at a 45-degree angle.',
      'Press the bar back up to full arm extension.',
      'Repeat for desired repetitions.'
    ],
    imageUrl: 'https://media.giphy.com/media/3ohs7Yw2RaCxOoZsK4/giphy.gif',
  },
  {
    id: 'ex-002',
    name: 'Dumbbell Shoulder Press',
    description: 'An effective exercise for building shoulder strength and stability.',
    muscleGroups: ['shoulders', 'arms'],
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    instructions: [
      'Sit on a bench with back support or stand with feet shoulder-width apart.',
      'Hold dumbbells at shoulder height with palms facing forward.',
      'Press the weights upward until your arms are fully extended.',
      'Slowly lower the weights back to shoulder level.',
      'Repeat for desired repetitions.'
    ],
    imageUrl: 'https://media.giphy.com/media/xT9DPkbuSxNgFjc3EQ/giphy.gif',
  },
  {
    id: 'ex-003',
    name: 'Barbell Squat',
    description: 'A fundamental compound exercise for building lower body strength and muscle.',
    muscleGroups: ['legs', 'core'],
    equipment: ['barbell'],
    difficulty: 'intermediate',
    instructions: [
      'Position the barbell across your upper back, resting on your trapezius muscles.',
      'Stand with feet shoulder-width apart, toes slightly pointed outward.',
      'Bend at the knees and hips to lower your body, keeping your back straight.',
      'Lower until thighs are parallel to the ground (or as low as flexibility allows).',
      'Push through your heels to return to standing position.',
      'Repeat for desired repetitions.'
    ],
    imageUrl: 'https://media.giphy.com/media/5t9UfQK6AaF7a/giphy.gif',
  },
  
  // Bodyweight exercises
  {
    id: 'ex-004',
    name: 'Push-Up',
    description: 'A classic bodyweight exercise that builds upper body strength and core stability.',
    muscleGroups: ['chest', 'shoulders', 'arms', 'core'],
    equipment: ['body weight'],
    difficulty: 'beginner',
    instructions: [
      'Start in a plank position with hands slightly wider than shoulder-width apart.',
      'Keep your body in a straight line from head to heels.',
      'Lower your body until your chest nearly touches the floor.',
      'Push yourself back up to the starting position.',
      'Repeat for desired repetitions.'
    ],
    imageUrl: 'https://media.giphy.com/media/7YCC78F5OufkPLxPT3/giphy.gif',
  },
  {
    id: 'ex-005',
    name: 'Pull-Up',
    description: 'An upper body exercise that primarily targets the back and biceps.',
    muscleGroups: ['back', 'arms'],
    equipment: ['body weight', 'pull-up bar'],
    difficulty: 'intermediate',
    instructions: [
      'Hang from a pull-up bar with hands slightly wider than shoulder-width apart, palms facing away.',
      'Pull your body upward until your chin is above the bar.',
      'Lower yourself with control back to the starting position.',
      'Repeat for desired repetitions.'
    ],
    imageUrl: 'https://media.giphy.com/media/xT9DPEPymVYxQYgyjK/giphy.gif',
  },
  {
    id: 'ex-006',
    name: 'Bodyweight Squat',
    description: 'A fundamental movement pattern that strengthens the lower body without equipment.',
    muscleGroups: ['legs'],
    equipment: ['body weight'],
    difficulty: 'beginner',
    instructions: [
      'Stand with feet shoulder-width apart, toes slightly pointed outward.',
      'Extend arms in front for balance or place hands behind head.',
      'Bend at the knees and hips to lower your body as if sitting in a chair.',
      'Keep your chest up and back straight.',
      'Lower until thighs are parallel to the ground (or as low as flexibility allows).',
      'Push through your heels to return to standing position.',
      'Repeat for desired repetitions.'
    ],
    imageUrl: 'https://media.giphy.com/media/1YLcHjRQuFvE2oT4yb/giphy.gif',
  },
  
  // Flexibility exercises
  {
    id: 'ex-007',
    name: 'Hamstring Stretch',
    description: 'A static stretch that improves flexibility in the back of the legs.',
    muscleGroups: ['legs', 'flexibility'],
    equipment: ['body weight'],
    difficulty: 'beginner',
    instructions: [
      'Sit on the floor with one leg extended and the other bent with foot against inner thigh.',
      'Reach toward your toes of the extended leg, keeping your back straight.',
      'Hold the stretch for 20-30 seconds, feeling the tension in your hamstring.',
      'Switch legs and repeat.',
      'Perform 2-3 sets per leg.'
    ],
    imageUrl: 'https://media.giphy.com/media/jQKhqxfTnrDbpmpJNq/giphy.gif',
  },
  {
    id: 'ex-008',
    name: 'Hip Flexor Stretch',
    description: 'Opens up the front of the hips and helps maintain proper hip mobility.',
    muscleGroups: ['legs', 'flexibility'],
    equipment: ['body weight'],
    difficulty: 'beginner',
    instructions: [
      'Kneel on one knee with the other foot planted in front of you.',
      'Keep your torso upright and core engaged.',
      'Gently push your hips forward until you feel a stretch in the front of the hip of the kneeling leg.',
      'Hold for 20-30 seconds.',
      'Switch sides and repeat.',
      'Perform 2-3 sets per side.'
    ],
    imageUrl: 'https://media.giphy.com/media/QKpYUzoOvR2CwHPnfi/giphy.gif',
  },
  
  // HIIT exercises
  {
    id: 'ex-009',
    name: 'Burpee',
    description: 'A full-body exercise that combines a squat, push-up, and jump for intense cardiovascular training.',
    muscleGroups: ['full body'],
    equipment: ['body weight'],
    difficulty: 'intermediate',
    instructions: [
      'Start in a standing position.',
      'Drop into a squat position and place hands on the ground.',
      'Kick feet back into a plank position.',
      'Perform a push-up (optional).',
      'Return feet to squat position.',
      'Jump up explosively from the squat position.',
      'Repeat for desired repetitions or time.'
    ],
    imageUrl: 'https://media.giphy.com/media/23hPPMRgPxbNBlPQe3/giphy.gif',
  },
  {
    id: 'ex-010',
    name: 'Mountain Climber',
    description: 'A dynamic exercise that elevates heart rate while engaging multiple muscle groups.',
    muscleGroups: ['core', 'shoulders', 'legs'],
    equipment: ['body weight'],
    difficulty: 'beginner',
    instructions: [
      'Start in a plank position with arms straight and hands under shoulders.',
      'Keep your core tight and back flat.',
      'Bring one knee toward your chest, then quickly switch legs.',
      'Continue alternating legs in a running motion.',
      'Maintain a fast pace for desired time or repetitions.'
    ],
    imageUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGIwZ2YwYXAzcGFrbGh3MDNvaHNvYmZuaW9vNjI1cXVucXZpeXl1NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gL2jW7C7raYK6T1HXM/giphy.gif',
  },
  
  // Plyometric exercises
  {
    id: 'ex-011',
    name: 'Box Jump',
    description: 'A plyometric exercise that builds explosive power in the lower body.',
    muscleGroups: ['legs'],
    equipment: ['box', 'platform'],
    difficulty: 'intermediate',
    instructions: [
      'Stand facing a sturdy box or platform with feet shoulder-width apart.',
      'Bend knees slightly and swing arms back.',
      'Explosively jump onto the box, swinging arms forward for momentum.',
      'Land softly with knees slightly bent.',
      'Step back down and repeat for desired repetitions.'
    ],
    imageUrl: 'https://media.giphy.com/media/SQTyIaKoQVcPOX0YOO/giphy.gif',
  },
  {
    id: 'ex-012',
    name: 'Plyo Push-Up',
    description: 'An advanced variation of the push-up that builds explosive upper body strength.',
    muscleGroups: ['chest', 'shoulders', 'arms'],
    equipment: ['body weight'],
    difficulty: 'advanced',
    instructions: [
      'Start in a standard push-up position with hands shoulder-width apart.',
      'Lower your body toward the floor.',
      'Push up explosively so your hands leave the ground.',
      'Land softly and immediately go into the next repetition.',
      'Repeat for desired repetitions.'
    ],
    imageUrl: 'https://media.giphy.com/media/5t9wgY5X8xX9HrqFVI/giphy.gif',
  },
  
  // Calisthenics exercises
  {
    id: 'ex-013',
    name: 'Dip',
    description: 'A bodyweight exercise that strengthens the triceps, chest, and shoulders.',
    muscleGroups: ['arms', 'chest', 'shoulders'],
    equipment: ['body weight', 'parallel bars'],
    difficulty: 'intermediate',
    instructions: [
      'Support yourself on parallel bars with arms fully extended.',
      'Keep elbows close to your body.',
      'Lower your body by bending your elbows until your upper arms are parallel to the ground.',
      'Push back up to the starting position.',
      'Repeat for desired repetitions.'
    ],
    imageUrl: 'https://media.giphy.com/media/l41lVcU24Qh99JOSc/giphy.gif',
  },
  {
    id: 'ex-014',
    name: 'L-Sit',
    description: 'An isometric core exercise that also builds shoulder and arm strength.',
    muscleGroups: ['core', 'arms'],
    equipment: ['body weight', 'parallel bars'],
    difficulty: 'advanced',
    instructions: [
      'Sit on the ground between two sturdy objects (or on parallel bars).',
      'Place hands on the objects and press down to lift your body off the ground.',
      'Extend legs straight out in front of you at a 90-degree angle to your torso.',
      'Hold this position, keeping legs straight and toes pointed.',
      'Hold for as long as possible, breathing steadily.',
      'Aim to increase hold time progressively.'
    ],
    imageUrl: 'https://media.giphy.com/media/xT39DndqIF1Xn1Om3e/giphy.gif',
  },
  {
    id: 'ex-015',
    name: 'Hollow Body Hold',
    description: 'A fundamental gymnastics position that builds core strength and body control.',
    muscleGroups: ['core'],
    equipment: ['body weight'],
    difficulty: 'beginner',
    instructions: [
      'Lie on your back with arms extended overhead.',
      'Press your lower back into the floor by engaging your core muscles.',
      'Lift shoulders and legs off the ground simultaneously.',
      'Hold this position with arms and legs straight, forming a shallow U-shape with your body.',
      'Hold for as long as possible while maintaining form.',
      'Start with shorter holds and gradually increase duration.'
    ],
    imageUrl: 'https://media.giphy.com/media/dsQc5VvY3R8pTCLK4K/giphy.gif',
  },
];

// Check if the API is configured
const isApiConfigured = !!API_KEY;

// Service methods
export const fitnessApiService = {
  /**
   * Shuffle array using Fisher-Yates algorithm
   */
  shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },
  
  /**
   * Get a list of exercises based on filters
   */
  async getExercises(options: {
    muscleGroup?: string;
    equipment?: string;
    difficulty?: string;
    category?: string;
    keyword?: string;
    limit?: number;
  }): Promise<Exercise[]> {
    try {
      const { muscleGroup, equipment, difficulty, category, keyword, limit = 20 } = options;
      
      // Use the external API if it's configured
      if (isApiConfigured) {
        const params: Record<string, any> = {};
        
        if (muscleGroup) params.muscle = muscleGroup;
        if (equipment) params.equipment = equipment;
        if (difficulty) params.difficulty = difficulty;
        
        try {
          const response = await apiClient.get('/exercises', { params });
          
          // Shuffle API response data for variety
          const shuffledData = [...response.data].sort(() => Math.random() - 0.5);
          
          // Transform the API response to match our Exercise interface
          const exercises: Exercise[] = shuffledData.slice(0, limit).map((item: any) => ({
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
        } catch (apiError) {
          console.error('Error fetching from API, falling back to local data:', apiError);
          // Continue to local data fallback
        }
      } else {
        console.warn('Fitness API key not configured, using local exercise database');
      }
      
      // If we don't have any local exercises yet (first boot), return sample exercises
      if (localExercises.length === 0) {
        console.info('No local exercises loaded yet, returning sample exercises');
        return sampleExercises.slice(0, limit);
      }
      
      // Filter exercises from the local database if API is not available or fails
      let filteredExercises = [...localExercises];
      
      if (muscleGroup) {
        // Convert both sides to lowercase for case-insensitive matching
        const muscleGroupLower = muscleGroup.toLowerCase();
        filteredExercises = filteredExercises.filter(ex => 
          ex.primaryMuscles.some(m => m.toLowerCase().includes(muscleGroupLower)) || 
          ex.secondaryMuscles.some(m => m.toLowerCase().includes(muscleGroupLower))
        );
      }
      
      if (equipment) {
        const equipmentLower = equipment.toLowerCase();
        filteredExercises = filteredExercises.filter(ex => 
          ex.equipment.toLowerCase().includes(equipmentLower)
        );
      }
      
      if (difficulty) {
        const difficultyLower = difficulty.toLowerCase();
        filteredExercises = filteredExercises.filter(ex => 
          ex.level.toLowerCase() === difficultyLower
        );
      }
      
      if (category) {
        const categoryLower = category.toLowerCase();
        
        // Special case for plyometrics to strictly enforce bodyweight only exercises
        if (categoryLower === 'plyometrics') {
          filteredExercises = filteredExercises.filter(ex => 
            ex.category.toLowerCase().includes(categoryLower) && 
            ex.equipment.toLowerCase() === 'body weight' && 
            !ex.equipment.toLowerCase().includes('machine') &&
            !ex.equipment.toLowerCase().includes('bench') &&
            !ex.equipment.toLowerCase().includes('barbell') &&
            !ex.equipment.toLowerCase().includes('cable')
          );
        } else {
          filteredExercises = filteredExercises.filter(ex => 
            ex.category.toLowerCase().includes(categoryLower)
          );
        }
      }
      
      if (keyword) {
        const keywordLower = keyword.toLowerCase();
        filteredExercises = filteredExercises.filter(ex => 
          ex.name.toLowerCase().includes(keywordLower) || 
          ex.primaryMuscles.some(m => m.toLowerCase().includes(keywordLower)) ||
          ex.category.toLowerCase().includes(keywordLower)
        );
      }
      
      // If we have no results after filtering, return sample exercises rather than empty
      if (filteredExercises.length === 0) {
        console.info('No matching exercises found in local database, returning sample exercises');
        
        // Filter sample exercises using the same criteria
        let sampleResults = [...sampleExercises];
        
        if (muscleGroup) {
          const muscleGroupLower = muscleGroup.toLowerCase();
          sampleResults = sampleResults.filter(ex => 
            ex.muscleGroups.some(m => m.toLowerCase().includes(muscleGroupLower))
          );
        }
        
        if (equipment) {
          const equipmentLower = equipment.toLowerCase();
          sampleResults = sampleResults.filter(ex => 
            ex.equipment.some(e => e.toLowerCase().includes(equipmentLower))
          );
        }
        
        if (difficulty) {
          sampleResults = sampleResults.filter(ex => 
            ex.difficulty === difficulty
          );
        }
        
        // Shuffle the results for more variety
        const results = sampleResults.length > 0 ? [...sampleResults] : [...sampleExercises];
        
        // Simple shuffle using sort with random comparator
        const shuffled = [...results].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, limit);
      }
      
      // Shuffle before converting to ensure different exercises each time
      const shuffledExercises = [...filteredExercises].sort(() => Math.random() - 0.5);
      
      // Convert local exercise format to our application's Exercise interface
      const exercises: Exercise[] = shuffledExercises.slice(0, limit).map((ex, index) => ({
        id: ex.id || `local-ex-${index}`,
        name: ex.name,
        description: ex.instructions.join(' ') || `${ex.name} targeting ${ex.primaryMuscles.join(', ')}`,
        muscleGroups: [...ex.primaryMuscles, ...ex.secondaryMuscles],
        equipment: [ex.equipment],
        difficulty: ex.level as 'beginner' | 'intermediate' | 'advanced',
        instructions: ex.instructions,
        imageUrl: ex.images && ex.images.length > 0 ? ex.images[0] : undefined,
        videoUrl: undefined,
      }));
      
      return exercises;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      // Safely return some randomized sample exercises as fallback
      const limit = options?.limit || 20;
      const shuffled = [...sampleExercises].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, limit);
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
      // First try to find the exercise in the local database
      if (exerciseId.startsWith('local-ex-')) {
        const index = parseInt(exerciseId.replace('local-ex-', ''), 10);
        if (!isNaN(index) && index >= 0 && index < localExercises.length) {
          const ex = localExercises[index];
          return {
            id: exerciseId,
            name: ex.name,
            description: ex.instructions.join(' ') || `${ex.name} targeting ${ex.primaryMuscles.join(', ')}`,
            muscleGroups: [...ex.primaryMuscles, ...ex.secondaryMuscles],
            equipment: [ex.equipment],
            difficulty: ex.level as 'beginner' | 'intermediate' | 'advanced',
            instructions: ex.instructions,
            imageUrl: ex.images && ex.images.length > 0 ? ex.images[0] : undefined,
            videoUrl: undefined,
          };
        }
      }
      
      // For non-local IDs or if local lookup failed
      // Check if we can find it in the sampleExercises
      const sampleExercise = sampleExercises.find(ex => ex.id === exerciseId);
      if (sampleExercise) {
        return sampleExercise;
      }
      
      // If API is configured, try to get the exercise from API
      if (isApiConfigured) {
        try {
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
        } catch (apiError) {
          console.error('Error fetching exercise details from API:', apiError);
        }
      }
      
      // As a last resort, try to find an exercise with a similar name in localExercises
      if (exerciseId.includes('-')) {
        const possibleName = exerciseId.split('-').slice(1).join(' ');
        const foundExercise = localExercises.find(ex => 
          ex.name.toLowerCase() === possibleName.toLowerCase()
        );
        
        if (foundExercise) {
          return {
            id: exerciseId,
            name: foundExercise.name,
            description: foundExercise.instructions.join(' ') || `${foundExercise.name} targeting ${foundExercise.primaryMuscles.join(', ')}`,
            muscleGroups: [...foundExercise.primaryMuscles, ...foundExercise.secondaryMuscles],
            equipment: [foundExercise.equipment],
            difficulty: foundExercise.level as 'beginner' | 'intermediate' | 'advanced',
            instructions: foundExercise.instructions,
            imageUrl: foundExercise.images && foundExercise.images.length > 0 ? foundExercise.images[0] : undefined,
            videoUrl: undefined,
          };
        }
      }
      
      console.warn(`Could not find exercise with ID ${exerciseId}`);
      return null;
    } catch (error) {
      console.error('Error fetching exercise details:', error);
      return null;
    }
  },
  
  /**
   * Get exercises by category
   * This method returns exercises that match a specific category like 'strength', 'cardio', etc.
   */
  async getExercisesByCategory(category: string, limit: number = 20): Promise<Exercise[]> {
    return this.getExercises({ category, limit });
  },
  
  /**
   * Get exercises by muscle group
   * This method returns exercises that target a specific muscle group like 'chest', 'back', etc.
   */
  async getExercisesByMuscleGroup(muscleGroup: string, limit: number = 20): Promise<Exercise[]> {
    return this.getExercises({ muscleGroup, limit });
  },
  
  /**
   * Get beginner-friendly exercises
   * This method returns exercises suitable for beginners
   */
  async getBeginnerExercises(limit: number = 20): Promise<Exercise[]> {
    return this.getExercises({ difficulty: 'beginner', limit });
  }
};

export default fitnessApiService;