import { useEffect, useCallback } from 'react';
import { useGuidedTour } from '@/contexts/guided-tour-context';
import { registerTourCallback, setupTourEvents, cleanupTourEvents } from '@/lib/tour-controller';

/**
 * Hook to register tour start callback and listen for tour events
 * Use this in your App component or any root component to ensure tours can be started
 */
export const useStartTour = () => {
  const { startTour } = useGuidedTour();
  
  // Register the callback to start tours programmatically
  const tourCallback = useCallback((tourId: string) => {
    startTour(tourId);
  }, [startTour]);
  
  useEffect(() => {
    // Register the callback with the tour controller
    registerTourCallback(tourCallback);
    
    // Set up event listeners for external systems to trigger tours
    setupTourEvents();
    
    // Clean up event listeners on unmount
    return () => {
      cleanupTourEvents();
    };
  }, [tourCallback]);
  
  // Return the startTour function for direct use
  return startTour;
};

export default useStartTour;