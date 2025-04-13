/**
 * ULTRA EMERGENCY: Force Fundi to stay COMPLETELY STATIC with no animations or movement
 * This is a last resort to fix tour issues in Vehicle Maintenance
 */

import { useEffect } from 'react';

export default function FrozenFundiFix() {
  useEffect(() => {
    console.log("CRITICAL EMERGENCY: FREEZING FUNDI POSITION");
    
    // EXTREME measures
    function freezeFundi() {
      // Completely freeze all animations
      const style = document.createElement('style');
      style.id = 'freeze-all-fundi-animations';
      style.innerHTML = `
        /* Target Fundi and all related elements */
        .robot-container, 
        [data-fundi="true"],
        .fundi-container,
        .fixed.z-\\[99999\\],
        [data-fundi-fixed="true"] {
          position: fixed !important;
          top: 20px !important;
          right: 20px !important;
          left: auto !important;
          bottom: auto !important;
          transform: none !important;
          animation: none !important;
          transition: none !important;
          z-index: 9999999 !important;
          pointer-events: auto !important;
        }
        
        /* Target all animation and transition classes */
        [class*="animate-"], 
        [class*="transition-"],
        [class*="motion-"] {
          animation: none !important;
          transition: none !important;
          transform: none !important;
        }
        
        /* Force absolute positioning for all dialogs */
        [data-tour-dialog], 
        [data-radix-dialog-content], 
        .tour-speech-bubble,
        [data-state="open"] {
          position: fixed !important;
          bottom: 80px !important;
          right: 20px !important;
          left: auto !important;
          top: auto !important;
          max-width: 400px !important;
          width: 400px !important;
          max-height: 70vh !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          z-index: 9999999 !important;
          transform: none !important;
          animation: none !important;
          transition: none !important;
        }
      `;
      document.head.appendChild(style);
      
      // Brute force direct DOM manipulation
      function forceStaticPositioning() {
        // Prevent any movement or animations in Fundi
        const fundiElements = document.querySelectorAll(
          '.robot-container, .fixed.z-\\[99999\\], .fundi-container, [data-fundi="true"]'
        );
        
        fundiElements.forEach(el => {
          if (el instanceof HTMLElement) {
            // Direct style injection with important flags
            el.style.cssText = `
              position: fixed !important;
              top: 20px !important;
              right: 20px !important;
              left: auto !important;
              bottom: auto !important;
              transform: none !important;
              transition: none !important;
              animation: none !important;
              z-index: 9999999 !important;
            `;
            
            // Completely remove any transform/transition/animation properties
            el.style.removeProperty('transform');
            el.style.removeProperty('transition');
            el.style.removeProperty('animation');
            
            // Add data attributes for targeting with CSS
            el.setAttribute('data-fundi-frozen', 'true');
          }
        });
        
        // Disable all animations across the page by pausing them
        document.body.style.setProperty('animation-play-state', 'paused', 'important');
        
        // Freeze all dialog components too
        const dialogElements = document.querySelectorAll(
          '[data-tour-dialog], [data-radix-dialog-content], .tour-speech-bubble, [data-state="open"]'
        );
        
        dialogElements.forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.cssText = `
              position: fixed !important;
              bottom: 80px !important;
              right: 20px !important;
              left: auto !important;
              top: auto !important;
              max-width: 400px !important;
              width: 400px !important;
              max-height: 70vh !important;
              overflow-y: auto !important;
              overflow-x: hidden !important;
              z-index: 9999998 !important;
              transform: none !important;
              animation: none !important;
              transition: none !important;
            `;
            
            // Completely remove problematic properties
            el.style.removeProperty('transform');
            el.style.removeProperty('transition');
            el.style.removeProperty('animation');
            
            // Add data attribute for targeting
            el.setAttribute('data-dialog-frozen', 'true');
          }
        });
      }
      
      // Run the fix continuously
      forceStaticPositioning();
      const fixInterval = setInterval(forceStaticPositioning, 50); // Run very frequently
      
      // Set attribute on body for global CSS targeting
      document.body.setAttribute('data-tour-frozen', 'true');
      
      // Return cleanup function
      return () => {
        clearInterval(fixInterval);
        const styleEl = document.getElementById('freeze-all-fundi-animations');
        if (styleEl) styleEl.remove();
        document.body.removeAttribute('data-tour-frozen');
      };
    }
    
    // Execute the freeze immediately
    const cleanup = freezeFundi();
    
    // Cleanup on unmount
    return cleanup;
  }, []);
  
  return null;
}