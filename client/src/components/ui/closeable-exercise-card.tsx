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
      {/* Render the original enhanced exercise card */}
      <EnhancedExerciseCard
        exercise={exercise}
        category={category}
        sectionColor={sectionColor}
        loadExerciseVideo={loadExerciseVideo}
        onShowExerciseDetail={onShowExerciseDetail}
        fallbackVideos={fallbackVideos}
      />
      
      {/* Absolute positioned close button with ultra-high z-index to prevent any blocking */}
      <div 
        className="fixed top-2 right-2 z-[9999]" 
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          pointerEvents: 'auto'
        }}
      >
        <Button
          variant="destructive"
          size="sm"
          className="h-10 w-10 p-0 rounded-full shadow-lg hover:shadow-xl border-2 border-white animate-pulse hover:animate-none"
          onClick={handleClose}
          aria-label="Close exercise"
          style={{ 
            pointerEvents: 'auto',
            animation: 'pulse 2s infinite'
          }}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}