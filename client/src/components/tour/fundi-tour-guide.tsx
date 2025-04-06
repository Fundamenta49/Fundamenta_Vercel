import React, { useState, useEffect, useRef } from 'react';
import { useTour } from '@/contexts/tour-context';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import RobotFundi from '@/components/robot-fundi';
import FundiPersonalityAdapter from '@/components/fundi-personality-adapter';

export default function FundiTourGuide() {
  const {
    isTourActive,
    currentStep,
    currentStepIndex,
    totalSteps,
    userName,
    nextStep,
    prevStep,
    skipTour,
  } = useTour();
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 });
  const [animate, setAnimate] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Calculate progress
  const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;
  
  // Control Fundi's appearance and position based on the current step
  useEffect(() => {
    if (!isTourActive || !currentStep) return;
    
    // Reset transition state
    setIsTransitioning(false);
    
    // Show Fundi thinking briefly
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setSpeaking(true);
      
      // Stop speaking after a few seconds
      setTimeout(() => {
        setSpeaking(false);
      }, 2000);
    }, 800);
    
    // Position Fundi based on the current step
    // If we have a highlight selector, position Fundi near it
    if (currentStep.highlightSelector) {
      const targetElement = document.querySelector(currentStep.highlightSelector);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        
        // Calculate a position near the element (to the right or below)
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Determine if Fundi should be to the right or below the element
        let newX, newY;
        
        // Check if we're on mobile
        const isMobile = window.innerWidth < 640;
        
        if (isMobile) {
          // On mobile, position Fundi at the top right for better visibility
          // Fixed position that works well on small screens
          newX = Math.min(viewportWidth - 80, viewportWidth - 100);
          newY = 80; // Fixed at top with good margin
          
          // Log position for debugging
          console.log(`Fundi position: top=${newY}px, right=${viewportWidth - newX}px, translate(${newX}px, ${newY}px)`);
        } else if (rect.right + 150 < viewportWidth) {
          // Position to the right
          newX = rect.right + 20;
          newY = rect.top + (rect.height / 2) - 40;
        } else {
          // Position below
          newX = rect.left + (rect.width / 2) - 40;
          newY = rect.bottom + 20;
        }
        
        // Ensure Fundi stays within viewport with better margins
        newX = Math.max(60, Math.min(newX, viewportWidth - 100));
        newY = Math.max(60, Math.min(newY, viewportHeight - 100));
        
        setTargetPosition({ x: newX, y: newY });
        setAnimate(true);
      }
    } else {
      // For general steps without a specific element, position Fundi in a fixed location
      const isMobile = window.innerWidth < 640;
      const viewportWidth = window.innerWidth;
      
      if (isMobile) {
        // On mobile, fixed position in the top right for consistency and visibility
        const newX = viewportWidth - 100; // 100px from right edge
        const newY = 80; // 80px from top
        
        setTargetPosition({ x: newX, y: newY });
        
        // Log position for debugging
        console.log(`Fundi position: top=${newY}px, right=${viewportWidth - newX}px, translate(${newX}px, ${newY}px)`);
      } else {
        // On desktop, center in the viewport
        setTargetPosition({ 
          x: window.innerWidth / 2 - 100, 
          y: window.innerHeight / 3 - 50 
        });
      }
      setAnimate(true);
    }
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Scroll element into view if highlighted
    if (currentStep.highlightSelector) {
      timeoutRef.current = setTimeout(() => {
        const element = document.querySelector(currentStep.highlightSelector as string);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('tour-highlight');
        }
      }, 800);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
      });
    };
  }, [isTourActive, currentStep, currentStepIndex]);
  
  // Update position when target changes
  useEffect(() => {
    if (animate) {
      setPosition(targetPosition);
      setAnimate(false);
    }
  }, [targetPosition, animate]);
  
  // Handle next step
  const handleNextStep = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Preserve Fundi's current position temporarily during transition
    const currentPosition = {...position};
    
    // Remove any highlights before transitioning
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
    });
    
    // Make Fundi think to indicate processing
    setThinking(true);
    
    // Small delay to ensure proper cleanup and visual indication of transition
    setTimeout(() => {
      nextStep();
      
      // Keep Fundi visible at the current position until the new step's position is calculated
      // This prevents the disappearing effect
      setTimeout(() => {
        if (!animate) {
          setPosition(currentPosition);
        }
        setThinking(false);
      }, 100);
    }, 300);
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Preserve Fundi's current position temporarily during transition
    const currentPosition = {...position};
    
    // Remove any highlights before transitioning
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
    });
    
    // Make Fundi think to indicate processing
    setThinking(true);
    
    // Small delay to ensure proper cleanup and visual indication of transition
    setTimeout(() => {
      prevStep();
      
      // Keep Fundi visible at the current position until the new step's position is calculated
      // This prevents the disappearing effect
      setTimeout(() => {
        if (!animate) {
          setPosition(currentPosition);
        }
        setThinking(false);
      }, 100);
    }, 300);
  };
  
  // If tour isn't active, don't render anything
  if (!isTourActive || !currentStep) {
    return null;
  }
  
  // Debug function to track clicks on Fundi elements
  useEffect(() => {
    // Add click listeners to help prevent disappearing issues
    const addEmergencyListeners = () => {
      const fundiElements = document.querySelectorAll('.fixed.z-\\[99999\\], .fixed.z-\\[99998\\]');
      let count = 0;
      
      fundiElements.forEach(el => {
        if (!el.getAttribute('data-emergency-handler')) {
          el.setAttribute('data-emergency-handler', 'true');
          el.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            // Ensure visibility is maintained
            const element = e.currentTarget as HTMLElement;
            if (element) {
              element.style.visibility = 'visible';
              element.style.opacity = '1';
            }
          });
          count++;
        }
      });
      
      if (count > 0) {
        console.log(`Added emergency click handlers to ${count} Fundi elements`);
      }
    };
    
    // Run initially and then every second to ensure elements are always accessible
    addEmergencyListeners();
    const interval = setInterval(addEmergencyListeners, 1000);
    
    return () => clearInterval(interval);
  }, [isTourActive]);

  return (
    <>
      {/* Fundi Robot that moves around */}
      <motion.div
        className="fixed z-[99999]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          x: position.x,
          y: position.y 
        }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 25,
          duration: 0.8
        }}
        style={{ 
          pointerEvents: 'auto', // Changed to auto for emergency recovery clicks
          width: '80px',
          height: '80px'
        }}
      >
        <div className="w-20 h-20">
          <FundiPersonalityAdapter>
            <RobotFundi
              speaking={speaking}
              thinking={thinking}
              size="md"
              interactive={false}
              emotion="happy"
            />
          </FundiPersonalityAdapter>
        </div>
      </motion.div>
      
      {/* Speech Bubble with tour content */}
      <motion.div
        className="fixed z-[99998] bg-white rounded-2xl shadow-lg border border-gray-200 p-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          // Better mobile positioning - to the left of Fundi and below
          x: window.innerWidth < 640 
            ? Math.max(20, Math.min(position.x - 230, window.innerWidth - 270)) 
            : position.x + 90,
          y: window.innerWidth < 640 
            ? position.y + 90 
            : position.y - 20
        }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 25,
          delay: 0.1,
          duration: 0.8
        }}
        style={{ 
          width: '250px',
          maxWidth: window.innerWidth < 640 ? 'calc(100vw - 40px)' : '80vw'
        }}
      >
        {/* Speech bubble pointer - conditionally position based on device */}
        {window.innerWidth < 640 ? (
          <div 
            className="absolute w-4 h-4 bg-white border-l border-t border-gray-200 transform -rotate-45"
            style={{
              right: '30px', // Changed from left to right for better alignment with Fundi
              top: '-8px'
            }}
          />
        ) : (
          <div 
            className="absolute w-4 h-4 bg-white border-l border-b border-gray-200 transform rotate-45"
            style={{
              left: '-8px',
              top: '30px'
            }}
          />
        )}
        
        {/* Tour Content */}
        <div className="font-medium text-sm mb-2">{currentStep.title}</div>
        <p className="text-gray-600 text-xs mb-4">{currentStep.content}</p>
        
        {/* Progress bar */}
        <div className="mb-3">
          <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>{currentStepIndex + 1}/{totalSteps}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between">
          <div className="flex gap-1.5">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0 || isTransitioning}
              className="h-7 px-2 text-xs"
            >
              <ChevronLeft className="h-3 w-3 mr-1" />
              Back
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={skipTour}
              disabled={isTransitioning}
              className="h-7 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Skip
            </Button>
          </div>
          
          <Button 
            size="sm" 
            onClick={handleNextStep}
            disabled={isTransitioning}
            className="h-7 px-2 text-xs"
          >
            {currentStepIndex === totalSteps - 1 ? 'Finish' : 'Next'}
            {currentStepIndex < totalSteps - 1 && <ChevronRight className="h-3 w-3 ml-1" />}
          </Button>
        </div>
      </motion.div>
    </>
  );
}