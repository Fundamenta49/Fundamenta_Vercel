import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useOnboarding } from '@/lib/onboarding-context';
import { toast } from '@/hooks/use-toast';

/**
 * A floating button that allows users to quickly dismiss 
 * all tours with a single click
 */
export function TourDismissButton() {
  const { onboardingState, disableAllTours, endTour } = useOnboarding();
  const [showDismissButton, setShowDismissButton] = useState(true);
  
  // Handle disabling all tours
  const handleDisableTours = () => {
    // First end any active tour
    if (onboardingState.isTourActive) {
      endTour();
    }
    
    // Then disable all future tours
    disableAllTours();
    
    // Hide the button
    setShowDismissButton(false);
    
    // Show a toast notification
    toast({
      title: "Tours Disabled",
      description: "All interactive tours have been disabled. You can re-enable them from settings.",
    });
  };
  
  // Don't show button if tours are already disabled or if user hides it
  if (onboardingState.disableAllTours || !showDismissButton) {
    return null;
  }
  
  return (
    <Button
      variant="outline"
      size="sm"
      className="fixed right-6 bottom-20 z-50 rounded-full p-2 bg-white shadow-md border flex items-center gap-1"
      onClick={handleDisableTours}
    >
      <X className="h-4 w-4" />
      <span className="text-xs">Disable Tours</span>
    </Button>
  );
}