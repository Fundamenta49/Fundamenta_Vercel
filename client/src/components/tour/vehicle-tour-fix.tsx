// CRITICAL: Emergency fix for Vehicle Maintenance page tour dialog position
// This is a completely standalone script that runs immediately on import

console.log("EMERGENCY VEHICLE TOUR FIX LOADED");

// Function to detect if we're on the vehicle maintenance page
function isVehicleMaintenancePage() {
  return window.location.pathname.includes('/learning/courses/vehicle-maintenance') || 
         document.body.classList.contains('tour-vehicle-page') ||
         document.body.getAttribute('data-tour-route')?.includes('vehicle-maintenance');
}

// Create a standalone immediate function that keeps checking and fixing
const runEmergencyFix = () => {
  // Add emergency class to document body
  document.body.classList.add('tour-emergency-fix');
  
  if (isVehicleMaintenancePage()) {
    // Apply specific classes for targeted CSS
    document.body.classList.add('tour-vehicle-page');
    document.body.setAttribute('data-tour-route', '/learning/courses/vehicle-maintenance');
    
    // Mark for emergency fix targeting
    document.body.setAttribute('data-emergency-fix', 'true');
    console.log("EMERGENCY: Vehicle maintenance page detected, applying continuous fix");
  }
  
  // Create a continuous observer to fix ANY tour dialog that appears
  const fixDialogs = () => {
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
      console.log(`EMERGENCY FIX: Found ${tourDialogs.length} tour dialogs to fix`);
      
      tourDialogs.forEach(dialog => {
        const dialogEl = dialog as HTMLElement;
        
        // Apply the most aggressive fix possible - direct style override with !important
        dialogEl.style.cssText = `
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
        dialogEl.setAttribute('data-tour-fixed', 'true');
        
        // Fix dialog buttons
        const buttons = dialogEl.querySelectorAll('button');
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
        const footer = dialogEl.querySelector('[class*="DialogFooter"], .flex.justify-between');
        if (footer && footer instanceof HTMLElement) {
          footer.style.cssText = `
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 5px !important;
            justify-content: space-between !important;
          `;
        }
      });
    }
  };
  
  // Run the fix immediately
  fixDialogs();
  
  // Create a continuous interval that keeps checking
  const intervalId = setInterval(fixDialogs, 100);
  
  // Set up mutation observer to catch new dialogs instantly
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        fixDialogs();
        break;
      }
    }
  });
  
  // Observe the entire document for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });
  
  // We're intentionally not cleaning up this interval - we want the fix to be persistent
  console.log("EMERGENCY: Continuous vehicle maintenance fix is running");
};

// Run the fix immediately
runEmergencyFix();

// Export a dummy component for React imports
export default function VehicleTourFix() {
  return null;
}