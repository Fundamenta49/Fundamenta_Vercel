import { useState } from 'react';
import { CloseableExerciseCard } from "@/components/ui/closeable-exercise-card";
import { BaseExercise } from "@/components/ui/enhanced-exercise-card";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { searchExerciseVideos } from '@/lib/exercise-search';
import { YouTubeVideo } from '@/lib/youtube-service';
import { 
  RUNNING_WARMUP_VIDEOS, 
  RUNNING_STRENGTH_VIDEOS, 
  RUNNING_TECHNIQUE_VIDEOS 
} from '@/lib/section-fallbacks';

// Define Running Exercise interface that extends the BaseExercise
interface RunningExercise extends BaseExercise {
  duration?: number; // in minutes
  distance?: number; // in miles/km
  pace?: string;
  terrain?: string;
  // Additional running-specific properties can be added here
}

// Sample exercise data
export const RUNNING_EXERCISES = {
  warmup: [
    {
      id: "warm1",
      name: "Dynamic Lunges",
      description: "A dynamic warm-up exercise that prepares the legs and hips for running.",
      muscleGroups: ["legs", "glutes", "hip flexors"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Stand tall with feet hip-width apart",
        "Take a large step forward with your right foot",
        "Lower your body until both knees are bent at 90-degree angles",
        "Push back to standing and immediately step forward with the left foot",
        "Continue alternating legs in a dynamic, controlled motion for 30-60 seconds"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/03/walking-lunge.gif",
      benefits: [
        "Activates leg muscles used in running",
        "Improves hip mobility",
        "Enhances dynamic flexibility",
        "Increases blood flow to lower body"
      ],
      tips: [
        "Keep your torso upright throughout the movement",
        "Make sure your front knee stays over your ankle, not beyond your toes",
        "Start with shorter steps and gradually increase range of motion",
        "Perform at a comfortable pace that gradually increases your heart rate"
      ],
      duration: 1
    },
    {
      id: "warm2",
      name: "High Knees",
      description: "A cardio exercise that warms up the legs and elevates the heart rate before running.",
      muscleGroups: ["quads", "hip flexors", "calves"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Stand with your feet hip-width apart",
        "Lift your right knee toward your chest",
        "Quickly alternate between legs, lifting each knee as high as comfortable",
        "Pump your arms as if you're running in place",
        "Continue at a brisk pace for 30-60 seconds"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/05/high-knees.gif",
      benefits: [
        "Increases heart rate gradually",
        "Warms up hip flexors and quadriceps",
        "Improves running form and knee lift",
        "Enhances coordination and rhythm"
      ],
      tips: [
        "Focus on lifting knees rather than speed initially",
        "Keep your core engaged throughout the exercise",
        "Land softly on the balls of your feet",
        "Maintain good posture with chest up and shoulders relaxed"
      ],
      duration: 1
    }
  ],
  strength: [
    {
      id: "strength1",
      name: "Bodyweight Squats",
      description: "A fundamental lower body exercise that builds strength in the legs and glutes.",
      muscleGroups: ["quads", "glutes", "hamstrings"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Stand with feet slightly wider than hip-width apart, toes pointed slightly outward",
        "Keep your chest up and core engaged",
        "Bend your knees and push your hips back as if sitting in a chair",
        "Lower until thighs are parallel to the ground (or as low as comfortable)",
        "Push through your heels to return to standing",
        "Complete 2-3 sets of 10-15 repetitions"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2020/12/Bodyweight-squat-scaled.jpg",
      benefits: [
        "Strengthens key running muscles (quads, hamstrings, glutes)",
        "Improves running stability and power",
        "Enhances knee stability",
        "Builds lower body endurance"
      ],
      tips: [
        "Keep your weight in your heels",
        "Ensure knees track in line with toes",
        "Maintain a neutral spine throughout the movement",
        "Focus on proper form before increasing repetitions"
      ]
    },
    {
      id: "strength2",
      name: "Calf Raises",
      description: "An exercise that strengthens the calf muscles critical for running propulsion.",
      muscleGroups: ["calves"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Stand with feet hip-width apart, holding onto something for balance if needed",
        "Keeping your legs straight but not locked, rise up onto the balls of your feet",
        "Lift as high as possible, contracting your calf muscles",
        "Slowly lower your heels back to the ground",
        "Complete 2-3 sets of 15-20 repetitions"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/04/calf-raises.jpg",
      benefits: [
        "Strengthens gastrocnemius and soleus muscles",
        "Improves push-off power during running",
        "Reduces risk of Achilles tendon injuries",
        "Enhances ankle stability"
      ],
      tips: [
        "Perform the movement through a full range of motion",
        "Rise all the way up onto the balls of your feet",
        "Lower heels slightly below the level of the step for a stretch",
        "For added difficulty, perform on one leg at a time"
      ]
    }
  ],
  technique: [
    {
      id: "tech1",
      name: "Running Form Drills",
      description: "A series of drills that help improve running form and efficiency.",
      muscleGroups: ["full body"],
      equipment: ["none"],
      difficulty: "intermediate",
      instructions: [
        "Start with A-skips: Skip while bringing knees up high, focusing on landing lightly",
        "Progress to B-skips: Like A-skips but extend leg forward after high knee",
        "Try butt kicks: Jog while kicking heels toward buttocks",
        "Practice high knees: Run while lifting knees to hip height",
        "Do each drill for 20-30 meters, focusing on quality over speed"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/07/running-form.jpg",
      benefits: [
        "Improves running economy and efficiency",
        "Reduces risk of injuries",
        "Enhances neuromuscular coordination",
        "Develops proper running mechanics"
      ],
      tips: [
        "Focus on good posture with slight forward lean from ankles",
        "Land lightly with feet under your center of mass",
        "Maintain relaxed shoulders and arms",
        "Practice these drills regularly, especially before speed workouts"
      ],
      terrain: "track or flat surface"
    },
    {
      id: "tech2",
      name: "Strides",
      description: "Short accelerations that improve running form and leg turnover.",
      muscleGroups: ["legs", "core"],
      equipment: ["none"],
      difficulty: "intermediate",
      instructions: [
        "Find a flat, straight surface about 100 meters long",
        "Start at a jog and gradually accelerate to about 90% of your maximum speed",
        "Hold this pace for 2-3 seconds",
        "Gradually decelerate back to a jog",
        "Walk back to the starting point to recover",
        "Repeat 4-8 times"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/08/sprint.jpg",
      benefits: [
        "Improves running economy",
        "Enhances stride length and frequency",
        "Develops neuromuscular coordination",
        "Prepares the body for faster running"
      ],
      tips: [
        "Focus on relaxed, fluid form rather than maximum effort",
        "Keep your posture tall with a slight forward lean",
        "Aim for quick, light foot contacts",
        "Ensure full recovery between strides"
      ],
      terrain: "track, field, or flat road"
    }
  ]
};

// Export for use elsewhere
export const RUNNING_EXERCISE_SETS = RUNNING_EXERCISES;

// Type for the fallback videos mapping
type FallbackVideoMapping = Record<string, YouTubeVideo[]>;

// Mapping warmup exercise IDs to fallback videos
const warmupFallbacks: FallbackVideoMapping = {
  "warm1": RUNNING_WARMUP_VIDEOS ? RUNNING_WARMUP_VIDEOS.slice(0, 2) : [],
  "warm2": RUNNING_WARMUP_VIDEOS ? RUNNING_WARMUP_VIDEOS.slice(2, 4) : []
};

// Mapping strength exercise IDs to fallback videos
const strengthFallbacks: FallbackVideoMapping = {
  "strength1": RUNNING_STRENGTH_VIDEOS ? RUNNING_STRENGTH_VIDEOS.slice(0, 2) : [],
  "strength2": RUNNING_STRENGTH_VIDEOS ? RUNNING_STRENGTH_VIDEOS.slice(2, 4) : []
};

// Mapping technique exercise IDs to fallback videos
const techniqueFallbacks: FallbackVideoMapping = {
  "tech1": RUNNING_TECHNIQUE_VIDEOS ? RUNNING_TECHNIQUE_VIDEOS.slice(0, 2) : [],
  "tech2": RUNNING_TECHNIQUE_VIDEOS ? RUNNING_TECHNIQUE_VIDEOS.slice(2, 4) : []
};

// Combine fallbacks for use in the component
const allFallbacks = {
  ...warmupFallbacks,
  ...strengthFallbacks,
  ...techniqueFallbacks
};

// Main Running Exercises Component
export const RunningSpecificExercisesEnhanced = () => {
  const [activeTab, setActiveTab] = useState('warmup');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Track which exercises have been closed by the user
  const [closedExercises, setClosedExercises] = useState<Record<string, boolean>>({});
  
  // Find video for an exercise using the YouTube API
  const findExerciseVideo = async (exercise: RunningExercise) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create an array of search terms in priority order
      const searchTerms = [
        `${exercise.name} ${activeTab} running exercise tutorial`,
        `${exercise.name} running workout proper form`,
        `how to do ${exercise.name} for runners correctly`,
        `${exercise.name} running technique demonstration`
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
  const handleShowDetail = (exercise: RunningExercise) => {
    console.log('Showing detail for:', exercise.name);
    // This could open a dialog with more comprehensive information
    // For now, just log the action
  };
  
  return (
    <div className="mx-auto w-full max-w-4xl">
      <Card className="shadow-md border-pink-100">
        <div className="p-4 bg-gradient-to-r from-pink-50 to-white">
          <h2 className="text-2xl font-semibold text-pink-700 mb-2">Running Training</h2>
          <p className="text-gray-600 mb-4">
            Whether you're a beginner or experienced runner, these exercises will help improve your form, strength, and efficiency.
            Select a category below to get started.
          </p>
          
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4 flex items-start">
              <AlertCircle className="text-yellow-500 mr-2 flex-shrink-0 h-5 w-5 mt-0.5" />
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          )}
          
          <Tabs defaultValue="warmup" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 bg-pink-100">
              <TabsTrigger value="warmup" className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800">
                Warm-up
              </TabsTrigger>
              <TabsTrigger value="strength" className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800">
                Strength
              </TabsTrigger>
              <TabsTrigger value="technique" className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800">
                Technique
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="warmup" className="pt-4">
              <div className="mb-3 bg-pink-50 p-3 rounded-md">
                <h3 className="font-medium text-pink-800 mb-1">Warm-up Exercises</h3>
                <p className="text-sm text-gray-600">
                  Proper warm-up prepares your body for running, increases blood flow to muscles, and reduces injury risk.
                  Spend 5-10 minutes on these exercises before your run.
                </p>
              </div>
              <div className="space-y-4">
                {RUNNING_EXERCISES.warmup.map((exercise) => (
                  !closedExercises[exercise.id] && (
                    <CloseableExerciseCard 
                      key={exercise.id}
                      exercise={exercise}
                      category="warmup"
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
                  )
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="strength" className="pt-4">
              <div className="mb-3 bg-pink-50 p-3 rounded-md">
                <h3 className="font-medium text-pink-800 mb-1">Strength Exercises for Runners</h3>
                <p className="text-sm text-gray-600">
                  These exercises strengthen key running muscles, improve stability, and help prevent injuries.
                  Incorporate them 2-3 times per week into your training routine.
                </p>
              </div>
              <div className="space-y-4">
                {RUNNING_EXERCISES.strength.map((exercise) => (
                  !closedExercises[exercise.id] && (
                    <CloseableExerciseCard 
                      key={exercise.id}
                      exercise={exercise}
                      category="strength"
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
                  )
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="technique" className="pt-4">
              <div className="mb-3 bg-pink-50 p-3 rounded-md">
                <h3 className="font-medium text-pink-800 mb-1">Running Form & Technique</h3>
                <p className="text-sm text-gray-600">
                  Proper running technique improves efficiency, reduces injury risk, and makes running more enjoyable.
                  Practice these drills regularly to develop better form.
                </p>
              </div>
              <div className="space-y-4">
                {RUNNING_EXERCISES.technique.map((exercise) => (
                  !closedExercises[exercise.id] && (
                    <CloseableExerciseCard 
                      key={exercise.id}
                      exercise={exercise}
                      category="technique"
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
                  )
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default RunningSpecificExercisesEnhanced;