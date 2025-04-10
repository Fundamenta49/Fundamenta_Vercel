import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Info, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { useQuery } from '@tanstack/react-query';

// Define Exercise interface with added fields to match ExerciseDetails in active-you-enhanced
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
  category?: string;
  benefits?: string[];
  tips?: string[];
}

// Define the specific exercises to show for each category
const HIIT_EXERCISE_SETS = {
  tabata: [
    { name: "Jump Squats", keyword: "jump squat", muscle: "legs" },
    { name: "Mountain Climbers", keyword: "mountain climber", muscle: "core" },
    { name: "Burpees", keyword: "burpee", muscle: "full body" },
    { name: "Push-ups", keyword: "push up", muscle: "chest" },
    { name: "High Knees", keyword: "high knee", muscle: "legs" },
    { name: "Plank Jacks", keyword: "plank jack", muscle: "core" }
  ],
  amrap: [
    { name: "Kettlebell Swings", keyword: "kettlebell swing", muscle: "full body" },
    { name: "Box Jumps", keyword: "box jump", muscle: "legs" },
    { name: "Battle Ropes", keyword: "battle rope", muscle: "arms" },
    { name: "Dumbbell Thrusters", keyword: "thruster", muscle: "shoulders" },
    { name: "Wall Balls", keyword: "wall ball", muscle: "full body" },
    { name: "Toes to Bar", keyword: "toes to bar", muscle: "core" }
  ],
  emom: [
    { name: "Deadlifts", keyword: "deadlift", muscle: "back" },
    { name: "Rowing", keyword: "row machine", muscle: "back" },
    { name: "Pull-ups", keyword: "pull up", muscle: "back" },
    { name: "Air Bike", keyword: "air bike", muscle: "full body" },
    { name: "Double Unders", keyword: "double under", muscle: "legs" },
    { name: "Shoulder Press", keyword: "shoulder press", muscle: "shoulders" }
  ],
  circuit: [
    { name: "Bodyweight Squats", keyword: "bodyweight squat", muscle: "legs" },
    { name: "Jumping Jacks", keyword: "jumping jack", muscle: "full body" },
    { name: "Alternating Lunges", keyword: "alternating lunge", muscle: "legs" },
    { name: "Tricep Dips", keyword: "tricep dip", muscle: "arms" },
    { name: "Plank Hold", keyword: "plank", muscle: "core" },
    { name: "Russian Twists", keyword: "russian twist", muscle: "core" }
  ]
};

interface HIITSpecificExercisesProps {
  category: 'tabata' | 'amrap' | 'emom' | 'circuit';
  title: string;
  description?: string;
  backgroundColor?: string;
  maxExercises?: number;
  onShowExerciseDetail?: (exercise: Exercise) => void;
}

export default function HIITSpecificExercises({
  category,
  title,
  description,
  backgroundColor = "bg-red-50",
  maxExercises = 4,
  onShowExerciseDetail
}: HIITSpecificExercisesProps) {
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const exercises = HIIT_EXERCISE_SETS[category];
  
  // Function to search for each exercise
  const searchExercise = async (exercise: { name: string, keyword: string, muscle: string }) => {
    try {
      const params = new URLSearchParams();
      params.append('keyword', exercise.keyword);
      params.append('muscleGroup', exercise.muscle);
      params.append('limit', '2'); // Just get a couple of matches
      
      const response = await fetch(`/api/fitness/exercises?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch exercises for ${exercise.name}`);
      }
      
      const data = await response.json();
      if (data.success && data.exercises && data.exercises.length > 0) {
        // Return the first matching exercise with additional properties
        const exerciseData = data.exercises[0];
        
        // Add category, benefits and tips fields to match ExerciseDetails interface
        return {
          ...exerciseData,
          category: 'hiit',
          benefits: [
            "Maximizes calorie burn in minimal time",
            "Improves cardiovascular health",
            "Increases metabolic rate after workout (afterburn effect)",
            "Builds muscular endurance and power"
          ],
          tips: [
            "Focus on intensity during work intervals",
            "Take full advantage of rest periods",
            "Modify exercises to match your fitness level",
            "Form is more important than speed"
          ]
        };
      }
      return null;
    } catch (error) {
      console.error(`Error fetching ${exercise.name}:`, error);
      return null;
    }
  };
  
  // Use react-query to fetch data for each exercise
  const exerciseQueries = exercises.slice(0, maxExercises).map((exercise) => {
    return useQuery({
      queryKey: ['/api/fitness/exercises', exercise.keyword, exercise.muscle],
      queryFn: () => searchExercise(exercise),
      staleTime: Infinity, // Cache data indefinitely
    });
  });
  
  // Check if all queries are successfully completed
  const isLoading = exerciseQueries.some(query => query.isLoading);
  const isError = exerciseQueries.some(query => query.isError);
  
  return (
    <div className={`border rounded-lg p-4 ${backgroundColor}`}>
      <h5 className="font-medium mb-3">{title}</h5>
      {description && <p className="text-gray-700 mb-4 text-sm">{description}</p>}
      
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: maxExercises }).map((_, i) => (
            <Card key={`skeleton-${i}`} className="overflow-hidden">
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <div className="flex items-center text-red-500 p-3 border border-red-200 rounded-md">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p className="text-sm">Failed to load exercises. Please try again later.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {exerciseQueries.map((query, index) => {
            const exercise = query.data;
            const isExpanded = expandedExercise === exercises[index].name;
            
            if (!exercise) return null;
            
            return (
              <Card key={exercises[index].name} className="overflow-hidden">
                <CardContent className="p-4">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setExpandedExercise(isExpanded ? null : exercises[index].name)}
                  >
                    <div className="flex-1">
                      <h6 className="font-medium text-base">{exercises[index].name}</h6>
                      <p className="text-gray-600 text-sm truncate">
                        {exercise.description?.slice(0, 80)}...
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedExercise(isExpanded ? null : exercises[index].name);
                      }}
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </Button>
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t">
                      {exercise.imageUrl && (
                        <div className="mb-3 overflow-hidden rounded-md">
                          <img 
                            src={exercise.imageUrl} 
                            alt={exercise.name} 
                            className="w-full object-cover h-40"
                          />
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">{exercise.description}</p>
                        
                        <div className="space-y-1">
                          <h6 className="text-sm font-medium">Instructions:</h6>
                          <ol className="text-sm text-gray-600 pl-5 list-decimal space-y-1">
                            {exercise.instructions.slice(0, 3).map((instruction: string, i: number) => (
                              <li key={i}>{instruction}</li>
                            ))}
                            {exercise.instructions.length > 3 && (
                              <li>
                                <Button 
                                  variant="link" 
                                  size="sm" 
                                  className="p-0 h-auto text-blue-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onShowExerciseDetail) {
                                      onShowExerciseDetail(exercise);
                                    }
                                  }}
                                >
                                  View complete instructions <ArrowRight className="h-3 w-3 ml-1" />
                                </Button>
                              </li>
                            )}
                          </ol>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onShowExerciseDetail) {
                                onShowExerciseDetail(exercise);
                              }
                            }}
                          >
                            <Info className="h-3 w-3 mr-1" /> More Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}