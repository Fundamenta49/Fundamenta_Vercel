/**
 * EMERGENCY FIX: This component ensures Fundi stays visible on the screen
 * Specifically for the Vehicle Maintenance page tour
 */

import React, { useEffect } from 'react';

export default function FundiEmergencyFix() {
  useEffect(() => {
    console.log("ULTRA EMERGENCY FUNDI FIX LOADED");
    
    // Mark the document for special CSS targeting
    document.body.setAttribute('data-emergency-fix', 'true');
    
    // Apply immediate fix to force Fundi position 
    function forceFixFundi() {
      // Detect screen size once for both element types
      const isDesktop = window.innerWidth >= 640;
      
      // ===== FUNDI ROBOT POSITIONING =====
      // Find Fundi elements using various possible selectors
      const fundiElements = document.querySelectorAll(
        '.robot-container, .fixed.z-\\[99999\\], .fundi-container, [data-fundi="true"]'
      );
      
      // Apply emergency positioning to Fundi
      fundiElements.forEach(el => {
        if (el instanceof HTMLElement) {
          if (isDesktop) {
            // Desktop positioning - larger Fundi centered on screen
            el.style.cssText = `
              position: fixed !important;
              top: 300px !important;
              left: 50% !important;
              transform: translateX(-50%) !important;
              right: auto !important;
              bottom: auto !important;
              z-index: 999999 !important;
              width: 96px !important;
              height: 96px !important;
              max-width: 96px !important;
              max-height: 96px !important;
              pointer-events: auto !important;
            `;
          } else {
            // Mobile positioning - slightly smaller Fundi, positioned differently
            el.style.cssText = `
              position: fixed !important;
              top: 240px !important;
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
            `;
          }
          
          // Add a data attribute for CSS targeting
          el.setAttribute('data-fundi-fixed', 'true');
        }
      });
      
      // ===== TOUR DIALOG POSITIONING =====
      // Fix any tour dialogs to stay at bottom right
      const tourDialogs = document.querySelectorAll(
        '[data-tour-dialog], [data-radix-dialog-content], .tour-speech-bubble, [data-tour="content"]'
      );
      
      tourDialogs.forEach(dialog => {
        if (dialog instanceof HTMLElement) {
          // Direct style override with !important for maximum specificity
          // Different styling for desktop vs mobile
          if (isDesktop) {
            // Desktop sizing: Made 5 pixels bigger all around and positioned closer to center
            dialog.style.cssText = `
              position: fixed !important;
              max-width: 330px !important;
              width: 330px !important; 
              left: 50% !important;
              right: auto !important;
              transform: translateX(-50%) !important;
              top: 150px !important;
              bottom: auto !important;
              z-index: 999999 !important;
              max-height: 510px !important;
              overflow-y: auto !important;
              overflow-x: hidden !important;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
              border: none !important;
              background-color: white !important;
              border-radius: 8px !important;
              padding: 25px !important;
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
              top: 120px !important;
              bottom: auto !important;
              z-index: 999999 !important;
              max-height: 60vh !important;
              overflow-y: auto !important;
              overflow-x: hidden !important;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
              border: none !important;
              background-color: white !important;
              border-radius: 8px !important;
              padding: 20px !important;
            `;
          }
          
          // Add data attributes for CSS targeting
          dialog.setAttribute('data-tour-fixed', 'true');
          
          // Fix any buttons to make sure they fit and are visible
          const buttons = dialog.querySelectorAll('button');
          buttons.forEach(button => {
            button.style.cssText = `
              display: inline-flex !important;
              margin: 4px !important;
              padding: 0 8px !important;
              font-size: 12px !important;
              height: 28px !important;
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
            `;
          }
        }
      });
    }

    // Run immediately 
    forceFixFundi();
    
    // Run on a continuous interval
    const intervalId = setInterval(forceFixFundi, 100);
    
    // Create a MutationObserver to catch any newly added elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          forceFixFundi();
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
    };
  }, []);

  // This component doesn't render any UI
  return null;
}