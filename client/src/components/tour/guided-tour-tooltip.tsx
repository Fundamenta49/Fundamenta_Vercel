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
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Listen for window resize events
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

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
    
    // For mobile devices, force position to bottom center or top center to avoid going off screen
    if (isMobile) {
      // If the target is in the bottom half of the screen, position above it
      if (targetRect.top > window.innerHeight / 2) {
        finalPosition = 'top';
      } else {
        finalPosition = 'bottom';
      }
    }
    
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

    // Start with the specified position
    let pos = positions[finalPosition as keyof typeof positions];
    
    // Ensure tooltip stays within viewport bounds
    const viewportPadding = isMobile ? 16 : 20;
    
    // Constrain horizontal position
    if (pos.left < viewportPadding) {
      pos.left = viewportPadding;
    } else if (pos.left + tooltipRect.width > window.innerWidth - viewportPadding) {
      pos.left = window.innerWidth - tooltipRect.width - viewportPadding;
    }
    
    // Constrain vertical position
    if (pos.top < viewportPadding) {
      pos.top = viewportPadding;
    } else if (pos.top + tooltipRect.height > window.innerHeight - viewportPadding) {
      pos.top = window.innerHeight - tooltipRect.height - viewportPadding;
    }
    
    // On mobile, if the tooltip is still too big, position it at the center bottom of the screen
    if (isMobile && (pos.top < 0 || pos.top + tooltipRect.height > window.innerHeight || 
                     pos.left < 0 || pos.left + tooltipRect.width > window.innerWidth)) {
      pos = {
        top: window.innerHeight - tooltipRect.height - 20,
        left: window.innerWidth / 2 - tooltipRect.width / 2,
        transformOrigin: 'bottom center',
      };
    }

    setPosition(pos);

    // Add highlight to the target element
    target.classList.add('tour-highlight');
    
    // Add mobile mode class to body if on mobile
    if (isMobile) {
      document.body.classList.add('tour-mobile-mode');
    } else {
      document.body.classList.remove('tour-mobile-mode');
    }
    
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
      document.body.classList.remove('tour-mobile-mode');
    };
  }, [step, step.targetSelector, step.position, isMobile]);

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
          maxWidth: isMobile ? '90vw' : '400px',
          width: isMobile ? 'calc(100% - 32px)' : '90%',
        }}
        className={cn("tour-tooltip", isMobile && "mobile-speech-bubble")}
      >
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardHeader className={cn("pb-2", isMobile && "p-3")}>
            <div className="flex items-center justify-between">
              <CardTitle className={cn("text-lg font-medium", isMobile && "text-base")}>{step.title}</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("h-8 w-8", isMobile && "h-6 w-6")} 
                onClick={onClose}
              >
                <X className={cn("h-4 w-4", isMobile && "h-3 w-3")} />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className={cn("prose prose-sm max-w-none pt-0 pb-2", isMobile && "p-3 pt-0")}>
            <p>{personalizedContent()}</p>
          </CardContent>
          
          <CardFooter className={cn("flex justify-between pt-2 flex-wrap gap-2", isMobile && "p-3 pt-1")}>
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
                  className={cn("h-8 text-xs", isMobile && "h-7 text-xs px-2")}
                >
                  Skip
                </Button>
              )}
              
              {step.showPrevButton && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onPrev} 
                  className={cn("h-8", isMobile && "h-7 text-xs px-2")}
                >
                  <ChevronLeft className={cn("h-4 w-4 mr-1", isMobile && "h-3 w-3")} />
                  Back
                </Button>
              )}
              
              <Button 
                variant="default" 
                size="sm" 
                onClick={onNext} 
                className={cn("h-8", isMobile && "h-7 text-xs px-2")}
              >
                {currentStepIndex === totalSteps - 1 ? 'Finish' : 'Next'}
                {currentStepIndex !== totalSteps - 1 && 
                  <ChevronRight className={cn("h-4 w-4 ml-1", isMobile && "h-3 w-3")} />
                }
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