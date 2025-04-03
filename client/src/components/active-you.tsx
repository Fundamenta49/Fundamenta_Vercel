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
import FitnessExercises from "./fitness-exercises";
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

type TabType = "meditation" | "weightlifting" | "yoga" | "running" | "hiit" | "stretch";

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
          <Card className="overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle>Weight Training</CardTitle>
              <CardDescription>
                Build strength, muscle, and power with these weightlifting routines
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Alert className="bg-blue-50 border-blue-200 mb-4">
                <AlertDescription className="text-blue-800">
                  Find exercises that match your equipment and experience level
                </AlertDescription>
              </Alert>
              
              <div className="mb-6">
                <h3 className="font-medium text-lg my-3">Sample Routine</h3>
                <div className="grid gap-4">
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="font-medium text-lg mb-1">Full Body Strength</div>
                    <p className="text-sm text-muted-foreground mb-2">Target all major muscle groups with compound movements</p>
                    <div className="text-sm space-y-2">
                      <div><span className="font-medium">1.</span> Barbell Squat: 3 sets of 8-10 reps</div>
                      <div><span className="font-medium">2.</span> Deadlift: 3 sets of 6-8 reps</div>
                      <div><span className="font-medium">3.</span> Bench Press: 3 sets of 8-10 reps</div>
                      <div><span className="font-medium">4.</span> Bent-over Rows: 3 sets of 10-12 reps</div>
                      <div><span className="font-medium">5.</span> Overhead Press: 3 sets of 8-10 reps</div>
                      <div><span className="font-medium">6.</span> Bicep Curls: 3 sets of 12-15 reps</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <FitnessExercises 
                muscleFilter="strength" 
                equipmentFilter="barbell" 
                difficultyFilter="intermediate"
                categoryFilter="weightlifting" 
                keywordFilter="press"
                showFilters={false}
                compactView={true}
                maxExercises={4}
              />
            </CardContent>
          </Card>
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
          <Card className="overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle>Yoga Practices</CardTitle>
              <CardDescription>
                Improve flexibility, balance, and mindfulness with these yoga poses
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <Alert className="bg-blue-50 border-blue-200 mb-4">
                <AlertDescription className="text-blue-800">
                  Find yoga poses suitable for your experience level
                </AlertDescription>
              </Alert>
              
              <div className="mb-6">
                <h3 className="font-medium text-lg my-3">Sample Routine</h3>
                <div className="grid gap-4">
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="font-medium text-lg mb-1">Beginner Yoga Flow</div>
                    <p className="text-sm text-muted-foreground mb-2">Hold each pose for 30-60 seconds, focusing on breath and form</p>
                    <div className="text-sm space-y-2">
                      <div><span className="font-medium">1.</span> Downward Dog: Opens shoulders and stretches hamstrings</div>
                      <div><span className="font-medium">2.</span> Child's Pose: Relaxes the spine and shoulders</div>
                      <div><span className="font-medium">3.</span> Cobra Pose: Strengthens the spine and opens the chest</div>
                      <div><span className="font-medium">4.</span> Seated Forward Bend: Stretches lower back and hamstrings</div>
                      <div><span className="font-medium">5.</span> Cat-Cow Stretch: Improves spinal flexibility</div>
                      <div><span className="font-medium">6.</span> Lying Spinal Twist: Releases tension in the back</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <FitnessExercises 
                muscleFilter="flexibility" 
                equipmentFilter="body weight" 
                difficultyFilter="beginner"
                categoryFilter="yoga"
                keywordFilter="stretch"
                showFilters={false} 
                compactView={true}
                maxExercises={4}
              />
            </CardContent>
          </Card>
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
          <Card className="overflow-hidden mt-4">
            <CardHeader className="pb-0">
              <CardTitle>Running Support Exercises</CardTitle>
              <CardDescription>
                Strengthen key muscle groups to improve running performance and prevent injuries
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <Alert className="bg-blue-50 border-blue-200 mb-4">
                <AlertDescription className="text-blue-800">
                  Exercises to enhance running performance and prevent common injuries
                </AlertDescription>
              </Alert>
              
              <div className="mb-6">
                <h3 className="font-medium text-lg my-3">Runner's Strength Routine</h3>
                <div className="grid gap-4">
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="font-medium text-lg mb-1">Lower Body Support</div>
                    <p className="text-sm text-muted-foreground mb-2">Perform 2-3 times per week to support running performance</p>
                    <div className="text-sm space-y-2">
                      <div><span className="font-medium">1.</span> Lunges: Strengthens quadriceps and glutes</div>
                      <div><span className="font-medium">2.</span> Calf Raises: Targets calf muscles for push-off power</div>
                      <div><span className="font-medium">3.</span> Hamstring Curls: Focuses on hamstrings for injury prevention</div>
                      <div><span className="font-medium">4.</span> Planks: Strengthens core for better running posture</div>
                      <div><span className="font-medium">5.</span> Leg Swings: Enhances hip flexibility for stride length</div>
                      <div><span className="font-medium">6.</span> Ankle Circles: Improves ankle mobility for varied terrain</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <FitnessExercises 
                muscleFilter="legs" 
                equipmentFilter="body weight"
                difficultyFilter="beginner"
                keywordFilter="lunge"
                showFilters={false}
                compactView={true}
                maxExercises={4}
              />
            </CardContent>
          </Card>
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
              
              <div className="mb-6">
                <h3 className="font-medium text-lg my-3">HIIT Protocols</h3>
                <div className="grid gap-4">
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="font-medium text-lg mb-1">Tabata Protocol</div>
                    <p className="text-sm text-muted-foreground mb-2">20 seconds work, 10 seconds rest for 8 rounds (4 minutes total)</p>
                    <div className="text-sm space-y-2">
                      <div><span className="font-medium">Exercise 1:</span> Jump Squats (engages lower body, elevates heart rate)</div>
                      <div><span className="font-medium">Exercise 2:</span> Burpees (full-body exercise for cardiovascular fitness)</div>
                      <div><span className="font-medium">Exercise 3:</span> Mountain Climbers (targets core and legs)</div>
                      <div><span className="font-medium">Exercise 4:</span> Push-ups (strengthens chest and triceps)</div>
                      <div><span className="font-medium">Exercise 5:</span> High Knees (improves cardiovascular endurance)</div>
                      <div><span className="font-medium">Exercise 6:</span> Plank to Shoulder Tap (engages core and shoulders)</div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="font-medium text-lg mb-1">30-30 Intervals</div>
                    <p className="text-sm text-muted-foreground mb-2">30 seconds work, 30 seconds rest for 10-20 minutes</p>
                    <div className="text-sm space-y-2">
                      <div><span className="font-medium">Exercise 1:</span> Kettlebell Swings (builds posterior chain power)</div>
                      <div><span className="font-medium">Exercise 2:</span> Box Jumps (develops explosive leg strength)</div>
                      <div><span className="font-medium">Exercise 3:</span> Battle Ropes (challenges upper body endurance)</div>
                      <div><span className="font-medium">Exercise 4:</span> Sprints (maximizes calorie burn)</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-3">HIIT Exercises</h3>
                <FitnessExercises 
                  muscleFilter="full body" 
                  equipmentFilter="body weight"
                  difficultyFilter="intermediate"
                  categoryFilter="hiit"
                  keywordFilter="jump" 
                  showFilters={false} 
                  compactView={true}
                  maxExercises={4}
                />
              </div>
            </CardContent>
          </Card>
          <FitnessProgress />
        </div>
      );
    
    // Plyometrics section has been removed
      
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
              <Alert className="bg-blue-50 border-blue-200 mb-4">
                <AlertDescription className="text-blue-800">
                  Find stretches to improve mobility and aid recovery
                </AlertDescription>
              </Alert>
              
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-3">Recommended Routines</h3>
                <div className="grid gap-4">
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="font-medium text-lg mb-1">Full Body Flexibility Routine</div>
                    <p className="text-sm text-muted-foreground mb-2">Hold each stretch for 30 seconds, 2-3 rounds</p>
                    <div className="text-sm space-y-2">
                      <div><span className="font-medium">1.</span> Standing Hamstring Stretch: Targets back of legs</div>
                      <div><span className="font-medium">2.</span> Quadriceps Stretch: Focuses on front of thighs</div>
                      <div><span className="font-medium">3.</span> Chest Opener Stretch: Opens chest and shoulders</div>
                      <div><span className="font-medium">4.</span> Seated Spinal Twist: Enhances spinal flexibility</div>
                      <div><span className="font-medium">5.</span> Butterfly Stretch: Targets inner thighs and hips</div>
                      <div><span className="font-medium">6.</span> Triceps Stretch: Stretches back of upper arms</div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="font-medium text-lg mb-1">Dynamic Warm-Up Routine</div>
                    <p className="text-sm text-muted-foreground mb-2">Perform before workouts to prepare muscles and joints</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-wellness-600 font-medium">Duration:</span>
                      <span>5-10 minutes</span>
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
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-3">Exercise Library</h3>
                <FitnessExercises 
                  muscleFilter="flexibility" 
                  equipmentFilter="body weight"
                  categoryFilter="stretching"
                  keywordFilter="stretch"
                  difficultyFilter="beginner"
                  showFilters={false} 
                  compactView={true}
                  maxExercises={4}
                />
              </div>
            </CardContent>
          </Card>
          <FitnessProgress />
        </div>
      );
      
    // Calisthenics section has been removed
      
    default:
      return null;
  }
}