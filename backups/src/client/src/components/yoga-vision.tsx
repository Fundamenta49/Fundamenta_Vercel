import React, { useState, useRef } from 'react';
import axios from 'axios';
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
  Loader2
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
}

interface ReferencePose {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  imageUrl: string;
  keyAlignmentPoints: string[];
}

interface YogaVisionProps {
  onAnalysisComplete?: (analysis: PoseAnalysis) => void;
}

export default function YogaVision({ onAnalysisComplete }: YogaVisionProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedPose, setSelectedPose] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<PoseAnalysis | null>(null);
  const [referencePoses, setReferencePoses] = useState<ReferencePose[]>([]);
  const [isLoadingPoses, setIsLoadingPoses] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load reference poses when the component mounts
  React.useEffect(() => {
    loadReferencePoses();
  }, []);

  // Function to load reference poses from the API
  const loadReferencePoses = async () => {
    try {
      setIsLoadingPoses(true);
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
    }
  };

  // Handle camera button click
  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle pose selection
  const handlePoseSelect = (poseName: string) => {
    setSelectedPose(poseName);
    // Clear any previous analysis
    setAnalysis(null);
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
    
    if (!selectedPose) {
      toast({
        title: "No pose selected",
        description: "Please select which yoga pose you're attempting",
        variant: "destructive"
      });
      return;
    }
    
    // Start analysis
    setIsAnalyzing(true);
    
    // Create form data
    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('poseName', selectedPose);
    
    try {
      // Send to API
      const response = await axios.post('/api/yoga/analyze-pose', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success && response.data.poseAnalysis) {
        setAnalysis(response.data.poseAnalysis);
        
        // Notify parent if callback provided
        if (onAnalysisComplete) {
          onAnalysisComplete(response.data.poseAnalysis);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

  // Get reference pose if available
  const currentReferencePose = referencePoses.find(pose => pose.name === selectedPose);

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>YogaVision</CardTitle>
          <CardDescription>
            Upload a photo of yourself practicing a yoga pose and get AI-powered form feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Step 1: Select a pose */}
            <div>
              <h3 className="font-medium text-sm flex items-center mb-2">
                <Badge variant="outline" className="mr-2">Step 1</Badge>
                Select the pose you're practicing
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {referencePoses.map((pose) => (
                  <Button
                    key={pose.id}
                    variant={selectedPose === pose.name ? "default" : "outline"}
                    className="justify-start h-auto py-2 text-left flex items-center"
                    onClick={() => handlePoseSelect(pose.name)}
                  >
                    <div className="flex items-center">
                      {selectedPose === pose.name && (
                        <CheckCircle2 className="h-4 w-4 mr-2 flex-shrink-0" />
                      )}
                      <span>{pose.name}</span>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {pose.difficulty}
                      </Badge>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Step 2: Upload image */}
            <div>
              <h3 className="font-medium text-sm flex items-center mb-2">
                <Badge variant="outline" className="mr-2">Step 2</Badge>
                Upload a photo of your pose
              </h3>
              
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 mb-4">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileSelect} 
                  className="hidden" 
                  ref={fileInputRef}
                />
                
                {!imagePreview ? (
                  <div className="text-center">
                    <Camera className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">No image selected</p>
                    <div className="flex gap-2 justify-center">
                      <Button onClick={handleCameraClick} variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center w-full">
                    <div className="relative aspect-video w-full max-w-md mx-auto mb-4">
                      <img 
                        src={imagePreview} 
                        alt="Yoga pose preview" 
                        className="w-full h-full object-contain rounded-md"
                      />
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button onClick={handleCameraClick} variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Change Image
                      </Button>
                      <Button onClick={handleReset} variant="destructive" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Reference pose information */}
            {currentReferencePose && (
              <Alert className="bg-secondary/30">
                <Info className="h-4 w-4" />
                <AlertTitle className="text-sm font-medium">Reference: {currentReferencePose.name}</AlertTitle>
                <AlertDescription className="text-xs mt-2">
                  <p className="mb-2">{currentReferencePose.description}</p>
                  <div className="mt-2">
                    <strong className="text-xs font-semibold">Key alignment points:</strong>
                    <ul className="text-xs list-disc list-inside mt-1">
                      {currentReferencePose.keyAlignmentPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            disabled={isAnalyzing}
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            onClick={handleSubmitForAnalysis}
            disabled={!selectedImage || !selectedPose || isAnalyzing}
            className="flex items-center"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Analyze Pose
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Analysis results */}
      {analysis && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>YogaVision Analysis</CardTitle>
            <CardDescription>
              AI-powered feedback on your {selectedPose} pose
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Overall assessment */}
            <div>
              <h3 className="font-medium text-base mb-2">Overall Assessment</h3>
              <p className="text-sm">{analysis.overallAssessment}</p>
              
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Analysis Confidence</span>
                  <span>{Math.round(analysis.confidenceScore * 100)}%</span>
                </div>
                <Progress value={analysis.confidenceScore * 100} className="h-1.5" />
              </div>
            </div>
            
            <Separator />
            
            {/* What you're doing well */}
            <div>
              <h3 className="font-medium text-base mb-2 flex items-center">
                <ThumbsUp className="h-4 w-4 mr-2 text-green-500" />
                What You're Doing Well
              </h3>
              <ul className="space-y-1">
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className="text-sm flex items-start">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Areas for improvement */}
            <div>
              <h3 className="font-medium text-base mb-2 flex items-center">
                <MoveRight className="h-4 w-4 mr-2 text-amber-500" />
                Areas for Improvement
              </h3>
              <ul className="space-y-1">
                {analysis.improvements.map((improvement, index) => (
                  <li key={index} className="text-sm flex items-start">
                    <ArrowRight className="h-4 w-4 mr-2 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Safety notes */}
            {analysis.safetyNotes && (
              <div>
                <h3 className="font-medium text-base mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                  Safety Considerations
                </h3>
                <p className="text-sm">{analysis.safetyNotes}</p>
              </div>
            )}
            
            {/* Alignment tips */}
            <div>
              <h3 className="font-medium text-base mb-2 flex items-center">
                <Info className="h-4 w-4 mr-2 text-blue-500" />
                Key Alignment Tips
              </h3>
              <p className="text-sm">{analysis.alignmentTips}</p>
            </div>
            
            <Alert variant="default" className="mt-4 bg-secondary/30">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-sm font-medium">Difficulty Assessment</AlertTitle>
              <AlertDescription className="text-xs">
                {analysis.difficultyAssessment}
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleReset}
            >
              Try Another Pose
            </Button>
            <Button
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
            >
              <Camera className="h-4 w-4 mr-2" />
              Retake Photo
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}