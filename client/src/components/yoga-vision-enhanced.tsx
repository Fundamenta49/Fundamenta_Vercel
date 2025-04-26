import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useYogaProgression } from '../contexts/yoga-progression-context';
import { yogaPoses, getPoseById } from '../data/yoga-poses-progression';
import Webcam from 'react-webcam';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2,
  Camera,
  Upload,
  AlertCircle,
  ArrowRight,
  Info,
  ThumbsUp,
  MoveRight,
  AlertTriangle,
  Loader2,
  Star,
  Trophy,
  Lock,
  Award
} from "lucide-react";

// Define interfaces for our component
interface PoseAnalysis {
  overallAssessment: string;
  strengths: string[];
  improvements: string[];
  safetyNotes: string;
  alignmentTips: string;
  difficultyAssessment: string;
  confidenceScore: number;
  score?: number;  // Overall score for gamification
}

interface ReferencePose {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  imageUrl: string;
  keyAlignmentPoints: string[];
}

interface YogaVisionEnhancedProps {
  initialPoseId?: string;
  onAnalysisComplete?: (analysis: PoseAnalysis) => void;
  onClose?: () => void;
  compactMode?: boolean; // For displaying in a more compact layout in dialogs
}

export default function YogaVisionEnhanced({ 
  initialPoseId, 
  onAnalysisComplete,
  onClose,
  compactMode = false
}: YogaVisionEnhancedProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedPoseId, setSelectedPoseId] = useState<string>(initialPoseId || "");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<PoseAnalysis | null>(null);
  const [rewardEarned, setRewardEarned] = useState<{xp: number, newMasteryLevel: number} | null>(null);
  const [referencePoses, setReferencePoses] = useState<ReferencePose[]>([]);
  const [isLoadingPoses, setIsLoadingPoses] = useState<boolean>(false);
  const [useCameraMode, setUseCameraMode] = useState<boolean>(true);
  const [showReferenceExample, setShowReferenceExample] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const { toast } = useToast();
  
  // Get progression context
  const {
    userProgress,
    updatePoseMastery,
    earnXp,
    isPoseUnlocked
  } = useYogaProgression();

  // Load reference poses when the component mounts
  useEffect(() => {
    loadReferencePoses();
  }, []);

  // Function to load reference poses from the API
  const loadReferencePoses = async () => {
    try {
      setIsLoadingPoses(true);
      
      // First check if we have poses from our progression system
      const progressionPoses = yogaPoses.map(pose => ({
        id: pose.id,
        name: pose.name,
        description: pose.description,
        difficulty: pose.difficulty,
        imageUrl: pose.imageUrl || '',
        keyAlignmentPoints: pose.benefits
      }));
      
      if (progressionPoses.length > 0) {
        setReferencePoses(progressionPoses);
        return;
      }
      
      // Fall back to API if no progression poses
      const response = await axios.get('/api/yoga/reference-poses');
      if (response.data.success && response.data.poses) {
        setReferencePoses(response.data.poses);
      }
    } catch (error) {
      console.error('Failed to load reference poses:', error);
      toast({
        title: "Unable to load reference poses",
        description: "Please try again later. If the problem persists, check your internet connection.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingPoses(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    
    if (file) {
      // Check file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive"
        });
        return;
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage(file);
      setImagePreview(previewUrl);
      
      // Clear any previous analysis
      setAnalysis(null);
      setRewardEarned(null);
    }
  };

  // Handle camera button click - now just for file uploads
  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle webcam capture
  const handleWebcamCapture = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setImagePreview(imageSrc);
        
        // Convert base64 to file
        const fetchRes = await fetch(imageSrc);
        const blob = await fetchRes.blob();
        const file = new File([blob], "webcam-capture.jpg", { type: "image/jpeg" });
        setSelectedImage(file);
        
        // Clear any previous analysis
        setAnalysis(null);
        setRewardEarned(null);
      }
    }
  };
  
  // Toggle between camera and upload modes
  const toggleCameraMode = () => {
    setUseCameraMode(prev => !prev);
    // Reset any existing image
    if (imagePreview) {
      handleReset();
    }
  };

  // Handle pose selection
  const handlePoseSelect = (poseId: string) => {
    setSelectedPoseId(poseId);
    // Clear any previous analysis
    setAnalysis(null);
    setRewardEarned(null);
  };

  // Convert score to mastery level (0-5 stars)
  const scoreToMasteryLevel = (score: number): number => {
    if (score >= 95) return 5;
    if (score >= 85) return 4;
    if (score >= 75) return 3;
    if (score >= 65) return 2;
    if (score >= 50) return 1;
    return 0;
  };

  // Handle form submission
  const handleSubmitForAnalysis = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please upload an image of your yoga pose",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedPoseId) {
      toast({
        title: "No pose selected",
        description: "Please select which yoga pose you're attempting",
        variant: "destructive"
      });
      return;
    }
    
    // Get pose data
    const poseData = getPoseById(selectedPoseId);
    if (!poseData) {
      toast({
        title: "Invalid pose selected",
        description: "The selected pose doesn't exist in our database",
        variant: "destructive"
      });
      return;
    }
    
    // Start analysis
    setIsAnalyzing(true);
    
    // Create form data
    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('poseName', poseData.name);
    
    try {
      // Send to API
      const response = await axios.post('/api/yoga/analyze-pose', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success && response.data.poseAnalysis) {
        // Add score if not provided by API
        const analysisWithScore = {
          ...response.data.poseAnalysis,
          score: response.data.poseAnalysis.score || 
                Math.round(response.data.poseAnalysis.confidenceScore * 100)
        };
        
        setAnalysis(analysisWithScore);
        
        // Calculate mastery level
        const score = analysisWithScore.score;
        const masteryLevel = scoreToMasteryLevel(score);
        
        // Check current mastery level from user progress
        const currentAchievement = userProgress?.poseAchievements?.[selectedPoseId];
        const currentMasteryLevel = currentAchievement?.masteryLevel || 0;
        
        // Calculate XP earned based on improvement
        let xpEarned = 0;
        if (masteryLevel > currentMasteryLevel) {
          // Get pose XP value
          const poseXpValue = poseData.xpValue || 10;
          // Award XP for each level improved
          xpEarned = poseXpValue * (masteryLevel - currentMasteryLevel);
          
          // Set reward data for display
          setRewardEarned({
            xp: xpEarned,
            newMasteryLevel: masteryLevel
          });
          
          // Update user progression
          if (updatePoseMastery) {
            updatePoseMastery(selectedPoseId, score);
          }
        } else {
          // Still update the attempt, but no XP earned
          if (updatePoseMastery) {
            updatePoseMastery(selectedPoseId, score);
          }
        }
        
        // Notify parent if callback provided
        if (onAnalysisComplete) {
          onAnalysisComplete(analysisWithScore);
        }
        
        toast({
          title: "Analysis complete",
          description: "Your yoga pose has been analyzed successfully!",
          variant: "default"
        });
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error('Error analyzing pose:', error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your pose. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysis(null);
    setRewardEarned(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Function to render mastery stars
  const MasteryStars = ({ level }: { level: number }) => {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star 
            key={index} 
            size={14} 
            className={index < level ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  // Render loading state for poses
  if (isLoadingPoses) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>YogaVision</CardTitle>
          <CardDescription>Loading available yoga poses...</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Please wait while we load available poses</p>
        </CardContent>
      </Card>
    );
  }
  
  // Filter poses based on what user has unlocked
  // Use optional chaining to safely call isPoseUnlocked
  const availablePoses = referencePoses.filter(pose => 
    isPoseUnlocked?.(pose.id) || true // Default to showing all poses if function is undefined
  );
  
  const lockedPoses = referencePoses.filter(pose => 
    isPoseUnlocked ? !isPoseUnlocked(pose.id) : false // Default to no locked poses if function is undefined
  );

  // Get selected pose if available
  const selectedPose = getPoseById(selectedPoseId);
  const currentReferencePose = referencePoses.find(pose => pose.id === selectedPoseId);
  // Safely access user pose achievements, checking if the property exists
  const userPoseAchievement = userProgress?.poseAchievements?.[selectedPoseId];

  return (
    <div className={`space-y-3 ${compactMode ? 'pt-1' : 'space-y-6'}`}>
      <Card className="w-full border-0 shadow-none rounded-xl">
        <CardHeader className={compactMode ? 'px-4 py-2.5' : ''}>
          <CardTitle className={compactMode ? 'text-lg' : ''}>
            {compactMode ? 'YogaVision Analysis' : 'YogaVision'}
          </CardTitle>
          <CardDescription className={compactMode ? 'text-xs' : ''}>
            {compactMode 
              ? 'Get AI feedback on your yoga pose practice' 
              : 'Upload a photo of yourself practicing a yoga pose and get AI-powered form feedback'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className={compactMode ? 'px-4 pt-0 pb-3' : ''}>
          <div className={`${compactMode ? 'space-y-3' : 'space-y-4'}`}>
            {/* Step 1: Select a pose */}
            <div>
              <h3 className="font-medium text-sm flex items-center mb-2">
                <Badge variant="outline" className="mr-2">Step 1</Badge>
                Select the pose you're practicing
              </h3>
              
              {availablePoses.length > 0 ? (
                <div className={`grid ${compactMode ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-2`}>
                  {availablePoses.map((pose) => {
                    const achievement = userProgress?.poseAchievements?.[pose.id];
                    
                    return (
                      <Button
                        key={pose.id}
                        variant={selectedPoseId === pose.id ? "default" : "outline"}
                        className={`justify-start h-auto ${compactMode ? 'py-1 px-2 text-xs' : 'py-2'} text-left`}
                        onClick={() => handlePoseSelect(pose.id)}
                      >
                        <div className="flex flex-col items-start w-full">
                          <div className="flex items-center w-full justify-between">
                            <div className="flex items-center truncate">
                              {selectedPoseId === pose.id && (
                                <CheckCircle2 className={`${compactMode ? 'h-3 w-3' : 'h-4 w-4'} mr-1 flex-shrink-0`} />
                              )}
                              <span className="truncate">{pose.name}</span>
                            </div>
                            <Badge variant="secondary" className={`ml-1 ${compactMode ? 'text-[10px] px-1' : 'text-xs'}`}>
                              {pose.difficulty}
                            </Badge>
                          </div>
                          
                          {achievement && achievement.masteryLevel > 0 && (
                            <div className="mt-1 w-full">
                              <MasteryStars level={achievement.masteryLevel} />
                            </div>
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No poses available yet. Complete beginner poses to unlock more.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Locked poses */}
              {lockedPoses.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Locked Poses</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {lockedPoses.slice(0, 3).map((pose) => (
                      <Button
                        key={pose.id}
                        variant="outline"
                        className="justify-start h-auto py-2 text-left opacity-70"
                        disabled
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        <div>
                          <span className="flex">{pose.name}</span>
                          <span className="text-xs">Advance to unlock</span>
                        </div>
                      </Button>
                    ))}
                    
                    {lockedPoses.length > 3 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        +{lockedPoses.length - 3} more locked poses
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Step 2: Upload image or use camera */}
            <div>
              <h3 className="font-medium text-sm flex items-center mb-2">
                <Badge variant="outline" className="mr-2">Step 2</Badge>
                {useCameraMode ? "Take a photo with your camera" : "Upload a photo of your pose"}
              </h3>
              
              <div className="mb-2 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleCameraMode}
                  className={`rounded-full text-xs px-3 ${compactMode ? 'h-7' : 'h-8'} bg-secondary/20 hover:bg-secondary/30 text-secondary-foreground`}
                >
                  {useCameraMode ? 
                    <><Upload className="h-3 w-3 mr-1.5" /> <span className="whitespace-nowrap">Use photos</span></> : 
                    <><Camera className="h-3 w-3 mr-1.5" /> <span className="whitespace-nowrap">Use camera</span></>
                  }
                </Button>
              </div>
              
              {/* Reference example button - visible when a pose is selected */}
              {selectedPoseId && (
                <div className="mb-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowReferenceExample(!showReferenceExample)}
                    className={`text-xs w-full ${compactMode ? 'h-7' : 'h-8'} rounded-full bg-secondary/10 hover:bg-secondary/20 text-secondary-foreground`}
                  >
                    {showReferenceExample ? "Hide reference example" : "Show reference example"}
                  </Button>
                  
                  {/* Reference example image */}
                  {showReferenceExample && selectedPose && selectedPose.imageUrl && (
                    <div className="mt-2 p-3 bg-secondary/20 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Reference Example</h4>
                      <div className="aspect-video w-full max-w-md mx-auto overflow-hidden rounded-md bg-secondary/20">
                        <img 
                          src={selectedPose.imageUrl} 
                          alt={`${selectedPose.name} reference`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Study this reference image to understand proper alignment for {selectedPose.name}
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              <div className={`flex flex-col items-center justify-center border border-dashed rounded-lg ${compactMode ? 'p-2 mb-2 border-gray-200' : 'p-6 mb-4 border-2'}`}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileSelect} 
                  className="hidden" 
                  ref={fileInputRef}
                />
                
                {useCameraMode ? (
                  // Camera mode
                  !imagePreview ? (
                    <div className="w-full">
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{
                          facingMode: "user",
                          aspectRatio: 4/3,
                          width: { ideal: 640 },
                          height: { ideal: 480 }
                        }}
                        className={`w-full rounded-md mx-auto ${compactMode ? 'mb-2 object-cover' : 'mb-4'}`}
                        style={{ 
                          maxWidth: "100%", 
                          height: compactMode ? "auto" : "auto",
                          maxHeight: compactMode ? "50vh" : "60vh",
                          aspectRatio: "4/3"
                        }}
                      />
                      <div className="flex gap-2 justify-center">
                        <Button 
                          onClick={handleWebcamCapture} 
                          variant="default"
                          size={compactMode ? "sm" : "default"}
                          className={`${compactMode ? 'h-7 text-xs' : ''} rounded-full px-4 bg-primary/90 hover:bg-primary shadow-sm`}
                        >
                          <Camera className={`${compactMode ? 'h-3 w-3' : 'h-4 w-4'} mr-1.5`} />
                          Capture Photo
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Show captured image
                    <div className="text-center w-full">
                      <div className="relative w-full mx-auto mb-2">
                        <img 
                          src={imagePreview} 
                          alt="Yoga pose capture" 
                          className="w-full object-contain rounded-md"
                          style={{ 
                            maxWidth: "100%", 
                            maxHeight: compactMode ? "50vh" : "60vh",
                            aspectRatio: "4/3"
                          }}
                        />
                      </div>
                      <div className="flex gap-2 justify-center">
                        <Button 
                          onClick={() => handleReset()} 
                          variant="ghost" 
                          size="sm"
                          className={`${compactMode ? 'h-8 text-xs' : ''} rounded-full px-4 bg-secondary/20 hover:bg-secondary/30 text-secondary-foreground`}
                        >
                          <Camera className={`${compactMode ? 'h-3 w-3' : 'h-4 w-4'} mr-1.5`} />
                          Retake
                        </Button>
                        <Button 
                          onClick={handleReset} 
                          variant="ghost" 
                          size="sm"
                          className={`${compactMode ? 'h-8 text-xs' : ''} rounded-full px-4 bg-destructive/10 hover:bg-destructive/20 text-destructive`}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  )
                ) : (
                  // File upload mode
                  !imagePreview ? (
                    <div className="text-center">
                      <Camera className={`mx-auto ${compactMode ? 'h-8 w-8 mb-1' : 'h-10 w-10 mb-2'} text-gray-400`} />
                      <p className={`${compactMode ? 'text-xs' : 'text-sm'} text-muted-foreground mb-2`}>No image selected</p>
                      <div className="flex gap-2 justify-center">
                        <Button 
                          onClick={handleCameraClick} 
                          variant="ghost"
                          size={compactMode ? "sm" : "default"}
                          className={`${compactMode ? 'h-7 text-xs' : ''} rounded-full px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-sm`}
                        >
                          <Upload className={`${compactMode ? 'h-3 w-3' : 'h-4 w-4'} mr-1.5`} />
                          Upload Image
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center w-full">
                      <div className="relative w-full mx-auto mb-2">
                        <img 
                          src={imagePreview} 
                          alt="Yoga pose preview" 
                          className="w-full object-contain rounded-md"
                          style={{ 
                            maxWidth: "100%", 
                            maxHeight: compactMode ? "50vh" : "60vh",
                            aspectRatio: "4/3"
                          }}
                        />
                      </div>
                      <div className="flex gap-2 justify-center">
                        <Button 
                          onClick={handleCameraClick} 
                          variant="ghost" 
                          size="sm"
                          className={`${compactMode ? 'h-8 text-xs' : ''} rounded-full px-4 bg-secondary/20 hover:bg-secondary/30 text-secondary-foreground`}
                        >
                          <Upload className={`${compactMode ? 'h-3 w-3' : 'h-4 w-4'} mr-1.5`} />
                          Change Image
                        </Button>
                        <Button 
                          onClick={handleReset} 
                          variant="ghost" 
                          size="sm"
                          className={`${compactMode ? 'h-8 text-xs' : ''} rounded-full px-4 bg-destructive/10 hover:bg-destructive/20 text-destructive`}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
            
            {/* Selected Pose Information */}
            {selectedPose && (
              <div className="bg-secondary/20 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{selectedPose.name}</h3>
                    {selectedPose.sanskritName && (
                      <div className="text-xs text-muted-foreground italic">{selectedPose.sanskritName}</div>
                    )}
                  </div>
                  <Badge className={
                    selectedPose.difficulty === "beginner" ? "bg-green-100 text-green-800" :
                    selectedPose.difficulty === "intermediate" ? "bg-yellow-100 text-yellow-800" :
                    selectedPose.difficulty === "advanced" ? "bg-orange-100 text-orange-800" :
                    "bg-red-100 text-red-800"
                  }>
                    {selectedPose.difficulty}
                  </Badge>
                </div>
                
                <p className="text-sm">{selectedPose.description}</p>
                
                {userPoseAchievement && (
                  <div className="flex items-center justify-between bg-background/80 rounded p-2 text-sm">
                    <div className="flex items-center">
                      <Trophy size={14} className="mr-1 text-yellow-500" />
                      <span>Your mastery:</span>
                    </div>
                    <MasteryStars level={userPoseAchievement.masteryLevel} />
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Benefits:</h4>
                  <ul className="text-sm list-disc list-inside">
                    {selectedPose.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
                
                {/* Prerequisites if any */}
                {selectedPose.prerequisites && selectedPose.prerequisites.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Prerequisites:</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedPose.prerequisites.map(prereqId => {
                        const prereqPose = getPoseById(prereqId);
                        if (!prereqPose) return null;
                        
                        const prereqAchievement = userProgress?.poseAchievements?.[prereqId];
                        const isCompleted = prereqAchievement && prereqAchievement.masteryLevel >= 3;
                        
                        return (
                          <Badge 
                            key={prereqId}
                            variant="outline"
                            className={isCompleted ? "border-green-500 text-green-700" : ""}
                          >
                            {isCompleted && <CheckCircle2 size={10} className="mr-1" />}
                            {prereqPose.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className={`flex justify-between ${compactMode ? 'px-4 py-3' : ''} border-t border-gray-50`}>
          {onClose ? (
            <Button 
              variant="ghost" 
              onClick={onClose}
              size={compactMode ? "sm" : "default"}
              className={`${compactMode ? 'h-7 text-xs' : ''} rounded-full px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-sm`}
            >
              Back
            </Button>
          ) : (
            <Button
              variant="ghost"
              disabled={isAnalyzing}
              onClick={handleReset}
              size={compactMode ? "sm" : "default"}
              className={`${compactMode ? 'h-7 text-xs' : ''} rounded-full px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-sm`}
            >
              Reset
            </Button>
          )}
          <Button
            onClick={handleSubmitForAnalysis}
            disabled={!selectedImage || !selectedPoseId || isAnalyzing}
            className={`flex items-center ${compactMode ? "h-7 text-xs" : ""} rounded-full px-4 bg-primary/90 hover:bg-primary shadow-sm`}
            size={compactMode ? "sm" : "default"}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className={`${compactMode ? 'h-3 w-3' : 'h-4 w-4'} mr-1.5 animate-spin`} />
                Analyzing...
              </>
            ) : (
              <>
                Analyze Pose
                <ArrowRight className={`${compactMode ? 'h-3 w-3' : 'h-4 w-4'} ml-1.5`} />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Analysis results */}
      {analysis && (
        <Card className={`w-full ${compactMode ? 'border-0 shadow-none' : ''}`}>
          <CardHeader className={compactMode ? 'px-4 py-3' : ''}>
            <CardTitle className={compactMode ? 'text-lg' : ''}>YogaVision Analysis</CardTitle>
            <CardDescription>
              AI-powered feedback on your {selectedPose?.name} pose
            </CardDescription>
          </CardHeader>
          <CardContent className={`${compactMode ? 'px-4 pt-0' : ''} space-y-4`}>
            {/* XP Reward */}
            {rewardEarned && (
              <Alert className={`bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 ${compactMode ? 'p-3' : ''}`}>
                <div className="flex items-center">
                  <Award className={`${compactMode ? 'h-4 w-4' : 'h-5 w-5'} text-purple-500 mr-2`} />
                  <div>
                    <AlertTitle className={`text-purple-700 ${compactMode ? 'text-sm mb-0' : ''}`}>Achievement Unlocked!</AlertTitle>
                    <AlertDescription className={`text-purple-600 ${compactMode ? 'text-xs' : ''}`}>
                      <p>You earned {rewardEarned.xp} XP points for your {selectedPose?.name} pose!</p>
                      <div className={compactMode ? 'mt-0.5 flex items-center gap-2' : 'mt-1'}>
                        <span className="font-medium">New mastery level: </span>
                        <MasteryStars level={rewardEarned.newMasteryLevel} />
                      </div>
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            )}
            
            {/* Overall assessment */}
            <div>
              <h3 className={`font-medium ${compactMode ? 'text-sm' : 'text-base'} mb-2`}>Overall Assessment</h3>
              <p className={compactMode ? 'text-xs' : 'text-sm'}>{analysis.overallAssessment}</p>
              
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Form Accuracy</span>
                  <span>{analysis.score ? `${analysis.score}%` : 'N/A'}</span>
                </div>
                <Progress value={analysis.score || 0} className="h-1.5" />
              </div>
            </div>
            
            <Separator className={compactMode ? 'my-2' : ''} />
            
            {/* What you're doing well */}
            <div>
              <h3 className={`font-medium ${compactMode ? 'text-sm' : 'text-base'} mb-2 flex items-center`}>
                <ThumbsUp className={`${compactMode ? 'h-3 w-3' : 'h-4 w-4'} mr-2 text-green-500`} />
                What You're Doing Well
              </h3>
              <ul className="space-y-1">
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className={`${compactMode ? 'text-xs' : 'text-sm'} flex items-start`}>
                    <CheckCircle2 className={`${compactMode ? 'h-3 w-3' : 'h-4 w-4'} mr-2 text-green-500 flex-shrink-0 mt-0.5`} />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Areas for improvement */}
            <div>
              <h3 className={`font-medium ${compactMode ? 'text-sm' : 'text-base'} mb-2 flex items-center`}>
                <MoveRight className={`${compactMode ? 'h-3 w-3' : 'h-4 w-4'} mr-2 text-amber-500`} />
                Areas for Improvement
              </h3>
              <ul className="space-y-1">
                {analysis.improvements.map((improvement, index) => (
                  <li key={index} className={`${compactMode ? 'text-xs' : 'text-sm'} flex items-start`}>
                    <ArrowRight className={`${compactMode ? 'h-3 w-3' : 'h-4 w-4'} mr-2 text-amber-500 flex-shrink-0 mt-0.5`} />
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Safety notes */}
            {analysis.safetyNotes && (
              <div>
                <h3 className={`font-medium ${compactMode ? 'text-sm' : 'text-base'} mb-2 flex items-center`}>
                  <AlertTriangle className={`${compactMode ? 'h-3 w-3' : 'h-4 w-4'} mr-2 text-orange-500`} />
                  Safety Considerations
                </h3>
                <p className={compactMode ? 'text-xs' : 'text-sm'}>{analysis.safetyNotes}</p>
              </div>
            )}
            
            {/* Alignment tips */}
            <div>
              <h3 className={`font-medium ${compactMode ? 'text-sm' : 'text-base'} mb-2 flex items-center`}>
                <Info className={`${compactMode ? 'h-3 w-3' : 'h-4 w-4'} mr-2 text-blue-500`} />
                Key Alignment Tips
              </h3>
              <p className={compactMode ? 'text-xs' : 'text-sm'}>{analysis.alignmentTips}</p>
            </div>
            
            <Alert variant="default" className={`${compactMode ? 'mt-2 p-3' : 'mt-4'} bg-secondary/30`}>
              <AlertCircle className={`${compactMode ? 'h-3 w-3' : 'h-4 w-4'}`} />
              <AlertTitle className={`${compactMode ? 'text-xs font-medium mb-0' : 'text-sm font-medium'}`}>Difficulty Assessment</AlertTitle>
              <AlertDescription className={compactMode ? 'text-[11px]' : 'text-xs'}>
                {analysis.difficultyAssessment}
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className={`flex justify-between ${compactMode ? 'px-4 py-3' : ''} border-t border-gray-50`}>
            <Button
              variant="ghost"
              onClick={handleReset}
              size={compactMode ? "sm" : "default"}
              className={`${compactMode ? 'h-7 text-xs' : ''} rounded-full px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-sm`}
            >
              Try Another Pose
            </Button>
            <Button
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
              size={compactMode ? "sm" : "default"}
              className={`flex items-center ${compactMode ? "h-7 text-xs" : ""} rounded-full px-4 bg-primary/90 hover:bg-primary shadow-sm`}
            >
              <Camera className={`${compactMode ? 'h-3 w-3' : 'h-4 w-4'} mr-1.5`} />
              Retake Photo
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}