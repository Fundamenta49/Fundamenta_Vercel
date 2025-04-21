import React, { useState, useEffect, ReactNode } from 'react';

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
  const [startY, setStartY] = useState<number | null>(null);
  const [offsetY, setOffsetY] = useState(0);
  const [opacity, setOpacity] = useState(1);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === null) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    
    // Only allow swiping down
    if (diff > 0) {
      setOffsetY(diff);
      
      // Decrease opacity as user swipes down
      const newOpacity = Math.max(1 - (diff / (threshold * 3)), 0.5);
      setOpacity(newOpacity);
    }
  };

  const handleTouchEnd = () => {
    if (offsetY > threshold) {
      // Trigger close animation
      setOpacity(0);
      setTimeout(onClose, 250);
    } else {
      // Reset position
      setOffsetY(0);
      setOpacity(1);
    }
    setStartY(null);
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
        transition: offsetY === 0 ? 'transform 0.3s ease, opacity 0.3s ease' : 'none'
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