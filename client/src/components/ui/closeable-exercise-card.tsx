import React, { useState } from 'react';
import { BaseExercise, EnhancedExerciseCard, EnhancedExerciseCardProps } from './enhanced-exercise-card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

/**
 * A wrapper component that adds reliable close functionality to the EnhancedExerciseCard
 */
interface CloseableExerciseCardProps<T extends BaseExercise> extends Omit<EnhancedExerciseCardProps<T>, 'exercise'> {
  exercise: T;
  onClose?: () => void;
}

export function CloseableExerciseCard<T extends BaseExercise>({
  exercise,
  category,
  sectionColor,
  loadExerciseVideo,
  onShowExerciseDetail,
  fallbackVideos,
  onClose
}: CloseableExerciseCardProps<T>) {
  const [isVisible, setIsVisible] = useState(true);

  // Handle close action
  const handleClose = (e: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log("CloseableExerciseCard: Closing card for", exercise.name);
    setIsVisible(false);
    
    if (onClose) {
      onClose();
    }
  };

  // If not visible, don't render anything
  if (!isVisible) {
    return null;
  }

  // Render the exercise card with an extra close button that manages visibility
  return (
    <div className="relative" id={`closeable-card-${exercise.id}`}>
      {/* Absolute positioned close button that sits on top */}
      <div className="absolute top-2 right-2 z-50">
        <Button
          variant="destructive"
          size="sm"
          className="h-9 w-9 p-0 rounded-full shadow-md hover:shadow-lg border-2 border-white"
          onClick={handleClose}
          aria-label="Close exercise"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Render the original enhanced exercise card */}
      <EnhancedExerciseCard
        exercise={exercise}
        category={category}
        sectionColor={sectionColor}
        loadExerciseVideo={loadExerciseVideo}
        onShowExerciseDetail={onShowExerciseDetail}
        fallbackVideos={fallbackVideos}
      />
    </div>
  );
}