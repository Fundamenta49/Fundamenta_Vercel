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
import { ArrowRight, Camera, Info, Book, Award } from 'lucide-react';
import YogaVisionEnhanced from './yoga-vision-enhanced';
import axios from 'axios';
import { getYogaPoseWithDefaults } from '../lib/yoga-poses-data';
import posesWithPaths from '../data/poses_with_paths.json';

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

  // Get fallback image URL based on pose type/category
  const getFallbackImageUrl = () => {
    // Define the valid categories that we're using in our system
    type YogaCategory = 'standing' | 'balance' | 'resting' | 'forward_bend' | 
                         'backbend' | 'hip_opener' | 'core' | 'arm_balance' | 
                         'foundation' | 'flow';
    
    // Safety check to ensure category is one of our defined types
    const defaultCategory: YogaCategory = 'standing';
    const category: YogaCategory = (pose.category as YogaCategory) || defaultCategory;
    const poseId = pose.id || 'yoga';
    
    // Debug info
    console.log(`Pose ${poseId} fallback info:`, {
      imageUrl: pose.imageUrl,
      category: category
    });
    
    // Try to provide category-specific images
    const categoryImages: Record<YogaCategory, string> = {
      'standing': 'https://images.unsplash.com/photo-1508672019048-805c876b67e2',
      'balance': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
      'resting': 'https://images.unsplash.com/photo-1588286840104-8957b019727f',
      'forward_bend': 'https://images.unsplash.com/photo-1610508500445-a4592435e5d7',
      'backbend': 'https://images.unsplash.com/photo-1556816723-1ce827b9cfca',
      'hip_opener': 'https://images.unsplash.com/photo-1562088287-e716c080a17f',
      'core': 'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6',
      'arm_balance': 'https://images.unsplash.com/photo-1507120410856-1f35574c3b45',
      'foundation': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
      'flow': 'https://images.unsplash.com/photo-1593164842264-854604db2260'
    };
    
    // Create a mapping of pose IDs to specific images for unique poses
    const poseSpecificImages: Record<string, string> = {
      // Level 1-2 Poses
      'mountain': 'https://images.pexels.com/photos/6698513/pexels-photo-6698513.jpeg',
      'child': 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg',
      'corpse': 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg',
      'downward_dog': 'https://images.pexels.com/photos/5384538/pexels-photo-5384538.jpeg',
      'cat_cow': 'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg',
      'forward_fold': 'https://images.pexels.com/photos/6111616/pexels-photo-6111616.jpeg',
      
      // Level 3-4 Poses
      'tree': 'https://images.pexels.com/photos/6453396/pexels-photo-6453396.jpeg',
      'warrior_1': 'https://images.pexels.com/photos/6453398/pexels-photo-6453398.jpeg',
      'warrior_2': 'https://images.pexels.com/photos/4534687/pexels-photo-4534687.jpeg',
      'triangle': 'https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg',
      'chair': 'https://images.pexels.com/photos/3822134/pexels-photo-3822134.jpeg',
      'bridge': 'https://images.pexels.com/photos/3823207/pexels-photo-3823207.jpeg',
      
      // Level 5 Poses
      'half_moon': 'https://images.pexels.com/photos/3823185/pexels-photo-3823185.jpeg',
      'eagle': 'https://images.pexels.com/photos/6957882/pexels-photo-6957882.jpeg',
      'pigeon': 'https://images.pexels.com/photos/3823031/pexels-photo-3823031.jpeg',
      
      // Level 6 Poses
      'crow': 'https://images.pexels.com/photos/6453377/pexels-photo-6453377.jpeg',
      'side_plank': 'https://images.pexels.com/photos/6453406/pexels-photo-6453406.jpeg',
      'boat': 'https://images.pexels.com/photos/4058411/pexels-photo-4058411.jpeg'
    };
    
    // First try to get a pose-specific image
    if (poseId in poseSpecificImages) {
      return poseSpecificImages[poseId];
    }
    
    // Otherwise fall back to category-based image
    if (category in categoryImages) {
      return categoryImages[category];
    }
    
    // Default fallback if all else fails
    return 'https://images.unsplash.com/photo-1545389336-cf090694435e';
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
                <div className="w-full h-full relative overflow-hidden">
                  <img 
                    src="/images/yoga-poses/original_yoga_image.jpg" 
                    alt={pose.name} 
                    className={`object-cover w-full h-full ${getPoseClass(pose.id)}`}
                    onError={(e) => {
                      // If the direct path fails, log and use external fallback
                      console.log(`Image path failed for ${pose.id}, using external fallback`);
                      e.currentTarget.src = `${getFallbackImageUrl()}?auto=format&fit=crop&w=764&q=80`;
                    }}
                    style={getPositionStyle(pose.id)}
                  />
                  {/* Small pose ID label in corner to help identify which part of the image is shown */}
                  <div className="absolute bottom-1 right-1 bg-black/30 text-white text-[8px] px-1 rounded">
                    {pose.id}
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
      
      <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {pose.name}
            <Badge variant="outline" className="ml-2">
              {pose.difficulty}
            </Badge>
          </DialogTitle>
          <DialogDescription className="italic">
            {pose.sanskritName}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="info" className="flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Info
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center">
              <Camera className="h-4 w-4 mr-2" />
              Practice
            </TabsTrigger>
            <TabsTrigger value="learn" className="flex items-center">
              <Book className="h-4 w-4 mr-2" />
              Learn
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="min-h-[300px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm text-gray-600 mb-4">{pose.description}</p>
                
                <h3 className="font-medium mb-2">Benefits</h3>
                <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                  {pose.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <div className="w-full h-48 rounded-md overflow-hidden mb-4 bg-muted flex items-center justify-center">
                  {isLoadingImage ? (
                    <div className="animate-pulse flex items-center justify-center w-full h-full">
                      <span className="text-sm text-muted-foreground">Loading pose image...</span>
                    </div>
                  ) : (
                    <div className="w-full h-full relative overflow-hidden">
                      <img 
                        src={'/images/yoga-poses/original_yoga_image.jpg'} 
                        alt={pose.name} 
                        className={`object-cover w-full h-full ${getPoseClass(pose.id)}`}
                        onError={(e) => {
                          // Simplified error handling - just use the common yoga image
                          console.log(`Dialog image path failed for ${pose.id}, using common image`);
                          e.currentTarget.src = '/images/yoga-poses/original_yoga_image.jpg';
                        }}
                        style={getPositionStyle(pose.id)}
                      />
                      <div className="absolute bottom-2 right-2 bg-black/40 text-white text-xs px-2 py-1 rounded">
                        {pose.difficulty} • {pose.id}
                      </div>
                    </div>
                  )}
                </div>
                
                {achievement && achievement.masteryLevel > 0 && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <h3 className="font-medium mb-2">Your Progress</h3>
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
                
                {pose.prerequisites && pose.prerequisites.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Prerequisites</h3>
                    <p className="text-sm text-gray-600">
                      Master these poses first:
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {pose.prerequisites.map((prereqId) => (
                        <Badge key={prereqId} variant="secondary">
                          {prereqId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="practice" className="min-h-[400px]">
            <YogaVisionEnhanced 
              initialPoseId={pose.id} 
              onClose={handleClose} 
            />
          </TabsContent>
          
          <TabsContent value="learn" className="min-h-[300px]">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Instructions</h3>
                <ol className="text-sm text-gray-600 space-y-2 list-decimal pl-5">
                  <li>Stand tall with feet together or hip-width apart</li>
                  <li>Distribute weight evenly through both feet</li>
                  <li>Engage your thighs and draw your abdominals in</li>
                  <li>Extend your spine and relax your shoulders down</li>
                  <li>Breathe deeply and maintain the posture for 30-60 seconds</li>
                </ol>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Alignment Tips</h3>
                <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                  <li>Keep your shoulders relaxed and away from your ears</li>
                  <li>Maintain a neutral spine position - don't arch or round your back</li>
                  <li>Distribute weight evenly between the balls and heels of your feet</li>
                  <li>Keep a soft gaze at a fixed point in front of you to maintain balance</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Modifications</h3>
                <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                  <li>If you have balance issues, practice near a wall for support</li>
                  <li>For extra challenge, try closing your eyes while in the pose</li>
                  <li>If you have foot pain, stand on a yoga mat for cushioning</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          {activeTab !== "practice" && (
            <Button 
              onClick={() => setActiveTab("practice")}
            >
              Practice Now
              <Camera className="ml-2 h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}