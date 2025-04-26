// Import the enhanced version and the specific exercise components
import { useState, useEffect } from 'react';
import { StretchingIcon } from "./active-you-enhanced";
import HIITSpecificExercisesEnhanced from './hiit-specific-exercises-enhanced';
import YogaSpecificExercisesEnhanced from './yoga-specific-exercises-enhanced';
import StretchSpecificExercisesEnhanced from './stretch-specific-exercises-enhanced';
import RunningSpecificExercisesEnhanced from './running-specific-exercises-enhanced';
import WeightliftingSpecificExercisesEnhanced from './weightlifting-specific-exercises-enhanced';
import MeditationSpecificExercisesEnhanced from './meditation-specific-exercises-enhanced';
import YogaVisionEnhanced from './yoga-vision-enhanced';
import YogaGridInterface from './yoga-grid-interface';
import { Card } from "@/components/ui/card";
import { ExerciseType } from "../modules/active-you/context/module-context";

// Interface for YogaVision analysis results
interface PoseAnalysis {
  poseName?: string;
  poseId?: string;
  score?: number;
  feedback?: string[];
  [key: string]: any;
}
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Camera, 
  ArrowLeft,
  Brain,
  Timer,
  MapPin,
  Activity,
  Heart,
  ArrowRight,
  Trophy,
  Award
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { recordArcadeActivity, isExerciseInActiveChallenge, getExercisePointValue } from '@/lib/learning-path-integration';
import { 
  notifyExerciseStarted, 
  notifyExerciseCompleted, 
  notifyPoseAnalyzed, 
  notifyRunTracked, 
  notifyMeditationCompleted 
} from '@/lib/active-you-ai-integration';
import { useLocation } from 'wouter';

// Re-export the StretchingIcon for backward compatibility
export { StretchingIcon };

// Create a dedicated component that renders only the selected exercise content
interface ActiveYouProps {
  defaultTab: ExerciseType;
}

export default function ActiveYou({ defaultTab = 'meditation' }: ActiveYouProps) {
  // State for AI feature dialogs
  const [isYogaVisionOpen, setIsYogaVisionOpen] = useState(false);
  const [selectedYogaPoseId, setSelectedYogaPoseId] = useState<string>("");
  const [showPointsEarned, setShowPointsEarned] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [inChallenge, setInChallenge] = useState(false);
  
  // Toast notification
  const { toast } = useToast();
  
  // Navigation hooks
  const [, navigate] = useLocation();
  
  // For demo purposes, we'll use a hardcoded user ID
  const userId = 1;
  
  // Track the exercise activity with the arcade and learning path on component mount
  useEffect(() => {
    // Record that the user started this exercise type
    recordArcadeActivity(userId, defaultTab, 'started');
    
    // Check if this exercise is part of an active challenge
    const isInChallenge = isExerciseInActiveChallenge(defaultTab);
    setInChallenge(isInChallenge);
    
    // Set potential points to be earned
    setPointsEarned(getExercisePointValue(defaultTab));
    
    // Notify Fundi about this exercise session
    notifyExerciseStarted(defaultTab);
    
    return () => {
      // When unmounting the component, we can assume the user navigated away
      // This is a good place to notify Fundi that the session has ended
      console.log(`Exercise session for ${defaultTab} has ended`);
    };
  }, [defaultTab]);
  
  // Handle exercise completion
  const handleExerciseCompleted = (exerciseId: string) => {
    // Show points earned animation
    setShowPointsEarned(true);
    
    // Record completion with arcade system
    recordArcadeActivity(userId, defaultTab, 'completed');
    
    // Notify Fundi about the completed exercise
    notifyExerciseCompleted(defaultTab, exerciseId, 15 * 60); // assume 15 min duration for demo
    
    // Hide points after 3 seconds
    setTimeout(() => {
      setShowPointsEarned(false);
    }, 3000);
  };
  
  // Handle navigation to challenge details page
  const handleViewChallenge = () => {
    console.log('Viewing challenge details for:', defaultTab);
    // Navigate to the arcade challenges page
    navigate('/arcade?tab=challenges');
  };
  
  // Render the appropriate AI feature button based on exercise type
  const renderAIFeatureButton = () => {
    switch (defaultTab) {
      case 'yoga':
        return (
          <Button 
            onClick={() => setIsYogaVisionOpen(true)} 
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
          >
            <Camera className="w-5 h-5 mr-2" />
            Open YogaVision AI Pose Analysis
          </Button>
        );
      case 'meditation':
        return (
          <Button 
            onClick={() => console.log('Generate AI Meditation')} 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            <Brain className="w-5 h-5 mr-2" />
            Generate AI-Guided Meditation
          </Button>
        );
      case 'running':
        return (
          <Button 
            onClick={() => console.log('Start GPS Run Tracking')} 
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Start GPS Run Tracking
          </Button>
        );
      default:
        return null;
    }
  };

  // Render only the selected exercise component based on the tab
  const renderExerciseContent = () => {
    switch (defaultTab) {
      case 'hiit':
        return (
          <div className="bg-gradient-to-br from-pink-50 to-white p-4 rounded-md mb-4">
            <h2 className="text-xl font-semibold text-pink-700 mb-1">High-Intensity Interval Training</h2>
            <p className="text-gray-600">
              HIIT alternates short periods of intense exercise with less intense recovery periods.
              These workouts are efficient and effective for burning calories and improving cardiovascular health.
            </p>
            <HIITSpecificExercisesEnhanced />
          </div>
        );
      case 'yoga':
        return (
          <div className="p-4 rounded-md mb-4">
            <h2 className="text-xl font-semibold text-pink-700 mb-1">Yoga Practice</h2>
            <p className="text-gray-600 mb-6">
              Yoga combines physical postures with breathing techniques and mindfulness.
              Regular practice can improve flexibility, strength, balance, and mental wellbeing.
            </p>
            
            {/* New YogaGridInterface Component - Each card has its own YogaVision integration */}
            <YogaGridInterface />
            
            {/* Remove the main YogaVision dialog since each pose card has its own integrated camera */}
            {/* The old YogaVision dialog code is kept for reference */}
            {/*
            <Dialog open={isYogaVisionOpen} onOpenChange={setIsYogaVisionOpen}>
              <DialogContent 
                className="max-w-4xl p-0 rounded-xl shadow-lg mx-auto"
                style={{
                  width: "94vw",
                  height: "auto",
                  maxHeight: "95vh",
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  overflow: "auto"
                }}>
                <div className="px-4 sm:px-6 pt-4 sm:pt-6">
                  <DialogHeader>
                    <DialogTitle>YogaVision AI Pose Analysis</DialogTitle>
                    <DialogDescription>
                      Upload a photo of your yoga pose to receive AI-powered feedback on form and alignment
                    </DialogDescription>
                  </DialogHeader>
                </div>
                
                <div className="px-4 sm:px-6 pb-6">
                  <YogaVisionEnhanced 
                    initialPoseId={selectedYogaPoseId}
                    onClose={() => setIsYogaVisionOpen(false)}
                    onAnalysisComplete={(analysis: PoseAnalysis | null) => {
                      console.log('Analysis completed:', analysis);
                      
                      // Notify Fundi about the pose analysis
                      if (analysis) {
                        notifyPoseAnalyzed(
                          analysis.poseName || 'Unknown Pose',
                          analysis.score || 0,
                          analysis.feedback || ['Analysis completed successfully']
                        );
                        
                        // If this was a complete analysis, also count it as an exercise completion
                        if (analysis.score && analysis.score > 0.7) {
                          handleExerciseCompleted('yoga-pose-' + (analysis.poseId || 'unknown'));
                        }
                      }
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>
            */}
          </div>
        );
      case 'running':
        return (
          <div className="bg-gradient-to-br from-pink-50 to-white p-4 rounded-md mb-4">
            <h2 className="text-xl font-semibold text-pink-700 mb-1">Running Training</h2>
            <p className="text-gray-600">
              Running is a versatile cardio exercise that improves endurance, strengthens your heart, and helps with weight management.
              These exercises will help you build running strength, endurance, and proper form.
            </p>
            
            {/* GPS Run Tracking Feature Button */}
            <div className="my-4 p-3 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-100">
              <div className="flex items-center mb-2">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <MapPin className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <h3 className="font-medium text-green-800">GPS Run Tracking</h3>
                  <p className="text-sm text-gray-600">Track your runs with real-time pace, distance, and route mapping</p>
                </div>
              </div>
              <Button 
                onClick={() => {
                  const requestLocationPermission = async () => {
                    try {
                      // Check if permission is already granted
                      const savedPermission = localStorage.getItem('location_permission');
                      
                      if (savedPermission === 'granted') {
                        // Permission already granted, navigate to running tracker
                        navigateToRunningTracker();
                        return;
                      }
                      
                      // Request permission
                      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, {
                          enableHighAccuracy: true,
                          timeout: 10000,
                          maximumAge: 0
                        });
                      });
                      
                      // If we get here, permission was granted
                      localStorage.setItem('location_permission', 'granted');
                      
                      // Store the initial position
                      if (position && position.coords) {
                        localStorage.setItem('last_location', 
                          JSON.stringify({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            timestamp: position.timestamp
                          })
                        );
                      }
                      
                      toast({
                        title: "Location Access Granted",
                        description: "GPS tracking is now enabled for your runs.",
                      });
                      
                      // Navigate to the running tracker
                      navigateToRunningTracker();
                      
                      // Notify Fundi about run tracking (will be updated with actual data)
                      notifyRunTracked(3.2, 25 * 60, 7.8); // 3.2 miles, 25 min, 7.8 min/mile pace
                      
                      // Trigger completion for arcade points
                      handleExerciseCompleted('running-gps-track');
                      
                    } catch (error) {
                      console.error('Error requesting location permission:', error);
                      // User denied permission or there was an error
                      localStorage.setItem('location_permission', 'denied');
                      
                      toast({
                        variant: "destructive",
                        title: "Location Access Required",
                        description: "Please allow location access to track your runs. You can update this in your browser settings.",
                      });
                    }
                  };
                  
                  // Function to navigate to running tracker page/component
                  const navigateToRunningTracker = () => {
                    console.log('Navigating to running tracker with GPS enabled');
                    
                    // We'll use the existing logic - we don't need to navigate away
                    // because the RunningSpecificExercisesEnhanced component is already
                    // part of this page and will detect the GPS permission is granted
                    
                    // Show success notification
                    toast({
                      title: "GPS Running Mode Activated",
                      description: "Your run is now being tracked. The map will appear once GPS data is available.",
                    });
                  };
                  
                  // Start the permission request flow
                  requestLocationPermission();
                }}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Start Run with GPS Tracking
              </Button>
            </div>
            
            <RunningSpecificExercisesEnhanced />
          </div>
        );
      case 'weightlifting':
        return (
          <div className="bg-gradient-to-br from-pink-50 to-white p-4 rounded-md mb-4">
            <h2 className="text-xl font-semibold text-pink-700 mb-1">Strength Training</h2>
            <p className="text-gray-600">
              Strength training builds muscle, increases bone density, and improves overall body composition.
              These exercises will help you develop functional strength for everyday activities and sports.
            </p>
            <WeightliftingSpecificExercisesEnhanced />
          </div>
        );
      case 'stretch':
        return (
          <div className="bg-gradient-to-br from-pink-50 to-white p-4 rounded-md mb-4">
            <h2 className="text-xl font-semibold text-pink-700 mb-1">Stretching Exercises</h2>
            <p className="text-gray-600">
              Regular stretching improves flexibility, increases range of motion, and helps prevent injuries.
              Different types of stretching serve different purposes in your fitness routine.
            </p>
            <StretchSpecificExercisesEnhanced />
          </div>
        );
      case 'meditation':
      default:
        return (
          <div className="bg-gradient-to-br from-pink-50 to-white p-4 rounded-md mb-4">
            <h2 className="text-xl font-semibold text-pink-700 mb-1">Meditation Practices</h2>
            <p className="text-gray-600">
              Meditation reduces stress, improves focus, and enhances overall mental wellbeing.
              These guided sessions will help you develop mindfulness and relaxation techniques.
            </p>
            
            {/* AI Meditation Generation Feature Button */}
            <div className="my-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Brain className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-800">AI-Guided Meditation</h3>
                  <p className="text-sm text-gray-600">Generate a personalized meditation script based on your preferences</p>
                </div>
              </div>
              <Button 
                onClick={() => {
                  console.log('Generate AI Meditation');
                  // Notify Fundi about meditation generation
                  notifyMeditationCompleted(10 * 60, 'mindfulness');
                  // Trigger completion for arcade points
                  handleExerciseCompleted('guided-meditation-mindfulness');
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                <Brain className="w-5 h-5 mr-2" />
                Generate AI Meditation
              </Button>
            </div>
            
            <MeditationSpecificExercisesEnhanced />
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ActiveYou</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore specific exercises to improve your fitness and wellness with detailed instructions and tutorial videos.
        </p>
      </div>
      
      {/* Challenge Banner - Only show when exercise is part of an active challenge */}
      {inChallenge && (
        <div className="bg-gradient-to-r from-amber-100 to-amber-50 p-4 rounded-lg mb-6 border border-amber-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-amber-200 rounded-full p-2 mr-3">
                <Trophy className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-amber-800">Challenge Active</h3>
                <p className="text-sm text-amber-700">
                  This activity is part of an active learning path challenge! Complete it to earn {pointsEarned} points.
                </p>
              </div>
            </div>
            <Button 
              onClick={handleViewChallenge}
              variant="outline" 
              className="bg-white border-amber-200 text-amber-700 hover:bg-amber-50"
            >
              View Challenge
            </Button>
          </div>
        </div>
      )}
      
      {/* Points Earned Animation */}
      {showPointsEarned && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white p-6 rounded-lg shadow-xl animate-bounce">
            <div className="flex items-center">
              <Award className="h-10 w-10 mr-3" />
              <div>
                <h3 className="text-2xl font-bold">+{pointsEarned} Points</h3>
                <p>Great job completing this exercise!</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Card className="shadow-md border-pink-100 mb-8 p-4">
        {renderExerciseContent()}
      </Card>
      
      <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto">
        <Card className="flex-1 p-4 border shadow-sm">
          <h3 className="text-lg font-semibold text-pink-700 mb-2">
            <Activity className="h-5 w-5 inline-block mr-1 text-pink-600" /> 
            Personalized Recommendations
          </h3>
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
          <h3 className="text-lg font-semibold text-pink-700 mb-2">
            <Heart className="h-5 w-5 inline-block mr-1 text-pink-600" />
            Exercise Tracking
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            Monitor your progress and build consistency with our simple tracking tools. See improvements over time and stay motivated.
          </p>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-pink-50 p-2 rounded-md">
              <p className="text-pink-700 font-medium text-xl">12</p>
              <p className="text-xs text-gray-600">Workouts this month</p>
            </div>
            <div className="bg-pink-50 p-2 rounded-md">
              <p className="text-pink-700 font-medium text-xl">83%</p>
              <p className="text-xs text-gray-600">Weekly goal progress</p>
            </div>
          </div>
          
          {/* Learning Path Integration */}
          <div className="mt-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700 flex items-center">
                <Trophy className="h-4 w-4 mr-1 text-amber-500" />
                Learning Path Progress
              </h4>
              <span className="text-xs text-blue-600 cursor-pointer">View All</span>
            </div>
            <div className="mt-2 space-y-2">
              <div className="bg-gray-50 p-2 rounded text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Fitness Wellness Path</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">42% Complete</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}