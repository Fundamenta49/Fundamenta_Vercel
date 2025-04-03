import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import MeditationGuide from "./meditation-guide";
import FitnessProgress from "./fitness-progress";
import RunningTracker from "./running-tracker";
import {
  Dumbbell,
  Bird as YogaIcon,
  Timer,
  Wind,
  Flame,
  Activity,
  Waypoints,
} from "lucide-react";

// Custom Stretch icon component
export function StretchingIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 4a2 2 0 1 1-2.5 2 2 2 0 0 0-2.5 2c0 .5.17 1 .5 1.5a3 3 0 0 1 0 4 3 3 0 0 0 0 4c.33.5.5 1 .5 1.5a2 2 0 0 0 2.5 2 2 2 0 1 1 2.5 2" />
      <path d="M4 18a2 2 0 1 1 2.5-2 2 2 0 0 0 2.5-2c0-.5-.17-1-.5-1.5a3 3 0 0 1 0-4 3 3 0 0 0 0-4C8.17 4 8 3.5 8 3a2 2 0 0 0-2.5-2A2 2 0 1 1 3 3" />
    </svg>
  );
}

type TabType = "meditation" | "weightlifting" | "yoga" | "running" | "hiit" | "plyometrics" | "stretch" | "calisthenics";

// Wellness green from design system
const WELLNESS_COLOR = "#10b981";

interface ActiveYouProps {
  defaultTab: TabType;
}

export default function ActiveYou({ defaultTab }: ActiveYouProps) {
  // Simplified implementation that follows the design system but without full-screen dialogs
  // The parent component should handle the dialog wrapping

  switch (defaultTab) {
    case "meditation":
      return <MeditationGuide />;
      
    case "weightlifting":
      return (
        <div className="space-y-4">
          <div className="pb-4 mb-4 border-b" style={{ borderColor: WELLNESS_COLOR }}>
            <div className="flex items-center">
              <Dumbbell className="h-6 w-6 mr-2" style={{ color: WELLNESS_COLOR }} />
              <h2 className="text-xl font-bold" style={{ color: WELLNESS_COLOR }}>
                AI Weight Lifting Guide
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Get personalized workout plans and form guidance
            </p>
          </div>
          <FitnessProgress />
        </div>
      );
      
    case "yoga":
      return (
        <div className="space-y-4">
          <div className="pb-4 mb-4 border-b" style={{ borderColor: WELLNESS_COLOR }}>
            <div className="flex items-center">
              <YogaIcon className="h-6 w-6 mr-2" style={{ color: WELLNESS_COLOR }} />
              <h2 className="text-xl font-bold" style={{ color: WELLNESS_COLOR }}>
                Yoga Sessions
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Follow guided yoga sessions with AI assistance
            </p>
          </div>
          <FitnessProgress />
        </div>
      );
      
    case "running":
      return (
        <div className="space-y-4">
          <div className="pb-4 mb-4 border-b" style={{ borderColor: WELLNESS_COLOR }}>
            <div className="flex items-center">
              <Timer className="h-6 w-6 mr-2" style={{ color: WELLNESS_COLOR }} />
              <h2 className="text-xl font-bold" style={{ color: WELLNESS_COLOR }}>
                Running Tracker
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Track your runs, set goals, and improve your performance
            </p>
          </div>
          <RunningTracker />
        </div>
      );
      
    case "hiit":
      return (
        <div className="space-y-4">
          <div className="pb-4 mb-4 border-b" style={{ borderColor: WELLNESS_COLOR }}>
            <div className="flex items-center">
              <Flame className="h-6 w-6 mr-2" style={{ color: WELLNESS_COLOR }} />
              <h2 className="text-xl font-bold" style={{ color: WELLNESS_COLOR }}>
                HIIT Workouts
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              High-Intensity Interval Training for maximum results
            </p>
          </div>
          <Card className="overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle>High-Intensity Interval Training</CardTitle>
              <CardDescription>
                Burn calories and build endurance with these intense workouts
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-blue-800 flex flex-col space-y-2">
                  <p className="font-medium">What is HIIT?</p>
                  <p>HIIT alternates between short, intense bursts of exercise and less-intense recovery periods, keeping your heart rate up to burn more fat in less time.</p>
                </AlertDescription>
              </Alert>
              
              <div className="grid gap-4 mt-4">
                <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="font-medium text-lg mb-1">Tabata Protocol</div>
                  <p className="text-sm text-muted-foreground mb-2">20 seconds work, 10 seconds rest for 8 rounds (4 minutes total)</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-wellness-600 font-medium">Suggested exercises:</span>
                    <span>Burpees, High Knees, Mountain Climbers, Jump Squats</span>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="font-medium text-lg mb-1">30-30 Intervals</div>
                  <p className="text-sm text-muted-foreground mb-2">30 seconds work, 30 seconds rest for 10-20 minutes</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-wellness-600 font-medium">Suggested exercises:</span>
                    <span>Kettlebell Swings, Battle Ropes, Box Jumps, Sprints</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <FitnessProgress />
        </div>
      );
    
    case "plyometrics":
      return (
        <div className="space-y-4">
          <div className="pb-4 mb-4 border-b" style={{ borderColor: WELLNESS_COLOR }}>
            <div className="flex items-center">
              <Activity className="h-6 w-6 mr-2" style={{ color: WELLNESS_COLOR }} />
              <h2 className="text-xl font-bold" style={{ color: WELLNESS_COLOR }}>
                Plyometrics
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Explosive movement training to build power and athleticism
            </p>
          </div>
          <Card className="overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle>Plyometric Training</CardTitle>
              <CardDescription>
                Use explosive movements to increase power, speed, and athletic performance
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <Alert className="bg-amber-50 border-amber-200">
                <AlertDescription className="text-amber-800 flex flex-col space-y-2">
                  <p className="font-medium">Safety First</p>
                  <p>Plyometric training involves high-impact exercises. Ensure proper form, use appropriate footwear, and land softly with bent knees.</p>
                </AlertDescription>
              </Alert>
              
              <div className="grid gap-4 mt-4">
                <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="font-medium text-lg mb-1">Lower Body Power</div>
                  <p className="text-sm text-muted-foreground mb-2">3 sets of 8-12 reps with full recovery between sets</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-wellness-600 font-medium">Exercises:</span>
                    <span>Box Jumps, Broad Jumps, Jump Squats, Lateral Bounds</span>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="font-medium text-lg mb-1">Upper Body Power</div>
                  <p className="text-sm text-muted-foreground mb-2">3 sets of 6-10 reps with full recovery between sets</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-wellness-600 font-medium">Exercises:</span>
                    <span>Plyo Push-ups, Medicine Ball Chest Passes, Clap Push-ups</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <FitnessProgress />
        </div>
      );
      
    case "stretch":
      return (
        <div className="space-y-4">
          <div className="pb-4 mb-4 border-b" style={{ borderColor: WELLNESS_COLOR }}>
            <div className="flex items-center">
              <StretchingIcon className="h-6 w-6 mr-2" style={{ color: WELLNESS_COLOR }} />
              <h2 className="text-xl font-bold" style={{ color: WELLNESS_COLOR }}>
                Stretch Zone
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Improve flexibility and recovery with guided stretching routines
            </p>
          </div>
          <Card className="overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle>Stretching Routines</CardTitle>
              <CardDescription>
                Enhance your flexibility, mobility, and recovery with targeted stretching
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid gap-4 mt-2">
                <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="font-medium text-lg mb-1">Dynamic Warm-Up Routine</div>
                  <p className="text-sm text-muted-foreground mb-2">Perform before workouts to prepare muscles and joints</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-wellness-600 font-medium">Duration:</span>
                    <span>5-10 minutes</span>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="font-medium text-lg mb-1">Full Body Flexibility</div>
                  <p className="text-sm text-muted-foreground mb-2">Hold each stretch for 30 seconds, 2-3 rounds</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-wellness-600 font-medium">Target areas:</span>
                    <span>Hamstrings, Hip Flexors, Shoulders, Lower Back</span>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="font-medium text-lg mb-1">Recovery Session</div>
                  <p className="text-sm text-muted-foreground mb-2">Gentle stretches to aid muscle recovery after workouts</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-wellness-600 font-medium">Duration:</span>
                    <span>15-20 minutes</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <FitnessProgress />
        </div>
      );
      
    case "calisthenics":
      return (
        <div className="space-y-4">
          <div className="pb-4 mb-4 border-b" style={{ borderColor: WELLNESS_COLOR }}>
            <div className="flex items-center">
              <Waypoints className="h-6 w-6 mr-2" style={{ color: WELLNESS_COLOR }} />
              <h2 className="text-xl font-bold" style={{ color: WELLNESS_COLOR }}>
                Calisthenics
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Bodyweight exercises for strength, flexibility, and skill development
            </p>
          </div>
          <Card className="overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle>Calisthenics Fundamentals</CardTitle>
              <CardDescription>
                Novice-level bodyweight exercises to build foundational strength
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800 flex flex-col space-y-2">
                  <p className="font-medium">Perfect Form First</p>
                  <p>Focus on mastering the basics with perfect form before progressing to more advanced movements.</p>
                </AlertDescription>
              </Alert>
              
              <div className="grid gap-4 mt-4">
                <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="font-medium text-lg mb-1">Upper Body Basics</div>
                  <p className="text-sm text-muted-foreground mb-2">3 sets of 8-12 reps with 60-90 seconds rest</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-wellness-600 font-medium">Exercises:</span>
                    <span>Push-ups, Inverted Rows, Dips, Scapular Pull-ups</span>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="font-medium text-lg mb-1">Core Strength</div>
                  <p className="text-sm text-muted-foreground mb-2">3 sets of 30-60 seconds with 45 seconds rest</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-wellness-600 font-medium">Exercises:</span>
                    <span>Planks, Hollow Body Hold, Mountain Climbers, Leg Raises</span>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="font-medium text-lg mb-1">Lower Body Development</div>
                  <p className="text-sm text-muted-foreground mb-2">3 sets of 12-15 reps with 60 seconds rest</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-wellness-600 font-medium">Exercises:</span>
                    <span>Bodyweight Squats, Lunges, Glute Bridges, Calf Raises</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <FitnessProgress />
        </div>
      );
      
    default:
      return null;
  }
}