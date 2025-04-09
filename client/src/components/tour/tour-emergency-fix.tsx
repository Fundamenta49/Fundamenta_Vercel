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
    
    // Check if we need to apply vehicle maintenance fix
    if (isTourActive && currentStep?.route === '/learning/courses/vehicle-maintenance') {
      applyVehicleMaintenanceFix();
    }
    
    return () => {
      // Clear diagnostic attributes when component unmounts
      document.body.removeAttribute('data-tour-fixed');
    };
  }, [isTourActive, currentStepIndex, currentStep]);

  return null; // This is a non-visual component
};

/**
 * Special fix for the vehicle maintenance page to ensure Fundi stays visible
 * and content is properly spaced below it
 */
export function applyVehicleMaintenanceFix(): void {
  const isVehicleRoute = window.location.pathname.includes('/learning/courses/vehicle-maintenance');
  const courseContent = document.querySelector('.course-content');
  
  if (isVehicleRoute && courseContent) {
    // When on vehicle maintenance page, always scroll to top to keep Fundi visible
    window.scrollTo({ top: 0, behavior: 'auto' });
    
    // Add special class for vehicle maintenance styling
    document.body.classList.add('vehicle-maintenance-page');
    
    // Set explicit margin for content for better visibility
    (courseContent as HTMLElement).style.marginTop = '150px';
    (courseContent as HTMLElement).style.paddingTop = '50px';
    
    // Fix any Fundi tour guide positioning if tour is active
    const tourFundi = document.querySelector('.fixed.z-\\[99999\\]');
    if (tourFundi) {
      // Force Fundi to stay at a fixed position at the top
      (tourFundi as HTMLElement).style.position = 'fixed';
      (tourFundi as HTMLElement).style.top = '120px';
      (tourFundi as HTMLElement).style.right = '166px';
      (tourFundi as HTMLElement).style.transform = 'translate(166px, 120px)';
    }
    
    console.log('Emergency fix applied for vehicle maintenance page');
  }
}

export default TourEmergencyFix;