/**
 * COMPLETE REPLACEMENT FOR ALL TOUR COMPONENTS
 * This standalone component controls Fundi and dialog positioning
 * specifically for the vehicle maintenance page
 */

import React, { useEffect } from 'react';

export default function VehicleMaintenanceTourFix() {
  useEffect(() => {
    console.log("NEW DEDICATED VEHICLE PAGE TOUR FIX LOADED");
    
    // Mark the document for special targeting
    document.body.setAttribute('data-vehicle-tour-fix', 'true');
    
    // Function to apply our fixes with maximum force
    function applyTourFixes() {
      // Screen size detection
      const isDesktop = window.innerWidth >= 640;
      
      // ===== STEP 1: FORCE HIDE ANY OTHER TOUR COMPONENTS =====
      const otherTourComponents = document.querySelectorAll(
        '.tour-guide, [data-radix-popper-content-wrapper], .tour-overlay, .z-\\[9990\\]'
      );
      
      otherTourComponents.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.cssText = `
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
          `;
        }
      });
      
      // ===== STEP 2: POSITION FUNDI CHARACTER =====
      // Grab any Fundi elements using multiple selectors for maximum coverage
      const fundiElements = document.querySelectorAll(
        '.robot-container, .fixed.z-\\[99999\\], .fundi-container, [data-fundi="true"], .tour-fundi-robot'
      );
      
      fundiElements.forEach(el => {
        if (el instanceof HTMLElement) {
          if (isDesktop) {
            // Desktop positioning - centered Fundi
            el.style.cssText = `
              position: fixed !important;
              top: 180px !important;
              left: 50% !important;
              transform: translateX(-50%) !important;
              right: auto !important;
              bottom: auto !important;
              z-index: 999999 !important;
              width: 110px !important;
              height: 110px !important;
              max-width: 110px !important;
              max-height: 110px !important;
              pointer-events: auto !important;
              display: block !important;
              opacity: 1 !important;
              visibility: visible !important;
            `;
          } else {
            // Mobile positioning - smaller and higher up
            el.style.cssText = `
              position: fixed !important;
              top: 140px !important;
              left: 50% !important;
              transform: translateX(-50%) !important;
              right: auto !important;
              bottom: auto !important;
              z-index: 999999 !important;
              width: 80px !important;
              height: 80px !important;
              max-width: 80px !important;
              max-height: 80px !important;
              pointer-events: auto !important;
              display: block !important;
              opacity: 1 !important;
              visibility: visible !important;
            `;
          }
          
          // Add data attribute for CSS targeting
          el.setAttribute('data-vehicle-fixed', 'true');
        }
      });
      
      // ===== STEP 3: POSITION TOUR DIALOG =====
      // Fix any tour dialogs to stay centered below Fundi
      const tourDialogs = document.querySelectorAll(
        '[data-tour-dialog], [data-radix-dialog-content], .tour-speech-bubble, [data-tour="content"]'
      );
      
      tourDialogs.forEach(dialog => {
        if (dialog instanceof HTMLElement) {
          // Direct style override with !important for maximum specificity
          if (isDesktop) {
            // Desktop sizing: 5 pixels bigger all around and perfectly centered
            dialog.style.cssText = `
              position: fixed !important;
              max-width: 370px !important; /* +5px on each side from previous 360px */
              width: 370px !important; 
              left: 50% !important;
              right: auto !important;
              transform: translateX(-50%) !important;
              top: 300px !important; /* positioned below Fundi */
              bottom: auto !important;
              z-index: 999999 !important;
              max-height: 520px !important; /* +5px top and bottom */
              overflow-y: auto !important;
              overflow-x: hidden !important;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
              border: none !important;
              background-color: white !important;
              border-radius: 8px !important;
              padding: 30px !important; /* increased by 5px from previous 25px */
              display: block !important;
              opacity: 1 !important;
              visibility: visible !important;
            `;
          } else {
            // Mobile sizing: Larger and more accessible on smaller screens
            dialog.style.cssText = `
              position: fixed !important;
              max-width: calc(100vw - 30px) !important;
              width: calc(100vw - 30px) !important; 
              left: 50% !important;
              right: auto !important;
              transform: translateX(-50%) !important;
              top: 230px !important; /* positioned below mobile Fundi */
              bottom: auto !important;
              z-index: 999999 !important;
              max-height: 60vh !important;
              overflow-y: auto !important;
              overflow-x: hidden !important;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
              border: none !important;
              background-color: white !important;
              border-radius: 8px !important;
              padding: 25px !important;
              display: block !important;
              opacity: 1 !important;
              visibility: visible !important;
            `;
          }
          
          // Add data attribute for CSS targeting
          dialog.setAttribute('data-vehicle-tour-fixed', 'true');
          
          // ===== STEP 4: FIX BUTTON LAYOUTS =====
          // Fix any buttons to make sure they fit and are visible
          const buttons = dialog.querySelectorAll('button');
          buttons.forEach(button => {
            button.style.cssText = `
              display: inline-flex !important;
              margin: 4px !important;
              padding: 0 12px !important;
              font-size: 14px !important;
              line-height: 28px !important;
              height: 32px !important;
              min-width: 0 !important;
              white-space: nowrap !important;
              overflow: hidden !important;
              text-overflow: ellipsis !important;
            `;
          });
          
          // Fix dialog footer layout
          const footer = dialog.querySelector('[class*="DialogFooter"], .flex.justify-between');
          if (footer && footer instanceof HTMLElement) {
            footer.style.cssText = `
              display: flex !important;
              flex-wrap: wrap !important;
              gap: 5px !important;
              justify-content: space-between !important;
              margin-top: 1rem !important;
            `;
          }
        }
      });
    }

    // Run immediately 
    applyTourFixes();
    
    // Run on a continuous interval to prevent other components from taking over
    const intervalId = setInterval(applyTourFixes, 100);
    
    // Create a MutationObserver to catch any newly added elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          applyTourFixes();
        }
      });
    });
    
    // Start observing the document
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    // Clean up on unmount
    return () => {
      clearInterval(intervalId);
      observer.disconnect();
      document.body.removeAttribute('data-vehicle-tour-fix');
    };
  }, []);

  // This component doesn't render any UI
  return null;
}