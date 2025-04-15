import React from 'react';
import { useOnboarding } from '@/lib/onboarding-context';
import { Button } from "@/components/ui/button";

export const ResetTourButton = () => {
  const { resetAllTours } = useOnboarding();
  
  const handleReset = () => {
    // Clear localStorage onboarding state
    localStorage.removeItem('fundamenta_onboarding_state');
    
    // Use the context function to reset all tours
    resetAllTours();
    
    // Refresh the page to ensure the tour starts from the beginning
    window.location.reload();
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleReset}
      className="fixed bottom-4 left-4 z-50 text-xs"
    >
      Reset Tour
    </Button>
  );
};