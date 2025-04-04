import React, { useState, useEffect, useCallback } from 'react';
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
import { ChevronLeft, ChevronRight, X, HelpCircle, RotateCcw } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
    restartTour,
  } = useTour();

  const [userNameInput, setUserNameInput] = useState('');
  const [showUserNameInput, setShowUserNameInput] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Check if we're on the first step and need to collect the user's name
  useEffect(() => {
    if (isTourActive && currentStepIndex === 0 && !userName) {
      setShowUserNameInput(true);
    } else {
      setShowUserNameInput(false);
    }
    
    // Reset transitioning state when step changes
    setIsTransitioning(false);
  }, [isTourActive, currentStepIndex, userName]);

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
  const isMobile = useIsMobile();
  
  // Adjust position based on which step we're on and device type
  const getPosition = () => {
    // First two steps are centered (welcome and intro)
    if (isInitialStep) {
      return ""; // Default centered position
    }
    
    // After step 2, position to bottom right
    // For mobile, use bottom center
    return isMobile
      ? "fixed bottom-4 left-1/2 transform -translate-x-1/2 translate-y-0 max-h-[350px] w-[92%] overflow-y-auto"
      : "fixed bottom-8 right-8 translate-x-0 translate-y-0 max-h-[380px] overflow-y-auto";
  };
  
  // Make sure we have aria-attributes to avoid warnings
  const dialogContentProps = {
    className: `${
      isInitialStep 
        ? isMobile ? "max-w-[95%] w-[95%]" : "sm:max-w-[500px]" 
        : isMobile ? "max-w-[92%] w-[92%] shadow-2xl" : "sm:max-w-[320px] shadow-2xl"
    } ${getPosition()}`,
    "aria-describedby": "tour-description"
  };

  return (
    <Dialog 
      open={isTourActive} 
      onOpenChange={(open) => !open && endTour()} 
      modal={isInitialStep}>
      <DialogContent {...dialogContentProps}>
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
            <Input
              placeholder="Your name"
              value={userNameInput}
              onChange={(e) => setUserNameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUserNameSubmit()}
              autoFocus
              className="mb-2"
              aria-label="Enter your name"
            />
            <Button 
              onClick={handleUserNameSubmit} 
              className="w-full"
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
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size={isMobile ? "sm" : "icon"} 
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0 || showUserNameInput || isTransitioning}
                  className={isMobile ? "h-9 px-3" : "h-8 w-8 p-0"}
                >
                  <ChevronLeft className="h-4 w-4" />
                  {isMobile && <span className="ml-1">Back</span>}
                </Button>
                
                {/* Restart tour button - more visible on mobile */}
                {isMobile && currentStepIndex > 2 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => restartTour()}
                    className="h-9 flex gap-1 items-center px-2"
                    title="Restart tour"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span className="text-xs">Restart</span>
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size={isMobile ? "sm" : "icon"} 
                  onClick={skipTour}
                  disabled={showUserNameInput || isTransitioning}
                  className={isMobile ? "h-9 px-3" : "h-8 w-8 p-0"}
                >
                  <X className="h-4 w-4" />
                  {isMobile && <span className="ml-1">Skip</span>}
                </Button>
                
                <Button 
                  size="sm" 
                  onClick={handleNextStep}
                  disabled={showUserNameInput || isTransitioning}
                  className={isMobile ? "h-9 px-4" : "h-8"}
                >
                  {currentStepIndex === totalSteps - 1 ? 'Finish' : 'Next'}
                  {currentStepIndex < totalSteps - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
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
                  className={isMobile ? "h-10 px-3" : ""}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={skipTour}
                  disabled={showUserNameInput || isTransitioning}
                  className={isMobile ? "h-10 px-3" : ""}
                >
                  <X className="h-4 w-4 mr-1" />
                  Skip
                </Button>
                
                {/* Restart tour button in the welcome screen */}
                {!showUserNameInput && currentStepIndex === 0 && userName && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => restartTour()}
                    title="Restart tour"
                    className="h-10"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Restart
                  </Button>
                )}
              </div>

              {!showUserNameInput && (
                <Button 
                  size="sm" 
                  onClick={handleNextStep}
                  disabled={showUserNameInput || isTransitioning}
                  className={isMobile ? "h-10 px-4" : ""}
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