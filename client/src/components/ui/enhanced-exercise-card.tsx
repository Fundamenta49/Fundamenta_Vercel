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
  
  // Completely redesigned close handler with direct DOM manipulation
  const handleClose = (e: React.MouseEvent) => {
    // Always stop event propagation - this is critical
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Debug output
    console.log("Close button clicked with critical fix implementation");
    
    try {
      // Force card to close state immediately
      setIsOpen(false);
      
      // Reset video expanded state if applicable
      setIsVideoExpanded(false);
      
      // Force scroll to parent element
      const cardContainer = document.getElementById(`exercise-card-${exercise.id}`);
      if (cardContainer) {
        // Set focus to the container to ensure keyboard navigation works
        (cardContainer as HTMLElement).focus();
        
        // Explicitly scroll to the container
        window.scrollTo({
          top: cardContainer.offsetTop - 100,
          behavior: 'smooth'
        });
      }
      
      // Add a defensive timeout to ensure UI state is updated
      setTimeout(() => {
        if (isOpen) {
          console.log("Enforcing closed state");
          setIsOpen(false);
        }
      }, 100);
    } catch (error) {
      console.error("Error in close handler:", error);
      // Fallback close - last resort
      setIsOpen(false);
      window.scrollTo(0, 0);
    }
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
    <div 
      id={`exercise-card-${exercise.id}`} 
      className="transition-opacity duration-200" 
      tabIndex={-1} // Make focusable for accessibility and programmatic focus
    >
      <Card className="overflow-hidden border-0 sm:border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-none sm:rounded-lg">
        <CardContent className="p-0">
          {/* Card Header - Always visible - iOS-style with cleaner spacing */}
          <div 
            className="p-3 md:p-4 cursor-pointer transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-900"
            onClick={handleToggle}
            style={{
              borderLeft: `4px solid ${isOpen ? sectionColor : 'transparent'}`,
            }}
          >
            <div className="flex items-start md:items-center justify-between">
              <div className="flex-1 pr-3">
                {/* Mobile-optimized header with stacked elements */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <h3 className="font-medium text-base md:text-lg text-gray-900">{exercise.name}</h3>
                  <Badge 
                    variant="outline" 
                    className={`text-[10px] md:text-xs font-medium w-fit ${getDifficultyColor()}`}
                  >
                    {exercise.difficulty}
                  </Badge>
                </div>
                <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mt-0.5 md:mt-1">{exercise.description}</p>
              </div>
              
              {/* iOS-style toggle button with tap-friendly size */}
              <div className="flex-shrink-0">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full -mt-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle();
                  }}
                >
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
                  )}
                  <span className="sr-only">{isOpen ? 'Collapse' : 'Expand'}</span>
                </Button>
              </div>
            </div>
            
            {/* Simplified info tags with subtle separators */}
            <div className="flex flex-wrap items-center gap-2 mt-1.5 md:mt-2 text-[10px] md:text-xs text-gray-500">
              {exercise.equipment.length > 0 && exercise.equipment[0] !== 'none' && (
                <div className="flex items-center">
                  <Dumbbell className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" />
                  <span className="truncate max-w-[120px] md:max-w-none">{exercise.equipment.join(', ')}</span>
                </div>
              )}
              
              {exercise.equipment.length > 0 && exercise.muscleGroups.length > 0 && (
                <span className="text-gray-300">•</span>
              )}
              
              {exercise.muscleGroups.length > 0 && (
                <div className="flex items-center">
                  <Flame className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" />
                  <span className="truncate max-w-[120px] md:max-w-none">{exercise.muscleGroups.slice(0, 2).join(', ')}{exercise.muscleGroups.length > 2 ? '...' : ''}</span>
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
                {/* Close button - larger, more prominent */}
                <div className="absolute top-3 right-3 z-50">
                  <Button 
                    variant="destructive"
                    size="sm"
                    className="h-10 w-10 p-0 rounded-full shadow-md hover:shadow-lg border-2 border-white animate-pulse"
                    onClick={handleClose}
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>
                
                {/* iOS-styled content with improved spacing and typography */}
                <div className="p-3 md:p-4 pt-6">
                  {/* Media section - Video or Image */}
                  <div className="mb-3 md:mb-4">
                    {isLoading ? (
                      <Skeleton className="w-full h-40 md:h-48 rounded-lg" />
                    ) : exerciseVideo ? (
                      <div className="relative rounded-lg overflow-hidden bg-black/5">
                        <EmbeddedYouTubePlayer
                          videoId={exerciseVideo.id}
                          title={exerciseVideo.title}
                          height={isVideoExpanded ? "300px" : "200px"}
                          width="100%"
                        />
                        
                        {/* iOS-style video title overlay */}
                        <div className="absolute top-0 left-0 w-full p-2 bg-gradient-to-b from-black/60 to-transparent">
                          <h4 className="text-white text-xs md:text-sm font-medium line-clamp-1">{exerciseVideo.title}</h4>
                        </div>
                        
                        {/* iOS-style control button */}
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-gray-800 text-xs rounded-full shadow-sm py-1 h-7"
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
                          className="w-full h-40 md:h-48 object-cover rounded-lg bg-black/5" 
                        />
                        
                        {loadExerciseVideo && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-gray-800 text-xs rounded-full shadow-sm py-1.5 h-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              loadVideo();
                            }}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <span className="flex items-center">
                                <svg className="animate-spin mr-1.5 h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <Play className="h-3 w-3 mr-1.5" />
                                View Video
                              </span>
                            )}
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-24 md:h-32 bg-gray-50 rounded-lg flex items-center justify-center">
                        <p className="text-gray-400 text-xs md:text-sm">No image available</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Instruction section with iOS-style design */}
                  <div className="mb-3 md:mb-4">
                    <h4 className="font-medium text-gray-800 text-sm md:text-base mb-1.5 md:mb-2 flex items-center">
                      <BarChart className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 text-gray-500" />
                      Instructions
                    </h4>
                    <ol className="list-decimal pl-4 md:pl-5 space-y-0.5 md:space-y-1 text-gray-700">
                      {exercise.instructions.map((instruction, idx) => (
                        <li key={idx} className="text-xs md:text-sm py-0.5">{instruction}</li>
                      ))}
                    </ol>
                  </div>
                  
                  {/* Benefits section with iOS-style design */}
                  {exercise.benefits && exercise.benefits.length > 0 && (
                    <div className="mb-3 md:mb-4">
                      <h4 className="font-medium text-gray-800 text-sm md:text-base mb-1.5 md:mb-2 flex items-center">
                        <Flame className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 text-pink-500" />
                        Benefits
                      </h4>
                      <ul className="list-disc pl-4 md:pl-5 space-y-0.5 md:space-y-1 text-gray-700">
                        {exercise.benefits.map((benefit, idx) => (
                          <li key={idx} className="text-xs md:text-sm py-0.5">{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Tips section with iOS-style design */}
                  {exercise.tips && exercise.tips.length > 0 && (
                    <div className="mb-3 md:mb-4">
                      <h4 className="font-medium text-gray-800 text-sm md:text-base mb-1.5 md:mb-2 flex items-center">
                        <Info className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 text-blue-500" />
                        Tips
                      </h4>
                      <ul className="list-disc pl-4 md:pl-5 space-y-0.5 md:space-y-1 text-gray-700">
                        {exercise.tips.map((tip, idx) => (
                          <li key={idx} className="text-xs md:text-sm py-0.5">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* iOS-styled action buttons */}
                  <div className="flex flex-wrap justify-between items-center gap-2 mt-3 md:mt-4">
                    <div className="flex gap-1.5 md:gap-2">
                      {onShowExerciseDetail && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 text-[10px] md:text-xs border-pink-200 text-pink-700 hover:bg-pink-50 rounded-full px-2.5 md:px-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onShowExerciseDetail) {
                              onShowExerciseDetail(exercise);
                            }
                          }}
                        >
                          <Info className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" />
                          Details
                        </Button>
                      )}
                      
                      {!exerciseVideo && !isLoading && loadExerciseVideo && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 text-[10px] md:text-xs border-blue-200 text-blue-700 hover:bg-blue-50 rounded-full px-2.5 md:px-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            loadVideo();
                          }}
                        >
                          <Play className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" />
                          Video
                        </Button>
                      )}
                    </div>
                    
                    {/* iOS-style prominent close button */}
                    <Button 
                      variant="destructive" 
                      size="sm"
                      className="h-8 text-[10px] md:text-xs rounded-full px-2.5 md:px-3"
                      onClick={handleClose}
                    >
                      <X className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" />
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}