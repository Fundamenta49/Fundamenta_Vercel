import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTour } from '@/contexts/tour-context';

/**
 * Emergency component to force tour restart for investor presentation
 */
export const ForceRestartTour: React.FC = () => {
  const { isTourActive, restartTour } = useTour();
  const [isVisible, setIsVisible] = useState(false);
  
  // Check if tour is not active after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isTourActive) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [isTourActive]);
  
  if (!isVisible) return null;
  
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 99999,
        background: 'white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid rgba(0,0,0,0.1)'
      }}
    >
      <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
        Tour Helper
      </h3>
      <p style={{ margin: '0 0 15px 0', fontSize: '14px', maxWidth: '220px' }}>
        If the tour isn't starting automatically, you can click the button below:
      </p>
      <Button
        onClick={() => {
          // Force restart tour
          document.body.classList.add('tour-active');
          localStorage.removeItem('hasSeenTour');
          restartTour();
          setIsVisible(false);
        }}
      >
        Start Tour
      </Button>
    </div>
  );
};

export default ForceRestartTour;