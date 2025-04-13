import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { GuidedTourStep } from '@/contexts/guided-tour-context';

interface GuidedTourTooltipProps {
  step: GuidedTourStep;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onClose: () => void;
  totalSteps: number;
  currentStepIndex: number;
  userName: string;
}

export const GuidedTourTooltip: React.FC<GuidedTourTooltipProps> = ({
  step,
  onNext,
  onPrev,
  onSkip,
  onClose,
  totalSteps,
  currentStepIndex,
  userName,
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [targetElement, setTargetElement] = useState<Element | null>(null);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    transformOrigin: string;
  }>({
    top: 0,
    left: 0,
    transformOrigin: 'center center',
  });

  // Content with personalization
  const personalizedContent = () => {
    let content = step.content;
    
    // Add user's name only for intro and outro steps
    if ((step.isIntroStep || step.isOutroStep) && userName) {
      // Replace placeholder with actual name
      content = content.replace('{userName}', userName);
    }
    
    return content;
  };

  // Handle positioning the tooltip relative to target element
  useEffect(() => {
    if (!step.targetSelector) {
      // Center in the viewport if no target
      setPosition({
        top: window.innerHeight / 2 - 150,
        left: window.innerWidth / 2 - 200,
        transformOrigin: 'center center',
      });
      return;
    }

    // Find the target element
    const target = document.querySelector(step.targetSelector);
    setTargetElement(target);

    if (!target) {
      console.log(`Target element not found: ${step.targetSelector}`);
      return;
    }

    // Get element dimensions and position
    const targetRect = target.getBoundingClientRect();
    const tooltipRect = tooltipRef.current?.getBoundingClientRect();
    
    if (!tooltipRect) return;

    // Default position (bottom)
    let finalPosition = step.position || 'bottom';
    
    // Calculate positions for each possible placement
    const positions = {
      top: {
        top: targetRect.top - tooltipRect.height - 10,
        left: targetRect.left + targetRect.width / 2 - tooltipRect.width / 2,
        transformOrigin: 'bottom center',
      },
      right: {
        top: targetRect.top + targetRect.height / 2 - tooltipRect.height / 2,
        left: targetRect.right + 10,
        transformOrigin: 'left center',
      },
      bottom: {
        top: targetRect.bottom + 10,
        left: targetRect.left + targetRect.width / 2 - tooltipRect.width / 2,
        transformOrigin: 'top center',
      },
      left: {
        top: targetRect.top + targetRect.height / 2 - tooltipRect.height / 2,
        left: targetRect.left - tooltipRect.width - 10,
        transformOrigin: 'right center',
      },
      center: {
        top: window.innerHeight / 2 - tooltipRect.height / 2,
        left: window.innerWidth / 2 - tooltipRect.width / 2,
        transformOrigin: 'center center',
      },
    };

    // Use the specified position
    setPosition(positions[finalPosition as keyof typeof positions]);

    // Add highlight to the target element
    target.classList.add('tour-highlight');
    
    // Scroll the element into view if needed
    if (
      targetRect.top < 0 ||
      targetRect.bottom > window.innerHeight
    ) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }

    // Cleanup highlight when component unmounts
    return () => {
      target.classList.remove('tour-highlight');
    };
  }, [step, step.targetSelector, step.position]);

  return (
    <AnimatePresence>
      <motion.div
        ref={tooltipRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'fixed',
          top: position.top,
          left: position.left,
          transformOrigin: position.transformOrigin,
          zIndex: 9999,
          maxWidth: '400px',
          width: '90%',
        }}
        className="tour-tooltip"
      >
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">{step.title}</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="prose prose-sm max-w-none pt-0 pb-2">
            <p>{personalizedContent()}</p>
          </CardContent>
          
          <CardFooter className="flex justify-between pt-2 flex-wrap gap-2">
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-all",
                    index === currentStepIndex ? "bg-primary scale-125" : "bg-primary/30"
                  )}
                />
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              {step.showSkipButton && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onSkip} 
                  className="h-8 text-xs"
                >
                  Skip
                </Button>
              )}
              
              {step.showPrevButton && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onPrev} 
                  className="h-8"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}
              
              <Button 
                variant="default" 
                size="sm" 
                onClick={onNext} 
                className="h-8"
              >
                {currentStepIndex === totalSteps - 1 ? 'Finish' : 'Next'}
                {currentStepIndex !== totalSteps - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
      
      {targetElement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black pointer-events-none"
          style={{ zIndex: 9990 }}
        />
      )}
    </AnimatePresence>
  );
};