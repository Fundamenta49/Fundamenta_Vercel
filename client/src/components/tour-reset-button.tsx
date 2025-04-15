import React from 'react';
import { Button } from "@/components/ui/button";

export const TourResetButton = () => {
  const handleReset = () => {
    // Clear the tour completion flag from localStorage
    localStorage.removeItem('fundamenta-tour-completed');
    
    // Reload the page to start the tour again
    window.location.reload();
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleReset}
      className="ml-2"
    >
      Reset Tour
    </Button>
  );
};