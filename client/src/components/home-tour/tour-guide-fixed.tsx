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
  const [animationKey, setAnimationKey] = useState(0);
  const [tourButtonPosition, setTourButtonPosition] = useState({ top: 200, left: '50%' });

  // Set up step positioning only when current step changes
  // Find the tour button and its position
  useEffect(() => {
    if (isTourActive) {
      // Find the tour button element
      const tourButtonElement = document.querySelector('.tour-button');
      if (tourButtonElement) {
        const rect = tourButtonElement.getBoundingClientRect();
        // Get the center of the button
        const top = rect.top + window.scrollY;
        setTourButtonPosition({ 
          top, 
          left: '50%' // Keep horizontally centered
        });
      }
    }
  }, [isTourActive]);
  
  useEffect(() => {
    if (!isTourActive || currentStep >= tourSteps.length) return;

    const step = tourSteps[currentStep];
    
    // Reset the animation key to trigger animation
    setAnimationKey(prev => prev + 1);
    
    let cleanupFunction: (() => void) | undefined;
    
    const highlightTargetElement = () => {
      // Skip highlighting for body-centered steps
      if (step.target === 'body') {
        // Reset scroll position for centered tour steps
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      
      // Find the target element
      const targetElement = document.querySelector(`[data-tour-id="${step.target}"]`) as HTMLElement;
      
      if (!targetElement) {
        console.warn(`Target element not found: ${step.target}`);
        return;
      }
      
      // Store original styles
      const originalStyles = {
        border: targetElement.style.border,
        boxShadow: targetElement.style.boxShadow,
        transition: targetElement.style.transition,
        zIndex: targetElement.style.zIndex,
        position: targetElement.style.position
      };
      
      // Scroll the element into view
      const rect = targetElement.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;
      
      // Calculate where to scroll to center the element in the viewport
      const scrollPosition = elementTop - (window.innerHeight / 2) + (rect.height / 2);
      
      // Ensure we don't scroll below or above the document
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const safeScrollPosition = Math.max(0, Math.min(scrollPosition, maxScroll));
      
      // Perform smooth scrolling
      window.scrollTo({
        top: safeScrollPosition,
        behavior: 'smooth'
      });
      
      // Apply highlight styles with transition
      targetElement.style.transition = 'all 0.3s ease-in-out';
      targetElement.style.position = originalStyles.position || '';
      targetElement.style.zIndex = '1000';
      
      // Apply highlight styling if color is provided
      if (step.highlightColor) {
        targetElement.style.border = `2px solid ${step.highlightColor}`;
        targetElement.style.boxShadow = `0 0 20px ${step.highlightColor}`;
      }
      
      // Return cleanup function
      return () => {
        if (targetElement) {
          targetElement.style.border = originalStyles.border;
          targetElement.style.boxShadow = originalStyles.boxShadow;
          targetElement.style.transition = originalStyles.transition;
          targetElement.style.zIndex = originalStyles.zIndex;
          targetElement.style.position = originalStyles.position;
        }
      };
    };
    
    // Set up highlighting with a small delay to allow for smooth transitions
    const timer = setTimeout(() => {
      cleanupFunction = highlightTargetElement();
    }, 100);
    
    // Handle window resize
    const handleResize = () => {
      if (cleanupFunction) {
        cleanupFunction();
      }
      cleanupFunction = highlightTargetElement();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      if (cleanupFunction) {
        cleanupFunction();
      }
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
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed left-1/2 -translate-x-1/2"
            style={{
              zIndex: 100001,
              top: currentStep === 0 ? tourButtonPosition.top + 100 : '50%',
              transform: currentStep === 0 ? 'translateX(-50%)' : 'translate(-50%, -50%)'
            }}
          >
            {/* Tour Content */}
            <Card className="w-[340px] shadow-lg border-2 border-[#1C3D5A] relative bg-white">
              {/* Blur effect behind card */}
              <div className="absolute -inset-[5px] rounded-xl bg-white/10 backdrop-blur-sm -z-10"></div>
              
              {/* Fundi Character - Positioned at the center top of the card, moved up 5px */}
              <div className="absolute -top-[70px] left-1/2 transform -translate-x-1/2 z-10">
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