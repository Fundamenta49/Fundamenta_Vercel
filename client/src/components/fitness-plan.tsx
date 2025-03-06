import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Award, Star, Trophy, Play } from "lucide-react";
import { FitnessProfile } from "./fitness-profile";
import { useToast } from "@/hooks/use-toast";

interface Achievement {
  id: string;
  title: string;
  description: string;
  isUnlocked: boolean;
  icon: "star" | "trophy" | "award";
}

interface WorkoutPlan {
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    description: string;
    videoId?: string;
  }>;
  schedule: string;
  tips: string[];
}

interface FitnessPlanProps {
  profile: FitnessProfile;
}

export default function FitnessPlan({ profile }: FitnessPlanProps) {
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize achievements based on profile goals
    const baseAchievements: Achievement[] = [
      {
        id: "profile-created",
        title: "Getting Started",
        description: "Created your fitness profile",
        isUnlocked: true,
        icon: "star"
      }
    ];

    profile.goals.forEach(goal => {
      baseAchievements.push({
        id: `goal-${goal.toLowerCase().replace(/\s+/g, '-')}`,
        title: `${goal} Champion`,
        description: `Make progress in your ${goal.toLowerCase()} journey`,
        isUnlocked: false,
        icon: "trophy"
      });
    });

    setAchievements(baseAchievements);
    generateWorkoutPlan();
  }, [profile]);

  const getIconComponent = (iconName: Achievement["icon"]) => {
    switch (iconName) {
      case "star":
        return <Star className="h-5 w-5" />;
      case "trophy":
        return <Trophy className="h-5 w-5" />;
      case "award":
        return <Award className="h-5 w-5" />;
    }
  };

  const generateWorkoutPlan = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: {
            fitnessLevel: profile.fitnessLevel,
            goals: profile.goals,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate workout plan');
      }

      const plan = await response.json();
      setWorkoutPlan(plan);

      toast({
        title: "Workout Plan Generated!",
        description: "Your personalized fitness plan is ready.",
      });
    } catch (error) {
      console.error('Error generating workout plan:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate workout plan. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Fitness Journey</CardTitle>
          <CardDescription>
            Track your progress and earn achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Weekly Progress</h3>
              <Progress value={weeklyProgress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                {weeklyProgress}% of weekly goals completed
              </p>
            </div>

            {workoutPlan && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Your Personalized Workout Plan</h3>
                <div className="grid gap-4">
                  {workoutPlan.exercises.map((exercise, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{exercise.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {exercise.sets} sets × {exercise.reps} reps
                          </p>
                          <p className="text-sm mt-1">{exercise.description}</p>
                        </div>
                        {exercise.videoId && (
                          <a
                            href={`https://www.youtube.com/watch?v=${exercise.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-primary hover:text-primary/80"
                          >
                            <Play className="h-5 w-5 mr-1" />
                            Watch Tutorial
                          </a>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Training Tips:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {workoutPlan.tips.map((tip, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-2">Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border ${
                      achievement.isUnlocked
                        ? "bg-primary/10 border-primary"
                        : "bg-muted/50 border-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {getIconComponent(achievement.icon)}
                      <div>
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}