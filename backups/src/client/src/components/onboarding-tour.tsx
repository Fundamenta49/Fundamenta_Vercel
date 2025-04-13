import React, { useEffect } from 'react';
import { useOnboarding } from '@/lib/onboarding-context';
import { OnboardingTooltip } from '@/components/ui/onboarding-tooltip';
import { useTourTrigger, useAITourIntegration } from '@/hooks/use-tour-trigger';
import { useLocation } from 'wouter';

export function OnboardingTour() {
  const { 
    onboardingState, 
    currentStep,
    endTour,
    nextStep,
    prevStep,
    skipTour,
    startTour
  } = useOnboarding();
  
  const [location] = useLocation();
  const { activeTour, currentStepIndex, isTourActive, hasCompletedInitialTour } = onboardingState;
  
  // Use the tour trigger hook to enable AI-triggered tours
  useTourTrigger();
  
  // Integrate with the AI event system
  useAITourIntegration();
  
  // Show the initial tour for new users
  useEffect(() => {
    if (!hasCompletedInitialTour && !isTourActive && location === '/') {
      startTour('initial-tour');
    }
  }, [hasCompletedInitialTour, isTourActive, location, startTour]);
  
  // Auto-start section tours when user navigates to a new section
  useEffect(() => {
    if (!isTourActive) {
      // Map location to tour IDs
      if (location === '/finance') {
        startTour('finance-tour');
      } else if (location === '/career') {
        startTour('career-tour');
      } else if (location === '/wellness') {
        startTour('wellness-tour');
      } else if (location === '/learning') {
        startTour('learning-tour');
      } else if (location === '/active') {
        startTour('active-tour');
      } else if (location === '/emergency') {
        startTour('emergency-tour');
      }
    }
  }, [location, isTourActive, startTour]);
  
  if (!activeTour || !currentStep || !isTourActive) {
    return null;
  }
  
  return (
    <OnboardingTooltip
      step={currentStep}
      isOpen={true}
      onClose={endTour}
      onNext={nextStep}
      onPrev={prevStep}
      onSkip={skipTour}
      currentIndex={currentStepIndex}
      totalSteps={activeTour.steps.length}
    />
  );
}