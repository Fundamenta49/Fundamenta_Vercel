import { useEffect } from 'react';
import { useOnboarding } from '@/lib/onboarding-context';

/**
 * Hook to listen for AI-triggered tour events
 * This allows Fundi to start tours programmatically
 */
export function useTourTrigger() {
  const { startTour } = useOnboarding();

  useEffect(() => {
    // Create handler for AI-triggered tour events
    const handleTriggerTourEvent = (event: CustomEvent<{ tourId: string }>) => {
      const { tourId } = event.detail;
      if (tourId) {
        startTour(tourId);
      }
    };

    // Add event listener for custom event
    document.addEventListener('ai:trigger-tour', handleTriggerTourEvent as EventListener);

    // Clean up on unmount
    return () => {
      document.removeEventListener('ai:trigger-tour', handleTriggerTourEvent as EventListener);
    };
  }, [startTour]);
}

/**
 * Hook to integrate tour trigger with AI feature system
 * This connects to the existing AI event system
 */
export function useAITourIntegration() {
  useEffect(() => {
    // Listen for AI feature triggers related to tours
    const handleFeatureTrigger = (event: CustomEvent<{ feature: string; tourId?: string }>) => {
      if (event.detail.feature === 'start_tour' && event.detail.tourId) {
        // Dispatch the tour trigger event
        document.dispatchEvent(
          new CustomEvent('ai:trigger-tour', {
            detail: { tourId: event.detail.tourId }
          })
        );
      }
    };

    // Add event listener
    document.addEventListener('ai:trigger-feature', handleFeatureTrigger as EventListener);

    // Clean up
    return () => {
      document.removeEventListener('ai:trigger-feature', handleFeatureTrigger as EventListener);
    };
  }, []);
}