import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import MeditationGuide from "./meditation-guide";
import {
  Dumbbell,
  Bird as YogaIcon,
  Timer as RunningIcon,
  Brain,
  CalendarDays,
  Timer,
  TrendingUp,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  notes?: string;
}

interface WorkoutSession {
  date: string;
  type: "weightlifting" | "yoga" | "running";
  exercises: Exercise[];
  duration: number;
}

interface ActiveYouProps {
  defaultTab: "meditation" | "weightlifting" | "yoga" | "running";
}

export default function ActiveYou({ defaultTab }: ActiveYouProps) {
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState<Exercise[]>([]);
  const [runningStats, setRunningStats] = useState({
    distance: 0,
    duration: 0,
    pace: 0,
  });

  if (defaultTab === "meditation") {
    return <MeditationGuide />;
  }

  if (defaultTab === "weightlifting") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            AI Weight Lifting Guide
          </CardTitle>
          <CardDescription>
            Get personalized workout plans and form guidance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Weight lifting guide content - to be implemented */}
          <Alert>
            <AlertDescription>
              Coming soon: AI-powered workout planning and form analysis
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (defaultTab === "yoga") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <YogaIcon className="h-5 w-5 text-primary" />
            Yoga Buddy
          </CardTitle>
          <CardDescription>
            Interactive yoga sessions with AI guidance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Yoga guide content - to be implemented */}
          <Alert>
            <AlertDescription>
              Coming soon: AI-guided yoga flows and pose corrections
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (defaultTab === "running") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RunningIcon className="h-5 w-5 text-primary" />
            Running Tracker
          </CardTitle>
          <CardDescription>
            Track your runs and get AI-powered insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  Duration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {runningStats.duration} mins
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Distance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {runningStats.distance} km
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Pace
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {runningStats.pace} min/km
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <AlertDescription>
              Coming soon: AI running coach and detailed analytics
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return null;
}