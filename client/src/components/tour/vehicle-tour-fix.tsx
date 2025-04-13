// REVISED VERSION: Emergency fix for Vehicle Maintenance page dialog position
// This is a more cooperative version that works with the mega fix
import { useEffect } from 'react';

console.log("COOPERATIVE VEHICLE TOUR FIX LOADED");

// Function to detect if we're on the vehicle maintenance page
function isVehicleMaintenancePage() {
  return window.location.pathname.includes('/learning/courses/vehicle-maintenance') || 
         document.body.classList.contains('tour-vehicle-page') ||
         document.body.getAttribute('data-tour-route')?.includes('vehicle-maintenance');
}

// Create a function that only fixes the dialog position, not Fundi's position
const runCooperativeFix = () => {
  // Add emergency class to document body
  document.body.classList.add('tour-emergency-fix');
  
  if (isVehicleMaintenancePage()) {
    // Apply specific classes for targeted CSS
    document.body.classList.add('tour-vehicle-page');
    document.body.setAttribute('data-tour-route', '/learning/courses/vehicle-maintenance');
    
    // Mark for emergency fix targeting
    document.body.setAttribute('data-emergency-fix', 'true');
    console.log("COOPERATIVE: Vehicle maintenance page detected, applying dialog-only fix");
  }
  
  // Create a gentler observer that only fixes dialog positions
  const fixDialogsOnly = () => {
    // Target all possible tour dialogs with every selector we can think of
    const dialogSelectors = [
      '[data-tour-dialog]',
      '[data-radix-dialog-content]',
      '.tour-speech-bubble',
      '[data-tour="content"]',
      '.tour-fix-dialog'
    ];
    
    const tourDialogs = document.querySelectorAll(dialogSelectors.join(', '));
    const isDesktop = window.innerWidth >= 640;
    
    if (tourDialogs.length > 0) {
      tourDialogs.forEach(dialog => {
        // Only apply styles if the element doesn't already have our mega fix applied
        if (dialog instanceof HTMLElement && !dialog.hasAttribute('data-dialog-mega-fixed')) {
          // Add data attributes for CSS targeting before applying styles
          dialog.setAttribute('data-tour-fixed', 'true');
          
          // Apply dialog styling with !important
          dialog.style.cssText = `
            position: fixed !important;
            max-width: ${isDesktop ? '400px' : 'calc(100vw - 40px)'} !important;
            width: ${isDesktop ? '400px' : '320px'} !important; 
            right: 20px !important;
            left: auto !important;
            top: auto !important;
            bottom: ${isDesktop ? '80px' : '20px'} !important;
            z-index: 999998 !important;
            max-height: ${isDesktop ? '70vh' : '400px'} !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            transform: none !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
            border: 2px solid rgba(var(--primary-rgb, 59, 130, 246), 0.5) !important;
            background-color: white !important;
          `;
          
          // Fix dialog buttons
          const buttons = dialog.querySelectorAll('button');
          buttons.forEach(button => {
            if (button instanceof HTMLElement) {
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
            }
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
  };
  
  // Run the fix immediately for any existing dialogs
  fixDialogsOnly();
  
  // Create a less aggressive interval (300ms instead of 100ms)
  const intervalId = setInterval(fixDialogsOnly, 300);
  
  // Set up mutation observer with less aggressive filtering
  const observer = new MutationObserver((mutations) => {
    let shouldFix = false;
    
    for (const mutation of mutations) {
      // Only check for added nodes that might be dialogs
      if (mutation.addedNodes.length > 0) {
        // Convert NodeList to Array to avoid TypeScript issues
        Array.from(mutation.addedNodes).forEach(node => {
          if (node instanceof HTMLElement) {
            // Check if this might be a dialog element
            if (node.hasAttribute && (
                node.hasAttribute('data-tour-dialog') || 
                node.hasAttribute('data-radix-dialog-content') ||
                node.classList.contains('tour-speech-bubble') ||
                node.querySelector('[data-tour-dialog]')
              )) {
              shouldFix = true;
            }
          }
        });
      }
      
      if (shouldFix) break;
    }
    
    if (shouldFix) {
      fixDialogsOnly();
    }
  });
  
  // Observe only parts of the document that might contain dialogs
  const dialogContainers = document.querySelectorAll('body, #root, [id*="dialog"], [class*="dialog"]');
  Array.from(dialogContainers).forEach(container => {
    observer.observe(container, {
      childList: true,
      subtree: true
    });
  });
  
  // Add a cleanup function to window so it can be called elsewhere if needed
  (window as any).cleanupVehicleFix = () => {
    clearInterval(intervalId);
    observer.disconnect();
    console.log("Vehicle tour fix stopped");
  };
  
  console.log("COOPERATIVE: Vehicle maintenance dialog fix is running");
  
  // Return the cleanup function
  return () => {
    if ((window as any).cleanupVehicleFix) {
      (window as any).cleanupVehicleFix();
    }
  };
};

// Run the fix immediately
const cleanup = runCooperativeFix();

// Export a component that allows cleanup on unmount

export default function VehicleTourFix() {
  useEffect(() => {
    // This allows React to properly clean up when the component unmounts
    return cleanup;
  }, []);
  
  return null;
}