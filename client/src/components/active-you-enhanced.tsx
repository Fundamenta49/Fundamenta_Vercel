import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import PoseAnalysisDialog from "./pose-analysis-dialog";
import { YogaProgressionProvider, useYogaProgression } from "../contexts/yoga-progression-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { 
  Alert, 
  AlertDescription,
  AlertTitle 
} from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import MeditationGuide from "./meditation-guide";
import FitnessProgress from "./fitness-progress";
import FitnessExercises from "./fitness-exercises";
import RunningTracker from "./running-tracker";
import RunningSpecificExercises from "./running-specific-exercises";
import HIITSpecificExercises from "./hiit-specific-exercises";
import YogaPromptFlow, { YogaSession } from "./yoga-prompt-flow";
// AI Coach functionality removed as Fundi now handles all AI interactions
import {
  Dumbbell,
  Bird as YogaIcon,
  Timer,
  Wind,
  Flame,
  Activity,
  Camera,
  Info,
  X,
  Play,
  Pause,
  RotateCcw,
  MessageSquare,
  Check,
  CheckCircle2,
  AlertCircle,
  BarChart,
  CircleSlash,
  ArrowLeft,
  ArrowRight,
  User,
  Video,
  Loader2,
  ExternalLink,
  Maximize2,
  Milestone,
  Lock
} from "lucide-react";

// Custom Stretch icon component
export function StretchingIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 4a2 2 0 1 1-2.5 2 2 2 0 0 0-2.5 2c0 .5.17 1 .5 1.5a3 3 0 0 1 0 4 3 3 0 0 0 0 4c.33.5.5 1 .5 1.5a2 2 0 0 0 2.5 2 2 2 0 1 1 2.5 2" />
      <path d="M4 18a2 2 0 1 1 2.5-2 2 2 0 0 0 2.5-2c0-.5-.17-1-.5-1.5a3 3 0 0 1 0-4 3 3 0 0 0 0-4C8.17 4 8 3.5 8 3a2 2 0 0 0-2.5-2A2 2 0 1 1 3 3" />
    </svg>
  );
}

// Define interfaces for exercise details
interface ExerciseDetails {
  name: string;
  category: string;
  description: string;
  instructions: string[];
  benefits: string[];
  tips: string[];
  imageUrl?: string;
  videoUrl?: string;
  animationUrl?: string; // Added to support instructional animations
}

// Interface for pose detection feedback
interface PoseFeedback {
  accuracy: number;
  suggestions: string[];
  alignmentIssues: string[];
  strongAreas: string[];
}

type TabType = "meditation" | "weightlifting" | "yoga" | "running" | "hiit" | "stretch";

interface ActiveYouProps {
  defaultTab: TabType;
}

// Set colors from the design system
const WELLNESS_COLOR = "#10b981"; // Wellness Green

// Wrap the component with the provider
const ActiveYouEnhancedWithProvider = ({ defaultTab }: ActiveYouProps) => {
  return (
    <YogaProgressionProvider>
      <ActiveYouEnhanced defaultTab={defaultTab} />
    </YogaProgressionProvider>
  );
};

export default ActiveYouEnhancedWithProvider;

function ActiveYouEnhanced({ defaultTab }: ActiveYouProps) {
  // Access yoga progression context
  const { poses, updatePoseStatus, getPoseById } = useYogaProgression();
  
  // State for managing the exercise detail dialog
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDetails | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [videoFullscreen, setVideoFullscreen] = useState(false);
  const [yogaPromptOpen, setYogaPromptOpen] = useState(false);
  
  // State for pose analysis dialog
  const [analysisPose, setAnalysisPose] = useState<ExerciseDetails | null>(null);
  const [analysisPoseId, setAnalysisPoseId] = useState<string>("");
  const [poseAnalysisOpen, setPoseAnalysisOpen] = useState(false);

  // Camera and YogaVision States
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasWebcamPermission, setHasWebcamPermission] = useState<boolean | null>(null);
  const [poseAnalysisResult, setPoseAnalysisResult] = useState<PoseFeedback | null>(null);
  // AI Coach functionality removed as Fundi now handles all AI interactions
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check for webcam permission when component mounts
  useEffect(() => {
    async function checkCameraPermission() {
      try {
        // Just check if we can access the camera
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some(device => device.kind === 'videoinput');
        setHasWebcamPermission(hasCamera);
      } catch (error) {
        console.error("Error checking camera permission:", error);
        setHasWebcamPermission(false);
      }
    }
    
    checkCameraPermission();
    
    // Cleanup function to stop any active streams
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Function to toggle camera
  const toggleCamera = async () => {
    if (!cameraEnabled) {
      try {
        // Start camera
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user" 
          } 
        });
        
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasWebcamPermission(true);
          setCameraEnabled(true);
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasWebcamPermission(false);
      }
    } else {
      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      setCameraEnabled(false);
      setIsAnalyzing(false);
    }
  };

  // Function to analyze pose
  const analyzeUserPose = () => {
    setIsAnalyzing(true);
    
    // Capture a frame from video to canvas (if needed)
    if (videoRef.current && canvasRef.current && streamRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(
          videoRef.current, 
          0, 0, 
          canvasRef.current.width, 
          canvasRef.current.height
        );
        
        // For demo, we'll simulate AI analysis with a timeout
        setTimeout(() => {
          // Example feedback that would come from AI
          const feedback: PoseFeedback = {
            accuracy: Math.floor(Math.random() * 30) + 70, // Random accuracy between 70-99%
            suggestions: [
              "Extend your arms fully to maximize the stretch",
              "Keep your shoulders away from your ears",
              "Try to maintain a straight spine throughout the pose"
            ],
            alignmentIssues: [
              "Knees are slightly bent, try to straighten them more",
              "Hips need to be rotated slightly forward"
            ],
            strongAreas: [
              "Good head positioning",
              "Weight distribution is balanced",
              "Breathing rhythm is consistent"
            ]
          };
          
          setPoseAnalysisResult(feedback);
          setIsAnalyzing(false);
        }, 2000);
      }
    }
  };

  // Reset the pose analysis
  const resetAnalysis = () => {
    setPoseAnalysisResult(null);
  };

  // Database of yoga exercises
  const yogaExercises: Record<string, ExerciseDetails> = {
    "downwardDog": {
      name: "Downward Dog (Adho Mukha Svanasana)",
      category: "yoga",
      description: "A foundational yoga pose that stretches and strengthens the entire body.",
      instructions: [
        "Start on hands and knees with wrists under shoulders and knees under hips",
        "Lift knees off the floor and push hips up and back",
        "Straighten legs as much as comfortable, press heels toward the floor",
        "Create an inverted V-shape with your body",
        "Keep arms straight and shoulders away from ears",
        "Hold for 5-10 breaths"
      ],
      benefits: [
        "Stretches hamstrings, calves, and shoulders",
        "Strengthens arms, shoulders, and legs",
        "Relieves back pain and improves posture",
        "Increases blood flow to the brain",
        "Calms the nervous system"
      ],
      tips: [
        "Bend knees if hamstrings are tight",
        "Spread fingers wide and press palms firmly into mat",
        "Rotate upper arms outward to broaden shoulders",
        "Keep neck relaxed by gazing toward navel"
      ],
      imageUrl: "https://www.yogajournal.com/wp-content/uploads/2022/01/Downward-Facing-Dog_Andrew-Clark.jpg",
      videoUrl: "https://www.youtube.com/watch?v=YqOqM79McYY"
    },
    "warriorII": {
      name: "Warrior II (Virabhadrasana II)",
      category: "yoga",
      description: "A powerful standing pose that builds strength and stability.",
      instructions: [
        "Stand with feet wide apart (3-4 feet)",
        "Turn right foot out 90 degrees and left foot in slightly",
        "Extend arms parallel to floor, reaching actively through fingertips",
        "Bend right knee to 90 degrees, keeping knee over ankle",
        "Turn head to gaze over right fingertips",
        "Hold for 5-8 breaths, then repeat on other side"
      ],
      benefits: [
        "Strengthens legs, ankles, and feet",
        "Opens hips and chest",
        "Builds stamina and concentration",
        "Stimulates abdominal organs",
        "Develops balance and stability"
      ],
      tips: [
        "Keep torso centered between legs, not leaning forward",
        "Press outer edge of back foot firmly into floor",
        "Draw shoulder blades down back to release tension",
        "Keep front knee aligned with second toe"
      ],
      imageUrl: "https://www.yogajournal.com/wp-content/uploads/2021/12/Warrior-2_Andrew-Clark.jpg",
      videoUrl: "https://www.youtube.com/watch?v=4Ejz7IgODlU"
    },
    "treePose": {
      name: "Tree Pose (Vrksasana)",
      category: "yoga",
      description: "A balancing pose that improves focus and stability.",
      instructions: [
        "Begin standing with feet together",
        "Shift weight onto left foot and lift right foot off floor",
        "Place sole of right foot on inner left thigh (or lower leg, but avoid knee)",
        "Bring palms together at heart center or extend arms overhead",
        "Fix gaze on a stationary point in front of you",
        "Hold for 5-8 breaths, then switch sides"
      ],
      benefits: [
        "Improves balance and stability",
        "Strengthens thighs, calves, and ankles",
        "Opens hips and groin",
        "Builds focus and concentration",
        "Develops core strength"
      ],
      tips: [
        "Start with foot lower on leg if balance is challenging",
        "Use a wall for support if needed",
        "Engage core muscles to maintain stability",
        "Keep breathing steady and smooth"
      ],
      imageUrl: "https://www.yogajournal.com/wp-content/uploads/2022/04/Tree-Pose_Andrew-Clark.jpg",
      videoUrl: "https://www.youtube.com/watch?v=wdln9qWYloU"
    },
    "childsPose": {
      name: "Child's Pose (Balasana)",
      category: "yoga",
      description: "A restful pose that gently stretches the back and promotes relaxation.",
      instructions: [
        "Kneel on the floor with knees hip-width apart, big toes touching",
        "Sit back on heels and fold forward, extending arms in front of you",
        "Rest forehead on the mat and relax shoulders toward floor",
        "Breathe deeply, feeling the expansion in the back with each inhale",
        "Hold for 1-3 minutes, focusing on relaxation"
      ],
      benefits: [
        "Releases tension in back, shoulders, and chest",
        "Calms the mind and reduces stress",
        "Gently stretches hips, thighs, and ankles",
        "Relieves back and neck pain",
        "Promotes relaxation and restoration"
      ],
      tips: [
        "Place a cushion under your sit bones if uncomfortable",
        "Widen knees for more space if belly or chest feels compressed",
        "Arms can rest alongside body for deeper relaxation",
        "Focus on deep, steady breathing"
      ],
      imageUrl: "https://www.yogajournal.com/wp-content/uploads/2021/12/childs-pose_Andrew-Clark.jpg",
      videoUrl: "https://www.youtube.com/watch?v=eqVMAPM00DM"
    },
    "cobrasPose": {
      name: "Cobra Pose (Bhujangasana)",
      category: "yoga",
      description: "A gentle backbend that strengthens the spine and opens the chest.",
      instructions: [
        "Lie on stomach with legs extended, tops of feet on floor",
        "Place hands under shoulders, elbows close to sides of body",
        "Press into hands and lift chest off floor, keeping lower ribs on mat",
        "Roll shoulders back and down, away from ears",
        "Gaze forward or slightly upward without straining neck",
        "Hold for 15-30 seconds, then slowly release"
      ],
      benefits: [
        "Strengthens spine and back muscles",
        "Opens chest and shoulders",
        "Stimulates abdominal organs",
        "Improves posture and counteracts slouching",
        "Relieves stress and fatigue"
      ],
      tips: [
        "Only lift as high as comfortable without pain",
        "Keep elbows slightly bent, not locked",
        "Focus on using back muscles rather than arm strength",
        "Keep legs engaged with tops of feet pressing into floor"
      ],
      imageUrl: "https://www.yogajournal.com/wp-content/uploads/2021/12/cobra-pose_Andrew-Clark.jpg",
      videoUrl: "https://www.youtube.com/watch?v=zgvolZs7y_8"
    },
    "warriorI": {
      name: "Warrior I (Virabhadrasana I)",
      category: "yoga",
      description: "A powerful standing pose that builds strength and improves focus.",
      instructions: [
        "Start in a lunge position with right foot forward",
        "Turn left heel down at 45-degree angle, grounding through outer edge",
        "Square hips to front of mat as much as possible",
        "Raise arms overhead, palms facing each other or touching",
        "Bend right knee to 90 degrees, keeping knee over ankle",
        "Gaze forward or up at hands",
        "Hold for 5 breaths, then switch sides"
      ],
      benefits: [
        "Strengthens shoulders, arms, legs, ankles, and back",
        "Stretches chest, lungs, shoulders, neck, belly, and groin",
        "Opens hips and improves balance and stability",
        "Develops concentration and core strength",
        "Improves circulation and respiration"
      ],
      tips: [
        "Keep back heel firmly grounded",
        "Draw tailbone down toward floor to protect lower back",
        "Widen stance if balance is difficult",
        "Engage core muscles throughout the pose"
      ],
      imageUrl: "https://www.yogajournal.com/wp-content/uploads/2021/12/warrior-1_Andrew-Clark.jpg",
      videoUrl: "https://www.youtube.com/watch?v=k2xC2F2qzXs"
    },
    "bridgePose": {
      name: "Bridge Pose (Setu Bandhasana)",
      category: "yoga",
      description: "A gentle backbend that opens the chest and strengthens the back.",
      instructions: [
        "Lie on back with knees bent, feet flat on floor hip-width apart",
        "Place arms alongside body, palms down",
        "Press feet into floor and lift hips up",
        "Roll shoulders under and clasp hands below pelvis",
        "Keep thighs and feet parallel",
        "Hold for 30-60 seconds",
        "Release by slowly rolling spine back to floor"
      ],
      benefits: [
        "Stretches chest, neck, and spine",
        "Strengthens back, glutes, and hamstrings",
        "Calms the mind and reduces anxiety",
        "Stimulates abdominal organs and thyroid",
        "Relieves back pain"
      ],
      tips: [
        "Keep knees hip-width apart throughout the pose",
        "Press shoulders down to open chest more",
        "Engage glutes to support the lower back",
        "Place a block under sacrum for supported version"
      ],
      imageUrl: "https://www.yogajournal.com/wp-content/uploads/2021/12/Bridge-Pose_Andrew-Clark.jpg",
      videoUrl: "https://www.youtube.com/watch?v=NnbvPeAIhmA"
    }
  };
  
  // Database of stretching exercises
  const stretchExercises: Record<string, ExerciseDetails> = {
    "hamstringStretch": {
      name: "Standing Hamstring Stretch",
      category: "stretch",
      description: "A fundamental stretch that targets the back of the thighs and helps reduce lower back tension.",
      instructions: [
        "Stand tall with feet hip-width apart",
        "Extend right leg forward, placing heel on ground with toes pointing up",
        "Keep left leg slightly bent for stability",
        "Hinge at hips and fold forward while maintaining a flat back",
        "Place hands on left thigh or bring torso toward extended leg",
        "Hold for 20-30 seconds",
        "Repeat on opposite side"
      ],
      benefits: [
        "Lengthens hamstring muscles",
        "Reduces lower back tightness and pain",
        "Improves range of motion in hips and knees",
        "Helps prevent hamstring injuries",
        "Enhances athletic performance"
      ],
      tips: [
        "Keep extended leg slightly bent to avoid hyperextension",
        "Focus on hinging at hips rather than rounding back",
        "For deeper stretch, use a strap around foot of extended leg",
        "Maintain regular breathing throughout the stretch"
      ],
      imageUrl: "https://www.verywellfit.com/thmb/7Ks_5N2wTM3Qer7tbt5pQlTmvbY=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Verywell-1-2696618-Standing-Hamstring-Stretch-c1c012c25db44c859057671fc8c04042.jpg",
      videoUrl: "https://www.youtube.com/watch?v=7T5qdHu9QgY"
    },
    "figureFourStretch": {
      name: "Figure Four Stretch",
      category: "stretch",
      description: "An effective hip opener that targets the piriformis and outer hip muscles.",
      instructions: [
        "Lie on back with knees bent, feet flat on floor",
        "Cross right ankle over left thigh just above knee",
        "Thread right arm between legs and left arm around outside of left leg",
        "Clasp hands behind left thigh or on shin",
        "Gently pull left thigh toward chest while pushing right knee away",
        "Hold for 20-30 seconds",
        "Switch sides and repeat"
      ],
      benefits: [
        "Releases tension in hip rotators and glutes",
        "Relieves lower back pain and sciatica symptoms",
        "Improves hip mobility and range of motion",
        "Enhances athletic performance",
        "Prepares body for squatting movements"
      ],
      tips: [
        "Keep foot of crossed leg flexed to protect knee joint",
        "Press elbow into crossed leg to deepen stretch if comfortable",
        "Keep lower back pressed into floor throughout stretch",
        "Perform seated in chair if floor position is uncomfortable"
      ],
      imageUrl: "https://www.verywellfit.com/thmb/3IsJ_CiXVweb-t5L_ZWXhKv7rvs=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Verywell-11-2696641-SupermaneFigure4PoseonBack-598a598325ab4da9b3dfb180b14c1bb7.jpg",
      videoUrl: "https://www.youtube.com/watch?v=Gnv2tNF8XgI"
    },
    "chestStretch": {
      name: "Doorway Chest Stretch",
      category: "stretch",
      description: "An accessible stretch that opens the chest and counteracts the effects of poor posture.",
      instructions: [
        "Stand in an open doorway",
        "Raise each arm to the side at a 90-degree angle (like cactus arms)",
        "Place forearms and palms on door frames",
        "Step forward with one foot through the doorway",
        "Lean body weight gently forward until you feel stretch across chest",
        "Hold for 20-30 seconds",
        "Adjust arm height to target different parts of chest"
      ],
      benefits: [
        "Opens chest and stretches pectoral muscles",
        "Counteracts rounded shoulder posture",
        "Improves breathing capacity",
        "Reduces tension in chest and shoulders",
        "Helps correct posture issues from desk work"
      ],
      tips: [
        "Keep core engaged to prevent arching lower back",
        "Vary arm positions (higher/lower) to target different muscle fibers",
        "Start with gentle stretch and progressively increase",
        "Maintain neutral neck position, avoiding forward head posture"
      ],
      imageUrl: "https://acewebcontent.azureedge.net/exercise-library/large/81-1.jpg",
      videoUrl: "https://www.youtube.com/watch?v=aVj3iuWGvNA"
    },
    "catCowStretch": {
      name: "Cat-Cow Stretch",
      category: "stretch",
      description: "A gentle flowing stretch that improves spinal mobility and coordination.",
      instructions: [
        "Start on hands and knees with wrists under shoulders and knees under hips",
        "Begin in neutral spine position, with back flat",
        "For cow pose: Inhale, drop belly toward floor, lift chest and tailbone while gazing up",
        "For cat pose: Exhale, round spine toward ceiling, tuck chin and tailbone",
        "Move smoothly between positions with breath",
        "Repeat for 10-15 cycles"
      ],
      benefits: [
        "Improves spinal flexibility and mobility",
        "Relieves back and neck tension",
        "Coordinates breath with movement",
        "Massages and stimulates organs in abdomen",
        "Calms the mind and reduces stress"
      ],
      tips: [
        "Focus on initiating movement from tailbone",
        "Keep wrists directly under shoulders to protect joints",
        "Move slowly and mindfully with each breath",
        "For sensitive wrists, make fists or use yoga wedges"
      ],
      imageUrl: "https://www.verywellfit.com/thmb/ELo9W-2CrvJsfZ5SgzYdOc81YlM=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Verywell-01-3567198-CatCowPose-Update-aa3497f6f31644f486ea22c643cfee6d.jpg",
      videoUrl: "https://www.youtube.com/watch?v=kqnua4rHVVA"
    }
  };

  // Function to handle opening the detail dialog
  const handleShowDetails = (exerciseType: string, exerciseKey: string) => {
    if (exerciseType === 'yoga') {
      setSelectedExercise(yogaExercises[exerciseKey]);
    } else if (exerciseType === 'stretch') {
      setSelectedExercise(stretchExercises[exerciseKey]);
    }
    setDialogOpen(true);
  };
  
  // Function to show exercise details from running exercises component
  const showExerciseDetails = (exercise: any) => {
    // Convert the Exercise type from running-specific-exercises to ExerciseDetails if needed
    const exerciseDetails: ExerciseDetails = {
      name: exercise.name,
      category: exercise.category || 'running',
      description: exercise.description || '',
      instructions: exercise.instructions || [],
      benefits: exercise.benefits || [
        "Improves running performance",
        "Builds specific muscle groups needed for running",
        "Enhances cardiovascular endurance"
      ],
      tips: exercise.tips || [
        "Focus on proper form for maximum benefit",
        "Maintain a consistent breathing pattern",
        "Start with lower intensity and gradually increase"
      ],
      imageUrl: exercise.imageUrl,
      videoUrl: exercise.videoUrl
    };
    
    setSelectedExercise(exerciseDetails);
    setDialogOpen(true);
  };
  
  // Function to handle completion of yoga prompt flow
  const handleYogaPromptComplete = (session?: YogaSession) => {
    // Only close if no session was selected (user manually closed it)
    if (!session) {
      setYogaPromptOpen(false);
    }
    // If a session was selected, keep the dialog open to show the video
  };

  // Create a variable to hold the content based on the tab
  let tabContent;
  
  // Yoga tab content with AI-powered pose analysis
  const renderYogaSection = () => (
    <div className="space-y-4">
      <div className="pb-4 mb-4 border-b" style={{ borderColor: WELLNESS_COLOR }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <YogaIcon className="h-6 w-6 mr-2" style={{ color: WELLNESS_COLOR }} />
            <h2 className="text-xl font-bold" style={{ color: WELLNESS_COLOR }}>
              AI Yoga Assistant
            </h2>
          </div>
          <Button 
            onClick={() => setYogaPromptOpen(true)}
            className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200"
            size="sm"
          >
            <ArrowRight className="h-4 w-4 mr-1" />
            Start Guided Flow
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Get real-time form corrections and personalized yoga guidance
        </p>
      </div>
      
      {/* AI Pose Analysis Feature */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-blue-500" />
            <span>YogaVision</span>
            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
              Beta
            </Badge>
          </CardTitle>
          <CardDescription>
            Get real-time feedback on your yoga poses with YogaVision AI
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {/* Camera permission check */}
          {hasWebcamPermission === false && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Camera Access Required for YogaVision</AlertTitle>
              <AlertDescription>
                Please enable camera access in your browser settings to use the YogaVision feature.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Camera view and controls */}
          <div className="relative rounded-lg overflow-hidden bg-gray-900 aspect-video">
            {cameraEnabled ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
                <Camera className="h-12 w-12 mb-3 opacity-60" />
                <h3 className="text-lg font-medium mb-1">Enable Camera for YogaVision</h3>
                <p className="text-sm opacity-80 max-w-md mb-4">
                  Our AI can analyze your yoga poses in real-time and provide personalized guidance to improve your form.
                </p>
                <Button 
                  onClick={toggleCamera}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Enable Camera
                </Button>
              </div>
            )}
            
            {/* Canvas for pose detection (hidden) */}
            <canvas 
              ref={canvasRef} 
              width="640" 
              height="480" 
              className="hidden"
            />
            
            {/* Camera controls when enabled */}
            {cameraEnabled && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                {poseAnalysisResult ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/90 hover:bg-white"
                    onClick={resetAnalysis}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset Analysis
                  </Button>
                ) : isAnalyzing ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/90 hover:bg-white"
                    disabled
                  >
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Analyzing Pose...
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/90 hover:bg-white"
                    onClick={analyzeUserPose}
                  >
                    <Activity className="h-4 w-4 mr-1" />
                    Analyze Pose
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/90 hover:bg-white text-red-600"
                  onClick={toggleCamera}
                >
                  <CircleSlash className="h-4 w-4 mr-1" />
                  Turn Off Camera
                </Button>
              </div>
            )}
          </div>
          
          {/* AI Feedback Display */}
          {poseAnalysisResult && (
            <div className="mt-4 space-y-4 border rounded-lg p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg flex items-center">
                  <CheckCircle2 className="mr-2 h-5 w-5 text-blue-600" />
                  Pose Analysis Complete
                </h3>
                <Badge 
                  className="text-lg px-3 py-1"
                  style={{
                    backgroundColor: poseAnalysisResult.accuracy >= 90 
                      ? '#dcfce7' 
                      : poseAnalysisResult.accuracy >= 70 
                        ? '#fef9c3' 
                        : '#fee2e2',
                    color: poseAnalysisResult.accuracy >= 90 
                      ? '#166534' 
                      : poseAnalysisResult.accuracy >= 70 
                        ? '#854d0e' 
                        : '#b91c1c',
                  }}
                >
                  {poseAnalysisResult.accuracy}% Accuracy
                </Badge>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-800 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Areas to Improve
                  </h4>
                  <ul className="space-y-1 pl-6 list-disc text-sm">
                    {poseAnalysisResult.alignmentIssues.map((issue, i) => (
                      <li key={i} className="text-gray-700">{issue}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-green-700 flex items-center">
                    <Check className="h-4 w-4 mr-1" />
                    You're Doing Well
                  </h4>
                  <ul className="space-y-1 pl-6 list-disc text-sm">
                    {poseAnalysisResult.strongAreas.map((area, i) => (
                      <li key={i} className="text-gray-700">{area}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium text-blue-800">Suggestions</h4>
                <ul className="space-y-1 pl-6 list-disc text-sm">
                  {poseAnalysisResult.suggestions.map((suggestion, i) => (
                    <li key={i} className="text-gray-700">{suggestion}</li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={resetAnalysis}
                  className="border-blue-300 text-blue-700"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset Analysis
                </Button>
                
                <Button
                  onClick={() => alert("Please use Fundi for AI assistance")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Use Fundi Instead
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Yoga Poses Card */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle>Yoga Poses & Flows</CardTitle>
          <CardDescription>
            Practice poses, follow guided sequences, and improve your technique
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <Alert className="bg-blue-50 border-blue-200 mb-4">
            <AlertDescription className="text-blue-800">
              Find poses and sequences for all levels, from beginner to advanced
            </AlertDescription>
          </Alert>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-lg">Yoga Progression Path</h3>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200">
                  Level 2: Steady Practitioner
                </Badge>
                <Badge variant="outline" className="text-xs bg-gray-50">
                  <Milestone className="h-3 w-3 mr-1" />
                  5/12 Poses Mastered
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Pose 1 - Beginner (Mastered) */}
              <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors border-green-200">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-lg mb-1">Downward-Facing Dog</div>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Mastered
                  </Badge>
                </div>
                <div className="flex gap-1 mb-2">
                  <div className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-0.5 inline-block">foundation</div>
                  <div className="text-xs bg-blue-50 text-blue-600 rounded px-2 py-0.5 inline-block">beginner</div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">A foundational pose that stretches and strengthens the entire body</p>
                <div className="text-sm space-y-1 mb-2">
                  <div><span className="font-medium">Benefits:</span> Stretches hamstrings, calves, shoulders; strengthens arms and legs</div>
                  <div><span className="font-medium">Focus on:</span> Forming an inverted V-shape, pressing heels towards floor</div>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    onClick={() => handleShowDetails('yoga', 'downwardDog')}
                  >
                    <Info size={14} />
                    <span className="ml-1">Show Details</span>
                  </button>

                  <button 
                    className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
                    onClick={() => {
                      // Set the pose for analysis
                      setAnalysisPose(yogaExercises.downwardDog);
                      setAnalysisPoseId("downwardDog");
                      setPoseAnalysisOpen(true);
                    }}
                  >
                    <Video size={14} />
                    <span className="ml-1">Practice Pose</span>
                  </button>
                  
                  {cameraEnabled && (
                    <button 
                      className="text-sm text-green-600 hover:text-green-800 flex items-center"
                      onClick={analyzeUserPose}
                    >
                      <Camera size={14} />
                      <span className="ml-1">Analyze My Form</span>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Pose 2 - Beginner (Mastered) */}
              <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors border-green-200">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-lg mb-1">Warrior II</div>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Mastered
                  </Badge>
                </div>
                <div className="flex gap-1 mb-2">
                  <div className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-0.5 inline-block">standing</div>
                  <div className="text-xs bg-blue-50 text-blue-600 rounded px-2 py-0.5 inline-block">beginner</div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">A powerful standing pose that builds strength and stability</p>
                <div className="text-sm space-y-1 mb-2">
                  <div><span className="font-medium">Benefits:</span> Strengthens legs, opens hips and chest, improves focus</div>
                  <div><span className="font-medium">Focus on:</span> Parallel front shin, strong back leg, extended arms</div>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    onClick={() => handleShowDetails('yoga', 'warriorII')}
                  >
                    <Info size={14} />
                    <span className="ml-1">Show Details</span>
                  </button>

                  <button 
                    className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
                    onClick={() => {
                      // Set the pose for analysis
                      setAnalysisPose(yogaExercises.warriorII);
                      setAnalysisPoseId("warriorII");
                      setPoseAnalysisOpen(true);
                    }}
                  >
                    <Video size={14} />
                    <span className="ml-1">Practice Pose</span>
                  </button>
                  
                  {cameraEnabled && (
                    <button 
                      className="text-sm text-green-600 hover:text-green-800 flex items-center"
                      onClick={analyzeUserPose}
                    >
                      <Camera size={14} />
                      <span className="ml-1">Analyze My Form</span>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Pose 3 - Beginner (In Progress) */}
              <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors border-yellow-200">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-lg mb-1">Tree Pose</div>
                  <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                    <Timer className="h-3 w-3 mr-1" />
                    In Progress
                  </Badge>
                </div>
                <div className="flex gap-1 mb-2">
                  <div className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-0.5 inline-block">balance</div>
                  <div className="text-xs bg-blue-50 text-blue-600 rounded px-2 py-0.5 inline-block">beginner</div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">A balancing pose that improves focus and stability</p>
                <div className="text-sm space-y-1 mb-2">
                  <div><span className="font-medium">Benefits:</span> Improves balance, strengthens legs and core, enhances focus</div>
                  <div><span className="font-medium">Focus on:</span> Grounding through standing foot, engaging core</div>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    onClick={() => handleShowDetails('yoga', 'treePose')}
                  >
                    <Info size={14} />
                    <span className="ml-1">Show Details</span>
                  </button>

                  <button 
                    className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
                    onClick={() => {
                      // Set the pose for analysis
                      setAnalysisPose(yogaExercises.treePose);
                      setAnalysisPoseId("treePose");
                      setPoseAnalysisOpen(true);
                    }}
                  >
                    <Video size={14} />
                    <span className="ml-1">Practice Pose</span>
                  </button>
                  
                  {cameraEnabled && (
                    <button 
                      className="text-sm text-green-600 hover:text-green-800 flex items-center"
                      onClick={analyzeUserPose}
                    >
                      <Camera size={14} />
                      <span className="ml-1">Analyze My Form</span>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Pose 4 - Beginner (Mastered) */}
              <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors border-green-200">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-lg mb-1">Child's Pose</div>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Mastered
                  </Badge>
                </div>
                <div className="flex gap-1 mb-2">
                  <div className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-0.5 inline-block">resting</div>
                  <div className="text-xs bg-blue-50 text-blue-600 rounded px-2 py-0.5 inline-block">beginner</div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">A restful pose that gently stretches the back and promotes relaxation</p>
                <div className="text-sm space-y-1 mb-2">
                  <div><span className="font-medium">Benefits:</span> Releases tension, calms mind, stretches hips and thighs</div>
                  <div><span className="font-medium">Focus on:</span> Deep breathing, relaxing shoulders, gentle hip opening</div>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    onClick={() => handleShowDetails('yoga', 'childsPose')}
                  >
                    <Info size={14} />
                    <span className="ml-1">Show Details</span>
                  </button>
                  
                  <button 
                    className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
                    onClick={() => {
                      // Set the pose for analysis
                      setAnalysisPose(yogaExercises.childsPose);
                      setAnalysisPoseId("childsPose");
                      setPoseAnalysisOpen(true);
                    }}
                  >
                    <Video size={14} />
                    <span className="ml-1">Practice Pose</span>
                  </button>
                  
                  {cameraEnabled && (
                    <button 
                      className="text-sm text-green-600 hover:text-green-800 flex items-center"
                      onClick={analyzeUserPose}
                    >
                      <Camera size={14} />
                      <span className="ml-1">Analyze My Form</span>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Pose 5 - Intermediate (In Progress) */}
              <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors border-yellow-200">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-lg mb-1">Cobra Pose</div>
                  <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                    <Timer className="h-3 w-3 mr-1" />
                    In Progress
                  </Badge>
                </div>
                <div className="flex gap-1 mb-2">
                  <div className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-0.5 inline-block">backbend</div>
                  <div className="text-xs bg-purple-50 text-purple-600 rounded px-2 py-0.5 inline-block">intermediate</div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">A gentle backbend that strengthens the spine and opens the chest</p>
                <div className="text-sm space-y-1 mb-2">
                  <div><span className="font-medium">Benefits:</span> Strengthens spine, opens chest, improves posture</div>
                  <div><span className="font-medium">Focus on:</span> Using back muscles not arms, keeping shoulders relaxed</div>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    onClick={() => handleShowDetails('yoga', 'cobrasPose')}
                  >
                    <Info size={14} />
                    <span className="ml-1">Show Details</span>
                  </button>
                  
                  <button 
                    className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
                    onClick={() => {
                      // Set the pose for analysis
                      setAnalysisPose(yogaExercises.cobraPose);
                      setAnalysisPoseId("cobraPose");
                      setPoseAnalysisOpen(true);
                    }}
                  >
                    <Video size={14} />
                    <span className="ml-1">Practice Pose</span>
                  </button>
                  
                  {cameraEnabled && (
                    <button 
                      className="text-sm text-green-600 hover:text-green-800 flex items-center"
                      onClick={analyzeUserPose}
                    >
                      <Camera size={14} />
                      <span className="ml-1">Analyze My Form</span>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Pose 6 - Intermediate (Locked) */}
              <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors border-gray-300 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-lg mb-1">Warrior I</div>
                  <Badge className="bg-gray-100 text-gray-500 border-gray-300">
                    <Lock className="h-3 w-3 mr-1" />
                    Locked
                  </Badge>
                </div>
                <div className="flex gap-1 mb-2">
                  <div className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-0.5 inline-block">standing</div>
                  <div className="text-xs bg-purple-50 text-purple-600 rounded px-2 py-0.5 inline-block">intermediate</div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">A powerful standing pose that builds strength and improves focus</p>
                <div className="text-sm space-y-1 mb-2">
                  <div><span className="font-medium">Benefits:</span> Strengthens legs and core, opens chest, builds concentration</div>
                  <div><span className="font-medium">Focus on:</span> Square hips, grounded back heel, upward energy</div>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    onClick={() => handleShowDetails('yoga', 'warriorI')}
                  >
                    <Info size={14} />
                    <span className="ml-1">Show Details</span>
                  </button>
                  
                  {cameraEnabled && (
                    <button 
                      className="text-sm text-green-600 hover:text-green-800 flex items-center"
                      onClick={analyzeUserPose}
                    >
                      <Camera size={14} />
                      <span className="ml-1">Analyze My Form</span>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Pose 7 - Advanced (Locked) */}
              <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors border-gray-300 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-lg mb-1">Bridge Pose</div>
                  <Badge className="bg-gray-100 text-gray-500 border-gray-300">
                    <Lock className="h-3 w-3 mr-1" />
                    Locked
                  </Badge>
                </div>
                <div className="flex gap-1 mb-2">
                  <div className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-0.5 inline-block">backbend</div>
                  <div className="text-xs bg-red-50 text-red-600 rounded px-2 py-0.5 inline-block">advanced</div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">A gentle backbend that opens the chest and strengthens the back</p>
                <div className="text-sm space-y-1 mb-2">
                  <div><span className="font-medium">Benefits:</span> Stretches chest, strengthens back and glutes, relieves stress</div>
                  <div><span className="font-medium">Focus on:</span> Keeping knees hip-width apart, engaging glutes and core</div>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    onClick={() => handleShowDetails('yoga', 'bridgePose')}
                  >
                    <Info size={14} />
                    <span className="ml-1">Show Details</span>
                  </button>
                  
                  {cameraEnabled && (
                    <button 
                      className="text-sm text-green-600 hover:text-green-800 flex items-center"
                      onClick={analyzeUserPose}
                    >
                      <Camera size={14} />
                      <span className="ml-1">Analyze My Form</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Flows */}
          <div className="mt-6">
            <h3 className="font-medium text-lg my-3">Other Yoga Sequences</h3>
            <div className="grid gap-4">
              <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="font-medium text-lg mb-1">Evening Relaxation Flow</div>
                <p className="text-sm text-muted-foreground mb-2">A gentle sequence to release tension and prepare for sleep</p>
                <div className="text-sm space-y-2">
                  <div><span className="font-medium">1.</span> Reclining Bound Angle Pose (Supta Baddha Konasana)</div>
                  <div><span className="font-medium">2.</span> Happy Baby Pose (Ananda Balasana)</div>
                  <div><span className="font-medium">3.</span> Legs-Up-The-Wall Pose (Viparita Karani)</div>
                  <div><span className="font-medium">4.</span> Supine Spinal Twist (Jathara Parivartanasana)</div>
                  <div><span className="font-medium">5.</span> Corpse Pose (Savasana)</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Progress tracking */}
      <FitnessProgress />
      
      {/* AI Coach Dialog - removed as Fundi now handles all AI interactions */}
    </div>
  );
  
  // Stretching tab content with AI-powered analysis
  const renderStretchingSection = () => (
    <div className="space-y-4">
      <div className="pb-4 mb-4 border-b" style={{ borderColor: WELLNESS_COLOR }}>
        <div className="flex items-center">
          <StretchingIcon className="h-6 w-6 mr-2" style={{ color: WELLNESS_COLOR }} />
          <h2 className="text-xl font-bold" style={{ color: WELLNESS_COLOR }}>
            AI Stretch Assistant
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Get personalized form corrections and guided stretching routines
        </p>
      </div>
      
      {/* AI Pose Analysis Feature */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-blue-500" />
            <span>YogaVision</span>
            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
              Beta
            </Badge>
          </CardTitle>
          <CardDescription>
            Get real-time feedback on your stretching form using AI analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {/* Camera view and controls - same as yoga section */}
          <div className="relative rounded-lg overflow-hidden bg-gray-900 aspect-video">
            {cameraEnabled ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
                <Camera className="h-12 w-12 mb-3 opacity-60" />
                <h3 className="text-lg font-medium mb-1">Enable Camera for YogaVision</h3>
                <p className="text-sm opacity-80 max-w-md mb-4">
                  Our AI can analyze your stretching form in real-time and provide personalized guidance for safe and effective stretching.
                </p>
                <Button 
                  onClick={toggleCamera}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Enable Camera
                </Button>
              </div>
            )}
            
            {/* Canvas for pose detection (hidden) */}
            <canvas 
              ref={canvasRef} 
              width="640" 
              height="480" 
              className="hidden"
            />
            
            {/* Camera controls when enabled */}
            {cameraEnabled && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                {poseAnalysisResult ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/90 hover:bg-white"
                    onClick={resetAnalysis}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset Analysis
                  </Button>
                ) : isAnalyzing ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/90 hover:bg-white"
                    disabled
                  >
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Analyzing Form...
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/90 hover:bg-white"
                    onClick={analyzeUserPose}
                  >
                    <Activity className="h-4 w-4 mr-1" />
                    Analyze Form
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/90 hover:bg-white text-red-600"
                  onClick={toggleCamera}
                >
                  <CircleSlash className="h-4 w-4 mr-1" />
                  Turn Off Camera
                </Button>
              </div>
            )}
          </div>
          
          {/* AI Feedback Display - same format as yoga section */}
          {poseAnalysisResult && (
            <div className="mt-4 space-y-4 border rounded-lg p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg flex items-center">
                  <CheckCircle2 className="mr-2 h-5 w-5 text-blue-600" />
                  Form Analysis Complete
                </h3>
                <Badge 
                  className="text-lg px-3 py-1"
                  style={{
                    backgroundColor: poseAnalysisResult.accuracy >= 90 
                      ? '#dcfce7' 
                      : poseAnalysisResult.accuracy >= 70 
                        ? '#fef9c3' 
                        : '#fee2e2',
                    color: poseAnalysisResult.accuracy >= 90 
                      ? '#166534' 
                      : poseAnalysisResult.accuracy >= 70 
                        ? '#854d0e' 
                        : '#b91c1c',
                  }}
                >
                  {poseAnalysisResult.accuracy}% Accuracy
                </Badge>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-800 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Areas to Improve
                  </h4>
                  <ul className="space-y-1 pl-6 list-disc text-sm">
                    {poseAnalysisResult.alignmentIssues.map((issue, i) => (
                      <li key={i} className="text-gray-700">{issue}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-green-700 flex items-center">
                    <Check className="h-4 w-4 mr-1" />
                    You're Doing Well
                  </h4>
                  <ul className="space-y-1 pl-6 list-disc text-sm">
                    {poseAnalysisResult.strongAreas.map((area, i) => (
                      <li key={i} className="text-gray-700">{area}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium text-blue-800">Suggestions</h4>
                <ul className="space-y-1 pl-6 list-disc text-sm">
                  {poseAnalysisResult.suggestions.map((suggestion, i) => (
                    <li key={i} className="text-gray-700">{suggestion}</li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={resetAnalysis}
                  className="border-blue-300 text-blue-700"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset Analysis
                </Button>
                
                <Button
                  onClick={() => alert("Please use Fundi for AI assistance")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Use Fundi Instead
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle>Stretching Routines</CardTitle>
          <CardDescription>
            Enhance your flexibility, mobility, and recovery with targeted stretching
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <Alert className="bg-blue-50 border-blue-200 mb-4">
            <AlertDescription className="text-blue-800">
              Find stretches to improve mobility and aid recovery
            </AlertDescription>
          </Alert>
          
          <div className="mb-6">
            <h3 className="font-medium text-lg mb-3">Recommended Routines</h3>
            <div className="grid gap-4">
              <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="font-medium text-lg mb-1">Full Body Flexibility Routine</div>
                <p className="text-sm text-muted-foreground mb-2">Hold each stretch for 30 seconds, 2-3 rounds</p>
                <div className="text-sm space-y-2">
                  <div><span className="font-medium">1.</span> Standing Hamstring Stretch: Targets back of legs</div>
                  <div><span className="font-medium">2.</span> Quadriceps Stretch: Focuses on front of thighs</div>
                  <div><span className="font-medium">3.</span> Chest Opener Stretch: Opens chest and shoulders</div>
                  <div><span className="font-medium">4.</span> Seated Spinal Twist: Enhances spinal flexibility</div>
                  <div><span className="font-medium">5.</span> Butterfly Stretch: Targets inner thighs and hips</div>
                  <div><span className="font-medium">6.</span> Triceps Stretch: Stretches back of upper arms</div>
                </div>
              </div>
              
              <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="font-medium text-lg mb-1">Dynamic Warm-Up Routine</div>
                <p className="text-sm text-muted-foreground mb-2">Perform before workouts to prepare muscles and joints</p>
                <div className="text-sm space-y-2">
                  <div><span className="font-medium">1.</span> Arm Circles: Gradually increases shoulder mobility</div>
                  <div><span className="font-medium">2.</span> Leg Swings: Activates hip flexors and hamstrings</div>
                  <div><span className="font-medium">3.</span> Bodyweight Squats: Warms up quads and knees</div>
                  <div><span className="font-medium">4.</span> Walking Lunges: Engages multiple leg muscles</div>
                  <div><span className="font-medium">5.</span> Torso Twists: Prepares core for rotation</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Custom Stretch Cards */}
          <div>
            <h3 className="font-medium text-lg mb-3">Essential Stretches</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Stretch 1 */}
              <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-lg mb-1">Standing Hamstring Stretch</div>
                <div className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-0.5 inline-block mb-2">lower body</div>
                <p className="text-sm text-muted-foreground mb-2">Lengthens hamstrings and reduces lower back tension</p>
                <div className="text-sm space-y-1 mb-2">
                  <div><span className="font-medium">How to:</span> Stand tall, place one foot in front with heel on ground, toe up. Hinge forward at the hips while maintaining straight back.</div>
                  <div><span className="font-medium">Feel it:</span> Along the back of the extended leg and possibly the lower back</div>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    onClick={() => handleShowDetails('stretch', 'hamstringStretch')}
                  >
                    <Info size={14} />
                    <span className="ml-1">Show Details</span>
                  </button>
                  
                  {cameraEnabled && (
                    <button 
                      className="text-sm text-green-600 hover:text-green-800 flex items-center"
                      onClick={analyzeUserPose}
                    >
                      <Camera size={14} />
                      <span className="ml-1">Analyze My Form</span>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Stretch 2 */}
              <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-lg mb-1">Figure Four Stretch</div>
                <div className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-0.5 inline-block mb-2">hips</div>
                <p className="text-sm text-muted-foreground mb-2">Opens hip rotators and relieves glute tension</p>
                <div className="text-sm space-y-1 mb-2">
                  <div><span className="font-medium">How to:</span> Lie on back, cross right ankle over left thigh, reach through legs and pull left thigh toward chest.</div>
                  <div><span className="font-medium">Feel it:</span> In the outer hip and glute of the crossed leg</div>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    onClick={() => handleShowDetails('stretch', 'figureFourStretch')}
                  >
                    <Info size={14} />
                    <span className="ml-1">Show Details</span>
                  </button>
                  
                  {cameraEnabled && (
                    <button 
                      className="text-sm text-green-600 hover:text-green-800 flex items-center"
                      onClick={analyzeUserPose}
                    >
                      <Camera size={14} />
                      <span className="ml-1">Analyze My Form</span>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Stretch 3 */}
              <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-lg mb-1">Doorway Chest Stretch</div>
                <div className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-0.5 inline-block mb-2">upper body</div>
                <p className="text-sm text-muted-foreground mb-2">Opens chest and counteracts rounded shoulders</p>
                <div className="text-sm space-y-1 mb-2">
                  <div><span className="font-medium">How to:</span> Stand in doorway, place forearms on door frame at 90° angles, lean forward gently.</div>
                  <div><span className="font-medium">Feel it:</span> Across chest and front of shoulders</div>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    onClick={() => handleShowDetails('stretch', 'chestStretch')}
                  >
                    <Info size={14} />
                    <span className="ml-1">Show Details</span>
                  </button>
                  
                  {cameraEnabled && (
                    <button 
                      className="text-sm text-green-600 hover:text-green-800 flex items-center"
                      onClick={analyzeUserPose}
                    >
                      <Camera size={14} />
                      <span className="ml-1">Analyze My Form</span>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Stretch 4 */}
              <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-lg mb-1">Cat-Cow Stretch</div>
                <div className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-0.5 inline-block mb-2">spine</div>
                <p className="text-sm text-muted-foreground mb-2">Improves spinal mobility and relieves back tension</p>
                <div className="text-sm space-y-1 mb-2">
                  <div><span className="font-medium">How to:</span> Start on hands and knees, alternate between arching (cow) and rounding (cat) your back.</div>
                  <div><span className="font-medium">Feel it:</span> Throughout the entire spine and core</div>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    onClick={() => handleShowDetails('stretch', 'catCowStretch')}
                  >
                    <Info size={14} />
                    <span className="ml-1">Show Details</span>
                  </button>
                  
                  {cameraEnabled && (
                    <button 
                      className="text-sm text-green-600 hover:text-green-800 flex items-center"
                      onClick={analyzeUserPose}
                    >
                      <Camera size={14} />
                      <span className="ml-1">Analyze My Form</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-3">Exercise Library</h3>
            <FitnessExercises 
              muscleFilter="flexibility" 
              equipmentFilter="body weight"
              categoryFilter="stretching"
              keywordFilter="stretch"
              difficultyFilter="beginner"
              showFilters={false} 
              compactView={true}
              maxExercises={4}
            />
          </div>
        </CardContent>
      </Card>
      
      <FitnessProgress />
      
      {/* AI Coach Dialog - removed as Fundi now handles all AI interactions */}
    </div>
  );
  
  // Switch statement to determine which tab content to render
  switch (defaultTab) {
    case "meditation":
      tabContent = <MeditationGuide />;
      break;
      
    case "weightlifting":
      tabContent = (
        <div className="space-y-4">
          <div className="pb-4 mb-4 border-b" style={{ borderColor: WELLNESS_COLOR }}>
            <div className="flex items-center">
              <Dumbbell className="h-6 w-6 mr-2" style={{ color: WELLNESS_COLOR }} />
              <h2 className="text-xl font-bold" style={{ color: WELLNESS_COLOR }}>
                AI Weight Lifting Guide
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Get personalized workout plans and form guidance
            </p>
          </div>
          <Card className="overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle>Weight Training</CardTitle>
              <CardDescription>
                Build strength, muscle, and power with these weightlifting routines
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <Alert className="bg-blue-50 border-blue-200 mb-4">
                <AlertDescription className="text-blue-800">
                  Find exercises that match your equipment and experience level
                </AlertDescription>
              </Alert>
              
              <div className="mb-6">
                <h3 className="font-medium text-lg my-3">Sample Routine</h3>
                <div className="grid gap-4">
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="font-medium text-lg mb-1">Full Body Strength</div>
                    <p className="text-sm text-muted-foreground mb-2">Target all major muscle groups with compound movements</p>
                    <div className="text-sm space-y-2">
                      <div><span className="font-medium">1.</span> Barbell Squat: 3 sets of 8-10 reps</div>
                      <div><span className="font-medium">2.</span> Deadlift: 3 sets of 6-8 reps</div>
                      <div><span className="font-medium">3.</span> Bench Press: 3 sets of 8-10 reps</div>
                      <div><span className="font-medium">4.</span> Bent-over Rows: 3 sets of 10-12 reps</div>
                      <div><span className="font-medium">5.</span> Overhead Press: 3 sets of 8-10 reps</div>
                      <div><span className="font-medium">6.</span> Bicep Curls: 3 sets of 12-15 reps</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <FitnessExercises 
                muscleFilter="strength" 
                equipmentFilter="barbell" 
                difficultyFilter="intermediate"
                categoryFilter="weightlifting" 
                keywordFilter="press"
                showFilters={false}
                compactView={true}
                maxExercises={4}
              />
            </CardContent>
          </Card>
          <FitnessProgress />
        </div>
      );
      break;
      
    case "yoga":
      tabContent = renderYogaSection();
      break;
      
    case "running":
      tabContent = (
        <div className="space-y-4">
          <div className="pb-4 mb-4 border-b" style={{ borderColor: WELLNESS_COLOR }}>
            <div className="flex items-center">
              <Timer className="h-6 w-6 mr-2" style={{ color: WELLNESS_COLOR }} />
              <h2 className="text-xl font-bold" style={{ color: WELLNESS_COLOR }}>
                Running Tracker
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Track your runs, set goals, and improve your performance
            </p>
          </div>
          
          {/* Essential Running Warm-up Stretches */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle>Pre-Run Warm-up Routine</CardTitle>
              <CardDescription>
                Essential dynamic stretches to prepare your body for a run
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <Alert className="bg-amber-50 border-amber-200 mb-4">
                <AlertDescription className="text-amber-800">
                  Always warm up properly before running to improve performance and reduce injury risk
                </AlertDescription>
              </Alert>
              
              <div className="mb-6">
                <h3 className="font-medium text-lg my-3">Dynamic Warm-up Stretches</h3>
                <div className="grid gap-4">
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="font-medium text-lg mb-1">5-Minute Runner's Warm-up</div>
                    <p className="text-sm text-muted-foreground mb-2">Complete this sequence before every run</p>
                    <div className="text-sm space-y-2">
                      <div><span className="font-medium">1.</span> Ankle Rotations: 10 circles in each direction for both feet</div>
                      <div><span className="font-medium">2.</span> Walking Knee Pulls: 10 steps, pulling knee to chest</div>
                      <div><span className="font-medium">3.</span> Hip Circles: 10 rotations in each direction</div>
                      <div><span className="font-medium">4.</span> Dynamic Leg Swings: 10 forward/back and 10 side-to-side for each leg</div>
                      <div><span className="font-medium">5.</span> Calf Raises: 15 slow raises on each leg</div>
                      <div><span className="font-medium">6.</span> Hamstring Sweeps: 10 per leg, gently sweeping hands toward toes</div>
                      <div><span className="font-medium">7.</span> Gentle Arm Circles: 10 forward and 10 backward</div>
                      <div><span className="font-medium">8.</span> Light Jogging: 2 minutes of very light jogging in place</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <RunningTracker />
          
          {/* Runner-specific exercises */}
          <Card className="overflow-hidden mt-4">
            <CardHeader className="pb-0">
              <CardTitle>Runner's Training Program</CardTitle>
              <CardDescription>
                Targeted exercises to improve running performance and prevent common injuries
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <Alert className="bg-blue-50 border-blue-200 mb-4">
                <AlertDescription className="text-blue-800">
                  These exercises specifically benefit runners by targeting key muscles used in running
                </AlertDescription>
              </Alert>
              
              <div className="mb-6">
                <h3 className="font-medium text-lg my-3">Runner's Strength Routine</h3>
                <div className="grid gap-4">
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="font-medium text-lg mb-1">Running-Focused Strength Training</div>
                    <p className="text-sm text-muted-foreground mb-2">Perform 2-3 times per week to improve running efficiency</p>
                    <div className="text-sm space-y-2">
                      <div><span className="font-medium">1.</span> Single-Leg Squats: Improves leg strength and stability for each stride</div>
                      <div><span className="font-medium">2.</span> Walking Lunges: Mimics running motion while building strength</div>
                      <div><span className="font-medium">3.</span> Step-Ups: Strengthens glutes and quadriceps for hill climbing</div>
                      <div><span className="font-medium">4.</span> Calf Raises on Step: Develops push-off power and ankle stability</div>
                      <div><span className="font-medium">5.</span> Planks with Leg Lifts: Enhances core stability while running</div>
                      <div><span className="font-medium">6.</span> Glute Bridges: Activates hip extensors used in running stride</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-lg my-3">Runner's Recovery Stretches</h3>
                <div className="grid gap-4">
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="font-medium text-lg mb-1">Post-Run Recovery</div>
                    <p className="text-sm text-muted-foreground mb-2">Hold each stretch for 30 seconds after your run</p>
                    <div className="text-sm space-y-2">
                      <div><span className="font-medium">1.</span> Standing Quad Stretch: Eases tension in quadriceps</div>
                      <div><span className="font-medium">2.</span> Standing Calf Stretch: Releases tight calves</div>
                      <div><span className="font-medium">3.</span> Seated Hamstring Stretch: Lengthens hamstrings after contraction</div>
                      <div><span className="font-medium">4.</span> Figure Four Stretch: Opens tight hip rotators</div>
                      <div><span className="font-medium">5.</span> Lying Spinal Twist: Releases lower back tension</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Specialized Running Training Program with Specific Exercises */}
              <div className="mb-6 pt-2">
                <h3 className="font-medium text-xl mb-4">Complete Runner's Training Program</h3>
                
                <div className="mb-6 pb-2 border-b border-gray-200">
                  <h4 className="font-medium text-lg mb-3">Pre-Run Warm-Up Routine</h4>
                  <p className="text-gray-700 mb-3">Always perform these dynamic stretches before running to prepare your muscles and prevent injury.</p>
                  <div className="grid grid-cols-1 gap-4">
                    {/* Using our custom component that targets specific running exercises */}
                    <RunningSpecificExercises 
                      category="warmUp"
                      title="Dynamic Warm-Ups & Mobility Exercises"
                      description="Perform these exercises for 30-60 seconds each before your run to warm up muscles and increase mobility."
                      backgroundColor="bg-blue-50"
                      maxExercises={5}
                      onShowExerciseDetail={(exercise) => showExerciseDetails(exercise)}
                    />
                  </div>
                </div>
                
                <div className="mb-6 pb-2 border-b border-gray-200">
                  <h4 className="font-medium text-lg mb-3">Strength Training for Runners</h4>
                  <p className="text-gray-700 mb-3">Perform these exercises 2-3 times per week to build strength that will improve your running performance.</p>
                  <div className="grid grid-cols-1 gap-4">
                    <RunningSpecificExercises 
                      category="strength"
                      title="Core & Lower Body Strength Exercises"
                      description="Complete 2-3 sets of 10-15 repetitions of each exercise to build running-specific strength."
                      backgroundColor="bg-amber-50"
                      maxExercises={5}
                      onShowExerciseDetail={showExerciseDetails}
                    />
                  </div>
                </div>
                
                <div className="mb-6 pb-2 border-b border-gray-200">
                  <h4 className="font-medium text-lg mb-3">Run-Specific Technique Drills</h4>
                  <p className="text-gray-700 mb-3">Incorporate these drills into your training to improve running form and efficiency.</p>
                  <div className="grid grid-cols-1 gap-4">
                    <RunningSpecificExercises 
                      category="plyometric"
                      title="Speed & Plyometric Drills"
                      description="Add these explosive exercises to your routine 1-2 times per week to improve power and running economy."
                      backgroundColor="bg-green-50"
                      maxExercises={5}
                      onShowExerciseDetail={showExerciseDetails}
                    />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-lg mb-3">Post-Run Recovery Exercises</h4>
                  <p className="text-gray-700 mb-3">Essential stretches to perform after running to improve recovery and flexibility.</p>
                  <div className="grid grid-cols-1 gap-4">
                    <RunningSpecificExercises 
                      category="coolDown"
                      title="Recovery Stretches"
                      description="Hold each stretch for 30-60 seconds after your run to improve flexibility and reduce soreness."
                      backgroundColor="bg-purple-50"
                      maxExercises={5}
                      onShowExerciseDetail={showExerciseDetails}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
      break;
      
    case "hiit":
      tabContent = (
        <div className="space-y-4">
          <div className="pb-4 mb-4 border-b" style={{ borderColor: WELLNESS_COLOR }}>
            <div className="flex items-center">
              <Flame className="h-6 w-6 mr-2" style={{ color: WELLNESS_COLOR }} />
              <h2 className="text-xl font-bold" style={{ color: WELLNESS_COLOR }}>
                HIIT Workouts
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              High-Intensity Interval Training for maximum results
            </p>
          </div>
          <Card className="overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle>High-Intensity Interval Training</CardTitle>
              <CardDescription>
                Burn calories and build endurance with these intense workouts
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-blue-800 flex flex-col space-y-2">
                  <p className="font-medium">What is HIIT?</p>
                  <p>HIIT alternates between short, intense bursts of exercise and less-intense recovery periods, keeping your heart rate up to burn more fat in less time.</p>
                </AlertDescription>
              </Alert>
              
              <div className="mb-6">
                <h3 className="font-medium text-lg my-3">HIIT Protocols</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="mb-6 pb-2 border-b border-gray-200">
                    <h4 className="font-medium text-lg mb-3">Tabata Protocol</h4>
                    <p className="text-gray-700 mb-3">20 seconds work, 10 seconds rest for 8 rounds (4 minutes total)</p>
                    <div className="grid grid-cols-1 gap-4">
                      <HIITSpecificExercises 
                        category="tabata"
                        title="Tabata Workout Exercises"
                        description="These exercises are perfect for Tabata timing - 20 seconds of maximum effort followed by 10 seconds of rest."
                        backgroundColor="bg-red-50"
                        maxExercises={4}
                        onShowExerciseDetail={(exercise) => showExerciseDetails(exercise)}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6 pb-2 border-b border-gray-200">
                    <h4 className="font-medium text-lg mb-3">AMRAP (As Many Rounds As Possible)</h4>
                    <p className="text-gray-700 mb-3">Complete as many rounds of a circuit as possible in a set time (typically 10-20 minutes)</p>
                    <div className="grid grid-cols-1 gap-4">
                      <HIITSpecificExercises 
                        category="amrap"
                        title="AMRAP Circuit Exercises"
                        description="Perform these exercises in sequence, completing as many rounds as possible in your target time."
                        backgroundColor="bg-orange-50"
                        maxExercises={4}
                        onShowExerciseDetail={(exercise) => showExerciseDetails(exercise)}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6 pb-2 border-b border-gray-200">
                    <h4 className="font-medium text-lg mb-3">EMOM (Every Minute On the Minute)</h4>
                    <p className="text-gray-700 mb-3">At the start of each minute, perform a specific exercise. Rest for the remainder of the minute.</p>
                    <div className="grid grid-cols-1 gap-4">
                      <HIITSpecificExercises 
                        category="emom"
                        title="EMOM Workout Exercises"
                        description="Each exercise should be performed at the start of a minute, with rest in remaining time."
                        backgroundColor="bg-yellow-50"
                        maxExercises={4}
                        onShowExerciseDetail={(exercise) => showExerciseDetails(exercise)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-lg mb-3">Circuit Training</h4>
                    <p className="text-gray-700 mb-3">Move through 5-10 exercises with minimal rest between movements.</p>
                    <div className="grid grid-cols-1 gap-4">
                      <HIITSpecificExercises 
                        category="circuit"
                        title="Circuit Training Exercises"
                        description="Perform each exercise for 30-60 seconds before moving to the next with minimal rest."
                        backgroundColor="bg-green-50"
                        maxExercises={4}
                        onShowExerciseDetail={(exercise) => showExerciseDetails(exercise)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <FitnessProgress />
        </div>
      );
      break;
    
    case "stretch":
      tabContent = renderStretchingSection();
      break;
      
    default:
      tabContent = null;
      break;
  }
  
  // Return both the tab content and the dialog
  return (
    <>
      {/* The component content based on the tab */}
      {tabContent}
      
      {/* Exercise Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedExercise && (
            <>
              <DialogHeader className="pb-2 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-2xl font-bold text-gray-900">{selectedExercise?.name}</DialogTitle>
                    <DialogDescription className="text-gray-600 mt-1">
                      {selectedExercise?.category === 'yoga' ? 'Yoga Pose' : 'Stretching Exercise'}
                    </DialogDescription>
                  </div>
                  <button 
                    className="rounded-full p-2 hover:bg-gray-100 transition-colors" 
                    onClick={() => setDialogOpen(false)}
                  >
                    <X size={20} />
                  </button>
                </div>
              </DialogHeader>
              
              <div className="mt-4 space-y-8 max-h-[70vh] overflow-y-auto pr-2">
                {selectedExercise?.imageUrl && (
                  <div className="rounded-lg overflow-hidden shadow-md">
                    <img 
                      src={selectedExercise?.imageUrl} 
                      alt={`${selectedExercise?.name} demonstration`} 
                      className="w-full object-cover h-auto max-h-80 mx-auto" 
                    />
                  </div>
                )}
                
                <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
                  <div className="md:col-span-2 space-y-8">
                    <div>
                      <h3 className="text-lg font-medium mb-3 text-gray-800">Description</h3>
                      <p className="text-gray-700 leading-relaxed">{selectedExercise?.description}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3 text-blue-800 flex items-center">
                        <span>How to Perform</span>
                      </h3>
                      <ol className="list-decimal pl-5 space-y-2">
                        {selectedExercise?.instructions.map((instruction, index) => (
                          <li key={index} className="text-gray-700">{instruction}</li>
                        ))}
                      </ol>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3 text-green-800 flex items-center">
                        <span>Benefits</span>
                      </h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {selectedExercise?.benefits.map((benefit, index) => (
                          <li key={index} className="text-gray-700">{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium mb-3 text-amber-800 flex items-center">
                        <span>Tips for Best Results</span>
                      </h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {selectedExercise?.tips.map((tip, index) => (
                          <li key={index} className="text-gray-700">{tip}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {selectedExercise?.videoUrl && (
                      <div className="mt-6 mb-4">
                        <h3 className="text-lg font-medium mb-3 text-gray-800">Video Tutorial</h3>
                        <div 
                          className="relative aspect-video w-full overflow-hidden rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-all duration-200" 
                          onClick={() => setVideoFullscreen(true)}
                        >
                          {/* Create responsive container for the video that works well on mobile */}
                          <div className="relative pb-[56.25%] h-0 overflow-hidden">
                            <iframe 
                              className="absolute top-0 left-0 w-full h-full"
                              src={selectedExercise.videoUrl.replace('watch?v=', 'embed/')} 
                              title={`${selectedExercise.name} tutorial video`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                              allowFullScreen
                              loading="lazy"
                            ></iframe>
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center transition-all duration-200">
                            <Maximize2 className="h-12 w-12 text-white opacity-0 hover:opacity-100 filter drop-shadow-lg" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-3">
                          <a 
                            href={selectedExercise.videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            <ExternalLink className="h-3.5 w-3.5 mr-1" />
                            Open on YouTube
                          </a>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-sm flex items-center gap-1.5"
                            onClick={() => setVideoFullscreen(true)}
                          >
                            <Maximize2 className="h-3.5 w-3.5" />
                            Full Screen
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Display animation if available */}
                    {selectedExercise?.animationUrl && (
                      <div className="mt-6 mb-4">
                        <h3 className="text-lg font-medium mb-3 text-gray-800">Animation Guide</h3>
                        <div className="overflow-hidden rounded-lg border shadow-md">
                          <div className="relative pb-[75%] h-0 overflow-hidden bg-gray-50 flex items-center justify-center">
                            <img 
                              src={selectedExercise.animationUrl}
                              alt={`${selectedExercise.name} animation`}
                              className="absolute top-0 left-0 w-full h-full object-contain"
                              loading="lazy"
                            />
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          This animation demonstrates proper form for the {selectedExercise.name.toLowerCase()}.
                        </p>
                      </div>
                    )}
                    
                    {/* Full-screen Video Dialog */}
                    {videoFullscreen && selectedExercise?.videoUrl && (
                      <Dialog 
                        open={videoFullscreen} 
                        onOpenChange={setVideoFullscreen}
                        modal={true}
                      >
                        <DialogContent className="max-w-[95vw] w-full max-h-[90vh] p-0 border-none bg-black">
                          <DialogTitle className="sr-only">
                            {selectedExercise.name} Video Tutorial
                          </DialogTitle>
                          <DialogDescription className="sr-only">
                            Full screen video tutorial for {selectedExercise.name}
                          </DialogDescription>
                          <div className="relative w-full h-[90vh]">
                            {/* Responsive container for fullscreen video that works on mobile too */}
                            <div className="relative pb-[56.25%] h-0 overflow-hidden">
                              <iframe 
                                className="absolute top-0 left-0 w-full h-full"
                                src={selectedExercise.videoUrl.replace('watch?v=', 'embed/')} 
                                title={`${selectedExercise.name} tutorial video (fullscreen)`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                                loading="lazy"
                              ></iframe>
                            </div>
                            <Button 
                              className="absolute top-2 right-2 rounded-full p-2 h-10 w-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white"
                              onClick={() => setVideoFullscreen(false)}
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    
                    {cameraEnabled && (
                      <div className="mt-4">
                        <h3 className="text-lg font-medium mb-3 text-blue-800">Form Analysis</h3>
                        <div className="flex items-center justify-center gap-2">
                          <Button 
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-md"
                            onClick={() => {
                              setDialogOpen(false);
                              setTimeout(() => {
                                analyzeUserPose();
                              }, 500);
                            }}
                          >
                            <Camera className="h-4 w-4" />
                            Analyze My Form
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex justify-between mt-6 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => alert("Please use Fundi for AI assistance")}
                  className="gap-2 shadow-sm hover:shadow-md transition-all"
                >
                  <MessageSquare className="h-4 w-4" />
                  Use Fundi Instead
                </Button>
                
                <Button
                  onClick={() => setDialogOpen(false)}
                  className="shadow-sm hover:shadow-md transition-all"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Yoga Prompt Flow */}
      {yogaPromptOpen && (
        <YogaPromptFlow 
          onComplete={handleYogaPromptComplete}
          onClose={() => setYogaPromptOpen(false)}
        />
      )}
      
      {/* Pose-Specific Analysis Dialog */}
      <PoseAnalysisDialog
        open={poseAnalysisOpen}
        onOpenChange={setPoseAnalysisOpen}
        pose={analysisPose}
        poseId={analysisPoseId}
        onPoseCompletion={(poseId, accuracy) => {
          // Update pose status in the progression context
          updatePoseStatus(poseId, 'completed', accuracy);
          // Close the dialog after completion
          setPoseAnalysisOpen(false);
        }}
      />
    </>
  );
}