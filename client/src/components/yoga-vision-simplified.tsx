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
    <div className="w-full">
      {/* Single streamlined container for image capture */}
      <div className="relative">
        {useCameraMode ? (
          // Camera mode
          !imagePreview ? (
            <div className="w-full pb-2">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  facingMode: "user",
                  aspectRatio: 16/9,
                  width: { ideal: 640 },
                  height: { ideal: 360 }
                }}
                className="w-full rounded-md mx-auto mb-2 object-cover"
                style={{ 
                  maxWidth: "100%", 
                  height: "auto",
                  maxHeight: "260px",
                  aspectRatio: "16/9"
                }}
              />
              {/* Center-positioned capture button */}
              <div className="flex justify-center">
                <Button 
                  onClick={handleWebcamCapture} 
                  variant="default"
                  size="sm"
                  className="h-10 text-sm rounded-full px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Capture Photo
                </Button>
              </div>
            </div>
          ) : (
            // Show captured image
            <div className="w-full pb-2">
              <div className="relative w-full mx-auto">
                <img 
                  src={imagePreview} 
                  alt="Yoga pose capture" 
                  className="w-full object-contain rounded-md"
                  style={{ 
                    maxWidth: "100%", 
                    maxHeight: "300px",
                    aspectRatio: "16/9"
                  }}
                />
                {/* Small retake button overlay */}
                <div className="absolute bottom-2 left-2">
                  <Button 
                    onClick={() => handleReset()}
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs rounded-full px-3 bg-black/40 hover:bg-black/50 text-white"
                  >
                    <Camera className="h-3 w-3 mr-1" />
                    Retake
                  </Button>
                </div>
              </div>
            </div>
          )
        ) : (
          // File upload mode
          !imagePreview ? (
            <div className="flex flex-col items-center justify-center py-5 px-2 bg-gray-50 rounded-lg">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileSelect} 
                className="hidden" 
                ref={fileInputRef}
              />
              <Button 
                onClick={handleCameraClick} 
                variant="default"
                size="sm"
                className="h-10 text-sm rounded-full px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm mb-2"
              >
                <Upload className="h-4 w-4 mr-2" />
                Use Photos
              </Button>
              <p className="text-xs text-muted-foreground">Upload a photo of your pose</p>
            </div>
          ) : (
            <div className="w-full pb-2">
              <div className="relative w-full mx-auto">
                <img 
                  src={imagePreview} 
                  alt="Yoga pose preview" 
                  className="w-full object-contain rounded-md"
                  style={{ 
                    maxWidth: "100%", 
                    maxHeight: "300px",
                    aspectRatio: "16/9"
                  }}
                />
                {/* Small change button overlay */}
                <div className="absolute bottom-2 left-2">
                  <Button 
                    onClick={handleCameraClick}
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs rounded-full px-3 bg-black/40 hover:bg-black/50 text-white"
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    Change
                  </Button>
                </div>
              </div>
            </div>
          )
        )}

        {/* Mode toggle as overlay in top-right */}
        <div className="absolute top-2 right-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleCameraMode}
            className="rounded-full h-7 text-xs px-3 bg-black/40 hover:bg-black/50 text-white"
          >
            {useCameraMode ? 
              <><Upload className="h-3 w-3 mr-1" /> <span className="whitespace-nowrap">Use photos</span></> : 
              <><Camera className="h-3 w-3 mr-1" /> <span className="whitespace-nowrap">Use camera</span></>
            }
          </Button>
        </div>
      </div>

      {/* Action buttons - styled more like the screenshot */}
      <div className="flex justify-between mt-2">
        {onClose && (
          <Button 
            variant="ghost" 
            onClick={onClose}
            size="sm"
            className="h-9 text-sm rounded-full px-5 bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Back
          </Button>
        )}
        <Button
          onClick={handleSubmitForAnalysis}
          disabled={!selectedImage || isAnalyzing}
          className="flex items-center h-9 text-sm rounded-full px-5 bg-blue-600 hover:bg-blue-700 text-white ml-auto"
          size="sm"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              Analyze
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>

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