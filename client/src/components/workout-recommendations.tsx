import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Dumbbell, Clock, Zap, Calendar } from "lucide-react";
import { ExerciseType } from '@/modules/active-you/context/module-context';
import { useActivityProfile } from "@/contexts/activity-profile-context";
import { getRecommendedWorkouts, Workout, generateWorkout } from "@/lib/workout-generation-service";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface WorkoutRecommendationsProps {
  activityType: ExerciseType;
  onStartWorkout?: (workout: Workout) => void;
}

const WorkoutRecommendations: React.FC<WorkoutRecommendationsProps> = ({ 
  activityType,
  onStartWorkout 
}) => {
  const { getProfileByType, fitnessProfile, isProfileComplete } = useActivityProfile();
  const [recommendations, setRecommendations] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const { toast } = useToast();
  
  // Activity-specific color mapping
  const colors: Record<string, string> = {
    'yoga': 'purple',
    'running': 'green',
    'weightlifting': 'pink',
    'hiit': 'orange',
    'stretch': 'blue',
    'meditation': 'indigo',
    'activeyou': 'sky'
  };
  
  const color = colors[activityType] || 'slate';
  
  // Get recommendations when component loads
  useEffect(() => {
    loadRecommendations();
  }, [activityType]);
  
  // Function to load workout recommendations
  const loadRecommendations = async () => {
    // Only load if profile is complete
    if (!isProfileComplete(activityType)) {
      return;
    }
    
    setLoading(true);
    try {
      const activityProfile = getProfileByType(activityType);
      if (!activityProfile) {
        return;
      }
      
      const workouts = await getRecommendedWorkouts(
        activityType,
        activityProfile,
        fitnessProfile || null,
        3 // Get 3 recommendations
      );
      
      setRecommendations(workouts);
    } catch (error) {
      console.error('Error loading workout recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to load workout recommendations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Function to generate a personalized workout
  const handleGenerateWorkout = async () => {
    setGenerateLoading(true);
    try {
      const activityProfile = getProfileByType(activityType);
      if (!activityProfile) {
        toast({
          title: "Profile Required",
          description: "Please complete your profile first",
          variant: "destructive",
        });
        return;
      }
      
      const response = await generateWorkout({
        activityType,
        activityProfile,
        fitnessProfile: fitnessProfile || undefined,
      });
      
      if (response.success && response.workout) {
        toast({
          title: "Workout Generated",
          description: "Your personalized workout is ready!",
        });
        
        // Add to recommendations at the beginning
        setRecommendations(prev => [response.workout as Workout, ...prev.slice(0, 2)]);
      } else {
        toast({
          title: "Generation Failed",
          description: response.message || "Failed to generate workout",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error generating workout:', error);
      toast({
        title: "Error",
        description: "Failed to generate your personalized workout",
        variant: "destructive",
      });
    } finally {
      setGenerateLoading(false);
    }
  };
  
  // Function to start a workout
  const handleStartWorkout = (workout: Workout) => {
    if (onStartWorkout) {
      onStartWorkout(workout);
    }
  };
  
  // Don't render if profile isn't complete
  if (!isProfileComplete(activityType)) {
    return null;
  }
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-semibold text-${color}-800`}>
          Recommended Workouts
        </h2>
        <Button 
          onClick={handleGenerateWorkout} 
          className={`bg-${color}-600 hover:bg-${color}-700`}
          disabled={generateLoading}
        >
          {generateLoading ? "Generating..." : "Generate Workout"}
          <Zap className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      {loading ? (
        // Loading state
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="shadow">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="flex justify-between mt-4">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        // No recommendations state
        <Card className={`bg-${color}-50 border-${color}-100`}>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-center text-gray-600 mb-4">
              No workout recommendations available yet.
            </p>
            <Button 
              onClick={handleGenerateWorkout} 
              className={`bg-${color}-600 hover:bg-${color}-700`}
              disabled={generateLoading}
            >
              {generateLoading ? "Generating..." : "Generate Your First Workout"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ) : (
        // Recommendations state
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((workout, index) => (
            <Card key={workout.id || index} className={`shadow border-${color}-100 hover:shadow-md transition-shadow`}>
              <CardHeader className={`pb-2 border-b border-${color}-100`}>
                <CardTitle className="text-lg">{workout.title}</CardTitle>
                <CardDescription>
                  {workout.tags.map(tag => (
                    <span key={tag} className={`inline-block text-xs mr-2 mb-1 px-2 py-0.5 rounded-full bg-${color}-100 text-${color}-800`}>
                      {tag}
                    </span>
                  ))}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-gray-600 mb-4">
                  {workout.description}
                </p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex items-center">
                    <Clock className={`h-4 w-4 mr-1 text-${color}-500`} />
                    <span className="text-sm">{workout.duration} min</span>
                  </div>
                  <div className="flex items-center">
                    <Dumbbell className={`h-4 w-4 mr-1 text-${color}-500`} />
                    <span className="text-sm capitalize">{workout.difficultyLevel}</span>
                  </div>
                </div>
                {/* Equipment needed */}
                {workout.equipmentNeeded && workout.equipmentNeeded.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs font-medium">Equipment:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {workout.equipmentNeeded.map((item, i) => (
                        <span key={i} className="text-xs px-1.5 py-0.5 bg-gray-100 rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className={`pt-2 border-t border-${color}-100`}>
                <Button 
                  className="w-full" 
                  variant="default"
                  onClick={() => handleStartWorkout(workout)}
                >
                  Start Workout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutRecommendations;