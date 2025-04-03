import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Info, Dumbbell, Activity, AlertCircle } from "lucide-react";

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
    
    return displayExercises.map((exercise: Exercise) => (
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
          {!compactView && <p className="text-sm">{exercise.description}</p>}
          
          {!compactView && exercise.instructions.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-medium mb-1">Instructions:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {exercise.instructions.map((instruction, idx) => (
                  <li key={idx} className="text-sm">{instruction}</li>
                ))}
              </ul>
            </div>
          )}
          
          {exercise.imageUrl && !compactView && (
            <div className="mt-3 flex justify-center">
              <img 
                src={exercise.imageUrl} 
                alt={exercise.name}
                className="rounded-md max-h-60 object-contain"
              />
            </div>
          )}
        </CardContent>
      </Card>
    ));
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
          <div className="grid grid-cols-1 gap-4">
            {categoriesQuery.isPending ? (
              // Loading state for categories
              Array.from({ length: 3 }).map((_, index) => (
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
                  Error loading workout categories. Please try again later.
                </AlertDescription>
              </Alert>
            ) : (
              // Display categories
              categoriesQuery.data?.categories ? categoriesQuery.data.categories.map((category: WorkoutCategory) => (
                <Card key={category.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      {category.name}
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSelectedCategory(category.id);
                        // Further implementation to fetch workout plans would go here
                      }}
                    >
                      View Workouts
                    </Button>
                  </CardContent>
                </Card>
              )) : null
            )}
            
            {categoriesQuery.data?.categories && categoriesQuery.data.categories.length === 0 && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  No workout categories are available at the moment. Please check back later.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}