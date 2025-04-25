import { useState, useEffect } from 'react';
import { EnhancedExerciseCard, BaseExercise } from "@/components/ui/enhanced-exercise-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { searchSectionSpecificExerciseVideos, YouTubeVideo } from '@/lib/youtube-service';
import { 
  STRETCH_DYNAMIC_VIDEOS,
  STRETCH_STATIC_VIDEOS,
  STRETCH_RECOVERY_VIDEOS
} from '@/lib/section-fallbacks';

// Define Stretch Exercise interface that extends the BaseExercise
interface StretchExercise extends BaseExercise {
  holdTime?: number; // in seconds
  repetitions?: number;
  targetAreas?: string[];
  // Additional stretch-specific properties can be added here
}

// Sample exercise data
export const STRETCH_EXERCISES = {
  dynamic: [
    {
      id: "stretch1",
      name: "Shoulder Rolls",
      description: "A gentle dynamic stretch that releases tension in the shoulders and upper back.",
      muscleGroups: ["shoulders", "upper back", "neck"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Sit or stand with good posture",
        "Lift your shoulders toward your ears",
        "Roll shoulders backward and down",
        "Repeat 8-10 times backward, then forward"
      ],
      imageUrl: "https://thumbs.dreamstime.com/b/shoulder-rolls-exercise-woman-doing-shoulders-roll-workout-fitness-sport-training-concept-vector-illustration-isolated-white-219962161.jpg",
      benefits: [
        "Releases tension in shoulder muscles",
        "Improves shoulder mobility",
        "Can help reduce headaches from neck tension"
      ],
      tips: [
        "Focus on a full range of motion",
        "Keep breathing steady throughout",
        "Perform the movement slowly and deliberately"
      ],
      repetitions: 10,
      targetAreas: ["Office workers", "Computer users", "Stress relief"]
    },
    {
      id: "stretch2",
      name: "Arm Circles",
      description: "A dynamic stretch that mobilizes the shoulder joints and warms up the upper body.",
      muscleGroups: ["shoulders", "arms", "upper back"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Stand with feet shoulder-width apart",
        "Extend arms out to sides at shoulder height",
        "Make small circles with arms, gradually increasing size",
        "Perform forward for 20-30 seconds, then backward"
      ],
      imageUrl: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/armcircles-1457044203.gif",
      benefits: [
        "Warms up shoulder joints",
        "Increases blood flow to upper body",
        "Helps prevent shoulder injuries during workouts"
      ],
      tips: [
        "Keep core engaged and posture tall",
        "Start with smaller circles and gradually increase",
        "If you have shoulder issues, keep circles small"
      ],
      repetitions: 20,
      targetAreas: ["Pre-workout", "Upper body preparation", "Morning routine"]
    }
  ],
  static: [
    {
      id: "stretch3",
      name: "Seated Forward Fold",
      description: "A static stretch that targets the entire posterior chain, especially the hamstrings.",
      muscleGroups: ["hamstrings", "lower back", "calves"],
      equipment: ["yoga mat (optional)"],
      difficulty: "beginner",
      instructions: [
        "Sit on the floor with legs extended forward",
        "Hinge at hips and reach toward toes",
        "Hold the stretch at a point of mild tension",
        "Keep back as straight as possible, bend from hips"
      ],
      imageUrl: "https://www.verywellfit.com/thmb/b-R1Ck3hmAQHFzFiUEtjgvXpYE0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Verywell-01-3567192-PascimottanasanaSeatedForwardBend-598b919e16614fa7bab0580bd447416c.jpg",
      benefits: [
        "Relieves tension in hamstrings and lower back",
        "Calms the nervous system",
        "Improves posture and spinal flexibility"
      ],
      tips: [
        "Don't force the stretch - reach only as far as comfortable",
        "Bend knees slightly if hamstrings are tight",
        "Focus on hinging at hips rather than rounding back"
      ],
      holdTime: 30,
      targetAreas: ["Desk workers", "Runners", "Post-workout recovery"]
    },
    {
      id: "stretch4",
      name: "Standing Quad Stretch",
      description: "A static stretch that targets the quadriceps muscles in the front of the thigh.",
      muscleGroups: ["quadriceps", "hip flexors"],
      equipment: ["wall or chair for balance (optional)"],
      difficulty: "beginner",
      instructions: [
        "Stand on left foot, right hand on wall for balance if needed",
        "Bend right knee and grab right foot with right hand",
        "Pull heel toward buttocks until you feel a stretch",
        "Keep knees close together and stand tall",
        "Hold, then switch sides"
      ],
      imageUrl: "https://www.verywellfit.com/thmb/mVFD5ui6uCH5I-cHCj9opxqmwZk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/standing-quadriceps-stretch-b9780bd0b5964c1b90ef20240c4fa334.jpg",
      benefits: [
        "Relieves tight quadricep muscles",
        "Improves knee mobility",
        "Counteracts prolonged sitting"
      ],
      tips: [
        "Keep core engaged for balance",
        "Don't pull too hard - gentle tension is enough",
        "If balance is difficult, hold onto something stable"
      ],
      holdTime: 30,
      targetAreas: ["Runners", "Cyclists", "Post-leg workout"]
    }
  ],
  recovery: [
    {
      id: "stretch5",
      name: "Child's Pose",
      description: "A gentle resting pose that stretches the back, hips, and shoulders.",
      muscleGroups: ["lower back", "shoulders", "hips"],
      equipment: ["yoga mat or soft surface"],
      difficulty: "beginner",
      instructions: [
        "Kneel on floor with knees wide, big toes touching",
        "Sit back on heels and reach arms forward",
        "Rest forehead on floor and relax completely",
        "Breathe deeply and hold for 1-3 minutes"
      ],
      imageUrl: "https://www.verywellfit.com/thmb/tLE_yo98CiZI74-q_ccmfcvZdRg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Verywell-03-3567287-ChildsPose-598cec803df78c537bf19cdc.gif",
      benefits: [
        "Gently stretches spine, shoulders and hips",
        "Reduces stress and anxiety",
        "Relieves back and neck tension"
      ],
      tips: [
        "Place a pillow under forehead or torso for comfort if needed",
        "Arms can rest alongside body if shoulder tension exists",
        "Focus on deep, slow breathing to enhance relaxation"
      ],
      holdTime: 90,
      targetAreas: ["Stress relief", "Back pain", "Post-workout recovery"]
    },
    {
      id: "stretch6",
      name: "Supine Figure Four Stretch",
      description: "A gentle hip opener that targets the glutes and piriformis muscles.",
      muscleGroups: ["glutes", "hips", "lower back"],
      equipment: ["yoga mat or soft surface"],
      difficulty: "beginner",
      instructions: [
        "Lie on back with knees bent, feet flat on floor",
        "Cross right ankle over left thigh just above knee",
        "Thread right hand between legs, left hand around outside",
        "Clasp hands behind left thigh and gently pull toward chest",
        "Hold, then switch sides"
      ],
      imageUrl: "https://www.verywellfit.com/thmb/9iQJYAToHMj-wdizO5JgLTRdwJk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Verywell-42-3567607-SupinePiriformisStretch-598ca45b519de20011df16d6.gif",
      benefits: [
        "Relieves hip and lower back tension",
        "Targets hard-to-stretch piriformis muscle",
        "Can help with sciatic nerve pain"
      ],
      tips: [
        "Keep both feet flexed to protect knees",
        "Only pull as far as comfortable",
        "If neck strains, place a small pillow under head"
      ],
      holdTime: 45,
      targetAreas: ["Runners", "Cyclists", "Lower back pain", "Sciatica"]
    }
  ]
};

// Export for use elsewhere
export const STRETCH_EXERCISE_SETS = STRETCH_EXERCISES;

// Type for the fallback videos mapping
type FallbackVideoMapping = Record<string, YouTubeVideo[]>;

// Mapping stretch exercise IDs to fallback videos
const dynamicFallbacks: FallbackVideoMapping = {
  "stretch1": STRETCH_DYNAMIC_VIDEOS.slice(0, 2),
  "stretch2": STRETCH_DYNAMIC_VIDEOS.slice(2, 4)
};

// Mapping static exercise IDs to fallback videos
const staticFallbacks: FallbackVideoMapping = {
  "stretch3": STRETCH_STATIC_VIDEOS.slice(0, 2),
  "stretch4": STRETCH_STATIC_VIDEOS.slice(2, 4)
};

// Mapping recovery exercise IDs to fallback videos
const recoveryFallbacks: FallbackVideoMapping = {
  "stretch5": STRETCH_RECOVERY_VIDEOS.slice(0, 2),
  "stretch6": STRETCH_RECOVERY_VIDEOS.slice(2, 4)
};

// Combine fallbacks for use in the component
const allFallbacks = {
  ...dynamicFallbacks,
  ...staticFallbacks,
  ...recoveryFallbacks
};

// Main Stretch Exercises Component
export const StretchSpecificExercisesEnhanced = () => {
  const [activeTab, setActiveTab] = useState('dynamic');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Find video for an exercise using the YouTube API
  const findExerciseVideo = async (exercise: StretchExercise) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Search for specific exercise videos by name and type
      const searchTerms = [
        `${exercise.name} ${activeTab} stretch tutorial`,
        `how to do ${exercise.name} stretch properly`,
        `${exercise.name} flexibility exercise`
      ];
      
      const videos = await searchSectionSpecificExerciseVideos(searchTerms);
      setIsLoading(false);
      return videos;
    } catch (err) {
      console.error('Error fetching stretch video:', err);
      setError('Unable to load video. Using backup videos.');
      setIsLoading(false);
      return [];
    }
  };
  
  // Handle showing detailed exercise information
  const handleShowDetail = (exercise: StretchExercise) => {
    console.log('Showing detail for:', exercise.name);
    // This could open a dialog with more comprehensive information
    // For now, just log the action
  };
  
  return (
    <div className="mx-auto w-full max-w-4xl">
      <Card className="shadow-md border-pink-100">
        <div className="p-4 bg-gradient-to-r from-pink-50 to-white">
          <h2 className="text-2xl font-semibold text-pink-700 mb-2">Stretching Exercises</h2>
          <p className="text-gray-600 mb-4">
            Regular stretching improves flexibility, range of motion, and helps prevent injuries.
            Choose a stretching style below to get started.
          </p>
          
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4 flex items-start">
              <AlertCircle className="text-yellow-500 mr-2 flex-shrink-0 h-5 w-5 mt-0.5" />
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          )}
          
          <Tabs defaultValue="dynamic" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 bg-pink-100">
              <TabsTrigger value="dynamic" className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800">
                Dynamic
              </TabsTrigger>
              <TabsTrigger value="static" className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800">
                Static
              </TabsTrigger>
              <TabsTrigger value="recovery" className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800">
                Recovery
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dynamic" className="pt-4">
              <div className="mb-3 bg-pink-50 p-3 rounded-md">
                <h3 className="font-medium text-pink-800 mb-1">Dynamic Stretching</h3>
                <p className="text-sm text-gray-600">
                  Moving stretches that prepare muscles for activity. Ideal for warming up before exercise
                  to increase blood flow and range of motion.
                </p>
              </div>
              <div className="space-y-4">
                {STRETCH_EXERCISES.dynamic.map((exercise) => (
                  <EnhancedExerciseCard 
                    key={exercise.id}
                    exercise={exercise}
                    category="dynamic"
                    sectionColor="#FF3B77"
                    loadExerciseVideo={findExerciseVideo}
                    onShowExerciseDetail={handleShowDetail}
                    fallbackVideos={allFallbacks}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="static" className="pt-4">
              <div className="mb-3 bg-pink-50 p-3 rounded-md">
                <h3 className="font-medium text-pink-800 mb-1">Static Stretching</h3>
                <p className="text-sm text-gray-600">
                  Holding a position for a period of time to gradually lengthen a muscle. Best performed after
                  workouts or as a separate flexibility routine.
                </p>
              </div>
              <div className="space-y-4">
                {STRETCH_EXERCISES.static.map((exercise) => (
                  <EnhancedExerciseCard 
                    key={exercise.id}
                    exercise={exercise}
                    category="static"
                    sectionColor="#FF3B77"
                    loadExerciseVideo={findExerciseVideo}
                    onShowExerciseDetail={handleShowDetail}
                    fallbackVideos={allFallbacks}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="recovery" className="pt-4">
              <div className="mb-3 bg-pink-50 p-3 rounded-md">
                <h3 className="font-medium text-pink-800 mb-1">Recovery Stretches</h3>
                <p className="text-sm text-gray-600">
                  Gentle, relaxing stretches designed to promote recovery and reduce muscle soreness.
                  Perfect for cool-downs and rest days.
                </p>
              </div>
              <div className="space-y-4">
                {STRETCH_EXERCISES.recovery.map((exercise) => (
                  <EnhancedExerciseCard 
                    key={exercise.id}
                    exercise={exercise}
                    category="recovery"
                    sectionColor="#FF3B77"
                    loadExerciseVideo={findExerciseVideo}
                    onShowExerciseDetail={handleShowDetail}
                    fallbackVideos={allFallbacks}
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

export default StretchSpecificExercisesEnhanced;