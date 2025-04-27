import { useState, useEffect } from 'react';
import { EnhancedExerciseCard, BaseExercise } from "@/components/ui/enhanced-exercise-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { searchSectionSpecificExerciseVideos, YouTubeVideo } from '@/lib/youtube-service';
import { 
  YOGA_BEGINNER_VIDEOS,
  YOGA_INTERMEDIATE_VIDEOS,
  YOGA_ADVANCED_VIDEOS
} from '@/lib/section-fallbacks';
import { ExerciseType } from '@/modules/active-you/context/module-context';
import ActivitySpecificRecommendations from './activity-specific-recommendations';
import { Workout, YogaWorkout } from '@/lib/workout-generation-service';

// Define Yoga Exercise interface that extends the BaseExercise
interface YogaExercise extends BaseExercise {
  breathwork?: string;
  duration?: number; // in seconds
  chakraAlignment?: string[];
  // Additional yoga-specific properties can be added here
}

// Sample exercise data
export const YOGA_EXERCISES = {
  beginner: [
    {
      id: "yoga1",
      name: "Downward Dog",
      description: "A fundamental yoga pose that stretches and strengthens the entire body.",
      muscleGroups: ["shoulders", "hamstrings", "calves", "back"],
      equipment: ["yoga mat"],
      difficulty: "beginner",
      instructions: [
        "Start on hands and knees",
        "Lift knees off the floor and push hips up",
        "Straighten legs as much as comfortable",
        "Create an inverted V-shape with your body"
      ],
      imageUrl: "https://www.yogajournal.com/wp-content/uploads/2022/01/Downward-Facing-Dog_Andrew-Clark.jpg",
      benefits: [
        "Stretches the spine, shoulders, hamstrings and calves",
        "Strengthens the arms, shoulders and legs",
        "Improves circulation and energizes the body"
      ],
      tips: [
        "Bend your knees if hamstrings are tight",
        "Press your heels toward the floor (they don't need to touch)",
        "Distribute weight evenly between hands and feet"
      ],
      breathwork: "Deep, steady breathing through the nose",
      duration: 30,
      chakraAlignment: ["Root", "Solar Plexus"]
    },
    {
      id: "yoga2",
      name: "Child's Pose",
      description: "A restful pose that gently stretches the back, hips, and legs.",
      muscleGroups: ["back", "hips", "ankles"],
      equipment: ["yoga mat"],
      difficulty: "beginner",
      instructions: [
        "Kneel on the floor with toes together, knees apart",
        "Sit back on heels and extend arms forward",
        "Rest forehead on the mat",
        "Breathe deeply and relax into the pose"
      ],
      imageUrl: "https://www.yogajournal.com/wp-content/uploads/2022/01/Childs-Pose_Andrew-Clark.jpg",
      benefits: [
        "Releases tension in the back, shoulders and chest",
        "Calms the mind and reduces stress",
        "Gently stretches hips, thighs and ankles"
      ],
      tips: [
        "Place a blanket under knees for comfort if needed",
        "Arms can be alongside body with palms up for deeper relaxation",
        "Focus on slow, deep breaths to enhance relaxation"
      ],
      breathwork: "Slow, deep breathing to relax the body",
      duration: 60,
      chakraAlignment: ["Root", "Crown"]
    }
  ],
  intermediate: [
    {
      id: "yoga3",
      name: "Warrior II",
      description: "A standing pose that builds strength and stability.",
      muscleGroups: ["legs", "core", "shoulders"],
      equipment: ["yoga mat"],
      difficulty: "intermediate",
      instructions: [
        "Step feet 3-4 feet apart, parallel to mat edges",
        "Turn right foot out 90 degrees, left foot slightly in",
        "Bend right knee to 90 degrees over ankle",
        "Extend arms parallel to floor",
        "Gaze over right fingertips"
      ],
      imageUrl: "https://www.yogajournal.com/wp-content/uploads/2022/01/Warrior-II_Andrew-Clark.jpg",
      benefits: [
        "Strengthens legs, ankles and feet",
        "Opens hips and chest",
        "Improves focus and concentration"
      ],
      tips: [
        "Keep front knee aligned with ankle, not beyond toes",
        "Press outer edge of back foot firmly into mat",
        "Keep shoulders relaxed, away from ears"
      ],
      breathwork: "Strong, steady breathing to build heat",
      duration: 45,
      chakraAlignment: ["Sacral", "Solar Plexus"]
    },
    {
      id: "yoga4",
      name: "Tree Pose",
      description: "A balancing pose that improves focus and stability.",
      muscleGroups: ["legs", "core", "ankles"],
      equipment: ["yoga mat"],
      difficulty: "intermediate",
      instructions: [
        "Begin standing with feet together",
        "Shift weight to left foot",
        "Place right foot on inner left thigh or calf (not on knee)",
        "Bring hands to heart center or extend upward",
        "Fix gaze on a single point"
      ],
      imageUrl: "https://www.yogajournal.com/wp-content/uploads/2022/01/Tree-Pose_Andrew-Clark.jpg",
      benefits: [
        "Improves balance and focus",
        "Strengthens ankles, calves and thighs",
        "Opens hips and stretches inner thighs"
      ],
      tips: [
        "Use a wall for support if needed",
        "Start with foot lower on leg for stability",
        "Engage your core for better balance"
      ],
      breathwork: "Smooth, consistent breathing to maintain balance",
      duration: 30,
      chakraAlignment: ["Root", "Heart"]
    }
  ],
  advanced: [
    {
      id: "yoga5",
      name: "Crow Pose",
      description: "An arm balancing pose that builds upper body strength and focus.",
      muscleGroups: ["arms", "wrists", "core", "shoulders"],
      equipment: ["yoga mat"],
      difficulty: "advanced",
      instructions: [
        "Start in a squat with feet together",
        "Place hands shoulder-width apart on mat",
        "Bend elbows slightly and place knees on upper arms",
        "Lean forward and lift feet off floor one at a time",
        "Balance on hands with knees resting on upper arms"
      ],
      imageUrl: "https://www.yogajournal.com/wp-content/uploads/2022/01/Crow-Pose_Andrew-Clark.jpg",
      benefits: [
        "Strengthens arms, wrists and core",
        "Improves balance and focus",
        "Builds confidence and mental strength"
      ],
      tips: [
        "Place a pillow in front of you when learning",
        "Gaze slightly forward, not down at the floor",
        "Keep core engaged and round upper back"
      ],
      breathwork: "Steady, focused breathing to maintain balance",
      duration: 20,
      chakraAlignment: ["Solar Plexus", "Third Eye"]
    },
    {
      id: "yoga6",
      name: "Headstand",
      description: "An inversion that builds strength, balance, and focus.",
      muscleGroups: ["shoulders", "arms", "core"],
      equipment: ["yoga mat", "yoga block (optional)"],
      difficulty: "advanced",
      instructions: [
        "Kneel and place forearms on mat, interlace fingers",
        "Place crown of head on mat with back of head in palms",
        "Straighten legs and walk feet toward head",
        "Lift one leg up, then the other",
        "Balance with legs extended upward"
      ],
      imageUrl: "https://www.yogajournal.com/wp-content/uploads/2022/01/Headstand_Andrew-Clark.jpg",
      benefits: [
        "Increases blood flow to brain",
        "Strengthens shoulders, arms and upper back",
        "Improves focus and confidence"
      ],
      tips: [
        "Practice against a wall for support",
        "Never put pressure on neck, weight should be on forearms",
        "Engage core throughout the pose"
      ],
      breathwork: "Calm, measured breathing to maintain stability",
      duration: 30,
      chakraAlignment: ["Crown", "Third Eye"]
    }
  ]
};

// Export for use elsewhere
export const YOGA_EXERCISE_SETS = YOGA_EXERCISES;

// Type for the fallback videos mapping
type FallbackVideoMapping = Record<string, YouTubeVideo[]>;

// Mapping yoga exercise IDs to fallback videos
const beginnerFallbacks: FallbackVideoMapping = {
  "yoga1": YOGA_BEGINNER_VIDEOS.slice(0, 2),
  "yoga2": YOGA_BEGINNER_VIDEOS.slice(2, 4)
};

// Mapping intermediate exercise IDs to fallback videos
const intermediateFallbacks: FallbackVideoMapping = {
  "yoga3": YOGA_INTERMEDIATE_VIDEOS.slice(0, 2),
  "yoga4": YOGA_INTERMEDIATE_VIDEOS.slice(2, 4)
};

// Mapping advanced exercise IDs to fallback videos
const advancedFallbacks: FallbackVideoMapping = {
  "yoga5": YOGA_ADVANCED_VIDEOS.slice(0, 2),
  "yoga6": YOGA_ADVANCED_VIDEOS.slice(2, 4)
};

// Combine fallbacks for use in the component
const allFallbacks = {
  ...beginnerFallbacks,
  ...intermediateFallbacks,
  ...advancedFallbacks
};

// Main Yoga Exercises Component
const YogaSpecificExercisesEnhanced = () => {
  const [activeTab, setActiveTab] = useState('beginner');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentWorkout, setCurrentWorkout] = useState<YogaWorkout | null>(null);
  
  // Find video for an exercise using the YouTube API
  const findExerciseVideo = async (exercise: YogaExercise) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Search for specific exercise videos by name and level
      const searchTerms = `${exercise.name} ${activeTab} yoga pose`;
      
      const videos = await searchSectionSpecificExerciseVideos(
        'yoga', 
        exercise.name, 
        exercise.equipment?.join(', '), 
        exercise.muscleGroups
      );
      setIsLoading(false);
      return videos;
    } catch (err) {
      console.error('Error fetching yoga video:', err);
      setError('Unable to load video. Using backup videos.');
      setIsLoading(false);
      return [];
    }
  };
  
  // Handle showing detailed exercise information
  const handleShowDetail = (exercise: YogaExercise) => {
    console.log('Showing detail for:', exercise.name);
    // This could open a dialog with more comprehensive information
    // For now, just log the action
  };
  
  // Handle starting a workout
  const handleStartWorkout = (workout: Workout) => {
    setCurrentWorkout(workout as YogaWorkout);
    // Future implementation: Show the workout flow or timer
  };
  
  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Apple-inspired ultra-minimalist container - full width on mobile with subtle border */}
      <div className="w-full bg-white border-l-4 border-pink-300 md:border-l-0 md:shadow-md md:border md:border-pink-100 md:rounded-xl overflow-hidden">
        <div className="p-2 md:p-4 bg-white">
          {/* Header section with simplified styling */}
          <h2 className="text-xl md:text-2xl font-medium text-gray-800 pl-1 mb-1 md:mb-2">Yoga Practice</h2>
          
          {/* Collapsible description for mobile - only shows on larger screens by default */}
          <p className="hidden md:block text-gray-600 mb-4">
            Yoga combines physical postures, breathing techniques, and meditation to improve strength, flexibility, and mental wellbeing.
          </p>
          
          {/* Error alert with iOS-style design */}
          {error && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-2 md:p-3 mb-3 flex items-start rounded-r">
              <AlertCircle className="text-yellow-500 mr-2 flex-shrink-0 h-4 w-4 mt-0.5" />
              <p className="text-xs md:text-sm text-yellow-700">{error}</p>
            </div>
          )}
          
          {/* iOS-style tab navigation */}
          <Tabs defaultValue="beginner" value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Horizontal scrollable tabs for mobile */}
            <div className="relative mb-2 md:mb-4">
              <TabsList className="w-full overflow-x-auto flex md:grid md:grid-cols-4 no-scrollbar rounded-full bg-gray-100 p-0.5 border border-gray-200">
                <TabsTrigger 
                  value="beginner" 
                  className="flex-1 whitespace-nowrap text-sm py-1.5 px-3 md:px-4 rounded-full data-[state=active]:bg-white data-[state=active]:text-pink-800 data-[state=active]:shadow-sm"
                >
                  Beginner
                </TabsTrigger>
                <TabsTrigger 
                  value="intermediate" 
                  className="flex-1 whitespace-nowrap text-sm py-1.5 px-3 md:px-4 rounded-full data-[state=active]:bg-white data-[state=active]:text-pink-800 data-[state=active]:shadow-sm"
                >
                  Intermediate
                </TabsTrigger>
                <TabsTrigger 
                  value="advanced" 
                  className="flex-1 whitespace-nowrap text-sm py-1.5 px-3 md:px-4 rounded-full data-[state=active]:bg-white data-[state=active]:text-pink-800 data-[state=active]:shadow-sm"
                >
                  Advanced
                </TabsTrigger>
                <TabsTrigger 
                  value="recommendations" 
                  className="flex-1 whitespace-nowrap text-sm py-1.5 px-3 md:px-4 rounded-full data-[state=active]:bg-white data-[state=active]:text-pink-800 data-[state=active]:shadow-sm"
                >
                  For You
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Activity recommendations - only show this component on the recommendations tab on mobile */}
            <div className={`${activeTab === 'recommendations' ? 'block' : 'hidden md:block'} mb-3 md:mb-4`}>
              <ActivitySpecificRecommendations 
                activityType="yoga"
                onStartWorkout={handleStartWorkout} 
              />
            </div>
            
            {/* Beginner tab content with minimalist styling on mobile */}
            <TabsContent value="beginner" className="pt-0 md:pt-3">
              {/* iOS-style minimal section header */}
              <div className="mb-2 md:mb-3 pl-1 border-b border-gray-100 pb-1 md:border-l-2 md:border-b-0 md:border-pink-400 md:pl-2 md:py-1 md:p-3 md:rounded-md">
                <h3 className="font-medium text-gray-800 text-sm md:text-base">Beginner Poses</h3>
                {/* Description only on desktop */}
                <p className="hidden md:block text-xs md:text-sm text-gray-600 mt-1">
                  These foundational poses focus on proper alignment and building body awareness.
                </p>
              </div>
              <div className="space-y-2 md:space-y-3">
                {YOGA_EXERCISES.beginner.map((exercise) => (
                  <EnhancedExerciseCard 
                    key={exercise.id}
                    exercise={exercise}
                    category="beginner"
                    sectionColor="#FF3B77"
                    loadExerciseVideo={findExerciseVideo}
                    onShowExerciseDetail={handleShowDetail}
                    fallbackVideos={allFallbacks}
                  />
                ))}
              </div>
            </TabsContent>
            
            {/* Intermediate tab content with minimalist styling on mobile */}
            <TabsContent value="intermediate" className="pt-0 md:pt-3">
              <div className="mb-2 md:mb-3 pl-1 border-b border-gray-100 pb-1 md:border-l-2 md:border-b-0 md:border-pink-400 md:pl-2 md:py-1 md:p-3 md:rounded-md">
                <h3 className="font-medium text-gray-800 text-sm md:text-base">Intermediate Poses</h3>
                <p className="hidden md:block text-xs md:text-sm text-gray-600 mt-1">
                  These poses build on fundamentals to incorporate balance, strength, and flexibility.
                </p>
              </div>
              <div className="space-y-2 md:space-y-3">
                {YOGA_EXERCISES.intermediate.map((exercise) => (
                  <EnhancedExerciseCard 
                    key={exercise.id}
                    exercise={exercise}
                    category="intermediate"
                    sectionColor="#FF3B77"
                    loadExerciseVideo={findExerciseVideo}
                    onShowExerciseDetail={handleShowDetail}
                    fallbackVideos={allFallbacks}
                  />
                ))}
              </div>
            </TabsContent>
            
            {/* Advanced tab content with minimalist styling on mobile */}
            <TabsContent value="advanced" className="pt-0 md:pt-3">
              <div className="mb-2 md:mb-3 pl-1 border-b border-gray-100 pb-1 md:border-l-2 md:border-b-0 md:border-pink-400 md:pl-2 md:py-1 md:p-3 md:rounded-md">
                <h3 className="font-medium text-gray-800 text-sm md:text-base">Advanced Poses</h3>
                <p className="hidden md:block text-xs md:text-sm text-gray-600 mt-1">
                  These challenging poses require strength, flexibility, and body awareness.
                </p>
              </div>
              <div className="space-y-2 md:space-y-3">
                {YOGA_EXERCISES.advanced.map((exercise) => (
                  <EnhancedExerciseCard 
                    key={exercise.id}
                    exercise={exercise}
                    category="advanced"
                    sectionColor="#FF3B77"
                    loadExerciseVideo={findExerciseVideo}
                    onShowExerciseDetail={handleShowDetail}
                    fallbackVideos={allFallbacks}
                  />
                ))}
              </div>
            </TabsContent>
            
            {/* Recommendations Tab with minimalist styling on mobile */}
            <TabsContent value="recommendations" className="pt-0 md:pt-3">
              {/* On desktop, this is duplicated from above, but on mobile it's the main display */}
              <ActivitySpecificRecommendations 
                activityType="yoga" 
                onStartWorkout={handleStartWorkout}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default YogaSpecificExercisesEnhanced;