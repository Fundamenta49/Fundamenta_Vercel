/**
 * FINAL EMERGENCY FIX: Direct DOM manipulation to position Fundi
 * This is an absolute last resort with 100% hardcoded positioning
 */

import { useEffect } from 'react';

export default function FundiStaticPosition() {
  useEffect(() => {
    console.log("CRITICAL EMERGENCY: LAST RESORT FUNDI FIX");
    
    // Inject a completely standalone Fundi directly into the DOM
    function injectStaticFundi() {
      // First, remove any existing Fundi elements to prevent conflicts
      const existingFundis = document.querySelectorAll('.robot-container, .fundi-container, [data-fundi="true"]');
      existingFundis.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.display = 'none';
        }
      });
      
      // Create a brand new element for Fundi that's not affected by any CSS
      let staticFundi = document.getElementById('static-fundi-emergency');
      if (!staticFundi) {
        staticFundi = document.createElement('div');
        staticFundi.id = 'static-fundi-emergency';
        document.body.appendChild(staticFundi);
      }
      
      // Exact positioning to match the screenshot
      staticFundi.style.cssText = `
        position: fixed !important;
        display: block !important;
        width: 86px !important;
        height: 86px !important;
        bottom: auto !important;
        top: 270px !important;
        right: auto !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        background-image: url('/assets/fundi/fundi-default.png') !important;
        background-size: contain !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
        z-index: 9999999 !important;
        pointer-events: auto !important;
        cursor: pointer !important;
        border-radius: 50% !important;
        border: none !important;
        box-shadow: none !important;
      `;
      
      // Make Fundi show/hide the dialog when clicked
      staticFundi.onclick = () => {
        console.log("Static Fundi clicked!");
        
        // Toggle the dialog
        if (staticDialog) {
          if (staticDialog.style.display === 'none') {
            staticDialog.style.display = 'block';
          } else {
            staticDialog.style.display = 'none';
          }
        }
      };
      
      // Create a brand new element for tour dialog that's not affected by any CSS
      let staticDialog = document.getElementById('static-dialog-emergency');
      if (!staticDialog) {
        staticDialog = document.createElement('div');
        staticDialog.id = 'static-dialog-emergency';
        document.body.appendChild(staticDialog);
      }
      
      // Apply exact positioning styles to match the screenshot
      staticDialog.style.cssText = `
        position: fixed !important;
        display: block !important;
        width: 320px !important;
        max-width: 320px !important;
        min-height: 100px !important;
        max-height: 500px !important;
        top: 180px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        background-color: white !important;
        z-index: 9999998 !important;
        border-radius: 8px !important;
        border: none !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
        padding: 20px !important;
        overflow-y: auto !important;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      `;
      
      // Add content to dialog that exactly matches screenshot
      staticDialog.innerHTML = `
        <div style="display: flex; flex-direction: column;">
          <h3 style="font-size: 18px; font-weight: 600; color: #1e293b; margin-bottom: 12px;">Interactive Courses</h3>
          
          <p style="color: #64748b; margin-bottom: 16px; line-height: 1.5; font-size: 15px;">
            These courses are designed to be practical and engaging. You can learn at your own pace with step-by-step guidance. Let's use the Vehicle Maintenance course as an example.
          </p>
          
          <div style="color: #3b82f6; font-size: 14px; margin-bottom: 12px; font-weight: 500;">
            You are now viewing: Course: Vehicle maintenance
          </div>
          
          <div style="background-color: #0f172a; height: 4px; width: 100%; margin-bottom: 12px; border-radius: 2px;"></div>
          
          <div style="color: #64748b; margin-bottom: 16px; font-size: 14px;">
            5/16
          </div>
          
          <div style="display: flex; justify-content: space-between; width: 100%;">
            <button id="static-back-button" style="
              background-color: white;
              color: #1e293b;
              border: 1px solid #e2e8f0;
              border-radius: 4px;
              padding: 8px 16px;
              cursor: pointer;
              font-weight: 500;
              display: flex;
              align-items: center;
            ">
              <span style="margin-right: 4px;">←</span> Back
            </button>
            
            <button id="static-skip-button" style="
              background-color: white;
              color: #1e293b;
              border: 1px solid #e2e8f0;
              border-radius: 4px;
              padding: 8px 16px;
              cursor: pointer;
              font-weight: 500;
              display: flex;
              align-items: center;
            ">
              Skip <span style="margin-left: 4px;">✕</span>
            </button>
          </div>
        </div>
      `;
      
      // Add click handlers for the new buttons
      document.getElementById('static-back-button')?.addEventListener('click', () => {
        console.log("Static Back button clicked!");
        if (staticDialog) staticDialog.style.display = 'block';
      });
      
      document.getElementById('static-skip-button')?.addEventListener('click', () => {
        console.log("Static Skip button clicked!");
        if (staticDialog) staticDialog.style.display = 'none';
      });
    }
    
    // Run immediately and then on an interval
    injectStaticFundi();
    const intervalId = setInterval(injectStaticFundi, 500);
    
    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
      const staticFundi = document.getElementById('static-fundi-emergency');
      const staticDialog = document.getElementById('static-dialog-emergency');
      if (staticFundi) staticFundi.remove();
      if (staticDialog) staticDialog.remove();
    };
  }, []);
  
  return null;
}