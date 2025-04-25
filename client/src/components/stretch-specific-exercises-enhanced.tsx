import { useState } from 'react';
import { CloseableExerciseCard } from "@/components/ui/closeable-exercise-card";
import { BaseExercise } from "@/components/ui/enhanced-exercise-card";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { searchExerciseVideos } from '@/lib/exercise-search';
import { YouTubeVideo } from '@/lib/youtube-service';
import { 
  STRETCH_DYNAMIC_VIDEOS,
  STRETCH_STATIC_VIDEOS,
  STRETCH_RECOVERY_VIDEOS
} from '@/lib/section-fallbacks';

// Define Stretch Exercise interface extending BaseExercise
interface StretchExercise extends BaseExercise {
  duration?: number; // in seconds
  holdTime?: number; // in seconds
  recommendedBreaths?: number;
  targetFlexibility?: string[];
  isActive?: boolean; // for active vs. passive stretches
}

// Sample exercise data
export const STRETCH_EXERCISES = {
  dynamic: [
    {
      id: "dyn1",
      name: "Leg Swings",
      description: "A dynamic stretch for hip mobility and flexibility in the hamstrings and hip flexors.",
      muscleGroups: ["hips", "hamstrings", "hip flexors"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Stand beside a wall or sturdy object for support",
        "Shift your weight to your left leg and slightly bend the knee",
        "Swing your right leg forward and backward in a controlled motion",
        "Keep your core engaged and back straight",
        "Perform 10-15 swings, then switch legs"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/06/leg-swings.gif",
      benefits: [
        "Improves hip mobility and range of motion",
        "Warms up the hip joint and surrounding muscles",
        "Enhances dynamic flexibility for activities like running",
        "Helps prevent injury by preparing muscles for more intensive movements"
      ],
      tips: [
        "Focus on controlled movements rather than height",
        "Keep your torso stable throughout the movement",
        "Gradually increase the range of motion as you warm up",
        "Maintain good posture with shoulders back and chest up"
      ],
      duration: 30,
      isActive: true
    },
    {
      id: "dyn2",
      name: "Arm Circles",
      description: "A dynamic stretch for shoulder mobility and warming up the upper body.",
      muscleGroups: ["shoulders", "upper back", "chest"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Stand with feet shoulder-width apart",
        "Extend arms out to the sides at shoulder height",
        "Begin making small circles with your arms",
        "Gradually increase the size of the circles",
        "Reverse direction after 10-15 circles"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/06/arm-circles.gif",
      benefits: [
        "Improves shoulder mobility and circulation",
        "Relieves tension in the upper back and neck",
        "Warms up the rotator cuff muscles",
        "Prepares the upper body for exercise"
      ],
      tips: [
        "Keep your core engaged throughout the movement",
        "Maintain proper posture with a neutral spine",
        "If you feel shoulder pain, reduce the size of your circles",
        "Breathe deeply and evenly as you move"
      ],
      duration: 30,
      isActive: true
    }
  ],
  static: [
    {
      id: "stat1",
      name: "Hamstring Stretch",
      description: "A static stretch targeting the hamstrings to improve flexibility and reduce tightness.",
      muscleGroups: ["hamstrings", "lower back"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Sit on the floor with your right leg extended straight in front of you",
        "Bend your left leg and place the sole of your left foot against your right inner thigh",
        "Keeping your back straight, hinge at the hips and reach toward your right foot",
        "Hold the position for 20-30 seconds, feeling a stretch in your hamstring",
        "Repeat on the other side"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/05/seated-hamstring-stretch.jpg",
      benefits: [
        "Reduces hamstring tightness and improves flexibility",
        "May help alleviate lower back pain",
        "Improves posture and alignment",
        "Enhances range of motion for activities like running and squatting"
      ],
      tips: [
        "Focus on hinging at the hips rather than rounding your back",
        "Breathe deeply into the stretch, exhaling as you deepen it",
        "Avoid bouncing - use gentle, sustained pressure",
        "If you can't reach your foot, use a towel or strap around your foot"
      ],
      holdTime: 30,
      recommendedBreaths: 5,
      isActive: false
    },
    {
      id: "stat2",
      name: "Chest Stretch",
      description: "A static stretch for the chest and anterior shoulders to improve posture and counteract sitting.",
      muscleGroups: ["chest", "shoulders", "biceps"],
      equipment: ["doorway"],
      difficulty: "beginner",
      instructions: [
        "Stand in a doorway with your arms bent at 90 degrees",
        "Place your forearms and palms against the doorframe",
        "Step forward with one foot, maintaining a straight line from head to heel",
        "Lean your body weight forward until you feel a stretch across your chest",
        "Hold for 20-30 seconds"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/05/doorway-chest-stretch.jpg",
      benefits: [
        "Opens the chest and helps correct rounded shoulders",
        "Counteracts the effects of prolonged sitting and computer work",
        "Improves upper body posture",
        "Increases chest flexibility for activities like swimming and pushing movements"
      ],
      tips: [
        "Keep your core engaged to prevent arching your lower back",
        "Adjust the height of your arms to target different parts of the chest",
        "For a deeper stretch, take a larger step forward",
        "Maintain normal breathing throughout the stretch"
      ],
      holdTime: 30,
      recommendedBreaths: 5,
      isActive: false
    }
  ],
  mobility: [
    {
      id: "mob1",
      name: "World's Greatest Stretch",
      description: "A comprehensive mobility exercise that targets multiple areas of the body in a flowing sequence.",
      muscleGroups: ["hips", "shoulders", "thoracic spine", "hamstrings", "quads"],
      equipment: ["none"],
      difficulty: "intermediate",
      instructions: [
        "Start in a push-up position",
        "Step your right foot outside your right hand",
        "Drop your left knee to the ground and lift your right hand",
        "Rotate your torso to the right, reaching your right arm toward the ceiling",
        "Return to the lunge position, place your right elbow near your right foot",
        "Repeat on the other side"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/07/worlds-greatest-stretch.jpg",
      benefits: [
        "Improves total body mobility in multiple planes of movement",
        "Targets hip flexors, hamstrings, glutes, shoulders, and spine",
        "Enhances athletic performance by improving multi-planar movement",
        "Excellent warm-up for any workout"
      ],
      tips: [
        "Focus on smooth, controlled movements throughout the sequence",
        "Keep your front heel flat on the ground during the lunge",
        "Breathe deeply, especially during the rotation portion",
        "Modify the depth of the lunge based on your flexibility"
      ],
      duration: 60,
      isActive: true,
      targetFlexibility: ["hips", "shoulders", "thoracic spine"]
    },
    {
      id: "mob2",
      name: "Cat-Cow Stretch",
      description: "A flowing mobility exercise for the spine that alternates between flexion and extension.",
      muscleGroups: ["spine", "core", "neck", "back"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Start on your hands and knees in a tabletop position",
        "For Cat: Exhale as you round your spine toward the ceiling, tucking your chin to your chest",
        "For Cow: Inhale as you arch your back, lifting your head and tailbone toward the ceiling",
        "Move smoothly between these two positions",
        "Continue for 1-2 minutes, synchronizing breath with movement"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/04/cat-cow.gif",
      benefits: [
        "Improves spinal mobility and flexibility",
        "Relieves tension in the back, shoulders, and neck",
        "Gently massages and stimulates organs in the abdominal region",
        "Coordinates movement with breath for mindfulness benefits"
      ],
      tips: [
        "Move at a pace that allows you to fully coordinate breath with movement",
        "Keep your wrists directly under your shoulders and knees under your hips",
        "Focus on feeling the movement through each segment of your spine",
        "For sensitive wrists, perform on forearms or use wrist supports"
      ],
      duration: 60,
      isActive: true,
      targetFlexibility: ["spine", "neck"]
    }
  ]
};

// Export for use elsewhere
export const STRETCH_EXERCISE_SETS = STRETCH_EXERCISES;

// Type for the fallback videos mapping
type FallbackVideoMapping = Record<string, YouTubeVideo[]>;

// Create fallback video collections
const dynamicFallbacks: FallbackVideoMapping = {
  "dyn1": STRETCH_DYNAMIC_VIDEOS ? STRETCH_DYNAMIC_VIDEOS.slice(0, 2) : [],
  "dyn2": STRETCH_DYNAMIC_VIDEOS ? STRETCH_DYNAMIC_VIDEOS.slice(2, 4) : []
};

const staticFallbacks: FallbackVideoMapping = {
  "stat1": STRETCH_STATIC_VIDEOS ? STRETCH_STATIC_VIDEOS.slice(0, 2) : [],
  "stat2": STRETCH_STATIC_VIDEOS ? STRETCH_STATIC_VIDEOS.slice(2, 4) : []
};

const mobilityFallbacks: FallbackVideoMapping = {
  "mob1": STRETCH_RECOVERY_VIDEOS ? STRETCH_RECOVERY_VIDEOS.slice(0, 2) : [],
  "mob2": STRETCH_RECOVERY_VIDEOS ? STRETCH_RECOVERY_VIDEOS.slice(2, 4) : []
};

// Combine all fallbacks
const allFallbacks = {
  ...dynamicFallbacks,
  ...staticFallbacks,
  ...mobilityFallbacks
};

// Main Stretching Component
export const StretchSpecificExercisesEnhanced = () => {
  const [activeTab, setActiveTab] = useState('dynamic');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Track which exercises have been closed by the user
  const [closedExercises, setClosedExercises] = useState<Record<string, boolean>>({});
  
  // Find video for an exercise using the YouTube API
  const findExerciseVideo = async (exercise: StretchExercise) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create an array of search terms in priority order
      const searchTerms = [
        `${exercise.name} stretch tutorial proper form`,
        `how to do ${exercise.name} stretch correctly`,
        `${exercise.name} flexibility exercise demonstration`,
        `${activeTab} stretching ${exercise.name}`
      ];
      
      // Use our exercise search service that can handle multiple search terms
      const videos = await searchExerciseVideos(searchTerms);
      
      setIsLoading(false);
      return videos;
    } catch (err) {
      console.error('Error fetching stretch videos:', err);
      setError('Unable to load video. Using backup videos.');
      setIsLoading(false);
      return [];
    }
  };
  
  // Handler for showing detailed exercise information
  const handleShowDetail = (exercise: StretchExercise) => {
    console.log('Showing detail for:', exercise.name);
    // This would open a modal or dialog with comprehensive information
    // For now, we just log the action
  };
  
  return (
    <div className="mx-auto w-full max-w-4xl">
      <Card className="shadow-md border-pink-100">
        <div className="p-4 bg-gradient-to-r from-pink-50 to-white">
          <h2 className="text-2xl font-semibold text-pink-700 mb-2">Stretching & Mobility</h2>
          <p className="text-gray-600 mb-4">
            Improve your flexibility, mobility, and recovery with these stretching exercises.
            Choose from dynamic, static, and mobility-focused movements for a comprehensive approach.
          </p>
          
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-700" />
            <AlertTitle className="text-blue-700">Stretching Tip</AlertTitle>
            <AlertDescription className="text-blue-600">
              For dynamic stretches, focus on smooth movements. For static stretches, 
              hold for 20-30 seconds without bouncing. Breathe deeply and relax into each stretch.
            </AlertDescription>
          </Alert>
          
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4 flex items-start">
              <AlertCircle className="text-yellow-500 mr-2 flex-shrink-0 h-5 w-5 mt-0.5" />
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          )}
          
          <Tabs defaultValue="dynamic" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 bg-pink-100">
              <TabsTrigger 
                value="dynamic" 
                className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800"
              >
                Dynamic
              </TabsTrigger>
              <TabsTrigger 
                value="static" 
                className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800"
              >
                Static
              </TabsTrigger>
              <TabsTrigger 
                value="mobility" 
                className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800"
              >
                Mobility
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dynamic" className="pt-4">
              <div className="mb-3 bg-pink-50 p-3 rounded-md">
                <h3 className="font-medium text-pink-800 mb-1">Dynamic Stretches</h3>
                <p className="text-sm text-gray-600">
                  Dynamic stretches involve active movements where joints and muscles go through a full range of motion.
                  These are ideal for warming up before a workout or activity.
                </p>
              </div>
              <div className="space-y-4">
                {STRETCH_EXERCISES.dynamic.map((exercise) => (
                  !closedExercises[exercise.id] && (
                    <CloseableExerciseCard 
                      key={exercise.id}
                      exercise={exercise}
                      category="dynamic"
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
            
            <TabsContent value="static" className="pt-4">
              <div className="mb-3 bg-pink-50 p-3 rounded-md">
                <h3 className="font-medium text-pink-800 mb-1">Static Stretches</h3>
                <p className="text-sm text-gray-600">
                  Static stretches involve holding a position for a period of time, usually 20-60 seconds.
                  These are best performed after exercise when your muscles are warm.
                </p>
              </div>
              <div className="space-y-4">
                {STRETCH_EXERCISES.static.map((exercise) => (
                  !closedExercises[exercise.id] && (
                    <CloseableExerciseCard 
                      key={exercise.id}
                      exercise={exercise}
                      category="static"
                      sectionColor="#FF3B77"
                      loadExerciseVideo={findExerciseVideo}
                      onShowExerciseDetail={handleShowDetail}
                      fallbackVideos={allFallbacks}
                      onClose={() => {
                        console.log("Exercise card closed:", exercise.name);
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
            
            <TabsContent value="mobility" className="pt-4">
              <div className="mb-3 bg-pink-50 p-3 rounded-md">
                <h3 className="font-medium text-pink-800 mb-1">Mobility Exercises</h3>
                <p className="text-sm text-gray-600">
                  Mobility exercises combine elements of stretching, strength, and controlled movement
                  to improve your functional range of motion and joint health.
                </p>
              </div>
              <div className="space-y-4">
                {STRETCH_EXERCISES.mobility.map((exercise) => (
                  !closedExercises[exercise.id] && (
                    <CloseableExerciseCard 
                      key={exercise.id}
                      exercise={exercise}
                      category="mobility"
                      sectionColor="#FF3B77"
                      loadExerciseVideo={findExerciseVideo}
                      onShowExerciseDetail={handleShowDetail}
                      fallbackVideos={allFallbacks}
                      onClose={() => {
                        console.log("Exercise card closed:", exercise.name);
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

export default StretchSpecificExercisesEnhanced;