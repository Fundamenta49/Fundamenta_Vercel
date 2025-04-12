/**
 * LIGHTWEIGHT MEGA FIX: A definitive solution for Fundi positioning issues
 * This approach uses a static CSS style sheet that takes precedence
 * over dynamic styles without continuous monitoring
 */

import { useEffect } from 'react';
import { useTour } from '@/contexts/tour-context';

export default function FundiMegaFix() {
  const { isTourActive } = useTour();
  
  useEffect(() => {
    if (!isTourActive) return;
    
    console.log("🔧 MEGA FIX: Enforcing Fundi positioning - applying one-time CSS fix");
    
    // Add a style tag with !important rules that will override everything else
    let styleTag = document.getElementById('fundi-mega-fix-styles');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'fundi-mega-fix-styles';
      document.head.appendChild(styleTag);
    }
    
    // The CSS here uses !important on everything to override all other styles
    styleTag.innerHTML = `
      /* Target all possible Fundi containers with extremely specific selectors */
      .fixed.z-\\[99999\\],
      div[class*="fixed"][class*="z-"],
      .tour-fundi-robot,
      .robot-container,
      div[data-fundi-robot="true"],
      div[data-fundi="true"],
      .fundi-container,
      .robot-fundi,
      [class*="tour-fundi"] {
        position: fixed !important;
        top: 290px !important; /* Position in the center of the screen vertically */
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
      }
      
      /* Override any motion.div transforms */
      .fixed.z-\\[99999\\] > div {
        transform: none !important;
      }
      
      /* Style for speech bubble position */
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
      }
      
      /* Fix buttons in the tour dialog */
      [data-tour-dialog] button,
      .tour-speech-bubble button,
      .fixed.z-\\[99998\\] button {
        display: inline-flex !important;
        margin: 4px !important;
        padding: 0 8px !important;
        font-size: 12px !important;
        height: 28px !important;
        min-width: 0 !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
      }
      
      /* Fix dialog footer layout */
      [data-tour-dialog] div[class*="flex"][class*="justify-between"],
      .tour-speech-bubble div[class*="flex"][class*="justify-between"],
      .fixed.z-\\[99998\\] div[class*="flex"][class*="justify-between"] {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 5px !important;
        justify-content: space-between !important;
      }
      
      /* Override any animations */
      .fixed.z-\\[99999\\],
      .tour-fundi-robot,
      .robot-container,
      div[data-fundi-robot="true"],
      .fixed.z-\\[99998\\],
      .tour-speech-bubble {
        animation: none !important;
        transition: none !important;
      }
      
      /* Hide the normal floating chat when tour is active */
      body.tour-active .floating-chat-container {
        display: none !important;
      }
    `;
    
    // Do a one-time direct application of styles to existing elements
    // for immediate effect without continuous monitoring
    const fundiElements = document.querySelectorAll(
      '.fixed.z-\\[99999\\], .tour-fundi-robot, .robot-container, div[data-fundi-robot="true"], div[data-fundi="true"], .fundi-container, .robot-fundi, [class*="tour-fundi"]'
    );
    
    fundiElements.forEach(el => {
      if (el instanceof HTMLElement) {
        // Directly set position properties only
        el.style.position = 'fixed';
        el.style.top = '290px';
        el.style.left = '50%';
        el.style.transform = 'translateX(-50%)';
        el.style.zIndex = '999999';
        
        // Add a data attribute for targeting
        el.setAttribute('data-fundi-mega-fixed', 'true');
      }
    });
    
    // Similarly, apply direct styles to dialog elements - one time only
    const dialogElements = document.querySelectorAll(
      '.tour-speech-bubble, div[class*="tour-speech-bubble"], [data-tour-dialog], [data-radix-dialog-content], .fixed.z-\\[99998\\]'
    );
    
    dialogElements.forEach(el => {
      if (el instanceof HTMLElement) {
        // Apply only the most critical positioning styles
        el.style.position = 'fixed';
        el.style.bottom = '20px';
        el.style.right = '20px';
        el.style.transform = 'none';
        el.style.zIndex = '999998';
        
        // Add a data attribute for targeting
        el.setAttribute('data-dialog-mega-fixed', 'true');
      }
    });
    
    // Mark body with a special class for our CSS targeting
    document.body.classList.add('fundi-mega-fixed');
    
    // Cleanup function
    return () => {
      if (styleTag) {
        styleTag.remove();
      }
      document.body.classList.remove('fundi-mega-fixed');
    };
  }, [isTourActive]);
  
  return null; // Non-visual component
}