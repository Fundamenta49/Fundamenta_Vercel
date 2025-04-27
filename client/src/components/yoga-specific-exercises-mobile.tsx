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
import { YOGA_EXERCISES } from './yoga-specific-exercises-enhanced';

// Define Yoga Exercise interface that extends the BaseExercise
interface YogaExercise extends BaseExercise {
  breathwork?: string;
  duration?: number; // in seconds
  chakraAlignment?: string[];
  // Additional yoga-specific properties can be added here
}

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

// Main Yoga Exercises Component with Apple-inspired minimalist design
const YogaSpecificExercisesMobile = () => {
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
      {/* Apple-inspired ultra-minimalist container - clean borders and no background on mobile */}
      <div className="w-full bg-white border-l-0 sm:border-l-0 md:shadow-md md:border md:border-gray-100 md:rounded-xl overflow-hidden">
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
                  className="flex-1 whitespace-nowrap text-sm py-1.5 px-3 md:px-4 rounded-full data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm"
                >
                  Beginner
                </TabsTrigger>
                <TabsTrigger 
                  value="intermediate" 
                  className="flex-1 whitespace-nowrap text-sm py-1.5 px-3 md:px-4 rounded-full data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm"
                >
                  Intermediate
                </TabsTrigger>
                <TabsTrigger 
                  value="advanced" 
                  className="flex-1 whitespace-nowrap text-sm py-1.5 px-3 md:px-4 rounded-full data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm"
                >
                  Advanced
                </TabsTrigger>
                <TabsTrigger 
                  value="recommendations" 
                  className="flex-1 whitespace-nowrap text-sm py-1.5 px-3 md:px-4 rounded-full data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm"
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
              <div className="mb-2 md:mb-3 pl-1 border-b border-gray-100 pb-1 md:border-l-2 md:border-b-0 md:border-gray-300 md:pl-2 md:py-1 md:p-3 md:rounded-md">
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
                    sectionColor="#6B7280"
                    loadExerciseVideo={findExerciseVideo}
                    onShowExerciseDetail={handleShowDetail}
                    fallbackVideos={allFallbacks}
                  />
                ))}
              </div>
            </TabsContent>
            
            {/* Intermediate tab content with minimalist styling on mobile */}
            <TabsContent value="intermediate" className="pt-0 md:pt-3">
              <div className="mb-2 md:mb-3 pl-1 border-b border-gray-100 pb-1 md:border-l-2 md:border-b-0 md:border-gray-300 md:pl-2 md:py-1 md:p-3 md:rounded-md">
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
                    sectionColor="#6B7280"
                    loadExerciseVideo={findExerciseVideo}
                    onShowExerciseDetail={handleShowDetail}
                    fallbackVideos={allFallbacks}
                  />
                ))}
              </div>
            </TabsContent>
            
            {/* Advanced tab content with minimalist styling on mobile */}
            <TabsContent value="advanced" className="pt-0 md:pt-3">
              <div className="mb-2 md:mb-3 pl-1 border-b border-gray-100 pb-1 md:border-l-2 md:border-b-0 md:border-gray-300 md:pl-2 md:py-1 md:p-3 md:rounded-md">
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
                    sectionColor="#6B7280"
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

export default YogaSpecificExercisesMobile;