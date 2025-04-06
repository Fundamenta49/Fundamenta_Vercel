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
  
  // Get positions based on feature cards on the page and tour step
  const getFundiPosition = (stepIndex: number, isMobile: boolean) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Find all the feature cards on the page
    const featureCards = document.querySelectorAll('.card');
    const cardPositions = [];
    
    // Try to position Fundi near feature cards if they exist
    if (featureCards.length > 0) {
      featureCards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        // For each card, create a position near it
        cardPositions.push({
          x: Math.min(rect.left - 60, viewportWidth - 100), // Position to the left of the card
          y: rect.top + 20 // Near the top of the card
        });
        
        // Also add positions for the right side of cards for variety
        cardPositions.push({
          x: Math.min(rect.right + 20, viewportWidth - 100), // Position to the right of the card
          y: rect.top + 20 // Near the top of the card
        });
      });
    }
    
    // If no cards found or on very small screens, use fallback positions
    if (cardPositions.length === 0 || viewportWidth < 500) {
      // Define fallback positions for different points around the screen
      const fallbackPositions = [
        { x: Math.min(viewportWidth / 4, viewportWidth - 100),      y: 120 },  // Top left area
        { x: Math.min(viewportWidth / 2 - 40, viewportWidth - 100), y: 120 },  // Top center
        { x: Math.min(viewportWidth * 0.75, viewportWidth - 100),   y: 120 },  // Top right area
        { x: Math.min(viewportWidth / 4, viewportWidth - 100),      y: Math.min(viewportHeight / 2, 400) },  // Middle left
        { x: Math.min(viewportWidth * 0.75, viewportWidth - 100),   y: Math.min(viewportHeight / 2, 400) },  // Middle right
      ];
      
      // For mobile, just use a subset of positions to avoid going off-screen
      if (isMobile) {
        const mobilePositions = [
          { x: Math.min(viewportWidth / 2 - 40, viewportWidth - 100), y: 120 },  // Top center
          { x: Math.min(viewportWidth / 2 - 40, viewportWidth - 100), y: Math.min(viewportHeight / 2, 300) },  // Middle center
        ];
        
        // Use modulo to cycle through positions safely
        const positionIndex = stepIndex % mobilePositions.length;
        return mobilePositions[positionIndex];
      }
      
      // Use modulo to cycle through fallback positions if no cards found
      const positionIndex = stepIndex % fallbackPositions.length;
      return fallbackPositions[positionIndex];
    }
    
    // Use the card positions when available
    // Use modulo to cycle through the positions based on step index
    const positionIndex = stepIndex % cardPositions.length;
    
    // Always ensure position stays within the viewport
    const position = cardPositions[positionIndex];
    position.x = Math.max(20, Math.min(position.x, viewportWidth - 100));
    position.y = Math.max(20, Math.min(position.y, viewportHeight - 200));
    
    return position;
  };

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
    // Check if we're on mobile
    const isMobile = window.innerWidth < 640;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // If we have a highlight selector, try to position Fundi near it
    if (currentStep.highlightSelector) {
      const targetElement = document.querySelector(currentStep.highlightSelector);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        
        // Calculate a position near the element (to the right or below)
        let newX, newY;
        
        if (isMobile) {
          // On mobile, use dynamic positions but stay within safe zone
          const position = getFundiPosition(currentStepIndex, true);
          newX = position.x;
          newY = position.y;
          
          // Log position for debugging
          console.log(`Fundi position (mobile): x=${newX}px, y=${newY}px, step=${currentStepIndex}`);
        } else if (rect.right + 150 < viewportWidth) {
          // Position to the right of the highlight
          newX = rect.right + 20;
          newY = rect.top + (rect.height / 2) - 40;
        } else {
          // Position below the highlight
          newX = rect.left + (rect.width / 2) - 40;
          newY = rect.bottom + 20;
        }
        
        // Ensure Fundi stays within viewport with better margins
        newX = Math.max(60, Math.min(newX, viewportWidth - 100));
        newY = Math.max(60, Math.min(newY, viewportHeight - 200));
        
        setTargetPosition({ x: newX, y: newY });
        setAnimate(true);
      } else {
        // If element not found, use predefined positions
        const position = getFundiPosition(currentStepIndex, isMobile);
        setTargetPosition(position);
        setAnimate(true);
        console.log(`Fundi position (no element): x=${position.x}px, y=${position.y}px, step=${currentStepIndex}`);
      }
    } else {
      // For general steps without a specific element, use predefined positions
      const position = getFundiPosition(currentStepIndex, isMobile);
      setTargetPosition(position);
      setAnimate(true);
      console.log(`Fundi position (general): x=${position.x}px, y=${position.y}px, step=${currentStepIndex}`);
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
    
    // Log button press for debugging
    console.log("Next button clicked - advancing to next step");
    
    setIsTransitioning(true);
    
    // Preserve Fundi's current position temporarily during transition
    const currentPosition = {...position};
    
    // Remove any highlights before transitioning
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
    });
    
    // Make Fundi think to indicate processing
    setThinking(true);
    
    // Calculate the next position before transitioning
    const isMobile = window.innerWidth < 640;
    const nextStepIndex = currentStepIndex + 1;
    const nextPosition = getFundiPosition(nextStepIndex, isMobile);
    
    // Call the next step immediately
    nextStep();
    
    // Animate Fundi to move to a new position for the next step
    setTimeout(() => {
      // Keep Fundi visible at the current position until the new step's position is calculated
      // This prevents the disappearing effect
      if (!animate) {
        setPosition(currentPosition);
      }
      
      // Set new position for an engaging animated transition
      setTargetPosition(nextPosition);
      setAnimate(true);
      console.log(`Fundi transitioning to: x=${nextPosition.x}px, y=${nextPosition.y}px for step ${nextStepIndex}`);
      
      setThinking(false);
      setIsTransitioning(false);
    }, 300);
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    if (isTransitioning) return;
    
    // Log button press for debugging
    console.log("Back button clicked - returning to previous step");
    
    setIsTransitioning(true);
    
    // Preserve Fundi's current position temporarily during transition
    const currentPosition = {...position};
    
    // Remove any highlights before transitioning
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
    });
    
    // Make Fundi think to indicate processing
    setThinking(true);
    
    // Calculate the previous position before transitioning
    const isMobile = window.innerWidth < 640;
    const prevStepIndex = Math.max(0, currentStepIndex - 1);
    const prevPosition = getFundiPosition(prevStepIndex, isMobile);
    
    // Call the previous step immediately
    prevStep();
    
    // Animate Fundi to move to a new position for the previous step
    setTimeout(() => {
      // Keep Fundi visible at the current position until the new step's position is calculated
      // This prevents the disappearing effect
      if (!animate) {
        setPosition(currentPosition);
      }
      
      // Set new position for an engaging animated transition
      setTargetPosition(prevPosition);
      setAnimate(true);
      console.log(`Fundi transitioning to: x=${prevPosition.x}px, y=${prevPosition.y}px for step ${prevStepIndex}`);
      
      setThinking(false);
      setIsTransitioning(false);
    }, 300);
  };
  
  // Debug function to track clicks on Fundi elements - moved outside conditional to follow React hooks rules
  useEffect(() => {
    // Only run if tour is active
    if (!isTourActive || !currentStep) return;
    
    // Add visibility monitor to help prevent disappearing issues - no click events
    const addEmergencyListeners = () => {
      const fundiElements = document.querySelectorAll('.fixed.z-\\[99999\\], .fixed.z-\\[99998\\]');
      let count = 0;
      
      fundiElements.forEach(el => {
        if (!el.getAttribute('data-emergency-handler')) {
          el.setAttribute('data-emergency-handler', 'true');
          
          // Only apply visibility styles, don't capture any clicks
          const element = el as HTMLElement;
          if (element) {
            // Ensure elements are visible and properly positioned
            element.style.visibility = 'visible';
            element.style.opacity = '1';
            
            // Add an attribute to identify tour elements for CSS targeting
            element.setAttribute('data-tour-element', 'true');
          }
          count++;
        }
      });
      
      if (count > 0) {
        console.log(`Added emergency visibility handlers to ${count} Fundi elements`);
      }
    };
    
    // Run initially and then every second to ensure elements are always accessible
    addEmergencyListeners();
    const interval = setInterval(addEmergencyListeners, 1000);
    
    return () => clearInterval(interval);
  }, [isTourActive, currentStep]);
  
  // If tour isn't active, don't render anything
  if (!isTourActive || !currentStep) {
    return null;
  }

  return (
    <>
      {/* Fundi Robot with fixed position and limited animation */}
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
          type: "tween", 
          duration: 0.3,
          ease: "easeInOut"
        }}
        style={{ 
          pointerEvents: 'auto',
          width: '80px',
          height: '80px',
          willChange: 'transform', // Optimize for animation performance
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
          // Use fixed position for speech bubble for stability
          x: window.innerWidth < 640 
            ? Math.max(20, Math.min(window.innerWidth / 2 - 125, window.innerWidth - 270)) 
            : position.x + 90,
          y: 260  // Fixed position below Fundi to prevent jumping
        }}
        transition={{ 
          type: "tween", // Use tween instead of spring for more controlled animation
          duration: 0.4,  // Faster, more controlled transition
          ease: "easeInOut"
        }}
        style={{ 
          width: '250px',
          maxWidth: window.innerWidth < 640 ? 'calc(100vw - 40px)' : '80vw',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Speech bubble pointer - always at top for visual consistency */}
        <div 
          className="absolute w-4 h-4 bg-white border-l border-t border-gray-200 transform -rotate-45"
          style={{
            left: '50%', // Centered at the top for a consistent look
            marginLeft: '-4px',
            top: '-8px'
          }}
        />
        
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
              onClick={(e) => {
                e.stopPropagation();
                console.log("Back button clicked directly");
                handlePrevStep();
              }}
              disabled={currentStepIndex === 0 || isTransitioning}
              className="h-7 px-2 text-xs"
              data-tour-button="back"
            >
              <ChevronLeft className="h-3 w-3 mr-1" />
              Back
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                console.log("Skip button clicked directly");
                skipTour();
              }}
              disabled={isTransitioning}
              className="h-7 px-2 text-xs"
              data-tour-button="skip"
            >
              <X className="h-3 w-3 mr-1" />
              Skip
            </Button>
          </div>
          
          <Button 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation(); // Stop event bubbling
              console.log("Next button clicked directly"); 
              handleNextStep();
            }}
            disabled={isTransitioning}
            className="h-7 px-2 text-xs"
            data-tour-button="next" // Identifier for the button
          >
            {currentStepIndex === totalSteps - 1 ? 'Finish' : 'Next'}
            {currentStepIndex < totalSteps - 1 && <ChevronRight className="h-3 w-3 ml-1" />}
          </Button>
        </div>
      </motion.div>
    </>
  );
}