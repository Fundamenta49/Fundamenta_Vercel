import React, { useLayoutEffect, useEffect } from 'react';
import TourModal from './tour-modal';
import TourHighlight from './tour-highlight';

// Main tour component that includes all tour-related subcomponents
const Tour = () => {
  // Handle mobile-specific positioning with useLayoutEffect (runs before browser paint)
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
            dialog.style.borderRadius = '0.5rem';
            dialog.style.border = '1px solid rgba(0, 0, 0, 0.1)';
            dialog.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)';
            dialog.style.maxHeight = '65vh';
            dialog.style.overflowY = 'auto';
          }
        } else {
          dialog.classList.remove('mobile-tour-dialog');
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

  return (
    <>
      <TourModal />
      <TourHighlight />
    </>
  );
};

export default Tour;