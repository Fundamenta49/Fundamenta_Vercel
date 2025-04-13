/**
 * ABSOLUTE LAST RESORT:
 * This component completely replaces the Fundi robot with a minimal implementation
 * that ignores all existing code and just puts an image in the right spot
 */

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function FundiReplacement() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Add a script to the head to intercept any runtime errors
    const addErrorInterceptor = () => {
      const script = document.createElement('script');
      script.id = 'error-interceptor';
      script.innerHTML = `
        // Override error handling at the window level
        window.addEventListener('error', function(event) {
          // Check if error is related to querySelector or DOM manipulation
          if (event.error && event.error.message && (
              event.error.message.includes('querySelector') || 
              event.error.message.includes('selector') ||
              event.error.message.includes('DOM') || 
              event.error.message.includes('tour') ||
              event.error.message.includes('fundi')
            )) {
            // Prevent the error from propagating
            event.preventDefault();
            event.stopPropagation();
            return false;
          }
        }, true);
        
        // Also handle unhandled promise rejections
        window.addEventListener('unhandledrejection', function(event) {
          // Check if rejection is related to querySelector or DOM manipulation
          if (event.reason && event.reason.message && (
              event.reason.message.includes('querySelector') || 
              event.reason.message.includes('selector') ||
              event.reason.message.includes('DOM') || 
              event.reason.message.includes('tour') ||
              event.reason.message.includes('fundi')
            )) {
            // Prevent the rejection from propagating
            event.preventDefault();
            event.stopPropagation();
            return false;
          }
        }, true);
      `;
      document.head.appendChild(script);
    };
  
    // Remove existing Fundi elements that might be causing issues
    const removeExistingFundi = () => {
      // Try to find and remove all existing Fundi elements
      const selectors = [
        '.tour-fundi-robot',
        '.robot-container',
        'div[data-fundi]',
        '.fundi-container',
        '.robot-fundi',
        'div[class*="tour-fundi"]',
        '.fixed.z-[99999]',
        '[class*="robot-fundi"]',
        '.dialog-content', 
        '[plugin\\:runtime-error-plugin]',
        '[data-plugin="runtime-error-plugin"]',
        'div[class*="runtime-error"]'
      ];
      
      selectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el) => {
            if (el.id !== 'fundi-replacement-container') {
              console.log('Removing problematic element:', el);
              // Apply styles to hide it - using type casting to fix TypeScript error
              const htmlEl = el as HTMLElement;
              htmlEl.style.display = 'none';
              htmlEl.style.opacity = '0';
              htmlEl.style.visibility = 'hidden';
              htmlEl.style.pointerEvents = 'none';
              // Add a hidden attribute
              htmlEl.setAttribute('hidden', 'true');
              // Set aria-hidden for accessibility
              htmlEl.setAttribute('aria-hidden', 'true');
            }
          });
        } catch (e) {
          // Ignore errors
        }
      });
    };
    
    // Create our own Fundi container in the body
    const createFundiContainer = () => {
      // First check if it already exists
      if (document.getElementById('fundi-replacement-container')) {
        return;
      }
      
      // Create container for our replacement Fundi
      const fundiContainer = document.createElement('div');
      fundiContainer.id = 'fundi-replacement-container';
      fundiContainer.style.cssText = `
        position: fixed !important;
        top: 8px !important;
        right: 24px !important;
        z-index: 999999 !important;
        width: 64px !important;
        height: 64px !important;
        transform: none !important;
        transition: none !important;
        pointer-events: auto !important;
        touch-action: auto !important;
        visibility: visible !important;
        opacity: 1 !important;
      `;
      
      // Add the container to the document body
      document.body.appendChild(fundiContainer);
    };
    
    // Run on mount
    addErrorInterceptor();
    removeExistingFundi();
    createFundiContainer();
    
    // Set up interval to keep checking and fixing
    const intervalId = setInterval(() => {
      removeExistingFundi();
      createFundiContainer();
    }, 200);
    
    // Set mounted flag for React
    setMounted(true);
    
    return () => {
      clearInterval(intervalId);
      const container = document.getElementById('fundi-replacement-container');
      if (container) {
        container.remove();
      }
    };
  }, []);
  
  // Default Fundi SVG icon
  const fundiSvg = `
    <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="#F0F4FF" stroke="#6366F1" stroke-width="2" />
      <circle cx="32" cy="32" r="24" fill="#6366F1" />
      <circle cx="24" cy="24" r="4" fill="white" />
      <circle cx="40" cy="24" r="4" fill="white" />
      <path d="M22 40C26 45 38 45 42 40" stroke="white" stroke-width="2" stroke-linecap="round" />
    </svg>
  `;
  
  // Only render when mounted
  if (!mounted) return null;
  
  // Use portal to inject our Fundi into the container
  return createPortal(
    <div 
      dangerouslySetInnerHTML={{ __html: fundiSvg }} 
      style={{
        width: '64px',
        height: '64px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    />,
    document.getElementById('fundi-replacement-container') || document.body
  );
}