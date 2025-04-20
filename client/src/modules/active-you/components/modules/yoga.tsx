import { useState, useRef } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Bird as YogaIcon, 
  ChevronRight, 
  Info, 
  Camera, 
  Play, 
  Video, 
  AlertCircle, 
  ExternalLink,
  Loader2,
  CheckCircle2,
  Lightbulb
} from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Define interfaces for exercise details
interface ExerciseDetails {
  id: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  instructions: string[];
  benefits: string[];
  tips: string[];
  imageUrl?: string;
  videoUrl?: string;
  animationUrl?: string;
}

// Interface for pose analysis feedback
interface PoseFeedback {
  accuracy: number;
  suggestions: string[];
  alignmentIssues: string[];
  strongAreas: string[];
}

// Yoga pose database with detailed information
const yogaPoses: Record<string, ExerciseDetails> = {
  "downwardDog": {
    id: "downwardDog",
    name: "Downward Dog (Adho Mukha Svanasana)",
    category: "yoga",
    level: "beginner",
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
    id: "warriorII",
    name: "Warrior II (Virabhadrasana II)",
    category: "yoga",
    level: "beginner",
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
    id: "treePose",
    name: "Tree Pose (Vrksasana)",
    category: "yoga",
    level: "beginner",
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
  "cobraPose": {
    id: "cobraPose",
    name: "Cobra Pose (Bhujangasana)",
    category: "yoga",
    level: "intermediate",
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
  "trianglePose": {
    id: "trianglePose",
    name: "Triangle Pose (Trikonasana)",
    category: "yoga",
    level: "intermediate",
    description: "A standing pose that stretches and strengthens the entire body.",
    instructions: [
      "Stand with feet wide apart, about 3-4 feet",
      "Turn right foot out 90 degrees and left foot in slightly",
      "Extend arms out to sides at shoulder height",
      "Reach right hand down to shin, ankle, or floor beside right foot",
      "Extend left arm straight up toward ceiling",
      "Turn head to gaze at left hand or keep looking forward",
      "Hold for 5-8 breaths, then switch sides"
    ],
    benefits: [
      "Stretches legs, spine, and sides of torso",
      "Strengthens thighs, knees, and ankles",
      "Opens chest and shoulders",
      "Improves digestion and circulation",
      "Reduces stress and anxiety"
    ],
    tips: [
      "Keep both legs straight and engaged",
      "Rotate torso open toward ceiling",
      "Keep shoulders relaxed away from ears",
      "Use a block under bottom hand if needed"
    ],
    imageUrl: "https://www.yogajournal.com/wp-content/uploads/2022/04/Triangle-Pose_Andrew-Clark.jpg",
    videoUrl: "https://www.youtube.com/watch?v=upFYlxZHif0"
  },
  "crowPose": {
    id: "crowPose",
    name: "Crow Pose (Bakasana)",
    category: "yoga",
    level: "advanced",
    description: "An arm balance pose that builds strength and focus.",
    instructions: [
      "Start in a squat position with feet hip-width apart",
      "Place hands shoulder-width apart on the floor",
      "Bend elbows and place knees high on back of arms",
      "Lean forward, shifting weight onto hands",
      "Lift one foot off the floor, then the other",
      "Engage core and gaze slightly forward",
      "Hold for 5-10 breaths"
    ],
    benefits: [
      "Strengthens arms, wrists, and core",
      "Improves balance and focus",
      "Builds confidence and body awareness",
      "Opens groins and inner thighs",
      "Prepares for more advanced arm balances"
    ],
    tips: [
      "Use a block under feet to help lift up",
      "Place a cushion in front of you for confidence",
      "Engage bandhas (energy locks) for stability",
      "Keep elbows drawn in toward midline",
      "Focus on lifting hips higher rather than trying to straighten arms"
    ],
    imageUrl: "https://www.yogajournal.com/wp-content/uploads/2021/12/Crane-Crow-Pose_Andrew-Clark.jpg",
    videoUrl: "https://www.youtube.com/watch?v=DgvjvwPGLPY"
  }
};

// Component for displaying a specific yoga pose card
function YogaPoseCard({ pose, onViewDetails }: { pose: ExerciseDetails, onViewDetails: () => void }) {
  const levelColors = {
    beginner: 'bg-blue-50 text-blue-600',
    intermediate: 'bg-purple-50 text-purple-600',
    advanced: 'bg-green-50 text-green-600'
  };
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{pose.name.split('(')[0].trim()}</CardTitle>
          <div className={`text-xs ${levelColors[pose.level]} rounded px-2 py-0.5 inline-block`}>
            {pose.level}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground mb-2">{pose.description}</p>
        <div className="text-sm space-y-1 mb-2">
          <div><span className="font-medium">Benefits:</span> {pose.benefits.slice(0, 2).join(', ')}</div>
          <div><span className="font-medium">Focus on:</span> {pose.tips.slice(0, 1)}</div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-primary justify-start"
          onClick={onViewDetails}
        >
          <Info className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

// Component for displaying yoga poses by difficulty level
function YogaPosesSection({ 
  level, 
  title, 
  description, 
  backgroundColor,
  onViewDetails
}: { 
  level: 'beginner' | 'intermediate' | 'advanced'; 
  title: string; 
  description: string; 
  backgroundColor: string;
  onViewDetails: (pose: ExerciseDetails) => void;
}) {
  // Filter poses by level
  const filteredPoses = Object.values(yogaPoses).filter(pose => pose.level === level);
  
  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg ${backgroundColor}`}>
        <h3 className="font-medium text-lg mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPoses.map((pose) => (
          <YogaPoseCard 
            key={pose.id} 
            pose={pose} 
            onViewDetails={() => onViewDetails(pose)}
          />
        ))}
      </div>
    </div>
  );
}

// Component for detailed pose view dialog
function PoseDetailsDialog({ 
  pose, 
  open, 
  onOpenChange 
}: { 
  pose: ExerciseDetails | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
}) {
  if (!pose) return null;
  
  // Extract YouTube video ID from URL if available
  const getYouTubeEmbedUrl = (url: string | undefined) => {
    if (!url) return '';
    const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : '';
  };
  
  const embedUrl = getYouTubeEmbedUrl(pose.videoUrl);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <YogaIcon className="h-5 w-5 mr-2 text-primary" />
            {pose.name}
          </DialogTitle>
          <DialogDescription>
            {pose.category === 'yoga' ? 'Yoga Pose' : 'Stretching Exercise'}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
            {/* Left column - Text content */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{pose.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Instructions</h3>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  {pose.instructions.map((instruction, i) => (
                    <li key={i}>{instruction}</li>
                  ))}
                </ol>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Benefits</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  {pose.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Tips</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  {pose.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Right column - Media content */}
            <div className="space-y-6">
              {pose.imageUrl && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Reference Image</h3>
                  <div className="relative rounded-md overflow-hidden border h-64 w-full">
                    <img 
                      src={pose.imageUrl} 
                      alt={pose.name} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              )}
              
              {embedUrl && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Instructional Video</h3>
                  <div className="relative rounded-md overflow-hidden border aspect-video">
                    <iframe
                      src={embedUrl}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`${pose.name} video`}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="flex items-center justify-between p-4 border-t">
          <div className="flex items-center">
            <Badge className={`mr-2 ${
              pose.level === 'beginner' ? 'bg-blue-100 text-blue-800' :
              pose.level === 'intermediate' ? 'bg-purple-100 text-purple-800' :
              'bg-green-100 text-green-800'
            }`}>
              {pose.level.charAt(0).toUpperCase() + pose.level.slice(1)}
            </Badge>
            <span className="text-sm text-muted-foreground">Pose difficulty level</span>
          </div>
          
          {pose.videoUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={pose.videoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Watch on YouTube
              </a>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Pose Analysis Dialog Component
function PoseAnalysisDialog({
  pose,
  open,
  onOpenChange
}: {
  pose: ExerciseDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasWebcamPermission, setHasWebcamPermission] = useState<boolean | null>(null);
  const [poseFeedback, setPoseFeedback] = useState<PoseFeedback | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  // Function to analyze pose (simulated)
  const analyzePose = () => {
    if (!cameraEnabled) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis with a timeout
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
      
      setPoseFeedback(feedback);
      setIsAnalyzing(false);
    }, 2000);
  };

  // Reset the pose analysis
  const resetAnalysis = () => {
    setPoseFeedback(null);
  };

  // Cleanup function when dialog closes
  const handleClose = () => {
    // Stop camera if it's on
    if (cameraEnabled) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      setCameraEnabled(false);
    }
    
    // Reset states
    setIsAnalyzing(false);
    setPoseFeedback(null);
    
    // Close dialog
    onOpenChange(false);
  };

  if (!pose) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <Camera className="h-5 w-5 mr-2 text-primary" />
            Pose Analysis: {pose.name}
          </DialogTitle>
          <DialogDescription>
            Use your camera to analyze and improve your form
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Camera feed */}
          <div className="space-y-4">
            <div className="relative bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden aspect-video flex items-center justify-center">
              {cameraEnabled ? (
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4">
                  <Camera className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Camera feed will appear here
                  </p>
                </div>
              )}
              
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                  <Loader2 className="h-8 w-8 animate-spin mb-2" />
                  <p>Analyzing your pose...</p>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant={cameraEnabled ? "destructive" : "default"}
                onClick={toggleCamera}
                className="flex-1"
              >
                {cameraEnabled ? "Stop Camera" : "Start Camera"}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={analyzePose} 
                disabled={!cameraEnabled || isAnalyzing}
                className="flex-1"
              >
                <Play className="h-4 w-4 mr-2" />
                Analyze Pose
              </Button>
            </div>
            
            {hasWebcamPermission === false && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Camera access denied. Please check your browser permissions.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          {/* Analysis results */}
          <div className="space-y-4">
            {poseFeedback ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full flex items-center justify-center border-4 border-primary text-primary text-2xl font-bold">
                      {poseFeedback.accuracy}%
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium">Pose Accuracy</p>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="improvements">
                    <AccordionTrigger className="text-orange-600">
                      Areas for Improvement
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm">
                        {poseFeedback.alignmentIssues.map((issue, i) => (
                          <li key={i} className="flex items-start">
                            <AlertCircle className="h-4 w-4 mr-2 text-orange-600 mt-0.5" />
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="strengths">
                    <AccordionTrigger className="text-green-600">
                      Strong Points
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm">
                        {poseFeedback.strongAreas.map((strength, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="suggestions">
                    <AccordionTrigger className="text-blue-600">
                      Helpful Suggestions
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm">
                        {poseFeedback.suggestions.map((suggestion, i) => (
                          <li key={i} className="flex items-start">
                            <Lightbulb className="h-4 w-4 mr-2 text-blue-600 mt-0.5" />
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <Button variant="outline" onClick={resetAnalysis} className="w-full">
                  Reset Analysis
                </Button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Ready for Analysis</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Enable your camera and strike the {pose.name} pose. Click "Analyze Pose" when you're ready for feedback.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md w-full">
                  <h4 className="font-medium text-sm mb-2">Quick Reference:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    {pose.instructions.slice(0, 3).map((instruction, i) => (
                      <li key={i}>{instruction}</li>
                    ))}
                    {pose.instructions.length > 3 && <li>...</li>}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Main Yoga Module Component
export default function YogaModule() {
  const [selectedPose, setSelectedPose] = useState<ExerciseDetails | null>(null);
  const [poseDetailsOpen, setPoseDetailsOpen] = useState(false);
  const [poseAnalysisOpen, setPoseAnalysisOpen] = useState(false);
  const [analysisPose, setAnalysisPose] = useState<ExerciseDetails | null>(null);
  
  // Handle showing pose details
  const handleViewPoseDetails = (pose: ExerciseDetails) => {
    setSelectedPose(pose);
    setPoseDetailsOpen(true);
  };
  
  // Handle starting pose analysis
  const handleStartPoseAnalysis = (pose: ExerciseDetails) => {
    setAnalysisPose(pose);
    setPoseAnalysisOpen(true);
  };
  
  return (
    <ScrollArea className="h-full">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary mb-2 flex items-center">
            <YogaIcon className="h-6 w-6 mr-2" />
            Yoga Practice
          </h1>
          <p className="text-muted-foreground">
            Improve flexibility, strength, and mindfulness with our guided yoga poses and sequences.
          </p>
        </div>
        
        {/* Feature highlight cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <YogaIcon className="h-4 w-4 mr-2 text-primary" />
                Guided Poses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Detailed instructions and videos for each pose to help you practice safely.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Camera className="h-4 w-4 mr-2 text-primary" />
                Pose Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Use your camera to get real-time feedback and improve your form.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-primary" />
                Progress Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track your progress as you advance through different difficulty levels.
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Difficulty level tabs */}
        <Tabs defaultValue="beginner" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="beginner" className="space-y-6">
            <YogaPosesSection 
              level="beginner"
              title="Foundation Yoga Poses"
              description="Start with these basic poses to build a strong foundation for your yoga practice."
              backgroundColor="bg-blue-50"
              onViewDetails={handleViewPoseDetails}
            />
          </TabsContent>
          
          <TabsContent value="intermediate" className="space-y-6">
            <YogaPosesSection 
              level="intermediate"
              title="Intermediate Yoga Sequences"
              description="Build upon your foundation with these more challenging poses and sequences."
              backgroundColor="bg-purple-50"
              onViewDetails={handleViewPoseDetails}
            />
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-6">
            <YogaPosesSection 
              level="advanced"
              title="Advanced Yoga Flows"
              description="Challenge yourself with these advanced poses and flows for experienced practitioners."
              backgroundColor="bg-green-50"
              onViewDetails={handleViewPoseDetails}
            />
          </TabsContent>
        </Tabs>
        
        {/* AI Pose Analysis Feature */}
        <Card className="mt-8 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              <span>YogaVision</span>
            </CardTitle>
            <CardDescription>
              Get real-time feedback on your yoga poses using AI-powered pose analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">How it works:</h3>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Select a yoga pose from any difficulty level</li>
                  <li>Click on the "Analyze Pose" button</li>
                  <li>Allow camera access when prompted</li>
                  <li>Get into position and follow the on-screen instructions</li>
                  <li>Receive personalized feedback on your form</li>
                </ol>
              </div>
              
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Ready to analyze your pose?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select any pose and click "Analyze" to get started
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Pose detail dialog */}
        <PoseDetailsDialog 
          pose={selectedPose} 
          open={poseDetailsOpen} 
          onOpenChange={setPoseDetailsOpen} 
        />
        
        {/* Pose analysis dialog */}
        <PoseAnalysisDialog 
          pose={analysisPose} 
          open={poseAnalysisOpen} 
          onOpenChange={setPoseAnalysisOpen} 
        />
      </div>
    </ScrollArea>
  );
}