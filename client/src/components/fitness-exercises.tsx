import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  Info, 
  Dumbbell, 
  Activity, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Video, 
  Clock, 
  Plus,
  Save,
  Trash,
  CheckCircle2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { searchExerciseVideos, getYouTubeEmbedUrl } from "@/lib/youtube-service";

// Exercise type from API
interface Exercise {
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

// Category type from API
interface WorkoutCategory {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

// Filter options
interface FilterOptions {
  muscleGroup?: string;
  equipment?: string;
  difficulty?: string;
  category?: string;
  keyword?: string;
}

interface FitnessExercisesProps {
  muscleFilter?: string;
  equipmentFilter?: string;
  difficultyFilter?: string;
  categoryFilter?: string;
  keywordFilter?: string;
  showFilters?: boolean;
  compactView?: boolean;
  maxExercises?: number;
}

export default function FitnessExercises({
  muscleFilter,
  equipmentFilter,
  difficultyFilter = 'beginner',
  categoryFilter,
  keywordFilter,
  showFilters = true,
  compactView = false,
  maxExercises = 10
}: FitnessExercisesProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    muscleGroup: muscleFilter,
    equipment: equipmentFilter,
    difficulty: difficultyFilter,
    category: categoryFilter,
    keyword: keywordFilter,
  });
  const [selectedTab, setSelectedTab] = useState<string>('exercises');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  // State for YouTube videos
  const [exerciseVideos, setExerciseVideos] = useState<Record<string, any[]>>({});
  const [loadingVideos, setLoadingVideos] = useState<Record<string, boolean>>({});
  const [expandedExercises, setExpandedExercises] = useState<Record<string, boolean>>({});
  
  // Workout builder state with enhanced adaptive difficulty
  const [workoutPlan, setWorkoutPlan] = useState<{
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    adaptiveDifficulty: boolean;
    lastCompleted?: string;
    progressionFactor: number; // Factor to increase difficulty (1.0 = no change, 1.1 = 10% increase)
    progressionStrategy: 'linear' | 'wave' | 'step'; // Different progression patterns
    weeklyFrequency: number; // How many times per week the workout is performed
    userFeedback?: {
      perceivedDifficulty: number; // 1-10 scale
      energyLevel: number; // 1-10 scale
      completionLevel: number; // Percentage of workout completed (0-100)
    };
    exercises: Array<{
      exerciseId: string;
      name: string;
      sets: number;
      reps: number;
      restTime: number;
      difficulty: string;
      weight?: number; // Optional weight used for this exercise
      tempo?: string; // Eccentric/concentric timing (e.g. "3-1-3" for 3s down, 1s pause, 3s up)
      progressionHistory?: Array<{
        date: string;
        sets: number;
        reps: number;
        restTime: number;
        weight?: number;
        perceivedExertion?: number; // 1-10 rating of perceived exertion
      }>;
      modifications?: {
        easier: string;
        harder: string;
        alternative?: string; // Alternative exercise if this one is too difficult/easy
      };
      progression?: {
        setIncrease: number;
        repIncrease: number;
        restDecrease: number;
        weightIncrease?: number; // For weighted exercises
        adaptationRate?: number; // How quickly this exercise adapts (0.5 = slower, 1.5 = faster)
      };
    }>;
  }>({
    name: 'My Custom Workout',
    level: 'beginner',
    adaptiveDifficulty: true,
    progressionFactor: 1.05, // 5% increase in difficulty per workout by default
    progressionStrategy: 'linear', // Default to linear progression
    weeklyFrequency: 3, // Default to 3 workouts per week
    exercises: []
  });
  
  // Define interface for workout exercise
  interface WorkoutExercise {
    exerciseId: string;
    name: string;
    sets: number;
    reps: number;
    restTime: number;
    difficulty: string;
    weight?: number;
    modifications?: {
      easier: string;
      harder: string;
    };
    progression?: {
      setIncrease: number;
      repIncrease: number;
      restDecrease: number;
      weightIncrease?: number;
      adaptationRate?: number;
    };
    progressionHistory?: Array<{
      date: string;
      sets: number;
      reps: number;
      restTime: number;
      weight: number;
      perceivedExertion?: number;
    }>;
  }

  // Define interface for workout feedback with both numeric and descriptive values
  interface WorkoutFeedback {
    perceivedDifficulty: number; // 1-10 scale
    energyLevel: number; // 1-10 scale
    completionLevel: number; // percentage 0-100
    difficulty?: 'easy' | 'moderate' | 'challenging' | 'too_hard';
    energy?: 'low' | 'moderate' | 'high';
    enjoyment?: 'low' | 'moderate' | 'high';
    soreness?: 'none' | 'mild' | 'moderate' | 'severe';
    progression?: 'slower' | 'maintain' | 'faster';
  }
  
  // Define interface for saved workout
  interface SavedWorkout {
    id: string;
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    adaptiveDifficulty: boolean;
    lastCompleted?: string;
    progressionFactor: number;
    completed: number; // Number of times the workout has been completed
    progressionStrategy?: 'linear' | 'wave' | 'step';
    weeklyFrequency?: number;
    userFeedback?: WorkoutFeedback;
    exercises: WorkoutExercise[];
  }
  
  const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>([]);
  const [showWorkoutBuilder, setShowWorkoutBuilder] = useState(false);
  
  // Fetch categories
  const categoriesQuery = useQuery<{success: boolean, categories: WorkoutCategory[]}>({
    queryKey: ['/api/fitness/categories'],
    retry: 1,
  });
  
  // Fetch exercises with filters
  const exercisesQuery = useQuery({
    queryKey: ['/api/fitness/exercises', filters],
    queryFn: async () => {
      // If we have a specific category, try the category endpoint first
      if (filters.category && !filters.muscleGroup && !filters.equipment) {
        try {
          const response = await fetch(`/api/fitness/category/${filters.category}?limit=${maxExercises}`);
          if (response.ok) {
            const data = await response.json();
            return data.exercises;
          }
        } catch (error) {
          console.warn('Failed to fetch by category, falling back to general endpoint');
        }
      }
      
      // If we have a specific muscle group only, try the muscle endpoint
      if (filters.muscleGroup && !filters.category && !filters.equipment) {
        try {
          const response = await fetch(`/api/fitness/muscle/${filters.muscleGroup}?limit=${maxExercises}`);
          if (response.ok) {
            const data = await response.json();
            return data.exercises;
          }
        } catch (error) {
          console.warn('Failed to fetch by muscle, falling back to general endpoint');
        }
      }
      
      // Fall back to the general endpoint with all filters
      const queryParams = new URLSearchParams();
      if (filters.muscleGroup) queryParams.append('muscleGroup', filters.muscleGroup);
      if (filters.equipment) queryParams.append('equipment', filters.equipment);
      if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.keyword) queryParams.append('keyword', filters.keyword);
      if (maxExercises) queryParams.append('limit', maxExercises.toString());
      
      const response = await fetch(`/api/fitness/exercises?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch exercises');
      }
      const data = await response.json();
      return data.exercises;
    },
    enabled: true,
  });
  
  // Update when filters change
  useEffect(() => {
    exercisesQuery.refetch();
  }, [filters]);

  // Update filters when props change
  useEffect(() => {
    setFilters({
      muscleGroup: muscleFilter,
      equipment: equipmentFilter,
      difficulty: difficultyFilter,
      category: categoryFilter,
      keyword: keywordFilter,
    });
  }, [muscleFilter, equipmentFilter, difficultyFilter, categoryFilter, keywordFilter]);
  
  // Auto-load videos for exercises when data is loaded
  useEffect(() => {
    // Only run this effect when exercises are loaded and it's in compact view
    // This ensures videos are preloaded in the ActiveYou exercise cards without user interaction
    if (compactView && exercisesQuery.data && !exercisesQuery.isPending) {
      // Limit to a reasonable number to avoid too many API calls
      const exercises = exercisesQuery.data.slice(0, maxExercises);
      
      // Process each exercise with a small delay to avoid rate limiting issues
      exercises.forEach((exercise, index) => {
        // Skip if we already have videos for this exercise
        if (exerciseVideos[exercise.id]?.length > 0) return;
        
        // Stagger video loading with a slight delay between each
        setTimeout(() => {
          // Pass the muscle groups for better search results
          loadExerciseVideos(
            exercise.id, 
            exercise.name, 
            exercise.equipment,
            exercise.muscleGroups,
            true // auto-loading flag
          );
        }, index * 300); // 300ms delay between each request
      });
    }
  }, [compactView, exercisesQuery.data, exercisesQuery.isPending]);

  // Load saved workouts from localStorage
  useEffect(() => {
    const savedWorkoutsJson = localStorage.getItem('savedWorkouts');
    if (savedWorkoutsJson) {
      try {
        const parsed = JSON.parse(savedWorkoutsJson);
        setSavedWorkouts(parsed);
      } catch (e) {
        console.error('Failed to parse saved workouts', e);
      }
    }
  }, []);
  
  // Save workouts to localStorage when they change
  useEffect(() => {
    if (savedWorkouts.length > 0) {
      localStorage.setItem('savedWorkouts', JSON.stringify(savedWorkouts));
    }
  }, [savedWorkouts]);
  
  // Muscle group options
  const muscleGroups = [
    { value: 'chest', label: 'Chest' },
    { value: 'back', label: 'Back' },
    { value: 'shoulders', label: 'Shoulders' },
    { value: 'legs', label: 'Legs' },
    { value: 'arms', label: 'Arms' },
    { value: 'core', label: 'Core' },
    { value: 'full body', label: 'Full Body' },
  ];
  
  // Equipment options
  const equipmentOptions = [
    { value: 'body weight', label: 'Body Weight' },
    { value: 'dumbbell', label: 'Dumbbells' },
    { value: 'barbell', label: 'Barbell' },
    { value: 'resistance band', label: 'Resistance Bands' },
    { value: 'kettlebell', label: 'Kettlebell' },
    { value: 'cable', label: 'Cable Machine' },
  ];
  
  // Difficulty levels
  const difficultyLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  // Function to add exercise to workout plan with adaptive difficulty information
  const addToWorkout = (exercise: Exercise) => {
    // Default progression rates based on exercise difficulty
    const getProgressionRate = (difficulty: string) => {
      switch (difficulty) {
        case 'beginner': return { setIncrease: 1, repIncrease: 2, restDecrease: 5 };
        case 'intermediate': return { setIncrease: 0, repIncrease: 1, restDecrease: 3 };
        case 'advanced': return { setIncrease: 0, repIncrease: 1, restDecrease: 2 };
        default: return { setIncrease: 0, repIncrease: 2, restDecrease: 5 };
      }
    };
    
    // Generate exercise modification suggestions based on difficulty
    const getModifications = (name: string, difficulty: string) => {
      const suggestions = {
        easier: '',
        harder: ''
      };
      
      // Simple modification suggestions based on exercise difficulty
      if (difficulty === 'beginner') {
        suggestions.easier = `Reduce range of motion for ${name}`;
        suggestions.harder = `Increase tempo or add more reps for ${name}`;
      } else if (difficulty === 'intermediate') {
        suggestions.easier = `Use lighter weight or reduce reps for ${name}`;
        suggestions.harder = `Add weight or increase time under tension for ${name}`;
      } else {
        suggestions.easier = `Reduce weight or use assistance for ${name}`;
        suggestions.harder = `Add resistance bands or increase weight for ${name}`;
      }
      
      return suggestions;
    };
    
    // Create the exercise entry with adaptive difficulty information
    const exerciseEntry = {
      exerciseId: exercise.id,
      name: exercise.name,
      sets: 3,
      reps: 10,
      restTime: 60,
      difficulty: exercise.difficulty,
      modifications: getModifications(exercise.name, exercise.difficulty),
      progression: getProgressionRate(exercise.difficulty)
    };
    
    setWorkoutPlan({
      ...workoutPlan,
      exercises: [...workoutPlan.exercises, exerciseEntry]
    });
    setShowWorkoutBuilder(true);
  };
  
  // Function to remove exercise from workout plan
  const removeFromWorkout = (index: number) => {
    const updatedExercises = [...workoutPlan.exercises];
    updatedExercises.splice(index, 1);
    setWorkoutPlan({
      ...workoutPlan,
      exercises: updatedExercises
    });
  };
  
  // Function to save current workout with enhanced adaptive difficulty information
  const saveWorkout = () => {
    if (workoutPlan.exercises.length === 0) {
      return; // Don't save empty workouts
    }
    
    const newWorkout = {
      id: `workout-${Date.now()}`,
      name: workoutPlan.name,
      level: workoutPlan.level,
      adaptiveDifficulty: workoutPlan.adaptiveDifficulty,
      progressionFactor: workoutPlan.progressionFactor,
      progressionStrategy: workoutPlan.progressionStrategy,
      weeklyFrequency: workoutPlan.weeklyFrequency,
      lastCompleted: '',
      completed: 0, // New workout hasn't been completed yet
      exercises: workoutPlan.exercises.map(exercise => ({
        ...exercise,
        // Initialize progression history for tracking progress over time
        progressionHistory: [{
          date: new Date().toISOString(),
          sets: exercise.sets,
          reps: exercise.reps,
          restTime: exercise.restTime,
          weight: exercise.weight || 0,
        }]
      }))
    };
    
    setSavedWorkouts([...savedWorkouts, newWorkout]);
    
    // Reset current workout with enhanced properties
    setWorkoutPlan({
      name: 'My Custom Workout',
      level: 'beginner',
      adaptiveDifficulty: true,
      progressionFactor: 1.05,
      progressionStrategy: 'linear',
      weeklyFrequency: 3,
      exercises: []
    });
    
    // Close workout builder
    setShowWorkoutBuilder(false);
  };
  
  // Function to delete a saved workout
  const deleteWorkout = (workoutId: string) => {
    setSavedWorkouts(savedWorkouts.filter(workout => workout.id !== workoutId));
  };
  
  // Function to load a saved workout
  const loadWorkout = (workout: SavedWorkout) => {
    // Ensure workout data has all the necessary fields with enhanced properties
    const workoutData = {
      name: workout.name,
      level: workout.level || 'beginner',
      adaptiveDifficulty: workout.adaptiveDifficulty !== undefined ? workout.adaptiveDifficulty : true,
      progressionFactor: workout.progressionFactor || 1.05,
      progressionStrategy: workout.progressionStrategy || 'linear',
      weeklyFrequency: workout.weeklyFrequency || 3,
      lastCompleted: workout.lastCompleted || '',
      userFeedback: workout.userFeedback || undefined,
      exercises: [...workout.exercises]
    };
    
    setWorkoutPlan(workoutData);
    setShowWorkoutBuilder(true);
  };
  
  // Function to mark a saved workout as completed and progress its difficulty with enhanced adaptive scaling
  const completeWorkout = (workout: SavedWorkout, index: number, userFeedbackData?: WorkoutFeedback) => {
    if (!workout.adaptiveDifficulty) {
      // If adaptive difficulty is turned off, just mark as completed
      const updatedWorkout = {
        ...workout,
        lastCompleted: new Date().toISOString(),
        completed: (workout.completed || 0) + 1
      };
      
      const updatedWorkouts = [...savedWorkouts];
      updatedWorkouts[index] = updatedWorkout;
      setSavedWorkouts(updatedWorkouts);
      return;
    }
    
    // Store user feedback if provided
    const userFeedback = userFeedbackData || {
      perceivedDifficulty: 5, // Medium difficulty by default
      energyLevel: 7, // Moderate energy level by default
      completionLevel: 100 // Assume full completion by default
    };
    
    // Calculate adaptive adjustment factor based on user feedback
    let adaptiveFactor = 1.0;
    if (userFeedback.perceivedDifficulty < 4) {
      // Workout was too easy, increase difficulty more
      adaptiveFactor = 1.2;
    } else if (userFeedback.perceivedDifficulty > 7) {
      // Workout was too hard, increase difficulty less or even decrease
      adaptiveFactor = 0.8;
    }
    
    // Adjust for completion level - if user couldn't finish, reduce progression
    if (userFeedback.completionLevel < 80) {
      adaptiveFactor *= 0.7;
    }
    
    // Adjust for energy level - higher energy might indicate capacity for more
    if (userFeedback.energyLevel > 8) {
      adaptiveFactor *= 1.1;
    } else if (userFeedback.energyLevel < 5) {
      adaptiveFactor *= 0.9;
    }
    
    // Apply progression strategy - linear, wave, or step patterns
    let strategyMultiplier = 1.0;
    const completionCount = (workout.completed || 0);
    
    if (workout.progressionStrategy === 'wave') {
      // Wave pattern: alternates between higher and lower intensity
      strategyMultiplier = completionCount % 2 === 0 ? 1.2 : 0.8;
    } else if (workout.progressionStrategy === 'step') {
      // Step pattern: maintains same difficulty for 3 workouts, then jumps up
      strategyMultiplier = completionCount % 3 === 2 ? 1.5 : 1.0;
    }
    // Linear strategy uses default multiplier of 1.0
    
    // Generate a new workout with increased difficulty
    const progressedExercises = workout.exercises.map((exercise: WorkoutExercise) => {
      // If no progression is defined, use default
      const progression = exercise.progression || { 
        setIncrease: 0, 
        repIncrease: 1, 
        restDecrease: 2,
        weightIncrease: 0,
        adaptationRate: 1.0
      };
      
      // Apply individual exercise adaptation rate if defined
      const exerciseAdaptiveFactor = progression.adaptationRate || 1.0;
      
      // Calculate new values with all adaptive factors combined
      const combinedFactor = adaptiveFactor * strategyMultiplier * exerciseAdaptiveFactor;
      
      // Create progression history entry for this workout
      const historyEntry = {
        date: new Date().toISOString(),
        sets: exercise.sets,
        reps: exercise.reps,
        restTime: exercise.restTime,
        weight: exercise.weight || 0,
        perceivedExertion: userFeedback.perceivedDifficulty
      };
      
      // Create or update progression history
      const progressionHistory = exercise.progressionHistory 
        ? [...exercise.progressionHistory, historyEntry]
        : [historyEntry];
      
      // Ensure we keep only the last 10 entries to prevent data bloat
      const trimmedHistory = progressionHistory.slice(-10);
        
      return {
        ...exercise,
        // Progress sets (up to max 6 sets)
        sets: Math.min(6, exercise.sets + (Math.random() < 0.3 * combinedFactor ? progression.setIncrease : 0)),
        // Progress reps (up to max 20 reps)
        reps: Math.min(20, exercise.reps + Math.ceil(progression.repIncrease * combinedFactor)),
        // Decrease rest time (minimum 30 seconds)
        restTime: Math.max(30, exercise.restTime - Math.ceil(progression.restDecrease * combinedFactor)),
        // Increase weight if applicable (only if weight > 0 and has weightIncrease)
        weight: exercise.weight && progression.weightIncrease 
          ? Math.round((exercise.weight + progression.weightIncrease * combinedFactor) * 10) / 10 
          : exercise.weight,
        // Store progression history
        progressionHistory: trimmedHistory
      };
    });
    
    const updatedWorkout = {
      ...workout,
      lastCompleted: new Date().toISOString(),
      completed: (workout.completed || 0) + 1,
      userFeedback: userFeedback,
      exercises: progressedExercises
    };
    
    const updatedWorkouts = [...savedWorkouts];
    updatedWorkouts[index] = updatedWorkout;
    setSavedWorkouts(updatedWorkouts);
  };
  
  // Function to load YouTube videos for an exercise
  // Generate a deterministic but unique seed for each exercise to ensure consistent but varied results
  const generateExerciseSeed = (exerciseId: string, category?: string, muscleGroup?: string): string => {
    // Create a seed that is unique to this exercise in this context (muscle/category)
    let seedBase = exerciseId;
    
    // Add category and muscle group for additional variety between cards
    if (category) seedBase += `-${category}`;
    if (muscleGroup) seedBase += `-${muscleGroup}`;
    
    // Create a simple hash of the string
    let hash = 0;
    for (let i = 0; i < seedBase.length; i++) {
      hash = ((hash << 5) - hash) + seedBase.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    
    // Convert to hex string and ensure it's positive
    return Math.abs(hash).toString(16).padStart(8, '0');
  };
  
  const loadExerciseVideos = async (
    exerciseId: string, 
    exerciseName: string, 
    equipment: string[],
    muscleGroups?: string[],
    autoload: boolean = false
  ) => {
    // Don't reload if we already have videos (unless force reload is requested)
    if (!autoload && exerciseVideos[exerciseId]?.length > 0) {
      return;
    }
    
    // If autoloading and we're already loading this exercise, don't start another request
    if (autoload && loadingVideos[exerciseId]) {
      return;
    }
    
    setLoadingVideos({...loadingVideos, [exerciseId]: true});
    
    try {
      // Use the equipment if specified, otherwise don't include it
      const equipmentStr = equipment.length > 0 ? equipment[0] : undefined;
      
      // Generate a seed that is unique to this exercise in this context
      const seed = generateExerciseSeed(exerciseId, filters.category, filters.muscleGroup);
      
      // Use enhanced search with muscle groups and seed for variety
      const videos = await searchExerciseVideos(
        exerciseName, 
        equipmentStr, 
        muscleGroups,
        seed
      );
      
      setExerciseVideos({
        ...exerciseVideos,
        [exerciseId]: videos
      });
    } catch (error) {
      console.error('Error loading videos for exercise:', error);
    } finally {
      setLoadingVideos({...loadingVideos, [exerciseId]: false});
    }
  };
  
  // Toggle expanded state for an exercise
  const toggleExerciseExpanded = (exerciseId: string, exercise: Exercise) => {
    const newExpandedState = !expandedExercises[exerciseId];
    setExpandedExercises({
      ...expandedExercises,
      [exerciseId]: newExpandedState
    });
    
    // If expanding, load videos
    if (newExpandedState) {
      loadExerciseVideos(exerciseId, exercise.name, exercise.equipment);
    }
  };
  
  // Render exercise cards
  const renderExercises = () => {
    if (exercisesQuery.isPending) {
      return Array.from({ length: 3 }).map((_, index) => (
        <Card key={`skeleton-${index}`}>
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ));
    }
    
    if (exercisesQuery.isError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading exercises. {exercisesQuery.error instanceof Error && exercisesQuery.error.message}
          </AlertDescription>
        </Alert>
      );
    }
    
    if (!exercisesQuery.data || exercisesQuery.data.length === 0) {
      return (
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[200px]">
            <Dumbbell className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No exercises found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Try adjusting your filters or check back later for new exercises.
            </p>
          </CardContent>
        </Card>
      );
    }
    
    // Limit the number of exercises shown
    const displayExercises = exercisesQuery.data.slice(0, maxExercises);
    
    return displayExercises.map((exercise: Exercise) => {
      const isExpanded = expandedExercises[exercise.id] === true;
      const videos = exerciseVideos[exercise.id] || [];
      const isLoading = loadingVideos[exercise.id] === true;
      
      return (
        <Card key={exercise.id} className="overflow-hidden">
          <CardHeader className={compactView ? "p-3" : "pb-2"}>
            <div className="flex justify-between items-start">
              <CardTitle className={compactView ? "text-base" : ""}>{exercise.name}</CardTitle>
              <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                {exercise.difficulty}
              </div>
            </div>
            <CardDescription>
              {exercise.muscleGroups.join(', ')} | {exercise.equipment.join(', ')}
            </CardDescription>
          </CardHeader>
          
          <CardContent className={compactView ? "p-3 pt-0" : "space-y-2"}>
            {/* In compact view, show expand button */}
            {compactView && (
              <div className="flex justify-between items-center mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleExerciseExpanded(exercise.id, exercise)}
                  className="text-xs"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      Show Details
                    </>
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addToWorkout(exercise)}
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add to Workout
                </Button>
              </div>
            )}
            
            {/* Show details if not in compact view or if expanded */}
            {(!compactView || isExpanded) && (
              <>
                <p className="text-sm">{exercise.description}</p>
                
                {exercise.instructions.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-1">Instructions:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {exercise.instructions.map((instruction, idx) => (
                        <li key={idx} className="text-sm">{instruction}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {exercise.imageUrl && (
                  <div className="mt-3 flex justify-center">
                    <img 
                      src={exercise.imageUrl} 
                      alt={exercise.name}
                      className="rounded-md max-h-60 object-contain"
                    />
                  </div>
                )}
                
                {/* YouTube videos section */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium">Tutorial Videos</h4>
                    {!isLoading && videos.length === 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => loadExerciseVideos(exercise.id, exercise.name, exercise.equipment, exercise.muscleGroups)}
                        className="text-xs"
                      >
                        <Video className="h-3 w-3 mr-1" />
                        Load Videos
                      </Button>
                    )}
                  </div>
                  
                  {isLoading ? (
                    <div className="py-4 flex justify-center">
                      <div className="flex flex-col items-center">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-24 w-full max-w-md rounded-md" />
                      </div>
                    </div>
                  ) : videos.length > 0 ? (
                    <div className="space-y-2">
                      {videos.slice(0, 2).map((video) => (
                        <div key={video.id} className="rounded-md overflow-hidden border">
                          <div className="aspect-video relative">
                            <iframe
                              src={getYouTubeEmbedUrl(video.id)}
                              title={video.title}
                              allowFullScreen
                              className="absolute inset-0 w-full h-full"
                            ></iframe>
                          </div>
                          <div className="p-2">
                            <h5 className="text-xs font-medium line-clamp-1">{video.title}</h5>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{video.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div 
                      className="py-4 flex justify-center"
                      onClick={() => loadExerciseVideos(exercise.id, exercise.name, exercise.equipment, exercise.muscleGroups)}
                    >
                      <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity">
                        <Video className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Loading exercise videos...</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
          
          {!compactView && (
            <CardFooter className="pt-0 pb-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => addToWorkout(exercise)}
                className="ml-auto"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add to Workout Plan
              </Button>
            </CardFooter>
          )}
        </Card>
      );
    });
  };
  
  // Render the component
  if (compactView) {
    return (
      <div className="space-y-4">
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Muscle Group</label>
              <Select
                value={filters.muscleGroup || ''}
                onValueChange={(value) => setFilters({...filters, muscleGroup: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Muscle Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Muscle Groups</SelectItem>
                  {muscleGroups.map(group => (
                    <SelectItem key={group.value} value={group.value}>
                      {group.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Equipment</label>
              <Select
                value={filters.equipment || ''}
                onValueChange={(value) => setFilters({...filters, equipment: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Equipment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Equipment</SelectItem>
                  {equipmentOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Difficulty</label>
              <Select
                value={filters.difficulty || 'beginner'}
                onValueChange={(value) => setFilters({...filters, difficulty: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficultyLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        <div className="grid gap-4 mt-2">
          {renderExercises()}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="exercises">Exercise Library</TabsTrigger>
          <TabsTrigger value="workouts">Workout Plans</TabsTrigger>
        </TabsList>
        
        <TabsContent value="exercises" className="space-y-4 mt-4">
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Muscle Group</label>
                <Select
                  value={filters.muscleGroup || ''}
                  onValueChange={(value) => setFilters({...filters, muscleGroup: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Muscle Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Muscle Groups</SelectItem>
                    {muscleGroups.map(group => (
                      <SelectItem key={group.value} value={group.value}>
                        {group.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Equipment</label>
                <Select
                  value={filters.equipment || ''}
                  onValueChange={(value) => setFilters({...filters, equipment: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Equipment</SelectItem>
                    {equipmentOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Difficulty</label>
                <Select
                  value={filters.difficulty || 'beginner'}
                  onValueChange={(value) => setFilters({...filters, difficulty: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyLevels.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <div className="grid gap-4 mt-4">
            {renderExercises()}
          </div>
        </TabsContent>
        
        <TabsContent value="workouts" className="space-y-4 mt-4">
          {/* Workout Builder with Adaptive Difficulty */}
          <Card className={showWorkoutBuilder ? "" : "hidden"}>
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <Input
                  value={workoutPlan.name}
                  onChange={(e) => setWorkoutPlan({...workoutPlan, name: e.target.value})}
                  className="text-xl font-bold border-0 p-0 h-auto"
                  placeholder="Workout Name"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowWorkoutBuilder(false)}
                  className="ml-2"
                >
                  Close
                </Button>
              </CardTitle>
              <CardDescription>
                Create a custom workout with adaptive difficulty progression
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Difficulty level and settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b">
                <div>
                  <label className="text-sm font-medium mb-1 block">Workout Level</label>
                  <Select
                    value={workoutPlan.level}
                    onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                      setWorkoutPlan({...workoutPlan, level: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Difficulty Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyLevels.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium">Adaptive Difficulty</label>
                    <Switch
                      checked={workoutPlan.adaptiveDifficulty}
                      onCheckedChange={(checked: boolean) => 
                        setWorkoutPlan({...workoutPlan, adaptiveDifficulty: checked})
                      }
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    When enabled, exercises will automatically progress in difficulty as you complete workouts
                  </p>
                </div>
                
                {workoutPlan.adaptiveDifficulty && (
                  <>
                    <div className="col-span-full">
                      <label className="text-sm font-medium mb-1 block">
                        Progression Rate: {Math.round((workoutPlan.progressionFactor - 1) * 100)}%
                      </label>
                      <Slider
                        defaultValue={[workoutPlan.progressionFactor * 100 - 100]}
                        max={20}
                        min={0}
                        step={1}
                        onValueChange={(value: number[]) => {
                          const factor = (value[0] / 100) + 1;
                          setWorkoutPlan({...workoutPlan, progressionFactor: factor});
                        }}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Gentle (0%)</span>
                        <span>Moderate (10%)</span>
                        <span>Aggressive (20%)</span>
                      </div>
                    </div>
                    
                    <div className="col-span-full mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Progression Strategy
                        </label>
                        <Select
                          value={workoutPlan.progressionStrategy}
                          onValueChange={(value: 'linear' | 'wave' | 'step') => 
                            setWorkoutPlan({...workoutPlan, progressionStrategy: value})
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Strategy" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="linear">Linear (Steady)</SelectItem>
                            <SelectItem value="wave">Wave (Alternating)</SelectItem>
                            <SelectItem value="step">Step (Periodic Jumps)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          {workoutPlan.progressionStrategy === 'linear' && 'Increases difficulty steadily over time'}
                          {workoutPlan.progressionStrategy === 'wave' && 'Alternates between harder and easier workouts'}
                          {workoutPlan.progressionStrategy === 'step' && 'Maintains difficulty for several workouts, then increases significantly'}
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Weekly Frequency
                        </label>
                        <Select
                          value={workoutPlan.weeklyFrequency.toString()}
                          onValueChange={(value) => 
                            setWorkoutPlan({...workoutPlan, weeklyFrequency: parseInt(value)})
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 time per week</SelectItem>
                            <SelectItem value="2">2 times per week</SelectItem>
                            <SelectItem value="3">3 times per week</SelectItem>
                            <SelectItem value="4">4 times per week</SelectItem>
                            <SelectItem value="5">5 times per week</SelectItem>
                            <SelectItem value="6">6 times per week</SelectItem>
                            <SelectItem value="7">Daily</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          How often you plan to do this workout
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {workoutPlan.exercises.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No exercises added yet. Browse the Exercise Library tab and add exercises to your workout.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {workoutPlan.exercises.map((exercise, index) => (
                    <Card key={`workout-item-${index}`} className="overflow-hidden border rounded-md">
                      <CardHeader className="p-3 pb-0">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">{exercise.name}</CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromWorkout(index)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-2">
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <Label htmlFor={`sets-${index}`} className="text-xs">Sets</Label>
                            <Input
                              id={`sets-${index}`}
                              type="number"
                              min="1"
                              value={exercise.sets}
                              onChange={(e) => {
                                const updatedExercises = [...workoutPlan.exercises];
                                updatedExercises[index].sets = parseInt(e.target.value) || 1;
                                setWorkoutPlan({...workoutPlan, exercises: updatedExercises});
                              }}
                              className="h-8 text-sm"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`reps-${index}`} className="text-xs">Reps</Label>
                            <Input
                              id={`reps-${index}`}
                              type="number"
                              min="1"
                              value={exercise.reps}
                              onChange={(e) => {
                                const updatedExercises = [...workoutPlan.exercises];
                                updatedExercises[index].reps = parseInt(e.target.value) || 1;
                                setWorkoutPlan({...workoutPlan, exercises: updatedExercises});
                              }}
                              className="h-8 text-sm"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`rest-${index}`} className="text-xs">Rest (sec)</Label>
                            <Input
                              id={`rest-${index}`}
                              type="number"
                              min="0"
                              step="15"
                              value={exercise.restTime}
                              onChange={(e) => {
                                const updatedExercises = [...workoutPlan.exercises];
                                updatedExercises[index].restTime = parseInt(e.target.value) || 0;
                                setWorkoutPlan({...workoutPlan, exercises: updatedExercises});
                              }}
                              className="h-8 text-sm"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end border-t p-3">
              <Button
                variant="default"
                onClick={saveWorkout}
                disabled={workoutPlan.exercises.length === 0}
                className="w-full md:w-auto"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Workout
              </Button>
            </CardFooter>
          </Card>
          
          {/* Create Workout Button */}
          {!showWorkoutBuilder && (
            <div className="mb-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setWorkoutPlan({
                    name: 'My Custom Workout',
                    level: 'beginner',
                    adaptiveDifficulty: true,
                    progressionFactor: 1.05,
                    progressionStrategy: 'linear',
                    weeklyFrequency: 3,
                    exercises: []
                  });
                  setShowWorkoutBuilder(true);
                }}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Workout
              </Button>
            </div>
          )}
          
          {/* Saved Workouts */}
          {!showWorkoutBuilder && (
            <>
              <h3 className="text-lg font-medium mb-2">Saved Workouts</h3>
              <div className="grid grid-cols-1 gap-4">
                {savedWorkouts.length === 0 ? (
                  <Card>
                    <CardContent className="py-6 text-center text-muted-foreground">
                      <p>You haven't saved any workouts yet.</p>
                      <p className="mt-2">Create a workout by adding exercises from the Exercise Library tab.</p>
                    </CardContent>
                  </Card>
                ) : (
                  savedWorkouts.map((workout) => (
                    <Card key={workout.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle>{workout.name}</CardTitle>
                        <CardDescription>
                          {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="exercises">
                            <AccordionTrigger className="text-sm py-2">
                              View Exercises
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2">
                                {workout.exercises.map((exercise, index) => (
                                  <div 
                                    key={`${workout.id}-exercise-${index}`}
                                    className="py-2 px-3 rounded-md bg-muted flex justify-between items-center"
                                  >
                                    <div>
                                      <p className="font-medium text-sm">{exercise.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {exercise.sets} sets × {exercise.reps} reps
                                        {exercise.restTime > 0 ? ` | ${exercise.restTime}s rest` : ''}
                                        {exercise.weight ? ` | ${exercise.weight}${exercise.weight > 50 ? 'lbs' : 'kg'}` : ''}
                                      </p>
                                    </div>
                                    <div className="flex items-center">
                                      <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                                      <span className="text-xs text-muted-foreground">
                                        {Math.round((exercise.sets * 45 + exercise.sets * exercise.restTime) / 60)} min
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                          
                          {workout.completed > 0 && (
                            <AccordionItem value="progress">
                              <AccordionTrigger className="text-sm py-2">
                                Progress & Adaptation
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="bg-muted p-2 rounded">
                                      <p className="font-medium">Last Workout</p>
                                      <p>{workout.lastCompleted ? new Date(workout.lastCompleted).toLocaleDateString() : 'Never'}</p>
                                    </div>
                                    <div className="bg-muted p-2 rounded">
                                      <p className="font-medium">Total Workouts</p>
                                      <p>{workout.completed || 0} completed</p>
                                    </div>
                                    <div className="bg-muted p-2 rounded">
                                      <p className="font-medium">Progression Strategy</p>
                                      <p>{workout.progressionStrategy || 'linear'}</p>
                                    </div>
                                    <div className="bg-muted p-2 rounded">
                                      <p className="font-medium">Adaptation Rate</p>
                                      <p>{Math.round((workout.progressionFactor - 1) * 100)}% per workout</p>
                                    </div>
                                  </div>
                                  
                                  {/* Progress visualization */}
                                  {workout.exercises.map((exercise, index) => {
                                    if (!exercise.progressionHistory || exercise.progressionHistory.length < 2) {
                                      return null; // Skip exercises without enough history
                                    }
                                    
                                    const history = exercise.progressionHistory;
                                    const maxReps = Math.max(...history.map(h => h.reps));
                                    const minReps = Math.min(...history.map(h => h.reps));
                                    const repRange = maxReps - minReps || 1;
                                    
                                    return (
                                      <div key={`progress-${index}`} className="mt-3">
                                        <p className="text-xs font-medium mb-1">{exercise.name} - Progressive Overload</p>
                                        <div className="bg-muted rounded-md p-2">
                                          <div className="relative h-20">
                                            {/* Visual rep count progression */}
                                            <div className="absolute inset-0 flex items-end">
                                              {history.map((entry, entryIndex) => {
                                                const height = ((entry.reps - minReps) / repRange) * 70 + 30;
                                                const width = 100 / history.length;
                                                
                                                return (
                                                  <div 
                                                    key={`rep-bar-${entryIndex}`}
                                                    className="flex flex-col items-center mx-1"
                                                    style={{width: `${width}%`}}
                                                  >
                                                    <div 
                                                      className="w-full bg-primary/70 rounded-t-sm"
                                                      style={{height: `${height}%`}}
                                                    ></div>
                                                    <span className="text-[10px] mt-1">{entry.reps}</span>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                            
                                            {/* Label */}
                                            <div className="absolute top-0 left-2 text-[10px] text-muted-foreground">
                                              Reps per set
                                            </div>
                                          </div>
                                          
                                          {/* Date labels at bottom */}
                                          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                                            <span>
                                              {history.length > 0 && new Date(history[0].date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                                            </span>
                                            <span>
                                              {history.length > 0 && new Date(history[history.length - 1].date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                  
                                  {/* Last feedback */}
                                  {workout.userFeedback && (
                                    <div className="mt-2">
                                      <p className="text-xs font-medium mb-1">Last Workout Feedback</p>
                                      <div className="grid grid-cols-3 gap-2 text-xs">
                                        <div className="bg-muted p-2 rounded">
                                          <p className="font-medium">Difficulty</p>
                                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                            <div 
                                              className="bg-primary h-1.5 rounded-full" 
                                              style={{width: `${workout.userFeedback.perceivedDifficulty * 10}%`}}
                                            ></div>
                                          </div>
                                          <p className="mt-1">{workout.userFeedback.perceivedDifficulty}/10 ({workout.userFeedback.difficulty || 'moderate'})</p>
                                        </div>
                                        <div className="bg-muted p-2 rounded">
                                          <p className="font-medium">Energy</p>
                                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                            <div 
                                              className="bg-primary h-1.5 rounded-full" 
                                              style={{width: `${workout.userFeedback.energyLevel * 10}%`}}
                                            ></div>
                                          </div>
                                          <p className="mt-1">{workout.userFeedback.energyLevel}/10 ({workout.userFeedback.energy || 'moderate'})</p>
                                        </div>
                                        <div className="bg-muted p-2 rounded">
                                          <p className="font-medium">Completion</p>
                                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                            <div 
                                              className="bg-primary h-1.5 rounded-full" 
                                              style={{width: `${workout.userFeedback.completionLevel}%`}}
                                            ></div>
                                          </div>
                                          <p className="mt-1">{workout.userFeedback.completionLevel}%</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          )}
                        </Accordion>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t p-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteWorkout(workout.id)}
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => loadWorkout(workout)}
                          >
                            <Activity className="h-4 w-4 mr-1" />
                            Load Workout
                          </Button>
                          
                          {/* Complete Workout Button with Feedback Dialog */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="default"
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Complete
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Workout Completed!</DialogTitle>
                                <DialogDescription>
                                  Great job completing your workout! Please provide feedback to help us adjust future workouts.
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <h4 className="font-medium text-sm">How difficult was this workout?</h4>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs">Too Easy</span>
                                    <div className="px-2 py-1">
                                      <Slider
                                        defaultValue={[5]}
                                        max={10}
                                        min={1}
                                        step={1}
                                        id="difficulty-slider"
                                        className="w-52"
                                        onValueChange={(value) => {
                                          const workoutFeedbackElement = document.getElementById('workout-feedback');
                                          if (workoutFeedbackElement) {
                                            workoutFeedbackElement.setAttribute('data-difficulty', value[0].toString());
                                          }
                                        }}
                                      />
                                    </div>
                                    <span className="text-xs">Too Hard</span>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <h4 className="font-medium text-sm">Energy Level During Workout?</h4>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs">Low</span>
                                    <div className="px-2 py-1">
                                      <Slider
                                        defaultValue={[7]}
                                        max={10}
                                        min={1}
                                        step={1}
                                        id="energy-slider" 
                                        className="w-52"
                                        onValueChange={(value) => {
                                          const workoutFeedbackElement = document.getElementById('workout-feedback');
                                          if (workoutFeedbackElement) {
                                            workoutFeedbackElement.setAttribute('data-energy', value[0].toString());
                                          }
                                        }}
                                      />
                                    </div>
                                    <span className="text-xs">High</span>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <h4 className="font-medium text-sm">How much of the workout did you complete?</h4>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs">Partial</span>
                                    <div className="px-2 py-1">
                                      <Slider
                                        defaultValue={[100]}
                                        max={100}
                                        min={10}
                                        step={10}
                                        id="completion-slider"
                                        className="w-52"
                                        onValueChange={(value) => {
                                          const workoutFeedbackElement = document.getElementById('workout-feedback');
                                          if (workoutFeedbackElement) {
                                            workoutFeedbackElement.setAttribute('data-completion', value[0].toString());
                                          }
                                        }}
                                      />
                                    </div>
                                    <span className="text-xs">Complete</span>
                                  </div>
                                </div>
                                
                                {/* Hidden element to store feedback data */}
                                <div id="workout-feedback" data-difficulty="5" data-energy="7" data-completion="100" className="hidden"></div>
                              </div>
                              
                              <DialogFooter>
                                <Button
                                  variant="default"
                                  onClick={() => {
                                    const feedbackElement = document.getElementById('workout-feedback');
                                    if (feedbackElement) {
                                      const difficulty = parseInt(feedbackElement.getAttribute('data-difficulty') || '5');
                                      const energy = parseInt(feedbackElement.getAttribute('data-energy') || '7');
                                      const completion = parseInt(feedbackElement.getAttribute('data-completion') || '100');
                                      
                                      // Get text descriptors for the numeric values
                                      const getDifficultyText = (value: number): 'easy' | 'moderate' | 'challenging' | 'too_hard' => {
                                        if (value <= 3) return 'easy';
                                        if (value <= 6) return 'moderate';
                                        if (value <= 8) return 'challenging';
                                        return 'too_hard';
                                      };
                                      
                                      const getEnergyText = (value: number): 'low' | 'moderate' | 'high' => {
                                        if (value <= 3) return 'low';
                                        if (value <= 7) return 'moderate';
                                        return 'high';
                                      };
                                      
                                      // Call the completeWorkout function with enhanced feedback data
                                      completeWorkout(workout, savedWorkouts.indexOf(workout), {
                                        perceivedDifficulty: difficulty,
                                        energyLevel: energy,
                                        completionLevel: completion,
                                        difficulty: getDifficultyText(difficulty),
                                        energy: getEnergyText(energy),
                                        enjoyment: energy > 7 ? 'high' : energy > 4 ? 'moderate' : 'low',
                                        soreness: difficulty > 8 ? 'severe' : difficulty > 6 ? 'moderate' : difficulty > 3 ? 'mild' : 'none',
                                        progression: difficulty > 7 ? 'slower' : difficulty < 4 ? 'faster' : 'maintain'
                                      });
                                    }
                                    
                                    // Close the dialog programmatically
                                    document.body.click();
                                  }}
                                >
                                  Save Progress & Adapt Next Workout
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </>
          )}
          
          {/* Workout Categories */}
          {!showWorkoutBuilder && savedWorkouts.length === 0 && (
            <>
              <h3 className="text-lg font-medium mt-6 mb-2">Workout Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {categoriesQuery.isPending ? (
                  // Loading state for categories
                  Array.from({ length: 4 }).map((_, index) => (
                    <Card key={`category-skeleton-${index}`}>
                      <CardHeader className="pb-2">
                        <Skeleton className="h-6 w-1/2" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2 mt-2" />
                      </CardContent>
                    </Card>
                  ))
                ) : categoriesQuery.isError ? (
                  // Error state
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Error loading workout categories.
                    </AlertDescription>
                  </Alert>
                ) : (
                  // Render categories
                  categoriesQuery.data?.categories ? categoriesQuery.data.categories.map((category: WorkoutCategory) => (
                    <Card key={category.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle>{category.name}</CardTitle>
                        <CardDescription>
                          {category.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFilters({...filters, category: category.id});
                            setSelectedTab('exercises');
                          }}
                          className="w-full"
                        >
                          <Info className="h-4 w-4 mr-2" />
                          Browse Exercises
                        </Button>
                      </CardContent>
                    </Card>
                  )) : (
                    <div className="col-span-2 text-center py-6 text-muted-foreground">
                      <p>No workout categories available.</p>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}