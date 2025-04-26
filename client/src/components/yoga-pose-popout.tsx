import React, { useState } from 'react';
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

interface YogaPosePopoutProps {
  pose: YogaPoseProgression;
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
      'mountain': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
      'child': 'https://images.unsplash.com/photo-1601325039356-6bbe403a13bf',
      'corpse': 'https://images.unsplash.com/photo-1588286840104-8957b019727f',
      'downward_dog': 'https://images.unsplash.com/photo-1610508500445-a4592435e5d7',
      'cat_cow': 'https://images.unsplash.com/photo-1526717081708-697e639c20ac',
      'forward_fold': 'https://images.unsplash.com/photo-1594050753835-0e9894479f5a',
      
      // Level 3-4 Poses
      'tree': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
      'warrior_1': 'https://images.unsplash.com/photo-1508672019048-805c876b67e2',
      'warrior_2': 'https://images.unsplash.com/photo-1517374148663-13d26488791e',
      'triangle': 'https://images.unsplash.com/photo-1599586122309-454cb614a86f',
      'chair': 'https://images.unsplash.com/photo-1618257205127-a0bf2142e6e3',
      'bridge': 'https://images.unsplash.com/photo-1592431698394-e5ed80f2c0a9',
      
      // Level 5 Poses
      'half_moon': 'https://images.unsplash.com/photo-1598971639058-bb01d3c9d72e',
      'eagle': 'https://images.unsplash.com/photo-1552286450-4a669f880062',
      'pigeon': 'https://images.unsplash.com/photo-1600618528240-fb9fc964eca8',
      
      // Level 6 Poses
      'crow': 'https://images.unsplash.com/photo-1599587867649-a99ea56dd151',
      'side_plank': 'https://images.unsplash.com/photo-1597175587481-a65296c7d6af',
      'boat': 'https://images.unsplash.com/photo-1566027310016-5f05444ccd1b'
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
            {pose.imageUrl && (
              <div className="w-full h-32 rounded-md overflow-hidden mb-3 bg-muted flex items-center justify-center">
                <img 
                  src={formatImageUrl(pose.imageUrl)} 
                  alt={pose.name} 
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.currentTarget.src = `${getFallbackImageUrl()}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80`;
                  }}
                />
              </div>
            )}
            
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
                {pose.imageUrl && (
                  <div className="w-full h-48 rounded-md overflow-hidden mb-4 bg-muted flex items-center justify-center">
                    <img 
                      src={formatImageUrl(pose.imageUrl)} 
                      alt={pose.name} 
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.currentTarget.src = `${getFallbackImageUrl()}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80`;
                      }}
                    />
                  </div>
                )}
                
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