import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import RobotFundi from '@/components/robot-fundi';
import { useTour } from './tour-context';
import { useTourSteps } from './tour-steps';

const TourGuide: React.FC = () => {
  const { isTourActive, currentStep, totalSteps, nextStep, prevStep, endTour } = useTour();
  const tourSteps = useTourSteps();
  const [position, setPosition] = useState({ top: window.innerHeight / 2 - 150, left: window.innerWidth / 2 - 175 });
  const [animationKey, setAnimationKey] = useState(0);
  const positionRef = useRef(position);

  // Update the ref whenever position changes
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  // Set up step positioning only when current step changes
  useEffect(() => {
    if (!isTourActive || currentStep >= tourSteps.length) return;

    const step = tourSteps[currentStep];
    
    const calculatePosition = () => {
      let targetElement: HTMLElement | null = null;
      
      if (step.target === 'body') {
        // Center in the viewport
        setPosition({
          top: window.innerHeight / 2 - 150,
          left: window.innerWidth / 2 - 175,
        });
        
        // Make sure we're at the top if using center placement
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      
      // Find the target element
      targetElement = document.querySelector(`[data-tour-id="${step.target}"]`) as HTMLElement;
      
      if (!targetElement) {
        console.warn(`Target element not found: ${step.target}`);
        // Default to center
        setPosition({
          top: window.innerHeight / 2 - 150,
          left: window.innerWidth / 2 - 175,
        });
        return;
      }

      const rect = targetElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Default positions
      let top = rect.top;
      let left = rect.left;

      // Adjust based on placement
      switch (step.placement) {
        case 'top':
          top = rect.top - 225; // Above the element
          left = rect.left + rect.width / 2 - 175;
          break;
        case 'bottom':
          top = rect.bottom + 20; // Below the element
          left = rect.left + rect.width / 2 - 175;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - 100;
          left = rect.left - 375; // To the left
          break;
        case 'right':
          top = rect.top + rect.height / 2 - 100;
          left = rect.right + 20; // To the right
          break;
        case 'center':
          // Center in the viewport
          top = window.innerHeight / 2 - 150;
          left = window.innerWidth / 2 - 175;
          break;
      }
      
      // Ensure the popup stays within viewport bounds
      if (left < 20) left = 20;
      if (left > viewportWidth - 370) left = viewportWidth - 370;
      if (top < 20) top = 20;
      if (top > viewportHeight - 200) top = viewportHeight - 200;
      
      setPosition({ top, left });
      
      // Ensure the element is in view by scrolling to it
      const elementTop = rect.top + window.scrollY;
      const elementBottom = rect.bottom + window.scrollY;
      const halfViewportHeight = window.innerHeight / 2;
      
      // Calculate where to scroll to ensure both the target element and the tooltip are visible
      let scrollTo;
      
      switch (step.placement) {
        case 'top':
          // Scroll to have the element at the bottom half of the screen
          scrollTo = elementTop - halfViewportHeight + (rect.height / 2);
          break;
        case 'bottom': 
          // Scroll to have the element at the top half of the screen
          scrollTo = elementTop - halfViewportHeight + (rect.height / 2);
          break;
        case 'left':
        case 'right':
          // Center the element vertically
          scrollTo = elementTop - halfViewportHeight + (rect.height / 2);
          break;
        default:
          // Ensure the element is visible in the viewport
          scrollTo = elementTop - 100;
      }
      
      // Ensure we don't scroll below or above the document
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      scrollTo = Math.max(0, Math.min(scrollTo, maxScroll));
      
      // Perform smooth scrolling
      window.scrollTo({
        top: scrollTo,
        behavior: 'smooth'
      });
      
      // Highlight the element if needed
      if (step.highlightColor && targetElement) {
        const originalBorder = targetElement.style.border;
        const originalBoxShadow = targetElement.style.boxShadow;
        
        targetElement.style.border = `2px solid ${step.highlightColor}`;
        targetElement.style.boxShadow = `0 0 15px ${step.highlightColor}`;
        
        return () => {
          if (targetElement) {
            targetElement.style.border = originalBorder;
            targetElement.style.boxShadow = originalBoxShadow;
          }
        };
      }
    };

    calculatePosition();

    // Reset the animation key to trigger animation
    setAnimationKey(prev => prev + 1);
    
    // Handle window resize
    const handleResize = () => calculatePosition();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [currentStep, isTourActive]);

  if (!isTourActive) return null;

  // Ensure we don't go beyond the array bounds
  const stepIndex = Math.min(currentStep, tourSteps.length - 1);
  const currentTourStep = tourSteps[stepIndex];
  
  // Determine the category based on highlight color
  let fundiCategory = 'general';
  if (currentTourStep?.highlightColor) {
    if (currentTourStep.highlightColor === '#f97316') fundiCategory = 'learning';
    else if (currentTourStep.highlightColor === '#22c55e') fundiCategory = 'finance';
    else if (currentTourStep.highlightColor === '#3b82f6') fundiCategory = 'career';
    else if (currentTourStep.highlightColor === '#a855f7') fundiCategory = 'wellness';
    else if (currentTourStep.highlightColor === '#ec4899') fundiCategory = 'fitness';
    else if (currentTourStep.highlightColor === '#ef4444') fundiCategory = 'emergency';
  }
  
  return (
    <AnimatePresence>
      {isTourActive && (
        <div className="fixed inset-0 z-[100000] bg-black/30 flex items-center justify-center"
             onClick={(e) => {
               // Only close if clicking the backdrop
               if (e.target === e.currentTarget) {
                 endTour();
               }
             }}>
          <motion.div
            key={`tour-step-${currentStep}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              zIndex: 100001,
            }}
          >
            {/* Tour Content */}
            <Card className="w-[350px] shadow-lg border-2 border-[#1C3D5A] relative bg-white">
              {/* Larger box by 5px all around */}
              <div className="absolute -inset-[5px] rounded-xl bg-white/10 backdrop-blur-sm -z-10"></div>
              
              {/* Fundi Character - Positioned at the center top of the card */}
              <div className="absolute -top-[65px] left-1/2 transform -translate-x-1/2 z-10">
                {currentTourStep?.showFundiAnimation ? (
                  <motion.div
                    key={`fundi-animation-${currentStep}-${animationKey}`}
                    initial={{ y: 0 }}
                    animate={
                      currentTourStep.animationType === 'wave' 
                        ? { rotate: [0, 15, -15, 15, -15, 0] }
                        : currentTourStep.animationType === 'jump' 
                          ? { y: [0, -20, 0, -10, 0] }
                          : currentTourStep.animationType === 'spin' 
                            ? { rotate: [0, 360] }
                            : currentTourStep.animationType === 'dance' 
                              ? { x: [0, 10, -10, 10, -10, 0], y: [0, -5, 0, -5, 0] }
                              : currentTourStep.animationType === 'nod' 
                                ? { y: [0, 5, 0, 5, 0] }
                                : currentTourStep.animationType === 'point' 
                                  ? { x: [0, 15, 0] }
                                  : {}
                    }
                    transition={{ 
                      duration: 1.5, 
                      repeat: currentTourStep.animationType === 'dance' ? 1 : 0,
                      ease: "easeInOut" 
                    }}
                  >
                    <RobotFundi 
                      size="lg"
                      category={fundiCategory}
                      emotion="happy"
                    />
                  </motion.div>
                ) : (
                  <RobotFundi 
                    size="lg"
                    category={fundiCategory}
                    emotion="happy"
                  />
                )}
              </div>
              
              <CardContent className="pt-16 pb-6 px-6">
                {/* Close Button */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 h-6 w-6" 
                  onClick={endTour}
                >
                  <X className="h-4 w-4" />
                </Button>
                
                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-center text-[#1C3D5A]">
                    {currentTourStep?.title || 'Welcome to Fundamenta'}
                  </h3>
                  <p className="text-sm text-center text-gray-700">
                    {currentTourStep?.content || 'Let me guide you through our platform!'}
                  </p>
                </div>
                
                {/* Tour Navigation */}
                <div className="flex justify-between items-center mt-6">
                  <div className="flex space-x-1">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                      <div
                        key={`dot-${i}`}
                        className={`h-2 w-2 rounded-full ${
                          i === currentStep ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    {currentStep > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={prevStep}
                        className="flex items-center"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Back
                      </Button>
                    )}
                    
                    <Button
                      variant="default"
                      size="sm"
                      onClick={nextStep}
                      className="flex items-center"
                    >
                      {currentStep === totalSteps - 1 ? 'Finish' : 'Next'} <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TourGuide;