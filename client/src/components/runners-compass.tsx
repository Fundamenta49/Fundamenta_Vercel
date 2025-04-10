import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
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
  Activity,
  Headphones,
  Pause,
  Calendar,
  Award,
  BarChart,
  Zap,
  BookOpen,
  Heart,
  Share2,
  Star,
  Sparkles,
  Map,
  Lightbulb,
  Brain,
  Loader2,
  Timer,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";

// Distance constants for milestone tracking
const MILESTONE_5K = 3.10686; // 5K in miles
const MILESTONE_10K = 6.21371; // 10K in miles
const MILESTONE_15K = 9.32057; // 15K in miles
const MILESTONE_20K = 12.4274; // 20K in miles
const MILESTONE_HALF_MARATHON = 13.1094; // Half marathon in miles
const MILESTONE_MARATHON = 26.2188; // Marathon in miles

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
  activePlanId?: string; // Optional plan ID if running with a training plan
}

interface RunningGoal {
  id: string;
  name: string;
  targetDistance: number;
  bestTime?: number; // in seconds
  completed: boolean;
  icon: JSX.Element;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  unlockedAt?: number; // timestamp when achieved
  criteria: {
    type: 'distance' | 'count' | 'streak' | 'milestone';
    value: number;
    metric: string;
  };
}

interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  targetDistance: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationWeeks: number;
  schedule: Array<{
    day: number; // 0-6 for Sunday to Saturday
    type: string; // 'rest', 'easy', 'tempo', 'interval', 'long'
    distance?: number; // target distance in miles
    duration?: number; // target duration in minutes
    description: string;
  }>;
  progress?: number; // percentage complete
  active?: boolean;
  activatedAt?: number; // when the plan was started
}

// Helper functions for date and time formatting
const formatDuration = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const formatPace = (paceMinutesPerMile: number): string => {
  if (!paceMinutesPerMile || isNaN(paceMinutesPerMile)) return '--:--';
  const mins = Math.floor(paceMinutesPerMile);
  const secs = Math.floor((paceMinutesPerMile - mins) * 60);
  return `${mins}'${secs.toString().padStart(2, '0')}"`;
};

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

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

function MusicPlayerControls() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
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
          title: "Media Support Error",
          description: "Your browser doesn't support the Media Session API.",
        });
      }
    } catch (error) {
      console.error('Media error:', error);
      toast({
        variant: "destructive",
        title: "Media Error",
        description: "There was an error accessing your device media.",
      });
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
              className="flex items-center gap-1"
            >
              {isPlaying ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> Play</>}
            </Button>
            
            <Button
              onClick={handleMediaAccess}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Headphones className="h-4 w-4" /> Select Music
            </Button>
          </div>
        </div>
        
        {/* Hidden audio element */}
        <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
      </CardContent>
    </Card>
  );
}

// Component to display running milestones
function MilestoneDisplay({ distance, bestTimes, onMilestoneCompleted }: { 
  distance: number, 
  bestTimes: {
    fiveK?: number,
    tenK?: number,
    fifteenK?: number,
    halfMarathon?: number,
    marathon?: number
  },
  onMilestoneCompleted: (milestone: string, time: number) => void
}) {
  const [fiveKReached, setFiveKReached] = useState<boolean>(false);
  const [tenKReached, setTenKReached] = useState<boolean>(false);
  const [fifteenKReached, setFifteenKReached] = useState<boolean>(false);
  const [halfMarathonReached, setHalfMarathonReached] = useState<boolean>(false);
  const sessionStartRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (!sessionStartRef.current) {
      sessionStartRef.current = Date.now();
    }
    
    // Check all milestones
    const currentTime = Math.floor((Date.now() - (sessionStartRef.current || 0)) / 1000);
    
    // Check if 5K milestone reached
    if (!fiveKReached && distance >= MILESTONE_5K) {
      setFiveKReached(true);
      onMilestoneCompleted('5K', currentTime);
    }
    
    // Check if 10K milestone reached
    if (!tenKReached && distance >= MILESTONE_10K) {
      setTenKReached(true);
      onMilestoneCompleted('10K', currentTime);
    }
    
    // Check if 15K milestone reached
    if (!fifteenKReached && distance >= MILESTONE_15K) {
      setFifteenKReached(true);
      onMilestoneCompleted('15K', currentTime);
    }
    
    // Check if half marathon milestone reached
    if (!halfMarathonReached && distance >= MILESTONE_HALF_MARATHON) {
      setHalfMarathonReached(true);
      onMilestoneCompleted('Half Marathon', currentTime);
    }
  }, [distance, fiveKReached, tenKReached, fifteenKReached, halfMarathonReached, onMilestoneCompleted]);
  
  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-sm flex items-center">
          <Trophy className="h-4 w-4 mr-2" />
          Running Milestones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {/* 5K Milestone Card */}
          <Card className={`overflow-hidden border ${distance >= MILESTONE_5K ? 'border-green-500 bg-green-50' : 'bg-gray-50'}`}>
            <CardHeader className="py-2 px-3">
              <CardTitle className="text-sm flex items-center">
                <Flag className={`h-4 w-4 mr-2 ${distance >= MILESTONE_5K ? 'text-green-600' : 'text-gray-500'}`} />
                5K Run
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-3">
              <div className="mb-2">
                <Progress 
                  value={Math.min((distance / MILESTONE_5K) * 100, 100)} 
                  className="h-2" 
                />
                <p className="text-xs mt-1">
                  {Math.min(((distance / MILESTONE_5K) * 100), 100).toFixed(1)}% complete
                </p>
              </div>
              
              {bestTimes.fiveK && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Best: {formatDuration(bestTimes.fiveK)}</span>
                </div>
              )}
              
              {fiveKReached && !bestTimes.fiveK && (
                <Badge variant="outline" className="mt-1 bg-green-100 text-green-800 hover:bg-green-100 border-green-200 text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> First 5K!
                </Badge>
              )}
            </CardContent>
          </Card>
          
          {/* 10K Milestone Card */}
          <Card className={`overflow-hidden border ${distance >= MILESTONE_10K ? 'border-green-500 bg-green-50' : 'bg-gray-50'}`}>
            <CardHeader className="py-2 px-3">
              <CardTitle className="text-sm flex items-center">
                <Flag className={`h-4 w-4 mr-2 ${distance >= MILESTONE_10K ? 'text-green-600' : 'text-gray-500'}`} />
                10K Run
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-3">
              <div className="mb-2">
                <Progress 
                  value={Math.min((distance / MILESTONE_10K) * 100, 100)} 
                  className="h-2" 
                />
                <p className="text-xs mt-1">
                  {Math.min(((distance / MILESTONE_10K) * 100), 100).toFixed(1)}% complete
                </p>
              </div>
              
              {bestTimes.tenK && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Best: {formatDuration(bestTimes.tenK)}</span>
                </div>
              )}
              
              {tenKReached && !bestTimes.tenK && (
                <Badge variant="outline" className="mt-1 bg-green-100 text-green-800 hover:bg-green-100 border-green-200 text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> First 10K!
                </Badge>
              )}
            </CardContent>
          </Card>
          
          {/* 15K Milestone Card */}
          <Card className={`overflow-hidden border ${distance >= MILESTONE_15K ? 'border-green-500 bg-green-50' : 'bg-gray-50'}`}>
            <CardHeader className="py-2 px-3">
              <CardTitle className="text-sm flex items-center">
                <Flag className={`h-4 w-4 mr-2 ${distance >= MILESTONE_15K ? 'text-green-600' : 'text-gray-500'}`} />
                15K Run
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-3">
              <div className="mb-2">
                <Progress 
                  value={Math.min((distance / MILESTONE_15K) * 100, 100)} 
                  className="h-2" 
                />
                <p className="text-xs mt-1">
                  {Math.min(((distance / MILESTONE_15K) * 100), 100).toFixed(1)}% complete
                </p>
              </div>
              
              {bestTimes.fifteenK && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Best: {formatDuration(bestTimes.fifteenK)}</span>
                </div>
              )}
              
              {fifteenKReached && !bestTimes.fifteenK && (
                <Badge variant="outline" className="mt-1 bg-green-100 text-green-800 hover:bg-green-100 border-green-200 text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> First 15K!
                </Badge>
              )}
            </CardContent>
          </Card>
          
          {/* Half Marathon Milestone Card */}
          <Card className={`overflow-hidden border ${distance >= MILESTONE_HALF_MARATHON ? 'border-green-500 bg-green-50' : 'bg-gray-50'}`}>
            <CardHeader className="py-2 px-3">
              <CardTitle className="text-sm flex items-center">
                <Flag className={`h-4 w-4 mr-2 ${distance >= MILESTONE_HALF_MARATHON ? 'text-green-600' : 'text-gray-500'}`} />
                Half Marathon
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-3">
              <div className="mb-2">
                <Progress 
                  value={Math.min((distance / MILESTONE_HALF_MARATHON) * 100, 100)} 
                  className="h-2" 
                />
                <p className="text-xs mt-1">
                  {Math.min(((distance / MILESTONE_HALF_MARATHON) * 100), 100).toFixed(1)}% complete
                </p>
              </div>
              
              {bestTimes.halfMarathon && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Best: {formatDuration(bestTimes.halfMarathon)}</span>
                </div>
              )}
              
              {halfMarathonReached && !bestTimes.halfMarathon && (
                <Badge variant="outline" className="mt-1 bg-green-100 text-green-800 hover:bg-green-100 border-green-200 text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> First Half Marathon!
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

// Predefined training plans
const DEFAULT_TRAINING_PLANS: TrainingPlan[] = [
  {
    id: 'beginner-5k',
    name: 'Beginner 5K',
    description: 'Perfect for first-time runners looking to complete their first 5K race',
    targetDistance: MILESTONE_5K,
    difficulty: 'beginner',
    durationWeeks: 8,
    schedule: [
      { day: 1, type: 'easy', distance: 1, description: 'Easy run/walk' },
      { day: 3, type: 'interval', distance: 1.5, description: 'Walk 2 min, Run 1 min (repeat 8x)' },
      { day: 5, type: 'easy', distance: 2, description: 'Easy pace run/walk' },
      { day: 0, type: 'rest', description: 'Rest day' },
      { day: 2, type: 'rest', description: 'Rest day' },
      { day: 4, type: 'rest', description: 'Rest day' },
      { day: 6, type: 'rest', description: 'Rest day' },
    ]
  },
  {
    id: 'intermediate-10k',
    name: 'Intermediate 10K',
    description: 'For runners who can run 5K continuously and want to move to 10K',
    targetDistance: MILESTONE_10K,
    difficulty: 'intermediate',
    durationWeeks: 10,
    schedule: [
      { day: 1, type: 'easy', distance: 3, description: 'Easy run' },
      { day: 3, type: 'tempo', distance: 4, description: 'Moderate pace run' },
      { day: 5, type: 'interval', distance: 3, description: 'Speed intervals (1 min fast, 2 min recover) x8' },
      { day: 6, type: 'long', distance: 5, description: 'Long slow run' },
      { day: 0, type: 'rest', description: 'Rest day' },
      { day: 2, type: 'rest', description: 'Rest day' },
      { day: 4, type: 'rest', description: 'Rest day' },
    ]
  },
  {
    id: 'advanced-half',
    name: 'Advanced Half Marathon',
    description: 'Challenging plan for experienced runners to achieve a personal best in a half marathon',
    targetDistance: MILESTONE_HALF_MARATHON,
    difficulty: 'advanced',
    durationWeeks: 12,
    schedule: [
      { day: 1, type: 'easy', distance: 5, description: 'Easy recovery run' },
      { day: 2, type: 'interval', distance: 6, description: 'Track intervals: 800m repeats' },
      { day: 4, type: 'tempo', distance: 7, description: 'Tempo run with 3 miles at race pace' },
      { day: 5, type: 'easy', distance: 4, description: 'Easy run' },
      { day: 6, type: 'long', distance: 10, description: 'Long slow run' },
      { day: 0, type: 'rest', description: 'Rest day' },
      { day: 3, type: 'rest', description: 'Rest or cross-train' },
    ]
  },
];

// Predefined achievements to unlock
const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-run',
    name: 'First Steps',
    description: 'Completed your first run',
    icon: <Play className="h-4 w-4 text-blue-500" />,
    criteria: { type: 'count', value: 1, metric: 'runs' }
  },
  {
    id: 'distance-5k',
    name: '5K Milestone',
    description: 'Ran your first 5K distance',
    icon: <Flag className="h-4 w-4 text-green-500" />,
    criteria: { type: 'milestone', value: MILESTONE_5K, metric: 'distance' }
  },
  {
    id: 'distance-10k',
    name: '10K Milestone',
    description: 'Ran your first 10K distance',
    icon: <Award className="h-4 w-4 text-orange-500" />,
    criteria: { type: 'milestone', value: MILESTONE_10K, metric: 'distance' }
  },
  {
    id: 'distance-15k',
    name: '15K Milestone',
    description: 'Ran your first 15K distance',
    icon: <Trophy className="h-4 w-4 text-purple-500" />,
    criteria: { type: 'milestone', value: MILESTONE_15K, metric: 'distance' }
  },
  {
    id: 'distance-half-marathon',
    name: 'Half Marathon',
    description: 'Completed your first half marathon distance',
    icon: <Star className="h-4 w-4 text-amber-500" />,
    criteria: { type: 'milestone', value: MILESTONE_HALF_MARATHON, metric: 'distance' }
  },
  {
    id: 'weekly-streak',
    name: 'Weekly Warrior',
    description: 'Completed runs on 5 different days in a week',
    icon: <Sparkles className="h-4 w-4 text-yellow-500" />,
    criteria: { type: 'streak', value: 5, metric: 'daysPerWeek' }
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Completed a run before 7am',
    icon: <Clock className="h-4 w-4 text-indigo-500" />,
    criteria: { type: 'count', value: 1, metric: 'earlyRun' }
  },
  {
    id: 'total-distance-100',
    name: '100 Mile Club',
    description: 'Ran a total of 100 miles',
    icon: <Map className="h-4 w-4 text-red-500" />,
    criteria: { type: 'distance', value: 100, metric: 'total' }
  },
];

// AI Training Plan Generator component
function TrainingPlanGenerator({ 
  onSelectPlan 
}: { 
  onSelectPlan: (plan: TrainingPlan) => void 
}) {
  const [generating, setGenerating] = useState(false);
  const [targetDistance, setTargetDistance] = useState<string>("5k");
  const [fitnessLevel, setFitnessLevel] = useState<string>("beginner");
  const [weeksAvailable, setWeeksAvailable] = useState<string>("8");
  const { toast } = useToast();

  const generateCustomPlan = async () => {
    setGenerating(true);
    
    // Convert target distance to numeric value
    let distanceValue = MILESTONE_5K;
    if (targetDistance === "10k") distanceValue = MILESTONE_10K;
    if (targetDistance === "15k") distanceValue = MILESTONE_15K;
    if (targetDistance === "half-marathon") distanceValue = MILESTONE_HALF_MARATHON;
    if (targetDistance === "marathon") distanceValue = MILESTONE_MARATHON;
    
    try {
      // This would normally be an API call, but we'll simulate it
      // In a real app, this would call the OpenAI API to generate a custom plan
      
      // For demonstration, we'll use a predefined plan with slight modifications
      let basePlan: TrainingPlan;
      
      if (distanceValue <= MILESTONE_5K) {
        basePlan = {...DEFAULT_TRAINING_PLANS[0]};
      } else if (distanceValue <= MILESTONE_10K) {
        basePlan = {...DEFAULT_TRAINING_PLANS[1]};
      } else {
        basePlan = {...DEFAULT_TRAINING_PLANS[2]};
      }
      
      // Create a customized version of the plan
      const customPlan: TrainingPlan = {
        ...basePlan,
        id: `custom-${Date.now()}`,
        name: `Custom ${targetDistance.toUpperCase()} Plan`,
        description: `Personalized ${fitnessLevel} level plan for ${targetDistance.toUpperCase()} distance`,
        targetDistance: distanceValue,
        difficulty: fitnessLevel as 'beginner' | 'intermediate' | 'advanced',
        durationWeeks: parseInt(weeksAvailable),
        // Adjust schedule based on fitness level
        schedule: basePlan.schedule.map(day => {
          if (day.type === 'rest') return day;
          
          // Adjust distances based on fitness level and target
          let distanceMultiplier = 1.0;
          if (fitnessLevel === 'beginner') distanceMultiplier = 0.8;
          if (fitnessLevel === 'advanced') distanceMultiplier = 1.2;
          
          return {
            ...day,
            distance: day.distance ? day.distance * distanceMultiplier : undefined
          };
        })
      };
      
      // In a real implementation, you would call an API to generate the plan:
      // const response = await apiRequest('/api/generate-running-plan', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     targetDistance,
      //     fitnessLevel, 
      //     weeksAvailable
      //   })
      // });
      // const customPlan = await response.json();
      
      toast({
        title: "Training Plan Created",
        description: `Your custom ${targetDistance.toUpperCase()} plan is ready!`,
      });
      
      onSelectPlan(customPlan);
    } catch (error) {
      console.error('Error generating training plan:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate training plan. Please try again.",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Brain className="h-5 w-5 text-primary mr-2" />
          AI Training Plan Generator
        </CardTitle>
        <CardDescription>
          Create a personalized running plan tailored to your goals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="target-distance">Target Distance</Label>
          <Select 
            value={targetDistance} 
            onValueChange={setTargetDistance}
          >
            <SelectTrigger id="target-distance">
              <SelectValue placeholder="Select distance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5k">5K (3.1 miles)</SelectItem>
              <SelectItem value="10k">10K (6.2 miles)</SelectItem>
              <SelectItem value="15k">15K (9.3 miles)</SelectItem>
              <SelectItem value="half-marathon">Half Marathon (13.1 miles)</SelectItem>
              <SelectItem value="marathon">Marathon (26.2 miles)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fitness-level">Your Fitness Level</Label>
          <Select 
            value={fitnessLevel} 
            onValueChange={setFitnessLevel}
          >
            <SelectTrigger id="fitness-level">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner (New to running)</SelectItem>
              <SelectItem value="intermediate">Intermediate (Can run 30+ minutes)</SelectItem>
              <SelectItem value="advanced">Advanced (Experienced runner)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="weeks-available">Training Time Available</Label>
          <Select 
            value={weeksAvailable} 
            onValueChange={setWeeksAvailable}
          >
            <SelectTrigger id="weeks-available">
              <SelectValue placeholder="Select weeks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4">4 weeks (Quick plan)</SelectItem>
              <SelectItem value="8">8 weeks (Standard plan)</SelectItem>
              <SelectItem value="12">12 weeks (Gradual build)</SelectItem>
              <SelectItem value="16">16 weeks (Extended plan)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={generateCustomPlan} 
          className="w-full mt-2"
          disabled={generating}
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Plan...
            </>
          ) : (
            <>
              <Lightbulb className="h-4 w-4 mr-2" />
              Generate Custom Plan
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// Component to display a training plan
function TrainingPlanDetail({ 
  plan, 
  onActivate, 
  isActive 
}: { 
  plan: TrainingPlan, 
  onActivate: (planId: string) => void,
  isActive: boolean 
}) {
  // Get current day of week (0-6, Sunday to Saturday)
  const currentDayOfWeek = new Date().getDay();
  
  // Find today's workout
  const todaysWorkout = plan.schedule.find(day => day.day === currentDayOfWeek);

  return (
    <Card className={`border ${isActive ? 'border-green-500' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Badge className="mr-2" variant={
              plan.difficulty === 'beginner' ? 'outline' : 
              plan.difficulty === 'intermediate' ? 'secondary' : 
              'default'
            }>
              {plan.difficulty.charAt(0).toUpperCase() + plan.difficulty.slice(1)}
            </Badge>
            <CardTitle>{plan.name}</CardTitle>
          </div>
          {isActive && (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Active
            </Badge>
          )}
        </div>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center text-sm">
            <Flag className="h-4 w-4 mr-1 text-blue-500" />
            <span>{plan.targetDistance.toFixed(1)} miles</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-1 text-purple-500" />
            <span>{plan.durationWeeks} weeks</span>
          </div>
        </div>
        
        {isActive && todaysWorkout && (
          <Alert className="bg-blue-50 border-blue-200">
            <div className="flex items-start">
              <Activity className="h-4 w-4 text-blue-500 mt-0.5 mr-2" />
              <div>
                <AlertTitle className="text-blue-800 text-sm">Today's Workout</AlertTitle>
                <AlertDescription className="text-blue-700 text-xs mt-1">
                  {todaysWorkout.type === 'rest' ? (
                    "Rest day - recover and recharge!"
                  ) : (
                    `${todaysWorkout.type.charAt(0).toUpperCase() + todaysWorkout.type.slice(1)} run: ${todaysWorkout.distance} miles. ${todaysWorkout.description}`
                  )}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}
        
        {!isActive && (
          <Button 
            className="w-full" 
            onClick={() => onActivate(plan.id)}
          >
            <Play className="h-4 w-4 mr-2" />
            Activate Plan
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function RunnersCompass() {
  const { toast } = useToast();
  const [isTracking, setIsTracking] = useState(false);
  const [currentSession, setCurrentSession] = useState<RunningSession | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [activeTab, setActiveTab] = useState("run");
  
  // Enhanced state for tracking achievements and milestones
  const [runningGoals, setRunningGoals] = useState<RunningGoal[]>([]);
  const [bestTimes, setBestTimes] = useState<{
    fiveK?: number,
    tenK?: number,
    fifteenK?: number,
    halfMarathon?: number,
    marathon?: number
  }>({});
  const [totalStats, setTotalStats] = useState({
    totalRuns: 0,
    totalDistance: 0,
    totalDuration: 0,
    weeklyRunDays: 0,
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [availableAchievements, setAvailableAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);
  
  // Training plans state
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>(DEFAULT_TRAINING_PLANS);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  
  const [isFirstRun, setIsFirstRun] = useState(true);
  
  const watchIdRef = useRef<number | null>(null);

  // Check if this is user's first run
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

  // Load best times on mount
  useEffect(() => {
    const savedBestTimes = localStorage.getItem('best_times');
    if (savedBestTimes) {
      try {
        setBestTimes(JSON.parse(savedBestTimes));
      } catch (e) {
        console.error('Error parsing saved best times', e);
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
      if (navigator.permissions) {
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
      }
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
      // Ask for location permission or suggest using demo mode
      runInDemoMode();
    }
    
    // Mark that the user has run at least once
    localStorage.setItem('has_run_before', 'true');
    setIsFirstRun(false);
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
    setCurrentSession((prev) => {
      if (!prev) return null;
      
      const endTime = Date.now();
      // Check if this run beat any personal records
      const runDuration = (endTime - prev.startTime) / 1000; // in seconds
      
      // Check if 5K was reached during this run
      if (prev.distance >= MILESTONE_5K) {
        // Extrapolate 5K time based on current pace if we went beyond 5K
        let fiveKTime = runDuration;
        if (prev.distance > MILESTONE_5K) {
          // Calculate time it took to reach exactly 5K based on pace
          fiveKTime = (MILESTONE_5K / prev.distance) * runDuration;
        }
        
        // Update best time if this is faster or first 5K
        const currentBest = bestTimes.fiveK;
        if (!currentBest || fiveKTime < currentBest) {
          const newBestTimes = { ...bestTimes, fiveK: fiveKTime };
          setBestTimes(newBestTimes);
          localStorage.setItem('best_times', JSON.stringify(newBestTimes));
          
          toast({
            title: "New Personal Record!",
            description: `You just set a new 5K record: ${formatDuration(fiveKTime)}`,
          });
        }
      }
      
      // Check if 10K was reached during this run
      if (prev.distance >= MILESTONE_10K) {
        // Extrapolate 10K time based on current pace if we went beyond 10K
        let tenKTime = runDuration;
        if (prev.distance > MILESTONE_10K) {
          // Calculate time it took to reach exactly 10K based on pace
          tenKTime = (MILESTONE_10K / prev.distance) * runDuration;
        }
        
        // Update best time if this is faster or first 10K
        const currentBest = bestTimes.tenK;
        if (!currentBest || tenKTime < currentBest) {
          const newBestTimes = { ...bestTimes, tenK: tenKTime };
          setBestTimes(newBestTimes);
          localStorage.setItem('best_times', JSON.stringify(newBestTimes));
          
          toast({
            title: "New Personal Record!",
            description: `You just set a new 10K record: ${formatDuration(tenKTime)}`,
          });
        }
      }
      
      return { ...prev, endTime };
    });
    
    // Show completion message
    if (currentSession && currentSession.distance > 0) {
      toast({
        title: "Run Completed",
        description: `You ran ${currentSession.distance.toFixed(2)} miles in ${formatDuration(currentSession.duration)}.`,
      });
    }
  };
  
  const runInDemoMode = () => {
    localStorage.setItem('location_permission', 'demo');
    startRun();
  };

  const handleMilestoneCompleted = (milestone: string, time: number) => {
    // When a user completes a milestone during an active run
    let message = '';
    
    if (milestone === '5K') {
      message = 'You just ran 5K!';
      // Update best time if this is faster or first 5K
      const currentBest = bestTimes.fiveK;
      if (!currentBest || time < currentBest) {
        const newBestTimes = { ...bestTimes, fiveK: time };
        setBestTimes(newBestTimes);
        localStorage.setItem('best_times', JSON.stringify(newBestTimes));
        message += ' New personal record!';
      }
    } else if (milestone === '10K') {
      message = 'You just ran 10K!';
      // Update best time if this is faster or first 10K
      const currentBest = bestTimes.tenK;
      if (!currentBest || time < currentBest) {
        const newBestTimes = { ...bestTimes, tenK: time };
        setBestTimes(newBestTimes);
        localStorage.setItem('best_times', JSON.stringify(newBestTimes));
        message += ' New personal record!';
      }
    }
    
    toast({
      title: 'Milestone Reached!',
      description: message,
    });
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

  const formatPace = (paceMinutesPerMile: number): string => {
    if (!paceMinutesPerMile || isNaN(paceMinutesPerMile)) return '--:--';
    const mins = Math.floor(paceMinutesPerMile);
    const secs = Math.floor((paceMinutesPerMile - mins) * 60);
    return `${mins}'${secs.toString().padStart(2, '0')}"`;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Activity className="h-5 w-5 text-primary" />
            Runners Compass
          </CardTitle>
          <CardDescription>
            Track your runs and reach milestones with GPS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="run" className="flex items-center gap-1 text-xs sm:text-sm">
                <Timer className="h-4 w-4" /> Run Tracker
              </TabsTrigger>
              <TabsTrigger value="plans" className="flex items-center gap-1 text-xs sm:text-sm">
                <Brain className="h-4 w-4" /> Training Plans
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-1 text-xs sm:text-sm">
                <Trophy className="h-4 w-4" /> Achievements
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="run" className="space-y-4 mt-4">
              {!hasLocationPermission && localStorage.getItem('location_permission') !== 'demo' ? (
                <div className="space-y-4">
                  <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 shadow-md">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-md">
                        <MapPin className="h-8 w-8" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-center text-blue-800 mb-3">Location Access Required</h3>
                    
                    <p className="text-center text-blue-700 mb-6">
                      To track your runs and provide accurate distance measurements, we need permission to use your device's GPS.
                    </p>
                    
                    <div className="flex flex-col gap-3">
                      <Button 
                        onClick={checkLocationPermission}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Enable GPS Tracking
                      </Button>
                      
                      <Button 
                        variant="outline"
                        onClick={runInDemoMode}
                        className="w-full"
                      >
                        <Activity className="h-4 w-4 mr-2" />
                        Try Demo Mode
                      </Button>
                    </div>
                    
                    <p className="text-xs text-center text-blue-600 mt-4">
                      Demo mode uses simulated GPS data and is great for testing the app.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Current Run Data */}
                  <div className="grid grid-cols-3 gap-3">
                    <Card className="bg-blue-50">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs text-center">Distance</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-0 text-center">
                        <div className="text-2xl font-bold text-blue-700">
                          {currentSession ? currentSession.distance.toFixed(2) : '0.00'}
                          <span className="text-sm ml-1">mi</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-orange-50">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs text-center">Time</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-0 text-center">
                        <div className="text-2xl font-bold text-orange-700">
                          {currentSession ? formatDuration(currentSession.duration).substring(3) : '00:00'}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-green-50">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs text-center">Pace</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-0 text-center">
                        <div className="text-2xl font-bold text-green-700">
                          {currentSession && currentSession.pace > 0 ? formatPace(currentSession.pace) : '--:--'}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Map Container */}
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
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                        <MapPin className="h-12 w-12 mb-2" />
                        <p className="text-sm">Start your run to see your route</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Controls */}
                  <div className="flex justify-center gap-4">
                    {!isTracking ? (
                      <Button 
                        onClick={startRun} 
                        size="lg"
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8"
                      >
                        <Play className="h-5 w-5" />
                        Start Run
                      </Button>
                    ) : (
                      <Button 
                        onClick={stopRun}
                        size="lg"
                        variant="destructive"
                        className="flex items-center gap-2 px-8"
                      >
                        <Square className="h-5 w-5" />
                        Stop Run
                      </Button>
                    )}
                  </div>
                  
                  {/* Music player for running */}
                  <div className="mt-4">
                    <MusicPlayerControls />
                  </div>
                  
                  {/* Milestone tracking for active run */}
                  {currentSession && (
                    <div className="mt-2">
                      <MilestoneDisplay 
                        distance={currentSession.distance} 
                        bestTimes={bestTimes}
                        onMilestoneCompleted={handleMilestoneCompleted}
                      />
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="plans" className="space-y-4 mt-4">
              <div className="space-y-6">
                {/* AI Training Plan Generator */}
                <TrainingPlanGenerator 
                  onSelectPlan={(plan) => {
                    setTrainingPlans(prev => [...prev, plan]);
                    toast({
                      title: "Plan Added",
                      description: "Your custom training plan has been added to your plans."
                    });
                  }} 
                />
                
                {/* Current Active Plan */}
                {activePlanId && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium flex items-center">
                      <Play className="h-5 w-5 text-green-500 mr-2" />
                      Active Training Plan
                    </h3>
                    
                    {trainingPlans
                      .filter(plan => plan.id === activePlanId)
                      .map(plan => (
                        <TrainingPlanDetail 
                          key={plan.id} 
                          plan={plan} 
                          isActive={true}
                          onActivate={() => {}} // No-op since it's already active
                        />
                      ))
                    }
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setActivePlanId(null);
                        toast({
                          title: "Plan Deactivated",
                          description: "You can now run without a training plan or activate a different one."
                        });
                      }}
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Deactivate Plan
                    </Button>
                  </div>
                )}
                
                {/* Available Plans */}
                <div className="space-y-2">
                  <h3 className="text-lg font-medium flex items-center">
                    <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                    Available Training Plans
                  </h3>
                  
                  <div className="space-y-4">
                    {trainingPlans
                      .filter(plan => plan.id !== activePlanId)
                      .map(plan => (
                        <TrainingPlanDetail 
                          key={plan.id} 
                          plan={plan} 
                          isActive={false}
                          onActivate={(planId) => {
                            setActivePlanId(planId);
                            toast({
                              title: "Plan Activated",
                              description: `${plan.name} is now your active training plan.`
                            });
                          }}
                        />
                      ))
                    }
                    
                    {trainingPlans.filter(plan => plan.id !== activePlanId).length === 0 && (
                      <Alert className="bg-blue-50 border-blue-200">
                        <div className="flex items-start">
                          <div className="mr-3 mt-1">
                            <Lightbulb className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <AlertTitle className="text-blue-800">No Available Plans</AlertTitle>
                            <AlertDescription className="text-sm text-blue-700">
                              Generate a custom AI training plan above to get started, or activate one of the default plans.
                            </AlertDescription>
                          </div>
                        </div>
                      </Alert>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="stats" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Trophy className="h-5 w-5 text-amber-500 mr-2" />
                    Your Running Achievements
                  </CardTitle>
                  <CardDescription>
                    Track your progress and unlock new achievements as you run
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Personal Records Section */}
                  <div className="space-y-3">
                    <h3 className="text-base font-medium">Personal Records</h3>
                    
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      <Card className="border border-amber-200 bg-amber-50">
                        <CardHeader className="py-3 px-4">
                          <CardTitle className="text-sm font-medium flex items-center">
                            <Target className="h-4 w-4 text-amber-600 mr-2" />
                            5K Best
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2 px-4">
                          {bestTimes.fiveK ? (
                            <div className="text-lg font-bold text-amber-700">
                              {formatDuration(bestTimes.fiveK)}
                            </div>
                          ) : (
                            <div className="text-sm text-amber-700 opacity-70 italic">
                              Not yet
                            </div>
                          )}
                        </CardContent>
                      </Card>
                      
                      <Card className="border border-amber-200 bg-amber-50">
                        <CardHeader className="py-3 px-4">
                          <CardTitle className="text-sm font-medium flex items-center">
                            <Target className="h-4 w-4 text-amber-600 mr-2" />
                            10K Best
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2 px-4">
                          {bestTimes.tenK ? (
                            <div className="text-lg font-bold text-amber-700">
                              {formatDuration(bestTimes.tenK)}
                            </div>
                          ) : (
                            <div className="text-sm text-amber-700 opacity-70 italic">
                              Not yet
                            </div>
                          )}
                        </CardContent>
                      </Card>
                      
                      <Card className="border border-amber-200 bg-amber-50">
                        <CardHeader className="py-3 px-4">
                          <CardTitle className="text-sm font-medium flex items-center">
                            <Target className="h-4 w-4 text-amber-600 mr-2" />
                            15K Best
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2 px-4">
                          {bestTimes.fifteenK ? (
                            <div className="text-lg font-bold text-amber-700">
                              {formatDuration(bestTimes.fifteenK)}
                            </div>
                          ) : (
                            <div className="text-sm text-amber-700 opacity-70 italic">
                              Not yet
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  {/* Achievements Section */}
                  <div className="space-y-3 mt-6">
                    <h3 className="text-base font-medium">Achievements</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {achievements.length > 0 ? (
                        achievements.map(achievement => (
                          <Card key={achievement.id} className="border border-green-200 bg-green-50">
                            <CardHeader className="py-3 px-4">
                              <CardTitle className="text-sm font-medium flex items-center">
                                {achievement.icon}
                                <span className="ml-2">{achievement.name}</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="py-2 px-4">
                              <div className="text-sm text-green-700">
                                {achievement.description}
                              </div>
                              {achievement.unlockedAt && (
                                <div className="text-xs text-green-600 mt-1">
                                  Unlocked on {formatDate(achievement.unlockedAt)}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="col-span-full">
                          <Alert className="bg-blue-50 border-blue-200">
                            <div className="flex items-start">
                              <div className="mr-3 mt-1">
                                <Award className="h-5 w-5 text-blue-500" />
                              </div>
                              <div>
                                <AlertTitle className="text-blue-800">No Achievements Yet</AlertTitle>
                                <AlertDescription className="text-sm text-blue-700">
                                  Complete your first run to start earning achievements! You can unlock achievements by reaching milestones, maintaining streaks, and more.
                                </AlertDescription>
                                
                                <Button
                                  onClick={() => setActiveTab("run")}
                                  size="sm"
                                  className="mt-3"
                                >
                                  <ArrowRight className="h-4 w-4 mr-2" />
                                  Start Running
                                </Button>
                              </div>
                            </div>
                          </Alert>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Upcoming Achievements */}
                  <div className="space-y-3 mt-6">
                    <h3 className="text-base font-medium">Upcoming Achievements</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {availableAchievements.slice(0, 4).map(achievement => (
                        <Card key={achievement.id} className="border border-gray-200 bg-gray-50">
                          <CardHeader className="py-3 px-4">
                            <CardTitle className="text-sm font-medium flex items-center text-gray-600">
                              {achievement.icon}
                              <span className="ml-2">{achievement.name}</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="py-2 px-4">
                            <div className="text-sm text-gray-500">
                              {achievement.description}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  {/* Getting Started Guide */}
                  {isFirstRun && (
                    <Alert className="bg-blue-50 border-blue-200 mt-4">
                      <div className="flex items-start">
                        <div className="mr-3 mt-1">
                          <MapPin className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-800 mb-1">Get Started with Running</h4>
                          <AlertDescription className="text-sm text-blue-700">
                            <p className="mb-2">Ready to start your running journey? Here's how:</p>
                            <ol className="list-decimal pl-5 space-y-1">
                              <li>Give permission for GPS tracking (or try Demo Mode)</li>
                              <li>Press the "Start Run" button to begin tracking</li>
                              <li>Optional: Select your music to play while running</li>
                              <li>Hit "Stop Run" when you're finished</li>
                            </ol>
                          </AlertDescription>
                          
                          <Button
                            onClick={() => setActiveTab("run")}
                            size="sm"
                            className="mt-3"
                          >
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Go to Run Tracker
                          </Button>
                        </div>
                      </div>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}