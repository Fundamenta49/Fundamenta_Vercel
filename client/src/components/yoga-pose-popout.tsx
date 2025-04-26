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
import { ArrowRight, Camera, Info, Book, Award, Youtube } from 'lucide-react';
import YogaVisionEnhanced from './yoga-vision-enhanced';
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
          className={`cursor-pointer hover:border-primary transition-all duration-200 ${!unlocked ? 'opacity-60' : ''}`}
        >
          <CardContent className="p-4 flex flex-col items-center">
            <div className="w-full h-32 rounded-md overflow-hidden mb-3 bg-muted flex items-center justify-center">
              {isLoadingImage ? (
                <div className="animate-pulse flex items-center justify-center w-full h-full">
                  <span className="text-xs text-muted-foreground">Loading pose image...</span>
                </div>
              ) : (
                <div className="w-full h-full relative overflow-hidden group cursor-pointer"
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
                  {pose.id && getYogaPoseVideoInfo(pose.id) && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center">
                      <Youtube className="w-3 h-3 mr-1" />
                      <span>{getYogaPoseVideoInfo(pose.id)?.title.split('(')[0] || 'Demo Video'}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-black/70 rounded-full p-2">
                      <Youtube className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <h3 className="font-medium text-center text-base">{pose.name}</h3>
            <p className="text-xs text-muted-foreground text-center italic">{pose.sanskritName}</p>
            
            <div className="flex items-center justify-between w-full mt-2">
              <Badge variant="outline" className="text-xs">
                {pose.difficulty}
              </Badge>
              {achievement && achievement.masteryLevel > 0 && (
                <div className="flex items-center">
                  {renderMasteryStars(achievement.masteryLevel)}
                </div>
              )}
            </div>
            
            {!unlocked && (
              <Badge variant="destructive" className="mt-2">
                Locked
              </Badge>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-3 w-full" 
              disabled={!unlocked}
            >
              <span>Practice</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto mx-auto">
        <DialogHeader className="pb-2 border-b">
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className="flex items-center text-xl font-semibold">
                {pose.name}
                <Badge variant="outline" className="ml-2 text-xs">
                  {pose.difficulty}
                </Badge>
              </DialogTitle>
              <DialogDescription className="italic text-gray-500 mt-1">
                {pose.sanskritName}
              </DialogDescription>
            </div>
            {/* Button to close the dialog */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClose} 
              className="rounded-full h-8 w-8 p-0"
              aria-label="Close"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </Button>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-3 mb-6 w-auto inline-flex mx-auto rounded-full p-1 bg-secondary/30">
            <TabsTrigger value="info" className="flex items-center px-6 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Info className="h-4 w-4 mr-2" />
              Info
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center px-6 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Camera className="h-4 w-4 mr-2" />
              Practice
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center px-6 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Youtube className="h-4 w-4 mr-2" />
              Video
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="min-h-[300px]">
            <div className="grid grid-cols-1 gap-8">
              <div className="w-full max-w-screen-md mx-auto">
                <div className="aspect-video rounded-lg overflow-hidden mb-6 bg-gray-50 flex items-center justify-center shadow-sm">
                  {isLoadingImage ? (
                    <div className="animate-pulse flex items-center justify-center w-full h-full">
                      <span className="text-sm text-muted-foreground">Loading pose image...</span>
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
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/60 rounded-full p-4">
                          <Youtube className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 bg-black/60 text-white px-3 py-2 rounded">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{pose.name}</h3>
                          <div className="flex items-center">
                            <Badge variant="outline" className="text-xs bg-white/20 border-none text-white">
                              {pose.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-gray-200 mt-1">Child's Pose</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-gray-800">Description</h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed whitespace-pre-line">
                      {pose.description || "A restful pose that gently stretches the back and promotes relaxation."}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-gray-800">Benefits</h3>
                    <ul className="text-sm text-gray-600 space-y-2">
                      {pose.benefits && pose.benefits.length > 0 ? 
                        pose.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <div className="mr-2 mt-1 text-primary">•</div>
                            <span>{benefit}</span>
                          </li>
                        )) : 
                        <>
                          <li className="flex items-start">
                            <div className="mr-2 mt-1 text-primary">•</div>
                            <span>Releases tension in back, shoulders, and chest</span>
                          </li>
                          <li className="flex items-start">
                            <div className="mr-2 mt-1 text-primary">•</div>
                            <span>Calms the mind and reduces stress</span>
                          </li>
                          <li className="flex items-start">
                            <div className="mr-2 mt-1 text-primary">•</div>
                            <span>Gently stretches hips, thighs, and ankles</span>
                          </li>
                          <li className="flex items-start">
                            <div className="mr-2 mt-1 text-primary">•</div>
                            <span>Relieves back and neck pain</span>
                          </li>
                        </>
                      }
                    </ul>
                  </div>
                </div>
                
                {achievement && achievement.masteryLevel > 0 && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <h3 className="text-lg font-medium mb-3 text-gray-800">Your Progress</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Mastery Level:</span>
                      <div className="flex items-center">
                        {renderMasteryStars(achievement.masteryLevel)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Best Score:</span>
                      <span className="font-medium">{achievement.bestScore}%</span>
                    </div>
                    {achievement.lastPracticedDate && (
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm">Last Practiced:</span>
                        <span className="text-sm text-muted-foreground">{achievement.lastPracticedDate}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="video" className="min-h-[400px]">
            {currentVideoId ? (
              <div className="w-full max-w-screen-md mx-auto">
                <div className="aspect-video w-full rounded-lg overflow-hidden shadow-sm mb-4">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                
                <div className="px-2">
                  <h3 className="text-lg font-medium mb-2">{getYogaPoseVideoInfo(pose.id)?.title || pose.name + " Tutorial"}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Watch this guided tutorial to learn the proper technique and alignment for {pose.name}.
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-screen-md mx-auto">
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg p-8 border border-gray-100">
                  <div className="bg-gray-100 rounded-full p-6 mb-6">
                    <Youtube className="h-16 w-16 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-2 text-gray-800">Video Tutorial</h3>
                  <p className="text-center text-gray-600 max-w-md mb-6">
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
                      className="bg-red-600 hover:bg-red-700 text-white border-none rounded-full px-5 py-2"
                    >
                      <Youtube className="mr-2 h-4 w-4" />
                      Watch Tutorial
                    </Button>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="practice" className="min-h-[400px]">
            <div className="w-full mx-auto">
              <div className="bg-background rounded-lg mb-4">
                <YogaVisionEnhanced 
                  initialPoseId={pose.id} 
                  onClose={handleClose}
                  compactMode={true}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex-wrap gap-3 pt-4 border-t mt-4">
          <div className="w-full flex justify-between items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClose}
              className="rounded-full px-4"
            >
              Close
            </Button>
            
            <div className="flex gap-2">
              {activeTab !== "video" && pose.id && getYogaPoseVideoInfo(pose.id) && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    const videoInfo = getYogaPoseVideoInfo(pose.id);
                    if (videoInfo) {
                      setCurrentVideoId(videoInfo.videoId);
                      setActiveTab("video");
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white border-none rounded-full px-4 h-9"
                >
                  <Youtube className="mr-1.5 h-4 w-4" />
                  <span className="whitespace-nowrap">Watch Video</span>
                </Button>
              )}
              
              {activeTab !== "practice" && (
                <Button 
                  onClick={() => setActiveTab("practice")}
                  className="rounded-full px-4 h-9 bg-primary hover:bg-primary/90"
                >
                  <Camera className="mr-1.5 h-4 w-4" />
                  <span className="whitespace-nowrap">Practice Now</span>
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}