import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import HIITSpecificExercisesEnhanced from './hiit-specific-exercises-enhanced';
import YogaSpecificExercisesEnhanced from './yoga-specific-exercises-enhanced';
import StretchSpecificExercisesEnhanced from './stretch-specific-exercises-enhanced';
import RunningSpecificExercisesEnhanced from './running-specific-exercises-enhanced';
import WeightliftingSpecificExercisesEnhanced from './weightlifting-specific-exercises-enhanced';
import MeditationSpecificExercisesEnhanced from './meditation-specific-exercises-enhanced';
import ActiveYouMetricsDashboard from './active-you-metrics-dashboard';
import { Activity } from 'lucide-react';
import { ExerciseType } from '@/modules/active-you/context/module-context';
import { trackFitnessActivity, getFitnessActivityStats } from '@/lib/active-you-integration';

// Export the StretchingIcon for backward compatibility with active-you.tsx
export const StretchingIcon = Activity;

/**
 * Enhanced ActiveYou component that showcases the redesigned exercise cards
 * This component serves as a container for the different exercise types
 */
export default function ActiveYouEnhanced() {
  const [activeTab, setActiveTab] = useState('hiit');
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ActiveYou</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore different exercise modalities to improve your fitness and wellness.
          Each section features exercises with detailed instructions, benefits, and tutorial videos.
        </p>
      </div>
      
      <Card className="shadow-md border-pink-100 mb-8">
        <Tabs defaultValue="hiit" value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="p-4 border-b bg-gradient-to-r from-pink-50 to-white">
            <TabsList className="grid w-full grid-cols-6 bg-pink-100">
              <TabsTrigger 
                value="hiit" 
                className="data-[state=active]:bg-pink-500 data-[state=active]:text-white"
              >
                HIIT
              </TabsTrigger>
              <TabsTrigger 
                value="yoga" 
                className="data-[state=active]:bg-pink-500 data-[state=active]:text-white"
              >
                Yoga
              </TabsTrigger>
              <TabsTrigger 
                value="running" 
                className="data-[state=active]:bg-pink-500 data-[state=active]:text-white"
              >
                Running
              </TabsTrigger>
              <TabsTrigger 
                value="weightlifting" 
                className="data-[state=active]:bg-pink-500 data-[state=active]:text-white"
              >
                Weightlifting
              </TabsTrigger>
              <TabsTrigger 
                value="stretch" 
                className="data-[state=active]:bg-pink-500 data-[state=active]:text-white"
              >
                Stretching
              </TabsTrigger>
              <TabsTrigger 
                value="meditation" 
                className="data-[state=active]:bg-pink-500 data-[state=active]:text-white"
              >
                Meditation
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="p-4">
            <TabsContent value="hiit" className="mt-0">
              <div className="bg-gradient-to-br from-pink-50 to-white p-4 rounded-md mb-4">
                <h2 className="text-xl font-semibold text-pink-700 mb-1">High-Intensity Interval Training</h2>
                <p className="text-gray-600">
                  HIIT alternates short periods of intense exercise with less intense recovery periods.
                  These workouts are efficient and effective for burning calories and improving cardiovascular health.
                </p>
              </div>
              <HIITSpecificExercisesEnhanced />
            </TabsContent>
            
            <TabsContent value="yoga" className="mt-0">
              <div className="bg-gradient-to-br from-pink-50 to-white p-4 rounded-md mb-4">
                <h2 className="text-xl font-semibold text-pink-700 mb-1">Yoga Practice</h2>
                <p className="text-gray-600">
                  Yoga combines physical postures with breathing techniques and mindfulness.
                  Regular practice can improve flexibility, strength, balance, and mental wellbeing.
                </p>
              </div>
              <YogaSpecificExercisesEnhanced />
            </TabsContent>
            
            <TabsContent value="running" className="mt-0">
              <div className="bg-gradient-to-br from-pink-50 to-white p-4 rounded-md mb-4">
                <h2 className="text-xl font-semibold text-pink-700 mb-1">Running Training</h2>
                <p className="text-gray-600">
                  Running is a versatile cardio exercise that improves endurance, strengthens your heart, and helps with weight management.
                  These exercises will help you build running strength, endurance, and proper form.
                </p>
              </div>
              <RunningSpecificExercisesEnhanced />
            </TabsContent>
            
            <TabsContent value="weightlifting" className="mt-0">
              <div className="bg-gradient-to-br from-pink-50 to-white p-4 rounded-md mb-4">
                <h2 className="text-xl font-semibold text-pink-700 mb-1">Strength Training</h2>
                <p className="text-gray-600">
                  Strength training builds muscle, increases bone density, and improves overall body composition.
                  These exercises will help you develop functional strength for everyday activities and sports.
                </p>
              </div>
              <WeightliftingSpecificExercisesEnhanced />
            </TabsContent>
            
            <TabsContent value="stretch" className="mt-0">
              <div className="bg-gradient-to-br from-pink-50 to-white p-4 rounded-md mb-4">
                <h2 className="text-xl font-semibold text-pink-700 mb-1">Stretching Exercises</h2>
                <p className="text-gray-600">
                  Regular stretching improves flexibility, increases range of motion, and helps prevent injuries.
                  Different types of stretching serve different purposes in your fitness routine.
                </p>
              </div>
              <StretchSpecificExercisesEnhanced />
            </TabsContent>
            
            <TabsContent value="meditation" className="mt-0">
              <div className="bg-gradient-to-br from-pink-50 to-white p-4 rounded-md mb-4">
                <h2 className="text-xl font-semibold text-pink-700 mb-1">Meditation Practices</h2>
                <p className="text-gray-600">
                  Meditation reduces stress, improves focus, and enhances overall mental wellbeing.
                  These guided sessions will help you develop mindfulness and relaxation techniques.
                </p>
              </div>
              <MeditationSpecificExercisesEnhanced />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
      
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        {/* Metrics Dashboard - Shows connections to other platform features */}
        <ActiveYouMetricsDashboard />
        
        {/* Recommendations & Tracking Section */}
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="flex-1 p-4 border shadow-sm">
            <h3 className="text-lg font-semibold text-pink-700 mb-2">Personalized Recommendations</h3>
            <p className="text-gray-600 text-sm mb-3">
              Our AI assistant Fundi can analyze your exercise preferences and create a custom plan tailored to your goals and constraints.
            </p>
            <div className="bg-pink-50 p-3 rounded-md">
              <p className="text-sm text-pink-700 font-medium">Popular recommendations:</p>
              <ul className="text-sm text-gray-600 mt-1 pl-4 space-y-1 list-disc">
                <li>Morning energy boosters (5-10 min)</li>
                <li>Office desk stretches for posture</li>
                <li>Recovery routines for post-workout</li>
                <li>Stress-reducing mindful movement</li>
              </ul>
            </div>
          </Card>
          
          <Card className="flex-1 p-4 border shadow-sm">
            <h3 className="text-lg font-semibold text-pink-700 mb-2">Track Your Progress</h3>
            <p className="text-gray-600 text-sm mb-3">
              Log your workouts and build consistency with our simple tracking tools. Your completed activities automatically connect to your learning paths.
            </p>
            <Button 
              className="w-full bg-pink-600 hover:bg-pink-700 text-white"
              onClick={() => {
                const stats = getFitnessActivityStats();
                toast({
                  title: "Activity Tracked",
                  description: `You've completed ${stats.totalWorkouts} workouts so far. Keep it up!`,
                  variant: "default"
                });
                
                // Example of how tracking would work
                trackFitnessActivity({
                  id: `workout-${Date.now()}`,
                  type: activeTab as ExerciseType,
                  timestamp: new Date(),
                  duration: 20,
                  details: {
                    intensity: "moderate"
                  }
                });
              }}
            >
              Log Completed Workout
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}