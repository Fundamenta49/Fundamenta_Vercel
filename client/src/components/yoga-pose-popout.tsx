import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { YogaPoseProgression } from '../../../shared/yoga-progression';
import { ArrowRight, Camera, Info, Book, Award, Youtube, X, CheckCircle2, Lock as LockIcon } from 'lucide-react';
import YogaVisionSimplified from './yoga-vision-simplified';
import axios from 'axios';
import { getYogaPoseWithDefaults } from '../lib/yoga-poses-data';
import posesWithPaths from '../data/poses_with_paths.json';
import { getYogaPoseThumbnail, getYogaPoseVideoInfo } from '../lib/yoga-pose-thumbnails';

interface YogaPosePopoutProps {
  pose: YogaPoseProgression & {
    alternativeImageUrl?: string;
    allImagePaths?: string[];
    possibleImagePaths?: string[];
    level?: number;
    imageUrl?: string;
    category?: string;
  };
  unlocked: boolean;
  achievement?: {
    masteryLevel: number;
    bestScore: number;
    lastPracticedDate?: string;
  };
}

export default function YogaPosePopout({ pose, unlocked, achievement }: YogaPosePopoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [poseImage, setPoseImage] = useState<string | null>(null);
  const [possiblePaths, setPossiblePaths] = useState<string[]>([]);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  // Load pose image with reliable fallbacks
  useEffect(() => {
    const loadPoseImage = () => {
      // Only load if we have a valid pose ID
      if (!pose.id) return;
      
      try {
        setIsLoadingImage(true);
        
        // First, try to use an image URL if it's already present in the pose data
        if (pose.imageUrl) {
          setPoseImage(pose.imageUrl);
          console.log(`Using existing imageUrl for ${pose.id}: ${pose.imageUrl}`);
          setPossiblePaths([pose.imageUrl]);
          setIsLoadingImage(false);
          return;
        }
        
        // Then, try to find the pose in our poses_with_paths.json file
        const poseData = posesWithPaths.find(p => p.id === pose.id);
        
        // Always use the common image that we know exists
        const commonImagePath = '/images/yoga-poses/original_yoga_image.jpg';
        setPoseImage(commonImagePath);
        console.log(`Using common image for ${pose.id}: ${commonImagePath}`);
        
        // Only set the common image path that we know exists
        // Don't try to use any other paths since they don't exist
        setPossiblePaths([commonImagePath]);
        
        // Log for debugging
        if (!poseData) {
          console.warn(`Pose ${pose.id} not found in poses_with_paths.json, using common image`);
        }
      } catch (error) {
        console.error('Error setting pose image path:', error);
        setPoseImage('/images/yoga-poses/original_yoga_image.jpg');
      } finally {
        setIsLoadingImage(false);
      }
    };
    
    loadPoseImage();
  }, [pose.id, pose.imageUrl]);

  const handleClose = () => {
    setIsOpen(false);
  };
  
  // Format a URL to ensure it's valid and has a proper protocol
  const formatImageUrl = (url: string) => {
    if (!url) return '';
    
    // If the URL is a relative path, keep it as is
    if (url.startsWith('/')) {
      return url;
    }
    
    // For external URLs, ensure they have proper protocol
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If no protocol, assume https
    return `https://${url}`;
  };
  
  // Get special CSS class for positioning within the gallery images
  const getPoseClass = (poseId: string): string => {
    // Group poses by level for easier styling
    const levelMapping: Record<string, number> = {
      // Level 1
      'mountain': 1, 'child': 1, 'corpse': 1,
      
      // Level 2
      'downward_dog': 2, 'cat_cow': 2, 'forward_fold': 2,
      
      // Level 3
      'tree': 3, 'warrior_1': 3, 'warrior_2': 3, 
      
      // Level 4
      'triangle': 4, 'chair': 4, 'bridge': 4,
      
      // Level 5
      'half_moon': 5, 'eagle': 5, 'pigeon': 5,
      
      // Level 6
      'crow': 6, 'side_plank': 6, 'boat': 6
    };
    
    // Generate a CSS class based on the pose ID and level
    const level = levelMapping[poseId] || 0;
    if (level > 0) {
      return `pose-level-${level} pose-${poseId}`;
    }
    
    // Default to a standard class
    return 'pose-default';
  };
  
  // Get specific positioning styles for each pose in the gallery
  const getPositionStyle = (poseId: string): React.CSSProperties => {
    // Group poses by level
    const level1Styles: Record<string, React.CSSProperties> = {
      'mountain': { objectPosition: '0% 0%', objectFit: 'cover' },
      'child': { objectPosition: '50% 0%', objectFit: 'cover' },
      'corpse': { objectPosition: '100% 0%', objectFit: 'cover' }
    };
    
    const level2Styles: Record<string, React.CSSProperties> = {
      'downward_dog': { objectPosition: '0% 20%', objectFit: 'cover' },
      'cat_cow': { objectPosition: '50% 20%', objectFit: 'cover' },
      'forward_fold': { objectPosition: '100% 20%', objectFit: 'cover' }
    };
    
    const level3Styles: Record<string, React.CSSProperties> = {
      'tree': { objectPosition: '0% 40%', objectFit: 'cover' },
      'warrior_1': { objectPosition: '50% 40%', objectFit: 'cover' },
      'warrior_2': { objectPosition: '100% 40%', objectFit: 'cover' }
    };
    
    const level4Styles: Record<string, React.CSSProperties> = {
      'triangle': { objectPosition: '0% 60%', objectFit: 'cover' },
      'chair': { objectPosition: '50% 60%', objectFit: 'cover' },
      'bridge': { objectPosition: '100% 60%', objectFit: 'cover' }
    };
    
    const level5Styles: Record<string, React.CSSProperties> = {
      'half_moon': { objectPosition: '0% 80%', objectFit: 'cover' },
      'eagle': { objectPosition: '50% 80%', objectFit: 'cover' },
      'pigeon': { objectPosition: '100% 80%', objectFit: 'cover' }
    };
    
    const level6Styles: Record<string, React.CSSProperties> = {
      'crow': { objectPosition: '0% 100%', objectFit: 'cover' },
      'side_plank': { objectPosition: '50% 100%', objectFit: 'cover' },
      'boat': { objectPosition: '100% 100%', objectFit: 'cover' }
    };
    
    // Return the specific style for the pose if it exists
    if (level1Styles[poseId]) return level1Styles[poseId];
    if (level2Styles[poseId]) return level2Styles[poseId];
    if (level3Styles[poseId]) return level3Styles[poseId];
    if (level4Styles[poseId]) return level4Styles[poseId];
    if (level5Styles[poseId]) return level5Styles[poseId];
    if (level6Styles[poseId]) return level6Styles[poseId];
    
    // Default style
    return { objectFit: 'cover', objectPosition: 'center' };
  };

  // Function to handle showing YouTube video within the existing tab
  const [currentVideoId, setCurrentVideoId] = useState<string | undefined>(undefined);
  
  const openYouTubeVideo = (videoId: string | undefined) => {
    if (!videoId) return;
    setCurrentVideoId(videoId);
    setActiveTab("video"); // Switch to video tab
  };

  // Render mastery stars
  const renderMasteryStars = (level: number) => {
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Award 
            key={i} 
            size={14} 
            className={`${i < level ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card 
          className={`cursor-pointer hover:shadow-md transition-shadow duration-300 border overflow-hidden ${!unlocked ? 'opacity-75' : ''} border-gray-200 rounded-xl shadow-sm`}
        >
          <div className="aspect-square relative bg-gray-50">
            {isLoadingImage ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse w-8 h-8 rounded-full bg-gray-200" />
              </div>
            ) : (
              <div 
                className="w-full h-full relative overflow-hidden group cursor-pointer"
                onClick={() => {
                  const videoInfo = getYogaPoseVideoInfo(pose.id);
                  if (videoInfo) {
                    openYouTubeVideo(videoInfo.videoId);
                  }
                }}
              >
                <img 
                  src={getYogaPoseThumbnail(pose.id)}
                  alt={pose.name} 
                  className="object-cover w-full h-full group-hover:opacity-90 transition-opacity"
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    console.log(`Thumbnail failed to load for ${pose.id}, trying alternative format`);
                    // Try a different YouTube thumbnail format
                    const videoId = getYogaPoseVideoInfo(pose.id)?.videoId;
                    if (videoId) {
                      e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                      
                      // Add a second error handler in case hqdefault also fails
                      e.currentTarget.onerror = () => {
                        console.log(`Alternative thumbnail also failed for ${pose.id}, trying sddefault format`);
                        e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
                        
                        // Final fallback if all YouTube formats fail
                        e.currentTarget.onerror = null;
                      };
                    }
                  }}
                />
                
                {/* Mobile-optimized video indication */}
                {pose.id && getYogaPoseVideoInfo(pose.id) && (
                  <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 bg-black/70 text-white text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded flex items-center">
                    <Youtube className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                    <span className="truncate max-w-[80px] sm:max-w-[120px]">{getYogaPoseVideoInfo(pose.id)?.title.split('(')[0] || 'Video'}</span>
                  </div>
                )}
                
                {/* Play button overlay - more subtle on mobile */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-black/70 rounded-full p-1.5 sm:p-2">
                    <Youtube className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </div>
              </div>
            )}
            
            {!unlocked && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center px-3">
                  <LockIcon className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-0.5 sm:mb-1" />
                  <p className="text-xs sm:text-sm">Complete level {pose.levelRequired - 1} first</p>
                </div>
              </div>
            )}
            
            {achievement && achievement.masteryLevel > 0 && (
              <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                <Badge className="h-4 sm:h-5 px-1 sm:px-1.5 bg-gray-900/70 text-white text-[10px] sm:text-xs">
                  <Award className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                  {achievement.masteryLevel}/5
                </Badge>
              </div>
            )}
          </div>
          
          <CardContent className="p-1.5 sm:p-2">
            <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">{pose.name}</div>
            {pose.sanskritName && (
              <div className="text-[10px] sm:text-xs text-gray-500 italic truncate">{pose.sanskritName}</div>
            )}
            <div className="flex items-center justify-between mt-1">
              <Badge variant="outline" className="text-[10px] sm:text-xs capitalize px-1 sm:px-2 py-0 h-4 sm:h-5 bg-transparent border-gray-200">
                {pose.difficulty}
              </Badge>
              <Button variant="ghost" size="sm" className="h-5 sm:h-7 px-1.5 sm:px-2 text-[10px] sm:text-xs text-gray-700 hover:text-gray-900" disabled={!unlocked}>
                Practice
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      
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
        {/* Header with clean, minimal design - responsive for mobile and desktop */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-6 relative">
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <div className="pr-8 sm:pr-0"> {/* Add padding right on mobile for close button */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                <h2 className="text-lg sm:text-xl font-medium tracking-tight">{pose.name}</h2>
                <Badge variant="outline" className="bg-blue-50 border-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full w-fit sm:ml-1">
                  {pose.difficulty}
                </Badge>
              </div>
              {pose.sanskritName && (
                <p className="text-xs sm:text-sm text-gray-500 italic">
                  {pose.sanskritName}
                </p>
              )}
            </div>
            
            {/* Modern, Apple-style close button - fixed position for all screen sizes */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClose} 
              className="rounded-full h-8 w-8 p-0 absolute top-4 right-4 bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>
        
        {/* Clean, minimal tab navigation - optimized for mobile and desktop */}
        <div className="px-4 sm:px-6 pb-0 h-full">
          <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="mt-0 h-full">
            <TabsList className="grid grid-cols-3 mb-3 sm:mb-4 w-full mx-auto rounded-full p-1 bg-gray-100/70">
              <TabsTrigger value="info" className="flex items-center justify-center px-1.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Info className="h-3 sm:h-3.5 w-3 sm:w-3.5 mr-1 sm:mr-1.5" />
                <span>Info</span>
              </TabsTrigger>
              <TabsTrigger value="practice" className="flex items-center justify-center px-1.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Camera className="h-3 sm:h-3.5 w-3 sm:w-3.5 mr-1 sm:mr-1.5" />
                <span>Practice</span>
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center justify-center px-1.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Youtube className="h-3 sm:h-3.5 w-3 sm:w-3.5 mr-1 sm:mr-1.5" />
                <span>Video</span>
              </TabsTrigger>
            </TabsList>
          
            <TabsContent value="info" className="pt-0 px-0">
              {/* Modern, Apple-style clean layout */}
              <div className="w-full">
                {/* Hero image section with modern styling */}
                <div className="overflow-hidden bg-white mb-4">
                  {isLoadingImage ? (
                    <div className="flex items-center justify-center h-64 bg-gray-50">
                      <div className="animate-pulse flex flex-col items-center">
                        <div className="rounded-full bg-gray-200 h-16 w-16 mb-2 flex items-center justify-center">
                          <Camera className="h-8 w-8 text-gray-400" />
                        </div>
                        <span className="text-sm text-gray-400">Loading image...</span>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="relative aspect-video w-full overflow-hidden cursor-pointer"
                      onClick={() => {
                        const videoInfo = getYogaPoseVideoInfo(pose.id);
                        if (videoInfo) {
                          openYouTubeVideo(videoInfo.videoId);
                        }
                      }}
                    >
                      <img 
                        src={getYogaPoseThumbnail(pose.id)}
                        alt={pose.name} 
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          const videoId = getYogaPoseVideoInfo(pose.id)?.videoId;
                          if (videoId) {
                            e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                            e.currentTarget.onerror = () => {
                              e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
                              e.currentTarget.onerror = null;
                            };
                          }
                        }}
                      />
                      
                      {/* Clean play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-200">
                        <div className="bg-white rounded-full p-3 shadow-lg">
                          <Youtube className="w-6 h-6 text-red-600" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Content section with modern styling - optimized for mobile and desktop */}
                <div className="px-4 sm:px-6">
                  {/* Description card */}
                  <div className="mb-5 sm:mb-6">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1.5 sm:mb-2">Description</h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-gray-600">
                      {pose.description || "A restful pose that gently stretches the back and promotes relaxation."}
                    </p>
                  </div>
                  
                  {/* Benefits card with modern styling - responsive grid on larger screens */}
                  <div className="mb-5 sm:mb-6">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1.5 sm:mb-2">Benefits</h3>
                    <ul className="space-y-1.5 sm:grid sm:grid-cols-2 sm:gap-x-4 sm:gap-y-1.5 sm:space-y-0">
                      {pose.benefits && pose.benefits.length > 0 ? 
                        pose.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start text-xs sm:text-sm">
                            <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 mr-1.5 sm:mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{benefit}</span>
                          </li>
                        )) : 
                        <>
                          <li className="flex items-start text-xs sm:text-sm">
                            <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 mr-1.5 sm:mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">Releases tension in back, shoulders, and chest</span>
                          </li>
                          <li className="flex items-start text-xs sm:text-sm">
                            <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 mr-1.5 sm:mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">Calms the mind and reduces stress</span>
                          </li>
                          <li className="flex items-start text-xs sm:text-sm">
                            <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 mr-1.5 sm:mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">Gently stretches hips, thighs, and ankles</span>
                          </li>
                          <li className="flex items-start text-xs sm:text-sm">
                            <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 mr-1.5 sm:mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">Relieves back and neck pain</span>
                          </li>
                        </>
                      }
                    </ul>
                  </div>
                  
                  {/* Achievement card with modern styling */}
                  {achievement && achievement.masteryLevel > 0 && (
                    <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl">
                      <div className="flex items-center mb-2 sm:mb-3">
                        <Award className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-1.5 sm:mr-2" />
                        <h3 className="text-sm sm:text-base font-medium text-gray-900">Your Progress</h3>
                      </div>
                      
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm text-gray-600">Mastery Level</span>
                          <div className="flex items-center">
                            {renderMasteryStars(achievement.masteryLevel)}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm text-gray-600">Best Score</span>
                          <span className="text-xs sm:text-sm font-medium">{achievement.bestScore}%</span>
                        </div>
                        
                        {achievement.lastPracticedDate && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm text-gray-600">Last Practice</span>
                            <span className="text-xs sm:text-sm text-gray-500">{achievement.lastPracticedDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="video" className="h-auto">
              {currentVideoId ? (
                <div className="w-full max-w-screen-md mx-auto">
                  <div className="aspect-video w-full rounded-lg overflow-hidden shadow-sm mb-3 sm:mb-4">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ width: "calc(100% + 8px)", marginLeft: "-4px", marginRight: "-4px" }}
                    ></iframe>
                  </div>
                  
                  <div className="px-4 sm:px-6">
                    <h3 className="text-sm sm:text-lg font-medium mb-1 sm:mb-2">{getYogaPoseVideoInfo(pose.id)?.title || pose.name + " Tutorial"}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                      Watch this guided tutorial to learn the proper technique and alignment for {pose.name}.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-screen-md mx-auto">
                  <div className="flex flex-col items-center justify-center min-h-[250px] sm:min-h-[350px] bg-gray-50 rounded-lg p-4 sm:p-8 border border-gray-100">
                    <div className="bg-gray-100 rounded-full p-4 sm:p-6 mb-4 sm:mb-6">
                      <Youtube className="h-10 w-10 sm:h-16 sm:w-16 text-gray-400" />
                    </div>
                    <h3 className="text-base sm:text-xl font-medium mb-1 sm:mb-2 text-gray-800">Video Tutorial</h3>
                    <p className="text-center text-xs sm:text-sm text-gray-600 max-w-md mb-4 sm:mb-6 px-2 sm:px-0">
                      Watch a professional demonstration of {pose.name} to learn proper form and technique.
                    </p>
                    {pose.id && getYogaPoseVideoInfo(pose.id) && (
                      <Button 
                        onClick={() => {
                          const videoInfo = getYogaPoseVideoInfo(pose.id);
                          if (videoInfo) {
                            setCurrentVideoId(videoInfo.videoId);
                          }
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white border-none rounded-full px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm"
                      >
                        <Youtube className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        Watch Tutorial
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="practice" className="h-full">
              {/* Using the simplified YogaVision component with direct integration */}
              <YogaVisionSimplified 
                poseId={pose.id} 
                onClose={handleClose}
              />
            </TabsContent>
          </Tabs>
        </div>
        
      </DialogContent>
    </Dialog>
  );
}