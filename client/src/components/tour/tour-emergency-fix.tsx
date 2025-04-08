// This file contains emergency fixes to ensure tour works properly for investor presentation

import React, { useEffect } from 'react';
import { useTour } from '@/contexts/tour-context';

/**
 * This component ensures the tour is properly initialized and running
 * It's added as a diagnostic tool for our emergency fix
 */
export const TourEmergencyFix: React.FC = () => {
  const { isTourActive, currentStepIndex, currentStep, restartTour } = useTour();

  // Log tour state for debugging
  useEffect(() => {
    console.log("EMERGENCY FIX STATUS - Tour active:", isTourActive);
    console.log("EMERGENCY FIX STATUS - Current step:", currentStepIndex);
    console.log("EMERGENCY FIX STATUS - Step data:", currentStep);
    
    // Add diagnostic attributes to body
    document.body.setAttribute('data-tour-fixed', 'true');
    document.body.setAttribute('data-tour-active', String(isTourActive));
    document.body.setAttribute('data-tour-step', String(currentStepIndex));
    
    // Force tour active style
    if (isTourActive) {
      document.body.classList.add('tour-active');
    }
    
    return () => {
      // Clear diagnostic attributes when component unmounts
      document.body.removeAttribute('data-tour-fixed');
    };
  }, [isTourActive, currentStepIndex, currentStep]);

  return null; // This is a non-visual component
};

export default TourEmergencyFix;