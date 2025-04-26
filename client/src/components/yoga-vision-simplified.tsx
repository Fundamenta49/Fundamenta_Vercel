import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useYogaProgression } from '../contexts/yoga-progression-context';
import { getPoseById } from '../data/yoga-poses-progression';
import { getYogaPoseThumbnail, getYogaPoseVideoInfo } from '../lib/yoga-pose-thumbnails';
import Webcam from 'react-webcam';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Camera,
  Upload,
  ArrowRight,
  Loader2,
} from "lucide-react";
import AiFeedbackOverlay from './ai-feedback-overlay';

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

interface YogaVisionSimplifiedProps {
  poseId: string;  // The specific pose ID that the user clicked on
  onClose?: () => void;
}

export default function YogaVisionSimplified({ 
  poseId, 
  onClose
}: YogaVisionSimplifiedProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<PoseAnalysis | null>(null);
  const [rewardEarned, setRewardEarned] = useState<{xp: number, newMasteryLevel: number} | null>(null);
  const [useCameraMode, setUseCameraMode] = useState<boolean>(true);
  const [showAnalysisOverlay, setShowAnalysisOverlay] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const { toast } = useToast();
  
  // Get progression context
  const {
    userProgress,
    updatePoseMastery,
  } = useYogaProgression();

  // Get the selected pose data
  const selectedPose = getPoseById(poseId);
  
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
    
    if (!selectedPose) {
      toast({
        title: "Invalid pose",
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
    formData.append('poseName', selectedPose.name);
    
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
        const currentAchievement = userProgress?.poseAchievements?.[poseId];
        const currentMasteryLevel = currentAchievement?.masteryLevel || 0;
        
        // Calculate XP earned based on improvement
        let xpEarned = 0;
        if (masteryLevel > currentMasteryLevel) {
          // Get pose XP value
          const poseXpValue = selectedPose.xpValue || 10;
          // Award XP for each level improved
          xpEarned = poseXpValue * (masteryLevel - currentMasteryLevel);
          
          // Set reward data for display
          setRewardEarned({
            xp: xpEarned,
            newMasteryLevel: masteryLevel
          });
          
          // Update user progression
          if (updatePoseMastery) {
            updatePoseMastery(poseId, score);
          }
        } else {
          // Still update the attempt, but no XP earned
          if (updatePoseMastery) {
            updatePoseMastery(poseId, score);
          }
        }
        
        toast({
          title: "Analysis complete",
          description: "Your yoga pose has been analyzed successfully!",
          variant: "default"
        });
        
        // Show the overlay with results
        setShowAnalysisOverlay(true);
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
  
  // Close the analysis overlay
  const handleCloseAnalysis = () => {
    setShowAnalysisOverlay(false);
  };

  return (
    <div className="space-y-3">
      <Card className="w-full border-0 shadow-none rounded-xl">
        <CardContent className="px-4 pt-2 pb-2">
          <div className="space-y-2">
            {/* Reference Image - Using thumbnails from video */}
            <div>
              <h3 className="text-sm font-medium mb-2">Practice {selectedPose?.name || "Yoga"}</h3>
              <div className="bg-white rounded-lg overflow-hidden border border-gray-100">
                <img 
                  src={getYogaPoseThumbnail(poseId) || `https://img.youtube.com/vi/hQN6j3UxIQ0/mqdefault.jpg`}
                  alt={`${selectedPose?.name || 'Yoga pose'} reference`}
                  className="w-full object-cover rounded-md"
                  style={{ aspectRatio: "16/9" }}
                  onError={(e) => {
                    const videoInfo = getYogaPoseVideoInfo(poseId);
                    if (videoInfo?.videoId) {
                      e.currentTarget.src = `https://img.youtube.com/vi/${videoInfo.videoId}/hqdefault.jpg`;
                    } else {
                      e.currentTarget.src = `https://img.youtube.com/vi/hQN6j3UxIQ0/hqdefault.jpg`;
                    }
                  }}
                />
              </div>
            </div>
            
            {/* Camera Toggle */}
            <div className="flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleCameraMode}
                className="rounded-full text-xs px-4 h-8 bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                {useCameraMode ? 
                  <><Upload className="h-3 w-3 mr-1.5" /> <span className="whitespace-nowrap">Use photos</span></> : 
                  <><Camera className="h-3 w-3 mr-1.5" /> <span className="whitespace-nowrap">Use camera</span></>
                }
              </Button>
            </div>
            
            {/* Photo Capture Area */}
            <div className="flex flex-col items-center justify-center border border-dashed rounded-lg p-2 mb-2 border-gray-200">
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
                      className="w-full rounded-md mx-auto mb-2 object-cover"
                      style={{ 
                        maxWidth: "100%", 
                        height: "auto",
                        maxHeight: "40vh",
                        aspectRatio: "4/3"
                      }}
                    />
                    <div className="flex gap-2 justify-center">
                      <Button 
                        onClick={handleWebcamCapture} 
                        variant="default"
                        size="sm"
                        className="h-8 text-xs rounded-full px-4 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                      >
                        <Camera className="h-3 w-3 mr-1.5" />
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
                          maxHeight: "40vh",
                          aspectRatio: "4/3"
                        }}
                      />
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button 
                        onClick={() => handleReset()} 
                        variant="ghost" 
                        size="sm"
                        className="h-8 text-xs rounded-full px-4 bg-gray-200 hover:bg-gray-300 text-gray-800"
                      >
                        <Camera className="h-3 w-3 mr-1.5" />
                        Retake
                      </Button>
                    </div>
                  </div>
                )
              ) : (
                // File upload mode
                !imagePreview ? (
                  <div className="text-center">
                    <Camera className="mx-auto h-8 w-8 mb-1 text-gray-400" />
                    <p className="text-xs text-muted-foreground mb-2">No image selected</p>
                    <div className="flex gap-2 justify-center">
                      <Button 
                        onClick={handleCameraClick} 
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs rounded-full px-4 bg-gray-200 hover:bg-gray-300 text-gray-800"
                      >
                        <Upload className="h-3 w-3 mr-1.5" />
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
                          maxHeight: "40vh",
                          aspectRatio: "4/3"
                        }}
                      />
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button 
                        onClick={handleCameraClick} 
                        variant="ghost" 
                        size="sm"
                        className="h-8 text-xs rounded-full px-4 bg-gray-200 hover:bg-gray-300 text-gray-800"
                      >
                        <Upload className="h-3 w-3 mr-1.5" />
                        Change Image
                      </Button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between px-4 py-3 border-t border-gray-50">
          {onClose && (
            <Button 
              variant="ghost" 
              onClick={onClose}
              size="sm"
              className="h-8 text-xs rounded-full px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-sm"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleSubmitForAnalysis}
            disabled={!selectedImage || isAnalyzing}
            className="flex items-center h-8 text-xs rounded-full px-4 bg-blue-600 hover:bg-blue-700 text-white shadow-sm ml-auto"
            size="sm"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Analyze Pose
                <ArrowRight className="h-3 w-3 ml-1.5" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Analysis results as overlay */}
      {analysis && showAnalysisOverlay && (
        <AiFeedbackOverlay
          analysis={analysis}
          poseName={selectedPose?.name || ""}
          onClose={handleCloseAnalysis}
          rewardEarned={rewardEarned}
        />
      )}
    </div>
  );
}