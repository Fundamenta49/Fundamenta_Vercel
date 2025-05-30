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
  // Initial position moved to left side to ensure Fundi stays fully on screen
  const [position, setPosition] = useState({ x: 80, y: 80 });
  const [targetPosition, setTargetPosition] = useState({ x: 80, y: 80 });
  console.log("FundiTourGuide mounted with initial position:", { x: 80, y: 80 });
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
  
  // EMERGENCY FIX: Apply direct DOM manipulations to ensure tour displays correctly
  useEffect(() => {
    if (isTourActive) {
      // Add observer to watch for any tour dialogs appearing and fix their position
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length) {
            // Check for any added tour dialogs
            mutation.addedNodes.forEach((node) => {
              if (node instanceof HTMLElement && 
                  (node.hasAttribute('data-tour-dialog') || 
                   node.querySelector('[data-tour-dialog]'))) {
                
                // Apply fix
                const dialogEl = node.hasAttribute('data-tour-dialog') ? 
                  node : node.querySelector('[data-tour-dialog]');
                
                if (dialogEl && dialogEl instanceof HTMLElement) {
                  // Force to bottom-right corner
                  dialogEl.style.position = 'fixed';
                  dialogEl.style.bottom = '10px';
                  dialogEl.style.right = '10px';
                  dialogEl.style.left = 'auto';
                  dialogEl.style.top = 'auto';
                  dialogEl.style.maxWidth = '90vw';
                  dialogEl.style.width = '320px';
                  dialogEl.style.zIndex = '999999';
                  
                  console.log('Emergency position fix applied to tour dialog');
                }
              }
            });
          }
        });
      });
      
      // Start observing the document
      observer.observe(document.body, { childList: true, subtree: true });
      
      // Cleanup observer on dismount
      return () => observer.disconnect();
    }
  }, [isTourActive]);
  
  // Get positions based on feature cards on the page and tour step
  const getFundiPosition = (stepIndex: number, isMobile: boolean) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // For mobile devices, we'll use fixed positioning controlled by CSS instead of calculating positions
    // This provides a more consistent experience on small screens
    if (isMobile || viewportWidth < 640) {
      // Return a dummy position that will be overridden by CSS in mobile mode
      // We're using { x: 0, y: 0 } because our CSS will apply transformX(-50%) to center the robot
      console.log("Using mobile optimized positioning mode");
      document.body.classList.add('tour-mobile-mode');
      return { x: 0, y: 0 };
    } else {
      // For desktop, ensure we're not using mobile mode
      document.body.classList.remove('tour-mobile-mode');
      console.log("Using desktop positioning mode");
    }
    
    // Desktop positioning logic - keeps the existing functionality for desktop
    // Find all the feature cards on the page - looking specifically for cards in grid sections
    const featureCards = document.querySelectorAll('.card');
    const cardPositions: Array<{ x: number; y: number; element: Element }> = [];
    
    // Calculate safe boundaries for positioning
    // The speech bubble is 250px wide, and Fundi is 80px wide
    // We need at least 330px of total width - to ensure both fit on screen
    // We'll constrain placement to keep Fundi and chat box in safe zones 
    const FUNDI_WIDTH = 80;
    const BUBBLE_WIDTH = 250;
    const SAFE_RIGHT_MARGIN = FUNDI_WIDTH + 20; // Fundi width + safety margin
    
    // For safety, modify margin based on window width
    // Larger screens can accommodate more complex positioning, but we need a bigger margin
    // Increase the safety margin for all screens to ensure content stays visible
    const safetyMargin = viewportWidth < 768 ? viewportWidth * 0.5 : 350;
    
    // Maximum allowed X position - prevents Fundi from getting too close to the right edge 
    // This ensures both Fundi and the speech bubble remain fully visible on screen
    const maxSafeX = viewportWidth - SAFE_RIGHT_MARGIN - safetyMargin;
    console.log(`Screen size: ${viewportWidth}x${viewportHeight}, Safe max X position: ${maxSafeX}`);
    
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
              // Ensure we don't place too far right
              x: Math.min(rect.left - 60, maxSafeX), 
              y: Math.min(rect.top + 20, viewportHeight - 100),
              element: card
            });
          } else {
            // Position to the right of odd-indexed cards
            cardPositions.push({
              // Ensure we don't place too far right
              x: Math.min(rect.right + 20, maxSafeX),
              y: Math.min(rect.top + 20, viewportHeight - 100),
              element: card
            });
          }
        }
      });
    }
    
    // If no cards found or on small desktop screens, use fallback positions
    if (cardPositions.length === 0) {
      // Use the previously calculated maxSafeX to keep Fundi from going too far right
      // This ensures speech bubble stays on screen
      
      // Calculate ideal positions that adapt to screen size safely
      const leftSide = Math.min(viewportWidth * 0.2, 100); // 20% of screen width or 100px, whichever is smaller
      const centerLeft = Math.min(viewportWidth * 0.3, maxSafeX);
      const center = Math.min(viewportWidth * 0.4, maxSafeX);
      
      // Top safe margin - keep robot in view
      const topMargin = Math.min(100, viewportHeight * 0.1);
      // Keep robot away from bottom edge
      const bottomSafeY = viewportHeight - 150;
      
      // Create a variety of safe positions around the screen
      const fallbackPositions = [
        // Left side positions (where speech bubble appears to right of Fundi)
        { x: leftSide, y: topMargin }, // Top left
        { x: leftSide, y: Math.min(viewportHeight * 0.3, bottomSafeY) }, // Middle-upper left
        { x: leftSide, y: Math.min(viewportHeight * 0.5, bottomSafeY) }, // Middle left
        
        // Middle positions
        { x: centerLeft, y: topMargin }, // Top center-left
        { x: center, y: Math.min(topMargin + 50, viewportHeight * 0.2) }, // Top center
        
        // Keep all X positions within the safe boundary
        { x: Math.min(centerLeft, maxSafeX), y: Math.min(viewportHeight * 0.4, bottomSafeY) } // Middle center-left
      ];
      
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
    // Use the previously calculated maxSafeX to keep Fundi in the safe zone
    // This ensures speech bubble stays on screen too
    const finalPosition = {
      x: Math.max(20, Math.min(selectedPosition.x, maxSafeX)),
      y: Math.max(20, Math.min(selectedPosition.y, viewportHeight - 150))
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
  
  // EMERGENCY FIX: Simple mechanism to ensure tour positions correctly
  // Track when the component has mounted/updated for a given step
  const [hasRendered, setHasRendered] = useState(false);
  
  // Special handler for any steps that need fixed positioning
  useEffect(() => {
    // Only run for active tour with a current step that has fixedPosition property
    if (isTourActive && currentStep?.fixedPosition) {
      // Use the explicitly defined fixed position
      const fixedPosition = currentStep.fixedPosition;
      setPosition(fixedPosition);
      console.log(`Fixed position applied for step ${currentStepIndex}:`, fixedPosition);
      
      // For steps that specify to skip scroll, use Intersection Observer instead
      if (currentStep.skipScroll && currentStep.highlightSelector) {
        // Use Intersection Observer to detect when the content is visible
        const observer = new IntersectionObserver((entries) => {
          const entry = entries[0];
          if (entry.isIntersecting) {
            // When the content is visible, highlight it
            entry.target.classList.add('tour-highlight');
            
            // Make sure Fundi stays at the fixed position
            setPosition(fixedPosition);
          }
        }, {
          threshold: 0.1 // Trigger when at least 10% of the target is visible
        });
        
        // Observe the element
        const element = document.querySelector(currentStep.highlightSelector);
        if (element) {
          observer.observe(element);
          element.classList.add('tour-highlight');
          
          // Don't auto-scroll, but ensure the element is highlighted
          console.log(`Using fixed positioning without auto-scroll for ${currentStep.highlightSelector}`);
        }
        
        return () => {
          if (element) {
            observer.unobserve(element);
            element.classList.remove('tour-highlight');
          }
        };
      }
    }
  }, [isTourActive, currentStep, currentStepIndex]);

  // Simple effect to update Fundi's position based on the current step
  useEffect(() => {
    if (!isTourActive || !currentStep) return;
    
    // Ensure we only run this once per component mount
    if (hasRendered) return;
    setHasRendered(true);
    
    // Store the step index to avoid stale closures 
    const stepIndex = currentStepIndex;
    
    // Use a forced delay to ensure we don't get race conditions
    setTimeout(() => {
      // Basic animations for Fundi
      setThinking(true);
      setTimeout(() => {
        setThinking(false);
        setSpeaking(true);
        setTimeout(() => setSpeaking(false), 2000);
      }, 800);
      
      // Enhanced mobile device detection - adds tour-mobile-mode class to body for CSS targeting
      const isMobile = window.innerWidth < 640;
      
      // Apply mobile mode class to body for consistent styling
      if (isMobile) {
        document.body.classList.add('tour-mobile-mode');
        
        // Special handling for vehicle maintenance page on mobile
        if (currentStep.route?.includes('vehicle-maintenance')) {
          console.log("Emergency fix applied for vehicle maintenance page");
          // Add additional class for vehicle maintenance specific styling
          document.body.classList.add('tour-vehicle-page');
        } else if (currentStep.route?.includes('/finance')) {
          console.log("Emergency fix applied for finance page");
          // Add additional class for finance page specific styling  
          document.body.classList.add('tour-finance-page');
        } else {
          // Remove special page classes when not needed
          document.body.classList.remove('tour-vehicle-page');
          document.body.classList.remove('tour-finance-page');
        }
      } else {
        document.body.classList.remove('tour-mobile-mode');
        document.body.classList.remove('tour-vehicle-page');
        document.body.classList.remove('tour-finance-page');
      }
      
      // Check if this step has special positioning needs
      if (currentStep.fixedPosition) {
        // Use the explicitly defined fixed position from the step
        setPosition(currentStep.fixedPosition);
        console.log(`Using fixed position from step config: x=${currentStep.fixedPosition.x}px, y=${currentStep.fixedPosition.y}px`);
      } else if (isMobile) {
        // On mobile devices, force the position to be centered at bottom
        // These coordinates are intentionally set to 0,0 for mobile as the CSS will handle positioning
        setPosition({ x: 0, y: 0 });
        setTargetPosition({ x: 0, y: 0 });
        console.log("Mobile device detected: Using CSS-controlled fixed position");
      } else {
        // Normal positioning for desktop steps
        const position = getFundiPosition(stepIndex, isMobile);
        setTargetPosition(position);
        setPosition(position); // Set position directly
      }
      
      setAnimate(true);
      console.log(`FIXED: Fundi positioned for step ${stepIndex}`);
      
      // Handle highlighting if needed
      if (currentStep.highlightSelector) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        
        timeoutRef.current = setTimeout(() => {
          const element = document.querySelector(currentStep.highlightSelector as string);
          if (element) {
            // Only scroll if not explicitly disabled with skipScroll
            if (!currentStep.skipScroll) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
              // For steps with skipScroll, highlight but don't auto-scroll
              // Position the viewport at the top to ensure Fundi is visible
              window.scrollTo({ top: 0, behavior: 'smooth' });
              console.log(`Skip scroll applied for step ${stepIndex}, highlighting without scrolling`);
            }
            element.classList.add('tour-highlight');
          }
        }, 800);
      }
    }, 300);
    
    // Cleanup
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      document.querySelectorAll('.tour-highlight, .tour-card-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
        el.classList.remove('tour-card-highlight');
      });
      document.body.classList.remove('tour-mobile-mode');
    };
  }, [isTourActive, currentStep, currentStepIndex]);
  
  // Update position when target changes
  useEffect(() => {
    if (animate) {
      setPosition(targetPosition);
      setAnimate(false);
    }
  }, [targetPosition, animate]);
  
  // We're now using direct calls to context methods (nextStep) instead of complex handlers
  
  // We're now using direct calls to context methods
  
  // Setup visibility monitors
  useEffect(() => {
    // Only run if tour is active
    if (!isTourActive || !currentStep) return;
    
    // Add visibility monitors
    const fundiElements = document.querySelectorAll('.robot-container, [data-tour-button]');
    console.log(`Added visibility handlers to ${fundiElements.length} Fundi elements`);
    
    // Log current position for debugging
    console.log(`Fundi position: top=${position.y}px, right=${position.x}px, translate(${position.x}px, ${position.y}px)`);
    
    return () => {};
  }, [isTourActive, currentStep, position]);

  if (!isTourActive || !currentStep) {
    return null;
  }

  return (
    <>
      {/* Invisible overlay to capture clicks anywhere on the screen */}
      <div 
        className="fixed inset-0 z-[99990] cursor-pointer" 
        onClick={(e) => {
          // Simple, direct click handler
          e.stopPropagation();
          e.preventDefault();
          
          // Prevent multiple clicks
          const overlayElement = e.currentTarget as HTMLDivElement;
          if (overlayElement) {
            overlayElement.style.pointerEvents = 'none';
            
            // Re-enable after a delay
            setTimeout(() => {
              if (overlayElement) {
                overlayElement.style.pointerEvents = 'auto';
              }
            }, 1000);
          }
          
          if (currentStepIndex < totalSteps - 1) {
            console.log("Overlay clicked - advancing to next step");
            
            // Special handling for vehicle maintenance step
            if (currentStep?.route === '/learning/courses/vehicle-maintenance') {
              console.log("EMERGENCY FIX: Advancing tour from step", currentStepIndex, "to", currentStepIndex + 1);
              // Force scroll to top before advancing to keep Fundi visible
              window.scrollTo({ top: 0, behavior: 'auto' });
            }
            
            // Only advance if we're not at the last step
            nextStep();
          }
        }}
      />
      
      {/* Fundi Robot with fixed position and limited animation - now contains the speech bubble */}
      <motion.div
        className={`fixed z-[99999] ${window.innerWidth < 640 ? 'mobile-tour-fundi' : ''}`}
        initial={{ opacity: 1, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          x: position.x,
          y: position.y 
        }}
        transition={{ 
          type: "spring", 
          stiffness: 80, // Reduced stiffness for smoother motion
          damping: 16, // Increased damping to reduce bouncing
          mass: 1.2, // Increased mass for more "weighty" feel
          velocity: 1.5, // Reduced velocity for smoother start
          duration: 0.6 // Set a fixed minimum duration
        }}
        style={{ 
          pointerEvents: 'auto',
          width: '80px', 
          height: '80px',
          willChange: 'transform', // Optimize for animation performance
          position: 'relative', // Added for proper child positioning
          display: 'block', // Ensure it's displayed
          visibility: 'visible' // Ensure it's visible
        }}
      >
        {/* Fundi Character */}
        <div className="w-20 h-20 tour-fundi-robot">
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
          className="absolute z-[99998] bg-white rounded-2xl shadow-lg border border-gray-200 p-3.5 tour-speech-bubble"
          onClick={(e) => e.stopPropagation()} // Prevent clicks on the speech bubble from advancing tour
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1
          }}
          transition={{ 
            type: "spring", 
            stiffness: 70, // Reduced stiffness for smoother motion
            damping: 14, // Adjusted damping for smoother settling
            mass: 0.7, // Lighter mass for more "airy" feel
            delay: 0.08, // Slightly longer delay to create staggered effect
            restDelta: 0.005, // Smaller rest delta for smoother end of animation
            duration: 0.6 // Fixed duration ensures consistent timing
          }}
          style={{ 
            width: '250px', // Reduced width to avoid overflow
            maxWidth: window.innerWidth < 640 ? 'calc(100vw - 40px)' : 'calc(min(400px, 100vw - 100px))', // Responsive capping
            height: 'auto', // Auto height based on content
            maxHeight: `calc(80vh - 100px)`, // Reduced max height for better fitting
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
            willChange: 'transform', // Performance optimization
            transformOrigin: 'center top', // Consistent transform origin
            overflowY: 'auto', // Allow scrolling if content is too tall
            
            // Mobile positioning - above Fundi
            top: window.innerWidth < 640 ? 'auto' : '0px',
            bottom: window.innerWidth < 640 ? '100px' : 'auto',
            
            // Always position to ensure visibility
            right: 'auto', 
            // Handle adaptive positioning - using Math.min ensures we don't position it off-screen
            left: Math.min(0, window.innerWidth - 350) + 'px', // Dynamically adjust based on screen width
            
            // Responsive font size - slightly smaller for better fit
            fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)', 
            
            // Ensure proper stacking
            zIndex: 99998 
          }}
        >
          {/* No pointer for cleaner look - bubble is now directly attached to Fundi */}
          
          {/* Tour Content - Enhanced with contextual information */}
          <div className="font-semibold text-base mb-2">{currentStep.title}</div>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">{currentStep.content}</p>
          
          {/* Additional context for page-specific information - help users understand where they are */}
          {currentStep.route && currentStep.route !== '/' && (
            <div className="text-xs text-blue-600 mb-3">
              <span className="font-medium">You are now viewing: </span> 
              {currentStep.route.replace('/learning/courses/', 'Course: ')
                .replace('/finance/', 'Finance: ')
                .replace('/yoga-', 'Yoga: ')
                .replace('/', ' ')}
            </div>
          )}
          
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
            <div className="flex gap-1 sm:gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Back button clicked");
                  
                  // Prevent multiple clicks
                  const button = e.currentTarget as HTMLButtonElement;
                  if (button) {
                    button.disabled = true;
                    
                    // Re-enable after a delay
                    setTimeout(() => {
                      if (button) {
                        button.disabled = false;
                      }
                    }, 800);
                  }
                  
                  prevStep();
                }}
                disabled={currentStepIndex === 0}
                className="h-8 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm min-w-[40px]"
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
                  console.log("Skip button clicked");
                  skipTour();
                }}
                className="h-8 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm min-w-[40px]"
                data-tour-button="skip"
              >
                <X className="h-3.5 sm:h-3.5 w-3.5 sm:w-3.5 mr-0.5 sm:mr-1" />
                <span className="hidden sm:inline">{window.innerWidth < 480 ? '' : 'Skip'}</span>
              </Button>
            </div>
            
            <Button 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                console.log("Next button clicked");
                
                // Prevent multiple clicks
                const button = e.currentTarget as HTMLButtonElement;
                if (button) {
                  button.disabled = true;
                  
                  // Re-enable after a delay
                  setTimeout(() => {
                    if (button) {
                      button.disabled = false;
                    }
                  }, 800);
                }
                
                // Special handling for vehicle maintenance step
                if (currentStep?.route === '/learning/courses/vehicle-maintenance') {
                  console.log("EMERGENCY FIX: Advancing from vehicle maintenance page");
                  // Force scroll to top before advancing
                  window.scrollTo({ top: 0, behavior: 'auto' });
                }
                
                // Advance to next step
                nextStep();
              }}
              className="h-8 sm:h-8 px-3 sm:px-4 text-xs sm:text-sm min-w-[50px]"
              data-tour-button="next" // Identifier for the button
            >
              <span className="inline">{currentStepIndex === totalSteps - 1 ? 'Finish' : 'Next'}</span>
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