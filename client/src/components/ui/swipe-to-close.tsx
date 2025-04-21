import React, { useState, useRef, ReactNode } from 'react';

interface SwipeToCloseProps {
  children: ReactNode;
  onClose: () => void;
  threshold?: number;
  showIndicator?: boolean;
}

export default function SwipeToClose({
  children,
  onClose,
  threshold = 100,
  showIndicator = true
}: SwipeToCloseProps) {
  const [offsetY, setOffsetY] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [isClosing, setIsClosing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const startYRef = useRef<number | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isClosing) return;
    startYRef.current = e.touches[0].clientY;
    
    // Cancel any return animations
    setIsAnimating(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startYRef.current === null || isClosing) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;
    
    // Only allow swiping down
    if (diff > 0) {
      // Add resistance to make it feel more natural (less resistance for better responsiveness)
      const resistance = 0.6;
      const newOffset = diff * resistance;
      setOffsetY(newOffset);
      
      // Decrease opacity as user swipes down
      const newOpacity = Math.max(0.5, 1 - (newOffset / (threshold * 3)));
      setOpacity(newOpacity);
      
      // If we hit the threshold while dragging, start closing immediately
      if (newOffset > threshold) {
        triggerClose();
      }
    }
  };

  const handleTouchEnd = () => {
    if (isClosing) return;
    
    if (offsetY > threshold) {
      triggerClose();
    } else {
      // Return to original position with animation
      setIsAnimating(true);
      setOffsetY(0);
      setOpacity(1);
    }
    
    startYRef.current = null;
  };
  
  const triggerClose = () => {
    if (isClosing) return;
    
    setIsClosing(true);
    
    // Animate out
    setOffsetY(window.innerHeight);
    setOpacity(0);
    
    // Call onClose after animation
    setTimeout(onClose, 150);
  };

  return (
    <div 
      className="w-full h-full" 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateY(${offsetY}px)`,
        opacity: opacity,
        transition: (isAnimating || isClosing) ? 'transform 0.15s ease-out, opacity 0.15s ease-out' : 'none',
        willChange: 'transform, opacity'
      }}
    >
      {showIndicator && (
        <div className="sm:hidden w-full flex flex-col items-center sticky top-0 z-20 py-2 bg-white border-b border-gray-100">
          <div className="w-12 h-1 rounded-full bg-gray-300" />
          <p className="text-xs text-gray-500 mt-1">Swipe down to close</p>
        </div>
      )}
      {children}
    </div>
  );
}