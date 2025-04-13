import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import RobotFundi from '@/components/robot-fundi';
import { useTour } from './tour-context';
import { useTourSteps, TourStep } from './tour-steps';

const TourGuide: React.FC = () => {
  const { isTourActive, currentStep, totalSteps, nextStep, prevStep, endTour } = useTour();
  const tourSteps = useTourSteps();
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [animationKey, setAnimationKey] = useState(0);

  // Function to get the target element
  const getTargetElement = (step: TourStep) => {
    if (step.target === 'body') return document.body;
    return document.querySelector(`[data-tour-id="${step.target}"]`);
  };

  // Calculate position for the current step
  useEffect(() => {
    if (!isTourActive || currentStep >= tourSteps.length) return;
    
    const step = tourSteps[currentStep];
    const element = getTargetElement(step) as HTMLElement;
    setTargetElement(element);

    if (!element) return;
    
    const calculatePosition = () => {
      if (step.target === 'body' || step.placement === 'center') {
        // Center in the viewport
        setPosition({
          top: window.innerHeight / 2 - 150,
          left: window.innerWidth / 2 - 175,
        });
        return;
      }

      const rect = element.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Default positions (can be adjusted as needed)
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
      }
      
      // Ensure the popup stays within viewport bounds
      if (left < 20) left = 20;
      if (left > viewportWidth - 370) left = viewportWidth - 370;
      if (top < 20) top = 20;
      if (top > viewportHeight - 200) top = viewportHeight - 200;
      
      setPosition({ top, left });
    };

    calculatePosition();
    
    // Highlight the target element if color is provided
    if (step.highlightColor && element !== document.body) {
      const originalBorder = element.style.border;
      const originalBoxShadow = element.style.boxShadow;
      
      element.style.border = `2px solid ${step.highlightColor}`;
      element.style.boxShadow = `0 0 15px ${step.highlightColor}`;
      
      return () => {
        element.style.border = originalBorder;
        element.style.boxShadow = originalBoxShadow;
      };
    }
    
    // Register resize event to recalculate positions on window resize
    window.addEventListener('resize', calculatePosition);
    return () => window.removeEventListener('resize', calculatePosition);
  }, [isTourActive, currentStep, tourSteps]);

  // Trigger animation for Fundi
  useEffect(() => {
    if (isTourActive) {
      setAnimationKey(prev => prev + 1);
    }
  }, [currentStep, isTourActive]);

  if (!isTourActive) return null;

  const currentTourStep = tourSteps[currentStep];
  
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
                <motion.div
                  key={`fundi-animation-${animationKey}`}
                  animate={
                    currentTourStep.showFundiAnimation ? 
                    (currentTourStep.animationType === 'wave' ? { rotateZ: [0, 10, -10, 10, 0] } :
                     currentTourStep.animationType === 'jump' ? { y: [0, -15, 0, -10, 0] } :
                     currentTourStep.animationType === 'spin' ? { rotateY: [0, 180, 360] } :
                     currentTourStep.animationType === 'dance' ? { 
                       x: [0, 10, -10, 10, -10, 0],
                       y: [0, -5, 0, -5, 0]
                     } :
                     currentTourStep.animationType === 'nod' ? { rotateX: [0, 20, 0, 20, 0] } :
                     {}) 
                    : {}
                  }
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                  <RobotFundi 
                    size="lg"
                    category={currentTourStep.highlightColor ? "custom" : "general"}
                    emotion="happy"
                    customColor={currentTourStep.highlightColor}
                  />
                </motion.div>
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
                    {currentTourStep.title}
                  </h3>
                  <p className="text-sm text-center text-gray-700">
                    {currentTourStep.content}
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