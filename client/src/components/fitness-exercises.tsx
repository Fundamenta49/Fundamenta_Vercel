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
import { Label } from "@/components/ui/label";
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
  
  // Workout builder state
  const [workoutPlan, setWorkoutPlan] = useState<{
    name: string;
    exercises: Array<{
      exerciseId: string;
      name: string;
      sets: number;
      reps: number;
      restTime: number;
    }>;
  }>({
    name: 'My Custom Workout',
    exercises: []
  });
  const [savedWorkouts, setSavedWorkouts] = useState<Array<{
    id: string;
    name: string;
    exercises: Array<{
      exerciseId: string;
      name: string;
      sets: number;
      reps: number;
      restTime: number;
    }>;
  }>>([]);
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

  // Function to add exercise to workout plan
  const addToWorkout = (exercise: Exercise) => {
    const exerciseEntry = {
      exerciseId: exercise.id,
      name: exercise.name,
      sets: 3,
      reps: 10,
      restTime: 60,
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
  
  // Function to save current workout
  const saveWorkout = () => {
    if (workoutPlan.exercises.length === 0) {
      return; // Don't save empty workouts
    }
    
    const newWorkout = {
      id: `workout-${Date.now()}`,
      name: workoutPlan.name,
      exercises: [...workoutPlan.exercises]
    };
    
    setSavedWorkouts([...savedWorkouts, newWorkout]);
    
    // Reset current workout
    setWorkoutPlan({
      name: 'My Custom Workout',
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
  const loadWorkout = (workout: any) => {
    setWorkoutPlan({
      name: workout.name,
      exercises: [...workout.exercises]
    });
    setShowWorkoutBuilder(true);
  };
  
  // Function to load YouTube videos for an exercise
  const loadExerciseVideos = async (exerciseId: string, exerciseName: string, equipment: string[]) => {
    // Don't reload if we already have videos
    if (exerciseVideos[exerciseId]?.length > 0) {
      return;
    }
    
    setLoadingVideos({...loadingVideos, [exerciseId]: true});
    
    try {
      // Use the equipment if specified, otherwise don't include it
      const equipmentStr = equipment.length > 0 ? equipment[0] : undefined;
      const videos = await searchExerciseVideos(exerciseName, equipmentStr);
      
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
                        onClick={() => loadExerciseVideos(exercise.id, exercise.name, exercise.equipment)}
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
                    <div className="py-4 flex justify-center text-muted-foreground text-sm">
                      Click "Load Videos" to see tutorial videos for this exercise
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
          {/* Workout Builder */}
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
                Add exercises to your workout plan and customize sets and reps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadWorkout(workout)}
                        >
                          <Activity className="h-4 w-4 mr-1" />
                          Load Workout
                        </Button>
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