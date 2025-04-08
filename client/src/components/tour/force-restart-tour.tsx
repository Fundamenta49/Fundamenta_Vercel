import React, { useEffect } from 'react';
import { useTour } from '@/contexts/tour-context';

/**
 * Emergency component to force tour restart for investor presentation
 * This is now fully automatic with no visible UI - it just ensures the tour
 * starts automatically for new users without requiring any manual intervention
 */
export const ForceRestartTour: React.FC = () => {
  const { isTourActive, restartTour } = useTour();
  
  // Check localStorage for hasSeenTour and auto-start if needed
  useEffect(() => {
    // If tour is already active, we don't need to do anything
    if (isTourActive) return;
    
    // Wait a moment to allow other components to initialize
    const timer = setTimeout(() => {
      // Check if the tour has been completed before
      const hasSeenTour = localStorage.getItem('hasSeenTour');
      if (!hasSeenTour) {
        // This is a new user, so auto-start the tour
        console.log("Auto-starting tour for new user");
        
        // Remove any existing state first
        document.body.classList.add('tour-active');
        localStorage.removeItem('hasSeenTour');
        
        // Start the tour automatically
        restartTour();
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [isTourActive, restartTour]);
  
  // Also add a rescue mechanism if the body doesn't have the tour-active class
  // but the tour context says it should be active
  useEffect(() => {
    if (isTourActive && !document.body.classList.contains('tour-active')) {
      console.log("Emergency fix: Tour was active but body class was missing");
      document.body.classList.add('tour-active');
    }
  }, [isTourActive]);
  
  // This component doesn't render anything visible
  return null;
};

export default ForceRestartTour;