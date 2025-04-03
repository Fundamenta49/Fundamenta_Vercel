import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, 
  Maximize2, Minimize2, RefreshCw, Check, Clock, AlertCircle,
  Heart, BarChart2, ThumbsUp, ChevronRight, Moon, Sun, Coffee, 
  Activity, MessageSquare, Calendar, DownloadCloud, ExternalLink
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Sheet components removed for simplicity

// Define workout session types
type WorkoutCategory = 'yoga' | 'meditation' | 'weightlifting' | 'hiit' | 'stretch' | 'running';
type MoodType = 'energized' | 'tired' | 'stressed' | 'calm' | 'focused' | 'anxious';
type DurationType = '5min' | '10min' | '15min' | '20min' | '30min' | '45min' | '60min';
type DifficultyType = 'beginner' | 'intermediate' | 'advanced';
type FocusAreaType = 'flexibility' | 'strength' | 'cardio' | 'balance' | 'mind' | 'sleep' | 'core';

// Interface for a workout flow session
interface WorkoutSession {
  id: string;
  title: string;
  description: string;
  category: WorkoutCategory;
  duration: number; // in minutes
  difficulty: DifficultyType;
  focusAreas: FocusAreaType[];
  imageUrl: string;
  videoUrl: string;
  recommendedFor: MoodType[];
  exercises: WorkoutExercise[];
  completionCount: number;
  lastCompleted?: Date;
}

// Interface for individual exercises within a flow
interface WorkoutExercise {
  id: string;
  name: string;
  description: string;
  duration: number; // in seconds
  imageUrl: string;
  videoUrl: string;
  instructions: string[];
  tips: string[];
  benefits: string[];
  category: WorkoutCategory;
}

// Sample workout sessions data
const sampleWorkoutSessions: WorkoutSession[] = [
  {
    id: 'morning-yoga-flow',
    title: 'Morning Energizer Yoga',
    description: 'Start your day with this energizing flow designed to wake up your body and mind.',
    category: 'yoga',
    duration: 15,
    difficulty: 'beginner',
    focusAreas: ['flexibility', 'balance', 'mind'],
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1000',
    videoUrl: 'https://www.youtube.com/watch?v=s2NQhpFGIOg',
    recommendedFor: ['tired', 'stressed', 'anxious'],
    completionCount: 0,
    exercises: [
      {
        id: 'mountain-pose',
        name: 'Mountain Pose',
        description: 'A foundational standing pose that establishes proper alignment and posture.',
        duration: 30,
        imageUrl: 'https://www.yogajournal.com/wp-content/uploads/2021/12/Mountain-Pose_Andrew-Clark.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=2HTvZp5rPrg',
        instructions: [
          'Stand with feet together or hip-width apart',
          'Distribute weight evenly across feet',
          'Engage leg muscles and lift kneecaps',
          'Lengthen spine and draw shoulders back and down',
          'Keep arms alongside body with palms facing forward',
          'Breathe deeply and maintain awareness of your posture'
        ],
        tips: [
          'Focus on grounding through all four corners of feet',
          'Imagine a string pulling you up from the crown of your head',
          'Keep facial muscles relaxed'
        ],
        benefits: [
          'Improves posture and body awareness',
          'Strengthens legs, knees, and ankles',
          'Creates a foundation for other standing poses',
          'Develops focus and concentration'
        ],
        category: 'yoga'
      },
      {
        id: 'downward-dog',
        name: 'Downward-Facing Dog',
        description: 'A foundational pose that stretches and strengthens the entire body.',
        duration: 45,
        imageUrl: 'https://www.yogajournal.com/wp-content/uploads/2021/12/Downward-Facing-Dog_Andrew-Clark.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=j97SSGsnCAQ',
        instructions: [
          'Begin on hands and knees with wrists under shoulders and knees under hips',
          'Spread fingers wide with index fingers parallel or slightly turned out',
          'Tuck toes and lift knees off the floor',
          'Extend your sitting bones up toward ceiling while pressing chest toward thighs',
          'Keep slight bend in knees if hamstrings are tight',
          'Press floor away with hands, rotating upper arms outward',
          'Allow head to hang freely or gaze toward navel',
          'Hold for 5-10 breaths'
        ],
        tips: [
          'Focus on creating a straight line from hands to hips',
          'Pedal feet to warm up calves and hamstrings',
          'Distribute weight evenly between hands and feet',
          'Keep shoulders away from ears by engaging shoulder blades'
        ],
        benefits: [
          'Strengthens arms, shoulders, and legs',
          'Stretches hamstrings, calves, and spine',
          'Energizes the body',
          'Improves circulation',
          'Calms the mind'
        ],
        category: 'yoga'
      },
      {
        id: 'warrior-1',
        name: 'Warrior I',
        description: 'A powerful standing pose that builds strength and improves focus.',
        duration: 45,
        imageUrl: 'https://www.yogajournal.com/wp-content/uploads/2021/12/Warrior-I_Andrew-Clark.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=5rT-ertUHUE',
        instructions: [
          'Begin in Mountain Pose',
          'Step one foot back 3-4 feet and turn it out at a 45-degree angle',
          'Bend front knee to align over ankle, keeping knee tracking over middle toe',
          'Keep back leg straight with heel grounded',
          'Square hips and shoulders to front of mat',
          'Raise arms overhead with palms facing each other or touching',
          'Gaze forward or up at hands',
          'Hold for 5-8 breaths, then repeat on other side'
        ],
        tips: [
          'Keep front knee above ankle to protect the joint',
          'Press outer edge of back foot firmly into mat',
          'Engage core to support lower back',
          'Relax shoulders away from ears'
        ],
        benefits: [
          'Strengthens legs, ankles, shoulders, and back',
          'Opens chest, shoulders, and hips',
          'Improves focus and balance',
          'Stimulates digestion',
          'Develops stamina'
        ],
        category: 'yoga'
      },
      {
        id: 'tree-pose',
        name: 'Tree Pose',
        description: 'A balancing pose that improves focus and stability.',
        duration: 40,
        imageUrl: 'https://www.yogajournal.com/wp-content/uploads/2021/12/Tree-Pose_Andrew-Clark.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=wdln9qWYloU',
        instructions: [
          'Begin in Mountain Pose',
          'Shift weight onto one foot',
          'Place other foot on inner ankle, calf, or thigh (avoid pressing on knee)',
          'Find a focal point at eye level',
          'Bring hands to heart center or extend arms overhead',
          'Hold for 5-8 breaths, then switch sides'
        ],
        tips: [
          'Engage standing leg and core for stability',
          'Press foot into leg and leg into foot for resistance',
          'If balancing is difficult, place hand on wall or chair for support',
          'Grow taller through the crown of your head'
        ],
        benefits: [
          'Improves balance and focus',
          'Strengthens ankles, calves, thighs, and spine',
          'Opens hips and groins',
          'Develops concentration',
          'Calms the mind'
        ],
        category: 'yoga'
      },
      {
        id: 'child-pose',
        name: 'Child\'s Pose',
        description: 'A restful pose that gently stretches the back and promotes relaxation.',
        duration: 60,
        imageUrl: 'https://www.yogajournal.com/wp-content/uploads/2021/12/Child_s-Pose_Andrew-Clark.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=eqVMAPM00DM',
        instructions: [
          'Kneel on floor with big toes touching and knees wide apart',
          'Sit back on heels',
          'Fold forward, extending arms in front or alongside body',
          'Rest forehead on mat',
          'Breathe deeply, relaxing shoulders, back, and hips',
          'Hold for 30 seconds to several minutes'
        ],
        tips: [
          'Place cushion under sitting bones if they don\'t reach heels',
          'Use folded blanket under forehead if it doesn\'t reach floor',
          'Widen knees for more space if pregnant or uncomfortable',
          'Try arms alongside body, palms up for deeper shoulder relaxation'
        ],
        benefits: [
          'Gently stretches hips, thighs, and ankles',
          'Relieves back, neck, and shoulder tension',
          'Calms the mind and reduces stress',
          'Normalizes circulation',
          'Excellent resting pose between difficult poses'
        ],
        category: 'yoga'
      }
    ]
  },
  {
    id: 'stress-relief-yoga',
    title: 'Stress Relief & Unwinding',
    description: 'A gentle practice focused on releasing tension and calming the mind after a long day.',
    category: 'yoga',
    duration: 20,
    difficulty: 'beginner',
    focusAreas: ['flexibility', 'mind', 'sleep'],
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000',
    videoUrl: 'https://www.youtube.com/watch?v=hJbRpHZr_d0',
    recommendedFor: ['stressed', 'anxious', 'tired'],
    completionCount: 0,
    exercises: [
      {
        id: 'seated-forward-bend',
        name: 'Seated Forward Bend',
        description: 'A calming forward fold that stretches the entire back of the body.',
        duration: 60,
        imageUrl: 'https://www.yogajournal.com/wp-content/uploads/2021/12/Seated-Forward-Bend_Andrew-Clark.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=g7Uhp5tphAs',
        instructions: [
          'Sit on floor with legs extended in front of you',
          'Lengthen spine, sitting tall on sitting bones',
          'Inhale and raise arms up',
          'Exhale and hinge at hips to fold forward',
          'Hold onto legs, feet, or use strap around feet',
          'Relax neck and allow head to hang naturally',
          'Hold for 30 seconds to 3 minutes'
        ],
        tips: [
          'Bend knees if hamstrings are tight',
          'Focus on lengthening spine rather than reaching feet',
          'Sit on folded blanket if hips are tight',
          'Keep feet flexed with toes pointing up'
        ],
        benefits: [
          'Stretches hamstrings, spine, and shoulders',
          'Calms the mind and relieves stress',
          'Stimulates liver, kidneys, and digestive organs',
          'Helps relieve headache and anxiety',
          'Therapeutic for high blood pressure'
        ],
        category: 'yoga'
      },
      {
        id: 'bridge-pose',
        name: 'Bridge Pose',
        description: 'A gentle backbend that opens the chest and stretches the spine.',
        duration: 45,
        imageUrl: 'https://www.yogajournal.com/wp-content/uploads/2021/12/Bridge-Pose_Andrew-Clark.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=NnbvPeAIhmA',
        instructions: [
          'Lie on back with knees bent, feet hip-width apart',
          'Place feet flat on floor, aligned with ankles under knees',
          'Arms alongside body with palms down',
          'Press into feet and shoulders to lift hips',
          'Engage glutes and hamstrings',
          'Clasp hands below pelvis and extend through arms',
          'Hold for a few breaths, then slowly lower down'
        ],
        tips: [
          'Keep knees parallel and tracking over second toe',
          'Avoid overarching neck—keep chin slightly tucked',
          'For support, place block under sacrum',
          'To intensify, lift heels and come to balls of feet'
        ],
        benefits: [
          'Stretches chest, neck, and spine',
          'Stimulates abdominal organs and thyroid',
          'Reduces anxiety, stress, and fatigue',
          'Improves circulation',
          'Helps relieve symptoms of menopause'
        ],
        category: 'yoga'
      },
      {
        id: 'supine-twist',
        name: 'Supine Spinal Twist',
        description: 'A gentle twist that releases tension in the spine and lower back.',
        duration: 60,
        imageUrl: 'https://www.yogajournal.com/wp-content/uploads/2022/01/Supine-Spinal-Twist_Andrew-Clark.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=SJNiqPCFDpA',
        instructions: [
          'Lie on back with knees bent, feet flat on floor',
          'Extend arms out to sides in T position',
          'Shift hips slightly to right',
          'Drop knees to left, keeping shoulders grounded',
          'Turn head to right (optional)',
          'Breathe deeply into ribcage',
          'Hold for 30-60 seconds, then switch sides'
        ],
        tips: [
          'Place pillow between knees or under top knee for support',
          'Keep both shoulders grounded',
          'If neck is uncomfortable, keep neutral or use small pillow',
          'For deeper twist, extend top leg long'
        ],
        benefits: [
          'Releases tension in spine and back',
          'Stretches shoulders, hips, and glutes',
          'Improves spinal mobility',
          'Aids digestion',
          'Calms the nervous system'
        ],
        category: 'yoga'
      },
      {
        id: 'legs-up-wall',
        name: 'Legs Up the Wall',
        description: 'A restorative pose that promotes relaxation and circulation.',
        duration: 120,
        imageUrl: 'https://www.yogajournal.com/wp-content/uploads/2021/12/Legs-Up-the-Wall-Pose_Andrew-Clark.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=Imxqd1D1V_A',
        instructions: [
          'Sit sideways next to wall with knees bent',
          'Swing legs up wall while lowering back to floor',
          'Position buttocks close to or touching wall',
          'Extend legs up wall with feet relaxed',
          'Arms can rest alongside body, on belly, or overhead',
          'Close eyes and focus on breathing',
          'Stay for 5-15 minutes'
        ],
        tips: [
          'Place folded blanket under hips for support',
          'For tight hamstrings, move buttocks further from wall',
          'Use eye pillow for deeper relaxation',
          'Bend knees slightly if legs feel fatigued'
        ],
        benefits: [
          'Reduces swelling in legs and feet',
          'Relieves mild backache',
          'Calms mind and relieves anxiety',
          'Improves circulation',
          'Helps with insomnia',
          'Gently stretches hamstrings and back of neck'
        ],
        category: 'yoga'
      }
    ]
  },
  {
    id: 'full-body-hiit',
    title: 'Full Body HIIT Blast',
    description: 'A high-intensity interval training workout designed to target your entire body and maximize calorie burn.',
    category: 'hiit',
    duration: 20,
    difficulty: 'intermediate',
    focusAreas: ['cardio', 'strength', 'core'],
    imageUrl: 'https://images.unsplash.com/photo-1535743686920-55e4145369b9?q=80&w=1000',
    videoUrl: 'https://www.youtube.com/watch?v=ml6cT4AZdqI',
    recommendedFor: ['energized', 'focused'],
    completionCount: 0,
    exercises: [
      {
        id: 'jump-squats',
        name: 'Jump Squats',
        description: 'An explosive lower body movement that builds power and burns calories.',
        duration: 30,
        imageUrl: 'https://blog.nasm.org/hubfs/jump-squat.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=Azl5tkCzDcc',
        instructions: [
          'Stand with feet shoulder-width apart',
          'Lower into a squat position with thighs parallel to ground',
          'Engage core and keep chest up',
          'Explosively jump upward, extending through hips',
          'Land softly by bending knees and repeat immediately'
        ],
        tips: [
          'Land softly on the balls of your feet, then heels',
          'Keep knees tracking over toes',
          'Swing arms for momentum',
          'For lower impact, reduce jump height or eliminate jump'
        ],
        benefits: [
          'Increases explosive power',
          'Strengthens legs and glutes',
          'Elevates heart rate quickly',
          'Burns significant calories',
          'Improves athletic performance'
        ],
        category: 'hiit'
      },
      {
        id: 'mountain-climbers',
        name: 'Mountain Climbers',
        description: 'A dynamic exercise that targets the core while increasing heart rate.',
        duration: 30,
        imageUrl: 'https://blog.nasm.org/hubfs/mountain%20climbers.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=nmwgirgXLYM',
        instructions: [
          'Begin in high plank position with hands under shoulders',
          'Keep core tight and back flat',
          'Drive one knee toward chest',
          'Quickly switch legs in a running motion',
          'Maintain steady breathing throughout'
        ],
        tips: [
          'Keep hips level and avoid raising buttocks',
          'Engage core throughout the movement',
          'Increase speed for more intensity',
          'Slow down if form begins to suffer'
        ],
        benefits: [
          'Strengthens core, shoulders, and arms',
          'Improves coordination and agility',
          'Elevates heart rate',
          'Enhances hip mobility',
          'Works multiple muscle groups simultaneously'
        ],
        category: 'hiit'
      },
      {
        id: 'burpees',
        name: 'Burpees',
        description: 'A full-body exercise that builds strength, endurance, and explosiveness.',
        duration: 30,
        imageUrl: 'https://blog.nasm.org/hubfs/burpees.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=TU8QYVW0gDU',
        instructions: [
          'Stand with feet shoulder-width apart',
          'Lower into a squat and place hands on floor',
          'Jump feet back to plank position',
          'Perform a push-up (optional)',
          'Jump feet forward to squat position',
          'Jump explosively upward with arms overhead',
          'Land softly and immediately repeat'
        ],
        tips: [
          'Modify by stepping back instead of jumping',
          'Skip the push-up for beginners',
          'Focus on proper form over speed',
          'Land softly to protect joints'
        ],
        benefits: [
          'Works nearly every muscle group',
          'Builds cardiovascular endurance',
          'Increases strength and power',
          'Burns significant calories',
          'Requires no equipment'
        ],
        category: 'hiit'
      },
      {
        id: 'high-knees',
        name: 'High Knees',
        description: 'A cardio exercise that increases heart rate and strengthens the lower body.',
        duration: 30,
        imageUrl: 'https://blog.nasm.org/hubfs/high%20knees.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=tx5rgpd6pQM',
        instructions: [
          'Stand with feet hip-width apart',
          'Lift one knee to waist height',
          'Quickly alternate knees in a running motion',
          'Swing arms in opposition to legs',
          'Land on balls of feet',
          'Maintain good posture with core engaged'
        ],
        tips: [
          'Focus on height of knees rather than speed',
          'Keep core tight to protect lower back',
          'Perform at a comfortable pace before increasing speed',
          'Reduce height for lower impact'
        ],
        benefits: [
          'Improves cardiovascular fitness',
          'Strengthens hip flexors and core',
          'Enhances coordination',
          'Increases heart rate quickly',
          'Improves running form'
        ],
        category: 'hiit'
      }
    ]
  },
  {
    id: 'quick-office-stretch',
    title: 'Quick Office Stretch Break',
    description: 'A short sequence of stretches designed to relieve tension from desk work and improve mobility.',
    category: 'stretch',
    duration: 5,
    difficulty: 'beginner',
    focusAreas: ['flexibility', 'mind'],
    imageUrl: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=1000',
    videoUrl: 'https://www.youtube.com/watch?v=olgdgDF9n9k',
    recommendedFor: ['stressed', 'tired', 'focused'],
    completionCount: 0,
    exercises: [
      {
        id: 'neck-stretches',
        name: 'Neck Stretches',
        description: 'Gentle stretches to release tension in the neck and upper shoulders.',
        duration: 30,
        imageUrl: 'https://www.healthline.com/hlcmsresource/images/topic_centers/Fitness-Exercise/400x400_Neck_Exercises_Neck_Rotation.gif',
        videoUrl: 'https://www.youtube.com/watch?v=XN032bvduRU',
        instructions: [
          'Sit tall with shoulders relaxed',
          'Slowly tilt right ear toward right shoulder',
          'Hold for 15-30 seconds, feeling stretch on left side',
          'Return to center and repeat on other side',
          'Gently turn head to look over right shoulder',
          'Hold for 15-30 seconds, then switch sides',
          'Tuck chin to chest for back of neck stretch'
        ],
        tips: [
          'Keep shoulders down and relaxed throughout',
          'Use gentle pressure with hand for deeper stretch (optional)',
          'Move slowly and mindfully',
          'Breathe deeply into any areas of tension'
        ],
        benefits: [
          'Relieves neck and upper shoulder tension',
          'Improves range of motion',
          'Reduces headache tension',
          'Can be done seated at desk',
          'Counteracts forward head posture from computer work'
        ],
        category: 'stretch'
      },
      {
        id: 'wrist-stretches',
        name: 'Wrist and Forearm Stretches',
        description: 'Exercises to relieve tension from typing and mouse use.',
        duration: 30,
        imageUrl: 'https://www.healthline.com/hlcmsresource/images/topic_centers/Fitness-Exercise/400x400_Wrist_Exercises_for_Carpal_Tunnel_Syndrome_Relief_Wrist_Stretch.gif',
        videoUrl: 'https://www.youtube.com/watch?v=K3J_CzWVaXg',
        instructions: [
          'Extend right arm forward with palm up',
          'Use left hand to gently pull fingers toward body',
          'Hold for 15-30 seconds',
          'Flip palm down and gently press down on hand',
          'Hold for 15-30 seconds',
          'Make fist, then spread fingers wide',
          'Repeat sequence with other hand'
        ],
        tips: [
          'Keep stretches gentle, avoiding pain',
          'Increase blood flow by shaking hands between stretches',
          'Perform regularly throughout workday',
          'Combine with gentle wrist rotations'
        ],
        benefits: [
          'Relieves tension from typing and mouse use',
          'Prevents carpal tunnel syndrome',
          'Improves circulation to hands',
          'Maintains wrist mobility',
          'Can help prevent repetitive strain injuries'
        ],
        category: 'stretch'
      },
      {
        id: 'seated-twist',
        name: 'Seated Spinal Twist',
        description: 'A gentle twist to relieve back tension and improve spinal mobility.',
        duration: 30,
        imageUrl: 'https://www.verywellfit.com/thmb/rUnZNKtVQWU8IM2z8CGfL2HDRZ8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/seated-spinal-twist-d3ebd09ea6724f52acdcad65e8fdb2a2.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=OVGFpvNiZNk',
        instructions: [
          'Sit tall on chair with feet flat on floor',
          'Inhale and lengthen spine',
          'Exhale and place right hand on left knee',
          'Place left hand behind hip on chair',
          'Gently twist to left, leading with chest',
          'Hold for 30 seconds, breathing deeply',
          'Return to center and repeat on other side'
        ],
        tips: [
          'Keep sitting bones grounded evenly',
          'Twist from lower and middle back, not just shoulders',
          'Keep shoulders relaxed away from ears',
          'Lengthen spine with each inhale, deepen twist with exhale'
        ],
        benefits: [
          'Relieves back, neck, and shoulder tension',
          'Improves spinal mobility',
          'Stimulates digestion',
          'Refreshes energy with increased circulation',
          'Can help reduce back pain from sitting'
        ],
        category: 'stretch'
      },
      {
        id: 'seated-forward-bend',
        name: 'Seated Forward Bend',
        description: 'A stretch for the lower back and hamstrings that can be done in a chair.',
        duration: 30,
        imageUrl: 'https://www.yogajournal.com/wp-content/uploads/2022/01/Chair-Forward-Bend.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=XdT9WLaVnME',
        instructions: [
          'Sit toward front edge of chair',
          'Separate feet wider than hips',
          'Fold forward, allowing hands to reach toward floor',
          'Relax neck and let head hang heavy',
          'Hold for 30-60 seconds, breathing deeply',
          'Slowly roll up to seated position'
        ],
        tips: [
          'Bend knees for tight hamstrings',
          'Rest hands on floor, a block, or your legs',
          'Focus on hinging at hips, not rounding upper back',
          'Use breath to release tension'
        ],
        benefits: [
          'Relieves lower back tension',
          'Stretches hamstrings',
          'Calms nervous system',
          'Increases blood flow to brain',
          'Provides gentle inversion benefits'
        ],
        category: 'stretch'
      }
    ]
  }
];

// Main component for workout flow
export default function WorkoutFlow() {
  // State for current workout flow
  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<WorkoutCategory>('yoga');
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [filteredSessions, setFilteredSessions] = useState<WorkoutSession[]>(sampleWorkoutSessions);
  const [inProgress, setInProgress] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showMoodSelector, setShowMoodSelector] = useState(true);
  const [completedWorkouts, setCompletedWorkouts] = useState<string[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Filter sessions based on category and mood
  useEffect(() => {
    let filtered = sampleWorkoutSessions;
    
    if (selectedCategory) {
      filtered = filtered.filter(session => session.category === selectedCategory);
    }
    
    if (selectedMood) {
      filtered = filtered.filter(session => session.recommendedFor.includes(selectedMood));
    }
    
    setFilteredSessions(filtered);
  }, [selectedCategory, selectedMood]);

  // Exercise timer
  useEffect(() => {
    if (inProgress && !isPaused && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (inProgress && timeRemaining === 0) {
      // Move to next exercise or complete workout
      if (currentSession && currentExerciseIndex < currentSession.exercises.length - 1) {
        moveToNextExercise();
      } else {
        completeWorkout();
      }
    }
  }, [inProgress, isPaused, timeRemaining]);

  // Start workout session
  const startWorkout = (session: WorkoutSession) => {
    setCurrentSession(session);
    setCurrentExerciseIndex(0);
    setTimeRemaining(session.exercises[0].duration);
    setInProgress(true);
    setIsPaused(false);
    setShowMoodSelector(false);
    
    // Start overall session timer
    const timer = setTimeout(() => {
      // Session complete logic
      completeWorkout();
    }, session.duration * 60 * 1000);
    
    setSessionTimer(timer);
  };

  // Move to next exercise
  const moveToNextExercise = () => {
    if (currentSession) {
      const nextIndex = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIndex);
      setTimeRemaining(currentSession.exercises[nextIndex].duration);
      setIsPaused(false);
    }
  };

  // Move to previous exercise
  const moveToPreviousExercise = () => {
    if (currentSession && currentExerciseIndex > 0) {
      const prevIndex = currentExerciseIndex - 1;
      setCurrentExerciseIndex(prevIndex);
      setTimeRemaining(currentSession.exercises[prevIndex].duration);
      setIsPaused(false);
    }
  };

  // Complete workout
  const completeWorkout = () => {
    if (currentSession) {
      // Add to completed workouts
      setCompletedWorkouts(prev => [...prev, currentSession.id]);
      
      // Update session stats
      const updatedSessions = sampleWorkoutSessions.map(session => {
        if (session.id === currentSession.id) {
          return {
            ...session,
            completionCount: session.completionCount + 1,
            lastCompleted: new Date()
          };
        }
        return session;
      });
      
      // Clear session timer
      if (sessionTimer) {
        clearTimeout(sessionTimer);
      }
      
      // Show feedback dialog
      setShowFeedbackDialog(true);
      
      // End session
      setInProgress(false);
    }
  };

  // Toggle pause/play
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  // Exit workout session
  const exitWorkout = () => {
    setInProgress(false);
    setCurrentSession(null);
    setShowMoodSelector(true);
    
    if (sessionTimer) {
      clearTimeout(sessionTimer);
    }
  };

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Get current exercise
  const getCurrentExercise = () => {
    if (currentSession && currentExerciseIndex < currentSession.exercises.length) {
      return currentSession.exercises[currentExerciseIndex];
    }
    return null;
  };

  // Session progress percentage
  const getSessionProgress = () => {
    if (currentSession) {
      return (currentExerciseIndex / currentSession.exercises.length) * 100;
    }
    return 0;
  };

  // Get mood icon
  const getMoodIcon = (mood: MoodType) => {
    switch (mood) {
      case 'energized': return <Sun className="h-5 w-5" />;
      case 'tired': return <Moon className="h-5 w-5" />;
      case 'stressed': return <AlertCircle className="h-5 w-5" />;
      case 'calm': return <Heart className="h-5 w-5" />;
      case 'focused': return <Activity className="h-5 w-5" />;
      case 'anxious': return <Coffee className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  // Get category label
  const getCategoryLabel = (category: WorkoutCategory) => {
    switch (category) {
      case 'yoga': return 'Yoga';
      case 'meditation': return 'Meditation';
      case 'weightlifting': return 'Strength';
      case 'hiit': return 'HIIT';
      case 'stretch': return 'Stretching';
      case 'running': return 'Running';
      default: return category;
    }
  };

  // Render the mood selector
  const renderMoodSelector = () => (
    <Card className={`bg-${darkMode ? 'gray-900' : 'white'} shadow-lg transition-all duration-300`}>
      <CardHeader>
        <CardTitle className={`text-${darkMode ? 'white' : 'gray-900'}`}>
          How are you feeling today?
        </CardTitle>
        <CardDescription className={`text-${darkMode ? 'gray-400' : 'gray-500'}`}>
          Select your current mood for personalized recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {(['energized', 'tired', 'stressed', 'calm', 'focused', 'anxious'] as MoodType[]).map(mood => (
            <Button
              key={mood}
              variant={selectedMood === mood ? "default" : "outline"}
              className={`flex items-center justify-center gap-2 h-16 capitalize ${
                selectedMood === mood 
                ? 'bg-blue-600 text-white' 
                : `bg-${darkMode ? 'gray-800' : 'gray-50'} text-${darkMode ? 'gray-300' : 'gray-700'}`
              }`}
              onClick={() => setSelectedMood(mood)}
            >
              {getMoodIcon(mood)}
              <span>{mood}</span>
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={() => setShowMoodSelector(false)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );

  // Render session cards
  const renderSessionCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {filteredSessions.map(session => (
        <Card 
          key={session.id} 
          className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
          }`}
        >
          <div className="relative h-40 overflow-hidden">
            <img 
              src={session.imageUrl} 
              alt={session.title} 
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
              <div>
                <Badge className="mb-1 bg-blue-500 text-white border-0">
                  {getCategoryLabel(session.category)}
                </Badge>
                <h3 className="text-white font-medium text-lg">{session.title}</h3>
              </div>
            </div>
          </div>
          <CardContent className={`p-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>{session.duration} min</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-${darkMode ? 'gray-400' : 'gray-500'} text-sm`}>
                  {session.difficulty}
                </span>
              </div>
            </div>
            <p className={`text-sm mb-3 line-clamp-2 text-${darkMode ? 'gray-300' : 'gray-600'}`}>
              {session.description}
            </p>
            <div className="flex flex-wrap gap-1 mb-3">
              {session.focusAreas.map(area => (
                <Badge variant="outline" key={area} className={`text-xs ${
                  darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-600'
                }`}>
                  {area}
                </Badge>
              ))}
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className={`text-xs flex items-center ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {session.completionCount > 0 ? (
                  <>
                    <Check className="h-3 w-3 mr-1 text-green-500" />
                    Completed {session.completionCount} times
                  </>
                ) : 'New workout'}
              </div>
              <Button
                onClick={() => startWorkout(session)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Start
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Render workout in progress
  const renderWorkoutInProgress = () => {
    const currentExercise = getCurrentExercise();
    
    if (!currentExercise || !currentSession) return null;
    
    return (
      <div className={`h-full flex flex-col ${fullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
        {/* Top navigation bar */}
        <div className={`flex items-center justify-between p-4 ${
          fullscreen ? 'bg-black text-white' : darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}>
          {!fullscreen && (
            <div className="flex items-center gap-2">
              <button 
                onClick={exitWorkout}
                className={`rounded-full p-2 ${
                  darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
              >
                <ChevronRight className="h-5 w-5 transform rotate-180" />
              </button>
              <h2 className="font-medium">{currentSession.title}</h2>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <TooltipProvider>
              {!fullscreen && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={() => setAudioEnabled(!audioEnabled)}
                      className={`rounded-full p-2 ${
                        darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                      }`}
                    >
                      {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {audioEnabled ? 'Mute' : 'Unmute'} audio
                  </TooltipContent>
                </Tooltip>
              )}
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={() => setFullscreen(!fullscreen)}
                    className={`rounded-full p-2 ${
                      fullscreen ? 'hover:bg-gray-800' : darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    {fullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {fullscreen ? 'Exit' : 'Enter'} fullscreen
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 h-1">
          <div 
            className="bg-blue-500 h-1 transition-all duration-300"
            style={{ width: `${getSessionProgress()}%` }}
          ></div>
        </div>
        
        {/* Exercise content */}
        <div className={`flex-grow grid md:grid-cols-2 gap-0 ${
          fullscreen ? 'grid-cols-1' : ''
        }`}>
          {/* Video section */}
          <div className={`relative bg-black ${fullscreen ? 'col-span-full' : ''}`}>
            {currentExercise.videoUrl ? (
              <iframe 
                className="w-full h-full min-h-[300px]"
                src={currentExercise.videoUrl.replace('watch?v=', 'embed/')} 
                title={`${currentExercise.name} video`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            ) : (
              <img 
                src={currentExercise.imageUrl} 
                alt={currentExercise.name}
                className="w-full h-full object-contain" 
              />
            )}
            
            {/* Timers and controls overlay */}
            <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white ${
              fullscreen ? 'hidden' : ''
            }`}>
              <div className="flex justify-between items-center">
                <div className="text-xl font-medium">{formatTime(timeRemaining)}</div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={moveToPreviousExercise}
                    disabled={currentExerciseIndex === 0}
                    className="rounded-full p-2 hover:bg-white/20 disabled:opacity-50"
                  >
                    <SkipBack className="h-5 w-5" />
                  </button>
                  
                  <button 
                    onClick={togglePause}
                    className="rounded-full p-3 bg-white/20 hover:bg-white/30"
                  >
                    {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
                  </button>
                  
                  <button 
                    onClick={moveToNextExercise}
                    disabled={currentExerciseIndex === currentSession.exercises.length - 1}
                    className="rounded-full p-2 hover:bg-white/20 disabled:opacity-50"
                  >
                    <SkipForward className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Instructions section */}
          {!fullscreen && (
            <div className={`overflow-y-auto p-6 ${
              darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
            }`}>
              <h2 className="text-2xl font-bold mb-2">{currentExercise.name}</h2>
              <p className={`mb-6 text-${darkMode ? 'gray-300' : 'gray-600'}`}>{currentExercise.description}</p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3 text-blue-600">How to Perform</h3>
                  <ol className={`list-decimal pl-5 space-y-2 text-${darkMode ? 'gray-300' : 'gray-700'}`}>
                    {currentExercise.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3 text-green-600">Benefits</h3>
                  <ul className={`list-disc pl-5 space-y-2 text-${darkMode ? 'gray-300' : 'gray-700'}`}>
                    {currentExercise.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3 text-amber-600">Tips</h3>
                  <ul className={`list-disc pl-5 space-y-2 text-${darkMode ? 'gray-300' : 'gray-700'}`}>
                    {currentExercise.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-8">
                <span className={`text-${darkMode ? 'gray-400' : 'gray-500'}`}>
                  Exercise {currentExerciseIndex + 1} of {currentSession.exercises.length}
                </span>
                <Button
                  onClick={completeWorkout}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Complete Workout
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Fullscreen controls */}
        {fullscreen && (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{currentExercise.name}</h3>
                <p className="text-gray-300">Exercise {currentExerciseIndex + 1} of {currentSession.exercises.length}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-2xl font-medium">{formatTime(timeRemaining)}</div>
                <button 
                  onClick={moveToPreviousExercise}
                  disabled={currentExerciseIndex === 0}
                  className="rounded-full p-2 hover:bg-white/20 disabled:opacity-50"
                >
                  <SkipBack className="h-6 w-6" />
                </button>
                
                <button 
                  onClick={togglePause}
                  className="rounded-full p-4 bg-white/20 hover:bg-white/30"
                >
                  {isPaused ? <Play className="h-8 w-8" /> : <Pause className="h-8 w-8" />}
                </button>
                
                <button 
                  onClick={moveToNextExercise}
                  disabled={currentExerciseIndex === currentSession.exercises.length - 1}
                  className="rounded-full p-2 hover:bg-white/20 disabled:opacity-50"
                >
                  <SkipForward className="h-6 w-6" />
                </button>
              </div>
            </div>
            <Progress value={timeRemaining} max={getCurrentExercise()?.duration} className="mt-4 h-2 bg-gray-700">
              <div className="h-full bg-blue-500 transition-all duration-300 rounded-full"></div>
            </Progress>
          </div>
        )}
      </div>
    );
  };

  // Feedback dialog
  const renderFeedbackDialog = () => (
    <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
      <DialogContent className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white'} max-w-md`}>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Great Work!</DialogTitle>
          <DialogDescription className="text-center">
            You've completed {currentSession?.title}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-4">
              <Check className="h-10 w-10" />
            </div>
            <h3 className={`text-xl font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              How do you feel now?
            </h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {(['energized', 'calm', 'focused'] as MoodType[]).map(mood => (
              <Button
                key={mood}
                variant="outline"
                className={`h-16 flex flex-col items-center justify-center gap-1 capitalize ${
                  darkMode ? 'hover:bg-gray-800 border-gray-700' : 'hover:bg-gray-100'
                }`}
                onClick={() => setShowFeedbackDialog(false)}
              >
                {getMoodIcon(mood)}
                <span>{mood}</span>
              </Button>
            ))}
          </div>
          
          <div className="pt-4 text-center">
            <Button
              onClick={() => setShowFeedbackDialog(false)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      {/* Header with nav tabs */}
      {!inProgress && (
        <div className="p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Yoga & Mindful Movement</h1>
            <div className="flex items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className={`p-2 rounded-full ${
                        darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}
                      onClick={() => setDarkMode(!darkMode)}
                    >
                      {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{darkMode ? 'Light' : 'Dark'} mode</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className={`p-2 rounded-full ${
                        darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Calendar className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Progress calendar</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className={`p-2 rounded-full ${
                        darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <BarChart2 className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Stats & insights</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {showMoodSelector ? (
            renderMoodSelector()
          ) : (
            <>
              <Tabs defaultValue={selectedCategory} onValueChange={(val) => setSelectedCategory(val as WorkoutCategory)}>
                <div className="flex justify-between items-center mb-4">
                  <TabsList className={`${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                    <TabsTrigger 
                      value="yoga" 
                      className={`${darkMode ? 'data-[state=active]:bg-gray-700' : 'data-[state=active]:bg-white'}`}
                    >
                      Yoga
                    </TabsTrigger>
                    <TabsTrigger 
                      value="meditation"
                      className={`${darkMode ? 'data-[state=active]:bg-gray-700' : 'data-[state=active]:bg-white'}`}
                    >
                      Meditation
                    </TabsTrigger>
                    <TabsTrigger 
                      value="hiit"
                      className={`${darkMode ? 'data-[state=active]:bg-gray-700' : 'data-[state=active]:bg-white'}`}
                    >
                      HIIT
                    </TabsTrigger>
                    <TabsTrigger 
                      value="stretch"
                      className={`${darkMode ? 'data-[state=active]:bg-gray-700' : 'data-[state=active]:bg-white'}`}
                    >
                      Stretch
                    </TabsTrigger>
                  </TabsList>
                  
                  {selectedMood && (
                    <Badge 
                      variant="outline"
                      className="gap-1 px-3 py-1 capitalize"
                    >
                      {getMoodIcon(selectedMood)}
                      <span>{selectedMood}</span>
                      <button 
                        onClick={() => setSelectedMood(null)}
                        className="ml-2 hover:text-blue-600"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                </div>
                
                <TabsContent value="yoga" className="mt-0">
                  {renderSessionCards()}
                </TabsContent>
                <TabsContent value="meditation" className="mt-0">
                  {renderSessionCards()}
                </TabsContent>
                <TabsContent value="hiit" className="mt-0">
                  {renderSessionCards()}
                </TabsContent>
                <TabsContent value="stretch" className="mt-0">
                  {renderSessionCards()}
                </TabsContent>
              </Tabs>
              
              {filteredSessions.length === 0 && (
                <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-500 mb-4">
                    <RefreshCw className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No sessions found</h3>
                  <p>Try a different category or mood combination</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
      
      {/* Workout in progress */}
      {inProgress && renderWorkoutInProgress()}
      
      {/* Feedback dialog */}
      {renderFeedbackDialog()}
    </div>
  );
}