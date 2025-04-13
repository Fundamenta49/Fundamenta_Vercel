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
  
  // Check if we're on the vehicle maintenance page - if so, don't show this tour guide
  // as it will conflict with the emergency fix
  const isVehicleMaintenancePage = typeof window !== 'undefined' && 
    window.location.pathname.includes('/learning/courses/vehicle-maintenance');
  
  // If we're on the vehicle maintenance page, don't render anything
  if (isVehicleMaintenancePage) {
    return null;
  }
  
  // State to track animation and interaction
  const [speaking, setSpeaking] = useState(false);
  const [thinking, setThinking] = useState(false);
  
  // Default positions with safety margins - centered for desktop
  const defaultPosition = useRef({ 
    x: Math.max(window.innerWidth / 2 - 200, 20), 
    y: Math.max(window.innerHeight / 2 - 300, 20) 
  });
  const [position, setPosition] = useState(defaultPosition.current);
  
  // Calculate progress percentage
  const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;
  
  // Handle window resize and apply mobile mode as needed
  useEffect(() => {
    const handleResize = () => {
      // Check if device is mobile (both by viewport width or touch capability)
      const isMobileDevice = window.innerWidth < 768 || window.matchMedia('(any-pointer: coarse)').matches;
      
      if (isMobileDevice) {
        // For mobile, we'll use CSS positioning instead of JavaScript
        // Just set a fixed position that will be overridden by CSS
        setPosition({ 
          x: 10,
          y: 10
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
          setPosition(defaultPosition.current);
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
  }, [currentStep]);
  
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
      document.querySelectorAll(
        '.tour-highlight, .tour-highlight-sm, .tour-highlight-md, .tour-highlight-lg, .tour-highlight-life-skills, .tour-highlight-finance, .tour-highlight-career, .tour-highlight-wellness, .tour-highlight-wellness-nutrition, .tour-highlight-active, .tour-highlight-emergency, .tour-highlight-calendar, .tour-highlight-arcade'
      ).forEach(el => {
        el.classList.remove('tour-highlight');
        el.classList.remove('tour-highlight-sm');
        el.classList.remove('tour-highlight-md');
        el.classList.remove('tour-highlight-lg');
        el.classList.remove('tour-highlight-life-skills');
        el.classList.remove('tour-highlight-finance');
        el.classList.remove('tour-highlight-career');
        el.classList.remove('tour-highlight-wellness');
        el.classList.remove('tour-highlight-wellness-nutrition');
        el.classList.remove('tour-highlight-active');
        el.classList.remove('tour-highlight-emergency');
        el.classList.remove('tour-highlight-calendar');
        el.classList.remove('tour-highlight-arcade');
      });
      
      // Add highlight to target element
      const targetElement = document.querySelector(currentStep.targetSelector);
      if (targetElement) {
        targetElement.classList.add('tour-highlight');
        
        // Get highlight size from step or default to medium
        const highlightSize = currentStep.highlightSize || 'md';
        targetElement.classList.add(`tour-highlight-${highlightSize}`);
        
        // Add category-specific highlight based on step ID
        const stepId = currentStep.id.toLowerCase();
        if (stepId.includes('life-skills')) {
          targetElement.classList.add('tour-highlight-life-skills');
        } else if (stepId.includes('finance')) {
          targetElement.classList.add('tour-highlight-finance');
        } else if (stepId.includes('career')) {
          targetElement.classList.add('tour-highlight-career');
        } else if (stepId.includes('wellness-nutrition')) {
          targetElement.classList.add('tour-highlight-wellness-nutrition');
        } else if (stepId.includes('wellness')) {
          targetElement.classList.add('tour-highlight-wellness');
        } else if (stepId.includes('active')) {
          targetElement.classList.add('tour-highlight-active');
        } else if (stepId.includes('emergency')) {
          targetElement.classList.add('tour-highlight-emergency');
        } else if (stepId.includes('calendar')) {
          targetElement.classList.add('tour-highlight-calendar');
        } else if (stepId.includes('arcade')) {
          targetElement.classList.add('tour-highlight-arcade');
        }
        
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
      document.querySelectorAll(
        '.tour-highlight, .tour-highlight-sm, .tour-highlight-md, .tour-highlight-lg, .tour-highlight-life-skills, .tour-highlight-finance, .tour-highlight-career, .tour-highlight-wellness, .tour-highlight-wellness-nutrition, .tour-highlight-active, .tour-highlight-emergency, .tour-highlight-calendar, .tour-highlight-arcade'
      ).forEach(el => {
        el.classList.remove('tour-highlight');
        el.classList.remove('tour-highlight-sm');
        el.classList.remove('tour-highlight-md');
        el.classList.remove('tour-highlight-lg');
        el.classList.remove('tour-highlight-life-skills');
        el.classList.remove('tour-highlight-finance');
        el.classList.remove('tour-highlight-career');
        el.classList.remove('tour-highlight-wellness');
        el.classList.remove('tour-highlight-wellness-nutrition');
        el.classList.remove('tour-highlight-active');
        el.classList.remove('tour-highlight-emergency');
        el.classList.remove('tour-highlight-calendar');
        el.classList.remove('tour-highlight-arcade');
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
      {/* Semi-transparent overlay with subtle blur effect */}
      <motion.div 
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[9990]"
        onClick={skipTour}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
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
          width: isMobile ? '60px' : '140px', 
          height: isMobile ? '60px' : '140px',
          willChange: 'transform'
        }}
      >
        {/* Fundi Character */}
        <div className={cn(
          isMobile ? "w-16 h-16" : "w-32 h-32",
          "tour-fundi-robot"
        )}>
          <FundiPersonalityAdapter>
            <RobotFundi
              speaking={speaking}
              thinking={thinking}
              size={isMobile ? "sm" : "lg"}
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
              "absolute bg-white rounded-xl shadow-xl p-5 text-sm md:text-base md:p-6 border border-gray-100",
              "w-64 sm:w-80 md:w-96 max-w-[calc(100vw-40px)]",
              isMobile ? "mobile-speech-bubble" : "",
              placement === 'right' && isMobile ? "left-24 top-0" : "left-32 top-0",
              placement === 'left' && isMobile ? "right-24 top-0" : "right-32 top-0",
              placement === 'top' && isMobile ? "bottom-20 left-0" : "bottom-32 left-0",
              placement === 'bottom' && isMobile ? "top-20 left-0" : "top-32 left-0",
              placement === 'center' && isMobile ? "top-20 left-0" : "top-32 left-0"
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            style={{
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(8px)'
            }}
          >
            {/* Title */}
            <motion.h3 
              className="font-bold text-lg md:text-xl mb-2 md:mb-3"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {currentStep.title}
            </motion.h3>
            
            {/* Content */}
            <motion.p 
              className="mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {currentStep.content}
            </motion.p>
            
            {/* Progress Bar */}
            <div className="w-full h-1 bg-gray-200 rounded-full mb-4">
              <div
                className="h-1 bg-blue-500 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            {/* Controls */}
            <div className="flex justify-between items-center">
              <div className="flex gap-1 sm:gap-2">
                {/* Previous button (conditionally shown) */}
                {currentStepIndex > 0 && currentStep.showPrevButton !== false && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevStep}
                    className="gap-1 px-2 sm:px-3"
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
                    className="text-gray-500 px-2 sm:px-3"
                  >
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline">Skip</span>
                  </Button>
                )}
              </div>
              
              {/* Next/Finish button */}
              <Button
                variant="default"
                size="sm"
                onClick={nextStep}
                className="gap-1 px-2 sm:px-3"
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