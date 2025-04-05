import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAIEventStore } from '@/lib/ai-event-system';

interface RobotFundiProps {
  speaking?: boolean;
  thinking?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  category?: string;
  interactive?: boolean;
  emotion?: string;
  onOpen?: () => void;
  onInteraction?: () => void;
}

export default function RobotFundi({
  speaking = false,
  thinking = false,
  size = 'md',
  category = 'general',
  interactive = true,
  emotion = 'neutral',
  onOpen,
  onInteraction
}: RobotFundiProps) {
  
  const color = '#6366f1'; // Default color
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Fundi clicked - SIMPLE VERSION");
    
    if (onOpen) {
      onOpen();
    }
    
    if (onInteraction) {
      onInteraction();
    }
    
    // Also dispatch the custom event
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('forceFundiOpen');
      window.dispatchEvent(event);
    }
  };
  
  return (
    <div 
      className={cn(
        "fixed", 
        "cursor-pointer",
        size === 'xl' ? 'w-32 h-32' : 
        size === 'lg' ? 'w-28 h-28' : 
        size === 'md' ? 'w-24 h-24' : 
        size === 'sm' ? 'w-20 h-20' : 
        'w-16 h-16'
      )}
      style={{
        position: 'fixed',
        top: '8px',
        right: '24px',
        zIndex: 9999,
      }}
      onClick={handleClick}
    >
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Simple robot face */}
        <circle cx="50" cy="50" r="45" fill="#e6e6e6" />
        <circle cx="35" cy="40" r="8" fill={color} />
        <circle cx="65" cy="40" r="8" fill={color} />
        <path d="M35,70 Q50,80 65,70" stroke={color} strokeWidth="4" fill="none" />
      </svg>
    </div>
  );
}
