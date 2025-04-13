import React from 'react';

// Enhanced styling for elements highlighted during the tour
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
        
        /* Add a subtle page overlay to make highlighted elements stand out more */
        body.tour-active::after {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.15);
          z-index: 5;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        
        /* Mobile-specific overlay adjustment - thinner overlay for better visibility */
        @media (max-width: 640px) {
          body.tour-active::after {
            background: rgba(0, 0, 0, 0.1);
          }
          
          /* Adjust the blurring effect for mobile - none for better performance */
          body.tour-active::before {
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }
        }
        
        /* General highlighting for any element with tour-highlight class (but outside dialogs) */
        *:not([role="dialog"]):not(.DialogContent):not(.DialogOverlay).tour-highlight,
        *:not([role="dialog"] *):not(.DialogContent *):not(.DialogOverlay *).tour-highlight {
          position: relative;
          z-index: 10;
          animation: tour-pulse 2s infinite;
          box-shadow: 0 0 0 8px rgba(99, 102, 241, 0.6), 0 0 20px rgba(99, 102, 241, 0.4);
          outline: 3px solid rgba(99, 102, 241, 0.8);
          outline-offset: 4px;
          pointer-events: auto !important;
        }
        
        /* For Fundi's robot avatar - extremely specific to avoid any false positives */
        div.fixed.z-\\[9999\\].robot-fundi.tour-highlight,
        div:not([role="dialog"]):not(.DialogContent):not(.DialogOverlay) > div.fixed.z-\\[9999\\].robot-fundi.tour-highlight,
        body > div > div.fixed.z-\\[9999\\].robot-fundi.tour-highlight {
          position: relative;
          z-index: 50;
          animation: tour-pulse 2s infinite;
          box-shadow: 0 0 0 8px rgba(99, 102, 241, 0.6), 0 0 20px rgba(99, 102, 241, 0.4);
          outline: 3px solid rgba(99, 102, 241, 0.8);
          outline-offset: 4px;
          pointer-events: auto !important;
        }
        
        /* Feature-specific highlighting classes with enhanced visibility */
        main:not([role="dialog"]) div.course-list.tour-highlight,
        main:not([role="dialog"]) div.finance-tools.tour-highlight,
        main:not([role="dialog"]) div.resume-builder.tour-highlight,
        main:not([role="dialog"]) div.meditation-guide.tour-highlight,
        main:not([role="dialog"]) div.fitness-tracker.tour-highlight,
        main:not([role="dialog"]) div.emergency-guides.tour-highlight {
          position: relative;
          z-index: 10;
          animation: tour-feature-pulse 2s infinite;
          box-shadow: 0 0 0 8px rgba(99, 102, 241, 0.6), 0 0 30px rgba(99, 102, 241, 0.4);
          outline: 3px solid rgba(99, 102, 241, 0.9);
          outline-offset: 4px;
          pointer-events: auto !important;
          transform: scale(1.02);
          transition: transform 0.3s ease;
          filter: brightness(1.1) contrast(1.05);
        }
        
        /* General sections and divs that might be highlighted */
        main:not([role="dialog"]) section.tour-highlight,
        main:not([role="dialog"]) div.tour-highlight {
          position: relative;
          z-index: 10;
          animation: tour-pulse 2s infinite;
          box-shadow: 0 0 0 8px rgba(99, 102, 241, 0.6), 0 0 20px rgba(99, 102, 241, 0.4);
          outline: 3px solid rgba(99, 102, 241, 0.8);
          outline-offset: 4px;
          pointer-events: auto !important;
        }
        
        /* Make sure tour modal stays above highlighted elements */
        [role="dialog"][data-state="open"] [data-tour-dialog] {
          z-index: 60 !important;
        }
        
        /* For tour cards highlight */
        .tour-card-highlight {
          z-index: 11 !important;
          transform: translateZ(0) scale(1.03) !important;
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4), 0 8px 10px -6px rgba(99, 102, 241, 0.3) !important;
          transition: all 0.3s ease !important;
        }
        
        /* Mobile-specific highlight adjustments */
        @media (max-width: 640px) {
          /* Smaller, more subtle highlights on mobile */
          *:not([role="dialog"]):not(.DialogContent):not(.DialogOverlay).tour-highlight,
          *:not([role="dialog"] *):not(.DialogContent *):not(.DialogOverlay *).tour-highlight {
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.5), 0 0 10px rgba(99, 102, 241, 0.3) !important;
            outline: 2px solid rgba(99, 102, 241, 0.7) !important;
            outline-offset: 2px !important;
            animation: tour-pulse-mobile 2s infinite !important;
          }
          
          /* Smaller feature highlights for mobile */
          main:not([role="dialog"]) div.course-list.tour-highlight,
          main:not([role="dialog"]) div.finance-tools.tour-highlight,
          main:not([role="dialog"]) div.resume-builder.tour-highlight,
          main:not([role="dialog"]) div.meditation-guide.tour-highlight,
          main:not([role="dialog"]) div.fitness-tracker.tour-highlight,
          main:not([role="dialog"]) div.emergency-guides.tour-highlight {
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.5), 0 0 15px rgba(99, 102, 241, 0.3) !important;
            outline: 2px solid rgba(99, 102, 241, 0.8) !important;
            outline-offset: 2px !important;
            transform: scale(1.01) !important;
            animation: tour-feature-pulse-mobile 2s infinite !important;
          }
          
          /* No scale transform on mobile */
          .tour-card-highlight {
            transform: none !important;
            box-shadow: 0 5px 15px -3px rgba(99, 102, 241, 0.3), 0 4px 6px -4px rgba(99, 102, 241, 0.2) !important;
          }
        }
        
        /* Enhanced animation for regular highlights */
        @keyframes tour-pulse {
          0% {
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.6), 0 0 20px rgba(99, 102, 241, 0.2);
            outline-color: rgba(99, 102, 241, 0.8);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(99, 102, 241, 0.4), 0 0 25px rgba(99, 102, 241, 0.4);
            outline-color: rgba(99, 102, 241, 1);
          }
          100% {
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.6), 0 0 20px rgba(99, 102, 241, 0.2);
            outline-color: rgba(99, 102, 241, 0.8);
          }
        }
        
        /* Mobile optimized animations - less intense */
        @keyframes tour-pulse-mobile {
          0% {
            box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5), 0 0 8px rgba(99, 102, 241, 0.2);
            outline-color: rgba(99, 102, 241, 0.7);
          }
          50% {
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.4), 0 0 12px rgba(99, 102, 241, 0.3);
            outline-color: rgba(99, 102, 241, 0.9);
          }
          100% {
            box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5), 0 0 8px rgba(99, 102, 241, 0.2);
            outline-color: rgba(99, 102, 241, 0.7);
          }
        }
        
        @keyframes tour-feature-pulse-mobile {
          0% {
            box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5), 0 0 10px rgba(99, 102, 241, 0.2);
            outline-color: rgba(99, 102, 241, 0.8);
          }
          50% {
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.4), 0 0 15px rgba(99, 102, 241, 0.3);
            outline-color: rgba(99, 102, 241, 0.9);
          }
          100% {
            box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5), 0 0 10px rgba(99, 102, 241, 0.2);
            outline-color: rgba(99, 102, 241, 0.8);
          }
        }
        
        /* Special animation for featured elements */
        @keyframes tour-feature-pulse {
          0% {
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.6), 0 0 30px rgba(99, 102, 241, 0.3);
            outline-color: rgba(99, 102, 241, 0.9);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(99, 102, 241, 0.5), 0 0 40px rgba(99, 102, 241, 0.5);
            outline-color: rgba(99, 102, 241, 1);
          }
          100% {
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.6), 0 0 30px rgba(99, 102, 241, 0.3);
            outline-color: rgba(99, 102, 241, 0.9);
          }
        }
      `
    }} />
  );
};

export default TourHighlight;