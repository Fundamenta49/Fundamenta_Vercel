import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MapPin, 
  Play, 
  Square, 
  Trophy, 
  Target, 
  Music, 
  ArrowRight, 
  CheckCircle2, 
  Clock,
  Flag,
  Plus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Distance constants for milestone tracking
const MILESTONE_5K = 3.10686; // 5K in miles
const MILESTONE_10K = 6.21371; // 10K in miles

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

interface RunningGoal {
  id: number;
  goalType: string; // "5K", "10K", etc.
  targetDistance: number;
  targetTime?: number; // Target time in seconds (optional)
  completed: boolean;
  startDate: string;
  targetDate?: string;
}

// Component to center the map on current position and set appropriate zoom level
function MapUpdater({ center, isTracking }: { center: [number, number], isTracking: boolean }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, 16); // Higher zoom level (16) for better detail
  }, [map, center]);
  
  // If tracking is active, keep centering the map on current position
  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(() => {
        map.setView(center, 16);
      }, 3000); // Re-center every 3 seconds during active tracking
      
      return () => clearInterval(interval);
    }
  }, [map, center, isTracking]);
  
  return null;
}

function RouteMap({ route, isTracking }: { route: RunningSession["route"], isTracking: boolean }) {
  const mapCenter = route.length > 0 
    ? [route[route.length - 1].latitude, route[route.length - 1].longitude] as [number, number]
    : [51.505, -0.09] as [number, number]; // Default center

  const positions = route.map(point => [point.latitude, point.longitude] as [number, number]);

  return (
    <MapContainer 
      center={mapCenter} 
      zoom={16} // Higher zoom level for better detail
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Only show route line if we have multiple points */}
      {positions.length > 1 && (
        <Polyline 
          positions={positions} 
          color="#2563eb" // More visible blue color
          weight={4} 
          opacity={0.8} 
        />
      )}
      
      {/* Add map updater to keep the view centered on current position */}
      <MapUpdater center={mapCenter} isTracking={isTracking} />
    </MapContainer>
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
          description: "Please select music from your device to play during your run.",
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
          description: "Your browser doesn't support the Media API features.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Media Access Error",
        description: "Unable to access your media files.",
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
    <Card className="music-player">
      <CardHeader className="py-3">
        <CardTitle className="text-sm flex items-center">
          <Music className="h-4 w-4 mr-2" />
          Music Player
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="text-center">
          {currentTrack ? (
            <div className="mb-3 text-sm font-medium truncate">{currentTrack}</div>
          ) : (
            <div className="mb-3 text-sm text-muted-foreground">Select music to play during your run</div>
          )}
          
          <div className="flex justify-center gap-2 mt-1">
            <Button 
              onClick={togglePlayback} 
              variant={isPlaying ? "outline" : "default"}
              size="sm"
            >
              {isPlaying ? "Pause" : "Play"}
            </Button>
            
            <Button
              onClick={handleMediaAccess}
              variant="outline"
              size="sm"
            >
              Select Music
            </Button>
          </div>
        </div>
        
        {/* Hidden audio element */}
        <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
      </CardContent>
    </Card>
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
    <Card className="milestone-tracker">
      <CardHeader className="py-3">
        <CardTitle className="text-sm flex items-center">
          <Trophy className="h-4 w-4 mr-2" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3 space-y-4">
        {/* Daily progress first */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-sm font-medium">Today's Run</span>
              {currentDistance >= dailyGoalMiles && (
                <CheckCircle2 className="h-4 w-4 ml-2 text-green-500" />
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {currentDistance >= dailyGoalMiles ? "Goal achieved!" : "Keep going!"}
            </span>
          </div>
          <Progress value={dailyProgress} className="h-2" />
          <div className="text-xs text-right text-muted-foreground">
            {currentDistance.toFixed(2)} / {dailyGoalMiles.toFixed(2)} miles
          </div>
        </div>
        
        {/* Milestone trackers next */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-sm font-medium">5K Progress</span>
              {currentDistance >= MILESTONE_5K && (
                <CheckCircle2 className="h-4 w-4 ml-2 text-green-500" />
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              Best Time: {formatTime(bestTimes.fiveK)}
            </span>
          </div>
          <Progress value={fiveKProgress} className="h-2" />
          <div className="text-xs text-right text-muted-foreground">
            {currentDistance.toFixed(2)} / {MILESTONE_5K.toFixed(2)} miles
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-sm font-medium">10K Progress</span>
              {currentDistance >= MILESTONE_10K && (
                <CheckCircle2 className="h-4 w-4 ml-2 text-green-500" />
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              Best Time: {formatTime(bestTimes.tenK)}
            </span>
          </div>
          <Progress value={tenKProgress} className="h-2" />
          <div className="text-xs text-right text-muted-foreground">
            {currentDistance.toFixed(2)} / {MILESTONE_10K.toFixed(2)} miles
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Function to generate Fundi encouragement based on run progress
function getFundiEncouragement(distance: number, duration: number, isFirstRun: boolean) {
  if (isFirstRun) {
    return "Great job starting your running journey! Every step counts toward building a healthy habit.";
  }
  
  if (distance >= MILESTONE_10K) {
    return "Incredible achievement! You've completed a 10K run. Your dedication is truly inspiring!";
  } else if (distance >= MILESTONE_5K) {
    return "Amazing work! You've reached the 5K milestone. Your perseverance is paying off!";
  } else if (distance > 2) {
    return "You're making excellent progress! Keep pushing toward your goals - you've got this!";
  } else if (distance > 1) {
    return "You're doing great! Remember to keep a steady pace and enjoy your run.";
  } else if (duration > 300) { // 5 minutes
    return "You're off to a good start! Focus on your breathing and find your rhythm.";
  } else {
    return "Ready to achieve your running goals? I'm here to support you every step of the way!";
  }
}

export default function RunningApp() {
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
  
  const queryClient = useQueryClient();
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
          
          return;
        } catch (posError) {
          // User denied or there was an error
          localStorage.setItem('location_permission', 'denied');
          console.warn('Position access error:', posError);
        }
      }
      
      // Check permission status via the permissions API if available
      const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      setHasLocationPermission(permission.state === 'granted');
      
      // Update localStorage based on current permission state
      localStorage.setItem('location_permission', permission.state === 'granted' ? 'granted' : 'denied');

      if (permission.state === 'prompt') {
        toast({
          title: "Location Permission Required",
          description: "Please enable location services to track your runs.",
        });
      } else if (permission.state === 'denied') {
        toast({
          variant: "destructive",
          title: "Location Access Denied",
          description: "You've denied location access. Please enable it in your device settings to use this feature.",
        });
      }

      // Listen for permission changes
      permission.addEventListener('change', () => {
        const newState = permission.state === 'granted';
        setHasLocationPermission(newState);
        localStorage.setItem('location_permission', newState ? 'granted' : 'denied');
      });
    } catch (error) {
      console.error('Permission check error:', error);
      // Fall back to direct geolocation request if permissions API isn't available
      try {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setHasLocationPermission(true);
            localStorage.setItem('location_permission', 'granted');
            
            // Store the position
            if (position && position.coords) {
              localStorage.setItem('last_location', 
                JSON.stringify({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  timestamp: position.timestamp
                })
              );
            }
          },
          () => {
            setHasLocationPermission(false);
            localStorage.setItem('location_permission', 'denied');
            toast({
              variant: "destructive",
              title: "Location Access Denied",
              description: "You've denied location access. Please enable it in your device settings to use this feature.",
            });
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } catch (geoError) {
        toast({
          variant: "destructive",
          title: "Location Error",
          description: "Unable to access location services on this device.",
        });
      }
    }
  };

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

            // Calculate new distance in miles
            let distance = prev.distance;
            if (newRoute.length > 1) {
              const lastPoint = newRoute[newRoute.length - 2];
              const newPoint = newRoute[newRoute.length - 1];
              const kmDistance = calculateDistance(
                lastPoint.latitude,
                lastPoint.longitude,
                newPoint.latitude,
                newPoint.longitude
              );
              distance += kmDistance * 0.621371; // Convert km to miles
            }

            const duration = (Date.now() - prev.startTime) / 1000; // in seconds
            const pace = duration > 0 ? distance > 0 ? (duration / 60) / distance : 0 : 0; // min/mile

            // Check for milestones and show encouragement
            if (!showFundiEncouragement && 
                ((distance >= MILESTONE_5K && prev.distance < MILESTONE_5K) || 
                 (distance >= MILESTONE_10K && prev.distance < MILESTONE_10K))) {
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
          toast({
            variant: "destructive",
            title: "GPS Error",
            description: error.message,
          });
          stopRun();
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } 
    // For demo mode
    else if (permissionMode === 'demo') {
      // Start with the initial demo location from localStorage
      const storedLocation = localStorage.getItem('last_location');
      let initialLocation = { latitude: 40.7128, longitude: -74.0060, timestamp: Date.now() };
      
      if (storedLocation) {
        try {
          initialLocation = JSON.parse(storedLocation);
        } catch (e) {
          console.error('Error parsing stored location', e);
        }
      }
      
      setIsTracking(true);
      setCurrentSession({
        startTime: Date.now(),
        distance: 0,
        duration: 0,
        pace: 0,
        route: [initialLocation],
      });
      
      // Set up a simulated GPS tracker that moves the position slightly every few seconds
      const simulatedTrackingInterval = setInterval(() => {
        setCurrentSession((prev) => {
          if (!prev || !prev.route || prev.route.length === 0) return prev;
          
          // Get the last point
          const lastPoint = prev.route[prev.route.length - 1];
          
          // Create a new point with a small random offset (simulates movement)
          // These small offsets create a realistic-looking running route
          const newPoint = {
            latitude: lastPoint.latitude + (Math.random() * 0.0008 - 0.0004),
            longitude: lastPoint.longitude + (Math.random() * 0.0008 - 0.0004),
            timestamp: Date.now()
          };
          
          const newRoute = [...prev.route, newPoint];
          
          // Calculate new distance
          let distance = prev.distance;
          const kmDistance = calculateDistance(
            lastPoint.latitude,
            lastPoint.longitude,
            newPoint.latitude,
            newPoint.longitude
          );
          distance += kmDistance * 0.621371; // Convert km to miles
          
          const duration = (Date.now() - prev.startTime) / 1000; // in seconds
          
          // Calculate a realistic pace (slightly variable)
          // In demo mode, we aim for a typical jogging pace of around 9-10 min/mile
          const basePace = 9.5; // 9:30 min/mile base pace
          const variability = 0.5; // +/- 30 seconds variability
          const pace = basePace + (Math.random() * variability * 2 - variability);
          
          // Check for milestones and show encouragement
          if (!showFundiEncouragement && 
              ((distance >= MILESTONE_5K && prev.distance < MILESTONE_5K) || 
               (distance >= MILESTONE_10K && prev.distance < MILESTONE_10K))) {
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
    } else {
      // Shouldn't happen but just in case
      toast({
        variant: "destructive",
        title: "Location Error",
        description: "Please enable location services or use demo mode.",
      });
    }
  };

  const stopRun = () => {
    const permissionMode = localStorage.getItem('location_permission');
    
    if (permissionMode === 'granted' && watchIdRef.current) {
      // Clear real GPS watch
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    } else if (permissionMode === 'demo' && watchIdRef.current) {
      // Clear demo interval
      clearInterval(watchIdRef.current as unknown as number);
      watchIdRef.current = null;
    }
    
    setIsTracking(false);
    
    // Set end time and update session data
    if (currentSession) {
      const completed = { 
        ...currentSession,
        endTime: Date.now() 
      };
      setCurrentSession(completed);
      
      // Mark as having run before
      localStorage.setItem('has_run_before', 'true');
      setIsFirstRun(false);
      
      // Update best times if applicable
      if (completed.distance >= MILESTONE_5K) {
        // Check if this is a 5K PR
        const time5K = extrapolateTimeToDistance(completed, MILESTONE_5K);
        if (!bestTimes.fiveK || time5K < bestTimes.fiveK) {
          setBestTimes(prev => ({ ...prev, fiveK: time5K }));
          localStorage.setItem('best_run_times', JSON.stringify({ 
            ...bestTimes, 
            fiveK: time5K 
          }));
          
          // Show achievement toast
          toast({
            title: "New 5K Record!",
            description: `You set a new personal best of ${formatDuration(time5K)}!`,
          });
          
          // In a full implementation, save this to the database
          // saveRunningAchievement("5K", time5K);
        }
      }
      
      if (completed.distance >= MILESTONE_10K) {
        // Check if this is a 10K PR
        const time10K = extrapolateTimeToDistance(completed, MILESTONE_10K);
        if (!bestTimes.tenK || time10K < bestTimes.tenK) {
          setBestTimes(prev => ({ ...prev, tenK: time10K }));
          localStorage.setItem('best_run_times', JSON.stringify({ 
            ...bestTimes, 
            tenK: time10K 
          }));
          
          // Show achievement toast
          toast({
            title: "New 10K Record!",
            description: `You set a new personal best of ${formatDuration(time10K)}!`,
          });
          
          // In a full implementation, save this to the database
          // saveRunningAchievement("10K", time10K);
        }
      }
      
      // In a full implementation, this is where we'd save the run to the database
      // saveRunSession(completed);
      
      // Always show Fundi encouragement after a run
      setShowFundiEncouragement(true);
    }
  };
  
  // Estimate time at a specific distance point based on current pace
  const extrapolateTimeToDistance = (session: RunningSession, targetDistance: number): number => {
    // If the run was longer than the target distance, interpolate the actual time
    if (session.distance >= targetDistance) {
      // Simple interpolation using pace
      const estimatedSeconds = (targetDistance * session.pace * 60);
      return Math.round(estimatedSeconds);
    }
    return 0;
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value: number): number => (value * Math.PI) / 180;

  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPace = (pace: number): string => {
    const mins = Math.floor(pace);
    const secs = Math.floor((pace - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Run Tracker
          </CardTitle>
          <CardDescription>
            Track your runs and achieve your 5K and 10K goals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showFundiEncouragement && currentSession && (
            <Alert className="bg-green-50 border-green-200 mb-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-2">
                  {/* You can replace this with your Fundi avatar/icon */}
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <AlertDescription className="text-green-800">
                  {getFundiEncouragement(
                    currentSession.distance,
                    currentSession.duration,
                    isFirstRun
                  )}
                </AlertDescription>
              </div>
              <div className="mt-2 text-right">
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-green-700 p-0 h-auto"
                  onClick={() => setShowFundiEncouragement(false)}
                >
                  Dismiss
                </Button>
              </div>
            </Alert>
          )}

          {!hasLocationPermission ? (
            <div className="space-y-4">
              <div className="p-5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200 shadow-md">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-md">
                    <MapPin className="h-8 w-8" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-center text-orange-800 mb-3">Location Access Required</h3>
                
                <p className="text-center text-orange-700 mb-4">
                  To track your runs and provide accurate distance measurements, we need permission to use your device's GPS.
                </p>
                
                <div className="bg-white rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">How to enable location:</h4>
                  <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                    <li>Click the "Enable GPS Tracking" button below</li>
                    <li>Allow location access when prompted by your browser</li>
                    <li>Start tracking your runs with GPS!</li>
                  </ol>
                </div>
                
                <div className="flex flex-col gap-3">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={checkLocationPermission}
                  >
                    Enable GPS Tracking
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      localStorage.setItem('location_permission', 'demo');
                      setHasLocationPermission(true);
                      
                      toast({
                        title: "Demo Mode Activated",
                        description: "You can now use the run tracker with simulated GPS data.",
                      });
                    }}
                  >
                    Use Demo Mode
                  </Button>
                </div>
              </div>
              
              {/* Device settings links section */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h4 className="font-medium text-slate-700 mb-2 text-center">Already denied permission?</h4>
                <p className="text-sm text-slate-600 text-center mb-3">
                  You'll need to enable location in your device settings:
                </p>
                
                <div className="flex justify-center space-x-4">
                  {/* iOS Instructions */}
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-700 mb-1">iOS Devices</p>
                    <a 
                      href="App-prefs:root=Privacy&path=LOCATION"
                      className="text-xs text-blue-600 hover:underline cursor-pointer bg-blue-50 px-3 py-2 rounded-md flex items-center justify-center"
                    >
                      Settings → Safari → Location
                    </a>
                  </div>
                  
                  {/* Android Instructions */}
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-700 mb-1">Android Devices</p>
                    <a 
                      href="intent://settings/location#Intent;scheme=android-app;end"
                      className="text-xs text-blue-600 hover:underline cursor-pointer bg-blue-50 px-3 py-2 rounded-md flex items-center justify-center"
                    >
                      Settings → Apps → Browser → Permissions
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="run" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="run">Track Run</TabsTrigger>
                <TabsTrigger value="goals">Goals & Milestones</TabsTrigger>
              </TabsList>
              
              <TabsContent value="run" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Duration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {currentSession ? formatDuration(currentSession.duration) : "00:00:00"}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Distance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {currentSession ? currentSession.distance.toFixed(2) : "0.00"} mi
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Current Pace</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {currentSession && currentSession.pace > 0 
                          ? formatPace(currentSession.pace) 
                          : "--:--"} min/mi
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="h-[400px] rounded-lg overflow-hidden border relative">
                  {currentSession && currentSession.route.length > 0 ? (
                    <>
                      <RouteMap route={currentSession.route} isTracking={isTracking} />
                      
                      {/* Real-time tracking indicator overlay */}
                      {isTracking && (
                        <div className="absolute top-3 right-3 bg-white/90 rounded-md shadow-md px-3 py-2 flex items-center z-[1000] text-sm">
                          <div className="h-3 w-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                          <span>
                            {localStorage.getItem('location_permission') === 'demo' 
                              ? "Simulated GPS Data (Demo)" 
                              : "Live GPS Tracking"}
                          </span>
                        </div>
                      )}
                      
                      {/* Demo mode badge */}
                      {localStorage.getItem('location_permission') === 'demo' && (
                        <div className="absolute bottom-3 left-3 bg-orange-100 text-orange-800 rounded-md shadow-md px-3 py-1 flex items-center z-[1000] text-xs font-medium border border-orange-200">
                          <span>Demo Mode</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4 bg-slate-50">
                      <MapPin className="h-12 w-12 text-slate-400 mb-4" />
                      <h3 className="text-lg font-medium text-slate-700">GPS Map</h3>
                      <p className="text-sm text-slate-500 max-w-xs">
                        {isTracking 
                          ? "Waiting for GPS signal. Please make sure you're outside with clear sky view."
                          : "Press start to begin tracking your route. Map will appear when GPS data is available."}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Milestone Tracker */}
                {currentSession && (
                  <MilestoneTracker 
                    currentDistance={currentSession.distance} 
                    bestTimes={bestTimes}
                  />
                )}
                
                {/* Add music player integration */}
                <MusicPlayerControls />

                <div className="flex justify-center gap-4">
                  {!isTracking ? (
                    <Button
                      size="lg"
                      onClick={startRun}
                      className="w-32"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      variant="destructive"
                      onClick={stopRun}
                      className="w-32"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                  )}
                </div>
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
                          <CardTitle className="text-base flex items-center">
                            <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
                            5K Milestone
                          </CardTitle>
                          <Badge variant="secondary" className={bestTimes.fiveK ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}>
                            {bestTimes.fiveK ? "Achieved" : "In Progress"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Distance:</span>
                          <span className="font-medium">{MILESTONE_5K.toFixed(2)} miles</span>
                        </div>
                        
                        <div className="flex justify-between text-sm mb-3">
                          <span className="text-muted-foreground">Your Best Time:</span>
                          <span className="font-medium">
                            {bestTimes.fiveK ? formatDuration(bestTimes.fiveK) : "Not yet achieved"}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Button variant="outline" size="sm" className="text-xs">
                            <Target className="h-3 w-3 mr-1" />
                            Set Time Goal
                          </Button>
                          
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            Average: 30-40 min for beginners
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* 10K Goal Card */}
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base flex items-center">
                            <Trophy className="h-4 w-4 mr-2 text-blue-500" />
                            10K Milestone
                          </CardTitle>
                          <Badge variant={bestTimes.tenK ? "success" : "secondary"}>
                            {bestTimes.tenK ? "Achieved" : "In Progress"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Distance:</span>
                          <span className="font-medium">{MILESTONE_10K.toFixed(2)} miles</span>
                        </div>
                        
                        <div className="flex justify-between text-sm mb-3">
                          <span className="text-muted-foreground">Your Best Time:</span>
                          <span className="font-medium">
                            {bestTimes.tenK ? formatDuration(bestTimes.tenK) : "Not yet achieved"}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Button variant="outline" size="sm" className="text-xs">
                            <Target className="h-3 w-3 mr-1" />
                            Set Time Goal
                          </Button>
                          
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            Average: 60-80 min for beginners
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Add Custom Goal Button */}
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Custom Goal
                    </Button>
                    
                    {/* Fundi Advice */}
                    <Alert className="bg-blue-50 border-blue-200">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-2">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Flag className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <AlertDescription className="text-blue-800">
                          <p className="mb-2">
                            <span className="font-medium">Fundi's Running Tip:</span> When aiming for a 5K or 10K milestone, focus on consistency rather than speed. Regular training is more important than pushing too hard in a single session.
                          </p>
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="text-blue-700 p-0 h-auto"
                          >
                            Get more running advice
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </AlertDescription>
                      </div>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}