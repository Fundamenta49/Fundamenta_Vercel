import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { useTour } from '@/contexts/tour-context';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, X, HelpCircle } from 'lucide-react';

const TourModal = () => {
  const {
    isTourActive,
    currentStep,
    currentStepIndex,
    totalSteps,
    userName,
    setUserName,
    nextStep,
    prevStep,
    skipTour,
    endTour,
  } = useTour();

  const [userNameInput, setUserNameInput] = useState('');
  const [showUserNameInput, setShowUserNameInput] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Check if we're on the first step and need to collect the user's name
  useEffect(() => {
    // Only show name input if we're on first step AND don't have a name already
    if (isTourActive && currentStepIndex === 0 && !userName) {
      setShowUserNameInput(true);
    } else {
      setShowUserNameInput(false);
      
      // If it's the first step but we already have the user's name (from auth),
      // wait a brief moment to ensure states are updated, then auto-advance
      if (isTourActive && currentStepIndex === 0 && userName && !isTransitioning) {
        const timer = setTimeout(() => {
          nextStep(); // Auto-advance since we already have the name
        }, 1500); // Give user a moment to see the personalized greeting
        
        return () => clearTimeout(timer);
      }
    }
    
    // Reset transitioning state when step changes
    setIsTransitioning(false);
  }, [isTourActive, currentStepIndex, userName, nextStep, isTransitioning]);
  
  // Force dialog positioning before render to ensure proper mobile display
  useLayoutEffect(() => {
    if (isTourActive) {
      // Add a class to body to indicate we're in tour mode
      document.body.classList.add('tour-active');
      
      // Force any existing modals to have proper mobile positioning
      const dialogs = document.querySelectorAll('[data-tour-dialog]');
      dialogs.forEach(dialog => {
        if (window.innerWidth <= 640) {
          dialog.classList.add('mobile-tour-dialog');
        } else {
          dialog.classList.remove('mobile-tour-dialog');
        }
      });
    } else {
      document.body.classList.remove('tour-active');
    }
    
    return () => {
      document.body.classList.remove('tour-active');
    };
  }, [isTourActive]);

  // Debounced navigation to prevent rapid transitions
  const handleNextStep = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Force remove any lingering highlights before transitioning
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
    });
    
    // Small delay to ensure proper cleanup before transition
    setTimeout(() => {
      nextStep();
    }, 100);
  }, [nextStep, isTransitioning]);
  
  const handlePrevStep = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Force remove any lingering highlights before transitioning
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
    });
    
    // Small delay to ensure proper cleanup before transition
    setTimeout(() => {
      prevStep();
    }, 100);
  }, [prevStep, isTransitioning]);
  
  // Handle user name submission
  const handleUserNameSubmit = useCallback(() => {
    if (!userNameInput.trim()) return;
    
    // Set name and add a small timeout before advancing to allow state to update
    setUserName(userNameInput.trim());
    setUserNameInput('');
    setShowUserNameInput(false);
    setIsTransitioning(true);
    
    // Clean any highlights and move to next step
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
    });
    
    // Delay moving to the next step slightly to ensure name is set properly
    setTimeout(() => {
      nextStep();
    }, 100);
  }, [userNameInput, setUserName, nextStep]);

  // Progress percentage calculation
  const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;

  // Determine if we should position the modal differently based on step
  const isInitialStep = currentStepIndex < 2; // First two steps use center positioning
  
  // Adjust position based on which step we're on and device size
  const getPosition = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    
    // First two steps are centered (welcome and intro)
    if (isInitialStep) {
      return isMobile 
        ? "max-w-[95vw] max-h-[80vh] overflow-y-auto" 
        : ""; // Default centered position
    }
    
    // After step 2, position to bottom with special mobile styling
    return isMobile
      ? "fixed bottom-4 left-0 right-0 mx-2 max-h-[65vh] overflow-y-auto"
      : "fixed tour-modal-position max-h-[380px] overflow-y-auto";
  };
  
  // Make sure we have aria-attributes to avoid warnings
  const dialogContentProps = {
    className: `${isInitialStep 
      ? "sm:max-w-[500px] max-w-[95vw]" 
      : "sm:max-w-[320px] max-w-[95vw] max-h-[65vh] shadow-2xl"} ${getPosition()}`,
    "aria-describedby": "tour-description",
    style: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)'
    }
  };

  return (
    <Dialog 
      open={isTourActive} 
      onOpenChange={(open) => !open && endTour()} 
      modal={isInitialStep}>
      <DialogContent 
        {...dialogContentProps} 
        data-tour-dialog 
        className={`${dialogContentProps.className} bg-white border rounded-md shadow-md`}>
        <DialogHeader className={isInitialStep ? "" : "pb-2"}>
          <DialogTitle className="flex items-center gap-2 text-base">
            <HelpCircle className="h-4 w-4 text-primary" />
            {currentStep?.title}
          </DialogTitle>
          <DialogDescription id="tour-description" className={`${isInitialStep ? "pt-2" : "pt-1 text-sm"}`}>
            {currentStep?.content}
          </DialogDescription>
        </DialogHeader>

        {/* User name input (first step) */}
        {showUserNameInput && (
          <div className="py-3">
            <div className="mb-2 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <label htmlFor="user-name-input" className="block text-sm font-medium text-orange-800 mb-2">
                Please enter your name to continue:
              </label>
              <Input
                id="user-name-input"
                placeholder="Your name"
                value={userNameInput}
                onChange={(e) => setUserNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUserNameSubmit()}
                autoFocus
                className="mb-2 border-orange-300 focus:border-orange-500 focus:ring focus:ring-orange-200"
                aria-label="Enter your name"
              />
            </div>
            <Button 
              onClick={handleUserNameSubmit} 
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={!userNameInput.trim() || isTransitioning}
            >
              Continue
            </Button>
          </div>
        )}

        {/* Tour image if available */}
        {currentStep?.image && (
          <div className={isInitialStep ? "py-2" : "py-1"}>
            <img 
              src={currentStep.image} 
              alt={currentStep.title} 
              className="rounded-md w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Progress bar */}
        <div className={isInitialStep ? "py-2" : "py-1"}>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{currentStepIndex + 1}/{totalSteps}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-1" />
        </div>

        <DialogFooter className={`flex justify-between items-center ${isInitialStep ? "" : "pt-2"}`}>
          {/* Simpler controls when not in initial steps */}
          {!isInitialStep ? (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0 || showUserNameInput || isTransitioning}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={skipTour}
                  disabled={showUserNameInput || isTransitioning}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
                
                <Button 
                  size="sm" 
                  onClick={handleNextStep}
                  disabled={showUserNameInput || isTransitioning}
                  className="h-8"
                >
                  {currentStepIndex === totalSteps - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0 || showUserNameInput || isTransitioning}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={skipTour}
                  disabled={showUserNameInput || isTransitioning}
                >
                  <X className="h-4 w-4 mr-1" />
                  Skip
                </Button>
              </div>

              {!showUserNameInput && (
                <Button 
                  size="sm" 
                  onClick={handleNextStep}
                  disabled={showUserNameInput || isTransitioning}
                >
                  {currentStepIndex === totalSteps - 1 ? 'Finish' : 'Next'}
                  {currentStepIndex < totalSteps - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TourModal;