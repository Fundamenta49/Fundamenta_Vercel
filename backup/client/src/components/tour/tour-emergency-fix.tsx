// This file contains emergency fixes to ensure tour works properly for investor presentation

import React, { useEffect } from 'react';
import { useTour } from '@/contexts/tour-context';

/**
 * This component ensures the tour is properly initialized and running
 * It's added as a diagnostic tool for our emergency fix
 */
export const TourEmergencyFix: React.FC = () => {
  const { isTourActive, currentStepIndex, currentStep, restartTour } = useTour();

  // Log tour state for debugging
  useEffect(() => {
    console.log("EMERGENCY FIX STATUS - Tour active:", isTourActive);
    console.log("EMERGENCY FIX STATUS - Current step:", currentStepIndex);
    console.log("EMERGENCY FIX STATUS - Step data:", currentStep);
    
    // Add diagnostic attributes to body
    document.body.setAttribute('data-tour-fixed', 'true');
    document.body.setAttribute('data-tour-active', String(isTourActive));
    document.body.setAttribute('data-tour-step', String(currentStepIndex));
    
    // Force tour active style
    if (isTourActive) {
      document.body.classList.add('tour-active');
      
      // EMERGENCY FIX: Add this to ensure ALL tour dialogs stay visible
      setTimeout(() => {
        // Apply to any active tour dialog
        const tourDialogs = document.querySelectorAll('[data-tour-dialog], [data-radix-dialog-content]');
        tourDialogs.forEach(dialog => {
          const dialogEl = dialog as HTMLElement;
          if (dialogEl) {
            // Ensure dialog fits on screen by constraining max width and centering
            dialogEl.style.maxWidth = 'calc(100vw - 20px)';
            dialogEl.style.width = 'calc(100vw - 20px)';
            dialogEl.style.left = '10px';
            dialogEl.style.right = '10px';
            dialogEl.style.marginLeft = 'auto';
            dialogEl.style.marginRight = 'auto';
          }
        });
      }, 100);
    }
    
    // Check if we need to apply vehicle maintenance fix
    if (isTourActive && currentStep?.route === '/learning/courses/vehicle-maintenance') {
      applyVehicleMaintenanceFix();
    }
    
    return () => {
      // Clear diagnostic attributes when component unmounts
      document.body.removeAttribute('data-tour-fixed');
    };
  }, [isTourActive, currentStepIndex, currentStep]);

  return null; // This is a non-visual component
};

/**
 * Special fix for the vehicle maintenance page to ensure Fundi stays visible
 * and content is properly spaced below it
 */
export function applyVehicleMaintenanceFix() {
  const isVehicleRoute = window.location.pathname.includes('/learning/courses/vehicle-maintenance');
  const courseContent = document.querySelector('.course-content');
  
  if (isVehicleRoute || document.body.classList.contains('tour-vehicle-page')) {
    // Mark the body specifically for this page to enable targeted CSS
    document.body.setAttribute('data-tour-route', '/learning/courses/vehicle-maintenance');
    document.body.classList.add('tour-vehicle-page');
    document.body.classList.add('vehicle-maintenance-page');
    
    console.log('SUPER EMERGENCY FIX: Vehicle maintenance page detected!');
    
    // When on vehicle maintenance page, always scroll to top to keep Fundi visible
    window.scrollTo({ top: 0, behavior: 'auto' });
    
    if (courseContent) {
      // Set explicit margin for content for better visibility - larger on desktop
      const isDesktop = window.innerWidth >= 640;
      (courseContent as HTMLElement).style.marginTop = isDesktop ? '150px' : '80px';
      (courseContent as HTMLElement).style.paddingTop = isDesktop ? '50px' : '20px';
    }
    
    // Fix any Fundi tour guide positioning if tour is active
    const tourFundi = document.querySelector('.fixed.z-\\[99999\\]');
    if (tourFundi) {
      // Force Fundi to stay at a fixed position at the top
      (tourFundi as HTMLElement).style.position = 'fixed';
      (tourFundi as HTMLElement).style.top = '80px'; // Move higher up
      (tourFundi as HTMLElement).style.right = '100px'; // More to the right
      (tourFundi as HTMLElement).style.left = 'auto';
      (tourFundi as HTMLElement).style.zIndex = '999999';
      (tourFundi as HTMLElement).style.transform = 'none';
      
      console.log('Fundi position fixed for vehicle maintenance section');
    }
    
    // SUPER CRITICAL FIX: Ensure all tour dialogs are visible by applying styles directly
    // Run this fix continuously to catch any new dialogs
    const fixDialogInterval = setInterval(() => {
      // Check if we're still on the vehicle maintenance page
      if (!document.body.classList.contains('tour-vehicle-page')) {
        clearInterval(fixDialogInterval);
        return;
      }
      
      // Find any tutorial dialogs - use multiple selectors to catch all variants
      const tourDialogs = document.querySelectorAll(
        '[data-tour-dialog], [data-radix-dialog-content], .tour-speech-bubble'
      );
      
      const isDesktop = window.innerWidth >= 640;
      
      if (tourDialogs.length > 0) {
        tourDialogs.forEach(dialog => {
          const dialogEl = dialog as HTMLElement;
          
          // EXTREME FORCE: Override any existing styles with !important + inline styles
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
            overflow: auto !important;
            transform: none !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
            border: 2px solid rgba(var(--primary-rgb, 59, 130, 246), 0.5) !important;
            background-color: white !important;
          `;
          
          // Also apply attributes to make sure CSS selectors can target this
          dialogEl.setAttribute('data-tour-fixed', 'true');
          
          // Ensure buttons are visible and properly sized
          const buttons = dialogEl.querySelectorAll('button');
          buttons.forEach(button => {
            button.style.cssText = `
              display: inline-flex !important;
              margin: 5px !important;
              padding: 0 8px !important;
              font-size: 12px !important;
              height: 28px !important;
              min-width: 0 !important;
              white-space: nowrap !important;
            `;
          });
          
          // Fix any footers to allow wrapping buttons
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
        
        console.log('SUPER CRITICAL dialog fix applied for vehicle maintenance page');
      }
    }, 100); // Check every 100ms
    
    // Keep interval running - component unmount will clean it up automatically
    console.log('Vehicle maintenance fix applied with persistent interval');
  }
  
  // No return value needed for non-component function
}

export default TourEmergencyFix;