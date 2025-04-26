import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart3, 
  Calendar, 
  Dumbbell, 
  TrendingUp, 
  Award, 
  Clipboard, 
  CheckSquare, 
  Plus, 
  MoreHorizontal, 
  Timer 
} from "lucide-react";

// Define interfaces for workout tracking
interface Exercise {
  id: string;
  name: string;
  targetMuscles: string[];
  category: string;
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Interface for personal records
interface PersonalRecord {
  exerciseId: string;
  weight: number; // in lbs/kg
  reps: number;
  date: Date;
  notes?: string;
}

interface Set {
  weight: number;
  reps: number;
  completed: boolean;
}

interface WorkoutExercise {
  exercise: Exercise;
  sets: Set[];
  restTime: number; // in seconds
  notes?: string;
}

interface Workout {
  id: string;
  name: string;
  date: Date;
  exercises: WorkoutExercise[];
  completed: boolean;
  duration?: number; // in minutes
  notes?: string;
}

// Sample data for demonstration
const SAMPLE_EXERCISES: Exercise[] = [
  {
    id: 'bench-press',
    name: 'Bench Press',
    targetMuscles: ['chest', 'triceps', 'shoulders'],
    category: 'compound',
    equipment: ['barbell', 'bench'],
    difficulty: 'intermediate'
  },
  {
    id: 'squat',
    name: 'Barbell Squat',
    targetMuscles: ['quads', 'glutes', 'hamstrings', 'core'],
    category: 'compound',
    equipment: ['barbell', 'squat rack'],
    difficulty: 'intermediate'
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    targetMuscles: ['hamstrings', 'glutes', 'lower back', 'traps'],
    category: 'compound',
    equipment: ['barbell'],
    difficulty: 'advanced'
  },
  {
    id: 'shoulder-press',
    name: 'Overhead Press',
    targetMuscles: ['shoulders', 'triceps', 'upper chest'],
    category: 'compound',
    equipment: ['barbell', 'dumbbells'],
    difficulty: 'intermediate'
  },
  {
    id: 'pull-up',
    name: 'Pull-Up',
    targetMuscles: ['lats', 'biceps', 'upper back'],
    category: 'compound',
    equipment: ['pull-up bar'],
    difficulty: 'intermediate'
  },
  {
    id: 'bicep-curl',
    name: 'Bicep Curl',
    targetMuscles: ['biceps', 'forearms'],
    category: 'isolation',
    equipment: ['dumbbells', 'barbell', 'cable'],
    difficulty: 'beginner'
  },
  {
    id: 'tricep-extension',
    name: 'Tricep Extension',
    targetMuscles: ['triceps'],
    category: 'isolation',
    equipment: ['cable', 'dumbbells'],
    difficulty: 'beginner'
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    targetMuscles: ['lats', 'biceps', 'upper back'],
    category: 'compound',
    equipment: ['cable machine'],
    difficulty: 'beginner'
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    targetMuscles: ['quads', 'glutes', 'hamstrings'],
    category: 'compound',
    equipment: ['leg press machine'],
    difficulty: 'beginner'
  },
  {
    id: 'leg-curl',
    name: 'Leg Curl',
    targetMuscles: ['hamstrings'],
    category: 'isolation',
    equipment: ['leg curl machine'],
    difficulty: 'beginner'
  },
  {
    id: 'calf-raise',
    name: 'Calf Raise',
    targetMuscles: ['calves'],
    category: 'isolation',
    equipment: ['smith machine', 'seated calf raise machine', 'leg press'],
    difficulty: 'beginner'
  },
  {
    id: 'plank',
    name: 'Plank',
    targetMuscles: ['core', 'shoulders', 'back'],
    category: 'isometric',
    equipment: ['none'],
    difficulty: 'beginner'
  }
];

// Sample workout templates
const SAMPLE_WORKOUT_TEMPLATES = [
  {
    id: 'push-pull-legs',
    name: 'Push-Pull-Legs Split',
    description: 'A 3-day split focusing on pushing movements, pulling movements, and leg exercises.',
    workouts: [
      {
        id: 'push-day',
        name: 'Push Day',
        exercises: ['bench-press', 'shoulder-press', 'tricep-extension']
      },
      {
        id: 'pull-day',
        name: 'Pull Day',
        exercises: ['deadlift', 'pull-up', 'bicep-curl']
      },
      {
        id: 'leg-day',
        name: 'Leg Day',
        exercises: ['squat', 'leg-press', 'calf-raise']
      }
    ]
  },
  {
    id: 'upper-lower',
    name: 'Upper-Lower Split',
    description: 'A 4-day split alternating between upper body and lower body workouts.',
    workouts: [
      {
        id: 'upper-a',
        name: 'Upper Body A',
        exercises: ['bench-press', 'pull-up', 'shoulder-press']
      },
      {
        id: 'lower-a',
        name: 'Lower Body A',
        exercises: ['squat', 'leg-curl', 'calf-raise']
      },
      {
        id: 'upper-b',
        name: 'Upper Body B',
        exercises: ['shoulder-press', 'lat-pulldown', 'tricep-extension', 'bicep-curl']
      },
      {
        id: 'lower-b',
        name: 'Lower Body B',
        exercises: ['deadlift', 'leg-press', 'plank']
      }
    ]
  },
  {
    id: 'full-body',
    name: 'Full Body Workout',
    description: 'A full body workout targeting all major muscle groups in each session.',
    workouts: [
      {
        id: 'full-body-a',
        name: 'Full Body A',
        exercises: ['squat', 'bench-press', 'lat-pulldown', 'shoulder-press', 'plank']
      },
      {
        id: 'full-body-b',
        name: 'Full Body B',
        exercises: ['deadlift', 'shoulder-press', 'pull-up', 'leg-press', 'bicep-curl']
      }
    ]
  }
];

// Main component
export const WeightliftingSpecificExercisesEnhanced = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('workout');
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  
  // State for the active exercise during a workout
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [activeSetIndex, setActiveSetIndex] = useState(0);
  
  // State for rest timer
  const [restTime, setRestTime] = useState(60); // default 60 seconds
  const [remainingRest, setRemainingRest] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restInterval, setRestInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Sample personal records for demonstration
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([
    {
      exerciseId: 'bench-press',
      weight: 185,
      reps: 5,
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      notes: 'First time hitting 185 for 5'
    },
    {
      exerciseId: 'bench-press',
      weight: 195,
      reps: 3,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      notes: 'New PR, felt strong'
    },
    {
      exerciseId: 'squat',
      weight: 225,
      reps: 5,
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      notes: 'Good form'
    },
    {
      exerciseId: 'squat',
      weight: 245,
      reps: 3,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      notes: 'Depth was good'
    },
    {
      exerciseId: 'deadlift',
      weight: 275,
      reps: 3,
      date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
      notes: 'Lower back felt a bit tight'
    },
    {
      exerciseId: 'deadlift',
      weight: 315,
      reps: 1,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      notes: 'New PR!'
    }
  ]);

  // Sample workout history for demonstration
  const [workoutHistory] = useState<Workout[]>([
    {
      id: 'workout-1',
      name: 'Push Day',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      exercises: [
        {
          exercise: SAMPLE_EXERCISES.find(e => e.id === 'bench-press')!,
          sets: [
            { weight: 135, reps: 10, completed: true },
            { weight: 155, reps: 8, completed: true },
            { weight: 175, reps: 6, completed: true }
          ],
          restTime: 90
        },
        {
          exercise: SAMPLE_EXERCISES.find(e => e.id === 'shoulder-press')!,
          sets: [
            { weight: 95, reps: 8, completed: true },
            { weight: 105, reps: 6, completed: true },
            { weight: 115, reps: 4, completed: true }
          ],
          restTime: 90
        },
        {
          exercise: SAMPLE_EXERCISES.find(e => e.id === 'tricep-extension')!,
          sets: [
            { weight: 50, reps: 12, completed: true },
            { weight: 60, reps: 10, completed: true },
            { weight: 70, reps: 8, completed: true }
          ],
          restTime: 60
        }
      ],
      completed: true,
      duration: 45,
      notes: 'Felt strong today, increased weight on bench press.'
    },
    {
      id: 'workout-2',
      name: 'Pull Day',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      exercises: [
        {
          exercise: SAMPLE_EXERCISES.find(e => e.id === 'deadlift')!,
          sets: [
            { weight: 225, reps: 5, completed: true },
            { weight: 245, reps: 5, completed: true },
            { weight: 265, reps: 3, completed: true }
          ],
          restTime: 120
        },
        {
          exercise: SAMPLE_EXERCISES.find(e => e.id === 'pull-up')!,
          sets: [
            { weight: 0, reps: 8, completed: true },
            { weight: 0, reps: 8, completed: true },
            { weight: 0, reps: 6, completed: true }
          ],
          restTime: 90
        },
        {
          exercise: SAMPLE_EXERCISES.find(e => e.id === 'bicep-curl')!,
          sets: [
            { weight: 30, reps: 12, completed: true },
            { weight: 35, reps: 10, completed: true },
            { weight: 40, reps: 8, completed: true }
          ],
          restTime: 60
        }
      ],
      completed: true,
      duration: 50,
      notes: 'Lower back was a bit tight during deadlifts.'
    }
  ]);
  
  // Start a new workout from a template
  const startWorkout = (templateName: string) => {
    // Find the template
    const template = SAMPLE_WORKOUT_TEMPLATES.find(t => 
      t.workouts.some(w => w.name === templateName)
    );
    
    if (!template) return;
    
    const workoutTemplate = template.workouts.find(w => w.name === templateName);
    
    if (!workoutTemplate) return;
    
    // Create a new workout from the template
    const newWorkout: Workout = {
      id: `workout-${Date.now()}`,
      name: workoutTemplate.name,
      date: new Date(),
      exercises: workoutTemplate.exercises.map(exerciseId => {
        const exercise = SAMPLE_EXERCISES.find(e => e.id === exerciseId);
        
        if (!exercise) return null;
        
        return {
          exercise,
          sets: [
            { weight: 0, reps: 0, completed: false },
            { weight: 0, reps: 0, completed: false },
            { weight: 0, reps: 0, completed: false }
          ],
          restTime: 60
        };
      }).filter(Boolean) as WorkoutExercise[],
      completed: false
    };
    
    setCurrentWorkout(newWorkout);
    setActiveTab('active-workout');
    setActiveExerciseIndex(0);
    setActiveSetIndex(0);
  };
  
  // Start rest timer
  const startRestTimer = (seconds: number) => {
    if (restInterval) {
      clearInterval(restInterval);
    }
    
    setRemainingRest(seconds);
    setIsResting(true);
    
    const interval = setInterval(() => {
      setRemainingRest(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsResting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setRestInterval(interval);
  };
  
  // Cancel rest timer
  const cancelRestTimer = () => {
    if (restInterval) {
      clearInterval(restInterval);
      setRestInterval(null);
    }
    setIsResting(false);
    setRemainingRest(0);
  };
  
  // Complete a set
  const completeSet = (exerciseIndex: number, setIndex: number, weight: number, reps: number) => {
    if (!currentWorkout) return;
    
    const updatedWorkout = { ...currentWorkout };
    const exercise = updatedWorkout.exercises[exerciseIndex].exercise;
    
    updatedWorkout.exercises[exerciseIndex].sets[setIndex] = {
      weight,
      reps,
      completed: true
    };
    
    setCurrentWorkout(updatedWorkout);
    
    // Check if this is a personal record
    if (checkForNewPR(exercise.id, weight, reps)) {
      // Add to personal records
      addPersonalRecord(
        exercise.id, 
        weight, 
        reps, 
        `New PR during ${updatedWorkout.name} workout`
      );
      
      // Show a toast notification for the new PR
      toast({
        title: "New Personal Record! 🏆",
        description: `${exercise.name}: ${weight} lbs x ${reps} reps`,
        variant: "default",
      });
    }
    
    // Move to the next set or exercise
    if (setIndex < updatedWorkout.exercises[exerciseIndex].sets.length - 1) {
      // Move to next set of the same exercise
      setActiveSetIndex(setIndex + 1);
      startRestTimer(updatedWorkout.exercises[exerciseIndex].restTime);
    } else if (exerciseIndex < updatedWorkout.exercises.length - 1) {
      // Move to the first set of the next exercise
      setActiveExerciseIndex(exerciseIndex + 1);
      setActiveSetIndex(0);
      startRestTimer(updatedWorkout.exercises[exerciseIndex].restTime);
    } else {
      // Workout completed
      updatedWorkout.completed = true;
      updatedWorkout.duration = Math.floor((Date.now() - updatedWorkout.date.getTime()) / 60000);
      setCurrentWorkout(updatedWorkout);
      // In a real app, we would save the workout to history here
    }
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get current PR for a specific exercise
  const getCurrentPR = (exerciseId: string): PersonalRecord | undefined => {
    // Find all records for this exercise
    const exerciseRecords = personalRecords.filter(record => record.exerciseId === exerciseId);
    
    // If no records, return undefined
    if (exerciseRecords.length === 0) return undefined;
    
    // Sort by weight (descending)
    const sortedByWeight = [...exerciseRecords].sort((a, b) => b.weight - a.weight);
    return sortedByWeight[0];
  };
  
  // Check if a completed set is a new PR
  const checkForNewPR = (exerciseId: string, weight: number, reps: number): boolean => {
    const currentPR = getCurrentPR(exerciseId);
    if (!currentPR) return true; // First record is always a PR
    
    // For simplicity, we'll consider it a PR if the weight is higher or equal weight with more reps
    return weight > currentPR.weight || (weight === currentPR.weight && reps > currentPR.reps);
  };
  
  // Add a new personal record
  const addPersonalRecord = (exerciseId: string, weight: number, reps: number, notes?: string) => {
    const newRecord: PersonalRecord = {
      exerciseId,
      weight,
      reps,
      date: new Date(),
      notes
    };
    
    setPersonalRecords(prev => [...prev, newRecord]);
  };
  
  return (
    <div className="mx-auto w-full max-w-4xl">
      <Card className="shadow-md border-pink-100">
        <div className="p-4 bg-gradient-to-r from-pink-50 to-white">
          <h2 className="text-2xl font-semibold text-pink-700 mb-2">Weightlifting Tracker</h2>
          <p className="text-gray-600 mb-4">
            Track your weightlifting progress, follow workout templates, and monitor your strength gains over time.
          </p>
          
          <Tabs defaultValue="workout" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-5 bg-pink-100">
              <TabsTrigger 
                value="workout" 
                className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800"
              >
                <Dumbbell className="h-4 w-4 mr-2" />
                Workouts
              </TabsTrigger>
              <TabsTrigger 
                value="exercises" 
                className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800"
              >
                <Clipboard className="h-4 w-4 mr-2" />
                Exercises
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800"
              >
                <Calendar className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
              <TabsTrigger 
                value="records" 
                className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800"
              >
                <Award className="h-4 w-4 mr-2" />
                Records
              </TabsTrigger>
              <TabsTrigger 
                value="progress" 
                className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Progress
              </TabsTrigger>
            </TabsList>
            
            {/* Active Workout View */}
            {currentWorkout && activeTab === 'active-workout' && (
              <div className="my-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{currentWorkout.name}</h3>
                    <p className="text-sm text-gray-500">
                      {currentWorkout.date.toLocaleDateString()} • 
                      {currentWorkout.completed 
                        ? ` Completed in ${currentWorkout.duration} minutes` 
                        : ' In progress'}
                    </p>
                  </div>
                  {isResting && (
                    <div className="flex items-center">
                      <Timer className="h-4 w-4 text-pink-500 mr-1" />
                      <span className="text-sm font-medium">Rest: {formatTime(remainingRest)}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={cancelRestTimer}
                        className="ml-2 h-7 text-xs"
                      >
                        Skip
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  {currentWorkout.exercises.map((workoutExercise, exerciseIndex) => (
                    <div 
                      key={workoutExercise.exercise.id}
                      className={`p-4 rounded-lg border ${
                        exerciseIndex === activeExerciseIndex 
                          ? 'border-pink-300 bg-pink-50' 
                          : exerciseIndex < activeExerciseIndex 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{workoutExercise.exercise.name}</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {workoutExercise.exercise.targetMuscles.map(muscle => (
                              <Badge key={muscle} variant="outline" className="text-xs bg-white">
                                {muscle}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Badge 
                          className={
                            workoutExercise.exercise.difficulty === 'beginner' 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : workoutExercise.exercise.difficulty === 'intermediate'
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                              : 'bg-red-100 text-red-800 border-red-200'
                          }
                        >
                          {workoutExercise.exercise.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 mt-3">
                        <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-500 pb-1 border-b">
                          <div className="col-span-1">#</div>
                          <div className="col-span-4">Weight</div>
                          <div className="col-span-4">Reps</div>
                          <div className="col-span-3">Status</div>
                        </div>
                        
                        {workoutExercise.sets.map((set, setIndex) => (
                          <div 
                            key={setIndex} 
                            className={`grid grid-cols-12 gap-2 items-center ${
                              exerciseIndex === activeExerciseIndex && setIndex === activeSetIndex
                                ? 'bg-white rounded-md p-2 shadow-sm' 
                                : ''
                            }`}
                          >
                            <div className="col-span-1 text-sm font-medium">{setIndex + 1}</div>
                            <div className="col-span-4">
                              {exerciseIndex === activeExerciseIndex && 
                               setIndex === activeSetIndex && 
                               !set.completed ? (
                                <Input 
                                  type="number" 
                                  placeholder="lbs" 
                                  className="h-8" 
                                  value={set.weight || ''}
                                  onChange={(e) => {
                                    const updatedWorkout = { ...currentWorkout };
                                    updatedWorkout.exercises[exerciseIndex].sets[setIndex].weight = 
                                      Number(e.target.value);
                                    setCurrentWorkout(updatedWorkout);
                                  }}
                                />
                              ) : (
                                <div className="text-sm">{set.weight} lbs</div>
                              )}
                            </div>
                            <div className="col-span-4">
                              {exerciseIndex === activeExerciseIndex && 
                               setIndex === activeSetIndex && 
                               !set.completed ? (
                                <Input 
                                  type="number" 
                                  placeholder="reps" 
                                  className="h-8" 
                                  value={set.reps || ''}
                                  onChange={(e) => {
                                    const updatedWorkout = { ...currentWorkout };
                                    updatedWorkout.exercises[exerciseIndex].sets[setIndex].reps = 
                                      Number(e.target.value);
                                    setCurrentWorkout(updatedWorkout);
                                  }}
                                />
                              ) : (
                                <div className="text-sm">{set.reps} reps</div>
                              )}
                            </div>
                            <div className="col-span-3">
                              {exerciseIndex === activeExerciseIndex && 
                               setIndex === activeSetIndex && 
                               !set.completed ? (
                                <Button 
                                  size="sm" 
                                  className="h-8 bg-pink-500 hover:bg-pink-600"
                                  onClick={() => completeSet(
                                    exerciseIndex, 
                                    setIndex, 
                                    set.weight, 
                                    set.reps
                                  )}
                                  disabled={!set.weight || !set.reps || isResting}
                                >
                                  Complete
                                </Button>
                              ) : (
                                <div className={`text-sm ${set.completed ? 'text-green-600' : 'text-gray-400'}`}>
                                  {set.completed ? (
                                    <span className="flex items-center">
                                      <CheckSquare className="h-4 w-4 mr-1" />
                                      Done
                                    </span>
                                  ) : (
                                    'Pending'
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {exerciseIndex === activeExerciseIndex && (
                        <div className="mt-3 text-sm text-gray-500 flex justify-between items-center">
                          <div>
                            Rest between sets: {workoutExercise.restTime} seconds
                          </div>
                          <Slider 
                            value={[workoutExercise.restTime]}
                            min={30}
                            max={180}
                            step={15}
                            className="w-32"
                            onValueChange={(values) => {
                              const updatedWorkout = { ...currentWorkout };
                              updatedWorkout.exercises[exerciseIndex].restTime = values[0];
                              setCurrentWorkout(updatedWorkout);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {currentWorkout.completed ? (
                  <div className="mt-6 flex justify-center">
                    <Button 
                      onClick={() => setActiveTab('workout')}
                      className="bg-pink-500 hover:bg-pink-600"
                    >
                      Finish Workout
                    </Button>
                  </div>
                ) : (
                  <div className="mt-6 text-center text-sm text-gray-500">
                    Complete all exercises to finish your workout
                  </div>
                )}
              </div>
            )}
            
            {/* Workout Templates Tab */}
            <TabsContent value="workout" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SAMPLE_WORKOUT_TEMPLATES.map(template => (
                  <Card key={template.id} className="overflow-hidden">
                    <div className="p-4">
                      <h3 className="text-lg font-medium">{template.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 mb-3">
                        {template.description}
                      </p>
                      
                      <div className="space-y-2">
                        {template.workouts.map(workout => (
                          <div 
                            key={workout.id} 
                            className="flex justify-between items-center p-2 hover:bg-pink-50 rounded-md transition-colors"
                          >
                            <div>
                              <div className="font-medium">{workout.name}</div>
                              <div className="text-xs text-gray-500">
                                {workout.exercises.length} exercises
                              </div>
                            </div>
                            <Button 
                              size="sm"
                              className="bg-pink-500 hover:bg-pink-600"
                              onClick={() => startWorkout(workout.name)}
                            >
                              Start
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
                
                <Card className="flex items-center justify-center p-6 border-dashed border-2 bg-gray-50">
                  <Button variant="ghost" className="flex items-center text-gray-500">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Custom Workout
                  </Button>
                </Card>
              </div>
            </TabsContent>
            
            {/* Exercises Library Tab */}
            <TabsContent value="exercises" className="pt-4">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-medium">Exercise Library</h3>
                <Badge className="bg-pink-100 text-pink-800 font-normal">
                  {SAMPLE_EXERCISES.length} exercises
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SAMPLE_EXERCISES.map(exercise => (
                  <Card key={exercise.id} className="overflow-hidden">
                    <div className="p-3">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{exercise.name}</h4>
                        <Badge 
                          className={
                            exercise.difficulty === 'beginner' 
                              ? 'bg-green-100 text-green-800' 
                              : exercise.difficulty === 'intermediate'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {exercise.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {exercise.targetMuscles.map(muscle => (
                          <Badge key={muscle} variant="outline" className="text-xs">
                            {muscle}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="mt-2 text-xs text-gray-500">
                        <span className="font-medium">Equipment:</span> {exercise.equipment.join(', ')}
                      </div>
                      
                      <div className="mt-2 flex justify-end">
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          <MoreHorizontal className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Workout History Tab */}
            <TabsContent value="history" className="pt-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium">Recent Workouts</h3>
                <p className="text-sm text-gray-500">View and analyze your past workouts</p>
              </div>
              
              <ScrollArea className="h-72">
                <div className="space-y-4">
                  {workoutHistory.map(workout => (
                    <Card key={workout.id} className="overflow-hidden">
                      <div className="p-4">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">{workout.name}</h4>
                            <div className="text-sm text-gray-500">
                              {workout.date.toLocaleDateString()} • {workout.duration} min
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="h-8">
                            View
                          </Button>
                        </div>
                        
                        <div className="mt-3 space-y-2">
                          {workout.exercises.map(workoutExercise => (
                            <div 
                              key={workoutExercise.exercise.id}
                              className="text-sm flex justify-between items-center"
                            >
                              <div className="font-medium">{workoutExercise.exercise.name}</div>
                              <div className="text-gray-500">
                                {workoutExercise.sets.map((set, i) => (
                                  <span key={i}>
                                    {set.weight}×{set.reps}
                                    {i < workoutExercise.sets.length - 1 ? ', ' : ''}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {workout.notes && (
                          <div className="mt-3 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                            <span className="font-medium">Notes:</span> {workout.notes}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            {/* Personal Records Tab */}
            <TabsContent value="records" className="pt-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium">Personal Records</h3>
                <p className="text-sm text-gray-500">Track your personal bests for each exercise</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SAMPLE_EXERCISES.filter(exercise => 
                  personalRecords.some(record => record.exerciseId === exercise.id)
                ).map(exercise => {
                  const exerciseRecords = personalRecords
                    .filter(record => record.exerciseId === exercise.id)
                    .sort((a, b) => b.weight - a.weight || b.reps - a.reps);
                  
                  const personalBest = exerciseRecords[0];
                  
                  return (
                    <Card key={exercise.id} className="overflow-hidden">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{exercise.name}</h4>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {exercise.targetMuscles.map(muscle => (
                                <Badge key={muscle} variant="outline" className="text-xs bg-white">
                                  {muscle}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Badge 
                            className="bg-pink-100 text-pink-800 border-pink-200"
                          >
                            <Award className="h-3.5 w-3.5 mr-1" />
                            PR
                          </Badge>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <div className="bg-pink-50 rounded-md p-3 flex flex-col">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Best Weight:</span>
                              <span className="text-lg font-bold text-pink-700">{personalBest.weight} lbs</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Reps:</span>
                              <span className="text-md">{personalBest.reps}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>Date:</span>
                              <span>{personalBest.date.toLocaleDateString()}</span>
                            </div>
                            {personalBest.notes && (
                              <div className="mt-1 text-xs italic text-gray-500">
                                "{personalBest.notes}"
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium mb-1">Record History</h5>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {exerciseRecords.slice(1).map((record, idx) => (
                                <div key={idx} className="text-xs flex justify-between bg-gray-50 p-1.5 rounded">
                                  <span>
                                    {record.weight} lbs × {record.reps} reps
                                  </span>
                                  <span className="text-gray-500">
                                    {record.date.toLocaleDateString()}
                                  </span>
                                </div>
                              ))}
                              {exerciseRecords.length === 1 && (
                                <div className="text-xs text-gray-500 italic">
                                  No previous records.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
                
                {/* If no records exist */}
                {!SAMPLE_EXERCISES.some(exercise => 
                  personalRecords.some(record => record.exerciseId === exercise.id)
                ) && (
                  <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
                    <Award className="h-12 w-12 text-gray-300 mb-2" />
                    <h4 className="text-lg font-medium text-gray-500">No Personal Records Yet</h4>
                    <p className="text-sm text-gray-400 text-center mt-1">
                      Complete workouts to start tracking your personal bests.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Progress Tracking Tab */}
            <TabsContent value="progress" className="pt-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium">Strength Progress</h3>
                <p className="text-sm text-gray-500">Track your strength gains over time</p>
              </div>
              
              <div className="space-y-6">
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Main Lifts Progress</h4>
                  
                  <div className="space-y-3">
                    {personalRecords.length > 0 ? (
                      SAMPLE_EXERCISES
                        .filter(exercise => personalRecords.some(record => record.exerciseId === exercise.id))
                        .filter(exercise => ['bench-press', 'squat', 'deadlift', 'shoulder-press'].includes(exercise.id))
                        .map(exercise => {
                          const records = personalRecords
                            .filter(record => record.exerciseId === exercise.id)
                            .sort((a, b) => b.weight - a.weight);
                          
                          if (records.length === 0) return null;
                          
                          const maxWeight = records[0].weight;
                          // For progress bar, we'll calculate a relative percentage (based on the highest weight in all records)
                          const allWeights = personalRecords.map(record => record.weight);
                          const highestWeight = Math.max(...allWeights);
                          const progressValue = Math.round((maxWeight / highestWeight) * 100);
                          
                          return (
                            <div key={exercise.id}>
                              <div className="flex justify-between text-sm mb-1">
                                <div>{exercise.name}</div>
                                <div className="text-pink-600 font-medium">
                                  {maxWeight} lbs × {records[0].reps} reps
                                </div>
                              </div>
                              <Progress value={progressValue} className="h-2 bg-gray-100" />
                            </div>
                          );
                        })
                    ) : (
                      <div className="py-4 text-center text-gray-500">
                        No personal records available
                      </div>
                    )}
                  </div>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center mb-2">
                      <Award className="h-5 w-5 text-pink-500 mr-2" />
                      <h4 className="font-medium">Personal Records</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <div className="font-medium">Bench Press</div>
                        <div className="text-gray-500">195 lbs × 1 rep</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">Squat</div>
                        <div className="text-gray-500">265 lbs × 1 rep</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">Deadlift</div>
                        <div className="text-gray-500">315 lbs × 1 rep</div>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center mb-2">
                      <BarChart3 className="h-5 w-5 text-pink-500 mr-2" />
                      <h4 className="font-medium">Monthly Volume</h4>
                    </div>
                    <div className="h-24 flex items-end justify-between gap-1 mt-2">
                      {[40, 60, 75, 55, 80, 65, 90].map((value, i) => (
                        <div 
                          key={i} 
                          className="bg-pink-200 rounded-t w-full"
                          style={{ height: `${value}%` }}
                        ></div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      {['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'].map((week, i) => (
                        <div key={i}>{week}</div>
                      ))}
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="h-5 w-5 text-pink-500 mr-2" />
                      <h4 className="font-medium">Workout Streak</h4>
                    </div>
                    <div className="text-center py-2">
                      <div className="text-4xl font-bold text-pink-500">8</div>
                      <div className="text-sm text-gray-500">days in a row</div>
                    </div>
                    <div className="flex justify-between mt-3">
                      {[1, 1, 0, 1, 1, 1, 1].map((day, i) => (
                        <div 
                          key={i} 
                          className={`h-2 w-2 rounded-full ${
                            day ? 'bg-pink-500' : 'bg-gray-200'
                          }`}
                        ></div>
                      ))}
                    </div>
                    <div className="text-xs text-center text-gray-500 mt-1">
                      Last 7 days
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default WeightliftingSpecificExercisesEnhanced;