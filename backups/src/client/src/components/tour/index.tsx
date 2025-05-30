import React, { useLayoutEffect, useEffect } from 'react';
import TourHighlight from './tour-highlight';
import FundiTourGuide from './fundi-tour-guide';
import TourEmergencyFix from './tour-emergency-fix';
import VehicleTourFix from './vehicle-tour-fix'; // Import the aggressive emergency fix
import { useTour } from '@/contexts/tour-context';

// Main tour component that includes all tour-related subcomponents
const Tour = () => {
  const { isTourActive } = useTour();

  // Handle mobile-specific positioning with useLayoutEffect (runs before browser paint)
  // We still keep this for any other tour-related dialogs
  useLayoutEffect(() => {
    const handleTourDialogPosition = () => {
      const isMobile = window.innerWidth < 640;
      const dialogElements = document.querySelectorAll('[data-tour-dialog]');
      
      dialogElements.forEach(dialog => {
        if (isMobile) {
          // Add mobile specific class
          dialog.classList.add('mobile-tour-dialog');
          
          // Make sure dialog has a proper background and isn't transparent
          if (dialog instanceof HTMLElement) {
            dialog.style.backgroundColor = 'white';
            dialog.style.borderRadius = '0.75rem';
            dialog.style.border = '1px solid rgba(0, 0, 0, 0.1)';
            dialog.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)';
            dialog.style.maxHeight = '70vh';
            dialog.style.overflowY = 'auto';
            dialog.style.width = 'calc(100% - 1rem)';
            dialog.style.margin = '0 auto';
            dialog.style.bottom = '1rem';
            dialog.style.left = '0.5rem';
            dialog.style.right = '0.5rem';
          }
        } else {
          dialog.classList.remove('mobile-tour-dialog');
          
          // Reset styles for desktop
          if (dialog instanceof HTMLElement) {
            dialog.style.width = '';
            dialog.style.margin = '';
            dialog.style.bottom = '';
            dialog.style.left = '';
            dialog.style.right = '';
          }
        }
      });
    };

    // Initial positioning
    handleTourDialogPosition();
    
    // Update positioning on resize
    window.addEventListener('resize', handleTourDialogPosition);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleTourDialogPosition);
    };
  }, []);

  // Set a class on the body when tour is active for global styling 
  useEffect(() => {
    if (isTourActive) {
      document.body.classList.add('tour-active');
    } else {
      document.body.classList.remove('tour-active');
    }
    
    return () => {
      document.body.classList.remove('tour-active');
    };
  }, [isTourActive]);

  return (
    <>
      <TourEmergencyFix />
      <VehicleTourFix /> {/* Add our special emergency fix for vehicle maintenance */}
      <FundiTourGuide />
      <TourHighlight />
    </>
  );
};

export default Tour;