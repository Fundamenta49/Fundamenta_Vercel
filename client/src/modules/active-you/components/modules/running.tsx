import { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Play, 
  Square, 
  Trophy, 
  Music, 
  Flag,
  Clock,
  Flame,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  BarChart2,
  Timer,
  AlertCircle,
  Plus
} from 'lucide-react';

// Distance constants for milestone tracking
const MILESTONE_5K = 3.10686; // 5K in miles
const MILESTONE_10K = 6.21371; // 10K in miles

// Interface for running session data
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

// Interface for running goals
interface RunningGoal {
  id: number;
  goalType: string; // "5K", "10K", etc.
  targetDistance: number;
  targetTime?: number; // Target time in seconds (optional)
  completed: boolean;
  startDate: string;
  targetDate?: string;
}

// Status card component
function StatusCard({ title, value, unit, icon: Icon }: { 
  title: string; 
  value: string | number; 
  unit?: string; 
  icon: any;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold">{value}</span>
          {unit && <span className="text-sm text-muted-foreground ml-1">{unit}</span>}
        </div>
      </CardContent>
    </Card>
  );
}

// Simple music player component 
function MusicPlayerControls() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Function to request device media access
  const handleMediaAccess = async () => {
    try {
      // Check if the browser supports the Media Session API
      if ('mediaSession' in navigator) {
        toast({
          title: "Music Player",
          description: "Select music to play during your run",
        });
        
        // Create a file input element
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
        input.style.display = 'none';
        document.body.appendChild(input);
        
        // Handle file selection
        input.onchange = (event) => {
          const file = (event.target as HTMLInputElement).files?.[0];
          if (file) {
            const url = URL.createObjectURL(file);
            setCurrentTrack(file.name);
            
            if (audioRef.current) {
              audioRef.current.src = url;
              audioRef.current.play();
              setIsPlaying(true);
              
              // Set up media session metadata
              if ('mediaSession' in navigator) {
                navigator.mediaSession.metadata = new MediaMetadata({
                  title: file.name,
                  artist: 'Your Music Library',
                  album: 'Running Playlist',
                });
              }
            }
          }
          
          // Clean up
          document.body.removeChild(input);
        };
        
        input.click();
      } else {
        toast({
          variant: "destructive",
          title: "Media Not Supported",
          description: "Your browser doesn't support the Media API features",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Media Access Error",
        description: "Unable to access your media files",
      });
    }
  };

  // Play/pause control
  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else if (!currentTrack) {
      handleMediaAccess();
    }
  };

  return (
    <div className="rounded-lg bg-slate-50 dark:bg-gray-800 p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Music className="h-4 w-4 mr-2 text-primary" />
          <span className="text-sm font-medium">Running Music</span>
        </div>
      </div>
      
      {currentTrack ? (
        <div className="mb-2 text-xs text-slate-600 dark:text-slate-300 truncate max-w-full">{currentTrack}</div>
      ) : (
        <div className="mb-2 text-xs text-slate-500 dark:text-slate-400">No track selected</div>
      )}
      
      <div className="flex gap-2">
        <Button 
          onClick={togglePlayback} 
          variant={isPlaying ? "outline" : "default"}
          size="sm"
          className="h-8 px-3 text-xs flex-1"
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>
        
        <Button
          onClick={handleMediaAccess}
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs flex-1"
        >
          Select Music
        </Button>
      </div>
      
      {/* Hidden audio element */}
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
    </div>
  );
}

// Milestone display and tracking component
function MilestoneTracker({ currentDistance, bestTimes }: { 
  currentDistance: number, 
  bestTimes: {
    fiveK?: number,
    tenK?: number
  } 
}) {
  // Calculate progress towards milestones
  const fiveKProgress = Math.min(100, (currentDistance / MILESTONE_5K) * 100);
  const tenKProgress = Math.min(100, (currentDistance / MILESTONE_10K) * 100);
  
  const formatTime = (seconds?: number) => {
    if (!seconds) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate daily goal (simplified example - in a full app this would be personalized)
  const dailyGoalMiles = 2.0; // A simple default daily goal 
  const dailyProgress = Math.min(100, (currentDistance / dailyGoalMiles) * 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center mb-1">
        <Trophy className="h-4 w-4 mr-2 text-primary" />
        <span className="text-sm font-medium">Run Progress</span>
      </div>
      
      {/* Daily goal progress */}
      <div className="space-y-1 bg-slate-50 dark:bg-gray-800 p-2 rounded-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xs font-medium">Today's Goal</span>
            {currentDistance >= dailyGoalMiles && (
              <CheckCircle2 className="h-3 w-3 ml-1 text-green-500" />
            )}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {currentDistance.toFixed(1)} / {dailyGoalMiles} mi
          </div>
        </div>
        <Progress value={dailyProgress} className="h-1.5" />
      </div>
      
      {/* 5K progress */}
      <div className="space-y-1 bg-slate-50 dark:bg-gray-800 p-2 rounded-md">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium">5K</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {bestTimes.fiveK ? formatTime(bestTimes.fiveK) : "--:--"}
          </span>
        </div>
        <Progress 
          value={fiveKProgress} 
          className={`h-1.5 ${currentDistance >= MILESTONE_5K ? "bg-green-100" : ""}`} 
        />
      </div>
      
      {/* 10K progress */}
      <div className="space-y-1 bg-slate-50 dark:bg-gray-800 p-2 rounded-md">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium">10K</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {bestTimes.tenK ? formatTime(bestTimes.tenK) : "--:--"}
          </span>
        </div>
        <Progress 
          value={tenKProgress} 
          className={`h-1.5 ${currentDistance >= MILESTONE_10K ? "bg-green-100" : ""}`} 
        />
      </div>
    </div>
  );
}

// Warm-up exercises component
function WarmUpSection() {
  return (
    <div className="space-y-3">      
      <p className="text-xs text-slate-600 dark:text-slate-300">A proper warm-up prepares your body for exercise and helps prevent injuries.</p>
      
      <div className="space-y-2">
        {/* Warm-up Exercise 1 */}
        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-md border border-orange-100 dark:border-orange-800">
          <div className="font-medium text-orange-800 dark:text-orange-300 mb-1">1. Dynamic Stretching (3 min)</div>
          <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-300 list-disc pl-4">
            <li>Arm circles: 20 seconds forward, 20 seconds backward</li>
            <li>Leg swings: 30 seconds each leg</li>
            <li>Hip circles: 20 seconds each direction</li>
            <li>Shoulder rolls: 20 seconds forward, 20 seconds backward</li>
          </ul>
        </div>
        
        {/* Warm-up Exercise 2 */}
        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-md border border-orange-100 dark:border-orange-800">
          <div className="font-medium text-orange-800 dark:text-orange-300 mb-1">2. Active Warm-Up (2 min)</div>
          <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-300 list-disc pl-4">
            <li>Jumping jacks: 30 seconds</li>
            <li>High knees: 30 seconds</li>
            <li>Butt kicks: 30 seconds</li>
            <li>Light jogging in place: 30 seconds</li>
          </ul>
        </div>
        
        {/* Warm-up Exercise 3 */}
        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-md border border-orange-100 dark:border-orange-800">
          <div className="font-medium text-orange-800 dark:text-orange-300 mb-1">3. Joint Mobilization (1 min)</div>
          <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-300 list-disc pl-4">
            <li>Ankle rotations: 10 each direction, both ankles</li>
            <li>Knee circles: 10 each direction, both knees</li>
            <li>Wrist rotations: 10 each direction</li>
          </ul>
        </div>
      </div>
      
      <div className="text-xs bg-blue-50 dark:bg-blue-900/20 p-2 rounded border border-blue-100 dark:border-blue-800">
        <p className="text-blue-800 dark:text-blue-300">
          <span className="font-medium">Tip:</span> Start your run with a slower pace for the first 5 minutes as an additional warm-up.
        </p>
      </div>
    </div>
  );
}

// Main Running Module Component
export default function RunningModule() {
  const { toast } = useToast();
  const [isTracking, setIsTracking] = useState(false);
  const [currentSession, setCurrentSession] = useState<RunningSession | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [activeTab, setActiveTab] = useState("run");
  const [runningGoals, setRunningGoals] = useState<RunningGoal[]>([]);
  const [showFundiEncouragement, setShowFundiEncouragement] = useState(false);
  const [bestTimes, setBestTimes] = useState<{fiveK?: number, tenK?: number}>({});
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [showWarmUp, setShowWarmUp] = useState(false);
  
  const watchIdRef = useRef<number | null>(null);

  // Check if this is user's first run (simplified for demo)
  useEffect(() => {
    const hasRunBefore = localStorage.getItem('has_run_before');
    if (hasRunBefore) {
      setIsFirstRun(false);
    }
  }, []);

  // Check for location permission
  useEffect(() => {
    // Check for saved location permission or prompt the user
    const savedPermission = localStorage.getItem('location_permission');
    if (savedPermission === 'granted') {
      // Verify the permission is still valid
      checkLocationPermission();
    } else {
      // Show a more prominent permission request
      setHasLocationPermission(false);
    }
  }, []);

  // Load past running sessions data
  useEffect(() => {
    // In a full implementation, fetch from API
    // For now, look at localStorage as example
    const storedBestTimes = localStorage.getItem('best_run_times');
    if (storedBestTimes) {
      try {
        setBestTimes(JSON.parse(storedBestTimes));
      } catch (e) {
        console.error('Error parsing stored best times', e);
      }
    }
  }, []);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        if (typeof watchIdRef.current === 'number') {
          navigator.geolocation.clearWatch(watchIdRef.current);
        } else {
          // Handle interval case (for demo mode)
          clearInterval(watchIdRef.current as unknown as number);
        }
        watchIdRef.current = null;
      }
    };
  }, []);

  const checkLocationPermission = async () => {
    try {
      // First try to actively request location to trigger the browser permission dialog
      if (!localStorage.getItem('location_permission')) {
        try {
          // This will trigger the browser's permission dialog
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            });
          });
          
          // If we get here, permission was granted
          localStorage.setItem('location_permission', 'granted');
          setHasLocationPermission(true);
          
          // Store the initial position for future reference
          if (position) {
            console.log('Initial position acquired');
          }
        } catch (error: any) {
          console.error('Error requesting location permission', error);
          if (error.code === 1) {
            // Permission denied
            localStorage.setItem('location_permission', 'denied');
          } else {
            // Other errors (timeout, position unavailable)
            localStorage.setItem('location_permission', 'error');
          }
          setHasLocationPermission(false);
        }
      } else {
        // If we already have stored permission, just verify it works
        const permissionStatus = localStorage.getItem('location_permission');
        if (permissionStatus === 'granted') {
          try {
            await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 5000,
                maximumAge: 0
              });
            });
            setHasLocationPermission(true);
          } catch (error) {
            console.error('Stored permission invalid', error);
            localStorage.setItem('location_permission', 'error');
            setHasLocationPermission(false);
          }
        } else {
          setHasLocationPermission(false);
        }
      }
    } catch (error) {
      console.error('Error checking location permission', error);
      setHasLocationPermission(false);
    }
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3958.8; // Radius of the Earth in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in miles
  };

  // Format time in mm:ss or hh:mm:ss format
  const formatTime = (seconds: number): string => {
    if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  };

  // Format pace in min:sec/mile format
  const formatPace = (pace: number): string => {
    if (pace === 0 || !isFinite(pace)) return '--:--';
    const mins = Math.floor(pace);
    const secs = Math.floor((pace - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Start tracking a run
  const startRun = () => {
    // Get the current permission mode
    const permissionMode = localStorage.getItem('location_permission');
    
    // For regular GPS tracking mode
    if (permissionMode === 'granted') {
      if (!navigator.geolocation) {
        toast({
          variant: "destructive",
          title: "GPS Not Available",
          description: "Your browser doesn't support GPS tracking.",
        });
        return;
      }

      setIsTracking(true);
      setCurrentSession({
        startTime: Date.now(),
        distance: 0,
        duration: 0,
        pace: 0,
        route: [],
      });

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentSession((prev) => {
            if (!prev) return prev;

            const newRoute = [
              ...prev.route,
              {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                timestamp: position.timestamp,
              },
            ];

            // Calculate distance
            let distance = prev.distance;
            if (prev.route.length > 0) {
              const lastPoint = prev.route[prev.route.length - 1];
              const newPointDistance = calculateDistance(
                lastPoint.latitude,
                lastPoint.longitude,
                position.coords.latitude,
                position.coords.longitude
              );
              
              // Only add if it's a reasonable distance (avoid GPS jitter)
              if (newPointDistance > 0.001) { // More than ~5 feet
                distance += newPointDistance;
              }
            }

            // Calculate duration in seconds
            const duration = (Date.now() - prev.startTime) / 1000;
            
            // Calculate pace (minutes per mile)
            const pace = distance > 0 ? duration / 60 / distance : 0;

            // Check milestones
            if ((distance >= MILESTONE_5K && prev.distance < MILESTONE_5K) || 
                (distance >= MILESTONE_10K && prev.distance < MILESTONE_10K)) {
              setShowFundiEncouragement(true);
            }
            
            return {
              ...prev,
              distance,
              duration,
              pace,
              route: newRoute,
            };
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast({
            variant: "destructive",
            title: "GPS Error",
            description: `Unable to track location: ${error.message}`,
          });
          setIsTracking(false);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
    } else {
      // For demo mode with simulated GPS
      toast({
        title: "Demo Mode Active",
        description: "Using simulated GPS data for demonstration.",
      });
      
      setIsTracking(true);
      
      // Start with a simulated position (Central Park, NYC as an example)
      const startLat = 40.7812;
      const startLng = -73.9665;
      
      setCurrentSession({
        startTime: Date.now(),
        distance: 0,
        duration: 0,
        pace: 0,
        route: [
          {
            latitude: startLat,
            longitude: startLng,
            timestamp: Date.now(),
          },
        ],
      });
      
      // Create a simulated route with small variations
      let currentLat = startLat;
      let currentLng = startLng;
      let lastUpdateTime = Date.now();
      
      const simulatedTrackingInterval = setInterval(() => {
        // Simulate movement (roughly south-east direction)
        currentLat -= 0.0001 * (Math.random() * 0.5 + 0.7); // Gradual movement south
        currentLng += 0.0002 * (Math.random() * 0.5 + 0.7); // Gradual movement east
        
        const now = Date.now();
        
        setCurrentSession((prev) => {
          if (!prev) return prev;
          
          const newRoute = [
            ...prev.route,
            {
              latitude: currentLat,
              longitude: currentLng,
              timestamp: now,
            },
          ];
          
          // Calculate distance
          const lastPoint = prev.route[prev.route.length - 1];
          const newPointDistance = calculateDistance(
            lastPoint.latitude,
            lastPoint.longitude,
            currentLat,
            currentLng
          );
          
          const distance = prev.distance + newPointDistance;
          
          // Calculate duration in seconds
          const duration = (now - prev.startTime) / 1000;
          
          // Calculate pace (minutes per mile)
          const pace = distance > 0 ? duration / 60 / distance : 0;
          
          // Check milestones
          if ((distance >= MILESTONE_5K && prev.distance < MILESTONE_5K) || 
              (distance >= MILESTONE_10K && prev.distance < MILESTONE_10K)) {
            setShowFundiEncouragement(true);
          }
          
          return {
            ...prev,
            distance,
            duration,
            pace,
            route: newRoute,
          };
        });
      }, 3000); // Update every 3 seconds
      
      // Store the interval ID for cleanup
      watchIdRef.current = simulatedTrackingInterval as unknown as number;
      
      toast({
        title: "Demo Run Started",
        description: "Using simulated GPS data to track your run.",
      });
    }
  };

  // Stop tracking a run
  const stopRun = () => {
    if (watchIdRef.current) {
      if (typeof watchIdRef.current === 'number') {
        navigator.geolocation.clearWatch(watchIdRef.current);
      } else {
        // Handle interval case (for demo mode)
        clearInterval(watchIdRef.current as unknown as number);
      }
      watchIdRef.current = null;
    }

    setIsTracking(false);

    // Update session with end time
    setCurrentSession((prev) => {
      if (!prev) return prev;
      
      const session = {
        ...prev,
        endTime: Date.now(),
      };

      // Save run data to localStorage
      try {
        // Check for milestones and record best times
        const newBestTimes = { ...bestTimes };
        
        if (session.distance >= MILESTONE_5K) {
          // Find time at 5K
          const timeAt5K = estimateTimeAtDistance(session, MILESTONE_5K);
          if (!newBestTimes.fiveK || timeAt5K < newBestTimes.fiveK) {
            newBestTimes.fiveK = timeAt5K;
          }
        }
        
        if (session.distance >= MILESTONE_10K) {
          // Find time at 10K
          const timeAt10K = estimateTimeAtDistance(session, MILESTONE_10K);
          if (!newBestTimes.tenK || timeAt10K < newBestTimes.tenK) {
            newBestTimes.tenK = timeAt10K;
          }
        }
        
        // Save best times
        localStorage.setItem('best_run_times', JSON.stringify(newBestTimes));
        setBestTimes(newBestTimes);
        
        // Mark that the user has run before
        localStorage.setItem('has_run_before', 'true');
        setIsFirstRun(false);
        
      } catch (error) {
        console.error('Error saving run data', error);
      }
      
      return session;
    });

    toast({
      title: "Run Completed",
      description: "Your running session has been saved.",
    });
  };

  // Estimate the time it would take to reach a target distance based on current pace
  const estimateTimeAtDistance = (session: RunningSession, targetDistance: number): number => {
    // If we've already reached the target distance, find the time when we hit it
    if (session.distance >= targetDistance) {
      // This is a simplified estimation - in a real app, we'd use the actual route data
      // to determine exactly when the user crossed the target distance
      const pacePerMile = session.duration / session.distance; // seconds per mile
      return pacePerMile * targetDistance; // estimated seconds at target distance
    }
    
    // If we haven't reached it, project based on current pace
    return (session.pace * 60) * targetDistance; // estimated seconds to reach target
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary mb-2 flex items-center">
            <Timer className="h-6 w-6 mr-2" />
            Running Tracker
          </h1>
          <p className="text-muted-foreground">
            Track your runs, set goals, and monitor your progress over time.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
            <TabsTrigger value="run">Track Run</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="run" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  GPS Run Tracker
                </CardTitle>
                <CardDescription>
                  Track your runs with real-time GPS monitoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!hasLocationPermission ? (
                  <div className="space-y-4">
                    <div className="p-5 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-xl border-2 border-orange-200 dark:border-orange-800 shadow-md">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-md">
                          <MapPin className="h-8 w-8" />
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-center text-orange-800 dark:text-orange-300 mb-3">Location Access Required</h3>
                      
                      <p className="text-center text-orange-700 dark:text-orange-400 mb-4">
                        To track your runs and provide accurate distance measurements, we need permission to use your device's GPS.
                      </p>
                      
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-300 mb-2">How to enable location:</h4>
                        <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-decimal pl-4">
                          <li>Click the "Enable GPS Tracking" button below</li>
                          <li>When prompted by your browser, select "Allow" to grant location permission</li>
                          <li>For the best experience, select "Remember this decision"</li>
                        </ol>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Button 
                          onClick={checkLocationPermission}
                          size="lg"
                          className="w-full"
                        >
                          Enable GPS Tracking
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="lg"
                          onClick={startRun}
                          className="w-full"
                        >
                          Continue in Demo Mode
                        </Button>
                      </div>
                    </div>
                    
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Demo mode uses simulated GPS data and doesn't require location permission.
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Run in progress status */}
                    {isTracking && currentSession && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <StatusCard 
                            title="Distance" 
                            value={currentSession.distance.toFixed(2)} 
                            unit="mi" 
                            icon={Flag} 
                          />
                          <StatusCard 
                            title="Duration" 
                            value={formatTime(currentSession.duration)} 
                            icon={Clock} 
                          />
                          <StatusCard 
                            title="Pace" 
                            value={formatPace(currentSession.pace)} 
                            unit="/mi" 
                            icon={Flame} 
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-2">
                            {/* Map would go here in a real implementation */}
                            <div className="w-full h-64 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                              <div className="text-center p-4">
                                <MapPin className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  Map visualization would appear here. For the full implementation, 
                                  we would use a mapping library like Leaflet JS.
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <MilestoneTracker 
                              currentDistance={currentSession.distance} 
                              bestTimes={bestTimes} 
                            />
                            
                            <div className="flex flex-col space-y-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setShowMusicPlayer(!showMusicPlayer)}
                                className="flex justify-between items-center"
                              >
                                <span className="flex items-center">
                                  <Music className="h-4 w-4 mr-2" />
                                  Music Player
                                </span>
                                {showMusicPlayer ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                              
                              {showMusicPlayer && <MusicPlayerControls />}
                            </div>
                          </div>
                        </div>
                        
                        {showFundiEncouragement && (
                          <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <AlertDescription className="text-green-800 dark:text-green-300">
                              {currentSession.distance >= MILESTONE_10K ? (
                                "Amazing work! You've completed a 10K run. That's an incredible achievement!"
                              ) : currentSession.distance >= MILESTONE_5K ? (
                                "Fantastic job! You've reached the 5K milestone. Keep going strong!"
                              ) : (
                                "You're making great progress! Keep pushing towards your goals."
                              )}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                    
                    {/* Show statistics if not tracking or if expanded */}
                    {!isTracking && (
                      <div className="space-y-4">
                        <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                            <BarChart2 className="h-5 w-5 mr-2" />
                            Running Stats
                          </h3>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Best 5K Time</div>
                              <div className="text-xl font-bold text-blue-700 dark:text-blue-400">
                                {bestTimes.fiveK ? formatTime(bestTimes.fiveK) : "--:--"}
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Best 10K Time</div>
                              <div className="text-xl font-bold text-blue-700 dark:text-blue-400">
                                {bestTimes.tenK ? formatTime(bestTimes.tenK) : "--:--"}
                              </div>
                            </div>
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => setShowWarmUp(!showWarmUp)}
                          >
                            {showWarmUp ? "Hide Warm-Up Guide" : "Show Warm-Up Guide"}
                          </Button>
                        </div>
                        
                        {showWarmUp && (
                          <div className="border rounded-xl p-4">
                            <h3 className="font-medium text-lg mb-3">Pre-Run Warm-Up Guide</h3>
                            <WarmUpSection />
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Run controls */}
                    <div className="flex justify-center pt-4">
                      {!isTracking ? (
                        <Button
                          size="lg"
                          onClick={startRun}
                          className="w-full max-w-xs bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Run
                        </Button>
                      ) : (
                        <Button
                          size="lg"
                          variant="destructive"
                          onClick={stopRun}
                          className="w-full max-w-xs"
                        >
                          <Square className="h-4 w-4 mr-2" />
                          Stop Run
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Running Goals</CardTitle>
                <CardDescription>
                  Set and track your running milestones and achievements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 5K Goal Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base font-medium">5K Goal</CardTitle>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        3.1 miles
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current best:</span>
                        <span className="font-medium">{bestTimes.fiveK ? formatTime(bestTimes.fiveK) : "--:--"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Target time:</span>
                        <span className="font-medium">30:00</span>
                      </div>
                      <Progress 
                        value={bestTimes.fiveK ? Math.min(100, (30*60 / bestTimes.fiveK) * 100) : 0} 
                        className="h-2 mt-2" 
                      />
                    </div>
                  </CardContent>
                </Card>
                
                {/* 10K Goal Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base font-medium">10K Goal</CardTitle>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                        6.2 miles
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current best:</span>
                        <span className="font-medium">{bestTimes.tenK ? formatTime(bestTimes.tenK) : "--:--"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Target time:</span>
                        <span className="font-medium">60:00</span>
                      </div>
                      <Progress 
                        value={bestTimes.tenK ? Math.min(100, (60*60 / bestTimes.tenK) * 100) : 0} 
                        className="h-2 mt-2" 
                      />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Add Goal Button */}
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Goal
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Running History</CardTitle>
                <CardDescription>
                  View your past runs and track your progress over time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Placeholder for history chart */}
                <div className="w-full h-64 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                  <div className="text-center p-4">
                    <BarChart2 className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Run history visualization would appear here. This would include charts 
                      showing distance and pace over time.
                    </p>
                  </div>
                </div>
                
                {/* Recent runs list */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium mb-2">Recent Runs</h3>
                  
                  {/* If we have a completed run, show it */}
                  {currentSession && currentSession.endTime && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <div className="font-medium">Today's Run</div>
                            <div className="text-sm text-muted-foreground">
                              {currentSession.distance.toFixed(2)} miles • {formatTime(currentSession.duration)}
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Completed
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Placeholder runs for demo */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="font-medium">Yesterday's Run</div>
                          <div className="text-sm text-muted-foreground">
                            3.25 miles • 32:15
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          Completed
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="font-medium">Weekend Run</div>
                          <div className="text-sm text-muted-foreground">
                            6.5 miles • 1:05:30
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          Completed
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}