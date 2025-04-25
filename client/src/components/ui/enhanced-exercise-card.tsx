import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  AlertCircle, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Play, 
  Clock, 
  Dumbbell, 
  Flame,
  BarChart 
} from "lucide-react";
import { EmbeddedYouTubePlayer } from '@/components/embedded-youtube-player';
import { YouTubeVideo } from '@/lib/youtube-service';

// Base exercise interface that can be extended by specific exercise types
export interface BaseExercise {
  id: string;
  name: string;
  description: string;
  muscleGroups: string[];
  equipment: string[];
  difficulty: string;
  instructions: string[];
  imageUrl?: string;
  videoUrl?: string;
  benefits?: string[];
  tips?: string[];
  animationUrl?: string;
  category?: string;
}

// Props for the enhanced exercise card
export interface EnhancedExerciseCardProps<T extends BaseExercise> {
  exercise: T;
  category: string;
  sectionColor?: string;
  loadExerciseVideo?: (exercise: T) => Promise<YouTubeVideo[]>;
  onShowExerciseDetail?: (exercise: T) => void;
  fallbackVideos?: Record<string, YouTubeVideo[]>;
}

const difficultyColorMap: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800 border-green-200',
  intermediate: 'bg-blue-100 text-blue-800 border-blue-200',
  advanced: 'bg-purple-100 text-purple-800 border-purple-200',
};

// Main component
export function EnhancedExerciseCard<T extends BaseExercise>({
  exercise,
  category,
  sectionColor = 'var(--primary)',
  loadExerciseVideo,
  onShowExerciseDetail,
  fallbackVideos
}: EnhancedExerciseCardProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [exerciseVideo, setExerciseVideo] = useState<YouTubeVideo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  
  // Reference to the content area for scrolling
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Handle card toggle
  const handleToggle = () => {
    setIsOpen(!isOpen);
    
    // If opening the card and no video is loaded yet, try to load one
    if (!isOpen && !exerciseVideo && loadExerciseVideo) {
      loadVideo();
    }
  };
  
  // Handle close button click - with proper event stopping
  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Close button clicked");
    setIsOpen(false);
  };
  
  // Load video using the provided function or fallback to stored videos
  const loadVideo = async () => {
    if (isLoading || exerciseVideo) return;
    
    setIsLoading(true);
    
    try {
      // Try to load from provided function
      if (loadExerciseVideo) {
        const videos = await loadExerciseVideo(exercise);
        if (videos && videos.length > 0) {
          setExerciseVideo(videos[0]);
          return;
        }
      }
      
      // Fall back to provided fallback videos if available
      if (fallbackVideos && fallbackVideos[exercise.id] && fallbackVideos[exercise.id].length > 0) {
        setExerciseVideo(fallbackVideos[exercise.id][0]);
      }
    } catch (error) {
      console.error('Error loading video:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // When opening the card, scroll to it
  useEffect(() => {
    if (isOpen && contentRef.current) {
      // Add a small delay to allow the animation to start
      setTimeout(() => {
        contentRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest' 
        });
      }, 100);
    }
  }, [isOpen]);
  
  // Get difficulty badge color
  const getDifficultyColor = () => {
    return difficultyColorMap[exercise.difficulty.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };
  
  return (
    <div className="transition-opacity duration-200">
      <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-0">
          {/* Card Header - Always visible */}
          <div 
            className="p-4 cursor-pointer transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-900"
            onClick={handleToggle}
            style={{
              borderLeft: isOpen ? `4px solid ${sectionColor}` : '4px solid transparent',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg text-gray-900">{exercise.name}</h3>
                  <Badge 
                    variant="outline" 
                    className={`text-xs font-medium ${getDifficultyColor()}`}
                  >
                    {exercise.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{exercise.description}</p>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle();
                  }}
                >
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                  <span className="sr-only">{isOpen ? 'Collapse' : 'Expand'}</span>
                </Button>
              </div>
            </div>
            
            {/* Quick info tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {exercise.equipment.length > 0 && exercise.equipment[0] !== 'none' && (
                <div className="flex items-center text-xs text-gray-500">
                  <Dumbbell className="h-3 w-3 mr-1" />
                  <span>{exercise.equipment.join(', ')}</span>
                </div>
              )}
              
              {exercise.muscleGroups.length > 0 && (
                <div className="flex items-center text-xs text-gray-500">
                  <Flame className="h-3 w-3 mr-1" />
                  <span>{exercise.muscleGroups.slice(0, 2).join(', ')}{exercise.muscleGroups.length > 2 ? '...' : ''}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Expanded Content */}
          {isOpen && (
            <div 
              ref={contentRef}
              className="border-t relative bg-white transition-all duration-300 overflow-hidden"
              style={{
                opacity: isOpen ? 1 : 0,
                maxHeight: isOpen ? '2000px' : '0px',
              }}
            >
                {/* Close button */}
                <div className="absolute top-4 right-4 z-50">
                  <Button 
                    variant="destructive"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full shadow-md hover:shadow-lg"
                    onClick={handleClose}
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>
                
                <div className="p-4 pt-6">
                  {/* Media section - Video or Image */}
                  <div className="mb-4">
                    {isLoading ? (
                      <Skeleton className="w-full h-48 rounded-md" />
                    ) : exerciseVideo ? (
                      <div className="relative rounded-md overflow-hidden">
                        <EmbeddedYouTubePlayer
                          videoId={exerciseVideo.id}
                          title={exerciseVideo.title}
                          height={isVideoExpanded ? "350px" : "225px"}
                          width="100%"
                        />
                        
                        <div className="absolute top-0 left-0 w-full p-2 bg-gradient-to-b from-black/50 to-transparent">
                          <h4 className="text-white text-sm font-medium line-clamp-1">{exerciseVideo.title}</h4>
                        </div>
                        
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute bottom-2 right-2 bg-white/80 hover:bg-white text-gray-900"
                          onClick={() => setIsVideoExpanded(!isVideoExpanded)}
                        >
                          {isVideoExpanded ? 'Collapse' : 'Expand'}
                        </Button>
                      </div>
                    ) : exercise.imageUrl ? (
                      <div className="relative">
                        <img 
                          src={exercise.imageUrl} 
                          alt={exercise.name} 
                          className="w-full h-48 object-cover rounded-md" 
                        />
                        
                        {loadExerciseVideo && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="absolute bottom-2 right-2 bg-white/80 hover:bg-white text-gray-900 shadow-md"
                            onClick={(e) => {
                              e.stopPropagation();
                              loadVideo();
                            }}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <Play className="h-4 w-4 mr-1" />
                                View Video
                              </span>
                            )}
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
                        <p className="text-gray-500 text-sm">No image available</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Instructions */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <BarChart className="h-4 w-4 mr-1 text-gray-500" />
                      Instructions
                    </h4>
                    <ol className="list-decimal pl-5 space-y-1 text-gray-700">
                      {exercise.instructions.map((instruction, idx) => (
                        <li key={idx} className="text-sm">{instruction}</li>
                      ))}
                    </ol>
                  </div>
                  
                  {/* Benefits - if available */}
                  {exercise.benefits && exercise.benefits.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Flame className="h-4 w-4 mr-1 text-pink-500" />
                        Benefits
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        {exercise.benefits.map((benefit, idx) => (
                          <li key={idx} className="text-sm">{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Tips - if available */}
                  {exercise.tips && exercise.tips.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Info className="h-4 w-4 mr-1 text-blue-500" />
                        Tips
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        {exercise.tips.map((tip, idx) => (
                          <li key={idx} className="text-sm">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {onShowExerciseDetail && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs border-pink-200 text-pink-700 hover:bg-pink-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onShowExerciseDetail) {
                            onShowExerciseDetail(exercise);
                          }
                        }}
                      >
                        <Info className="h-3.5 w-3.5 mr-1" />
                        View Full Details
                      </Button>
                    )}
                    
                    {!exerciseVideo && !isLoading && loadExerciseVideo && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          loadVideo();
                        }}
                      >
                        <Play className="h-3.5 w-3.5 mr-1" />
                        Load Tutorial
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}