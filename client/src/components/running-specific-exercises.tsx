import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Info, ChevronDown, ChevronUp, Plus, ArrowRight } from "lucide-react";
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
const RUNNING_EXERCISE_SETS = {
  warmUp: [
    { name: "Dynamic Lunges", keyword: "lunge", muscle: "legs" },
    { name: "High Knees", keyword: "high knee", muscle: "legs" },
    { name: "Butt Kicks", keyword: "butt kick", muscle: "legs" },
    { name: "Leg Swings", keyword: "leg swing", muscle: "legs" },
    { name: "Ankle Rotations", keyword: "ankle", muscle: "legs" },
    { name: "Hip Circles", keyword: "hip circle", muscle: "hips" }
  ],
  strength: [
    { name: "Squats", keyword: "squat", muscle: "legs" },
    { name: "Lunges", keyword: "lunge", muscle: "legs" },
    { name: "Calf Raises", keyword: "calf raise", muscle: "legs" },
    { name: "Planks", keyword: "plank", muscle: "core" },
    { name: "Glute Bridges", keyword: "glute bridge", muscle: "legs" },
    { name: "Side Planks", keyword: "side plank", muscle: "core" }
  ],
  plyometric: [
    { name: "Jump Squats", keyword: "jump squat", muscle: "legs" },
    { name: "Burpees", keyword: "burpee", muscle: "full body" },
    { name: "Box Jumps", keyword: "box jump", muscle: "legs" },
    { name: "Lateral Jumps", keyword: "lateral jump", muscle: "legs" },
    { name: "Tuck Jumps", keyword: "tuck jump", muscle: "legs" },
    { name: "Single Leg Bounds", keyword: "bound", muscle: "legs" }
  ],
  coolDown: [
    { name: "Hamstring Stretch", keyword: "hamstring stretch", muscle: "legs" },
    { name: "Quadriceps Stretch", keyword: "quad stretch", muscle: "legs" },
    { name: "Calf Stretch", keyword: "calf stretch", muscle: "legs" },
    { name: "Hip Flexor Stretch", keyword: "hip flexor", muscle: "legs" },
    { name: "Glute Stretch", keyword: "glute stretch", muscle: "legs" },
    { name: "Lower Back Stretch", keyword: "back stretch", muscle: "back" }
  ]
};

interface RunningSpecificExercisesProps {
  category: 'warmUp' | 'strength' | 'plyometric' | 'coolDown';
  title: string;
  description?: string;
  backgroundColor?: string;
  maxExercises?: number;
  onShowExerciseDetail?: (exercise: Exercise) => void;
}

export default function RunningSpecificExercises({
  category,
  title,
  description,
  backgroundColor = "bg-blue-50",
  maxExercises = 5,
  onShowExerciseDetail
}: RunningSpecificExercisesProps) {
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const exercises = RUNNING_EXERCISE_SETS[category];
  
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
          category: category,
          benefits: [
            "Improves running performance",
            "Strengthens muscles used in running",
            "Enhances overall running efficiency",
            "Helps prevent common running injuries"
          ],
          tips: [
            "Focus on proper form rather than speed",
            "Breathe rhythmically throughout the exercise",
            "Start with lower intensity and gradually increase",
            "Perform regularly for best results"
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