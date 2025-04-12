// EMERGENCY FIX for Interactive Courses dialog positioning

import React, { useEffect } from 'react';

/**
 * This component fixes dialog positioning issues for the Interactive Courses tour
 * by directly manipulating the DOM whenever a tour dialog appears
 */
export function InteractiveCoursesFix() {
  useEffect(() => {
    console.log('Interactive Courses Fix component mounted');
    
    // Function to fix any dialog elements
    const fixDialogPosition = () => {
      // Find all tour dialogs in the document
      const dialogElements = document.querySelectorAll('[data-tour-dialog], [data-radix-dialog-content]');
      
      if (dialogElements.length > 0) {
        console.log(`Found ${dialogElements.length} tour dialogs to fix`);
        
        dialogElements.forEach((dialog) => {
          const dialogEl = dialog as HTMLElement;
          
          // Apply critical fixes to ensure dialog stays on screen
          dialogEl.style.position = 'fixed';
          dialogEl.style.bottom = '10px';
          dialogEl.style.right = '10px';
          dialogEl.style.left = 'auto';
          dialogEl.style.top = 'auto';
          dialogEl.style.zIndex = '999999';
          dialogEl.style.maxWidth = '90vw';
          dialogEl.style.width = '320px';
          dialogEl.style.transform = 'none';
          dialogEl.style.overflow = 'auto';
          dialogEl.style.maxHeight = '80vh';
          
          // Fix any buttons to ensure they fit
          const buttons = dialogEl.querySelectorAll('button');
          buttons.forEach(button => {
            button.style.fontSize = '12px';
            button.style.padding = '0 8px';
            button.style.minWidth = '40px';
            button.style.height = '28px';
            button.style.display = 'inline-flex';
            button.style.margin = '3px';
            button.style.whiteSpace = 'nowrap';
          });
          
          // Fix the dialog footer to wrap buttons if needed
          const footer = dialogEl.querySelector('[class*="DialogFooter"]');
          if (footer && footer instanceof HTMLElement) {
            footer.style.display = 'flex';
            footer.style.flexWrap = 'wrap';
            footer.style.gap = '5px';
            footer.style.justifyContent = 'space-between';
          }
        });
      }
    };
    
    // Run fix immediately to catch any existing dialogs
    fixDialogPosition();
    
    // Set up mutation observer to catch any new dialogs that appear
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          // Check if any new nodes include tour dialogs
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node instanceof HTMLElement) {
              if (node.getAttribute('data-tour-dialog') !== null || 
                  node.getAttribute('data-radix-dialog-content') !== null ||
                  node.querySelector('[data-tour-dialog]') !== null ||
                  node.querySelector('[data-radix-dialog-content]') !== null) {
                // Run fix after a short delay to ensure DOM is fully updated
                setTimeout(fixDialogPosition, 50);
                return;
              }
            }
          }
        }
      });
    });
    
    // Start watching the document for changes
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    // Cleanup function to disconnect observer
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // This is a non-visual component
  return null;
}

export default InteractiveCoursesFix;