/**
 * Simple Fixed Fundi Component
 * 
 * This is an extremely simplified Fundi component that:
 * 1. Uses no external dependencies or complex tour logic
 * 2. Has a fixed position in the top-right corner (not drag-and-drop)
 * 3. Does not attempt to display complex tour steps or animations
 * 
 * This is meant as a temporary fix until a proper tour system can be implemented
 */

import React, { useEffect } from 'react';

export default function SimpleFundi() {
  useEffect(() => {
    // Clean up any existing Fundi elements that might be causing issues
    const cleanup = () => {
      try {
        // Add a simple style to hide problematic elements
        const style = document.createElement('style');
        style.textContent = `
          .tour-fundi-robot, 
          .robot-container, 
          div[data-fundi="true"], 
          .fundi-container, 
          .robot-fundi, 
          [class*="tour-fundi"],
          .fixed.z-[99999] {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
          }
        `;
        document.head.appendChild(style);
        
        return () => {
          style.remove();
        };
      } catch (e) {
        console.error('Error in SimpleFundi cleanup:', e);
      }
    };
    
    return cleanup();
  }, []);
  
  return (
    <div
      style={{
        position: 'fixed',
        top: '16px',
        right: '24px',
        width: '64px',
        height: '64px',
        zIndex: 9999,
        borderRadius: '50%',
        backgroundColor: '#f5f7ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        border: '2px solid #6366F1',
        cursor: 'pointer',
      }}
      aria-label="Fundi Assistant"
      role="button"
    >
      <div style={{ width: '48px', height: '48px' }}>
        <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="24" fill="#6366F1" />
          <circle cx="24" cy="24" r="4" fill="white" />
          <circle cx="40" cy="24" r="4" fill="white" />
          <path d="M22 40C26 45 38 45 42 40" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}