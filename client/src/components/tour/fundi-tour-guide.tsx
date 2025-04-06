import React, { useState, useEffect, useRef } from 'react';
import { useTour } from '@/contexts/tour-context';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, X, Check } from 'lucide-react';
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
  
  // Helper function to clean up all tour highlights
  const cleanupTourHighlights = () => {
    document.querySelectorAll('.tour-highlight, .tour-card-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
      el.classList.remove('tour-card-highlight');
    });
  };
  
  // Calculate progress
  const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;
  
  // Get positions based on feature cards on the page and tour step
  const getFundiPosition = (stepIndex: number, isMobile: boolean) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Find all the feature cards on the page - looking specifically for cards in grid sections
    const featureCards = document.querySelectorAll('.card');
    const cardPositions: Array<{ x: number; y: number; element: Element }> = [];
    
    // Try to position Fundi near feature cards if they exist
    if (featureCards.length > 0) {
      featureCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        
        // Only include cards that are actually visible in the viewport
        if (rect.top < viewportHeight && rect.bottom > 0 && 
            rect.left < viewportWidth && rect.right > 0) {
          
          // For each visible card, create a position near it
          if (index % 2 === 0) {
            // Position to the left of even-indexed cards
            cardPositions.push({
              x: Math.min(rect.left - 60, viewportWidth - 100), 
              y: rect.top + 20,
              element: card
            });
          } else {
            // Position to the right of odd-indexed cards
            cardPositions.push({
              x: Math.min(rect.right + 20, viewportWidth - 100),
              y: rect.top + 20,
              element: card
            });
          }
        }
      });
    }
    
    // If no cards found or on very small screens, use fallback positions
    if (cardPositions.length === 0 || viewportWidth < 500) {
      // Define fallback positions for different points around the screen
      const fallbackPositions = [
        { x: Math.min(viewportWidth / 4, viewportWidth - 100), y: 120 },  // Top left area
        { x: Math.min(viewportWidth / 2 - 40, viewportWidth - 100), y: 120 },  // Top center
        { x: Math.min(viewportWidth * 0.75, viewportWidth - 100), y: 120 },  // Top right area
        { x: Math.min(viewportWidth / 4, viewportWidth - 100), y: Math.min(viewportHeight / 2, 400) },  // Middle left
        { x: Math.min(viewportWidth * 0.75, viewportWidth - 100), y: Math.min(viewportHeight / 2, 400) },  // Middle right
      ];
      
      // For mobile, use more diverse positions optimized for highlighting different cards
      if (isMobile) {
        const mobilePositions = [
          // Upper positions
          { x: Math.min(viewportWidth / 2 - 30, viewportWidth - 80), y: 80 },  // Top center
          { x: Math.min(viewportWidth / 3 - 20, viewportWidth - 80), y: 120 }, // Top left-ish
          { x: Math.min(viewportWidth * 0.7, viewportWidth - 80), y: 100 },    // Top right-ish
          
          // Middle positions
          { x: Math.min(viewportWidth / 2 - 30, viewportWidth - 80), y: Math.min(viewportHeight * 0.3, 180) }, // Middle upper
          { x: Math.min(viewportWidth / 3 - 20, viewportWidth - 80), y: Math.min(viewportHeight * 0.35, 200) }, // Middle left
          { x: Math.min(viewportWidth * 0.7, viewportWidth - 80), y: Math.min(viewportHeight * 0.32, 190) },  // Middle right
          
          // Lower positions for highlighting lower content
          { x: Math.min(viewportWidth / 2 - 30, viewportWidth - 80), y: Math.min(viewportHeight * 0.45, 240) }, // Lower middle
          { x: Math.min(viewportWidth / 3 - 20, viewportWidth - 80), y: Math.min(viewportHeight * 0.5, 260) },  // Lower left
          { x: Math.min(viewportWidth * 0.7, viewportWidth - 80), y: Math.min(viewportHeight * 0.48, 250) },   // Lower right
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
    // Use step index to choose a specific card - more predictable than random selection
    const positionIndex = stepIndex % cardPositions.length;
    
    // Get the selected position and extract x/y coordinates
    const selectedPosition = cardPositions[positionIndex];
    
    // Always ensure position stays within the viewport
    const finalPosition = {
      x: Math.max(20, Math.min(selectedPosition.x, viewportWidth - 100)),
      y: Math.max(20, Math.min(selectedPosition.y, viewportHeight - 200))
    };
    
    // Highlight the card we're pointing to with a subtle glow
    try {
      document.querySelectorAll('.tour-card-highlight').forEach(el => {
        el.classList.remove('tour-card-highlight');
      });
      
      // Add highlight to the selected card
      selectedPosition.element.classList.add('tour-card-highlight');
    } catch (e) {
      // If we can't highlight (e.g., element missing), just continue
      console.log('Could not highlight card');
    }
    
    return finalPosition;
  };

  // Track the current route to detect page changes
  const [currentRoute, setCurrentRoute] = useState<string | null>(null);
  
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
    
    // Always reposition Fundi on mobile to showcase different cards
    // On desktop, only reposition when the route (page) changes
    const isMobile = window.innerWidth < 640;
    const pageChanged = currentRoute !== currentStep.route;
    const shouldRepositionFundi = isMobile || pageChanged;
    
    if (shouldRepositionFundi) {
      // Update our current route tracking
      setCurrentRoute(currentStep.route || null);
      
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
          console.log("Repositioning Fundi because page changed");
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
    } else {
      console.log("Keeping Fundi at current position - same page");
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
      // Clean up all tour-related highlights
      document.querySelectorAll('.tour-highlight, .tour-card-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
        el.classList.remove('tour-card-highlight');
      });
    };
  }, [isTourActive, currentStep, currentStepIndex, currentRoute]);
  
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
    
    // Preserve Fundi's current position during transition
    const currentPosition = {...position};
    
    // Remove any highlights before transitioning
    cleanupTourHighlights();
    
    // Make Fundi think to indicate processing
    setThinking(true);
    
    // Get the current and next step info
    const nextStepIndex = currentStepIndex + 1;
    
    // Safety check - we shouldn't be here if currentStep is null, but just to be extra safe
    if (!currentStep) {
      // If somehow we don't have currentStep, just go to the next step without animations
      nextStep();
      setIsTransitioning(false);
      return;
    }
    
    // We can't access tourSteps directly as it's in the context provider
    // Get information about the next step from the context when we move to it
    
    // Check if we're moving to a different page - we can compare current and next routes
    // If we don't have the next step data yet, we'll check after navigation
    const pageChanging = nextStepIndex < totalSteps && currentStep.route !== null;
    const isMobile = window.innerWidth < 640;
    
    // Calculate a new position if we're changing pages OR we're on mobile
    // This moves Fundi to different positions on mobile to showcase different cards
    if (pageChanging || isMobile) {
      // Only calculate new position if page is changing
      const isMobile = window.innerWidth < 640;
      const nextPosition = getFundiPosition(nextStepIndex, isMobile);
      
      // Call the next step immediately
      nextStep();
      
      // Animate Fundi to move to a new position for the next page
      setTimeout(() => {
        // Keep Fundi visible at the current position until the new step's position is calculated
        if (!animate) {
          setPosition(currentPosition);
        }
        
        // Set new position for an engaging animated transition
        setTargetPosition(nextPosition);
        setAnimate(true);
        console.log(`Fundi transitioning to: x=${nextPosition.x}px, y=${nextPosition.y}px for step ${nextStepIndex} ${pageChanging ? '(page changed)' : '(mobile position change)'}`);
        
        setThinking(false);
        setIsTransitioning(false);
      }, 300);
    } else {
      // No page change, keep Fundi in the same position
      console.log(`Keeping Fundi in current position for step ${nextStepIndex} (same page)`);
      
      // Call the next step immediately
      nextStep();
      
      // Just update state without changing position
      setTimeout(() => {
        setThinking(false);
        setIsTransitioning(false);
      }, 300);
    }
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    if (isTransitioning) return;
    
    // Log button press for debugging
    console.log("Back button clicked - returning to previous step");
    
    setIsTransitioning(true);
    
    // Preserve Fundi's current position during transition
    const currentPosition = {...position};
    
    // Remove any highlights before transitioning
    cleanupTourHighlights();
    
    // Make Fundi think to indicate processing
    setThinking(true);
    
    // Get the current and previous step info
    const prevStepIndex = Math.max(0, currentStepIndex - 1);
    
    // Safety check - we shouldn't be here if currentStep is null, but just to be extra safe
    if (!currentStep) {
      // If somehow we don't have currentStep, just go to the previous step without animations
      prevStep();
      setIsTransitioning(false);
      return;
    }
    
    // We're checking if we need to move Fundi
    // If we're at step 0 or moving within the same page, we don't need to move Fundi on desktop
    const pageChanging = prevStepIndex >= 0 && currentStep.route !== null;
    const isMobile = window.innerWidth < 640;
    
    // Calculate a new position if we're changing pages OR we're on mobile
    // This moves Fundi to different positions on mobile to showcase different cards
    if (pageChanging || isMobile) {
      // Only calculate new position if page is changing
      const isMobile = window.innerWidth < 640;
      const prevPosition = getFundiPosition(prevStepIndex, isMobile);
      
      // Call the previous step immediately
      prevStep();
      
      // Animate Fundi to move to a new position for the previous page
      setTimeout(() => {
        // Keep Fundi visible at the current position until the new step's position is calculated
        if (!animate) {
          setPosition(currentPosition);
        }
        
        // Set new position for an engaging animated transition
        setTargetPosition(prevPosition);
        setAnimate(true);
        console.log(`Fundi transitioning to: x=${prevPosition.x}px, y=${prevPosition.y}px for step ${prevStepIndex} ${pageChanging ? '(page changed)' : '(mobile position change)'}`);
        
        setThinking(false);
        setIsTransitioning(false);
      }, 300);
    } else {
      // No page change, keep Fundi in the same position
      console.log(`Keeping Fundi in current position for step ${prevStepIndex} (same page)`);
      
      // Call the previous step immediately
      prevStep();
      
      // Just update state without changing position
      setTimeout(() => {
        setThinking(false);
        setIsTransitioning(false);
      }, 300);
    }
  };
  
  // Debug function to track clicks on Fundi elements
  useEffect(() => {
    // Only run if tour is active
    if (!isTourActive || !currentStep) return;
    
    // Add emergency click handlers to handle edge cases (e.g., if bubbling is blocked)
    const addEmergencyListeners = () => {
      // Find all buttons in the tour
      const tourButtons = document.querySelectorAll('[data-tour-button]');
      console.log(`Added emergency click handlers to ${tourButtons.length} Fundi elements`);
      
      // Add direct click handlers to each button as a fallback
      tourButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          // Cast to HTMLElement to access dataset
          const buttonType = (button as HTMLElement).dataset.tourButton;
          if (buttonType === 'next') {
            handleNextStep();
          } else if (buttonType === 'back') {
            handlePrevStep();
          } else if (buttonType === 'skip') {
            skipTour();
          }
        });
      });
    };
    
    // Call immediately and also on any position changes
    addEmergencyListeners();
    
    // Add visibility monitor to help prevent disappearing issues
    const addVisibilityMonitors = () => {
      const fundiElements = document.querySelectorAll('.robot-container, [data-tour-button]');
      console.log(`Added emergency visibility handlers to ${fundiElements.length} Fundi elements`);
    };
    
    // Set up visibility monitors
    addVisibilityMonitors();
    
    // Log current position for debugging
    console.log(`Fundi position: top=${position.y}px, right=${position.x}px, translate(${position.x}px, ${position.y}px)`);
    
    // Set up interval to check if Fundi is still visible
    const interval = setInterval(() => {
      // Check if Fundi elements are visible
      const fundiRobot = document.querySelector('.robot-container');
      if (fundiRobot) {
        console.log('Fundi robot is visible');
      } else {
        console.log('Fundi robot is NOT visible - potential issue');
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isTourActive, currentStep, position]);

  if (!isTourActive || !currentStep) {
    return null;
  }

  return (
    <>
      {/* Invisible overlay to capture clicks anywhere on the screen */}
      <div 
        className="fixed inset-0 z-[99990]" 
        onClick={() => {
          // Click anywhere to advance the tour
          if (!isTransitioning && currentStepIndex < totalSteps - 1) {
            console.log("Overlay clicked - advancing to next step");
            handleNextStep();
          }
        }}
      />
      
      {/* Fundi Robot with fixed position and limited animation - now contains the speech bubble */}
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
          stiffness: 100, 
          damping: 15, 
          mass: 1,
          velocity: 2
        }}
        style={{ 
          pointerEvents: 'auto',
          width: '80px', 
          height: '80px',
          willChange: 'transform', // Optimize for animation performance
          position: 'relative' // Added for proper child positioning
        }}
      >
        {/* Fundi Character */}
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
        
        {/* Speech Bubble is now a child of Fundi for proper anchoring */}
        <motion.div
          className="absolute z-[99998] bg-white rounded-2xl shadow-lg border border-gray-200 p-3.5"
          onClick={(e) => e.stopPropagation()} // Prevent clicks on the speech bubble from advancing tour
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1
          }}
          transition={{ 
            type: "spring", 
            stiffness: 90, 
            damping: 16,
            mass: 0.8,
            delay: 0.05 // Slight delay after Fundi moves
          }}
          style={{ 
            width: '220px', // Larger width for better text display
            maxWidth: '220px', // Matching max width
            height: '220px', // Taller to show more content
            maxHeight: '220px', // Matching max height
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
            willChange: 'transform', // Performance optimization
            transformOrigin: 'center top', // Consistent transform origin
            overflowY: 'auto', // Allow scrolling if content is too tall
            top: '0px', // Align with Fundi vertically
            left: '85px' // Position to the right of Fundi
          }}
        >
          {/* No pointer for cleaner look - bubble is now directly attached to Fundi */}
          
          {/* Tour Content */}
          <div className="font-semibold text-sm mb-1.5">{currentStep.title}</div>
          <p className="text-gray-700 text-xs leading-relaxed mb-2.5">{currentStep.content}</p>
          
          {/* Progress bar */}
          <div className="mb-2">
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
          
          {/* Navigation buttons - optimized for mobile */}
          <div className="flex justify-between">
            <div className="flex gap-0.5 sm:gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Back button clicked directly");
                  handlePrevStep();
                }}
                disabled={currentStepIndex === 0 || isTransitioning}
                className="h-7 sm:h-7 px-1.5 sm:px-2 text-xs sm:text-xs"
                data-tour-button="back"
              >
                <ChevronLeft className="h-3.5 sm:h-3.5 w-3.5 sm:w-3.5 mr-0.5 sm:mr-1" />
                <span className="hidden sm:inline">{window.innerWidth < 480 ? '' : 'Back'}</span>
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
                className="h-7 sm:h-7 px-1.5 sm:px-2 text-xs sm:text-xs"
                data-tour-button="skip"
              >
                <X className="h-3.5 sm:h-3.5 w-3.5 sm:w-3.5 mr-0.5 sm:mr-1" />
                <span className="hidden sm:inline">{window.innerWidth < 480 ? '' : 'Skip'}</span>
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
              className="h-7 sm:h-7 px-2 sm:px-3 text-xs sm:text-xs"
              data-tour-button="next" // Identifier for the button
            >
              <span className="hidden sm:inline">{currentStepIndex === totalSteps - 1 ? 'Finish' : 'Next'}</span>
              {currentStepIndex < totalSteps - 1 ? (
                <ChevronRight className="h-3.5 sm:h-3.5 w-3.5 sm:w-3.5 ml-0 sm:ml-1" />
              ) : (
                <Check className="h-3.5 sm:h-3.5 w-3.5 sm:w-3.5 ml-0 sm:ml-1" />
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}