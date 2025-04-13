import React, { useState, useEffect, useRef } from 'react';
import { useTour } from '@/contexts/tours/tour-context';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import RobotFundi from '@/components/robot-fundi';
import FundiPersonalityAdapter from '@/components/fundi-personality-adapter';

/**
 * Main tour guide component that displays the Fundi avatar and tour content
 */
export default function TourGuide() {
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
  
  // State to track animation and interaction
  const [speaking, setSpeaking] = useState(false);
  const [thinking, setThinking] = useState(false);
  
  // Default positions with safety margins
  const defaultPosition = { x: 20, y: 20 };
  const [position, setPosition] = useState(defaultPosition);
  
  // Calculate progress percentage
  const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;
  
  // Handle window resize and apply mobile mode as needed
  useEffect(() => {
    const handleResize = () => {
      // Check if device is mobile (both by viewport width or touch capability)
      const isMobileDevice = window.innerWidth < 768 || window.matchMedia('(any-pointer: coarse)').matches;
      
      if (isMobileDevice) {
        // Mobile - position Fundi at the bottom left
        setPosition({ 
          x: 10,
          y: Math.max(window.innerHeight - 100, 10) 
        });
        // Apply mobile mode class to body for CSS targeting
        document.body.classList.add('tour-mobile-mode');
        
        // Log to debug
        console.log(`Mobile tour mode: width=${window.innerWidth}, height=${window.innerHeight}`);
      } else {
        // Desktop - position Fundi based on current step or default
        document.body.classList.remove('tour-mobile-mode');
        if (currentStep?.fundiPosition) {
          setPosition(currentStep.fundiPosition);
        } else {
          setPosition(defaultPosition);
        }
      }
    };
    
    // Call once immediately and add listener
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.classList.remove('tour-mobile-mode');
    };
  }, [currentStep, defaultPosition]);
  
  // Update position when step changes
  useEffect(() => {
    if (!isTourActive || !currentStep) return;
    
    // Animate Fundi when step changes
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setSpeaking(true);
      setTimeout(() => setSpeaking(false), 2000);
    }, 800);
    
    // Apply custom position if specified in step
    if (currentStep.fundiPosition) {
      setPosition(currentStep.fundiPosition);
    }
    
    // Handle element highlighting
    if (currentStep.targetSelector) {
      // Clean up any existing highlights
      document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
      });
      
      // Add highlight to target element
      const targetElement = document.querySelector(currentStep.targetSelector);
      if (targetElement) {
        targetElement.classList.add('tour-highlight');
        
        // Get highlight size from step or default to medium
        const highlightSize = currentStep.highlightSize || 'md';
        targetElement.classList.add(`tour-highlight-${highlightSize}`);
        
        // Scroll to element
        setTimeout(() => {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }, 300);
      }
    }
    
    // Clean up function
    return () => {
      document.querySelectorAll('.tour-highlight, .tour-highlight-sm, .tour-highlight-md, .tour-highlight-lg').forEach(el => {
        el.classList.remove('tour-highlight');
        el.classList.remove('tour-highlight-sm');
        el.classList.remove('tour-highlight-md');
        el.classList.remove('tour-highlight-lg');
      });
    };
  }, [isTourActive, currentStep, currentStepIndex]);
  
  // Only render when tour is active and we have a current step
  if (!isTourActive || !currentStep) return null;
  
  // Determine if on mobile (using same detection as in the effect)
  const isMobile = window.innerWidth < 768 || window.matchMedia('(any-pointer: coarse)').matches;
  
  // Determine dialog placement
  const placement = currentStep.placement || 'bottom';
  
  return (
    <>
      {/* Semi-transparent overlay */}
      <div 
        className="fixed inset-0 bg-black/30 z-[9990]"
        onClick={skipTour}
      />
      
      {/* Fundi Avatar */}
      <motion.div
        className={cn(
          "fixed z-[99999]",
          isMobile ? "mobile-tour-fundi" : ""
        )}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          x: position.x,
          y: position.y 
        }}
        transition={{ 
          type: "spring", 
          stiffness: 80,
          damping: 16
        }}
        style={{ 
          width: isMobile ? '60px' : '80px', 
          height: isMobile ? '60px' : '80px',
          willChange: 'transform'
        }}
      >
        {/* Fundi Character */}
        <div className={cn(
          isMobile ? "w-16 h-16" : "w-20 h-20",
          "tour-fundi-robot"
        )}>
          <FundiPersonalityAdapter>
            <RobotFundi
              speaking={speaking}
              thinking={thinking}
              size={isMobile ? "sm" : "md"}
              interactive={false}
              emotion="happy"
              category="tour"
            />
          </FundiPersonalityAdapter>
        </div>
        
        {/* Speech Bubble */}
        <AnimatePresence>
          <motion.div
            className={cn(
              "absolute bg-white rounded-lg shadow-lg p-4 text-sm",
              "w-64 sm:w-72 md:w-80 max-w-[calc(100vw-40px)]",
              isMobile ? "mobile-speech-bubble" : "",
              placement === 'right' && "left-24 top-0",
              placement === 'left' && "right-24 top-0",
              placement === 'top' && "bottom-20 left-0",
              placement === 'bottom' && "top-20 left-0",
              placement === 'center' && "top-20 left-0"
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Title */}
            <h3 className="font-bold text-lg mb-2">{currentStep.title}</h3>
            
            {/* Content */}
            <p className="mb-4">{currentStep.content}</p>
            
            {/* Progress Bar */}
            <div className="w-full h-1 bg-gray-200 rounded-full mb-4">
              <div
                className="h-1 bg-blue-500 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            {/* Controls */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {/* Previous button (conditionally shown) */}
                {currentStepIndex > 0 && currentStep.showPrevButton !== false && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevStep}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>
                )}
                
                {/* Skip button (conditionally shown) */}
                {currentStep.showSkipButton !== false && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={skipTour}
                    className="text-gray-500"
                  >
                    <X className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Skip</span>
                  </Button>
                )}
              </div>
              
              {/* Next/Finish button */}
              <Button
                variant="default"
                size="sm"
                onClick={nextStep}
                className="gap-1"
              >
                {currentStepIndex === totalSteps - 1 ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Finish</span>
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </>
  );
}