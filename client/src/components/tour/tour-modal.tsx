import React, { useState, useEffect } from 'react';
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
  
  // Check if we're on the first step and need to collect the user's name
  useEffect(() => {
    if (isTourActive && currentStepIndex === 0 && !userName) {
      setShowUserNameInput(true);
    } else {
      setShowUserNameInput(false);
    }
  }, [isTourActive, currentStepIndex, userName]);

  // Handle user name submission
  const handleUserNameSubmit = () => {
    if (userNameInput.trim()) {
      setUserName(userNameInput.trim());
      setUserNameInput('');
      setShowUserNameInput(false);
      nextStep();
    }
  };

  // Progress percentage calculation
  const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <Dialog open={isTourActive} onOpenChange={(open) => !open && endTour()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            {currentStep?.title}
          </DialogTitle>
          <DialogDescription className="pt-2">
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
            />
            <Button onClick={handleUserNameSubmit} className="w-full">
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
              onClick={prevStep}
              disabled={currentStepIndex === 0 || showUserNameInput}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={skipTour}
              disabled={showUserNameInput}
            >
              <X className="h-4 w-4 mr-1" />
              Skip
            </Button>
          </div>

          {!showUserNameInput && (
            <Button 
              size="sm" 
              onClick={nextStep}
              disabled={showUserNameInput}
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