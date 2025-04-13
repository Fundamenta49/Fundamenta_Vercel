import React, { useEffect } from 'react';
import { useGuidedTour } from '@/contexts/guided-tour-context';
import { GuidedTourTooltip } from './guided-tour-tooltip';
import './guided-tour.css';

export const GuidedTour: React.FC = () => {
  const {
    activeTour,
    currentStepIndex,
    isTourActive,
    nextStep,
    prevStep,
    skipTour,
    endTour,
    getCurrentStep,
    userName,
  } = useGuidedTour();

  // Get current step
  const currentStep = getCurrentStep();

  // If tour is not active or we don't have a current step, don't render anything
  if (!isTourActive || !currentStep || !activeTour) {
    return null;
  }

  return (
    <GuidedTourTooltip
      step={currentStep}
      onNext={nextStep}
      onPrev={prevStep}
      onSkip={skipTour}
      onClose={endTour}
      totalSteps={activeTour.steps.length}
      currentStepIndex={currentStepIndex}
      userName={userName}
    />
  );
};

export default GuidedTour;