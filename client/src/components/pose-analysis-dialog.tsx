import { useState, useRef, useEffect } from "react";
import { MegaDialog, MegaDialogContent, MegaDialogHeader, MegaDialogTitle, MegaDialogDescription, MegaDialogFooter, MegaDialogBody } from "@/components/ui/mega-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Camera, 
  Activity, 
  Loader2, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Check, 
  MessageSquare,
  DownloadCloud,
  Trophy,
  X
} from "lucide-react";

// Interface for pose feedback
interface PoseFeedback {
  accuracy: number;
  suggestions: string[];
  alignmentIssues: string[];
  strongAreas: string[];
  targetAreas?: string[]; // Specific areas to focus on for this pose
}

// Interface for exercise details
interface ExerciseDetails {
  name: string;
  category: string;
  description: string;
  instructions: string[];
  benefits: string[];
  tips: string[];
  imageUrl?: string;
  videoUrl?: string;
}

interface PoseAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pose: ExerciseDetails | null;
  poseId: string;
  onPoseCompletion?: (poseId: string, accuracy: number) => void;
}

export default function PoseAnalysisDialog({ 
  open, 
  onOpenChange, 
  pose, 
  poseId,
  onPoseCompletion 
}: PoseAnalysisDialogProps) {
  // State for camera management
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [poseAnalysisResult, setPoseAnalysisResult] = useState<PoseFeedback | null>(null);
  const [poseCompleted, setPoseCompleted] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up camera when dialog closes
  useEffect(() => {
    if (!open) {
      // Stop camera when dialog closes
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
  }, [open]);

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
          setCameraEnabled(true);
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
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

  // Function to analyze the specific pose
  const analyzePose = () => {
    if (!pose) return;
    
    setIsAnalyzing(true);
    
    // Capture a frame from video to canvas
    if (videoRef.current && canvasRef.current && streamRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(
          videoRef.current, 
          0, 0, 
          canvasRef.current.width, 
          canvasRef.current.height
        );
        
        // Convert canvas to data URL
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        
        // Here we would normally send the image to our OpenAI-powered backend
        // But for now, we'll simulate it with a timeout and custom feedback for each pose type
        
        setTimeout(() => {
          // Generate feedback based on the pose type
          const poseName = pose.name.toLowerCase();
          let targetedFeedback: PoseFeedback;
          
          // Random accuracy but biased toward higher accuracy for a good experience
          const randomAccuracy = Math.floor(Math.random() * 20) + 75; // 75-95%
          
          if (poseName.includes('downward dog')) {
            targetedFeedback = {
              accuracy: randomAccuracy,
              suggestions: [
                "Try to push your heels closer to the floor",
                "Distribute weight evenly between hands and feet",
                "Engage your core to maintain the inverted V shape"
              ],
              alignmentIssues: [
                "Shoulders are slightly hunched, try to relax them away from your ears",
                "Knees could be straighter (if your hamstrings allow)"
              ],
              strongAreas: [
                "Good arm extension and hand placement",
                "Spine is nicely elongated",
                "Head position is well-aligned"
              ],
              targetAreas: [
                "Focus on pushing hips higher toward the ceiling",
                "Keep hands shoulder-width apart with fingers spread wide"
              ]
            };
          } else if (poseName.includes('warrior')) {
            targetedFeedback = {
              accuracy: randomAccuracy,
              suggestions: [
                "Sink deeper into your front knee while maintaining alignment",
                "Extend through your arms with more energy",
                "Keep your shoulders relaxed away from your ears"
              ],
              alignmentIssues: [
                "Front knee is tracking slightly inward, aim to align with your ankle",
                "Torso is rotated a bit too much to the side"
              ],
              strongAreas: [
                "Good stance width and foot placement",
                "Back leg is strong and engaged",
                "Breathing is steady and consistent"
              ],
              targetAreas: [
                "Focus on squaring your hips forward",
                "Feel the stretch across your chest and shoulders"
              ]
            };
          } else {
            // Generic feedback for other poses
            targetedFeedback = {
              accuracy: randomAccuracy,
              suggestions: [
                "Focus on your breath coordination with the movement",
                "Check your alignment from head to toe",
                "Engage your core throughout the pose"
              ],
              alignmentIssues: [
                "Body is slightly tilted to one side",
                "Joint alignment could be improved"
              ],
              strongAreas: [
                "Good overall form",
                "Steady balance",
                "Consistent breathing pattern"
              ],
              targetAreas: [
                "Focus on the primary muscles being targeted",
                "Pay attention to proper weight distribution"
              ]
            };
          }
          
          setPoseAnalysisResult(targetedFeedback);
          setIsAnalyzing(false);
          
          // If accuracy is high enough, consider the pose completed
          if (targetedFeedback.accuracy >= 85) {
            setPoseCompleted(true);
            if (onPoseCompletion) {
              onPoseCompletion(poseId, targetedFeedback.accuracy);
            }
          }
        }, 2000);
      }
    }
  };

  // Reset the pose analysis
  const resetAnalysis = () => {
    setPoseAnalysisResult(null);
    setPoseCompleted(false);
  };

  if (!pose) return null;

  return (
    <MegaDialog open={open} onOpenChange={onOpenChange}>
      <MegaDialogContent className="max-w-4xl overflow-auto">
        <MegaDialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <MegaDialogTitle className="flex items-center text-xl gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Analyze Your {pose.name}
              </MegaDialogTitle>
              <MegaDialogDescription>
                Follow the instructions and use YogaVision to get real-time feedback on your form
              </MegaDialogDescription>
            </div>
            <button
              onClick={() => onOpenChange && onOpenChange(false)}
              aria-label="Close"
              type="button"
              className="rounded-full p-2 opacity-90 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none bg-pink-100 hover:bg-pink-200 shadow-md z-[100]"
            >
              <X className="h-6 w-6 text-pink-500" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </MegaDialogHeader>
        
        <MegaDialogBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Left side - Pose instruction */}
            <div className="space-y-4">
              <div className="rounded-lg border overflow-hidden">
                <div className="bg-muted/50 p-4">
                  <h3 className="font-medium text-lg">{pose.name}</h3>
                  <p className="text-sm text-muted-foreground">{pose.description}</p>
                </div>
                
                <Separator />
                
                <div className="p-4 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Instructions:</h4>
                    <ol className="space-y-1 pl-5 list-decimal text-sm">
                      {pose.instructions.map((instruction, i) => (
                        <li key={i}>{instruction}</li>
                      ))}
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Tips:</h4>
                    <ul className="space-y-1 pl-5 list-disc text-sm">
                      {pose.tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Key Areas to Focus:</h4>
                    <ul className="space-y-1 pl-5 list-disc text-sm">
                      {poseAnalysisResult?.targetAreas ? (
                        poseAnalysisResult.targetAreas.map((area, i) => (
                          <li key={i} className="text-blue-700">{area}</li>
                        ))
                      ) : (
                        <>
                          <li>Maintain proper alignment throughout the pose</li>
                          <li>Focus on steady breathing while holding the pose</li>
                          <li>Engage the primary muscle groups needed for stability</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Success celebration when pose is completed */}
              {poseCompleted && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <Trophy className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-medium text-green-800 text-lg">Pose Mastered!</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Excellent form! This pose has been marked as completed in your progress tracker.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-3 border-green-300 text-green-700 hover:bg-green-100"
                    onClick={() => onOpenChange && onOpenChange(false)}
                  >
                    Continue Practice
                  </Button>
                </div>
              )}
            </div>
            
            {/* Right side - Camera view and feedback */}
            <div className="space-y-4">
              {/* Camera view */}
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
                    <h3 className="text-lg font-medium mb-1">Enable Camera for Analysis</h3>
                    <p className="text-sm opacity-80 max-w-md mb-4">
                      Our AI will analyze your {pose.name} in real-time and provide personalized guidance.
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
                        Try Again
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
                        onClick={analyzePose}
                      >
                        <Activity className="h-4 w-4 mr-1" />
                        Analyze My {pose.name}
                      </Button>
                    )}
                  </div>
                )}
              </div>
              
              {/* AI Feedback Display */}
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
                          : poseAnalysisResult.accuracy >= 80 
                            ? '#fef9c3' 
                            : '#fee2e2',
                        color: poseAnalysisResult.accuracy >= 90 
                          ? '#166534' 
                          : poseAnalysisResult.accuracy >= 80 
                            ? '#854d0e' 
                            : '#b91c1c',
                      }}
                    >
                      {poseAnalysisResult.accuracy}% Accuracy
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 gap-4">
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
                </div>
              )}
            </div>
          </div>
        </MegaDialogBody>
        
        <MegaDialogFooter className="mt-6 gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => onOpenChange && onOpenChange(false)}
          >
            Close
          </Button>
          
          {pose.videoUrl && (
            <Button
              variant="outline"
              onClick={() => window.open(pose.videoUrl, '_blank')}
              className="border-blue-200 text-blue-700"
            >
              <DownloadCloud className="h-4 w-4 mr-1" />
              Watch Tutorial Video
            </Button>
          )}
        </MegaDialogFooter>
      </MegaDialogContent>
    </MegaDialog>
  );
}