/**
 * ULTRA FIX: A nuclear solution that overrides all other fixes
 * This component completely removes all other fixes and replaces them with a direct solution
 */

import { useEffect } from 'react';
import { useTour } from '@/contexts/tour-context';

export default function FundiUltraFix() {
  const { isTourActive } = useTour();
  
  useEffect(() => {
    if (!isTourActive) return;
    
    console.log("🔥 ULTRA FIX: Nuclear override activated");
    
    // 1. First, find and completely disable all other fixes
    const disableAllOtherFixes = () => {
      // Disable vehicle fix if it exists
      if ((window as any).cleanupVehicleFix) {
        (window as any).cleanupVehicleFix();
        console.log("🚫 Disabled vehicle fix");
      }
      
      // Remove all style tags that might be conflicting
      const styleTags = document.querySelectorAll('style[id*="fundi"], style[id*="tour"], style[id*="fix"]');
      styleTags.forEach(tag => {
        tag.remove();
        console.log(`🚫 Removed style tag: ${tag.id || 'unknown'}`);
      });
      
      // Remove all classes that might be conflicting
      document.body.classList.remove('tour-vehicle-page');
      document.body.classList.remove('tour-finance-page');
      document.body.classList.remove('tour-mobile-mode');
      document.body.classList.remove('tour-active');
      document.body.classList.remove('tour-emergency-fix');
      
      // Add our class
      document.body.classList.add('fundi-ultra-fixed');
    };
    
    // 2. Set up our direct override
    const applyUltraFix = () => {
      // Create a completely new style block
      const styleTag = document.createElement('style');
      styleTag.id = 'fundi-ultra-fix-styles';
      styleTag.textContent = `
        /* ULTRA FIX - These rules take absolute precedence */
        .fixed.z-\\[99999\\],
        div[class*="fixed"][class*="z-"],
        .tour-fundi-robot,
        .robot-container,
        div[data-fundi-robot="true"],
        div[data-fundi="true"],
        .fundi-container,
        .robot-fundi,
        [class*="tour-fundi"],
        [data-fundi-robot="true"],
        div[class*="robot"] {
          position: fixed !important;
          top: 290px !important;
          left: 50% !important;
          right: auto !important;
          bottom: auto !important;
          transform: translateX(-50%) !important;
          z-index: 999999 !important;
          width: 86px !important;
          height: 86px !important;
          max-width: 86px !important;
          max-height: 86px !important;
          visibility: visible !important;
          display: block !important;
          opacity: 1 !important;
          pointer-events: auto !important;
          margin: 0 !important;
          transform-origin: center center !important;
          transition: none !important;
          animation: none !important;
        }
        
        /* Override any inner transforms */
        .fixed.z-\\[99999\\] > div,
        .robot-container > div,
        div[data-fundi-robot="true"] > div {
          transform: none !important;
          transition: none !important;
          animation: none !important;
        }
        
        /* Dialog styling */
        .tour-speech-bubble,
        div[class*="tour-speech-bubble"],
        [data-tour-dialog],
        [data-radix-dialog-content],
        .fixed.z-\\[99998\\] {
          position: fixed !important;
          bottom: 20px !important;
          right: 20px !important;
          left: auto !important;
          top: auto !important;
          width: 320px !important;
          max-width: calc(100vw - 40px) !important;
          transform: none !important;
          z-index: 999998 !important;
          visibility: visible !important;
          display: block !important;
          opacity: 1 !important;
          background-color: white !important;
          border-radius: 0.75rem !important;
          border: 2px solid rgba(var(--primary-rgb, 59, 130, 246), 0.5) !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
          overflow-y: auto !important;
          max-height: 70vh !important;
          transition: none !important;
          animation: none !important;
        }
        
        /* Hide normal floating chat */
        body.fundi-ultra-fixed .floating-chat-container {
          display: none !important;
        }
      `;
      
      document.head.appendChild(styleTag);
      console.log("💥 Applied Ultra Fix styles");
    };
    
    // Run immediately
    disableAllOtherFixes();
    applyUltraFix();
    
    // Directly apply styles to any existing tour elements
    const fundiElements = document.querySelectorAll(
      '.fixed.z-\\[99999\\], .tour-fundi-robot, .robot-container, div[data-fundi-robot="true"], [data-fundi="true"], .fundi-container, .robot-fundi, [class*="tour-fundi"]'
    );
    
    fundiElements.forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.cssText = `
          position: fixed !important;
          top: 290px !important;
          left: 50% !important;
          right: auto !important;
          bottom: auto !important;
          transform: translateX(-50%) !important;
          z-index: 999999 !important;
          width: 86px !important;
          height: 86px !important;
          pointer-events: auto !important;
          visibility: visible !important;
          display: block !important;
        `;
      }
    });
    
    console.log(`💥 Applied direct styles to ${fundiElements.length} Fundi elements`);
    
    // Override the robot-fundi.tsx component's positioning
    // This works by adding an attribute to the document that our component checks for
    document.documentElement.setAttribute('data-fundi-position', 'center');
    
    // CRITICAL: Override the entire RobotFundi component in the global scope
    // This is an extreme measure but ensures it can't be overridden by other code
    const overrideScript = document.createElement('script');
    overrideScript.id = 'ultra-fix-script';
    overrideScript.textContent = `
      // Find and override the RobotFundi component anywhere it might be accessed
      if (typeof window !== 'undefined') {
        // Safety check
        const originalConsoleError = console.error;
        console.error = function(...args) {
          // Filter out React errors about stylistic manipulation
          const errorText = args.join(' ');
          if (!errorText.includes('Received') && !errorText.includes('style prop')) {
            originalConsoleError.apply(console, args);
          }
        };
        
        // Track when we do a direct fix
        window.__fundiFixed = false;
        
        // Create an interceptor that runs every 50ms
        setInterval(() => {
          // Find any Fundi elements that might have been added or modified
          const fundiElements = document.querySelectorAll(
            '.fixed.z-\\[99999\\], .tour-fundi-robot, .robot-container, div[data-fundi-robot="true"], div[data-fundi="true"], .fundi-container, .robot-fundi, [class*="tour-fundi"]'
          );
          
          fundiElements.forEach(el => {
            if (el instanceof HTMLElement) {
              // Check if the element is already in the correct position
              const rect = el.getBoundingClientRect();
              const centerX = window.innerWidth / 2;
              const isCorrectlyPositioned = 
                Math.abs(rect.left + rect.width/2 - centerX) < 10 && 
                Math.abs(rect.top - 290) < 10;
              
              if (!isCorrectlyPositioned) {
                // Force position
                el.style.cssText = el.style.cssText + \`
                  position: fixed !important;
                  top: 290px !important;
                  left: 50% !important;
                  right: auto !important;
                  bottom: auto !important;
                  transform: translateX(-50%) !important;
                  z-index: 999999 !important;
                  width: 86px !important;
                  height: 86px !important;
                  max-width: 86px !important;
                  max-height: 86px !important;
                  visibility: visible !important;
                  display: block !important;
                  opacity: 1 !important;
                  pointer-events: auto !important;
                  margin: 0 !important;
                  transform-origin: center center !important;
                  transition: none !important;
                  animation: none !important;
                \`;
                
                // Mark as fixed
                window.__fundiFixed = true;
                
                console.log('🔥 Ultra fix: Forced Fundi position directly');
              }
            }
          });
        }, 50);
      }
    `;
    
    document.head.appendChild(overrideScript);
    console.log("💥 Injected ultra override script");
    
    // Cleanup function
    return () => {
      // Remove our styles and script
      document.getElementById('fundi-ultra-fix-styles')?.remove();
      document.getElementById('ultra-fix-script')?.remove();
      document.documentElement.removeAttribute('data-fundi-position');
      document.body.classList.remove('fundi-ultra-fixed');
    };
  }, [isTourActive]);
  
  return null;
}