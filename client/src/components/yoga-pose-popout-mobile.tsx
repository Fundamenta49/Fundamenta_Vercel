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
import { ArrowRight, Camera, Info, Book, Award, Youtube, X, CheckCircle2 } from 'lucide-react';
import YogaVisionSimplified from './yoga-vision-simplified';
import axios from 'axios';
import { getYogaPoseWithDefaults } from '../lib/yoga-poses-data';
import posesWithPaths from '../data/poses_with_paths.json';
import { getYogaPoseThumbnail, getYogaPoseVideoInfo } from '../lib/yoga-pose-thumbnails';

interface YogaPosePopoutMobileProps {
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

export default function YogaPosePopoutMobile({ pose, unlocked, achievement }: YogaPosePopoutMobileProps) {
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

      // Start with image URL from the pose data
      if (pose.imageUrl) {
        setPoseImage(pose.imageUrl);
        return;
      }

      // Find matching pose in posesWithPaths for the correct image path
      const poseWithPath = posesWithPaths.find(p => p.id === pose.id);
      if (poseWithPath && poseWithPath.filename) {
        setPoseImage(poseWithPath.filename);
        return;
      }

      // Fall back to thumbnail service
      const thumbnail = getYogaPoseThumbnail(pose.id);
      if (thumbnail) {
        setPoseImage(thumbnail);
        return;
      }

      // Last fallback to a default image
      setPoseImage(`/images/yoga-poses/defaults/${pose.difficulty}.png`);
    };

    loadPoseImage();
  }, [pose.id, pose.imageUrl]);

  // iOS-style rendered pose card
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:shadow-md transition-shadow duration-300 border overflow-hidden border-gray-200 rounded-xl">
          <div className="aspect-square relative bg-gray-50">
            {poseImage && (
              <img 
                src={poseImage} 
                alt={pose.name}
                className="w-full h-full object-cover"
              />
            )}
            
            {!poseImage && isLoadingImage && (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse w-8 h-8 rounded-full bg-gray-200" />
              </div>
            )}

            {!unlocked && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center px-3">
                  <Info className="h-6 w-6 mx-auto mb-1" />
                  <p className="text-sm">Complete level {pose.levelRequired - 1} first</p>
                </div>
              </div>
            )}
            
            {achievement && achievement.masteryLevel > 0 && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-gray-900/70 text-white">
                  <Award className="h-3 w-3 mr-1" />
                  {achievement.masteryLevel}/5
                </Badge>
              </div>
            )}
          </div>
          
          <CardContent className="p-2">
            <div className="text-sm font-medium text-gray-900">{pose.name}</div>
            {pose.sanskritName && (
              <div className="text-xs text-gray-500 italic mb-1">{pose.sanskritName}</div>
            )}
            <div className="flex items-center justify-between mt-1">
              <Badge variant="outline" className="text-xs capitalize px-2 py-0 h-5 bg-transparent border-gray-200">
                {pose.difficulty}
              </Badge>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-gray-700 hover:text-gray-900" disabled={!unlocked}>
                Practice
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-xl">
        <div className="relative">
          {poseImage && (
            <img 
              src={poseImage} 
              alt={pose.name}
              className="w-full aspect-square object-cover"
            />
          )}
          <Button 
            onClick={() => setIsOpen(false)} 
            className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-black/50 hover:bg-black/70"
            variant="ghost"
          >
            <X className="h-4 w-4 text-white" />
          </Button>
        </div>
        
        <div className="p-4">
          <h3 className="text-xl font-medium text-gray-900 mb-1">{pose.name}</h3>
          {pose.sanskritName && (
            <p className="text-sm text-gray-500 italic mb-2">{pose.sanskritName}</p>
          )}
          
          <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid grid-cols-3 bg-gray-100 p-0.5 rounded-lg">
              <TabsTrigger 
                value="info" 
                className="rounded-md text-sm data-[state=active]:bg-white"
              >
                <Info className="h-4 w-4 mr-1" />
                Info
              </TabsTrigger>
              <TabsTrigger 
                value="practice" 
                className="rounded-md text-sm data-[state=active]:bg-white"
                disabled={!unlocked}
              >
                <Camera className="h-4 w-4 mr-1" />
                Practice
              </TabsTrigger>
              <TabsTrigger 
                value="learn" 
                className="rounded-md text-sm data-[state=active]:bg-white"
                disabled={!unlocked}
              >
                <Youtube className="h-4 w-4 mr-1" />
                Videos
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="mt-4">
              <p className="text-sm text-gray-700">{pose.description}</p>
              
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Benefits</p>
                  <ul className="text-sm space-y-1 pl-5 list-disc">
                    {pose.benefits?.map((benefit, i) => (
                      <li key={i}>{benefit}</li>
                    ))}
                  </ul>
                </div>
                
                {/* Modifications section - conditional rendering based on pose data type */}
                {pose.modifications && Array.isArray(pose.modifications) && pose.modifications.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Modifications</p>
                    <ul className="text-sm space-y-1 pl-5 list-disc">
                      {pose.modifications.map((mod: string, i: number) => (
                        <li key={i}>{mod}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="practice" className="mt-4">
              {unlocked ? (
                <YogaVisionSimplified 
                  poseId={pose.id}
                  /* Remove poseName prop as it's not in the component interface */
                  /* Pass initialPoseImageUrl only if needed by the component */
                />
              ) : (
                <div className="text-center py-8">
                  <Info className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600">You need to complete previous levels first.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="learn" className="mt-4">
              {unlocked ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-700 mb-2">
                    Watch tutorial videos to learn the correct form and technique.
                  </p>
                  
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Youtube className="h-4 w-4 text-red-600" />
                      Load Video Tutorials
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Info className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600">You need to complete previous levels first.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter className="p-4 pt-0">
          {unlocked && (
            <Button className="w-full bg-gray-900 hover:bg-black text-white" disabled={!unlocked}>
              Start Practice Session
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}