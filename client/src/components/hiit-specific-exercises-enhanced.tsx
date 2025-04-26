import { useState, useEffect } from 'react';
import { BaseExercise } from "@/components/ui/enhanced-exercise-card";
import { CloseableExerciseCard } from "@/components/ui/closeable-exercise-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { YouTubeVideo } from '@/lib/youtube-service';
import { searchExerciseVideos } from '@/lib/exercise-search';
import { 
  HIIT_TABATA_VIDEOS, 
  HIIT_AMRAP_VIDEOS, 
  HIIT_EMOM_VIDEOS, 
  HIIT_CIRCUIT_VIDEOS 
} from '@/lib/section-fallbacks';
import ActivitySpecificRecommendations from './activity-specific-recommendations';
import { Workout, HIITWorkout } from '@/lib/workout-generation-service';
import { ExerciseType } from '@/modules/active-you/context/module-context';

// Define HIIT Exercise interface that extends the BaseExercise
interface HIITExercise extends BaseExercise {
  workTime?: number;
  restTime?: number;
  sets?: number;
  // Additional HIIT-specific properties can be added here
}

// Sample exercise data
export const HIIT_EXERCISES = {
  tabata: [
    {
      id: "tabata1",
      name: "Jump Squats",
      description: "An explosive lower-body exercise perfect for the Tabata protocol.",
      muscleGroups: ["quads", "glutes", "calves"],
      equipment: ["none"],
      difficulty: "intermediate",
      instructions: [
        "Stand with feet shoulder-width apart",
        "Lower into a squat position, keeping chest up",
        "Explosively jump upward",
        "Land softly and repeat"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/04/jump-squat.jpg",
      benefits: [
        "Increases heart rate quickly",
        "Builds explosive power in legs",
        "Can be modified for different fitness levels"
      ],
      tips: [
        "Land softly with knees slightly bent to reduce impact",
        "For a lower impact version, reduce jump height",
        "Focus on depth over speed for muscle development"
      ],
      workTime: 20,
      restTime: 10,
      sets: 8
    },
    {
      id: "tabata2",
      name: "Mountain Climbers",
      description: "A dynamic full-body exercise that elevates heart rate.",
      muscleGroups: ["core", "shoulders", "hips", "legs"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Start in a high plank position",
        "Rapidly bring right knee toward chest",
        "Switch legs quickly",
        "Maintain a flat back throughout"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/06/mountain-climbers-768x512.jpg",
      benefits: [
        "Engages multiple muscle groups simultaneously",
        "Great for cardiovascular conditioning",
        "Helps improve core stability"
      ],
      tips: [
        "Keep hips down in line with shoulders",
        "Maintain a brisk pace for maximum benefit",
        "Breathe rhythmically throughout the exercise"
      ],
      workTime: 20,
      restTime: 10,
      sets: 8
    }
  ],
  amrap: [
    {
      id: "amrap1",
      name: "Burpees",
      description: "A full-body exercise that builds strength, endurance, and power.",
      muscleGroups: ["full body", "chest", "legs", "core"],
      equipment: ["none"],
      difficulty: "intermediate",
      instructions: [
        "Start in a standing position",
        "Drop into a squat position with hands on the ground",
        "Kick feet back into a plank position",
        "Immediately return feet to squat position",
        "Jump up from squat position with arms extended"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/05/burpee.jpg",
      benefits: [
        "Delivers a full-body workout",
        "Excellent for building cardiovascular fitness",
        "Burns calories efficiently"
      ],
      tips: [
        "Focus on form rather than speed when starting",
        "Modify by removing the push-up or jump for beginners",
        "Keep core engaged throughout the movement"
      ]
    },
    {
      id: "amrap2",
      name: "Air Squats",
      description: "A foundational movement that builds lower body strength.",
      muscleGroups: ["quads", "glutes", "hamstrings"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Stand with feet shoulder-width apart",
        "Push hips back and bend knees as if sitting in a chair",
        "Keep chest up and knees tracking over toes",
        "Lower until thighs are parallel to ground (or as low as comfortable)",
        "Push through heels to return to standing"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2014/03/Screen-Shot-2014-03-10-at-4.43.56-PM.png",
      benefits: [
        "Builds functional lower body strength",
        "Accessible for most fitness levels",
        "Improves mobility in knees, ankles, and hips"
      ],
      tips: [
        "Focus on depth over speed",
        "Keep weight in heels to protect knees",
        "Maintain a neutral spine throughout"
      ]
    }
  ],
  emom: [
    {
      id: "emom1",
      name: "Push-Ups",
      description: "A classic bodyweight exercise for upper body and core strength.",
      muscleGroups: ["chest", "shoulders", "triceps", "core"],
      equipment: ["none"],
      difficulty: "intermediate",
      instructions: [
        "Start in a high plank position with hands slightly wider than shoulders",
        "Keep body in a straight line from head to heels",
        "Lower chest toward the floor by bending elbows",
        "Push back up to starting position",
        "Repeat for the designated number of reps"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2014/02/pushups.jpg",
      benefits: [
        "Builds upper body strength and endurance",
        "Engages core stabilizers",
        "Can be modified for different fitness levels"
      ],
      tips: [
        "Keep elbows at about 45° from body (not flared out)",
        "Maintain a rigid plank throughout the movement",
        "For easier modification, perform from knees or against a wall"
      ]
    },
    {
      id: "emom2",
      name: "Kettlebell Swings",
      description: "A powerful hip-hinge movement that builds posterior chain strength and power.",
      muscleGroups: ["glutes", "hamstrings", "back", "shoulders"],
      equipment: ["kettlebell"],
      difficulty: "intermediate",
      instructions: [
        "Stand with feet shoulder-width apart, kettlebell on floor in front",
        "Hinge at hips to grasp kettlebell with both hands",
        "Pull kettlebell back between legs like a hiking motion",
        "Thrust hips forward powerfully to swing kettlebell to shoulder height",
        "Let kettlebell fall back naturally, hinging at hips to absorb momentum",
        "Repeat in a continuous swinging motion"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2014/09/kettlebell-swing-768x570.jpg",
      benefits: [
        "Develops explosive hip power",
        "Excellent for cardiovascular conditioning",
        "Strengthens posterior chain"
      ],
      tips: [
        "Drive with the hips, not the arms",
        "Keep back flat throughout the movement",
        "Start with a lighter weight to master form"
      ]
    }
  ],
  circuit: [
    {
      id: "circuit1",
      name: "Dumbbell Lunges",
      description: "A unilateral lower body exercise that builds strength and balance.",
      muscleGroups: ["quads", "glutes", "hamstrings", "calves"],
      equipment: ["dumbbells"],
      difficulty: "intermediate",
      instructions: [
        "Stand tall with feet hip-width apart, holding dumbbells at sides",
        "Take a controlled step forward with right foot",
        "Lower body until both knees form 90-degree angles",
        "Push through front heel to return to standing",
        "Repeat on opposite leg",
        "Continue alternating legs"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/07/lunge.jpg",
      benefits: [
        "Improves balance and stability",
        "Builds unilateral leg strength",
        "Engages core stabilizers"
      ],
      tips: [
        "Keep torso upright throughout movement",
        "Ensure front knee stays aligned with ankle (not collapsing inward)",
        "Step far enough forward to create 90° angles in both knees"
      ]
    },
    {
      id: "circuit2",
      name: "Bent-Over Rows",
      description: "A compound pulling exercise that builds back strength.",
      muscleGroups: ["back", "biceps", "shoulders"],
      equipment: ["dumbbells"],
      difficulty: "intermediate",
      instructions: [
        "Stand with feet shoulder-width apart, holding dumbbells",
        "Hinge at hips to about 45° forward angle, back flat",
        "Let arms hang straight down, palms facing in",
        "Pull elbows back and up, squeezing shoulder blades together",
        "Lower weights back to starting position with control",
        "Repeat for the designated reps"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2014/06/bent-over-row-1.jpg",
      benefits: [
        "Strengthens pulling muscles",
        "Improves posture",
        "Counteracts effects of prolonged sitting"
      ],
      tips: [
        "Keep back flat and core engaged throughout",
        "Pull elbows close to body, not flared out",
        "Focus on squeezing shoulder blades at top of movement"
      ]
    }
  ]
};

// Export HIIT exercise sets for use elsewhere
export const HIIT_EXERCISE_SETS = HIIT_EXERCISES;

// Type for the fallback videos mapping
type FallbackVideoMapping = Record<string, YouTubeVideo[]>;

// Mapping tabata exercise IDs to fallback videos
const tabataFallbacks: FallbackVideoMapping = {
  "tabata1": HIIT_TABATA_VIDEOS.slice(0, 2),
  "tabata2": HIIT_TABATA_VIDEOS.slice(2, 4)
};

// Mapping AMRAP exercise IDs to fallback videos
const amrapFallbacks: FallbackVideoMapping = {
  "amrap1": HIIT_AMRAP_VIDEOS.slice(0, 2),
  "amrap2": HIIT_AMRAP_VIDEOS.slice(2, 4)
};

// Mapping EMOM exercise IDs to fallback videos
const emomFallbacks: FallbackVideoMapping = {
  "emom1": HIIT_EMOM_VIDEOS.slice(0, 2),
  "emom2": HIIT_EMOM_VIDEOS.slice(2, 4)
};

// Mapping circuit exercise IDs to fallback videos
const circuitFallbacks: FallbackVideoMapping = {
  "circuit1": HIIT_CIRCUIT_VIDEOS.slice(0, 2),
  "circuit2": HIIT_CIRCUIT_VIDEOS.slice(2, 4)
};

// Combine fallbacks for use in the component
const allFallbacks = {
  ...tabataFallbacks,
  ...amrapFallbacks,
  ...emomFallbacks,
  ...circuitFallbacks
};

// Main HIIT Exercises Component
export const HIITSpecificExercisesEnhanced = () => {
  const [activeTab, setActiveTab] = useState('tabata');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Track which exercises have been closed by the user
  const [closedExercises, setClosedExercises] = useState<Record<string, boolean>>({});
  // Store AI-generated workout plans
  const [aiWorkout, setAiWorkout] = useState<HIITWorkout | null>(null);
  
  // Find video for an exercise using the YouTube API
  const findExerciseVideo = async (exercise: HIITExercise) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create an array of search terms in priority order
      const searchTerms = [
        `${exercise.name} ${activeTab} HIIT exercise tutorial`,
        `${exercise.name} HIIT workout proper form`,
        `how to do ${exercise.name} correctly`,
        `${exercise.name} fitness demonstration`
      ];
      
      // Use our custom search function that handles arrays of search terms
      const videos = await searchExerciseVideos(searchTerms);
      
      setIsLoading(false);
      return videos;
    } catch (err) {
      console.error('Error fetching exercise video:', err);
      setError('Unable to load video. Using backup videos.');
      setIsLoading(false);
      return [];
    }
  };
  
  // Handle showing detailed exercise information
  const handleShowDetail = (exercise: HIITExercise) => {
    console.log('Showing detail for:', exercise.name);
    // This could open a dialog with more comprehensive information
    // For now, just log the action
  };
  
  return (
    <div className="mx-auto w-full max-w-4xl">
      <Card className="shadow-md border-pink-100">
        <div className="p-4 bg-gradient-to-r from-pink-50 to-white">
          <h2 className="text-2xl font-semibold text-pink-700 mb-2">HIIT Workouts</h2>
          <p className="text-gray-600 mb-4">
            High-Intensity Interval Training (HIIT) combines short bursts of intense exercise with recovery periods. 
            Select a workout style below to get started.
          </p>
          
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4 flex items-start">
              <AlertCircle className="text-yellow-500 mr-2 flex-shrink-0 h-5 w-5 mt-0.5" />
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          )}
          
          <Tabs defaultValue="tabata" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-4 bg-pink-100">
              <TabsTrigger value="tabata" className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800">
                Tabata
              </TabsTrigger>
              <TabsTrigger value="amrap" className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800">
                AMRAP
              </TabsTrigger>
              <TabsTrigger value="emom" className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800">
                EMOM
              </TabsTrigger>
              <TabsTrigger value="circuit" className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800">
                Circuit
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="tabata" className="pt-4">
              <div className="mb-3 bg-pink-50 p-3 rounded-md">
                <h3 className="font-medium text-pink-800 mb-1">Tabata Protocol</h3>
                <p className="text-sm text-gray-600">
                  20 seconds of all-out effort followed by 10 seconds of rest, repeated for 8 rounds (4 minutes total).
                </p>
              </div>
              <div className="space-y-4">
                {HIIT_EXERCISES.tabata.map((exercise) => (
                  <CloseableExerciseCard 
                    key={exercise.id}
                    exercise={exercise}
                    category="tabata"
                    sectionColor="#FF3B77"
                    loadExerciseVideo={findExerciseVideo}
                    onShowExerciseDetail={handleShowDetail}
                    fallbackVideos={allFallbacks}
                    onClose={() => {
                      console.log("Exercise card closed:", exercise.name);
                      // Update the closed exercises state
                      setClosedExercises(prev => ({
                        ...prev,
                        [exercise.id]: true
                      }));
                    }}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="amrap" className="pt-4">
              <div className="mb-3 bg-pink-50 p-3 rounded-md">
                <h3 className="font-medium text-pink-800 mb-1">AMRAP: As Many Rounds As Possible</h3>
                <p className="text-sm text-gray-600">
                  Complete as many rounds of the exercises as possible within a set time frame.
                </p>
              </div>
              <div className="space-y-4">
                {HIIT_EXERCISES.amrap.map((exercise) => (
                  <CloseableExerciseCard 
                    key={exercise.id}
                    exercise={exercise}
                    category="amrap"
                    sectionColor="#FF3B77"
                    loadExerciseVideo={findExerciseVideo}
                    onShowExerciseDetail={handleShowDetail}
                    fallbackVideos={allFallbacks}
                    onClose={() => console.log("Exercise card closed:", exercise.name)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="emom" className="pt-4">
              <div className="mb-3 bg-pink-50 p-3 rounded-md">
                <h3 className="font-medium text-pink-800 mb-1">EMOM: Every Minute On the Minute</h3>
                <p className="text-sm text-gray-600">
                  Complete a specific number of reps within a minute. Rest for the remainder of that minute before starting again.
                </p>
              </div>
              <div className="space-y-4">
                {HIIT_EXERCISES.emom.map((exercise) => (
                  <CloseableExerciseCard 
                    key={exercise.id}
                    exercise={exercise}
                    category="emom"
                    sectionColor="#FF3B77"
                    loadExerciseVideo={findExerciseVideo}
                    onShowExerciseDetail={handleShowDetail}
                    fallbackVideos={allFallbacks}
                    onClose={() => console.log("Exercise card closed:", exercise.name)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="circuit" className="pt-4">
              <div className="mb-3 bg-pink-50 p-3 rounded-md">
                <h3 className="font-medium text-pink-800 mb-1">Circuit Training</h3>
                <p className="text-sm text-gray-600">
                  Move from one exercise to the next with minimal rest until you've completed all exercises. Then repeat the circuit.
                </p>
              </div>
              <div className="space-y-4">
                {HIIT_EXERCISES.circuit.map((exercise) => (
                  <CloseableExerciseCard 
                    key={exercise.id}
                    exercise={exercise}
                    category="circuit"
                    sectionColor="#FF3B77"
                    loadExerciseVideo={findExerciseVideo}
                    onShowExerciseDetail={handleShowDetail}
                    fallbackVideos={allFallbacks}
                    onClose={() => console.log("Exercise card closed:", exercise.name)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default HIITSpecificExercisesEnhanced;