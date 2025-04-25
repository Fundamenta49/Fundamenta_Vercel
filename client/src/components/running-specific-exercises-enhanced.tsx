import { useState, useEffect, useRef } from 'react';
import { CloseableExerciseCard } from "@/components/ui/closeable-exercise-card";
import { BaseExercise } from "@/components/ui/enhanced-exercise-card";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  MapPin, 
  Timer, 
  Activity, 
  AlertCircle, 
  Info, 
  Play, 
  Pause, 
  ChevronRight,
  SkipForward,
  RotateCw,
  Music,
  Trophy,
  Headphones
} from "lucide-react";
import { searchExerciseVideos } from '@/lib/exercise-search';
import { YouTubeVideo } from '@/lib/youtube-service';
import { RUNNING_VIDEOS } from '@/lib/section-fallbacks';

// Define Running Exercise interface extending BaseExercise
interface RunningExercise extends BaseExercise {
  duration?: number; // in minutes
  distance?: number; // in miles/km
  pace?: string;
  terrain?: string;
  // Additional running-specific properties can be added here
}

// Sample exercise data
export const RUNNING_EXERCISES = {
  warmups: [
    {
      id: "warm1",
      name: "Dynamic Leg Swings",
      description: "A dynamic warmup to prepare your legs for running.",
      muscleGroups: ["hips", "hamstrings", "quads"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Stand sideways next to a wall or other support",
        "Swing your outside leg forward and backward in a controlled motion",
        "Keep your core engaged and posture upright",
        "Perform 10-15 swings per leg, then switch sides",
        "Next, turn to face the wall and do side-to-side swings for each leg"
      ],
      imageUrl: "https://www.runnersworld.com/content/dam/runnersworld/videos/dynamic-warmup/dynamic-warmup-still.jpg",
      benefits: [
        "Increases blood flow to the leg muscles",
        "Improves hip mobility and range of motion",
        "Warms up the muscles and joints used in running",
        "Helps prevent injuries by preparing the body for movement"
      ],
      tips: [
        "Focus on controlled movements rather than height",
        "Keep your torso stable during the swings",
        "Gradually increase the range of motion as you warm up",
        "Maintain good posture throughout the exercise"
      ],
      duration: 3
    },
    {
      id: "warm2",
      name: "Walking Lunges",
      description: "Dynamic lunges to activate your leg muscles and prepare for running.",
      muscleGroups: ["quads", "glutes", "calves"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Stand with feet hip-width apart",
        "Take a step forward with your right foot and lower your body until both knees are bent at 90 degrees",
        "Push through your right heel to bring your left foot forward into the next lunge",
        "Continue alternating legs for 10-12 lunges per side",
        "Keep your upper body upright throughout the movement"
      ],
      imageUrl: "https://www.runnersworld.com/content/dam/runnersworld/videos/dynamic-warmup/walking-lunges-still.jpg",
      benefits: [
        "Activates the major muscle groups used in running",
        "Improves hip mobility and stability",
        "Enhances neuromuscular coordination",
        "Creates a gradual transition to running intensity"
      ],
      tips: [
        "Keep your front knee aligned with your ankle (don't let it extend past your toes)",
        "Maintain an upright posture - don't lean forward",
        "Step far enough to create a true lunge position",
        "Focus on smooth, controlled movements"
      ],
      duration: 3
    }
  ],
  technique: [
    {
      id: "tech1",
      name: "Proper Running Form",
      description: "Learn the fundamentals of efficient running technique to improve performance and reduce injury risk.",
      muscleGroups: ["full body"],
      equipment: ["none"],
      difficulty: "intermediate",
      instructions: [
        "Stand tall with shoulders relaxed and chest open",
        "Look ahead, not down at your feet",
        "Bend your arms at approximately 90 degrees, with relaxed hands",
        "Land midfoot rather than on your heel, with your foot under your body",
        "Maintain a slight forward lean from the ankles, not the waist",
        "Take quick, light steps (aim for 170-180 steps per minute)"
      ],
      imageUrl: "https://www.runnersworld.com/content/dam/runnersworld/videos/form-check/running-form-still.jpg",
      benefits: [
        "Increases running efficiency and speed",
        "Reduces impact forces and injury risk",
        "Improves running economy (less energy expended)",
        "Enhances overall performance and endurance"
      ],
      tips: [
        "Record yourself running to analyze your form",
        "Focus on one aspect of form at a time rather than everything at once",
        "Think 'light and quick' with your footsteps",
        "Regularly include technique drills in your training"
      ],
      duration: 10
    },
    {
      id: "tech2",
      name: "High Knees Drill",
      description: "A running drill that improves knee lift, cadence, and running form.",
      muscleGroups: ["hip flexors", "core", "quads"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Stand tall with feet hip-width apart",
        "Run in place, bringing your knees up to hip height",
        "Keep your back straight and core engaged",
        "Land on the balls of your feet with each step",
        "Pump your arms in rhythm with your legs",
        "Start with 20-30 seconds and gradually increase duration"
      ],
      imageUrl: "https://www.runnersworld.com/content/dam/runnersworld/videos/dynamic-warmup/high-knees-still.jpg",
      benefits: [
        "Improves running cadence and rhythm",
        "Strengthens hip flexors and core muscles",
        "Enhances knee lift for more powerful strides",
        "Develops proper foot strike mechanics"
      ],
      tips: [
        "Focus on quick turnover rather than height of knee lift",
        "Keep your upper body relaxed while maintaining good posture",
        "Breathe rhythmically throughout the exercise",
        "Perform on a soft surface if you have joint sensitivity"
      ],
      duration: 2
    }
  ],
  strength: [
    {
      id: "str1",
      name: "Single-Leg Calf Raises",
      description: "Strengthen calf muscles for better push-off power and reduced injury risk.",
      muscleGroups: ["calves", "ankles"],
      equipment: ["step or curb (optional)"],
      difficulty: "beginner",
      instructions: [
        "Stand on your right foot, with the ball of your foot on a step or flat ground",
        "Hold onto something for balance if needed",
        "Raise your heel as high as possible, coming up onto the ball of your foot",
        "Lower your heel below the level of the step for a full range of motion",
        "Complete 15-20 repetitions, then switch to the left foot",
        "For added difficulty, hold weights or perform with both legs on a single step"
      ],
      imageUrl: "https://www.runnersworld.com/content/dam/runnersworld/videos/strength-exercises/calf-raises-still.jpg",
      benefits: [
        "Strengthens calf muscles for better running propulsion",
        "Improves ankle stability and resilience",
        "Helps prevent common running injuries like Achilles tendinitis",
        "Enhances running economy and efficiency"
      ],
      tips: [
        "Focus on full range of motion - from heel below platform to maximum height",
        "Keep your core engaged throughout the movement",
        "Perform slowly and with control, especially on the downward phase",
        "Add these to your routine 2-3 times per week"
      ],
      duration: 5
    },
    {
      id: "str2",
      name: "Runner's Lunges",
      description: "A strength exercise that targets the key muscles used in running while improving stability.",
      muscleGroups: ["quads", "glutes", "hamstrings", "core"],
      equipment: ["none"],
      difficulty: "intermediate",
      instructions: [
        "Start in a standing position",
        "Take a long step forward with your right foot",
        "Lower your body until your right thigh is parallel to the ground",
        "Keep your left leg straight behind you, with heel lifted",
        "Hold for 2-3 seconds, then push through your right heel to return to standing",
        "Complete 10-12 repetitions per leg"
      ],
      imageUrl: "https://www.runnersworld.com/content/dam/runnersworld/videos/strength-exercises/lunges-still.jpg",
      benefits: [
        "Builds strength in the primary running muscles",
        "Improves single-leg stability and balance",
        "Addresses common muscle imbalances in runners",
        "Enhances stride power and hill-climbing ability"
      ],
      tips: [
        "Keep your front knee aligned with your ankle (don't let it extend past your toes)",
        "Maintain an upright posture - engage your core",
        "Focus on smooth, controlled movements",
        "For added challenge, hold dumbbells in each hand"
      ],
      duration: 7
    }
  ]
};

// Export for use elsewhere
export const RUNNING_EXERCISE_SETS = RUNNING_EXERCISES;

// Type for the fallback videos mapping
type FallbackVideoMapping = Record<string, YouTubeVideo[]>;

// Create fallback video collections for each category
const warmupFallbacks: FallbackVideoMapping = {
  "warm1": RUNNING_VIDEOS ? RUNNING_VIDEOS.slice(0, 2) : [],
  "warm2": RUNNING_VIDEOS ? RUNNING_VIDEOS.slice(2, 4) : []
};

const strengthFallbacks: FallbackVideoMapping = {
  "str1": RUNNING_VIDEOS ? RUNNING_VIDEOS.slice(0, 2) : [],
  "str2": RUNNING_VIDEOS ? RUNNING_VIDEOS.slice(2, 4) : []
};

const techniqueFallbacks: FallbackVideoMapping = {
  "tech1": RUNNING_VIDEOS ? RUNNING_VIDEOS.slice(0, 2) : [],
  "tech2": RUNNING_VIDEOS ? RUNNING_VIDEOS.slice(2, 4) : []
};

// Combine all fallbacks
const allFallbacks = {
  ...warmupFallbacks,
  ...strengthFallbacks,
  ...techniqueFallbacks
};

// Main Running Component
export const RunningSpecificExercisesEnhanced = () => {
  const [activeTab, setActiveTab] = useState('tracker');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Track which exercises have been closed by the user
  const [closedExercises, setClosedExercises] = useState<Record<string, boolean>>({});
  
  // State for the running tracker feature
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [pace, setPace] = useState('0:00');
  const [route, setRoute] = useState<{latitude: number, longitude: number, timestamp: number}[]>([]);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  
  // Refs for tracking intervals
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const locationRef = useRef<NodeJS.Timeout | null>(null);
  
  // Records of past sessions
  const [runningSessions, setRunningSessions] = useState<RunningSession[]>([
    {
      startTime: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
      endTime: Date.now() - 3 * 24 * 60 * 60 * 1000 + 35 * 60 * 1000, // 35 min later
      distance: 3.2, // miles
      duration: 35 * 60, // seconds
      pace: 10.9, // min/mile
      route: []
    },
    {
      startTime: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
      endTime: Date.now() - 1 * 24 * 60 * 60 * 1000 + 28 * 60 * 1000, // 28 min later
      distance: 2.8, // miles
      duration: 28 * 60, // seconds
      pace: 10, // min/mile
      route: []
    }
  ]);
  
  // Best times for different distances
  const [bestTimes, setBestTimes] = useState({
    '1mile': 9.5 * 60, // 9:30 pace
    '5k': 31 * 60, // 31 min
    '10k': 63 * 60, // 63 min
    'halfMarathon': 140 * 60 // 2:20
  });
  
  // Stat totals
  const [stats, setStats] = useState({
    totalDistance: 52.4, // miles
    totalRuns: 18,
    avgPace: 10.3, // min/mile
    longestRun: 8.7 // miles
  });
  
  // Running goals
  const [goals, setGoals] = useState([
    {
      id: 1,
      goalType: '5K',
      targetDistance: 3.1,
      targetTime: 30 * 60, // seconds
      completed: false,
      startDate: '2025-03-15',
      targetDate: '2025-05-20'
    },
    {
      id: 2,
      goalType: '10K',
      targetDistance: 6.2,
      targetTime: 60 * 60, // seconds
      completed: false,
      startDate: '2025-03-15',
      targetDate: '2025-06-30'
    }
  ]);
  
  // Music player state
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({
    title: 'Running Beats',
    artist: 'Workout Mix',
    duration: '3:45'
  });
  
  // Find video for an exercise using the YouTube API
  const findExerciseVideo = async (exercise: RunningExercise) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create an array of search terms in priority order
      const searchTerms = [
        `${exercise.name} running drill tutorial`,
        `how to do ${exercise.name} for runners`,
        `${exercise.name} technique for better running`,
        `${activeTab} running training ${exercise.name}`
      ];
      
      // Use our exercise search service that can handle multiple search terms
      const videos = await searchExerciseVideos(searchTerms);
      
      setIsLoading(false);
      return videos;
    } catch (err) {
      console.error('Error fetching running videos:', err);
      setError('Unable to load video. Using backup videos.');
      setIsLoading(false);
      return [];
    }
  };
  
  // Handler for showing detailed exercise information
  const handleShowDetail = (exercise: RunningExercise) => {
    console.log('Showing detail for:', exercise.name);
    // This would open a modal or dialog with comprehensive information
    // For now, we just log the action
  };
  
  // Start run tracking
  const startTracking = () => {
    // In a real app, we would start GPS tracking here
    setIsTracking(true);
    
    // Start timer
    const startTime = Date.now() - elapsedTime * 1000; // Account for paused time
    timerRef.current = setInterval(() => {
      const newElapsedTime = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(newElapsedTime);
      
      // Simulate distance (in a real app this would come from GPS)
      const newDistance = parseFloat((newElapsedTime / 600).toFixed(2)); // Rough simulation
      setDistance(newDistance);
      
      // Calculate pace (min/mile)
      if (newDistance > 0) {
        const paceInSeconds = newElapsedTime / newDistance;
        const paceMinutes = Math.floor(paceInSeconds / 60);
        const paceSeconds = Math.floor(paceInSeconds % 60);
        setPace(`${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`);
      }
    }, 1000);
    
    // Simulate location updates (in a real app, we would use the Geolocation API)
    locationRef.current = setInterval(() => {
      // Simulate a running route with small random variations
      const baseCoordinates: [number, number] = [37.7749, -122.4194]; // San Francisco coordinates
      const newLat = baseCoordinates[0] + (Math.random() - 0.5) * 0.01; 
      const newLng = baseCoordinates[1] + (Math.random() - 0.5) * 0.01;
      
      setCurrentLocation([newLat, newLng]);
      
      // Add to route
      setRoute(prev => [
        ...prev, 
        {
          latitude: newLat,
          longitude: newLng,
          timestamp: Date.now()
        }
      ]);
    }, 5000); // Update every 5 seconds
  };
  
  // Pause run tracking
  const pauseTracking = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (locationRef.current) {
      clearInterval(locationRef.current);
      locationRef.current = null;
    }
    
    setIsTracking(false);
  };
  
  // End run tracking
  const endTracking = () => {
    pauseTracking();
    
    // Save the run data
    if (distance > 0) {
      const newSession: RunningSession = {
        startTime: Date.now() - elapsedTime * 1000,
        endTime: Date.now(),
        distance,
        duration: elapsedTime,
        pace: parseFloat(pace.replace(':', '.')), // Convert "10:30" to 10.5
        route
      };
      
      setRunningSessions(prev => [newSession, ...prev]);
      
      // Update stats
      setStats(prev => ({
        totalDistance: prev.totalDistance + distance,
        totalRuns: prev.totalRuns + 1,
        avgPace: parseFloat(((prev.avgPace * prev.totalRuns + parseFloat(pace.replace(':', '.'))) / (prev.totalRuns + 1)).toFixed(1)),
        longestRun: Math.max(prev.longestRun, distance)
      }));
      
      // Check if any goals were completed
      const updatedGoals = [...goals];
      goals.forEach((goal, index) => {
        if (!goal.completed && distance >= goal.targetDistance) {
          if (!goal.targetTime || elapsedTime <= goal.targetTime) {
            updatedGoals[index] = { ...goal, completed: true };
          }
        }
      });
      
      if (JSON.stringify(updatedGoals) !== JSON.stringify(goals)) {
        setGoals(updatedGoals);
      }
    }
    
    // Reset for next run
    setElapsedTime(0);
    setDistance(0);
    setPace('0:00');
    setRoute([]);
    setCurrentLocation(null);
  };
  
  // Format time as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Toggle music player
  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };
  
  // Skip to next track
  const nextTrack = () => {
    // In a real app, we would integrate with a music service API
    setCurrentTrack({
      title: 'Power Run Mix',
      artist: 'DJ Tempo',
      duration: '4:12'
    });
  };
  
  // Clean up intervals on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (locationRef.current) clearInterval(locationRef.current);
    };
  }, []);
  
  // Format date for display
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  // Calculate running streak
  const calculateStreak = (): number => {
    const sortedSessions = [...runningSessions].sort((a, b) => b.startTime - a.startTime);
    
    if (sortedSessions.length === 0) return 0;
    
    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastRunDate = new Date(sortedSessions[0].startTime);
    lastRunDate.setHours(0, 0, 0, 0);
    
    // If last run wasn't today or yesterday, streak is broken
    const daysSinceLastRun = Math.floor((today.getTime() - lastRunDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceLastRun > 1) return 0;
    
    // Check consecutive days
    for (let i = 1; i < sortedSessions.length; i++) {
      const currentDate = new Date(sortedSessions[i - 1].startTime);
      currentDate.setHours(0, 0, 0, 0);
      
      const prevDate = new Date(sortedSessions[i].startTime);
      prevDate.setHours(0, 0, 0, 0);
      
      const dayDifference = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDifference === 1) {
        streak++;
      } else if (dayDifference > 1) {
        break;
      }
    }
    
    return streak;
  };
  
  return (
    <div className="mx-auto w-full max-w-4xl">
      <Card className="shadow-md border-pink-100">
        <div className="p-4 bg-gradient-to-r from-pink-50 to-white">
          <h2 className="text-2xl font-semibold text-pink-700 mb-2">Running Tracker & Training</h2>
          <p className="text-gray-600 mb-4">
            Track your runs with GPS, improve your technique, and follow targeted exercises to become a better runner.
          </p>
          
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-700" />
            <AlertTitle className="text-blue-700">Running Tip</AlertTitle>
            <AlertDescription className="text-blue-600">
              Consistency is key for running improvement. Start with short, easy runs and gradually increase your distance.
              Remember to warmup properly before each run and cool down afterward.
            </AlertDescription>
          </Alert>
          
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4 flex items-start">
              <AlertCircle className="text-yellow-500 mr-2 flex-shrink-0 h-5 w-5 mt-0.5" />
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          )}
          
          <Tabs defaultValue="tracker" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-4 bg-pink-100">
              <TabsTrigger 
                value="tracker" 
                className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800"
              >
                <Activity className="h-4 w-4 mr-2" />
                Run Tracker
              </TabsTrigger>
              <TabsTrigger 
                value="warmups" 
                className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800"
              >
                Warm-Ups
              </TabsTrigger>
              <TabsTrigger 
                value="technique" 
                className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800"
              >
                Technique
              </TabsTrigger>
              <TabsTrigger 
                value="strength" 
                className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800"
              >
                Strength
              </TabsTrigger>
            </TabsList>
            
            {/* Run Tracker Tab */}
            <TabsContent value="tracker" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tracking Card */}
                <Card className="p-4 border">
                  <h3 className="text-lg font-medium mb-2">Track Your Run</h3>
                  
                  {/* Map Placeholder - In a real app, replace with actual map component */}
                  <div className="bg-gray-100 h-48 mb-4 rounded-md flex items-center justify-center relative overflow-hidden">
                    {currentLocation ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-full h-full">
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4">
                            <div className="absolute top-0 left-0 w-full h-full bg-pink-500 rounded-full opacity-75 animate-ping"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-pink-600 rounded-full"></div>
                          </div>
                          
                          {/* Route visualization would go here in a real implementation */}
                          {route.length > 1 && (
                            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
                              {route.length} GPS points collected
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <MapPin className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Run tracking will show your route here</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Tracking Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-gray-50 p-3 rounded-md text-center">
                      <p className="text-xs text-gray-500 mb-1">Time</p>
                      <p className="text-xl font-semibold text-pink-700">{formatTime(elapsedTime)}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md text-center">
                      <p className="text-xs text-gray-500 mb-1">Distance</p>
                      <p className="text-xl font-semibold text-pink-700">{distance.toFixed(2)}<span className="text-sm"> mi</span></p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md text-center">
                      <p className="text-xs text-gray-500 mb-1">Pace</p>
                      <p className="text-xl font-semibold text-pink-700">{pace}<span className="text-sm"> /mi</span></p>
                    </div>
                  </div>
                  
                  {/* Track Controls */}
                  <div className="flex justify-between gap-2">
                    {!isTracking ? (
                      <Button 
                        className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
                        onClick={startTracking}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Run
                      </Button>
                    ) : (
                      <Button 
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
                        onClick={pauseTracking}
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    )}
                    
                    <Button 
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
                      onClick={endTracking}
                      disabled={elapsedTime === 0}
                    >
                      <SkipForward className="h-4 w-4 mr-2" />
                      End Run
                    </Button>
                  </div>
                  
                  {/* Music Player */}
                  <div className="mt-4 bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Headphones className="h-5 w-5 text-gray-500 mr-2" />
                        <div>
                          <p className="text-sm font-medium">{currentTrack.title}</p>
                          <p className="text-xs text-gray-500">{currentTrack.artist}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 rounded-full"
                          onClick={toggleMusic}
                        >
                          {isMusicPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 rounded-full"
                          onClick={nextTrack}
                        >
                          <SkipForward className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
                
                {/* Recent Runs & Stats Card */}
                <Card className="p-4 border">
                  <h3 className="text-lg font-medium mb-3">Recent Activity</h3>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-xs text-gray-500 mb-1">Total Distance</p>
                      <p className="text-xl font-semibold text-pink-700">{stats.totalDistance.toFixed(1)}<span className="text-sm"> miles</span></p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-xs text-gray-500 mb-1">Current Streak</p>
                      <p className="text-xl font-semibold text-pink-700">{calculateStreak()}<span className="text-sm"> days</span></p>
                    </div>
                  </div>
                  
                  {/* Recent Runs */}
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Recent Runs</h4>
                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {runningSessions.map((session, index) => (
                      <div 
                        key={index} 
                        className="border p-3 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between mb-1">
                          <p className="text-sm font-medium">{formatDate(session.startTime)}</p>
                          <p className="text-sm text-gray-500">{formatTime(session.duration)}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-600">{session.distance.toFixed(2)} miles</p>
                          <p className="text-sm text-pink-600">{Math.floor(session.pace)}:{((session.pace % 1) * 60).toFixed(0).padStart(2, '0')} /mi</p>
                        </div>
                      </div>
                    ))}
                    
                    {runningSessions.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        <RotateCw className="h-5 w-5 mx-auto mb-2" />
                        <p className="text-sm">No runs yet. Start tracking your first run!</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Goals Section */}
                  <h4 className="text-sm font-medium text-gray-600 mt-4 mb-2">Running Goals</h4>
                  <div className="space-y-3 max-h-[150px] overflow-y-auto pr-1">
                    {goals.map((goal) => (
                      <div 
                        key={goal.id} 
                        className={`border p-3 rounded-md ${goal.completed ? 'bg-green-50 border-green-200' : 'bg-white'}`}
                      >
                        <div className="flex justify-between mb-1">
                          <div className="flex items-center">
                            {goal.completed && <Trophy className="h-4 w-4 text-green-500 mr-1" />}
                            <p className="text-sm font-medium">{goal.goalType} Challenge</p>
                          </div>
                          <p className="text-xs text-gray-500">Target: {goal.targetDate}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-600">{goal.targetDistance} miles</p>
                          {goal.targetTime && (
                            <p className="text-sm text-pink-600">Under {formatTime(goal.targetTime)}</p>
                          )}
                        </div>
                        {!goal.completed && (
                          <Progress 
                            value={(distance / goal.targetDistance) * 100} 
                            className="h-1 mt-2 bg-gray-100" 
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>
            
            {/* Warmups Tab */}
            <TabsContent value="warmups" className="pt-4">
              <div className="mb-3 bg-pink-50 p-3 rounded-md">
                <h3 className="font-medium text-pink-800 mb-1">Running Warm-Ups</h3>
                <p className="text-sm text-gray-600">
                  Always warm up before running to prepare your muscles, increase your heart rate gradually, 
                  and reduce injury risk. These exercises will help you get ready for your run.
                </p>
              </div>
              <div className="space-y-4">
                {RUNNING_EXERCISES.warmups.map((exercise) => (
                  !closedExercises[exercise.id] && (
                    <CloseableExerciseCard 
                      key={exercise.id}
                      exercise={exercise}
                      category="warmups"
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
            
            {/* Technique Tab */}
            <TabsContent value="technique" className="pt-4">
              <div className="mb-3 bg-pink-50 p-3 rounded-md">
                <h3 className="font-medium text-pink-800 mb-1">Running Technique</h3>
                <p className="text-sm text-gray-600">
                  Proper running form is essential for efficiency, performance, and injury prevention.
                  These exercises and drills will help you improve your running technique.
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
            
            {/* Strength Tab */}
            <TabsContent value="strength" className="pt-4">
              <div className="mb-3 bg-pink-50 p-3 rounded-md">
                <h3 className="font-medium text-pink-800 mb-1">Runner's Strength Training</h3>
                <p className="text-sm text-gray-600">
                  Strength training is crucial for runners to prevent injuries, improve efficiency, and enhance performance.
                  Focus on these exercises that target key running muscles.
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

// Running session type definition
interface RunningSession {
  startTime: number;
  endTime?: number;
  distance: number; // in miles
  duration: number; // in seconds
  pace: number; // in minutes per mile
  route: Array<{
    latitude: number;
    longitude: number;
    timestamp: number;
  }>;
}

export default RunningSpecificExercisesEnhanced;