/**
 * EMERGENCY FIX: Direct DOM manipulation to position Fundi
 * This is a last resort fix to ensure Fundi is visible on the screen
 */

import { useEffect } from 'react';

export default function FundiStaticPosition() {
  useEffect(() => {
    console.log("APPLYING EMERGENCY FUNDI FIX");
    
    // Inject a completely standalone Fundi directly into the DOM
    function injectStaticFundi() {
      // Create a brand new element for Fundi that's not affected by any CSS
      let staticFundi = document.getElementById('static-fundi-emergency');
      if (!staticFundi) {
        staticFundi = document.createElement('div');
        staticFundi.id = 'static-fundi-emergency';
        document.body.appendChild(staticFundi);
      }
      
      // Position Fundi in the top right corner
      staticFundi.style.cssText = `
        position: fixed !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 96px !important;
        height: 96px !important;
        bottom: auto !important;
        top: 8px !important;
        right: 24px !important;
        left: auto !important;
        z-index: 9999999 !important;
        cursor: pointer !important;
        border-radius: 50% !important;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
        background-color: rgba(255, 255, 255, 0.9) !important;
        animation: pulseAnimation 2s infinite ease-in-out !important;
        pointer-events: auto !important;
      `;
      
      // Define a pulsing animation
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        @keyframes pulseAnimation {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `;
      document.head.appendChild(styleElement);
      
      // Add inline SVG directly to ensure it works
      staticFundi.innerHTML = `
        <svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width: 80px; height: 80px; overflow: visible;">
          <!-- Robot head -->
          <rect x="25" y="20" width="50" height="40" rx="10" fill="#e6e6e6" />
          <rect x="30" y="30" width="40" height="20" rx="5" fill="#222" />
          
          <!-- Eyes -->
          <circle cx="40" cy="40" r="5" fill="#6366f1" />
          <circle cx="60" cy="40" r="5" fill="#6366f1" />
          
          <!-- Antenna -->
          <rect x="45" y="10" width="10" height="10" rx="5" fill="#22c55e" />
          <line x1="50" y1="20" x2="50" y2="10" stroke="#888" stroke-width="2" />
          
          <!-- Mouth -->
          <path d="M35,55 Q50,65 65,55" stroke="#222" stroke-width="2" fill="none" />
          
          <!-- Body -->
          <rect x="35" y="60" width="30" height="25" rx="5" fill="#e6e6e6" />
          
          <!-- Control panel on body -->
          <rect x="40" y="65" width="20" height="15" rx="2" fill="#444" />
          
          <!-- Buttons on control panel -->
          <circle cx="45" cy="70" r="2" fill="#f59e0b" />
          <circle cx="55" cy="70" r="2" fill="#ef4444" />
          <circle cx="45" cy="75" r="2" fill="#3b82f6" />
          <circle cx="55" cy="75" r="2" fill="#a855f7" />
          
          <!-- Arms -->
          <rect x="25" y="65" width="10" height="20" rx="5" fill="#d1d1d1" />
          <rect x="65" y="65" width="10" height="20" rx="5" fill="#d1d1d1" />
          
          <!-- Legs -->
          <rect x="38" y="85" width="10" height="10" rx="3" fill="#d1d1d1" />
          <rect x="52" y="85" width="10" height="10" rx="3" fill="#d1d1d1" />
        </svg>
      `;
      
      // Add click event to open chat
      staticFundi.addEventListener('click', function() {
        // Dispatch an event to open the chat interface
        const openFundiEvent = new CustomEvent('forceFundiOpen', {
          detail: { position: { x: 0, y: 0 } }
        });
        window.dispatchEvent(openFundiEvent);
        console.log('Static Fundi clicked - dispatched forceFundiOpen event');
      });
    }
    
    // Execute the fix immediately
    injectStaticFundi();
    
    // Also run the fix after a delay to ensure it works after React has fully rendered
    setTimeout(injectStaticFundi, 1000);
    
    // Set up a backup interval to periodically check and fix Fundi if needed
    const intervalId = setInterval(injectStaticFundi, 5000);
    
    // Clean up on unmount
    return () => {
      clearInterval(intervalId);
      const staticFundi = document.getElementById('static-fundi-emergency');
      if (staticFundi) {
        staticFundi.remove();
      }
    };
  }, []);
  
  // This component doesn't render anything visible itself
  return null;
}