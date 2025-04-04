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

  // Make sure we have aria-attributes to avoid warnings
  const dialogContentProps = {
    className: "sm:max-w-[500px]",
    "aria-describedby": "tour-description"
  };

  return (
    <Dialog open={isTourActive} onOpenChange={(open) => !open && endTour()}>
      <DialogContent {...dialogContentProps}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            {currentStep?.title}
          </DialogTitle>
          <DialogDescription id="tour-description" className="pt-2">
            {currentStep?.content}
          </DialogDescription>
        </DialogHeader>

        {/* User name input (first step) */}
        {showUserNameInput && (
          <div className="py-4">
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
          <div className="py-2">
            <img 
              src={currentStep.image} 
              alt={currentStep.title} 
              className="rounded-md w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Progress bar */}
        <div className="py-2">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Step {currentStepIndex + 1} of {totalSteps}</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <DialogFooter className="flex justify-between items-center">
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TourModal;