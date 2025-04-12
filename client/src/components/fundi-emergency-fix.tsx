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
      // Find Fundi elements using various possible selectors
      const fundiElements = document.querySelectorAll(
        '.robot-container, .fixed.z-\\[99999\\], .fundi-container, [data-fundi="true"]'
      );
      
      // Apply emergency positioning to Fundi
      fundiElements.forEach(el => {
        if (el instanceof HTMLElement) {
          // Directly override all styles using !important
          el.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            left: auto !important;
            bottom: auto !important;
            transform: none !important;
            z-index: 999999 !important;
          `;
          
          // Add a data attribute for CSS targeting
          el.setAttribute('data-fundi-fixed', 'true');
        }
      });
      
      // Fix any tour dialogs to stay at bottom right
      const tourDialogs = document.querySelectorAll(
        '[data-tour-dialog], [data-radix-dialog-content], .tour-speech-bubble, [data-tour="content"]'
      );
      
      const isDesktop = window.innerWidth >= 640;
      
      tourDialogs.forEach(dialog => {
        if (dialog instanceof HTMLElement) {
          // Direct style override with !important for maximum specificity
          dialog.style.cssText = `
            position: fixed !important;
            max-width: ${isDesktop ? '400px' : 'calc(100vw - 40px)'} !important;
            width: ${isDesktop ? '400px' : '320px'} !important; 
            right: 20px !important;
            left: auto !important;
            top: auto !important;
            bottom: ${isDesktop ? '80px' : '20px'} !important;
            z-index: 999999 !important;
            max-height: ${isDesktop ? '70vh' : '400px'} !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            transform: none !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
            border: 2px solid rgba(var(--primary-rgb, 59, 130, 246), 0.5) !important;
            background-color: white !important;
          `;
          
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