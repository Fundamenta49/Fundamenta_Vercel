import { useState, useEffect, useRef } from 'react';
import { useYogaProgression } from '../contexts/yoga-progression-context';
import { yogaPoses, yogaChallenges, getPoseById } from '../data/yoga-poses-progression';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Clock,
  Trophy,
  Award,
  ChevronRight,
  Play,
  Calendar,
  Heart,
  BarChart,
  Dumbbell,
  Flame,
  CheckCircle,
  Pause,
  SkipForward,
  Volume2,
  VolumeX,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import YogaVisionEnhanced from '@/components/yoga-vision-enhanced';
import OpenAI from 'openai';

// Types for workouts
interface PoseInWorkout {
  poseId: string;
  durationSeconds: number;
  repetitions?: number;
  notes?: string;
}

interface YogaWorkout {
  id: string;
  name: string;
  description: string;
  levelRequired: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: number; // in minutes
  poses: PoseInWorkout[];
  benefitTags: string[];
  thumbnailUrl?: string;
  videoUrl?: string;
  xpReward: number;
  targetAreas: string[];
  completed?: boolean;
}

// Defined workouts for different levels
const yogaWorkouts: YogaWorkout[] = [
  // Beginner workouts (Level 1-2)
  {
    id: 'morning_basics',
    name: 'Morning Basics Flow',
    description: 'A gentle morning flow to wake up your body and mind',
    levelRequired: 1,
    difficulty: 'beginner',
    duration: 15,
    poses: [
      { poseId: 'mountain', durationSeconds: 30 },
      { poseId: 'forward_fold', durationSeconds: 30 },
      { poseId: 'downward_dog', durationSeconds: 45 },
      { poseId: 'cat_cow', durationSeconds: 60, repetitions: 8 },
      { poseId: 'child', durationSeconds: 45 },
      { poseId: 'mountain', durationSeconds: 30 },
      { poseId: 'corpse', durationSeconds: 120 }
    ],
    benefitTags: ['Energy', 'Flexibility', 'Mindfulness'],
    thumbnailUrl: '/images/yoga/morning_flow.jpg',
    xpReward: 50,
    targetAreas: ['Full Body', 'Spine', 'Hamstrings']
  },
  {
    id: 'flexibility_intro',
    name: 'Flexibility Foundations',
    description: 'Focus on basic stretches to improve overall flexibility',
    levelRequired: 1,
    difficulty: 'beginner',
    duration: 20,
    poses: [
      { poseId: 'mountain', durationSeconds: 30 },
      { poseId: 'forward_fold', durationSeconds: 45 },
      { poseId: 'downward_dog', durationSeconds: 45 },
      { poseId: 'child', durationSeconds: 45 },
      { poseId: 'corpse', durationSeconds: 120 }
    ],
    benefitTags: ['Flexibility', 'Relaxation', 'Recovery'],
    thumbnailUrl: '/images/yoga/flexibility.jpg',
    xpReward: 60,
    targetAreas: ['Hamstrings', 'Back', 'Shoulders']
  },
  
  // Intermediate workouts (Level 3-5)
  {
    id: 'strength_flow',
    name: 'Strength Builder Flow',
    description: 'Build strength and stability with this dynamic sequence',
    levelRequired: 3,
    difficulty: 'intermediate',
    duration: 25,
    poses: [
      { poseId: 'mountain', durationSeconds: 30 },
      { poseId: 'chair', durationSeconds: 45 },
      { poseId: 'warrior_1', durationSeconds: 45 },
      { poseId: 'warrior_2', durationSeconds: 45 },
      { poseId: 'triangle', durationSeconds: 45 },
      { poseId: 'downward_dog', durationSeconds: 30 },
      { poseId: 'plank', durationSeconds: 30 },
      { poseId: 'corpse', durationSeconds: 120 }
    ],
    benefitTags: ['Strength', 'Balance', 'Endurance'],
    thumbnailUrl: '/images/yoga/strength.jpg',
    xpReward: 100,
    targetAreas: ['Legs', 'Core', 'Arms']
  },
  {
    id: 'balance_flow',
    name: 'Balance & Focus Flow',
    description: 'Improve balance and mental focus with this sequence',
    levelRequired: 4,
    difficulty: 'intermediate',
    duration: 30,
    poses: [
      { poseId: 'mountain', durationSeconds: 30 },
      { poseId: 'tree', durationSeconds: 60 },
      { poseId: 'warrior_3', durationSeconds: 45 },
      { poseId: 'half_moon', durationSeconds: 45 },
      { poseId: 'eagle', durationSeconds: 45 },
      { poseId: 'corpse', durationSeconds: 120 }
    ],
    benefitTags: ['Balance', 'Focus', 'Coordination'],
    thumbnailUrl: '/images/yoga/balance.jpg',
    xpReward: 120,
    targetAreas: ['Legs', 'Core', 'Mind']
  },
  
  // Advanced workouts (Level 6+)
  {
    id: 'power_flow',
    name: 'Power Vinyasa Flow',
    description: 'An energetic flow combining strength, flexibility and balance',
    levelRequired: 6,
    difficulty: 'advanced',
    duration: 45,
    poses: [
      { poseId: 'mountain', durationSeconds: 30 },
      { poseId: 'chair', durationSeconds: 45 },
      { poseId: 'warrior_1', durationSeconds: 45 },
      { poseId: 'warrior_2', durationSeconds: 45 },
      { poseId: 'triangle', durationSeconds: 45 },
      { poseId: 'half_moon', durationSeconds: 45 },
      { poseId: 'crow', durationSeconds: 30 },
      { poseId: 'boat', durationSeconds: 30 },
      { poseId: 'corpse', durationSeconds: 120 }
    ],
    benefitTags: ['Strength', 'Flexibility', 'Endurance', 'Focus'],
    thumbnailUrl: '/images/yoga/power.jpg',
    xpReward: 200,
    targetAreas: ['Full Body', 'Core', 'Arms']
  },
  {
    id: 'advanced_inversions',
    name: 'Inversion Practice',
    description: 'Advanced practice focusing on headstands and arm balances',
    levelRequired: 8,
    difficulty: 'expert',
    duration: 60,
    poses: [
      { poseId: 'mountain', durationSeconds: 30 },
      { poseId: 'downward_dog', durationSeconds: 45 },
      { poseId: 'dolphin', durationSeconds: 45 },
      { poseId: 'headstand_prep', durationSeconds: 60 },
      { poseId: 'crow', durationSeconds: 45 },
      { poseId: 'side_plank', durationSeconds: 45 },
      { poseId: 'corpse', durationSeconds: 180 }
    ],
    benefitTags: ['Strength', 'Balance', 'Focus', 'Courage'],
    thumbnailUrl: '/images/yoga/inversions.jpg',
    xpReward: 250,
    targetAreas: ['Arms', 'Shoulders', 'Core', 'Mental Focus']
  }
];

// Helper component to display pose details in a workout
const WorkoutPoseCard = ({ 
  pose, 
  onPractice 
}: { 
  pose: PoseInWorkout, 
  onPractice: (poseId: string) => void 
}) => {
  const poseDetails = getPoseById(pose.poseId);
  
  if (!poseDetails) return null;
  
  return (
    <div className="flex items-center border-b py-3 last:border-b-0">
      <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center shrink-0 mr-4">
        {poseDetails.imageUrl ? (
          <img 
            src={poseDetails.imageUrl} 
            alt={poseDetails.name} 
            className="h-full w-full object-cover rounded-md"
          />
        ) : (
          <span className="text-xl font-medium text-gray-500">{poseDetails.name.charAt(0)}</span>
        )}
      </div>
      <div className="flex-grow">
        <div className="flex justify-between">
          <div>
            <h4 className="font-medium">{poseDetails.name}</h4>
            <div className="text-xs text-gray-500">{poseDetails.sanskritName}</div>
          </div>
          <div className="text-right">
            <div className="text-sm flex items-center">
              <Clock size={14} className="mr-1 text-gray-500" />
              {pose.durationSeconds >= 60 
                ? `${Math.floor(pose.durationSeconds / 60)}m ${pose.durationSeconds % 60}s` 
                : `${pose.durationSeconds}s`}
            </div>
            {pose.repetitions && (
              <div className="text-xs text-gray-500">
                {pose.repetitions} reps
              </div>
            )}
          </div>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        className="ml-2" 
        onClick={() => onPractice(pose.poseId)}
      >
        <ChevronRight size={18} />
      </Button>
    </div>
  );
};

// Main component for workout selection and display
export default function YogaWorkout() {
  const { userProgress } = useYogaProgression();
  const [selectedWorkout, setSelectedWorkout] = useState<YogaWorkout | null>(null);
  const [workoutDetailsOpen, setWorkoutDetailsOpen] = useState(false);
  const [selectedPoseId, setSelectedPoseId] = useState<string | null>(null);
  const [practiceDialogOpen, setPracticeDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  // Get user's current level from context
  const userLevel = userProgress?.currentLevel || 1;
  
  // Filter workouts based on user level
  const availableWorkouts = yogaWorkouts.filter(workout => workout.levelRequired <= userLevel);
  
  // Workouts by difficulty
  const beginnerWorkouts = availableWorkouts.filter(w => w.difficulty === 'beginner');
  const intermediateWorkouts = availableWorkouts.filter(w => w.difficulty === 'intermediate');
  const advancedWorkouts = availableWorkouts.filter(w => w.difficulty === 'advanced' || w.difficulty === 'expert');
  
  // Handler for selecting a workout
  const handleSelectWorkout = (workout: YogaWorkout) => {
    setSelectedWorkout(workout);
    setWorkoutDetailsOpen(true);
  };
  
  // Handler for practice button
  const handlePractice = (poseId: string) => {
    setSelectedPoseId(poseId);
    setPracticeDialogOpen(true);
  };
  
  // Handler for closing practice dialog
  const handleClosePractice = () => {
    setPracticeDialogOpen(false);
    setSelectedPoseId(null);
  };
  
  // State for guided workout flow
  const [workoutMode, setWorkoutMode] = useState(false);
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [completedPoses, setCompletedPoses] = useState<string[]>([]);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  
  // Audio feedback - simulating voice guidance
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Verbal instructions for poses - would be generated by OpenAI in production
  const getVerbalInstructions = (poseName: string) => {
    return `Now move into ${poseName}. Keep your breathing deep and steady.`;
  };
  
  // Effect for timer during guided workout
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (workoutMode && isPlaying && selectedWorkout) {
      const currentPose = selectedWorkout.poses[currentPoseIndex];
      const duration = currentPose.durationSeconds;
      
      if (timerSeconds < duration) {
        interval = setInterval(() => {
          setTimerSeconds(prev => prev + 1);
        }, 1000);
      } else {
        // Move to next pose
        if (currentPoseIndex < selectedWorkout.poses.length - 1) {
          setCompletedPoses(prev => [...prev, currentPose.poseId]);
          setCurrentPoseIndex(prev => prev + 1);
          setTimerSeconds(0);
          
          // Simulate verbal instruction for next pose
          if (!isMuted) {
            const nextPose = selectedWorkout.poses[currentPoseIndex + 1];
            const poseDetails = getPoseById(nextPose.poseId);
            if (poseDetails) {
              const utterance = new SpeechSynthesisUtterance(getVerbalInstructions(poseDetails.name));
              window.speechSynthesis.speak(utterance);
            }
          }
        } else {
          // Workout complete
          setIsPlaying(false);
          setCompletedPoses(prev => [...prev, currentPose.poseId]);
          
          // Simulate completion message
          if (!isMuted) {
            const utterance = new SpeechSynthesisUtterance(
              "Congratulations! You've completed the workout. Take a moment to rest and appreciate your practice."
            );
            window.speechSynthesis.speak(utterance);
          }
        }
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [workoutMode, isPlaying, timerSeconds, currentPoseIndex, selectedWorkout, isMuted]);
  
  // Handle starting a workout in guided mode
  const handleStartWorkout = (workout: YogaWorkout) => {
    setSelectedWorkout(workout);
    setWorkoutMode(true);
    setCurrentPoseIndex(0);
    setTimerSeconds(0);
    setCompletedPoses([]);
    setIsPlaying(true);
    setWorkoutDetailsOpen(false);
    
    // Start with verbal instruction
    if (!isMuted && workout.poses.length > 0) {
      const firstPose = getPoseById(workout.poses[0].poseId);
      if (firstPose) {
        const utterance = new SpeechSynthesisUtterance(
          `Welcome to ${workout.name}. Let's begin with ${firstPose.name}. Get into position and focus on your breathing.`
        );
        window.speechSynthesis.speak(utterance);
      }
    }
  };
  
  // Handler for toggling play/pause
  const handlePlayPause = () => {
    setIsPlaying(prev => !prev);
    
    // Voice feedback
    if (!isMuted) {
      const message = isPlaying ? "Pausing workout." : "Resuming workout.";
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    }
  };
  
  // Handler for skipping to next pose
  const handleNextPose = () => {
    if (selectedWorkout && currentPoseIndex < selectedWorkout.poses.length - 1) {
      setCompletedPoses(prev => [...prev, selectedWorkout.poses[currentPoseIndex].poseId]);
      setCurrentPoseIndex(prev => prev + 1);
      setTimerSeconds(0);
      
      // Voice feedback
      if (!isMuted) {
        const nextPose = getPoseById(selectedWorkout.poses[currentPoseIndex + 1].poseId);
        if (nextPose) {
          const utterance = new SpeechSynthesisUtterance(getVerbalInstructions(nextPose.name));
          window.speechSynthesis.speak(utterance);
        }
      }
    }
  };
  
  // Handler for previous pose
  const handlePrevPose = () => {
    if (currentPoseIndex > 0) {
      setCurrentPoseIndex(prev => prev - 1);
      setTimerSeconds(0);
      
      // Remove from completed
      setCompletedPoses(prev => {
        const updated = [...prev];
        updated.pop();
        return updated;
      });
      
      // Voice feedback
      if (!isMuted && selectedWorkout) {
        const prevPose = getPoseById(selectedWorkout.poses[currentPoseIndex - 1].poseId);
        if (prevPose) {
          const utterance = new SpeechSynthesisUtterance(
            `Going back to ${prevPose.name}.`
          );
          window.speechSynthesis.speak(utterance);
        }
      }
    }
  };
  
  // Handler for getting AI analysis for current pose
  const handleGetAIFeedback = () => {
    if (selectedWorkout) {
      const currentPose = selectedWorkout.poses[currentPoseIndex];
      setSelectedPoseId(currentPose.poseId);
      setShowAIAnalysis(true);
    }
  };
  
  // Handler for ending the workout
  const handleEndWorkout = () => {
    setWorkoutMode(false);
    setIsPlaying(false);
    
    // Stop any audio
    if (!isMuted) {
      window.speechSynthesis.cancel();
    }
    
    // Calculate XP earned based on completed poses
    if (selectedWorkout) {
      const earnedXP = Math.floor(
        (completedPoses.length / selectedWorkout.poses.length) * selectedWorkout.xpReward
      );
      
      // TODO: Update user progression with earned XP
      console.log(`Workout completed. Earned ${earnedXP} XP`);
    }
  };
  
  return (
    <div className="yoga-workout space-y-6">
      {/* Workout Selection Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">All Workouts</TabsTrigger>
          <TabsTrigger value="beginner" className="flex-1">Beginner</TabsTrigger>
          <TabsTrigger value="intermediate" className="flex-1">Intermediate</TabsTrigger>
          <TabsTrigger value="advanced" className="flex-1">Advanced</TabsTrigger>
        </TabsList>
        
        {/* All Workouts Tab */}
        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableWorkouts.map(workout => (
              <Card 
                key={workout.id} 
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleSelectWorkout(workout)}
              >
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  {workout.thumbnailUrl ? (
                    <img 
                      src={workout.thumbnailUrl} 
                      alt={workout.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-pink-100 to-purple-100">
                      <Dumbbell size={40} className="text-pink-300" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge className={`
                      ${workout.difficulty === 'beginner' ? 'bg-green-100 text-green-800' : 
                        workout.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-orange-100 text-orange-800'}
                    `}>
                      {workout.difficulty}
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-white">
                        <Clock size={14} className="mr-1" />
                        <span className="text-sm">{workout.duration} min</span>
                      </div>
                      <div className="flex items-center text-white">
                        <Flame size={14} className="mr-1" />
                        <span className="text-sm">{workout.xpReward} XP</span>
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium">{workout.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{workout.description}</p>
                  <div className="flex mt-3 gap-1 flex-wrap">
                    {workout.benefitTags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="text-xs bg-gray-50"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Beginner Workouts Tab */}
        <TabsContent value="beginner" className="space-y-6">
          {beginnerWorkouts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {beginnerWorkouts.map(workout => (
                <Card 
                  key={workout.id} 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleSelectWorkout(workout)}
                >
                  <div className="aspect-video bg-gray-100 relative">
                    {workout.thumbnailUrl ? (
                      <img 
                        src={workout.thumbnailUrl} 
                        alt={workout.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-green-100 to-blue-100">
                        <Dumbbell size={40} className="text-green-300" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-white">
                          <Clock size={14} className="mr-1" />
                          <span className="text-sm">{workout.duration} min</span>
                        </div>
                        <div className="flex items-center text-white">
                          <Flame size={14} className="mr-1" />
                          <span className="text-sm">{workout.xpReward} XP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">{workout.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{workout.description}</p>
                    <div className="flex mt-3 gap-1 flex-wrap">
                      {workout.benefitTags.map(tag => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="text-xs bg-gray-50"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Award size={40} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-700">No Beginner Workouts Available</h3>
              <p className="text-gray-500">Complete more poses to unlock beginner workouts</p>
            </div>
          )}
        </TabsContent>
        
        {/* Intermediate Workouts Tab */}
        <TabsContent value="intermediate" className="space-y-6">
          {intermediateWorkouts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {intermediateWorkouts.map(workout => (
                <Card 
                  key={workout.id} 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleSelectWorkout(workout)}
                >
                  <div className="aspect-video bg-gray-100 relative">
                    {workout.thumbnailUrl ? (
                      <img 
                        src={workout.thumbnailUrl} 
                        alt={workout.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-yellow-100 to-orange-100">
                        <Dumbbell size={40} className="text-yellow-300" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-white">
                          <Clock size={14} className="mr-1" />
                          <span className="text-sm">{workout.duration} min</span>
                        </div>
                        <div className="flex items-center text-white">
                          <Flame size={14} className="mr-1" />
                          <span className="text-sm">{workout.xpReward} XP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">{workout.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{workout.description}</p>
                    <div className="flex mt-3 gap-1 flex-wrap">
                      {workout.benefitTags.map(tag => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="text-xs bg-gray-50"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border rounded-lg">
              <Award size={40} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-700">Intermediate Workouts Locked</h3>
              <p className="text-gray-500 mb-3">Reach level 3 to unlock these workouts</p>
              <Progress value={(userLevel / 3) * 100} className="max-w-xs mx-auto h-2" />
              <p className="text-sm text-gray-500 mt-2">Current level: {userLevel}/3</p>
            </div>
          )}
        </TabsContent>
        
        {/* Advanced Workouts Tab */}
        <TabsContent value="advanced" className="space-y-6">
          {advancedWorkouts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {advancedWorkouts.map(workout => (
                <Card 
                  key={workout.id} 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleSelectWorkout(workout)}
                >
                  <div className="aspect-video bg-gray-100 relative">
                    {workout.thumbnailUrl ? (
                      <img 
                        src={workout.thumbnailUrl} 
                        alt={workout.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-orange-100 to-red-100">
                        <Dumbbell size={40} className="text-orange-300" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-white">
                          <Clock size={14} className="mr-1" />
                          <span className="text-sm">{workout.duration} min</span>
                        </div>
                        <div className="flex items-center text-white">
                          <Flame size={14} className="mr-1" />
                          <span className="text-sm">{workout.xpReward} XP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">{workout.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{workout.description}</p>
                    <div className="flex mt-3 gap-1 flex-wrap">
                      {workout.benefitTags.map(tag => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="text-xs bg-gray-50"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border rounded-lg">
              <Award size={40} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-700">Advanced Workouts Locked</h3>
              <p className="text-gray-500 mb-3">Reach level 6 to unlock these workouts</p>
              <Progress value={(userLevel / 6) * 100} className="max-w-xs mx-auto h-2" />
              <p className="text-sm text-gray-500 mt-2">Current level: {userLevel}/6</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Workout Details Dialog */}
      <Dialog open={workoutDetailsOpen} onOpenChange={setWorkoutDetailsOpen}>
        <DialogContent className="max-w-3xl overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedWorkout?.name}</DialogTitle>
            <DialogDescription>
              {selectedWorkout?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedWorkout && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="text-sm text-gray-500">Duration</div>
                  <div className="font-medium flex items-center justify-center mt-1">
                    <Clock size={16} className="mr-1 text-pink-500" />
                    {selectedWorkout.duration} min
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="text-sm text-gray-500">Difficulty</div>
                  <div className="font-medium flex items-center justify-center mt-1">
                    <Dumbbell size={16} className="mr-1 text-pink-500" />
                    {selectedWorkout.difficulty.charAt(0).toUpperCase() + selectedWorkout.difficulty.slice(1)}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="text-sm text-gray-500">XP Reward</div>
                  <div className="font-medium flex items-center justify-center mt-1">
                    <Flame size={16} className="mr-1 text-pink-500" />
                    {selectedWorkout.xpReward} XP
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Target Areas</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedWorkout.targetAreas.map(area => (
                    <Badge key={area} className="bg-pink-100 text-pink-800 hover:bg-pink-100">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Poses in this Workout</h4>
                <Card>
                  <CardContent className="p-3">
                    {selectedWorkout.poses.map((pose, index) => (
                      <WorkoutPoseCard 
                        key={`${pose.poseId}-${index}`} 
                        pose={pose} 
                        onPractice={handlePractice}
                      />
                    ))}
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-end gap-3 pt-3">
                <Button variant="outline" onClick={() => setWorkoutDetailsOpen(false)}>
                  Close
                </Button>
                <Button 
                  className="bg-gradient-to-r from-pink-600 to-purple-600 text-white"
                  onClick={() => handleStartWorkout(selectedWorkout)}
                >
                  <Play size={16} className="mr-2" />
                  Start Workout
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* YogaVision Practice Dialog */}
      <Dialog open={practiceDialogOpen} onOpenChange={setPracticeDialogOpen}>
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
              <DialogTitle>YogaVision - Pose Practice</DialogTitle>
              <DialogDescription>
                Position yourself to match the reference pose and receive AI-powered feedback
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="px-4 sm:px-6 pb-6">
            {selectedPoseId && (
              <YogaVisionEnhanced 
                initialPoseId={selectedPoseId}
                onClose={handleClosePractice}
                onAnalysisComplete={(analysis) => {
                  console.log('Analysis completed:', analysis);
                  
                  // After analysis, go back to the workout details
                  setTimeout(() => {
                    handleClosePractice();
                    setWorkoutDetailsOpen(true);
                  }, 3000);
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}