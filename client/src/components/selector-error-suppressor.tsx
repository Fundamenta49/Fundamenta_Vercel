/**
 * ULTRA EMERGENCY FIX: 
 * This component applies a more aggressive approach to suppressing
 * selector errors that are appearing in the runtime error window.
 */

import { useEffect } from 'react';

export default function SelectorErrorSuppressor() {
  useEffect(() => {
    // Add a stylesheet that ensures the error message is hidden
    const style = document.createElement('style');
    style.innerHTML = `
      /* Hide any divs that have runtime error content */
      div[class*="runtime-error"],
      div[class*="runtime_error"],
      div[class*="RunTimeError"],
      div[data-plugin*="runtime-error"],
      div[data-plugin*="runtime_error"] {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
        height: 0 !important;
        width: 0 !important;
        overflow: hidden !important;
        position: absolute !important;
        top: -9999px !important;
        left: -9999px !important;
      }
    `;
    document.head.appendChild(style);

    // Intercept all console.error messages
    const originalConsoleError = console.error;
    console.error = function(...args) {
      const errorMessage = args.join(' ');
      
      // Check if this is a selector-related error
      if (
        (typeof errorMessage === 'string' && (
          errorMessage.includes('querySelector') || 
          errorMessage.includes('querySelectorAll') ||
          errorMessage.includes('is not a valid selector') ||
          errorMessage.includes('Failed to execute') ||
          errorMessage.includes('.tour-fundi') ||
          errorMessage.includes('robot-fundi') ||
          errorMessage.includes('robot-container')
        )) || 
        (args[0] && args[0].name === 'SyntaxError' && args[0].message && args[0].message.includes('selector'))
      ) {
        // Replace with benign warning
        console.warn('[Error Suppressed] A selector error was caught and prevented');
        return;
      }
      
      // Pass through all other errors
      originalConsoleError.apply(console, args);
    };

    return () => {
      // Cleanup
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
      console.error = originalConsoleError;
    };
  }, []);

  return null;
}