import React from 'react';

// Styling for elements highlighted during the tour
const TourHighlight = () => {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        /* 
         * Very specific CSS selectors to avoid conflicts and highlight only the elements we want.
         * This ensures elements inside dialogs or positioned over dialogs don't get highlighted.
         */
       
        /* Explicitly don't apply highlighting to dialogs or any content inside them */
        [role="dialog"] *,
        [role="alertdialog"] *,
        .DialogContent *,
        .DialogOverlay * {
          animation: none !important;
          box-shadow: none !important;
          outline: none !important;
        }
        
        /* General highlighting for any element with tour-highlight class (but outside dialogs) */
        *:not([role="dialog"]):not(.DialogContent):not(.DialogOverlay).tour-highlight,
        *:not([role="dialog"] *):not(.DialogContent *):not(.DialogOverlay *).tour-highlight {
          position: relative;
          z-index: 10;
          animation: tour-pulse 1.5s infinite;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.6);
          outline: 2px solid rgba(99, 102, 241, 0.8);
          outline-offset: 2px;
          pointer-events: auto !important;
        }
        
        /* For Fundi's robot avatar - extremely specific to avoid any false positives */
        div.fixed.z-\\[9999\\].robot-fundi.tour-highlight,
        div:not([role="dialog"]):not(.DialogContent):not(.DialogOverlay) > div.fixed.z-\\[9999\\].robot-fundi.tour-highlight,
        body > div > div.fixed.z-\\[9999\\].robot-fundi.tour-highlight {
          position: relative;
          z-index: 50;
          animation: tour-pulse 1.5s infinite;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.6);
          outline: 2px solid rgba(99, 102, 241, 0.8);
          outline-offset: 2px;
          pointer-events: auto !important;
        }
        
        /* For features that need highlighting (using very specific selectors) */
        main:not([role="dialog"]) div.course-list.tour-highlight,
        main:not([role="dialog"]) div.finance-tools.tour-highlight,
        main:not([role="dialog"]) div.resume-builder.tour-highlight,
        main:not([role="dialog"]) div.meditation-guide.tour-highlight,
        main:not([role="dialog"]) div.fitness-tracker.tour-highlight,
        main:not([role="dialog"]) div.emergency-guides.tour-highlight,
        main:not([role="dialog"]) section.tour-highlight,
        main:not([role="dialog"]) div.tour-highlight {
          position: relative;
          z-index: 10;
          animation: tour-pulse 1.5s infinite;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.6);
          outline: 2px solid rgba(99, 102, 241, 0.8);
          outline-offset: 2px;
          pointer-events: auto !important;
        }
        
        /* Make sure tour modal stays above highlighted elements */
        [role="dialog"][data-state="open"].tour-dialog {
          z-index: 60 !important;
        }
        
        /* Improved animation to avoid conflicts with other animations */
        @keyframes tour-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.6);
            outline-color: rgba(99, 102, 241, 0.8);
          }
          70% {
            box-shadow: 0 0 0 8px rgba(99, 102, 241, 0);
            outline-color: rgba(99, 102, 241, 1);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
            outline-color: rgba(99, 102, 241, 0.8);
          }
        }
      `
    }} />
  );
};

export default TourHighlight;