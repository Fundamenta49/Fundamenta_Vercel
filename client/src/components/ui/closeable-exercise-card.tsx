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

  // If not visible, render a placeholder to maintain layout and prevent container collapse
  if (!isVisible) {
    return (
      <div 
        id={`closed-card-${exercise.id}`} 
        className="w-full opacity-0 h-0 overflow-hidden transition-all duration-500"
        aria-hidden="true"
      />
    );
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
      
      {/* Absolute positioned close button with ultra-ultra-high z-index to prevent any blocking */}
      <div 
        className="fixed top-2 right-2 z-[99999]" 
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
            animation: 'pulse 2s infinite',
            // Add a higher stacking context to ensure this is absolutely on top
            position: 'relative',
            zIndex: 99999
          }}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}